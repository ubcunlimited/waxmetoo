/**
 * Weekly 404 Link Check — Heartbeat Handler
 *
 * Called every Monday at 9:00 AM UTC by the Manus Heartbeat cron.
 * Fetches every known public route on the live site, collects any non-200
 * responses, and sends an owner notification with the results.
 *
 * POST /api/scheduled/link-check
 * Auth: Manus cron gateway (x-manus-cron-task-uid header)
 */

import type { Request, Response } from "express";
import { notifyOwner } from "./_core/notification";

// All public routes that should return 200.
// Dynamic routes are expanded to real examples using known IDs/slugs.
const STATIC_ROUTES = [
  "/",
  "/services",
  "/first-visit",
  "/locations",
  "/locations/layton",
  "/locations/south-jordan",
  "/locations/orem",
  "/locations/salt-lake-city",
  "/locations/draper",
  "/locations/st-george",
  "/about",
  "/faq",
  "/blog",
  "/before-care",
  "/after-care",
  "/contact",
  "/win-a-free-wax",
  "/mascot-hunt",
  "/register",
  "/privacy-policy",
  "/terms-of-service",
  "/sitemap.xml",
  "/robots.txt",
];

// A sample of blog slugs to spot-check (first 5 alphabetically)
const BLOG_SAMPLE_SLUGS = [
  "aftercare-tips-for-brazilian-wax",
  "benefits-of-regular-waxing",
  "bikini-wax-vs-brazilian-wax",
  "brow-waxing-tips",
  "first-time-waxing-guide",
];

interface CheckResult {
  url: string;
  status: number;
  ok: boolean;
  error?: string;
}

async function checkUrl(baseUrl: string, path: string): Promise<CheckResult> {
  const url = `${baseUrl}${path}`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "WaxMeToo-LinkChecker/1.0" },
    });
    clearTimeout(timeout);
    return { url, status: res.status, ok: res.status < 400 };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { url, status: 0, ok: false, error: msg };
  }
}

export async function linkCheckHandler(req: Request, res: Response) {
  // Verify this is a legitimate cron trigger
  const taskUid = req.headers["x-manus-cron-task-uid"];
  if (!taskUid) {
    return res.status(403).json({ error: "cron-only endpoint" });
  }

  try {
    // Determine the base URL from the request (production URL)
    const baseUrl = process.env.SITE_BASE_URL || "https://www.waxmetoo.com";

    const allPaths = [
      ...STATIC_ROUTES,
      ...BLOG_SAMPLE_SLUGS.map((s) => `/blog/${s}`),
    ];

    // Check all routes concurrently (with a concurrency cap of 5)
    const results: CheckResult[] = [];
    const BATCH = 5;
    for (let i = 0; i < allPaths.length; i += BATCH) {
      const batch = allPaths.slice(i, i + BATCH);
      const batchResults = await Promise.all(
        batch.map((path) => checkUrl(baseUrl, path))
      );
      results.push(...batchResults);
    }

    const broken = results.filter((r) => !r.ok);
    const checkedCount = results.length;
    const brokenCount = broken.length;
    const now = new Date().toUTCString();

    if (brokenCount === 0) {
      // All clear — send a brief success notification
      await notifyOwner({
        title: "✅ Weekly Link Check — All Clear",
        content: `Weekly 404 check completed on ${now}.\n\nAll ${checkedCount} routes returned 200 OK. No broken links found.`,
      });
    } else {
      // Build a detailed broken-links report
      const lines = broken.map(
        (r) =>
          `• ${r.url}\n  Status: ${r.status || "timeout/error"}${r.error ? `\n  Error: ${r.error}` : ""}`
      );
      const content = [
        `Weekly 404 check completed on ${now}.`,
        ``,
        `⚠️ ${brokenCount} broken link(s) found out of ${checkedCount} checked:`,
        ``,
        ...lines,
        ``,
        `Please review and fix these routes on the live site.`,
      ].join("\n");

      await notifyOwner({
        title: `⚠️ Weekly Link Check — ${brokenCount} Broken Link(s) Found`,
        content,
      });
    }

    res.json({
      ok: true,
      checked: checkedCount,
      broken: brokenCount,
      brokenUrls: broken.map((r) => r.url),
      timestamp: now,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[link-check] Error:", err);
    res.status(500).json({
      error: msg,
      stack: err instanceof Error ? err.stack : undefined,
      context: { taskUid: req.headers["x-manus-cron-task-uid"] },
      timestamp: new Date().toISOString(),
    });
  }
}
