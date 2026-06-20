/**
 * Wax Me Too — Scheduled Jobs
 *
 * Runs a cron job on the 1st of every month at 9:00 AM Mountain Time
 * to automatically draw the monthly giveaway winner.
 *
 * The cron state (enabled/disabled, last run, last result) is persisted
 * in memory and exposed via the giveaway admin router.
 */

import cron from "node-cron";
import {
  getAllConfirmedEntries,
  getWinnerForMonth,
  recordWinner,
  markWinnerNotified,
} from "./giveawayDb";
import { sendWinnerEmail } from "./giveawayEmail";
import { notifyOwner } from "./_core/notification";

export interface SchedulerStatus {
  enabled: boolean;
  lastRunAt: Date | null;
  lastRunResult: string | null;
  nextRunDescription: string;
}

let _status: SchedulerStatus = {
  enabled: true,
  lastRunAt: null,
  lastRunResult: null,
  nextRunDescription: "1st of every month at 9:00 AM Mountain Time",
};

let _task: ReturnType<typeof cron.schedule> | null = null;

/** Returns the current scheduler status (for admin UI). */
export function getSchedulerStatus(): SchedulerStatus {
  return { ..._status };
}

/** Enable or disable the auto-draw cron job. */
export function setSchedulerEnabled(enabled: boolean): void {
  _status.enabled = enabled;
  if (enabled && !_task) {
    startScheduler();
  } else if (!enabled && _task) {
    _task.stop();
    _task = null;
    console.log("[Scheduler] Monthly giveaway draw disabled.");
  }
}

/** Core draw logic — shared between cron and manual triggers. */
export async function runMonthlyDraw(month?: string): Promise<{
  success: boolean;
  reason: "drawn" | "already_drawn" | "no_entries" | "error";
  winner?: { firstName: string; lastName: string; email: string; drawMonth: string };
  error?: string;
}> {
  const now = new Date();
  const drawMonth =
    month ??
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  try {
    // Check if already drawn
    const existing = await getWinnerForMonth(drawMonth);
    if (existing) {
      return { success: false, reason: "already_drawn" };
    }

    // Get all confirmed entries
    const entries = await getAllConfirmedEntries();
    if (entries.length === 0) {
      return { success: false, reason: "no_entries" };
    }

    // Random selection
    const idx = Math.floor(Math.random() * entries.length);
    const winner = entries[idx];

    // Record winner
    await recordWinner({
      drawMonth,
      entryId: winner.id,
      firstName: winner.firstName,
      lastName: winner.lastName,
      email: winner.email,
    });

    // Send winner notification email
    const monthLabel = new Date(drawMonth + "-01").toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    await sendWinnerEmail({
      to: winner.email,
      firstName: winner.firstName,
      month: monthLabel,
    });

    await markWinnerNotified(drawMonth);

    // Notify site owner
    await notifyOwner({
      title: `🎉 Giveaway Winner Drawn — ${monthLabel}`,
      content: `This month's winner is ${winner.firstName} ${winner.lastName} (${winner.email}). Winner notification email sent automatically. Total entries in pool: ${entries.length}.`,
    }).catch(() => {}); // Non-fatal

    return {
      success: true,
      reason: "drawn",
      winner: {
        firstName: winner.firstName,
        lastName: winner.lastName,
        email: winner.email,
        drawMonth,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Scheduler] Error during monthly draw:", err);
    return { success: false, reason: "error", error: message };
  }
}

/** Start the cron scheduler. Called once at server startup. */
export function startScheduler(): void {
  if (_task) {
    _task.stop();
    _task = null;
  }

  // Run at 9:00 AM on the 1st of every month (Mountain Time = UTC-7 in summer, UTC-6 in winter)
  // We use UTC 16:00 which is ~9:00 AM MST/MDT (approximate — adjust as needed)
  _task = cron.schedule(
    "0 16 1 * *", // minute=0, hour=16 UTC, day=1, every month
    async () => {
      if (!_status.enabled) {
        console.log("[Scheduler] Auto-draw is disabled, skipping.");
        return;
      }

      console.log("[Scheduler] Running monthly giveaway draw...");
      _status.lastRunAt = new Date();

      const result = await runMonthlyDraw();

      if (result.success && result.winner) {
        _status.lastRunResult = `Winner drawn: ${result.winner.firstName} ${result.winner.lastName} (${result.winner.email})`;
        console.log(`[Scheduler] ${_status.lastRunResult}`);
      } else {
        _status.lastRunResult = `No winner drawn: ${result.reason}`;
        console.log(`[Scheduler] ${_status.lastRunResult}`);
      }
    },
    {
      timezone: "America/Denver", // Mountain Time
    }
  );

  console.log("[Scheduler] Monthly giveaway draw scheduled: 1st of each month at 9:00 AM MT.");
}
