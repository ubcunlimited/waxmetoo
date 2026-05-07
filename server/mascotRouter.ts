import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  recordMascotFind,
  getUserFinds,
  getOrCreateReward,
  ALL_PAGE_IDS,
  TOTAL_MASCOTS,
} from "./mascotDb";

export const mascotRouter = router({
  /**
   * Record that the current user found the mascot on a given page.
   * Returns updated progress and reward info.
   */
  recordFind: protectedProcedure
    .input(z.object({ pageId: z.string().min(1).max(64) }))
    .mutation(async ({ ctx, input }) => {
      // Validate that the pageId is one of the official 11 mascot pages
      if (!(ALL_PAGE_IDS as readonly string[]).includes(input.pageId)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid pageId: "${input.pageId}". Must be one of the official mascot pages.`,
        });
      }
      const userId = ctx.user.id;
      const isNew = await recordMascotFind(userId, input.pageId);
      const found = await getUserFinds(userId);
      const { reward, isNew: rewardIsNew } = await getOrCreateReward(userId);

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
        rewardIsNew,
      };
    }),

  /**
   * Get the current user's mascot hunt progress.
   */
  getProgress: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const found = await getUserFinds(userId);
    const reward = await getOrCreateReward(userId);

    return {
      found,
      total: TOTAL_MASCOTS,
      allPageIds: ALL_PAGE_IDS as readonly string[],
      complete: found.length >= TOTAL_MASCOTS,
      reward: reward.reward
        ? {
            discountCode: reward.reward.discountCode,
            discountPercent: reward.reward.discountPercent,
            claimedAt: reward.reward.claimedAt,
          }
        : null,
    };
  }),
});
