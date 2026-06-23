/**
 * Dynamic XML Sitemap
 *
 * Generates a standards-compliant sitemap.xml at /sitemap.xml that includes:
 * - All static pages (home, services, locations, about, faq, blog, contact, etc.)
 * - All 6 location detail pages
 * - All blog post pages (with lastmod derived from post date)
 * - Win A Free Wax and Mascot Hunt pages
 *
 * Priority and changefreq are set per Google's recommended guidelines.
 */

import type { Request, Response } from "express";

const BASE_URL = "https://www.waxmetoo.com";

// Format a date string or Date object to YYYY-MM-DD for sitemap lastmod
function toISODate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
    return d.toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

const TODAY = new Date().toISOString().split("T")[0];

// ── Static pages ─────────────────────────────────────────────────────────────
const STATIC_PAGES: Array<{
  path: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}> = [
  { path: "/",                  priority: "1.0", changefreq: "weekly",  lastmod: TODAY },
  { path: "/services",          priority: "0.9", changefreq: "monthly", lastmod: TODAY },
  { path: "/locations",         priority: "0.9", changefreq: "monthly", lastmod: TODAY },
  { path: "/first-visit",       priority: "0.8", changefreq: "monthly", lastmod: TODAY },
  { path: "/about",             priority: "0.7", changefreq: "monthly", lastmod: TODAY },
  { path: "/faq",               priority: "0.8", changefreq: "monthly", lastmod: TODAY },
  { path: "/blog",              priority: "0.8", changefreq: "weekly",  lastmod: TODAY },
  { path: "/contact",           priority: "0.7", changefreq: "monthly", lastmod: TODAY },
  { path: "/before-care",       priority: "0.7", changefreq: "monthly", lastmod: TODAY },
  { path: "/after-care",        priority: "0.7", changefreq: "monthly", lastmod: TODAY },
  { path: "/win-a-free-wax",    priority: "0.7", changefreq: "monthly", lastmod: TODAY },
  { path: "/mascot-hunt",       priority: "0.5", changefreq: "monthly", lastmod: TODAY },
  { path: "/privacy-policy",    priority: "0.3", changefreq: "yearly",  lastmod: "2024-01-01" },
  { path: "/terms-of-service",  priority: "0.3", changefreq: "yearly",  lastmod: "2024-01-01" },
];

// ── Location detail pages ─────────────────────────────────────────────────────
const LOCATION_SLUGS = [
  "layton",
  "south-jordan",
  "orem",
  "salt-lake-city",
  "draper",
  "st-george",
];

