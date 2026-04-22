import { and, eq, sql } from "drizzle-orm";
import { getDb } from "./db";
import { giveawayEntries, giveawayWinners, type InsertGiveawayEntry } from "../drizzle/schema";

/** Insert a new giveaway entry (unconfirmed). Returns the inserted id. */
export async function createGiveawayEntry(data: InsertGiveawayEntry): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(giveawayEntries).values(data);
  return (result[0] as any).insertId as number;
}

/** Look up an entry by its confirmation token. */
export async function getEntryByToken(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select()
    .from(giveawayEntries)
    .where(eq(giveawayEntries.confirmToken, token))
    .limit(1);
  return rows[0] ?? null;
}

/** Look up an entry by email address. */
export async function getEntryByEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select()
    .from(giveawayEntries)
    .where(eq(giveawayEntries.email, email.toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

/** Mark an entry as confirmed. */
export async function confirmEntry(token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const entry = await getEntryByToken(token);
  if (!entry) return false;
  if (entry.confirmed) return true; // already confirmed
  await db
    .update(giveawayEntries)
    .set({ confirmed: true, confirmedAt: new Date() })
    .where(eq(giveawayEntries.confirmToken, token));
  return true;
}

/** Return all confirmed entries. */
export async function getAllConfirmedEntries() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(giveawayEntries)
    .where(eq(giveawayEntries.confirmed, true));
}

/** Return count of confirmed entries. */
export async function getConfirmedEntryCount(): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select({ count: sql<number>`count(*)` })
    .from(giveawayEntries)
    .where(eq(giveawayEntries.confirmed, true));
  return rows[0]?.count ?? 0;
}

/** Check if a winner has already been drawn for the given month (YYYY-MM). */
export async function getWinnerForMonth(month: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select()
    .from(giveawayWinners)
    .where(eq(giveawayWinners.drawMonth, month))
    .limit(1);
  return rows[0] ?? null;
}

/** Record a winner for the given month. */
export async function recordWinner(data: {
  drawMonth: string;
  entryId: number;
  firstName: string;
  lastName: string;
  email: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(giveawayWinners).values({ ...data, notified: false });
}

/** Get all past winners. */
export async function getAllWinners() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(giveawayWinners).orderBy(giveawayWinners.drawMonth);
}

/** Mark winner as notified. */
export async function markWinnerNotified(drawMonth: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(giveawayWinners)
    .set({ notified: true })
    .where(eq(giveawayWinners.drawMonth, drawMonth));
}
