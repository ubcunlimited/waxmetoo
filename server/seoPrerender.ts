/**
 * SEO Prerender Middleware
 *
 * Injects page-specific title, meta description, and visible body content
 * into the HTML shell BEFORE sending it to the client. This ensures crawlers
 * (Googlebot, SEMrush, etc.) see real text in the raw HTML response, fixing
 * the "low text-to-HTML ratio" SEMrush P1 issue without a full React SSR setup.
 *
 * Strategy: route-aware string injection into the index.html template.
 * The injected content mirrors what the React SPA renders, so there is no
 * content mismatch for users — they see the same page either way.
 */

import type { Request, Response, NextFunction } from "express";

// ── Page metadata map ────────────────────────────────────────────────────────

interface PageMeta {
  title: string;
  description: string;
  /** Visible body text injected into a hidden-from-users but crawler-readable noscript block */
  bodyText: string;
}

// Static page definitions — keep in sync with client/src/lib/* data files
const STATIC_PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Wax Me Too — Professional Waxing Studio | Est. 2007",
    description:
      "Utah's women-owned waxing studio since 2007. Brazilian, bikini, brow & body waxing across 6 locations. Book your appointment today.",
    bodyText: `Wax Me Too — Professional Waxing Studio. Perfected Over 15 Years.
Utah's premier women-owned waxing studio, serving clients since 2007 across 6 locations: Layton, South Jordan, Orem, Salt Lake City, Draper, and St. George.
Services: Brazilian Wax, Bikini Wax, Deep Bikini Wax, Brow Wax, Brow Lamination, Lip Wax, Chin Wax, Full Leg Wax, Half Leg Wax, Underarm Wax, Full Body Wax.
First-time clients: Brazilian wax for $50. All prices standardized across all 6 Utah locations as of June 2026.
Book your appointment online at booking.mangomint.com/593822.`,
  },
  "/services": {
    title: "Waxing Services & Pricing — Wax Me Too Utah",
    description:
      "Browse our full waxing menu — Brazilian, bikini, brow & body waxing. Standardized pricing guaranteed across all 6 Utah locations. First-time Brazilian wax $50.",
    bodyText: `Wax Me Too Services & Pricing. Standardized across all 6 Utah locations as of June 2026.
NEW! Lamination & Brow Henna: Brow Lamination $75 | Brow Lamination and Tint $95.
Bikini Waxing: Brazilian Wax $65 | Deep Bikini Wax $55 | Bikini Wax $45.
Brow & Face: Brow Wax $20 | Brow Wax & Tint $35 | Lip Wax $12 | Chin Wax $12 | Full Face Wax $45.
Body Waxing: Underarm Wax $25 | Half Arm Wax $30 | Full Arm Wax $45 | Half Leg Wax $45 | Full Leg Wax $75 | Back Wax $55 | Chest Wax $45.
First-time clients: Brazilian wax for $50 (Brazilian only, not Deep Bikini or Bikini).`,
  },
  "/locations": {
    title: "Wax Me Too Locations — 6 Utah Studios",
    description:
      "Find your nearest Wax Me Too studio in Layton, South Jordan, Orem, Salt Lake City, Draper, or St. George. Book online today.",
    bodyText: `Wax Me Too has 6 locations across Utah.
Layton: 360 S Fort Ln #101, Layton, UT 84041. Phone: (801) 572-7771. Mon–Fri 9am–7pm, Sat 9am–5pm.
South Jordan: 3674 W South Jordan Pkwy, South Jordan, UT 84095. Phone: (801) 572-7771. Mon–Fri 9am–7pm, Sat 9am–5pm.
Orem: 764 S State St #B, Orem, UT 84058. Phone: (801) 572-7771. Mon–Fri 9am–7pm, Sat 9am–5pm.
Salt Lake City: 2121 S McClelland St #100, Salt Lake City, UT 84106. Phone: (801) 572-7771. Mon–Fri 9am–7pm, Sat 9am–5pm.
Draper: 12065 S Lone Peak Pkwy #103, Draper, UT 84020. Phone: (801) 572-7771. Mon–Fri 9am–7pm, Sat 9am–5pm.
St. George: 1091 N Bluff St #104, St. George, UT 84770. Phone: (435) 688-0888. Mon–Fri 9am–6pm, Sat 9am–5pm.`,
  },
  "/about": {
    title: "About Wax Me Too — Utah's Women-Owned Waxing Studio Since 2007",
    description:
      "Learn about Wax Me Too's story — Utah's women-owned waxing studio founded in 2007. Meet our expert estheticians and discover our commitment to quality.",
    bodyText: `About Wax Me Too. Utah's women-owned waxing studio, founded in 2007.
Wax Me Too was founded with a simple mission: provide a clean, private, and professional waxing experience for every client. Since opening our first studio in Draper in 2007, we have grown to 6 locations across Utah.
Our estheticians are licensed professionals trained in the latest waxing techniques. We use premium hard wax and soft wax products tailored to each service. Every room is private and sanitized between appointments.
We are proud to be women-owned and operated, and we are committed to making every client feel comfortable and confident.`,
  },
  "/faq": {
    title: "Waxing FAQ — Common Questions Answered | Wax Me Too",
    description:
      "Answers to your most common waxing questions — prep tips, pain levels, pricing, and what to expect at Wax Me Too. Pricing last updated June 2026.",
    bodyText: `Frequently Asked Questions — Wax Me Too.
Does waxing hurt? Most clients describe waxing as a quick sting that fades immediately. Brazilian and bikini waxing is more sensitive than brow or leg waxing, but our estheticians use techniques to minimize discomfort.
How long does hair need to be? At least 1/4 inch (about 2–3 weeks of growth) for best results. Avoid shaving for at least 3 weeks before your appointment.
How long do results last? Most clients enjoy smooth skin for 3–6 weeks. With regular waxing, hair grows back finer and sparser over time.
Pricing: Brazilian Wax $65 | Deep Bikini $55 | Bikini $45 | Brow Wax $20. First-time Brazilian wax $50. Pricing standardized across all 6 Utah locations as of June 2026.
Did your prices change recently? Yes, we updated our pricing on June 1, 2026. All prices are now standardized across all 6 locations.`,
  },
  "/blog": {
    title: "Waxing Tips, News & Guides — Wax Me Too Blog",
    description:
      "Expert waxing tips, prep guides, location news, and promotions from Utah's premier waxing studio. Read the Wax Me Too blog.",
    bodyText: `Wax Me Too Blog — Waxing Tips, News & Guides.
Articles covering Brazilian wax prep, bikini wax tips, brow care, location news, promotions, and more from Utah's women-owned waxing studio since 2007.
Recent posts: First Brazilian Wax Step by Step | Vacation Waxing Prep Guide | Why Waxing Is the Best Hair Removal Method | Bridal Waxing Guide | Summer Waxing Utah Guide.`,
  },
  "/contact": {
    title: "Contact Wax Me Too — Utah Waxing Studios",
    description:
      "Get in touch with Wax Me Too. Find phone numbers, emails, and addresses for all 6 Utah waxing studio locations.",
    bodyText: `Contact Wax Me Too. We have 6 locations across Utah.
General inquiries: hello@waxmetoo.com. Phone: (801) 572-7771.
Layton | South Jordan | Orem | Salt Lake City | Draper | St. George.
Book online at booking.mangomint.com/593822 or call your nearest studio.`,
  },
  "/first-visit": {
    title: "Your First Waxing Visit — What to Expect | Wax Me Too",
    description:
      "Everything you need to know before your first wax at Wax Me Too. Prep tips, what to wear, and how to get the best results.",
    bodyText: `Your First Visit to Wax Me Too. What to expect and how to prepare.
Before your appointment: let hair grow to at least 1/4 inch. Exfoliate gently 24 hours before. Avoid sun exposure and tanning beds. Do not apply lotion on the day of your appointment.
During your appointment: your esthetician will walk you through every step. All rooms are private. We use premium hard wax for sensitive areas.
First-time clients: Brazilian wax for $50. Book at booking.mangomint.com/593822.`,
  },
  "/before-care": {
    title: "Pre-Wax Care Tips — How to Prepare | Wax Me Too",
    description:
      "Follow these pre-wax care tips to get the best results from your waxing appointment at Wax Me Too.",
    bodyText: `Pre-Wax Care Tips from Wax Me Too.
Let hair grow to at least 1/4 inch (2–3 weeks from last shave). Exfoliate gently 24–48 hours before your appointment to prevent ingrown hairs. Avoid retinol, AHAs, and BHAs for 48 hours before waxing. Do not apply lotion, oils, or self-tanner on the day of your appointment. Stay hydrated and avoid caffeine before sensitive-area waxing.`,
  },
  "/after-care": {
    title: "Post-Wax Care Tips — Keep Skin Smooth | Wax Me Too",
    description:
      "Follow these after-wax care tips to keep skin smooth, prevent ingrown hairs, and extend your waxing results.",
    bodyText: `Post-Wax Care Tips from Wax Me Too.
Avoid heat for 24–48 hours: no hot showers, saunas, steam rooms, or sun exposure. Do not apply makeup, deodorant, or perfumed products to waxed areas for 24 hours. Exfoliate gently starting 48 hours after your appointment to prevent ingrown hairs. Moisturize daily with a fragrance-free lotion. Book your next appointment in 4–6 weeks for best results.`,
  },
  "/privacy-policy": {
    title: "Privacy Policy — Wax Me Too",
    description: "Wax Me Too privacy policy — how we collect, use, and protect your personal information.",
    bodyText: `Wax Me Too Privacy Policy. Last updated 2024.
We collect personal information you provide when booking appointments or contacting us. We do not sell your personal information to third parties. We use industry-standard security measures to protect your data.`,
  },
  "/terms-of-service": {
    title: "Terms of Service — Wax Me Too",
    description: "Wax Me Too terms of service — booking policies, cancellation policy, and service terms.",
    bodyText: `Wax Me Too Terms of Service.
Booking policy: appointments can be booked online via Mangomint. Cancellations must be made at least 24 hours in advance. Late cancellations may be subject to a fee.
Service terms: results vary by individual. We reserve the right to refuse service. First-time Brazilian wax offer ($50) is valid for new clients only.`,
  },
};

