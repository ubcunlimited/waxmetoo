/**
 * Scheduler Tests
 * Tests the runMonthlyDraw logic using mocked DB and email helpers.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock DB helpers ───────────────────────────────────────────────────────────
vi.mock("./giveawayDb", () => ({
  getAllConfirmedEntries: vi.fn().mockResolvedValue([]),
  getWinnerForMonth: vi.fn().mockResolvedValue(null),
  recordWinner: vi.fn().mockResolvedValue(undefined),
  markWinnerNotified: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./giveawayEmail", () => ({
  sendWinnerEmail: vi.fn().mockResolvedValue(true),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// ─── Mock node-cron to avoid real scheduling in tests ─────────────────────────
vi.mock("node-cron", () => ({
  default: {
    schedule: vi.fn().mockReturnValue({ stop: vi.fn() }),
  },
}));

import * as giveawayDb from "./giveawayDb";
import * as giveawayEmail from "./giveawayEmail";
import { runMonthlyDraw, getSchedulerStatus, setSchedulerEnabled } from "./scheduler";

describe("runMonthlyDraw", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(giveawayDb.getWinnerForMonth).mockResolvedValue(null);
    vi.mocked(giveawayDb.getAllConfirmedEntries).mockResolvedValue([]);
  });

  it("returns already_drawn if winner exists for the month", async () => {
    vi.mocked(giveawayDb.getWinnerForMonth).mockResolvedValue({
      id: 1, drawMonth: "2026-04", entryId: 1,
      firstName: "Jane", lastName: "Smith", email: "jane@example.com",
      drawnAt: new Date(), notified: true,
    } as any);

    const result = await runMonthlyDraw("2026-04");
    expect(result.success).toBe(false);
    expect(result.reason).toBe("already_drawn");
    expect(giveawayDb.recordWinner).not.toHaveBeenCalled();
  });

  it("returns no_entries if there are no confirmed entries", async () => {
    vi.mocked(giveawayDb.getAllConfirmedEntries).mockResolvedValue([]);

    const result = await runMonthlyDraw("2026-04");
    expect(result.success).toBe(false);
    expect(result.reason).toBe("no_entries");
    expect(giveawayDb.recordWinner).not.toHaveBeenCalled();
  });

  it("draws a winner from the confirmed entries pool", async () => {
    const entries = [
      { id: 1, firstName: "Alice", lastName: "A", email: "alice@example.com", confirmed: true, confirmToken: "t1", confirmedAt: new Date(), ipAddress: null, createdAt: new Date() },
      { id: 2, firstName: "Bob", lastName: "B", email: "bob@example.com", confirmed: true, confirmToken: "t2", confirmedAt: new Date(), ipAddress: null, createdAt: new Date() },
    ] as any[];
    vi.mocked(giveawayDb.getAllConfirmedEntries).mockResolvedValue(entries);
    vi.mocked(giveawayDb.recordWinner).mockResolvedValue(undefined);
    vi.mocked(giveawayDb.markWinnerNotified).mockResolvedValue(undefined);
    vi.mocked(giveawayEmail.sendWinnerEmail).mockResolvedValue(true);

    const result = await runMonthlyDraw("2026-04");
    expect(result.success).toBe(true);
    expect(result.reason).toBe("drawn");
    expect(result.winner).toBeDefined();
    expect(["alice@example.com", "bob@example.com"]).toContain(result.winner?.email);
    expect(giveawayDb.recordWinner).toHaveBeenCalledOnce();
    expect(giveawayEmail.sendWinnerEmail).toHaveBeenCalledOnce();
    expect(giveawayDb.markWinnerNotified).toHaveBeenCalledOnce();
  });
});

describe("scheduler enable/disable", () => {
  it("reports enabled status correctly", () => {
    setSchedulerEnabled(true);
    expect(getSchedulerStatus().enabled).toBe(true);
  });

  it("reports disabled status correctly", () => {
    setSchedulerEnabled(false);
    expect(getSchedulerStatus().enabled).toBe(false);
    // Re-enable for other tests
    setSchedulerEnabled(true);
  });
});
