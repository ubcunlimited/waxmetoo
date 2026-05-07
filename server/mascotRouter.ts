import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  recordMascotFind,
  getUserFinds,
  getOrCreateReward,
  resetUserFinds,
  claimReward,
  getAllRewards,
  getMascotStats,
  ALL_PAGE_IDS,
  TOTAL_MASCOTS,
} from "./mascotDb";
import { sendMascotRewardEmail } from "./mascotEmail";

/** Admin-only guard reused across procedures */
function requireAdmin(role: string) {
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required." });
  }
}

export const mascotRouter = router({
  /**
   * Record that the current user found the mascot on a given page.
   * Returns updated progress (no auto-reward — reward requires explicit claim).
   */
  recordFind: protectedProcedure
    .input(z.object({ pageId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      if (!(ALL_PAGE_IDS as readonly string[]).includes(input.pageId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid pageId: "${input.pageId}". Must be one of the official mascot pages.`,
        });
      }
      const userId = ctx.user.id;
      const isNew = await recordMascotFind(userId, input.pageId);
      const found = await getUserFinds(userId);
      const { reward } = await getOrCreateReward(userId);

      return {
        isNew,
        found,
        total: TOTAL_MASCOTS,
        complete: found.length >= TOTAL_MASCOTS,
        reward: reward
          ? {
              discountCode: reward.discountCode,
              discountPercent: reward.discountPercent,
              claimedAt: reward.claimedAt,
            }
          : null,
      };
    }),

  /**
   * Get the current user's mascot hunt progress.
   */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const found = await getUserFinds(userId);
    const { reward } = await getOrCreateReward(userId);

    return {
      found,
      total: TOTAL_MASCOTS,
      allPageIds: ALL_PAGE_IDS as readonly string[],
      complete: found.length >= TOTAL_MASCOTS,
      reward: reward
        ? {
            discountCode: reward.discountCode,
            discountPercent: reward.discountPercent,
            claimedAt: reward.claimedAt,
            fullName: reward.fullName,
          }
        : null,
    };
  }),

  /**
   * Claim the 20% discount reward after finding all 11 mascots.
   * Requires full name, phone, and email.
   * One-time only — subsequent calls return the existing reward.
   * Sends a confirmation email on first claim.
   */
  claimReward: protectedProcedure
    .input(
      z.object({
        fullName: z.string().min(2).max(200),
        phone: z.string().min(7).max(30),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const found = await getUserFinds(userId);

      if (found.length < TOTAL_MASCOTS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `You need to find all ${TOTAL_MASCOTS} mascots before claiming your reward.`,
        });
      }

      const { reward, isNew } = await claimReward(userId, {
        fullName: input.fullName,
        phone: input.phone,
        email: input.email,
      });

      if (!reward) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not generate your reward code. Please try again.",
        });
      }

      // Send confirmation email only on first claim
      if (isNew) {
        sendMascotRewardEmail({
          to: input.email,
          fullName: input.fullName,
          discountCode: reward.discountCode,
          discountPercent: reward.discountPercent,
        }).catch((err) =>
          console.error("[MascotRouter] Failed to send reward email:", err)
        );
      }

      return {
        isNew,
        discountCode: reward.discountCode,
        discountPercent: reward.discountPercent,
        claimedAt: reward.claimedAt,
      };
    }),

  /**
   * Reset the current user's hunt — deletes all finds from the DB.
   * The client is responsible for clearing localStorage.
   */
  resetHunt: protectedProcedure.mutation(async ({ ctx }) => {
    await resetUserFinds(ctx.user.id);
    return { success: true };
  }),

  // ─── Admin procedures ────────────────────────────────────────────────────────

  /**
   * Get all claimed rewards with user details (admin only).
   */
  adminGetRewards: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const rewards = await getAllRewards();
    return rewards.map((r) => ({
      id: r.id,
      userId: r.userId,
      discountCode: r.discountCode,
      discountPercent: r.discountPercent,
      fullName: r.fullName,
      phone: r.phone,
      email: r.email,
      claimedAt: r.claimedAt,
      usedAt: r.usedAt,
      userName: r.userName,
      userEmail: r.userEmail,
    }));
  }),

  /**
   * Get aggregate mascot hunt stats (admin only).
   */
  adminStats: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    return getMascotStats();
  }),
});