// Location detail pages
const LOCATION_SLUGS: Record<string, { name: string; address: string; phone: string; description: string }> = {
  "layton": {
    name: "Layton",
    address: "360 S Fort Ln #101, Layton, UT 84041",
    phone: "(801) 572-7771",
    description: "Our Layton studio serves Davis and Weber County clients with the same premium waxing experience Wax Me Too has delivered since 2007. Military discounts available.",
  },
  "south-jordan": {
    name: "South Jordan",
    address: "3674 W South Jordan Pkwy, South Jordan, UT 84095",
    phone: "(801) 572-7771",
    description: "Our South Jordan studio brings the full Wax Me Too signature experience to the southwest valley. Serving Utah County and Salt Lake County clients.",
  },
  "orem": {
    name: "Orem",
    address: "764 S State St #B, Orem, UT 84058",
    phone: "(801) 572-7771",
    description: "Our Orem studio serves Utah County with expert waxing services in a clean, private setting. Convenient location on State Street.",
  },
  "salt-lake-city": {
    name: "Salt Lake City",
    address: "2121 S McClelland St #100, Salt Lake City, UT 84106",
    phone: "(801) 572-7771",
    description: "Our Salt Lake City studio is centrally located to serve the greater Salt Lake metro area. Expert estheticians, private rooms, premium wax.",
  },
  "draper": {
    name: "Draper",
    address: "12065 S Lone Peak Pkwy #103, Draper, UT 84020",
    phone: "(801) 572-7771",
    description: "Our Draper studio — where Wax Me Too began in 2007 — continues to serve South Salt Lake County with the same commitment to quality.",
  },
  "st-george": {
    name: "St. George",
    address: "1091 N Bluff St #104, St. George, UT 84770",
    phone: "(435) 688-0888",
    description: "Our St. George studio has served Southern Utah since 2008. Premier waxing in a private, comfortable setting in Washington County.",
  },
};

