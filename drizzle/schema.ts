import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
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
 */
export const giveawayEntries = mysqlTable("giveaway_entries", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  confirmToken: varchar("confirmToken", { length: 64 }).notNull(),
  confirmed: boolean("confirmed").default(false).notNull(),
  confirmedAt: timestamp("confirmedAt"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GiveawayEntry = typeof giveawayEntries.$inferSelect;
export type InsertGiveawayEntry = typeof giveawayEntries.$inferInsert;

/**
 * Monthly winner draws.
 */
export const giveawayWinners = mysqlTable("giveaway_winners", {
  id: int("id").autoincrement().primaryKey(),
  drawMonth: varchar("drawMonth", { length: 7 }).notNull().unique(),
  entryId: int("entryId").notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  drawnAt: timestamp("drawnAt").defaultNow().notNull(),
  notified: boolean("notified").default(false).notNull(),
});

export type GiveawayWinner = typeof giveawayWinners.$inferSelect;

/**
 * Blog posts — managed via the admin backend.
 * Status: 'draft' | 'published' | 'archived'
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  heroImage: varchar("heroImage", { length: 500 }),
  category: varchar("category", { length: 100 }),
  tags: text("tags"), // JSON array stored as string
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  authorName: varchar("authorName", { length: 100 }),
  readTime: varchar("readTime", { length: 30 }),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Newsletter subscribers — collected from the footer signup form.
 * Source tracks where the subscriber came from (footer, giveaway, blog, etc.)
 */
export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  firstName: varchar("firstName", { length: 100 }),
  confirmed: boolean("confirmed").default(false).notNull(),
  confirmToken: varchar("confirmToken", { length: 64 }),
  confirmedAt: timestamp("confirmedAt"),
  source: varchar("source", { length: 100 }).default("footer"),
  unsubscribed: boolean("unsubscribed").default(false).notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
