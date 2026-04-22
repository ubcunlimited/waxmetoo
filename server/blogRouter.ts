/**
 * Blog & Newsletter Router — tRPC procedures for admin blog management
 * and newsletter subscriber management.
 *
 * Admin procedures:
 *  - blog.list           — list all posts (with optional status filter)
 *  - blog.get            — get a single post by ID
 *  - blog.create         — create a new post
 *  - blog.update         — update an existing post
 *  - blog.delete         — delete a post
 *  - blog.stats          — counts by status
 *
 * Public procedures:
 *  - blog.subscribe      — subscribe to the newsletter
 *
 * Admin procedures:
 *  - blog.subscribers    — list all subscribers
 *  - blog.subscriberStats — subscriber counts
 *  - blog.unsubscribe    — unsubscribe an email (admin can force-unsubscribe)
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  listBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  countBlogPosts,
  listSubscribers,
  getSubscriberByEmail,
  createSubscriber,
  unsubscribeByEmail,
  countSubscribers,
} from "./blogDb";

// Admin-only guard
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const blogPostInput = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  heroImage: z.string().url().optional().or(z.literal("")),
  category: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  authorName: z.string().max(100).optional(),
  readTime: z.string().max(30).optional(),
  publishedAt: z.date().optional(),
});

export const blogRouter = router({
  /** Admin: list all blog posts */
  list: adminProcedure
    .input(z.object({ status: z.enum(["draft", "published", "archived"]).optional() }))
    .query(async ({ input }) => {
      const posts = await listBlogPosts(input.status);
      return posts.map(p => ({
        ...p,
        tags: p.tags ? JSON.parse(p.tags) : [],
      }));
    }),

  /** Admin: get a single post by ID */
  get: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await getBlogPostById(input.id);
      if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      return { ...post, tags: post.tags ? JSON.parse(post.tags) : [] };
    }),

  /** Admin: create a new blog post */
  create: adminProcedure
    .input(blogPostInput)
    .mutation(async ({ input }) => {
      const id = await createBlogPost({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt ?? null,
        content: input.content,
        heroImage: input.heroImage || null,
        category: input.category ?? null,
        tags: input.tags ? JSON.stringify(input.tags) : null,
        status: input.status,
        authorName: input.authorName ?? null,
        readTime: input.readTime ?? null,
        publishedAt: input.status === "published" ? (input.publishedAt ?? new Date()) : null,
      });
      return { success: true, id };
    }),

  /** Admin: update an existing blog post */
  update: adminProcedure
    .input(z.object({ id: z.number() }).merge(blogPostInput.partial()))
    .mutation(async ({ input }) => {
      const { id, tags, heroImage, publishedAt, status, ...rest } = input;
      const existing = await getBlogPostById(id);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });

      await updateBlogPost(id, {
        ...rest,
        ...(tags !== undefined ? { tags: JSON.stringify(tags) } : {}),
        ...(heroImage !== undefined ? { heroImage: heroImage || null } : {}),
        ...(status !== undefined ? { status } : {}),
        ...(status === "published" && !existing.publishedAt
          ? { publishedAt: publishedAt ?? new Date() }
          : {}),
      });
      return { success: true };
    }),

  /** Admin: delete a blog post */
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const existing = await getBlogPostById(input.id);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      await deleteBlogPost(input.id);
      return { success: true };
    }),

  /** Admin: blog post counts by status */
  stats: adminProcedure.query(async () => {
    return countBlogPosts();
  }),

  // ─── Newsletter Subscribers ─────────────────────────────────────────────────

  /** Public: subscribe to the newsletter */
  subscribe: publicProcedure
    .input(z.object({
      email: z.string().email().max(320),
      firstName: z.string().max(100).optional(),
      source: z.string().max(100).optional(),
    }))
    .mutation(async ({ input }) => {
      const email = input.email.toLowerCase().trim();
      const existing = await getSubscriberByEmail(email);

      if (existing) {
        if (existing.unsubscribed) {
          // Re-subscribe
          const token = nanoid(48);
          await unsubscribeByEmail(email); // reset first
          return { success: true, reason: "resubscribed" as const };
        }
        if (existing.confirmed) {
          return { success: false, reason: "already_subscribed" as const };
        }
        return { success: true, reason: "pending_confirmation" as const };
      }

      const token = nanoid(48);
      await createSubscriber({
        email,
        firstName: input.firstName?.trim() ?? null,
        confirmed: false,
        confirmToken: token,
        source: input.source ?? "footer",
        unsubscribed: false,
      });

      return { success: true, reason: "created" as const };
    }),

  /** Admin: list all subscribers */
  subscribers: adminProcedure
    .input(z.object({ includeUnsubscribed: z.boolean().default(false) }))
    .query(async ({ input }) => {
      return listSubscribers(input.includeUnsubscribed);
    }),

  /** Admin: subscriber counts */
  subscriberStats: adminProcedure.query(async () => {
    return countSubscribers();
  }),

  /** Admin: force-unsubscribe an email */
  unsubscribe: adminProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      await unsubscribeByEmail(input.email);
      return { success: true };
    }),
});