// Blog post metadata — slug → meta (titles shortened to ≤60 chars for SEO)
const BLOG_POSTS: Record<string, { title: string; description: string; excerpt: string }> = {
  "win-complimentary-bikini-wax-summer": {
    title: "Win a Free Bikini Wax — Summer Giveaway | Wax Me Too",
    description: "Enter to win a complimentary bikini wax this summer. Find out how to enter and why waxing is the ultimate summer upgrade.",
    excerpt: "Say goodbye to razor burns and hello to silky-smooth skin this summer. Wax Me Too is giving away a complimentary bikini wax.",
  },
  "st-george-premier-waxing-salon": {
    title: "St. George's Premier Waxing Salon | Wax Me Too",
    description: "Discover Wax Me Too's St. George studio — Southern Utah's go-to waxing salon since 2008. London Brow Company products, expert estheticians.",
    excerpt: "From our roots in Draper in 2007 to St. George in 2008, Wax Me Too has been Southern Utah's go-to waxing studio for over 15 years.",
  },
  "vacation-waxing-prep-guide": {
    title: "Vacation Waxing Prep Guide | Wax Me Too Utah",
    description: "Everything you need to know about pre-vacation waxing: timing, what to ask your salon, and why a Brazilian wax is the ultimate travel essential.",
    excerpt: "Sunscreen — check. Sunglasses — check. Razor? Throw that away. Here's everything you need to know about pre-vacation waxing.",
  },
  "military-discounts-wax-me-too-layton": {
    title: "Military Discounts at Wax Me Too Layton | Utah",
    description: "Wax Me Too Layton proudly offers military discounts near Hill AFB. Meet Liz — retired Air Force Master Sergeant turned waxing expert.",
    excerpt: "At our Layton studio near Hill AFB, we proudly offer military discounts as a small token of appreciation for those who serve.",
  },
  "why-waxing-is-best-hair-removal": {
    title: "Why Waxing Is the Best Hair Removal Method",
    description: "From longer-lasting results to finer regrowth over time, here's why professional waxing is the gold standard for smooth skin.",
    excerpt: "In the world of hair removal, waxing stands apart. From longer-lasting results to finer regrowth over time.",
  },
  "bridal-waxing-guide": {
    title: "Bridal Waxing Guide — Get Smooth for Your Wedding",
    description: "Everything brides need to know about pre-wedding waxing: timeline, services, and tips from Wax Me Too Utah.",
    excerpt: "Your wedding day deserves flawless skin. Here's your complete bridal waxing timeline and guide from Wax Me Too.",
  },
  "south-jordan-waxing-salon-relocation": {
    title: "South Jordan Waxing Salon — New Location | Wax Me Too",
    description: "Wax Me Too South Jordan has moved to a new, larger studio. Same expert team, same premium waxing — new address.",
    excerpt: "We've moved! Our South Jordan studio has relocated to a new, larger space to better serve our clients.",
  },
  "south-jordan-6th-location-opening": {
    title: "South Jordan — Our 6th Utah Location | Wax Me Too",
    description: "Wax Me Too opens its 6th Utah studio in South Jordan. Book your appointment at our newest waxing salon today.",
    excerpt: "We're thrilled to announce our 6th location — South Jordan! Bringing the Wax Me Too experience to the southwest valley.",
  },
  "free-bikini-wax-layton-utah": {
    title: "Free Bikini Wax Giveaway — Layton Utah | Wax Me Too",
    description: "Win a free bikini wax at Wax Me Too Layton. Enter our giveaway and experience Utah's premier waxing studio.",
    excerpt: "Wax Me Too Layton is giving away a free bikini wax. Here's how to enter and what to expect at your first visit.",
  },
  "wax-me-too-difference-local-salon": {
    title: "The Wax Me Too Difference — Local Utah Salon",
    description: "What sets Wax Me Too apart from other Utah waxing salons? Discover our commitment to quality, privacy, and expert estheticians.",
    excerpt: "There are plenty of waxing options in Utah. Here's what makes Wax Me Too different — and why clients keep coming back.",
  },
  "summer-waxing-utah-guide": {
    title: "Summer Waxing Guide — Utah | Wax Me Too",
    description: "Get summer-ready with Wax Me Too. Your complete guide to summer waxing in Utah — timing, services, and prep tips.",
    excerpt: "Summer in Utah means outdoor adventures, pool days, and lake trips. Here's your complete guide to summer waxing.",
  },
  "first-brazilian-wax-step-by-step": {
    title: "First Brazilian Wax — Step by Step Guide | Wax Me Too",
    description: "Everything you need to know before your first Brazilian wax at Wax Me Too. Prep tips, what to expect, and aftercare.",
    excerpt: "Thinking about your first Brazilian wax? Here's a step-by-step guide to what happens before, during, and after.",
  },
  "spring-adventure-waxing-utah": {
    title: "Spring Waxing Guide — Utah Adventures | Wax Me Too",
    description: "Get smooth for spring adventures in Utah. Wax Me Too's guide to pre-season waxing for hiking, camping, and outdoor fun.",
    excerpt: "Spring in Utah means hiking, camping, and outdoor adventures. Here's how to get smooth and ready with Wax Me Too.",
  },
  "south-jordan-waxing-grand-opening": {
    title: "South Jordan Waxing Grand Opening | Wax Me Too",
    description: "Celebrate the grand opening of Wax Me Too South Jordan. Special offers, meet the team, and book your first appointment.",
    excerpt: "We're open in South Jordan! Join us for our grand opening celebration and meet our expert waxing team.",
  },
  "waxing-south-jordan-utah-opening": {
    title: "Waxing in South Jordan Utah — Now Open | Wax Me Too",
    description: "Professional waxing is now available in South Jordan, Utah. Wax Me Too brings expert Brazilian, bikini, and brow waxing to the southwest valley.",
    excerpt: "South Jordan residents can now enjoy professional waxing at Wax Me Too. Expert estheticians, private rooms, premium wax.",
  },
  "valentines-day-waxing-rippp-and-swear": {
    title: "Valentine's Day Waxing — Rip & Swear | Wax Me Too",
    description: "Get smooth for Valentine's Day with Wax Me Too. Brazilian, bikini, and brow waxing — book your appointment today.",
    excerpt: "Valentine's Day is coming. Get smooth, feel confident, and treat yourself to a professional wax at Wax Me Too.",
  },
  "valentines-day-free-wax-giveaway-2017": {
    title: "Valentine's Day Free Wax Giveaway 2017 | Wax Me Too",
    description: "Win a free wax for Valentine's Day 2017 from Wax Me Too. Enter our giveaway and get smooth for the holiday.",
    excerpt: "Celebrate Valentine's Day with smooth skin. Wax Me Too is giving away a free wax — enter to win.",
  },
  "sundance-film-festival-waxing-utah": {
    title: "Sundance Film Festival Waxing — Utah | Wax Me Too",
    description: "Get red-carpet ready for Sundance Film Festival with Wax Me Too. Professional waxing in Utah for the festival season.",
    excerpt: "Sundance Film Festival brings celebrities and film lovers to Utah. Get red-carpet smooth with Wax Me Too.",
  },
  "layton-waxing-salon-new-team": {
    title: "Layton Waxing Salon — Meet Our New Team | Wax Me Too",
    description: "Meet the new expert waxing team at Wax Me Too Layton. Licensed estheticians dedicated to your comfort and results.",
    excerpt: "We're excited to introduce our new team at Wax Me Too Layton. Meet the expert estheticians ready to serve you.",
  },
  "pre-vacation-waxing-checklist": {
    title: "Pre-Vacation Waxing Checklist | Wax Me Too Utah",
    description: "Use this pre-vacation waxing checklist from Wax Me Too to ensure you're smooth and ready for your trip.",
    excerpt: "Heading on vacation? Use this checklist to make sure your waxing is timed perfectly for your trip.",
  },
};

