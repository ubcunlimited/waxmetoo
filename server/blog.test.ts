/**
 * Blog & Newsletter Router Tests
 * Tests the blog tRPC procedures using mocked DB helpers.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock DB helpers ───────────────────────────────────────────────────────────
vi.mock("./blogDb", () => ({
  listBlogPosts: vi.fn().mockResolvedValue([]),
  getBlogPostById: vi.fn().mockResolvedValue(null),
  createBlogPost: vi.fn().mockResolvedValue(1),
  updateBlogPost: vi.fn().mockResolvedValue(true),
  deleteBlogPost: vi.fn().mockResolvedValue(true),
  countBlogPosts: vi.fn().mockResolvedValue({ draft: 2, published: 5, archived: 1, total: 8 }),
  listSubscribers: vi.fn().mockResolvedValue([]),
  getSubscriberByEmail: vi.fn().mockResolvedValue(null),
  createSubscriber: vi.fn().mockResolvedValue(1),
  unsubscribeByEmail: vi.fn().mockResolvedValue(true),
  countSubscribers: vi.fn().mockResolvedValue({ total: 10, confirmed: 8 }),
}));

import * as blogDb from "./blogDb";
import { blogRouter } from "./blogRouter";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.context<any>().create({ transformer: superjson });
const testRouter = t.router({ blog: blogRouter });

function createCaller(role: "user" | "admin" = "admin") {
  const ctx = {
    user: { id: 1, openId: "test", name: "Test", email: "test@example.com", role },
    req: { headers: {}, socket: { remoteAddress: "127.0.0.1" } },
    res: {},
  };
  return testRouter.createCaller(ctx as any).blog;
}

// ─── Blog post tests ───────────────────────────────────────────────────────────

describe("blog.stats (admin only)", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = createCaller("user");
    await expect(caller.stats()).rejects.toThrow();
  });

  it("returns post counts for admin", async () => {
    const caller = createCaller("admin");
    const result = await caller.stats();
    expect(result.published).toBe(5);
    expect(result.draft).toBe(2);
    expect(result.total).toBe(8);
  });
});

describe("blog.list (admin only)", () => {
  beforeEach(() => {
    vi.mocked(blogDb.listBlogPosts).mockResolvedValue([
      {
        id: 1, title: "Test Post", slug: "test-post",
        excerpt: "An excerpt", content: "Content here",
        heroImage: null, category: "Tips",
        tags: JSON.stringify(["waxing", "tips"]),
        status: "published" as const,
        authorName: "Team", readTime: "3 min read",
        publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date(),
      },
    ]);
  });

  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = createCaller("user");
    await expect(caller.list({})).rejects.toThrow();
  });

  it("returns posts with parsed tags for admin", async () => {
    const caller = createCaller("admin");
    const result = await caller.list({});
    expect(result).toHaveLength(1);
    expect(result[0].tags).toEqual(["waxing", "tips"]);
    expect(result[0].title).toBe("Test Post");
  });
});

describe("blog.create (admin only)", () => {
  beforeEach(() => {
    vi.mocked(blogDb.createBlogPost).mockResolvedValue(42);
  });

  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = createCaller("user");
    await expect(caller.create({
      title: "Test", slug: "test", content: "Content", status: "draft",
    })).rejects.toThrow();
  });

  it("creates a post and returns the new ID", async () => {
    const caller = createCaller("admin");
    const result = await caller.create({
      title: "My New Post",
      slug: "my-new-post",
      content: "# Hello\n\nThis is content.",
      status: "published",
      tags: ["waxing", "tips"],
    });
    expect(result.success).toBe(true);
    expect(result.id).toBe(42);
    expect(blogDb.createBlogPost).toHaveBeenCalledOnce();
  });

  it("rejects invalid slug (uppercase letters)", async () => {
    const caller = createCaller("admin");
    await expect(caller.create({
      title: "Test", slug: "My-Post", content: "Content", status: "draft",
    })).rejects.toThrow();
  });
});

describe("blog.get (admin only)", () => {
  it("throws NOT_FOUND for missing post", async () => {
    vi.mocked(blogDb.getBlogPostById).mockResolvedValue(null);
    const caller = createCaller("admin");
    await expect(caller.get({ id: 999 })).rejects.toThrow();
  });

  it("returns post with parsed tags", async () => {
    vi.mocked(blogDb.getBlogPostById).mockResolvedValue({
      id: 1, title: "Post", slug: "post", excerpt: null,
      content: "Content", heroImage: null, category: null,
      tags: '["waxing"]', status: "draft" as const,
      authorName: null, readTime: null, publishedAt: null,
      createdAt: new Date(), updatedAt: new Date(),
    });
    const caller = createCaller("admin");
    const result = await caller.get({ id: 1 });
    expect(result.tags).toEqual(["waxing"]);
  });
});

describe("blog.delete (admin only)", () => {
  it("throws NOT_FOUND for missing post", async () => {
    vi.mocked(blogDb.getBlogPostById).mockResolvedValue(null);
    const caller = createCaller("admin");
    await expect(caller.delete({ id: 999 })).rejects.toThrow();
  });

  it("deletes an existing post", async () => {
    vi.mocked(blogDb.getBlogPostById).mockResolvedValue({
      id: 1, title: "Post", slug: "post", excerpt: null,
      content: "Content", heroImage: null, category: null,
      tags: null, status: "draft" as const,
      authorName: null, readTime: null, publishedAt: null,
      createdAt: new Date(), updatedAt: new Date(),
    });
    const caller = createCaller("admin");
    const result = await caller.delete({ id: 1 });
    expect(result.success).toBe(true);
    expect(blogDb.deleteBlogPost).toHaveBeenCalledWith(1);
  });
});

// ─── Newsletter subscriber tests ───────────────────────────────────────────────

describe("blog.subscribe (public)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(blogDb.getSubscriberByEmail).mockResolvedValue(null);
    vi.mocked(blogDb.createSubscriber).mockResolvedValue(1);
  });

  it("creates a new subscriber", async () => {
    const caller = createCaller("user");
    const result = await caller.subscribe({ email: "new@example.com" });
    expect(result.success).toBe(true);
    expect(result.reason).toBe("created");
    expect(blogDb.createSubscriber).toHaveBeenCalledOnce();
  });

  it("returns already_subscribed if confirmed subscriber exists", async () => {
    vi.mocked(blogDb.getSubscriberByEmail).mockResolvedValue({
      id: 1, email: "existing@example.com", firstName: null,
      confirmed: true, confirmToken: "token", confirmedAt: new Date(),
      source: "footer", unsubscribed: false, unsubscribedAt: null,
      createdAt: new Date(),
    } as any);
    const caller = createCaller("user");
    const result = await caller.subscribe({ email: "existing@example.com" });
    expect(result.success).toBe(false);
    expect(result.reason).toBe("already_subscribed");
  });

  it("returns pending_confirmation if unconfirmed subscriber exists", async () => {
    vi.mocked(blogDb.getSubscriberByEmail).mockResolvedValue({
      id: 1, email: "pending@example.com", firstName: null,
      confirmed: false, confirmToken: "token", confirmedAt: null,
      source: "footer", unsubscribed: false, unsubscribedAt: null,
      createdAt: new Date(),
    } as any);
    const caller = createCaller("user");
    const result = await caller.subscribe({ email: "pending@example.com" });
    expect(result.success).toBe(true);
    expect(result.reason).toBe("pending_confirmation");
  });
});

describe("blog.subscriberStats (admin only)", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = createCaller("user");
    await expect(caller.subscriberStats()).rejects.toThrow();
  });

  it("returns subscriber counts for admin", async () => {
    const caller = createCaller("admin");
    const result = await caller.subscriberStats();
    expect(result.total).toBe(10);
    expect(result.confirmed).toBe(8);
  });
});
