/**
 * Giveaway Router — tRPC procedures for the Win a Free Wax promotion.
 *
 * Public procedures:
 *  - giveaway.enter          — submit entry, send confirmation email
 *  - giveaway.confirm        — confirm via token from email link
 *
 * Admin procedures:
 *  - giveaway.drawWinner     — manually draw a winner for the current/specified month
 *  - giveaway.winners        — list all past winners
 *  - giveaway.entries        — list all confirmed entries
 *  - giveaway.stats          — entry counts
 *  - giveaway.schedulerStatus — get cron job status
 *  - giveaway.setScheduler   — enable/disable the auto-draw cron job
 */

import { nanoid } from "nanoid";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createGiveawayEntry,
  getEntryByEmail,
  getEntryByToken,
  confirmEntry,
  getAllConfirmedEntries,
  getConfirmedEntryCount,
  getAllWinners,
} from "./giveawayDb";
import { sendConfirmationEmail } from "./giveawayEmail";
import { getSchedulerStatus, setSchedulerEnabled, runMonthlyDraw } from "./scheduler";

// Admin-only guard
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const giveawayRouter = router({
  /** Submit a new giveaway entry */
  enter: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
        email: z.string().email().max(320),
        origin: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const email = input.email.toLowerCase().trim();

      // Check for duplicate
      const existing = await getEntryByEmail(email);
      if (existing) {
        if (existing.confirmed) {
          return { success: false, reason: "already_confirmed" as const };
        }
        // Resend confirmation
        const confirmUrl = `${input.origin}/win-a-free-wax/confirm?token=${existing.confirmToken}`;
        await sendConfirmationEmail({
          to: email,
          firstName: input.firstName,
          confirmUrl,
        });
        return { success: true, reason: "resent" as const };
      }

      const token = nanoid(48);
      const ipAddress =
        (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
        ctx.req.socket?.remoteAddress ??
        null;

      await createGiveawayEntry({
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email,
        confirmToken: token,
        confirmed: false,
        ipAddress,
      });

      const confirmUrl = `${input.origin}/win-a-free-wax/confirm?token=${token}`;
      await sendConfirmationEmail({
        to: email,
        firstName: input.firstName,
        confirmUrl,
      });

      return { success: true, reason: "created" as const };
    }),

  /** Confirm entry via token */
  confirm: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const entry = await getEntryByToken(input.token);
      if (!entry) {
        return { success: false, reason: "invalid_token" as const };
      }
      if (entry.confirmed) {
        return { success: true, reason: "already_confirmed" as const, firstName: entry.firstName };
      }
      await confirmEntry(input.token);
      return { success: true, reason: "confirmed" as const, firstName: entry.firstName };
    }),

  /** Admin: manually draw a winner for the current (or specified) month */
  drawWinner: adminProcedure
    .input(z.object({ month: z.string().optional() }))
    .mutation(async ({ input }) => {
      const now = new Date();
      const month =
        input.month ??
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      return runMonthlyDraw(month);
    }),

  /** Admin: list all past winners */
  winners: adminProcedure.query(async () => {
    return getAllWinners();
  }),

  /** Admin: list all confirmed entries */
  entries: adminProcedure.query(async () => {
    return getAllConfirmedEntries();
  }),

  /** Admin: entry statistics */
  stats: adminProcedure.query(async () => {
    const count = await getConfirmedEntryCount();
    return { confirmedCount: count };
  }),

  /** Admin: get scheduler/cron status */
  schedulerStatus: adminProcedure.query(() => {
    return getSchedulerStatus();
  }),

  /** Admin: enable or disable the monthly auto-draw cron job */
  setScheduler: adminProcedure
    .input(z.object({ enabled: z.boolean() }))
    .mutation(({ input }) => {
      setSchedulerEnabled(input.enabled);
      return { success: true, enabled: input.enabled };
    }),
});
