/**
 * Giveaway Router Tests
 * Tests the giveaway tRPC procedures using mocked DB and email helpers.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock DB helpers ───────────────────────────────────────────────────────────
vi.mock("./giveawayDb", () => ({
  createGiveawayEntry: vi.fn().mockResolvedValue(1),
  getEntryByEmail: vi.fn().mockResolvedValue(null),
  getEntryByToken: vi.fn().mockResolvedValue(null),
  confirmEntry: vi.fn().mockResolvedValue(true),
  getAllConfirmedEntries: vi.fn().mockResolvedValue([]),
  getConfirmedEntryCount: vi.fn().mockResolvedValue(0),
  getWinnerForMonth: vi.fn().mockResolvedValue(null),
  recordWinner: vi.fn().mockResolvedValue(undefined),
  getAllWinners: vi.fn().mockResolvedValue([]),
  markWinnerNotified: vi.fn().mockResolvedValue(undefined),
}));

// ─── Mock email helpers ────────────────────────────────────────────────────────
vi.mock("./giveawayEmail", () => ({
  sendConfirmationEmail: vi.fn().mockResolvedValue(true),
  sendWinnerEmail: vi.fn().mockResolvedValue(true),
}));

import * as giveawayDb from "./giveawayDb";
import * as giveawayEmail from "./giveawayEmail";

// ─── Helper: build a minimal tRPC caller context ───────────────────────────────
function makeCtx(role: "user" | "admin" = "user") {
  return {
    user: { id: 1, openId: "test-open-id", name: "Test User", email: "test@example.com", role },
    req: {
      headers: {},
      socket: { remoteAddress: "127.0.0.1" },
    },
    res: {},
  } as any;
}

// Import the router after mocks are set up
import { giveawayRouter } from "./giveawayRouter";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";

// Build a test-only caller using the router directly
const t = initTRPC.context<any>().create({ transformer: superjson });
const testRouter = t.router({ giveaway: giveawayRouter });

function createCaller(ctx: any) {
  return testRouter.createCaller(ctx).giveaway;
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("giveaway.enter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(giveawayDb.getEntryByEmail).mockResolvedValue(null);
    vi.mocked(giveawayDb.createGiveawayEntry).mockResolvedValue(1);
    vi.mocked(giveawayEmail.sendConfirmationEmail).mockResolvedValue(true);
  });

  it("creates a new entry and sends confirmation email", async () => {
    const caller = createCaller(makeCtx());
    const result = await caller.enter({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      origin: "https://example.com",
    });

    expect(result.success).toBe(true);
    expect(result.reason).toBe("created");
    expect(giveawayDb.createGiveawayEntry).toHaveBeenCalledOnce();
    expect(giveawayEmail.sendConfirmationEmail).toHaveBeenCalledOnce();
  });

  it("returns already_confirmed if email is already confirmed", async () => {
    vi.mocked(giveawayDb.getEntryByEmail).mockResolvedValue({
      id: 1,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      confirmToken: "existing-token",
      confirmed: true,
      confirmedAt: new Date(),
      ipAddress: null,
      createdAt: new Date(),
    } as any);

    const caller = createCaller(makeCtx());
    const result = await caller.enter({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      origin: "https://example.com",
    });

    expect(result.success).toBe(false);
    expect(result.reason).toBe("already_confirmed");
    expect(giveawayDb.createGiveawayEntry).not.toHaveBeenCalled();
  });

  it("resends confirmation email if entry exists but is unconfirmed", async () => {
    vi.mocked(giveawayDb.getEntryByEmail).mockResolvedValue({
      id: 1,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      confirmToken: "existing-token",
      confirmed: false,
      confirmedAt: null,
      ipAddress: null,
      createdAt: new Date(),
    } as any);

    const caller = createCaller(makeCtx());
    const result = await caller.enter({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      origin: "https://example.com",
    });

    expect(result.success).toBe(true);
    expect(result.reason).toBe("resent");
    expect(giveawayEmail.sendConfirmationEmail).toHaveBeenCalledOnce();
    expect(giveawayDb.createGiveawayEntry).not.toHaveBeenCalled();
  });
});

describe("giveaway.confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns invalid_token for unknown token", async () => {
    vi.mocked(giveawayDb.getEntryByToken).mockResolvedValue(null);

    const caller = createCaller(makeCtx());
    const result = await caller.confirm({ token: "bad-token" });

    expect(result.success).toBe(false);
    expect(result.reason).toBe("invalid_token");
  });

  it("confirms a valid unconfirmed entry", async () => {
    vi.mocked(giveawayDb.getEntryByToken).mockResolvedValue({
      id: 1,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      confirmToken: "valid-token",
      confirmed: false,
      confirmedAt: null,
      ipAddress: null,
      createdAt: new Date(),
    } as any);
    vi.mocked(giveawayDb.confirmEntry).mockResolvedValue(true);

    const caller = createCaller(makeCtx());
    const result = await caller.confirm({ token: "valid-token" });

    expect(result.success).toBe(true);
    expect(result.reason).toBe("confirmed");
    expect(result.firstName).toBe("Jane");
  });

  it("returns already_confirmed for already-confirmed entry", async () => {
    vi.mocked(giveawayDb.getEntryByToken).mockResolvedValue({
      id: 1,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      confirmToken: "valid-token",
      confirmed: true,
      confirmedAt: new Date(),
      ipAddress: null,
      createdAt: new Date(),
    } as any);

    const caller = createCaller(makeCtx());
    const result = await caller.confirm({ token: "valid-token" });

    expect(result.success).toBe(true);
    expect(result.reason).toBe("already_confirmed");
  });
});

describe("giveaway.drawWinner (admin only)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(giveawayDb.getWinnerForMonth).mockResolvedValue(null);
    vi.mocked(giveawayDb.getAllConfirmedEntries).mockResolvedValue([
      {
        id: 1,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        confirmToken: "token",
        confirmed: true,
        confirmedAt: new Date(),
        ipAddress: null,
        createdAt: new Date(),
      } as any,
    ]);
    vi.mocked(giveawayDb.recordWinner).mockResolvedValue(undefined);
    vi.mocked(giveawayDb.markWinnerNotified).mockResolvedValue(undefined);
    vi.mocked(giveawayEmail.sendWinnerEmail).mockResolvedValue(true);
  });

  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = createCaller(makeCtx("user"));
    await expect(caller.drawWinner({})).rejects.toThrow();
  });

  it("draws a winner for admin users", async () => {
    const caller = createCaller(makeCtx("admin"));
    const result = await caller.drawWinner({});

    expect(result.success).toBe(true);
    expect(result.reason).toBe("drawn");
    expect(giveawayDb.recordWinner).toHaveBeenCalledOnce();
    expect(giveawayEmail.sendWinnerEmail).toHaveBeenCalledOnce();
  });

  it("returns already_drawn if winner exists for month", async () => {
    vi.mocked(giveawayDb.getWinnerForMonth).mockResolvedValue({
      id: 1,
      drawMonth: "2026-04",
      entryId: 1,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      drawnAt: new Date(),
      notified: true,
    } as any);

    const caller = createCaller(makeCtx("admin"));
    const result = await caller.drawWinner({ month: "2026-04" });

    expect(result.success).toBe(false);
    expect(result.reason).toBe("already_drawn");
  });

  it("returns no_entries if no confirmed entries", async () => {
    vi.mocked(giveawayDb.getAllConfirmedEntries).mockResolvedValue([]);

    const caller = createCaller(makeCtx("admin"));
    const result = await caller.drawWinner({});

    expect(result.success).toBe(false);
    expect(result.reason).toBe("no_entries");
  });
});

describe("giveaway.stats (admin only)", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = createCaller(makeCtx("user"));
    await expect(caller.stats()).rejects.toThrow();
  });

  it("returns confirmed entry count for admin", async () => {
    vi.mocked(giveawayDb.getConfirmedEntryCount).mockResolvedValue(42);
    const caller = createCaller(makeCtx("admin"));
    const result = await caller.stats();
    expect(result.confirmedCount).toBe(42);
  });
});
