import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

// Mock mascotDb module so tests don't require a real DB connection
vi.mock("./mascotDb", () => ({
  ALL_PAGE_IDS: [
    "home", "services", "blog", "blogpost", "firstvisit",
    "beforecare", "aftercare", "faq", "locations", "about", "winafreewax",
  ],
  TOTAL_MASCOTS: 11,
  recordMascotFind: vi.fn(),
  getUserFinds: vi.fn(),
  hasAllFinds: vi.fn(),
  getOrCreateReward: vi.fn(),
  resetUserFinds: vi.fn(),
  claimReward: vi.fn(),
}));

import * as mascotDb from "./mascotDb";
import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 42): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `user-${userId}`,
    email: `user${userId}@example.com`,
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAnonContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("mascot.recordFind", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("records a new find and returns updated progress", async () => {
    vi.mocked(mascotDb.recordMascotFind).mockResolvedValue(true);
    vi.mocked(mascotDb.getUserFinds).mockResolvedValue(["home"]);
    vi.mocked(mascotDb.getOrCreateReward).mockResolvedValue({ reward: null, isNew: false });

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.mascot.recordFind({ pageId: "home" });

    expect(result.isNew).toBe(true);
    expect(result.found).toContain("home");
    expect(result.total).toBe(11);
    expect(result.complete).toBe(false);
    expect(result.reward).toBeNull();
    expect(mascotDb.recordMascotFind).toHaveBeenCalledWith(42, "home");
  });

  it("returns isNew=false for a duplicate find", async () => {
    vi.mocked(mascotDb.recordMascotFind).mockResolvedValue(false);
    vi.mocked(mascotDb.getUserFinds).mockResolvedValue(["home"]);
    vi.mocked(mascotDb.getOrCreateReward).mockResolvedValue({ reward: null, isNew: false });

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.mascot.recordFind({ pageId: "home" });

    expect(result.isNew).toBe(false);
  });

  it("returns reward when all 11 mascots are found", async () => {
    const allPages = [
      "home", "services", "blog", "blogpost", "firstvisit",
      "beforecare", "aftercare", "faq", "locations", "about", "winafreewax",
    ];
    vi.mocked(mascotDb.recordMascotFind).mockResolvedValue(true);
    vi.mocked(mascotDb.getUserFinds).mockResolvedValue(allPages);
    vi.mocked(mascotDb.getOrCreateReward).mockResolvedValue({
      reward: {
        id: 1,
        userId: 42,
        discountCode: "WAXHUNT-42-ABCDEF",
        discountPercent: 20,
        claimedAt: new Date(),
        usedAt: null,
      },
      isNew: true,
    });

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.mascot.recordFind({ pageId: "winafreewax" });

    expect(result.complete).toBe(true);
    expect(result.found).toHaveLength(11);
    expect(result.reward).not.toBeNull();
    expect(result.reward?.discountCode).toBe("WAXHUNT-42-ABCDEF");
  });

  it("rejects invalid pageIds not in the official list", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.mascot.recordFind({ pageId: "notapage" })
    ).rejects.toThrow(/Invalid pageId/);
    // recordMascotFind should never be called for invalid pages
    expect(mascotDb.recordMascotFind).not.toHaveBeenCalled();
  });

  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const ctx = createAnonContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.mascot.recordFind({ pageId: "home" })).rejects.toThrow();
  });
});

describe("mascot.getProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns current progress for an authenticated user", async () => {
    vi.mocked(mascotDb.getUserFinds).mockResolvedValue(["home", "services", "faq"]);
    vi.mocked(mascotDb.getOrCreateReward).mockResolvedValue({ reward: null, isNew: false });

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.mascot.getProgress();

    expect(result.found).toHaveLength(3);
    expect(result.total).toBe(11);
    expect(result.complete).toBe(false);
    expect(result.reward).toBeNull();
    expect(result.allPageIds).toHaveLength(11);
  });

  it("returns reward info when all mascots are found", async () => {
    const allPages = [
      "home", "services", "blog", "blogpost", "firstvisit",
      "beforecare", "aftercare", "faq", "locations", "about", "winafreewax",
    ];
    vi.mocked(mascotDb.getUserFinds).mockResolvedValue(allPages);
    vi.mocked(mascotDb.getOrCreateReward).mockResolvedValue({
      reward: {
        id: 2,
        userId: 42,
        discountCode: "WAXHUNT-42-XYZ123",
        discountPercent: 20,
        claimedAt: new Date(),
        usedAt: null,
      },
      isNew: false,
    });

    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.mascot.getProgress();

    expect(result.complete).toBe(true);
    expect(result.reward?.discountCode).toBe("WAXHUNT-42-XYZ123");
  });

  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const ctx = createAnonContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.mascot.getProgress()).rejects.toThrow();
  });
});

describe("mascot.resetHunt", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("clears all finds for the authenticated user", async () => {
    vi.mocked(mascotDb.resetUserFinds).mockResolvedValue(undefined);
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.mascot.resetHunt();
    expect(result.success).toBe(true);
    expect(mascotDb.resetUserFinds).toHaveBeenCalledWith(42);
  });

  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const ctx = createAnonContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.mascot.resetHunt()).rejects.toThrow();
  });
});

describe("mascot.claimReward", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("issues a new reward when all mascots found", async () => {
    const allPages = [
      "home", "services", "blog", "blogpost", "firstvisit",
      "beforecare", "aftercare", "faq", "locations", "about", "winafreewax",
    ];
    vi.mocked(mascotDb.getUserFinds).mockResolvedValue(allPages);
    vi.mocked(mascotDb.claimReward).mockResolvedValue({
      reward: {
        id: 1, userId: 42,
        discountCode: "WAXHUNT-42-CLAIM1",
        discountPercent: 20,
        fullName: "Jane Smith", phone: "8015550100", email: "jane@example.com",
        claimedAt: new Date(), usedAt: null,
      },
      isNew: true,
    });
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.mascot.claimReward({
      fullName: "Jane Smith", phone: "8015550100", email: "jane@example.com",
    });
    expect(result.isNew).toBe(true);
    expect(result.discountCode).toBe("WAXHUNT-42-CLAIM1");
    expect(result.discountPercent).toBe(20);
  });

  it("throws BAD_REQUEST when not all mascots found", async () => {
    vi.mocked(mascotDb.getUserFinds).mockResolvedValue(["home", "services"]);
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.mascot.claimReward({ fullName: "Jane", phone: "8015550100", email: "j@example.com" })
    ).rejects.toThrow();
  });

  it("throws UNAUTHORIZED for unauthenticated users", async () => {
    const ctx = createAnonContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.mascot.claimReward({ fullName: "Jane", phone: "8015550100", email: "j@example.com" })
    ).rejects.toThrow();
  });
});
