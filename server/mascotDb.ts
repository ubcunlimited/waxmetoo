import { getDb } from "./db";
import { mascotFinds, mascotRewards } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import type { MascotFind, MascotReward } from "../drizzle/schema";

/** All 11 page IDs that have a hidden mascot */
export const ALL_PAGE_IDS = [
  "home",
  "services",
  "blog",
  "blogpost",
  "firstvisit",
  "beforecare",
  "aftercare",
  "faq",
  "locations",
  "about",
  "winafreewax",
] as const;

export const TOTAL_MASCOTS = ALL_PAGE_IDS.length; // 11

/**
 * Record a mascot find for a user on a specific page.
 * Silently ignores duplicate finds (same userId + pageId).
 * Returns true if this was a NEW find, false if already recorded.
 */
export async function recordMascotFind(
  userId: number,
  pageId: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const existing = await db
    .select()
    .from(mascotFinds)
    .where(and(eq(mascotFinds.userId, userId), eq(mascotFinds.pageId, pageId)))
    .limit(1);

  if (existing.length > 0) return false;

  await db.insert(mascotFinds).values({ userId, pageId });
  return true;
}

/**
 * Get all page IDs found by a user.
 */
export async function getUserFinds(userId: number): Promise<string[]> {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select({ pageId: mascotFinds.pageId })
    .from(mascotFinds)
    .where(eq(mascotFinds.userId, userId));
  return rows.map((r: { pageId: string }) => r.pageId);
}

/**
 * Check if a user has found all 11 mascots.
 * Validates against the exact set of official page IDs.
 */
export async function hasAllFinds(userId: number): Promise<boolean> {
  const found = await getUserFinds(userId);
  const validFinds = found.filter((p) => (ALL_PAGE_IDS as readonly string[]).includes(p));
  return validFinds.length >= TOTAL_MASCOTS;
}

/**
 * Delete all mascot finds for a user (reset hunt).
 */
export async function resetUserFinds(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(mascotFinds).where(eq(mascotFinds.userId, userId));
}

/**
 * Get the existing reward for a user, if any.
 */
export async function getReward(userId: number): Promise<MascotReward | null> {
  const db = await getDb();
  if (!db) return null;

  const rows = await db
    .select()
    .from(mascotRewards)
    .where(eq(mascotRewards.userId, userId))
    .limit(1);
  return (rows[0] as MascotReward) ?? null;
}

/**
 * Generate a unique discount code.
 * Format: WAXHUNT-{userId}-{6 random uppercase chars}
 */
function generateDiscountCode(userId: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `WAXHUNT-${userId}-${suffix}`;
}

/**
 * Claim the reward for a user who has found all mascots.
 * Stores their contact info (fullName, phone, email) alongside the discount code.
 * Returns the reward row, or null if not eligible or already claimed.
 * isNew = true means the reward was just created now.
 */
export async function claimReward(
  userId: number,
  contact: { fullName: string; phone: string; email: string }
): Promise<{ reward: MascotReward | null; isNew: boolean }> {
  const db = await getDb();
  if (!db) return { reward: null, isNew: false };

  // If already claimed, return existing reward
  const existing = await getReward(userId);
  if (existing) return { reward: existing, isNew: false };

  // Must have found all mascots
  const allFound = await hasAllFinds(userId);
  if (!allFound) return { reward: null, isNew: false };

  // Generate unique code (retry up to 5 times on collision)
  let code = generateDiscountCode(userId);
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await db.insert(mascotRewards).values({
        userId,
        discountCode: code,
        discountPercent: 20,
        fullName: contact.fullName,
        phone: contact.phone,
        email: contact.email,
      });
      const newReward = await getReward(userId);
      return { reward: newReward, isNew: true };
    } catch {
      code = generateDiscountCode(userId);
    }
  }

  return { reward: null, isNew: false };
}

/**
 * Get progress without auto-creating a reward.
 * Used by getProgress to show current state without side effects.
 */
export async function getOrCreateReward(
  userId: number
): Promise<{ reward: MascotReward | null; isNew: boolean }> {
  const db = await getDb();
  if (!db) return { reward: null, isNew: false };

  const existing = await getReward(userId);
  if (existing) return { reward: existing, isNew: false };

  return { reward: null, isNew: false };
}