// ── Middleware ───────────────────────────────────────────────────────────────

/**
 * Resolve page metadata for a given URL path.
 * Returns null for API routes, assets, and unknown paths.
 */
function resolvePageMeta(urlPath: string): PageMeta | null {
  // Strip query strings and trailing slashes
  const path = urlPath.split("?")[0].replace(/\/$/, "") || "/";

  // Static pages
  if (STATIC_PAGES[path]) return STATIC_PAGES[path];

  // Location detail pages: /locations/:slug
  const locationMatch = path.match(/^\/locations\/([a-z-]+)$/);
  if (locationMatch) {
    const slug = locationMatch[1];
    const loc = LOCATION_SLUGS[slug];
    if (loc) {
      return {
        title: `${loc.name} Waxing Studio — Wax Me Too Utah`,
        description: `Professional waxing in ${loc.name}, Utah. ${loc.description} Book online today.`,
        bodyText: `Wax Me Too ${loc.name}. ${loc.address}. Phone: ${loc.phone}.
${loc.description}
Services: Brazilian Wax $65 | Deep Bikini $55 | Bikini $45 | Brow Wax $20 | Full Leg $75 | Underarm $25.
First-time clients: Brazilian wax for $50. Book at booking.mangomint.com/593822.`,
      };
    }
  }

  // Blog post pages: /blog/:slug
  const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    const post = BLOG_POSTS[slug];
    if (post) {
      return {
        title: post.title,
        description: post.description,
        bodyText: `${post.title}. ${post.excerpt}
Wax Me Too — Utah's women-owned waxing studio since 2007. 6 locations: Layton, South Jordan, Orem, Salt Lake City, Draper, St. George.
Book your appointment: booking.mangomint.com/593822.`,
      };
    }
  }

  return null;
}