// ── Blog posts ────────────────────────────────────────────────────────────────
// Kept in sync with client/src/lib/blogPosts.ts
// slug → ISO date string (YYYY-MM-DD)
const BLOG_POSTS: Array<{ slug: string; date: string }> = [
  { slug: "why-wax-with-wax-me-too",                   date: "2026-06-23" },
  { slug: "win-complimentary-bikini-wax-summer",        date: "2024-04-02" },
  { slug: "st-george-premier-waxing-salon",             date: "2024-03-26" },
  { slug: "vacation-waxing-prep-guide",                 date: "2024-03-19" },
  { slug: "military-discounts-wax-me-too-layton",       date: "2024-03-12" },
  { slug: "why-waxing-is-best-hair-removal",            date: "2024-03-05" },
  { slug: "bridal-waxing-guide",                        date: "2024-02-27" },
  { slug: "south-jordan-waxing-salon-relocation",       date: "2024-02-20" },
  { slug: "south-jordan-6th-location-opening",          date: "2024-02-13" },
  { slug: "free-bikini-wax-layton-utah",                date: "2024-02-06" },
  { slug: "wax-me-too-difference-local-salon",          date: "2024-01-30" },
  { slug: "summer-waxing-utah-guide",                   date: "2024-01-23" },
  { slug: "first-brazilian-wax-step-by-step",           date: "2024-01-16" },
  { slug: "spring-adventure-waxing-utah",               date: "2024-01-09" },
  { slug: "south-jordan-waxing-grand-opening",          date: "2024-01-02" },
  { slug: "waxing-south-jordan-utah-opening",           date: "2023-12-26" },
  { slug: "valentines-day-waxing-rippp-and-swear",      date: "2023-02-07" },
  { slug: "valentines-day-free-wax-giveaway-2017",      date: "2017-02-01" },
  { slug: "sundance-film-festival-waxing-utah",         date: "2017-01-15" },
  { slug: "layton-waxing-salon-new-team",               date: "2016-11-01" },
  { slug: "pre-vacation-waxing-checklist",              date: "2016-06-01" },
  { slug: "free-bikini-wax-drawing-utah",               date: "2016-05-01" },
  { slug: "holiday-waxing-on-top-of-the-world",         date: "2015-12-01" },
  { slug: "3-worst-things-waxing-salon",                date: "2015-10-01" },
  { slug: "underarm-waxing-guide-utah",                 date: "2015-08-01" },
  { slug: "throw-away-your-razor",                      date: "2015-06-01" },
  { slug: "bikini-wax-types-explained",                 date: "2015-04-01" },
  { slug: "naked-and-afraid-first-brazilian",           date: "2015-02-01" },
  { slug: "mens-eyebrow-waxing-metrosexual",            date: "2014-11-01" },
  { slug: "eyebrow-design-waxing-guide",                date: "2014-09-01" },
  { slug: "hair-removal-layton-utah",                   date: "2014-07-01" },
  { slug: "brazilian-waxing-salon-qa",                  date: "2014-05-01" },
  { slug: "prevention-magazine-bikini-wax-tips",        date: "2014-03-01" },
  { slug: "layton-waxing-milly-speaks-spanish",         date: "2014-01-01" },
  { slug: "valentines-day-brazilian-wax-gift",          date: "2013-02-01" },
  { slug: "layton-waxing-salon-new-location",           date: "2013-01-01" },
  { slug: "15-minute-brazilian-wax-experience",         date: "2012-10-01" },
  { slug: "draper-waxing-salon-expansion",              date: "2012-07-01" },
  { slug: "salt-lake-city-waxing-salon",                date: "2012-04-01" },
  { slug: "valentines-day-free-brazilian-2013",         date: "2013-02-14" },
  { slug: "utah-waxing-salon-established-2007",         date: "2012-01-01" },
  { slug: "brazilian-wax-benefits-vs-shaving",          date: "2023-06-01" },
  { slug: "waxing-while-pregnant-utah",                 date: "2023-05-01" },
  { slug: "ingrown-hair-prevention-waxing",             date: "2023-04-01" },
  { slug: "waxing-sensitive-skin-guide",                date: "2023-03-01" },
  { slug: "how-often-should-you-wax",                   date: "2023-02-01" },
  { slug: "waxing-for-men-manzilian-guide",             date: "2023-01-01" },
  { slug: "st-george-waxing-salon-utah",                date: "2022-12-01" },
  { slug: "waxing-aftercare-guide",                     date: "2022-11-01" },
  { slug: "waxing-before-care-guide",                   date: "2022-10-01" },
  { slug: "wax-me-too-happy-faces-community",           date: "2022-09-01" },
  { slug: "waxing-faq-utah",                            date: "2022-08-01" },
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string
): string {
  return `  <url>
    <loc>${escapeXml(BASE_URL + loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function sitemapHandler(_req: Request, res: Response): void {
  const entries: string[] = [];

  // Static pages
  for (const page of STATIC_PAGES) {
    entries.push(
      urlEntry(page.path, page.lastmod ?? TODAY, page.changefreq, page.priority)
    );
  }

  // Location detail pages
  for (const slug of LOCATION_SLUGS) {
    entries.push(urlEntry(`/locations/${slug}`, TODAY, "monthly", "0.8"));
  }

  // Blog posts
  for (const post of BLOG_POSTS) {
    entries.push(
      urlEntry(`/blog/${post.slug}`, toISODate(post.date), "yearly", "0.6")
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${entries.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400"); // cache 24 hours
  res.status(200).send(xml);
}
