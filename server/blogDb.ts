/**
 * Blog Post & Newsletter Subscriber DB Helpers
 */

import { and, desc, eq, like, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  blogPosts,
  newsletterSubscribers,
  type InsertBlogPost,
  type InsertNewsletterSubscriber,
} from "../drizzle/schema";

// ─── Blog Posts ───────────────────────────────────────────────────────────────

/** List all blog posts (newest first). Optionally filter by status. */
export async function listBlogPosts(status?: "draft" | "published" | "archived") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const query = db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      heroImage: blogPosts.heroImage,
      category: blogPosts.category,
      tags: blogPosts.tags,
      status: blogPosts.status,
      authorName: blogPosts.authorName,
      readTime: blogPosts.readTime,
      publishedAt: blogPosts.publishedAt,
      createdAt: blogPosts.createdAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .orderBy(desc(blogPosts.createdAt));

  if (status) {
    return db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, status))
      .orderBy(desc(blogPosts.createdAt));
  }
  return query;
}

/** Get a single blog post by ID. */
export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return rows[0] ?? null;
}

/** Get a single blog post by slug. */
export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return rows[0] ?? null;
}

/** Create a new blog post. Returns the new post ID. */
export async function createBlogPost(data: InsertBlogPost): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(data);
  return (result[0] as any).insertId as number;
}

/** Update an existing blog post. */
export async function updateBlogPost(
  id: number,
  data: Partial<InsertBlogPost>
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  return true;
}

/** Delete a blog post by ID. */
export async function deleteBlogPost(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return true;
}

/** Count blog posts by status. */
export async function countBlogPosts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select({ status: blogPosts.status, count: sql<number>`count(*)` })
    .from(blogPosts)
    .groupBy(blogPosts.status);
  const result = { draft: 0, published: 0, archived: 0, total: 0 };
  for (const row of rows) {
    result[row.status] = row.count;
    result.total += row.count;
  }
  return result;
}

// ─── Newsletter Subscribers ───────────────────────────────────────────────────

/** List all newsletter subscribers (newest first). */
export async function listSubscribers(includeUnsubscribed = false) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (includeUnsubscribed) {
    return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
  }
  return db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.unsubscribed, false))
    .orderBy(desc(newsletterSubscribers.createdAt));
}

/** Get subscriber by email. */
export async function getSubscriberByEmail(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email.toLowerCase()))
    .limit(1);
  return rows[0] ?? null;
}

/** Add a new subscriber. Returns the new subscriber ID. */
export async function createSubscriber(data: InsertNewsletterSubscriber): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(newsletterSubscribers).values(data);
  return (result[0] as any).insertId as number;
}

/** Confirm a subscriber by token. */
export async function confirmSubscriber(token: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.confirmToken, token))
    .limit(1);
  if (!rows[0]) return false;
  await db
    .update(newsletterSubscribers)
    .set({ confirmed: true, confirmedAt: new Date() })
    .where(eq(newsletterSubscribers.confirmToken, token));
  return true;
}

/** Unsubscribe by email. */
export async function unsubscribeByEmail(email: string): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(newsletterSubscribers)
    .set({ unsubscribed: true, unsubscribedAt: new Date() })
    .where(eq(newsletterSubscribers.email, email.toLowerCase()));
  return true;
}

/** Count subscribers. */
export async function countSubscribers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [total] = await db
    .select({ count: sql<number>`count(*)` })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.unsubscribed, false));
  const [confirmed] = await db
    .select({ count: sql<number>`count(*)` })
    .from(newsletterSubscribers)
    .where(
      and(
        eq(newsletterSubscribers.confirmed, true),
        eq(newsletterSubscribers.unsubscribed, false)
      )
    );
  return {
    total: total?.count ?? 0,
    confirmed: confirmed?.count ?? 0,
  };
}
