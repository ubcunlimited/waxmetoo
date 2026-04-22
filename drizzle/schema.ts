import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Giveaway entries for the "Win a Free Wax" promotion.
 * Each entry requires email confirmation before it is considered active.
 */
export const giveawayEntries = mysqlTable("giveaway_entries", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** Random token sent in the confirmation email */
  confirmToken: varchar("confirmToken", { length: 64 }).notNull(),
  /** Whether the user has clicked the confirmation link */
  confirmed: boolean("confirmed").default(false).notNull(),
  confirmedAt: timestamp("confirmedAt"),
  /** IP address for basic abuse prevention */
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GiveawayEntry = typeof giveawayEntries.$inferSelect;
export type InsertGiveawayEntry = typeof giveawayEntries.$inferInsert;

/**
 * Monthly winner draws — records the winner selected on the 1st of each month.
 */
export const giveawayWinners = mysqlTable("giveaway_winners", {
  id: int("id").autoincrement().primaryKey(),
  /** YYYY-MM format, e.g. "2025-05" */
  drawMonth: varchar("drawMonth", { length: 7 }).notNull().unique(),
  entryId: int("entryId").notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  drawnAt: timestamp("drawnAt").defaultNow().notNull(),
  notified: boolean("notified").default(false).notNull(),
});

export type GiveawayWinner = typeof giveawayWinners.$inferSelect;