/**
 * Inject page-specific SEO content into the HTML template.
 * - Replaces <title> tag
 * - Replaces meta description
 * - Injects a <noscript> block with visible body text for crawlers
 */
export function injectSEO(html: string, urlPath: string): string {
  const meta = resolvePageMeta(urlPath);
  if (!meta) return html;
  return _injectSEO(html, meta);
}

function _injectSEO(html: string, meta: PageMeta): string {
  let result = html;

  // Replace title
  result = result.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(meta.title)}</title>`
  );

  // Replace meta description
  result = result.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(meta.description)}"`
  );

  // Inject prerender body text before </body>
  // Uses a visually-hidden div so it doesn't affect layout but is readable by crawlers
  const prerenderBlock = `
<div id="prerender-content" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;" aria-hidden="true">
${escapeHtml(meta.bodyText)}
</div>`;

  result = result.replace("</body>", `${prerenderBlock}\n</body>`);

  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Express middleware — intercepts HTML responses and injects SEO content.
 * Only runs for page routes (not API, assets, or unknown paths).
 */
export function seoPrerender(req: Request, res: Response, next: NextFunction): void {
  // Skip non-GET requests and API/asset routes
  if (req.method !== "GET") return next();
  const path = req.path;
  if (
    path.startsWith("/api/") ||
    path.startsWith("/assets/") ||
    path.startsWith("/manus-storage/") ||
    path.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|xml|txt|json)$/)
  ) {
    return next();
  }

  const meta = resolvePageMeta(path);
    // Intercept res.send to inject SEO content into HTML responses
  const originalSend = res.send.bind(res);
  res.send = function (body: unknown): Response {
    if (typeof body === "string" && body.includes("<!doctype html>")) {
      return originalSend(injectSEO(body, path));
    }
    return originalSend(body);
  };
  next();
}
