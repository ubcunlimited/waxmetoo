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
  /** Absolute URL of the Open Graph image for this page (optional) */
  ogImage?: string;
}

// ── Blog post hero images map — slug → absolute image URL ──────────────────
// Sourced from client/src/lib/blogPosts.ts `image` field.
// Used to inject <meta property="og:image"> server-side so social crawlers
// (Facebook, Twitter, LinkedIn, Slack, etc.) see the correct preview image
// without waiting for React to hydrate.
const BLOG_POST_IMAGES: Record<string, string> = {
  "win-complimentary-bikini-wax-summer": "/manus-storage/thumb-1507525428034_9da1380b.jpg",
  "st-george-premier-waxing-salon": "/manus-storage/thumb-1540555700478_f79f2139.jpg",
  "vacation-waxing-prep-guide": "/manus-storage/thumb-1631729371254_9b52fd6e.jpg",
  "military-discounts-wax-me-too-layton": "/manus-storage/thumb-1570172619644_8c189528.jpg",
  "why-waxing-is-best-hair-removal": "/manus-storage/thumb-1519741497674_3892d54d.jpg",
  "bridal-waxing-guide": "/manus-storage/thumb-1560066984_d0aecbb5.jpg",
  "south-jordan-waxing-salon-relocation": "/manus-storage/thumb-1600334129128_7ec82184.jpg",
  "south-jordan-6th-location-opening": "/manus-storage/thumb-1576426863848_fa71e081.jpg",
  "free-bikini-wax-layton-utah": "/manus-storage/thumb-1530053969600_f4f4a4e1.jpg",
  "wax-me-too-difference-local-salon": "/manus-storage/thumb-1607008829749_1a9d7410.jpg",
  "summer-waxing-utah-guide": "/manus-storage/thumb-1604654894610_6c83d87e.jpg",
  "first-brazilian-wax-step-by-step": "/manus-storage/first-brazilian-wax-thumb_b9d7288c.jpg",
  "spring-adventure-waxing-utah": "/manus-storage/thumb-1490481651871_0a83efa0.jpg",
  "south-jordan-waxing-grand-opening": "/manus-storage/thumb-1515377905703_6486d3af.jpg",
  "waxing-south-jordan-utah-opening": "/manus-storage/thumb-1596755389378_3b609953.jpg",
  "valentines-day-waxing-rippp-and-swear": "/manus-storage/thumb-1571781926291_30fdb631.jpg",
  "valentines-day-free-wax-giveaway-2017": "/manus-storage/thumb-1560750588_a2164f4a.jpg",
  "sundance-film-festival-waxing-utah": "/manus-storage/sundance-film-festival-waxing-utah_41dbbf52.webp",
  "layton-waxing-salon-new-team": "/manus-storage/thumb-1616394584738_051cb0ac.jpg",
  "pre-vacation-waxing-checklist": "/manus-storage/thumb-1600334089648_c46567a7.jpg",
  "free-bikini-wax-drawing-utah": "/manus-storage/thumb-1629909613654_45159ee8.jpg",
  "holiday-waxing-on-top-of-the-world": "/manus-storage/thumb-1544161515_defe5b64.jpg",
  "3-worst-things-waxing-salon": "/manus-storage/thumb-1583416750470_0b5ff0ac.jpg",
  "underarm-waxing-guide-utah": "/manus-storage/thumb-1519415510236_10d1cd6d.jpg",
  "throw-away-your-razor": "/manus-storage/thumb-1476514525535_89864729.jpg",
  "bikini-wax-types-explained": "/manus-storage/thumb-1518199266791_01cb48b4.jpg",
  "naked-and-afraid-first-brazilian": "/manus-storage/thumb-1549465220_bbd0e081.jpg",
  "mens-eyebrow-waxing-metrosexual": "/manus-storage/thumb-1518895312237_446b531b.jpg",
  "eyebrow-design-waxing-guide": "/manus-storage/thumb-1606107557195_b81c0a8b.jpg",
  "hair-removal-layton-utah": "/manus-storage/thumb-1503023345310_a2c4a034.jpg",
  "brazilian-waxing-salon-qa": "/manus-storage/thumb-1529156069898_7dfbcff6.jpg",
  "prevention-magazine-bikini-wax-tips": "/manus-storage/thumb-1551524164_33a53d15.jpg",
  "layton-waxing-milly-speaks-spanish": "/manus-storage/thumb-1512290923902_17d1b159.jpg",
  "valentines-day-brazilian-wax-gift": "/manus-storage/thumb-1487412912498_1fcd4b00.jpg",
  "layton-waxing-salon-new-location": "/manus-storage/thumb-1555252333_8423120f.jpg",
  "15-minute-brazilian-wax-experience": "/manus-storage/thumb-1596178060671_845972d3.jpg",
  "draper-waxing-salon-expansion": "/manus-storage/thumb-1571019613454_bb34812d.jpg",
  "salt-lake-city-waxing-salon": "/manus-storage/thumb-1522337360788_9d1ca454.jpg",
  "valentines-day-free-brazilian-2013": "/manus-storage/thumb-1500840216050_5b268720.jpg",
  "utah-waxing-salon-established-2007": "/manus-storage/thumb-1526045612212_720bb3db.jpg",
  "brazilian-wax-benefits-vs-shaving": "/manus-storage/thumb-1559599101_0c4e427f.jpg",
  "waxing-while-pregnant-utah": "/manus-storage/thumb-1533681904393_5fff670d.jpg",
  "ingrown-hair-prevention-waxing": "/manus-storage/thumb-1599305090598_f63f2197.jpg",
  "waxing-sensitive-skin-guide": "/manus-storage/thumb-1612817288484_6cb53bb8.jpg",
  "how-often-should-you-wax": "/manus-storage/how-often-should-you-wax_b3f20f61.webp",
  "waxing-for-men-manzilian-guide": "/manus-storage/thumb-1588776814546_bc49132e.jpg",
  "st-george-waxing-salon-utah": "/manus-storage/thumb-1516975080664_2ec99f3e.jpg",
  "waxing-aftercare-guide": "/manus-storage/waxing-aftercare-guide_f980cdd4.webp",
  "waxing-before-care-guide": "/manus-storage/thumb-1508214751196_775253a1.jpg",
  "wax-me-too-happy-faces-community": "/manus-storage/thumb-1509909756405_c845dd58.jpg",
  "waxing-faq-utah": "/manus-storage/thumb-1504674900247_e5f5a8d9.jpg",
};

// Static page definitions — keep in sync with client/src/lib/* data files
const STATIC_PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Wax Me Too — Professional Waxing Studio | Est. 2007",
    description:
      "Utah's women-owned waxing studio since 2007. Brazilian, bikini, brow & body waxing across 6 locations. Book your appointment today.",
    bodyText: `<h2>Wax Me Too — Professional Waxing Studio</h2>
Utah's premier women-owned waxing studio, serving clients since 2007 across 6 locations: Layton, South Jordan, Orem, Salt Lake City, Draper, and St. George.
Brazilian Waxing Perfected. Our expert estheticians specialize in Brazilian wax, bikini wax, brow wax, brow lamination, underarm wax, leg wax, and full body waxing. Every room is private, every applicator is single-use, and every appointment is designed to make you feel comfortable and confident.
Services: Brazilian Wax $65 | Deep Bikini Wax $55 | Bikini Wax $45 | Brow Wax $20 | Brow Lamination $75 | Lip Wax $12 | Chin Wax $12 | Full Leg Wax $75 | Half Leg Wax $45 | Underarm Wax $25.
First-time clients: Brazilian wax for $50. All prices standardized across all 6 Utah locations as of June 2026.
Book your appointment online at booking.mangomint.com/593822.`,
  },
  "/services": {
    title: "Waxing Services & Pricing — Wax Me Too Utah",
    description:
      "Browse our full waxing menu — Brazilian, bikini, brow & body waxing. Standardized pricing guaranteed across all 6 Utah locations. First-time Brazilian wax $50.",
    bodyText: `<h2>Waxing Services & Pricing — Wax Me Too Utah</h2>
Wax Me Too offers a full menu of professional waxing services at standardized prices across all 6 Utah locations as of June 2026.
NEW! Lamination & Brow Treatments: Brow Lamination $75 | Brow Lamination and Tint $95. The London Brow Company products used exclusively at Wax Me Too.
Bikini Waxing: Brazilian Wax $65 | Deep Bikini Wax $55 | Bikini Wax $45. First-time Brazilian wax for new clients: $50.
Brow & Face Waxing: Brow Wax $20 | Brow Wax & Tint $35 | Lip Wax $12 | Chin Wax $12 | Full Face Wax $45.
Body Waxing: Underarm Wax $25 | Half Arm Wax $30 | Full Arm Wax $45 | Half Leg Wax $45 | Full Leg Wax $75 | Back Wax $55 | Chest Wax $45.
All services performed by licensed estheticians in private rooms. Single-use applicators. No memberships required. Book online at booking.mangomint.com/593822.`,
  },
  "/locations": {
    title: "Wax Me Too Locations — 6 Utah Studios",
    description:
      "Find your nearest Wax Me Too studio in Layton, South Jordan, Orem, Salt Lake City, Draper, or St. George. Book online today.",
    bodyText: `<h2>Wax Me Too Locations — 6 Utah Waxing Studios</h2>
Wax Me Too has 6 professional waxing studios across Utah. All locations offer the same expert estheticians, private rooms, premium wax, and standardized pricing.
Layton: 360 S Fort Ln #101, Layton, UT 84041. Phone: (801) 572-7771. Mon–Fri 9am–7pm, Sat 9am–5pm. Near Hill Air Force Base. Military discounts available.
South Jordan: 3674 W South Jordan Pkwy, South Jordan, UT 84095. Phone: (801) 572-7771. Mon–Fri 9am–7pm, Sat 9am–5pm. Serving southwest Salt Lake County and Utah County.
Orem: 764 S State St #B, Orem, UT 84058. Phone: (801) 572-7771. Mon–Fri 9am–7pm, Sat 9am–5pm. Convenient State Street location serving Utah County.
Salt Lake City: 2121 S McClelland St #100, Salt Lake City, UT 84106. Phone: (801) 572-7771. Mon–Fri 9am–7pm, Sat 9am–5pm. Centrally located in the Sugar House area.
Draper: 12065 S Lone Peak Pkwy #103, Draper, UT 84020. Phone: (801) 572-7771. Mon–Fri 9am–7pm, Sat 9am–5pm. Our original location, open since 2007.
St. George: 1091 N Bluff St #104, St. George, UT 84770. Phone: (435) 688-0888. Mon–Fri 9am–6pm, Sat 9am–5pm. Serving Washington County and Mesquite, NV since 2008.`,
  },
  "/about": {
    title: "About Wax Me Too — Utah's Women-Owned Studio Since 2007",
    description:
      "Learn about Wax Me Too's story — Utah's women-owned waxing studio founded in 2007. Meet our expert estheticians and discover our commitment to quality.",
    bodyText: `<h2>About Wax Me Too — Utah's Women-Owned Waxing Studio</h2>
Wax Me Too is Utah's first and most trusted waxing-only studio, founded in 2007 by two best friends with a shared vision: to create a clean, private, and professional waxing experience for every client.
Our story began in Draper in 2007, when we opened Utah's first waxing-only salon. Today, we have grown to 6 locations across the state: Layton, South Jordan, Orem, Salt Lake City, Draper, and St. George.
What makes Wax Me Too different: We are locally owned and operated by women — not a franchise, not backed by outside investors. When you book with us, you are supporting Utah women directly. Every treatment room has a sink so your esthetician can wash her hands in front of you before every service. We use single-use applicators — no double-dipping, ever. No memberships, no pressure, transparent pricing.
Our estheticians are licensed professionals trained in the latest waxing techniques. We use premium hard wax for sensitive areas and soft wax for larger body areas. Every room is private and sanitized between appointments. We step out of the room while you prepare, ensuring you always feel comfortable and respected.`,
  },
  "/faq": {
    title: "Waxing FAQ — Common Questions Answered | Wax Me Too",
    description:
      "Answers to your most common waxing questions — prep tips, pain levels, pricing, and what to expect at Wax Me Too. Pricing last updated June 2026.",
    bodyText: `<h2>Waxing FAQ — Frequently Asked Questions</h2>
Frequently Asked Questions about waxing at Wax Me Too, Utah's professional waxing studio since 2007.
Does waxing hurt? Most clients describe waxing as a quick sting that fades immediately. Brazilian and bikini waxing is more sensitive than brow or leg waxing, but our estheticians use techniques to minimize discomfort. Clients who wax regularly report that it becomes noticeably more comfortable after a few sessions.
How long does hair need to be? At least 1/4 inch (about 2–3 weeks of growth from your last shave) for best results. Avoid shaving for at least 3 weeks before your appointment. If hair is too short, the wax cannot grip it effectively.
How long do results last? Most clients enjoy smooth skin for 3–6 weeks. With regular waxing, hair grows back finer and sparser over time. Many long-term clients notice significantly less regrowth after 1–2 years of consistent waxing.
How should I prepare for my appointment? Exfoliate gently 24–48 hours before. Avoid retinol, AHAs, and BHAs for 48 hours before waxing. Do not apply lotion on the day of your appointment. Wear loose, comfortable clothing.
What should I do after my wax? Avoid heat (hot showers, saunas, sun) for 24–48 hours. Do not apply makeup, deodorant, or perfumed products to waxed areas for 24 hours. Exfoliate starting 48 hours after your appointment to prevent ingrown hairs.
Pricing: Brazilian Wax $65 | Deep Bikini $55 | Bikini $45 | Brow Wax $20 | Brow Lamination $75 | Underarm $25 | Full Leg $75. First-time Brazilian wax $50. Pricing standardized across all 6 Utah locations as of June 2026.`,
  },
  "/blog": {
    title: "Waxing Tips, News & Guides — Wax Me Too Blog",
    description:
      "Expert waxing tips, prep guides, location news, and promotions from Utah's premier waxing studio. Read the Wax Me Too blog.",
    bodyText: `<h2>Wax Me Too Blog — Waxing Tips, News & Guides</h2>
Expert waxing tips, preparation guides, aftercare advice, location news, and promotions from Utah's women-owned waxing studio since 2007.
Categories: Education | Prep & Care | Locations | Promotions | Bridal | Lifestyle | Community.
Featured articles: Your First Brazilian Wax at Wax Me Too: What to Know | How to Prep for Your Vacation with Wax Me Too | Why Waxing Is the Best Hair Removal Method | Pre-Wedding Waxing: Brows to Toes Bridal Guide | Summer Waxing in Utah: Stay Smooth All Season | Brazilian Wax vs. Shaving: Why Waxing Wins | Underarm Waxing Guide | How Often Should You Wax? | Waxing Aftercare Guide | Waxing Before Care Guide.
Wax Me Too has 6 locations across Utah: Layton, South Jordan, Orem, Salt Lake City, Draper, and St. George. Book your appointment online at booking.mangomint.com/593822.`,
  },
  "/contact": {
    title: "Contact Wax Me Too — Utah Waxing Studios",
    description:
      "Get in touch with Wax Me Too. Find phone numbers, emails, and addresses for all 6 Utah waxing studio locations.",
    bodyText: `<h2>Contact Wax Me Too — Utah Waxing Studios</h2>
Get in touch with Wax Me Too. We have 6 professional waxing studios across Utah.
General inquiries: hello@waxmetoo.com. Main phone: (801) 572-7771.
Layton: 360 S Fort Ln #101, Layton, UT 84041. Phone: (801) 572-7771.
South Jordan: 3674 W South Jordan Pkwy, South Jordan, UT 84095. Phone: (801) 572-7771.
Orem: 764 S State St #B, Orem, UT 84058. Phone: (801) 572-7771.
Salt Lake City: 2121 S McClelland St #100, Salt Lake City, UT 84106. Phone: (801) 572-7771.
Draper: 12065 S Lone Peak Pkwy #103, Draper, UT 84020. Phone: (801) 572-7771.
St. George: 1091 N Bluff St #104, St. George, UT 84770. Phone: (435) 688-0888.
Book your appointment online at booking.mangomint.com/593822 or call your nearest studio. Walk-ins welcome based on availability.`,
  },
  "/first-visit": {
    title: "Your First Waxing Visit — What to Expect | Wax Me Too",
    description:
      "Everything you need to know before your first wax at Wax Me Too. Prep tips, what to wear, and how to get the best results.",
    bodyText: `<h2>Your First Waxing Visit at Wax Me Too — What to Expect</h2>
Everything you need to know before your first wax at Wax Me Too, Utah's professional waxing studio since 2007.
Before your appointment: let hair grow to at least 1/4 inch (about 2–3 weeks from your last shave). Exfoliate gently 24–48 hours before your appointment. Avoid retinol, AHAs, and BHAs for 48 hours before waxing. Do not apply lotion, oils, or self-tanner on the day of your appointment. Avoid caffeine before sensitive-area waxing.
What to wear: loose, comfortable clothing. For Brazilian or bikini waxing, avoid tight jeans or leggings after your appointment.
During your appointment: your esthetician will greet you, review your service, and answer any questions. All rooms are private. We step out while you prepare. We use premium hard wax for sensitive areas (Brazilian, bikini, underarm) and soft wax for larger body areas (legs, back, arms).
After your appointment: avoid heat for 24–48 hours. No hot showers, saunas, or sun exposure. Exfoliate starting 48 hours after your appointment to prevent ingrown hairs.
First-time clients: Brazilian wax for $50. Book at booking.mangomint.com/593822.`,
  },
  "/before-care": {
    title: "Pre-Wax Care Tips — How to Prepare | Wax Me Too",
    description:
      "Follow these pre-wax care tips to get the best results from your waxing appointment at Wax Me Too.",
    bodyText: `<h2>Pre-Wax Care Tips — How to Prepare for Your Waxing Appointment</h2>
Follow these pre-wax care tips from Wax Me Too to get the best results from your waxing appointment.
Hair length: let hair grow to at least 1/4 inch (about 2–3 weeks from your last shave). This is the minimum length for the wax to grip effectively. If hair is too short, we may need to reschedule your appointment.
Exfoliation: exfoliate gently 24–48 hours before your appointment to remove dead skin cells and help prevent ingrown hairs. Do not exfoliate on the day of your appointment, as this can make skin more sensitive.
Skin care products to avoid: do not use retinol, AHAs (glycolic acid, lactic acid), or BHAs (salicylic acid) for 48 hours before waxing. These ingredients thin the skin and increase the risk of lifting or irritation during waxing.
Day of appointment: do not apply lotion, oils, body butter, or self-tanner to the areas being waxed. Clean, dry skin allows the wax to adhere properly. Avoid caffeine before sensitive-area waxing (Brazilian, bikini) as it can increase skin sensitivity.
Sun exposure: avoid prolonged sun exposure or tanning beds for 24–48 hours before your appointment. Sunburned skin cannot be waxed.`,
  },
  "/after-care": {
    title: "Post-Wax Care Tips — Keep Skin Smooth | Wax Me Too",
    description:
      "Follow these after-wax care tips to keep skin smooth, prevent ingrown hairs, and extend your waxing results.",
    bodyText: `<h2>Post-Wax Care Tips — Keep Skin Smooth After Waxing</h2>
Follow these aftercare tips from Wax Me Too to keep skin smooth, prevent ingrown hairs, and extend your waxing results.
First 24–48 hours: avoid heat in all forms — no hot showers, hot baths, saunas, steam rooms, or hot tubs. Heat opens pores and can cause irritation or infection in freshly waxed skin. Avoid sun exposure and tanning beds for at least 48 hours after waxing.
Skin care products: do not apply makeup, deodorant, perfumed products, or body lotion with fragrance to waxed areas for 24 hours. Use only fragrance-free, gentle products on freshly waxed skin.
Exfoliation: start exfoliating gently 48 hours after your appointment, 2–3 times per week. Regular exfoliation removes dead skin cells and is the most effective way to prevent ingrown hairs. Use a gentle scrub or exfoliating mitt.
Moisturizing: moisturize daily with a fragrance-free lotion to keep skin soft and hydrated. Well-moisturized skin produces finer, softer hair regrowth over time.
Next appointment: book your next appointment in 4–6 weeks for best results. Regular waxing clients experience progressively finer, sparser regrowth over time.`,
  },
  "/privacy-policy": {
    title: "Privacy Policy — Wax Me Too",
    description: "Wax Me Too privacy policy — how we collect, use, and protect your personal information.",
    bodyText: `<h2>Privacy Policy — Wax Me Too</h2>
Wax Me Too Privacy Policy. Last updated 2024.
We collect personal information you provide when booking appointments or contacting us, including your name, email address, and phone number. We use this information solely to process bookings, send appointment reminders, and communicate about our services.
We do not sell, rent, or share your personal information with third parties for marketing purposes. We use industry-standard security measures to protect your data, including encrypted connections (HTTPS) and secure servers.
You may request deletion of your personal data at any time by contacting us at hello@waxmetoo.com. We retain booking records as required by applicable law.
For questions about this policy, contact Wax Me Too at hello@waxmetoo.com or (801) 572-7771.`,
  },
  "/terms-of-service": {
    title: "Terms of Service — Wax Me Too",
    description: "Wax Me Too terms of service — booking policies, cancellation policy, and service terms.",
    bodyText: `<h2>Terms of Service — Wax Me Too</h2>
Wax Me Too Terms of Service. By booking an appointment, you agree to the following terms.
Booking policy: appointments can be booked online via Mangomint at booking.mangomint.com/593822 or by calling (801) 572-7771. Walk-ins are welcome based on availability.
Cancellation policy: cancellations must be made at least 24 hours in advance. Late cancellations or no-shows may be subject to a cancellation fee. We reserve the right to charge a deposit for future bookings after repeated no-shows.
Service terms: results vary by individual. Hair must be at least 1/4 inch long for effective waxing. We reserve the right to refuse service if hair is too short or if skin conditions make waxing unsafe. First-time Brazilian wax offer ($50) is valid for new clients only, one per person.
Health and safety: please inform your esthetician of any medications, skin conditions, or recent treatments before your appointment. We use single-use applicators and sanitize all equipment between clients.`,
  },
  "/win-a-free-wax": {
    title: "Win a Free Wax — Monthly Giveaway | Wax Me Too",
    description: "Enter to win a complimentary waxing service at Wax Me Too Utah. One winner drawn every month from all confirmed entries. Open to new and returning clients.",
    bodyText: `<h2>Win a Free Wax — Monthly Giveaway</h2>
Enter Wax Me Too's monthly giveaway for a chance to win a complimentary waxing service. One winner is drawn each month from all confirmed entries.
How to enter: fill out the form with your first name, last name, and email address. You will receive a confirmation email — click the link inside to complete your entry. Only confirmed entries are eligible to win.
Prize: one complimentary waxing service per month. The winner is notified by email and text. The prize is non-transferable and has no cash value.
Wax Me Too is Utah's women-owned waxing studio since 2007. We have 6 locations across Utah: Layton, South Jordan, Orem, Salt Lake City, Draper, and St. George. Services include Brazilian wax, bikini wax, brow wax, brow lamination, underarm wax, leg wax, and full body waxing.
First-time clients: Brazilian wax for $50. Book online at booking.mangomint.com/593822.`,
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
const BLOG_BODY_TEXTS: Record<string, string> = {
  "win-complimentary-bikini-wax-summer": "Summer is just around the corner, and at Wax Me Too — Utah's premier professional waxing studio — we're celebrating the season with something special: a chance to win a complimentary bikini wax. All you have to do is fill out a quick form on our website. Winners are announced by text monthly, sometimes sooner! Why are we giving away free bikini waxes? Because summer is the perfect time to treat yourself — and we want to help you feel beach-ready and confident all season long. <h2>Get Beach-Ready with a Summer Upgrade</h2> Picture yourself floating on crystal-clear water at the beach or poolside, completely confident in your swimsuit. That's the Wax Me Too promise. Professional waxing removes hair from the root, leaving your skin silky smooth for 3–6 weeks — no razor burns, no nicks, no daily shaving routine. And if you're feeling adventurous, you can always upgrade your bikini wax to a full Brazilian wax for a small additional fee. Once you experience the results, you'll wonder why you waited so long. <h2>The Real Benefits of Professional Waxing</h2> Waxing isn't just about aesthetics — it's a long-term investment in your skin. Here's what regular waxing clients experience over time: Finer, sparser regrowth. With each waxing session, hair grows back progressively finer and softer. Long-term clients often report that their appointments become noticeably more comfortable after just a few sessions. No more daily shaving. Say goodbye to the morning razor routine and hello to weeks of smooth, carefree skin. Better skin texture. Waxing acts as a mild exfoliant, removing dead skin cells along with unwanted hair and leaving skin visibly smoother. Long-lasting results. Unlike shaving, which only lasts a day or two, a professional wax keeps you smooth for 3–6 weeks depending on your hair growth cycle. <h2>What to Look for in a Professional Waxing Salon</h2> Not all waxing experiences are equal.skin during summer months is essential. After your wax, always apply SPF to freshly waxed areas before sun exposure — skin is more sensitive immediately after a waxing service. Stay hydrated, moisturize daily with a fragrance-free lotion, and exfoliate gently 2–3 times per week starting 48 hours after your appointment to prevent ingrown hairs. <h2>About Wax Me Too Salons</h2> Wax Me Too has been serving Utah since 2007. We are a locally run, women-owned business — and the first waxing-only salon to open in Utah . Today, we have 6 locations across the state: Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. From Weber County to Utah County, and from Washington County to Mesquite, Nevada, we're Utah's most trusted name in professional waxing. Ready to enter the giveaway? Visit our website, scroll to the bottom of the page, and fill out the form. Your smooth summer starts here. You can also view our full waxing menu or find a Wax Me Too location near you to book your first appointment.",
  "st-george-premier-waxing-salon": "Hello, St. George! Let's take a journey back to 2007, when Wax Me Too Salons — Utah's pioneering waxing-only studio — first opened its doors in Draper. By 2008, we proudly extended our services to the beautiful city of St. George. And now, in 2024, we remain the premier waxing salon in Southern Utah , operating out of Salon Aubri McKai with two full treatment rooms on the upper floor. <h2>Who We Serve in St. George</h2> Our St. George clientele is as diverse as the city itself. From students at Dixie State and Utah Tech to working professionals, retirees living the good life in the most beautiful desert area of the state, and visitors from nearby Mesquite, Nevada — we welcome everyone. Whether you're a longtime patron or considering waxing for the first time, the Wax Me Too experience is designed to make you feel comfortable, confident, and cared for. <h2>Our Signature Services</h2> We specialize in the ever-popular Brazilian wax , catering to both men and women. Yes — gentlemen, we offer the renowned \"Manzilian\" service as well. But our expertise doesn't stop there. Our licensed estheticians excel in: Eyebrow design, waxing, and tinting Full body waxing — from brows to toes and anything in between Brow treatments featuring The London Brow Company product line Introducing The London Brow Company — Exclusively at Wax Me Too We are proud to be the exclusive salon in the entire state of Utah to carry The London Brow Company's extraordinary product line. These products are renowned for their exceptional quality, vegan formulations, and commitment to cruelty-free, sustainable production. Every product is crafted with care for both your skin and the environment. At Wax Me Too, we align with brands that share our values — and The London Brow Company embodies exactly that: outstanding results, ethical practices, and a deep respect for animal welfare. <h2>What Sets Wax Me Too Apart</h2> In a market full of waxing options, here's what makes Wax Me Too different: Locally owned and operated by women. We're not a franchise. We're not backed by outside investors. When you wax with us, you're supporting Utah women directly. Sinks in every treatment room. We believe your esthetician should wash her hands in front of you before every service — and our rooms are designed to make that possible. No memberships. No pressure. Transparent pricing and a \"no hairs left behind\" guarantee on every service. Privacy and dignity. We step out of the room while you prepare, ensuring you always feel comfortable and respected. <h2>Book Your St. George Waxing Appointment</h2> Our St. George studio is located inside Salon Aubri McKai. We serve clients from across Washington County and neighboring Mesquite, Nevada. Book online at waxmetoo.com — it takes just a few clicks to find your preferred esthetician, service, and time slot. View our St. George location details or browse our full services menu .",
  "vacation-waxing-prep-guide": "Sunscreen — check. Sunglasses — check. Itsy bitsy bikini — check. Razor? Throw that away. Whether you're jetting off to a tropical beach or escaping Utah's winter for a sunny resort, pre-vacation waxing is the single best thing you can do for your skin before you go. At Wax Me Too , Utah's professional waxing studio since 2007, we've helped thousands of clients step into paradise with smooth, confident skin. Here's everything you need to know. <h2>Timing Is Everything: When to Book Before Your Trip</h2> The golden rule of pre-vacation waxing: book your appointment 2–3 days before you leave. This gives your skin time to settle after the service while ensuring you arrive at your destination completely hair-free. That means up to 2–3 weeks of smooth skin without a single thought about shaving. One important note: your hair needs to be at least ¼ inch long (roughly 10 days of growth after shaving, or 3 to 4 weeks after waxing) for the wax to grip effectively. If you've been shaving regularly, stop at least 10 days before your appointment. If you're a first-time waxer, we strongly recommend not waiting until the day before your vacation to try it out. While most clients experience only mild, temporary redness, a small number may have a skin reaction. Give yourself time to see how your skin responds before your trip. <h2>Questions to Ask Before Choosing a Waxing Salon</h2> Not all waxing salons are created equal. Before booking, here are the key questions to ask: Is there a sink in the treatment room? Your esthetician should wash her hands in front of you before beginning. This is a non-negotiable hygiene standard at Wax Me Too. Do they use gloves? Gloves provide an extra layer of protection and are standard practice at our studios. Do they double-dip? Reusing the same applicator stick in the wax pot is a serious hygiene violation. At Wax Me Too, we use fresh, single-use applicators for every client — always. How experienced are their estheticians? Mastering the Brazilian wax takes real skill and practice. Our team has years of experience and specializes exclusively in waxing. <h2>The Brazilian Wax: Your Best Vacation Investment</h2> For beach and pool vacations, the Brazilian wax is the ultimate pre-trip service. Here's why: Weeks of smooth, confident skin. No worrying about stubble peeking out of your swimsuit. No razor burns. No ingrown hairs from shaving in a hotel bathroom. Long-lasting results. A single Brazilian wax provides 3–6 weeks of smoothness — more than enough to cover your entire trip and then some. Hygienic and comfortable. Waxing removes hair from the root, reducing the risk of irritation and ingrown hairs compared to shaving. Customizable. Whether you prefer a completely bare look or a neatly trimmed style, our estheticians will work to your preferences. <h2>Pre-Vacation Waxing for Men Too</h2> Men are increasingly choosing waxing as their preferred grooming method before vacations. Popular services include: Back and chest waxing — for a clean, polished look at the beach or pool The Manzilian — our Brazilian wax service for men, performed with the same expertise and discretion Arm and leg waxing — for athletes and anyone who prefers a smooth, low-maintenance look Book at Any of Our 6 Utah Locations Wax Me Too has 6 convenient locations across Utah: Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Find your nearest location and book online in minutes. Before your first visit, read our pre-wax preparation guide to get the best results. First-time clients get their Brazilian wax for $50.",
  "military-discounts-wax-me-too-layton": "At Wax Me Too in Layton, Utah , we have always held a deep respect for the men and women who serve our country. Located just minutes from Hill Air Force Base , our Layton studio has been a trusted destination for military personnel and their families since we opened our doors in that community. <h2>Meet Liz: Retired Air Force Master Sergeant, Waxing Expert</h2> In 2018, we welcomed a remarkable addition to our Layton team: Liz , a retired Air Force Master Sergeant whose dedication to service seamlessly transitioned into a passion for esthetics. After retiring from the Air Force, Liz pursued her dream of mastering the art of skincare and waxing, completing her esthetics education before joining our team. Now in 2024, we celebrate six years of Liz's tenure as one of our most beloved waxing professionals. Her precision, professionalism, and genuine care for every client reflect the same values she carried throughout her military career. Clients who book with Liz often become long-term regulars — and it's easy to see why. <h2>Our Military Discount Program</h2> As a gesture of gratitude to our nation's heroes, Wax Me Too Layton proudly offers special pricing for all active military personnel and their families. When booking online, simply look for the \"military discount\" option on our most popular services. It's our humble way of saying thank you to those who have given so much in service to our country. We understand the unique challenges faced by military families — the demanding schedules, the deployments, the constant transitions. Our flexible booking system and extended hours (open early to late, Monday through Saturday) are designed to accommodate even the busiest schedules. <h2>What Makes Our Layton Studio Special</h2> Our Layton location at 360 S Fort Lane #101 is one of our flagship studios. Here's what sets it apart: A team of six expert estheticians , each bringing a unique blend of skill and passion to their craft Flexible scheduling — our estheticians set their own hours, which means more availability for clients with non-traditional schedules Family-first culture — we believe in supporting our team members' personal lives, which translates to a happier, more dedicated staff No memberships, no pressure — just honest, transparent pricing and exceptional service every time Booking Your Appointment Book online at waxmetoo.com and select the Layton location. You'll see a full list of our estheticians, available services, and appointment times. Military personnel: look for the military discount option when selecting your service. We're honored to serve you.",
  "why-waxing-is-best-hair-removal": "When it comes to hair removal, the options seem endless — shaving, depilatory creams, laser, threading, sugaring. But for millions of people, professional waxing remains the gold standard. At Wax Me Too , Utah's waxing-only studio since 2007, we've seen firsthand why clients who try professional waxing rarely go back to anything else. <h2>Why Waxing Outperforms Other Hair Removal Methods</h2> The fundamental difference between waxing and shaving is simple: waxing removes hair from the root , while shaving only cuts it at the surface. This single distinction creates a cascade of benefits: Longer-lasting results. Shaving lasts 1–3 days. Waxing lasts 3–6 weeks. The math speaks for itself. Finer regrowth over time. With consistent waxing, hair grows back progressively finer, softer, and sparser. Long-term clients often report that their hair barely grows back at all in some areas after years of regular waxing. No razor burn or stubble. Waxed skin is genuinely smooth — not the sandpaper-like texture that appears within hours of shaving. Exfoliation benefit. Waxing removes a layer of dead skin cells along with the hair, leaving skin visibly smoother and more radiant. What to Look for in a Professional Waxing Salon Not all waxing experiences are equal. The quality of your results depends heavily on the skill of your esthetician and the standards of the salon. Here's what separates a great waxing studio from a mediocre one: No double-dipping. Reusing the same applicator stick in the wax pot is a hygiene violation that can spread bacteria. At Wax Me Too, we use fresh, single-use applicators for every client — no exceptions. Sinks in the treatment room. Your esthetician should wash her hands in your presence before beginning any service. Our treatment rooms are all equipped with sinks for exactly this reason. Experienced estheticians. Brazilian waxing is a skill that takes time to master. Our team specializes exclusively in waxing, which means they perform these services every day and have refined their technique over years of practice. Privacy and dignity. A professional salon respects your comfort. At Wax Me Too, we step out of the room while you prepare, and we ensure you never feel rushed or uncomfortable. <h2>The Brazilian Wax: Utah's Most Popular Service</h2> Among all waxing services, the Brazilian wax is consistently our most requested. It's also the service that generates the most questions from first-time clients — and understandably so. Here's what you should know: The appointment is scheduled for 30 minutes, though the actual waxing typically takes about 15 minutes. The extra time ensures you never feel rushed. Our estheticians are licensed professionals who perform this service daily. To them, it's simply their craft — and they're exceptionally good at it. First-time clients are often surprised by how manageable the experience is. Most describe it as a quick, sharp sensation that passes immediately — and it gets easier with every subsequent visit. Wax Me Too: Utah's Waxing Specialists Since 2007 We opened Utah's first waxing-only salon in 2007 and have grown to 6 locations across the state. Our studios are locally owned and operated by women — not a franchise, not backed by outside investors. When you wax with us, you're supporting Utah women and receiving the expertise of a team that does nothing but wax, all day, every day.",
  "bridal-waxing-guide": "Your wedding day is one of the most photographed, most celebrated days of your life. Every detail matters — from your dress to your flowers to your skin. At Wax Me Too , Utah's premier waxing studio, we've helped hundreds of brides achieve flawless, radiant skin for their big day. Here's everything you need to know about pre-wedding waxing. Why Brides Should Start Waxing Early We recommend that brides-to-be begin their waxing regimen at least 2–3 sessions before the wedding day — ideally starting 2–3 months in advance. Here's why: Session 1: The assessment. Your first waxing session allows you to see how your skin responds to the service. Most clients experience mild, temporary redness that fades within a few hours. This session also gives your esthetician a chance to understand your hair growth patterns and customize your service. Session 2: The improvement. By your second wax, you'll notice a significant reduction in discomfort. Hair grows back finer and sparser after the first removal, making the second session noticeably more comfortable. Session 3: The perfection. By the third session, stubborn hairs that were in different growth phases have been captured, leaving behind only soft, baby-fine regrowth. This is the session that delivers the flawless result you want for your honeymoon. Bridal Waxing Services: From Brows to Toes A complete bridal waxing plan goes far beyond the Brazilian. Here's what our brides typically include in their pre-wedding regimen: Eyebrow design and waxing. Your brows frame your face in every wedding photo. Our estheticians are experts at creating the perfect brow shape for your face structure — clean, defined, and camera-ready. Brazilian or bikini wax. For your honeymoon and wedding night, a Brazilian wax ensures you feel completely confident and carefree. Leg waxing. Silky-smooth legs under your wedding dress — no stubble, no razor burn, no last-minute shaving stress. Arm waxing. For strapless or sleeveless gowns, smooth arms make a beautiful difference in photos. Upper lip and facial waxing. For a flawless, makeup-ready complexion on your wedding day. Timing Your Pre-Wedding Wax For your final pre-wedding waxing appointment, we recommend booking 2–3 days before your wedding . This gives your skin time to settle and any minor redness to fully resolve, while ensuring you're completely smooth for the big day. Avoid scheduling your wax the day before — while most clients are fine, we want to give your skin the best possible chance to look its absolute best. Book Your Bridal Consultation Wax Me Too has 6 locations across Utah: Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Book online at waxmetoo.com and mention that you're a bride — our estheticians love helping brides prepare for their special day. View our full services menu to plan your complete bridal waxing package, or find your nearest Wax Me Too location to get started. First-time clients get their Brazilian wax for $50. Say \"I do\" to smooth, glowing skin. We can't wait to be part of your wedding journey. Not sure what to expect? Read our first-visit guide before your appointment.",
  "south-jordan-waxing-salon-relocation": "Wax Me Too is pleased to announce the relocation of our South Jordan studio to a beautiful new address: 3674 W South Jordan Pkwy, South Jordan, Utah 84095 . Our new space features two fully operational treatment rooms and is conveniently located for residents of both South Jordan and West Jordan. <h2>The Same Expert Team, a Better Space</h2> Our South Jordan location proudly stands as Wax Me Too's 6th Utah studio. The move to our new address allows us to serve more clients with greater comfort and privacy — two fully equipped treatment rooms mean shorter wait times and a more relaxed experience for everyone. Our team of experienced estheticians remains the same. The expertise, the standards, and the commitment to your comfort haven't changed — just the address. <h2>8 Reasons Wax Me Too South Jordan Is Different</h2> In a market full of waxing options, here's what makes our South Jordan studio stand apart: 1. Local, female-owned and operated. We're not a franchise. We're not governed by outside investors. When you choose Wax Me Too, you're supporting Utah women and receiving service tailored to your needs — not dictated by a corporate playbook. 2. Hygiene you can see. Our estheticians wash their hands in front of you before every service. Our treatment rooms are sanitized between every client. We never double-dip — ever. 3. No awkward positions. Unlike some salons that require uncomfortable positions during intimate waxing services, we ensure a relaxed, dignified experience throughout your appointment. 4. No memberships, no pressure. Transparent pricing, no monthly fees, no contracts. Our Brazilian wax is $65 — no hidden charges, no upselling pressure. 5. Experienced estheticians only. Mastering the Brazilian wax takes real skill. We don't train new graduates on clients. Our team has the experience to deliver clean, complete results every time. 6. Privacy and dignity. We step out of the room while you prepare, giving you the time and space to settle in comfortably before your service begins. 7. No rush. We schedule Brazilian waxes for 30-minute appointments even though the service typically takes 15 minutes. You'll never feel rushed or hurried out the door. 8. Complete cleanup. You won't leave our salon with any residue or discomfort. Our three-step cleanup process ensures you leave feeling fresh and confident. <h2>Serving South Jordan, West Jordan, and Beyond</h2> Our new South Jordan location is easily accessible from throughout the Salt Lake Valley's southwest corridor. Whether you're coming from South Jordan, West Jordan, Herriman, or Riverton, we're conveniently located to serve you. Book Your Appointment Book online at waxmetoo.com and select the South Jordan location. You'll find our full list of services, estheticians, and available appointment times. First-time clients get their Brazilian wax for $50 — we'd love to welcome you to the Wax Me Too family.",
  "south-jordan-6th-location-opening": "Big news for the Salt Lake Valley's south end: Wax Me Too is proud to announce the opening of our 6th Utah location in South Jordan . This milestone marks a new chapter for Utah's original waxing-only studio — and we couldn't be more excited to bring our signature services to this vibrant, growing community. Why South Jordan? South Jordan has experienced remarkable growth over the past decade, and with that growth has come a demand for high-quality, professional beauty services. We heard you, South Jordan — and we answered. Our new studio is conveniently located at 3674 W South Jordan Pkwy , easily accessible for residents of South Jordan, West Jordan, Herriman, and Riverton. What to Expect at Our South Jordan Studio Every Wax Me Too location is built on the same foundation: exceptional hygiene, expert estheticians, transparent pricing, and a warm, welcoming atmosphere. Our South Jordan studio features two fully equipped treatment rooms, ensuring minimal wait times and maximum privacy for every client. No double-dipping. Fresh applicators for every client, every time. Sinks in every room. Your esthetician washes her hands in front of you before every service. No memberships. Transparent pricing, no hidden fees, no pressure. your first Brazilian wax for $50. Your first service at any Wax Me Too location comes with a 20% new client discount. Book Your Appointment Ready to experience Utah's most trusted waxing studio? Book online at waxmetoo.com and select the South Jordan location. We can't wait to welcome you.",
  "free-bikini-wax-layton-utah": "Here's something to brighten your day: Wax Me Too in Layton is giving away a free bikini wax. No strings attached, no membership required — just a chance to experience Utah's most trusted waxing studio on us. How to Enter Entering is simple. Visit our website, fill out the short entry form, and you're in. Winners are selected monthly and notified by text message. Some months we draw winners even more frequently — so the sooner you enter, the better your chances. Why We Do This At Wax Me Too, we believe that every woman deserves to feel confident and cared for. Giveaways like this are our way of saying thank you to our incredible community — and of giving new clients a risk-free way to discover what professional waxing can do for them. If you've been curious about waxing but haven't taken the plunge, this is the perfect opportunity. Our licensed estheticians at the Layton studio are experts at making first-time clients feel comfortable, informed, and at ease from the moment they walk in. About Wax Me Too Layton Our Layton studio is located at 360 S Fort Lane #101 , just minutes from Hill Air Force Base. We proudly offer military discounts for active service members and their families. Our team of experienced estheticians specializes in Brazilian waxing, eyebrow design, and full body waxing — from brows to toes and anything in between.",
  "wax-me-too-difference-local-salon": "In a market full of waxing options — from franchise chains to spa add-ons — what makes Wax Me Too different? The answer is everything. From our founding philosophy to our daily operations, we've built a waxing studio that puts clients first in ways that most salons simply don't. <h2>We Are Utah's Original Waxing-Only Studio</h2> When we opened our first location in Draper in 2007, we were doing something no one in Utah had done before: opening a salon dedicated entirely to waxing. No haircuts, no manicures, no distractions — just professional waxing, done exceptionally well. That singular focus has defined us ever since. Our estheticians don't split their time between services. They wax all day, every day, which means they've performed thousands of Brazilian waxes, eyebrow designs, and full body waxing services. That level of specialization translates directly into better results for you. <h2>8 Things That Set Us Apart</h2> Local, women-owned and operated. We're not a franchise. Every decision is made by the women who built this business from the ground up. No double-dipping, ever. We use fresh applicators for every client. This is non-negotiable. Sinks in every treatment room. Your esthetician washes her hands in front of you before every service. No memberships or pressure. Transparent pricing, no contracts, no monthly fees. Privacy and dignity. We step out while you prepare. You'll never feel rushed or uncomfortable. Experienced estheticians only. We don't train new graduates on clients. No hairs left behind guarantee. We check our work before you leave. First-time client offer. Get your first Brazilian wax for $50. We want you to experience the Wax Me Too difference risk-free. 6 Locations Across Utah With studios in Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George, we're Utah's most accessible professional waxing studio. Book online at waxmetoo.com — first-time clients get their Brazilian wax for $50.",
  "summer-waxing-utah-guide": "Summer in Utah means outdoor adventures, pool days, and hiking trails — and all of it is better with smooth, confident skin. At Wax Me Too , Utah's professional waxing studio since 2007, we help thousands of clients get summer-ready every year. Here's your complete guide to summer waxing in Utah. <h2>The Best Services for Summer</h2> Summer calls for a full-body approach to waxing. Here are the services our clients book most frequently as the temperatures rise: Brazilian wax. The ultimate summer service — weeks of smooth, confident skin for pool days, beach trips, and everything in between. Bikini wax. For those who prefer a more conservative clean-up, our bikini wax removes hair from the sides and top for a neat, swimsuit-ready look. Leg waxing. Full or half legs — silky smooth for shorts season without the daily shaving routine. Underarm waxing. Smooth underarms that last 3–4 weeks — no more daily razor maintenance. Eyebrow design. Summer photos deserve perfectly shaped brows. Our estheticians are experts at creating the ideal brow shape for your face. <h2>Summer Waxing Tips</h2> Getting the most out of your summer wax requires a little preparation: Book 2–3 days before your trip or event. This gives your skin time to settle after the service. Let hair grow to ¼ inch. Stop shaving at least 10 days before your appointment for best results. Exfoliate 24 hours before. Gentle exfoliation helps the wax grip hair more effectively. Avoid sun exposure immediately after. Freshly waxed skin is more sensitive to UV rays — apply SPF before heading outdoors. Moisturize daily. Hydrated skin holds wax results longer and reduces the risk of ingrown hairs. Book at Any of Our 6 Utah Locations Wax Me Too has studios in Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Book online and enjoy your first Brazilian wax for $50.",
  "wax-me-too-happy-faces-community": "At Wax Me Too , our greatest reward isn't a five-star review or a full appointment book — it's the look on a client's face when they leave our studio feeling confident, cared for, and completely smooth. After nearly two decades of serving Utah, we've collected thousands of those moments, and we never take a single one for granted. Why Client Happiness Drives Everything We Do From the moment you book your appointment to the moment you walk out our door, every detail of the Wax Me Too experience is designed around your comfort and satisfaction. We know that waxing — especially for first-time clients — can feel intimidating. Our entire team is trained to make that experience as warm, professional, and reassuring as possible. We've heard it hundreds of times: \"I was so nervous, but my esthetician made me feel completely at ease.\" That's not an accident. It's the result of years of intentional culture-building, ongoing training, and a genuine commitment to treating every client with dignity and respect. Our Community of Loyal Clients Many of our clients have been coming to Wax Me Too for years — some since we first opened in 2007. They've followed us as we've grown from one location in Draper to six studios across Utah. They've referred their friends, their sisters, their mothers. They've trusted us with some of their most personal grooming needs, and we don't take that trust lightly. Thank You, Utah To every client who has ever walked through our doors: thank you. You are the reason we do what we do. We're honored to be part of your self-care routine, and we look forward to many more years of serving Utah's most amazing community. Book your next appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "draper-waxing-salon-expansion": "Exciting news for our Draper community: Wax Me Too Draper has expanded, and we're thrilled to welcome even more clients to our flagship studio. Our Draper location holds a special place in our hearts — it's where it all began in 2007, when we opened Utah's very first waxing-only salon. More Space, Same Excellence The expansion adds additional treatment rooms to our Draper studio, meaning shorter wait times, greater scheduling flexibility, and the same exceptional service our clients have come to expect. Whether you're a longtime regular or considering your first visit, our Draper team is ready to welcome you. Our Draper Studio: Where It All Started Draper has been home to Wax Me Too since day one. Located at 177 West 12300 South , our Draper studio is conveniently situated for clients throughout the Salt Lake Valley's south end — including Sandy, Riverton, and South Jordan. We're proud of our roots in this community and grateful for the loyal clients who have supported us from the very beginning. Book Your Appointment Book online at waxmetoo.com and select the Draper location. First-time clients get their Brazilian wax for $50. We'd love to see you in our newly expanded space. View all Wax Me Too locations or browse our full services menu before booking.",
  "salt-lake-city-waxing-salon": "Salt Lake City, we're here for you. Wax Me Too is proud to serve the heart of Utah's capital with professional waxing services at our Salt Lake City studio, located inside Miri Lash Studio at 1850 S 300 West, Suite A . Professional Waxing in the Heart of Salt Lake City Our Salt Lake City location brings the same Wax Me Too experience that has made us Utah's most trusted waxing studio to the urban core. Whether you're a downtown professional, a University of Utah student, or a resident of the Sugarhouse or Liberty Wells neighborhoods, we're conveniently located to serve you. Our Services in Salt Lake City Our SLC studio offers the full Wax Me Too menu — from our signature Brazilian wax to eyebrow design, full leg waxing, underarm waxing, and men's waxing services. Our licensed estheticians specialize exclusively in waxing, bringing years of focused expertise to every appointment. Why Choose Wax Me Too in Salt Lake City? Utah's original waxing-only studio — we've been doing this since 2007 No double-dipping — fresh applicators for every client Sinks in every treatment room — hygiene you can see No memberships, no pressure — transparent pricing always your first Brazilian wax for $50 Book online at waxmetoo.com and select the Salt Lake City location. We look forward to welcoming you.",
  "layton-waxing-salon-new-location": "We have exciting news for our Davis County clients: Wax Me Too Layton has moved to a beautiful new location at 360 S Fort Lane #101, Layton, Utah 84041 . Our new space is larger, more comfortable, and better equipped to serve our growing Layton community. A New Home in Layton Our Layton studio has always been one of our busiest locations — and for good reason. Situated near Hill Air Force Base, we serve a diverse community of clients including military personnel and their families, for whom we proudly offer special military discounts. The new space features multiple treatment rooms with sinks, ensuring the hygiene standards our clients have come to expect. Our team of six experienced estheticians brings the same expertise and warmth to the new location that made our previous studio so beloved. Serving Davis County and Beyond Our Layton studio serves clients from throughout Davis County — including Layton, Clearfield, Syracuse, Clinton, and Kaysville — as well as clients from Weber County to the north. We're Utah's northernmost waxing studio, and we're proud to bring professional waxing expertise to this community. Book at Our New Layton Location Book online at waxmetoo.com and select the Layton location. Military personnel: look for the military discount option when selecting your service. First-time clients get their Brazilian wax for $50.",
  "layton-waxing-salon-new-team": "Great news for our Layton clients: our team is growing! Wax Me Too Layton has welcomed several talented new estheticians to our studio, expanding our capacity and bringing fresh expertise to our already exceptional team. Meet Our Growing Layton Team At Wax Me Too, we don't just hire estheticians — we hire specialists. Every member of our team has demonstrated a genuine passion for waxing and a commitment to client care that aligns with our values. Our new team members have completed extensive training in our signature techniques and are ready to deliver the Wax Me Too experience you know and love. What This Means for You More team members means more availability. If you've ever struggled to find an appointment time that works for your schedule, our expanded team makes it easier than ever to book at a time that's convenient for you. We offer early morning, evening, and weekend appointments to accommodate even the busiest schedules. The Wax Me Too Standard Every esthetician at Wax Me Too — new or veteran — upholds the same non-negotiable standards: no double-dipping, sinks in every treatment room, privacy and dignity for every client, and a genuine commitment to your comfort and satisfaction. Book your appointment online at waxmetoo.com and select the Layton location. First-time clients get their Brazilian wax for $50.",
  "layton-waxing-milly-speaks-spanish": "¡Buenas noticias para nuestra comunidad hispanohablante! Wax Me Too Layton is proud to announce that our esthetician Milly is available to serve Spanish-speaking clients. For clients who are more comfortable communicating in Spanish, Milly's bilingual expertise ensures a comfortable, clear, and professional waxing experience from start to finish. Breaking Down Language Barriers in Beauty At Wax Me Too, we believe that every client deserves to feel understood, comfortable, and fully informed during their appointment. For first-time waxing clients especially, being able to ask questions and understand the process in your native language makes a significant difference in the experience. Milly brings not only bilingual communication skills but also years of waxing expertise to every appointment. Her clients — both English and Spanish-speaking — consistently praise her gentle technique, attention to detail, and warm, reassuring manner. Our Layton Studio Located at 360 S Fort Lane #101, Layton, Utah , our Layton studio serves clients from throughout Davis County and beyond. We offer the full Wax Me Too menu — Brazilian wax, eyebrow design, full body waxing, and men's waxing services — all with the hygiene standards and client care that have made us Utah's most trusted waxing studio. To book with Milly, visit waxmetoo.com and select the Layton location. ¡Te esperamos!",
  "hair-removal-layton-utah": "If you're searching for professional hair removal in Layton, Utah, your search ends here. Wax Me Too Layton has been serving Davis County since our founding in 2007, and we've established ourselves as the most trusted name in professional waxing in Northern Utah. <h2>Professional Waxing Services in Layton, UT</h2> Our Layton studio at 360 S Fort Lane #101 offers a comprehensive menu of waxing services for women and men: Brazilian wax — Utah's most popular waxing service, performed by specialists who do this every day Bikini wax — clean, neat, and customizable to your preferences Eyebrow design and waxing — perfectly shaped brows that frame your face Full leg waxing — silky smooth from ankle to hip Underarm waxing — 3–4 weeks of smooth, carefree underarms Men's waxing — including back, chest, and the Manzilian Full body waxing — from brows to toes and anything in between <h2>Why Layton Clients Choose Wax Me Too</h2> We are Utah's original waxing-only studio — not a spa that offers waxing as an afterthought. Our estheticians specialize exclusively in waxing, performing these services every day and refining their technique with every appointment. The result is a level of expertise that generalist salons simply cannot match. We also offer military discounts for active service members and their families — a small token of appreciation for those who serve near Hill Air Force Base. Book Your Layton Appointment Book online at waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "how-often-should-you-wax": "One of the most common questions we hear at Wax Me Too is: \"How often should I wax?\" The answer depends on several factors — your hair growth cycle, the area being waxed, and your personal preferences. Here's everything you need to know to establish the perfect waxing schedule. <h2>The General Rule: Every 4–6 Weeks</h2> For most clients, we recommend waxing every 4–6 weeks . This timing aligns with the natural hair growth cycle and ensures that hair is at the optimal length for waxing — long enough for the wax to grip effectively, but not so long that the service becomes uncomfortable. However, this is a guideline, not a rule. Some clients with faster hair growth may need to come in every 3–4 weeks, while others with slower growth may find that 6–8 weeks works perfectly for them. <h2>Why Consistency Matters</h2> The more consistently you wax, the better your results become over time. Here's why: Hair grows back finer and sparser. With each waxing session, the hair follicle is weakened, leading to progressively finer, softer regrowth. Less discomfort over time. First-time waxers often notice a significant reduction in discomfort by their second or third session. More predictable regrowth. Consistent waxing synchronizes your hair growth cycles, leading to more uniform results. <h2>Waxing Schedule by Body Area</h2> Different areas of the body have different hair growth rates: Bikini/Brazilian: Every 4–5 weeks Eyebrows: Every 3–4 weeks Legs: Every 4–6 weeks Underarms: Every 3–4 weeks (underarm hair grows faster) Upper lip/facial: Every 3–4 weeks Book Your Next Appointment Wax Me Too has 6 locations across Utah. Book online at waxmetoo.com — we recommend scheduling your next appointment before you leave the studio to ensure you get your preferred time slot. Find your nearest location , view our services and pricing , or read our pre-wax preparation guide to get the most from every appointment.",
  "ingrown-hair-prevention-waxing": "Ingrown hairs are one of the most common concerns among waxing clients — and one of the most preventable. At Wax Me Too , our licensed estheticians have helped thousands of clients achieve smooth, ingrown-free skin through proper waxing technique and aftercare education. Here's your complete guide to preventing ingrown hairs. <h2>What Causes Ingrown Hairs?</h2> Ingrown hairs occur when a hair grows back into the skin rather than up through the follicle. They're most common in areas where hair is coarse and curly — like the bikini area, underarms, and legs. Contributing factors include: Dead skin cells blocking the hair follicle Tight clothing that creates friction against freshly waxed skin Dry skin that doesn't allow hair to break through the surface Improper waxing technique (another reason to choose an experienced esthetician) <h2>How to Prevent Ingrown Hairs After Waxing</h2> Exfoliate regularly. Begin gentle exfoliation 48 hours after your wax and continue 2–3 times per week. This removes dead skin cells that can trap growing hairs. Moisturize daily. Hydrated skin allows hair to grow through the surface more easily. Use a fragrance-free, non-comedogenic lotion on waxed areas daily. Avoid heat. Skip hot showers, saunas, and intense exercise for 24 hours after waxing — heat can cause inflammation that contributes to ingrown hairs. Don't shave between appointments. Shaving between waxing sessions disrupts the hair growth cycle and increases the risk of ingrown hairs. <h2>Professional Waxing Reduces Ingrown Hair Risk</h2> Proper waxing technique significantly reduces the risk of ingrown hairs compared to shaving. When hair is removed from the root (as in waxing), it grows back with a tapered tip that's less likely to curl back into the skin. Shaving creates a blunt cut that's more prone to ingrowth. Book your appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50. After your appointment, follow our complete aftercare guide to keep skin smooth and prevent ingrown hairs.",
  "waxing-aftercare-guide": "Your waxing appointment doesn't end when you leave the studio. What you do in the 24–48 hours after your wax has a significant impact on your results, your skin's health, and your comfort. Here's Wax Me Too's complete aftercare guide. <h2>The First 24 Hours: What to Avoid</h2> Freshly waxed skin is temporarily more sensitive and vulnerable. In the first 24 hours after your appointment, avoid: Hot showers or baths. Stick to lukewarm water — heat can cause inflammation and irritation on freshly waxed skin. Sun exposure. Waxed skin is more susceptible to UV damage. If you must be in the sun, apply SPF 30 or higher to waxed areas. Swimming pools or hot tubs. Chlorine and bacteria in pools can irritate open follicles. Intense exercise. Sweat and friction can cause irritation and increase the risk of ingrown hairs. Fragranced products. Avoid perfumes, scented lotions, and deodorants on waxed areas for 24 hours. <h2>Days 2–7: Building Your Aftercare Routine</h2> Moisturize daily. Apply a fragrance-free, non-comedogenic lotion to waxed areas every day to keep skin hydrated and supple. Begin gentle exfoliation at 48 hours. Use a soft washcloth or gentle exfoliating scrub 2–3 times per week to prevent ingrown hairs. Avoid shaving. Shaving between waxing appointments disrupts the hair growth cycle and can lead to coarser regrowth and more ingrown hairs. <h2>When to Call Us</h2> Mild redness and sensitivity are completely normal after waxing and typically resolve within a few hours. If you experience persistent redness, bumps, or irritation lasting more than 48 hours, contact your esthetician. We're always here to help. Book your next appointment at waxmetoo.com before your current results fade. We recommend scheduling 4–6 weeks out. Not sure what to expect before your visit? Read our before-care guide or visit our FAQ page for answers to common questions.",
  "waxing-before-care-guide": "The secret to a great waxing experience starts before you ever walk through our door. Proper preparation ensures the wax can grip hair effectively, reduces discomfort, and minimizes the risk of irritation. Here's Wax Me Too's complete before-care guide. <h2>Hair Length: The Most Important Factor</h2> For waxing to work effectively, your hair needs to be at least ¼ inch long — roughly the length of a grain of rice. This is approximately 10 days of growth after shaving, or 3 to 4 weeks after waxing. If your hair is too short, the wax won't be able to grip it properly, leading to incomplete results. If your hair is longer than ½ inch, don't worry — we can trim it for you. Just let your esthetician know when you arrive. <h2>The Week Before Your Appointment</h2> Stop shaving. Allow at least 10 days of growth from your last shave before your appointment. Exfoliate gently. Light exfoliation 24–48 hours before your appointment helps remove dead skin cells and allows the wax to grip hair more effectively. Avoid harsh scrubs that could irritate the skin. Moisturize daily. Well-hydrated skin waxes more easily and with less discomfort. Avoid retinol and AHA/BHA products. These can thin the skin and increase sensitivity. Stop using them on the area to be waxed 3–5 days before your appointment. <h2>The Day of Your Appointment</h2> Shower and cleanse the area. Come to your appointment with clean skin, free of lotions, oils, and perfumes. Avoid caffeine and alcohol. Both can increase skin sensitivity. Take an OTC pain reliever if desired. Some clients find that taking ibuprofen 30–45 minutes before their appointment reduces discomfort. Book Your Appointment Ready to experience the Wax Me Too difference? Book online at waxmetoo.com. First-time clients get their Brazilian wax for $50. Find your nearest Wax Me Too location , learn what to expect on your first visit , or check our FAQ page for answers to common questions.",
  "waxing-faq-utah": "Have questions about waxing? You're not alone. At Wax Me Too , we hear the same questions from new clients every day — and we love answering them. <h2>Frequently Asked Questions</h2> <h3>Does waxing hurt?</h3> This is the question we hear most often. The honest answer: it depends. Most clients describe the sensation as a quick, sharp sting that passes immediately. The bikini and Brazilian areas tend to be more sensitive than legs or arms. The good news: it gets significantly easier with each subsequent visit. By your third or fourth wax, most clients find the experience quite manageable. <h3>How long does hair need to be?</h3> Hair should be at least ¼ inch long — roughly 10 days of growth after shaving, or 3 to 4 weeks after waxing. If you're not sure, it's always better to let it grow a bit longer rather than coming in too soon. <h3>How long do results last?</h3> Most clients enjoy smooth skin for 3–6 weeks after a professional wax. Results vary based on individual hair growth rates and the area waxed. <h3>Can I wax if I'm pregnant?</h3> Yes, waxing is generally safe during pregnancy. However, skin can be more sensitive during pregnancy, so we recommend letting your esthetician know. We'll take extra care to ensure your comfort throughout the service. <h3>Do you offer waxing for men?</h3> Absolutely. We offer a full menu of men's waxing services, including back waxing, chest waxing, eyebrow waxing, and the Manzilian — our Brazilian wax service for men. Our estheticians are experienced and professional, and our treatment rooms are private and comfortable. <h3>What is your hygiene policy?</h3> We never double-dip — fresh applicators are used for every client, every time. Our estheticians wash their hands in front of you before every service. Treatment rooms are sanitized between every client. These are non-negotiable standards at every Wax Me Too location. Have more questions? Visit our full FAQ page , browse our services menu , or find your nearest Wax Me Too location .",
  "waxing-for-men-manzilian-guide": "Men's waxing has gone mainstream — and for good reason. From athletes seeking peak performance to professionals who simply prefer a cleaner look, more men than ever are discovering the benefits of professional waxing. At Wax Me Too , we've been serving male clients since our founding in 2007, and we're proud to offer a comprehensive menu of men's waxing services. <h2>The Manzilian: Our Most Popular Men's Service</h2> The Manzilian — our Brazilian wax service for men — is our most requested men's service. It's performed with the same expertise, discretion, and professionalism as our women's Brazilian wax, by licensed estheticians who specialize in this service. First-time male clients are often surprised by how professional and comfortable the experience is. Our estheticians are matter-of-fact, skilled, and focused entirely on delivering excellent results. There's no judgment, no awkwardness — just professional service in a private, comfortable treatment room. <h2>Other Men's Waxing Services</h2> Back waxing. One of our most popular men's services — a clean, smooth back for beach season or everyday confidence. Chest waxing. Smooth, defined chest without the daily maintenance of shaving. Eyebrow waxing and design. Clean, well-groomed brows that frame your face without looking overdone. Arm and leg waxing. Popular among cyclists, swimmers, and athletes who prefer a smooth, low-maintenance look. Ear and nose waxing. Quick, effective, and surprisingly comfortable. <h2>Why Men Choose Waxing Over Shaving</h2> The benefits of waxing over shaving are the same for men as for women: longer-lasting results (3–6 weeks vs. 1–3 days), finer regrowth over time, no razor burn, and no daily maintenance. For active men, waxing also eliminates the chafing and irritation that can come from shaving. Book your men's waxing appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50. View our full men's waxing menu or find a location near you .",
  "waxing-sensitive-skin-guide": "If you have sensitive skin, you may have hesitated to try waxing — worried about redness, irritation, or reactions. The good news: with the right preparation, the right esthetician, and the right aftercare, even sensitive skin can be waxed safely and comfortably. Here's Wax Me Too's guide to waxing with sensitive skin. What Makes Skin Sensitive to Waxing? Several factors can increase skin sensitivity during waxing: Retinol or AHA/BHA skincare products (these thin the skin) Recent sun exposure or sunburn Certain medications (including Accutane, blood thinners, and some antibiotics) Hormonal fluctuations (including pregnancy and menstruation) Eczema, psoriasis, or other skin conditions in the area to be waxed How to Prepare Sensitive Skin for Waxing Discontinue retinol and AHA/BHA products on the area to be waxed at least 5 days before your appointment. Avoid sun exposure for 24 hours before your appointment. Stay well-hydrated. Hydrated skin is more resilient and waxes more comfortably. Tell your esthetician. Always let your esthetician know about your skin sensitivities, medications, and skincare routine. This allows us to choose the most appropriate wax formulation and technique for your skin. Our Approach to Sensitive Skin At Wax Me Too, we use professional-grade wax formulations that are gentle on sensitive skin. Our estheticians are trained to recognize signs of sensitivity and adjust their technique accordingly. We'd rather take an extra moment to ensure your comfort than rush through a service that leaves your skin unhappy. Book your appointment at waxmetoo.com and mention your sensitive skin in the notes field when booking. First-time clients get their Brazilian wax for $50.",
  "waxing-while-pregnant-utah": "Pregnancy brings many changes to your body — including changes to your skin, your hair growth patterns, and your sensitivity to pain. Many expectant mothers wonder whether it's safe to continue waxing during pregnancy. The short answer: yes, waxing is generally safe during pregnancy, with a few important considerations. <h2>Is Waxing Safe During Pregnancy?</h2> Waxing does not pose any known risks to your pregnancy. The wax is applied externally and does not penetrate the skin in any way that could affect your baby. However, pregnancy does affect the waxing experience in several ways: Increased skin sensitivity. Hormonal changes during pregnancy can make skin more sensitive than usual, meaning waxing may be more uncomfortable than before pregnancy. Increased blood flow. Greater blood flow to the skin during pregnancy can cause more pronounced redness and sensitivity after waxing. Faster hair growth. Many pregnant women experience accelerated hair growth due to hormonal changes. <h2>Tips for Waxing During Pregnancy</h2> Tell your esthetician you're pregnant. This is important — we'll take extra care to ensure your comfort and use the gentlest possible technique. Schedule early in your pregnancy if possible, when sensitivity is typically lower. Avoid waxing if you have varicose veins in the area to be waxed. Listen to your body. If at any point you feel uncomfortable, let your esthetician know and we'll adjust accordingly. Book Your Prenatal Waxing Appointment Our licensed estheticians at all 6 Wax Me Too locations are experienced in working with pregnant clients. Book online at waxmetoo.com and mention your pregnancy in the notes field. First-time clients get their Brazilian wax for $50. Find your nearest Wax Me Too location , read our before-care guide to prepare, and check our FAQ for more pregnancy waxing answers.",
  "first-brazilian-wax-step-by-step": "So you've decided to try your first Brazilian wax. Congratulations — you're about to discover why millions of women (and men) swear by this service. At Wax Me Too , we've guided thousands of first-time clients through their first Brazilian wax, and we're here to walk you through exactly what to expect. <h2>Step 1: Booking Your Appointment</h2> Book online at waxmetoo.com and select \"Brazilian Wax\" from the service menu. Choose your preferred location from our 6 Utah studios, select an esthetician, and pick a time that works for you. The appointment is scheduled for 30 minutes, though the actual waxing typically takes about 15 minutes — the extra time ensures you never feel rushed. <h2>Step 2: Preparing for Your Appointment</h2> In the days before your appointment: Stop shaving at least 10 days before your appointment to allow ¼ inch of growth Exfoliate gently 24–48 hours before your appointment Shower and cleanse the area on the day of your appointment <h2>Step 3: Arriving at the Studio</h2> When you arrive, you'll be greeted by your esthetician, who will briefly review the service with you and answer any questions. You'll be shown to a private treatment room where you'll have complete privacy to prepare. <h2>Step 4: The Service</h2> Your esthetician will cleanse the area, apply warm wax in small sections, and remove it quickly and efficiently. The sensation is a quick, sharp sting that passes immediately — most clients are surprised by how manageable it is. Your esthetician will work methodically to ensure complete coverage and clean results. <h2>Step 5: Aftercare</h2> After your service, your esthetician will apply a soothing aftercare product and review aftercare instructions with you. Avoid heat, sun exposure, and pools for 24 hours. Ready to book? Visit waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "15-minute-brazilian-wax-experience": "At Wax Me Too , we schedule Brazilian wax appointments for 30 minutes — but the actual waxing typically takes about 15 minutes. Why the extra time? Because we believe you should never feel rushed. The 30-minute appointment gives you time to settle in, ask questions, and leave without feeling hurried out the door. <h2>What Happens in Those 15 Minutes?</h2> Our estheticians have refined their Brazilian wax technique over years of daily practice. Here's what happens during a typical appointment: Minutes 1–2: Preparation. Your esthetician cleanses the area and applies a light pre-wax oil to protect the skin. Minutes 3–12: Waxing. Working in small, precise sections, your esthetician applies warm wax and removes it quickly and efficiently. The technique is methodical and thorough — no hairs left behind. Minutes 13–15: Finishing. Your esthetician applies a soothing post-wax product and reviews aftercare instructions with you. <h2>Why Speed Doesn't Mean Rushing</h2> The efficiency of our service is a reflection of expertise, not haste. Our estheticians perform Brazilian waxes every day — they've refined their technique to be both fast and thorough. The result is a service that's quick, comfortable, and complete. <h2>First-Time Clients: What to Expect</h2> If this is your first Brazilian wax, your appointment may take slightly longer as your esthetician takes time to explain each step and ensure your comfort throughout. That's completely normal — and we'd rather take the extra time than rush you through an experience that deserves care and attention. Book your Brazilian wax at waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "naked-and-afraid-first-brazilian": "We've all heard the horror stories. A friend's terrible experience at a discount salon. A Reddit thread full of waxing nightmares. If you're considering your first Brazilian wax and feeling a little \"naked and afraid,\" we completely understand — and we're here to set the record straight. <h2>The Truth About Your First Brazilian Wax</h2> Here's what actually happens at a professional waxing studio like Wax Me Too : Your esthetician has done this thousands of times. To her, it's simply her craft. She's not judging you, she's not uncomfortable, and she's completely focused on delivering excellent results. You'll have complete privacy. We step out of the room while you prepare, giving you time to settle in before the service begins. The discomfort is manageable. Yes, there's a sensation — a quick, sharp sting that passes immediately. Most first-time clients are genuinely surprised by how manageable it is. It gets easier every time. By your second or third wax, most clients find the experience significantly more comfortable as hair grows back finer and the follicles weaken. <h2>What Makes Wax Me Too Different</h2> The horror stories you've heard usually involve salons that cut corners — double-dipping applicators, rushing through services, or using low-quality wax. At Wax Me Too, we've built our entire reputation on doing the opposite. No double-dipping — ever Sinks in every treatment room Experienced estheticians who specialize exclusively in waxing 30-minute appointments so you never feel rushed A genuine commitment to your comfort and dignity Ready to take the plunge? Book at waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "bikini-wax-types-explained": "Not all bikini waxes are the same — and knowing the difference helps you choose the service that's right for you. At Wax Me Too , we offer several bikini waxing options, each designed to meet different preferences and comfort levels. Here's your complete guide to bikini wax types. <h2>Bikini Line Wax</h2> The most conservative option, a bikini line wax removes hair from the sides and top of the bikini area — essentially, anything that would be visible outside a standard swimsuit. This is a great starting point for first-time waxers who want to try waxing without committing to a more comprehensive service. <h2>Full Bikini Wax</h2> A full bikini wax goes further than the bikini line, removing more hair from the sides and top for a cleaner, more thorough result. Some hair is left in the front, but the overall look is neater and more defined than a standard bikini line wax. <h2>Brazilian Wax</h2> The Brazilian wax is our most popular service — and for good reason. It removes all or nearly all hair from the bikini area, front to back, leaving you completely smooth. Clients can choose to leave a small strip or triangle in the front, or opt for a completely bare look. The Brazilian wax is the gold standard for beach vacations, honeymoons, and anyone who simply prefers the feeling of complete smoothness. <h2>Which Should You Choose?</h2> If you're new to waxing, we generally recommend starting with a bikini line or full bikini wax to see how your skin responds. If you're ready to go all-in, the Brazilian is an excellent choice — and our estheticians are experts at making first-time Brazilian clients feel comfortable and at ease. Book your bikini wax at waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "eyebrow-design-waxing-guide": "Your eyebrows frame your face. They communicate expression, define your features, and — when perfectly shaped — can transform your entire look. At Wax Me Too , eyebrow design is one of our signature services, and our estheticians are experts at creating the ideal brow shape for every face. <h2>The Art of Eyebrow Design</h2> Great eyebrow design is about more than just removing stray hairs. It's about understanding the natural architecture of your face and enhancing it. Our estheticians consider: Face shape. Different face shapes call for different brow shapes. Oval faces can carry almost any brow shape; round faces benefit from higher arches; square faces look great with softer, more rounded brows. Natural brow structure. We work with your natural brow, not against it — enhancing what you have rather than imposing an arbitrary shape. Your preferences. Do you want a bold, defined brow or a softer, more natural look? We'll work with you to achieve exactly the shape you're envisioning. <h2>The London Brow Company</h2> Wax Me Too is proud to be the exclusive Utah retailer of The London Brow Company's product line — a premium, vegan, cruelty-free collection of brow products. From tinting to lamination to finishing products, The London Brow Company offers everything you need to maintain your perfect brows between appointments. <h2>Eyebrow Tinting</h2> Pair your eyebrow wax with an eyebrow tint for a complete brow transformation. Tinting adds definition, depth, and fullness to your brows — perfect for clients with lighter or sparser hair. Results last 4–6 weeks. Book Your Brow Appointment Book your eyebrow wax, tint, or design appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "underarm-waxing-guide-utah": "Underarm waxing is one of the most practical and popular waxing services — and one of the most underrated. At Wax Me Too , underarm waxing is a quick, affordable service that delivers 3–4 weeks of smooth, carefree underarms. Here's everything you need to know. <h2>Why Wax Your Underarms?</h2> The benefits of underarm waxing over shaving are significant: 3–4 weeks of smoothness vs. 1–3 days with shaving No razor burn or irritation in a sensitive area Finer regrowth over time — with consistent waxing, underarm hair grows back progressively softer and sparser No daily maintenance — skip the morning razor routine Better deodorant performance — deodorant adheres more effectively to smooth skin <h2>What to Expect</h2> Underarm waxing is one of our quickest services — typically taking just 5–10 minutes. The underarm area is sensitive, so you'll feel a quick sting with each pull, but the service is over before you know it. Most clients find underarm waxing significantly less uncomfortable than bikini waxing. <h2>Aftercare Tips for Underarms</h2> Avoid deodorant for 24 hours after your wax Avoid heat and sweating for 24 hours Begin gentle exfoliation 48 hours after your wax to prevent ingrown hairs Book your underarm waxing appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "3-worst-things-waxing-salon": "Not all waxing salons are created equal. In an industry with minimal regulation and wide variation in standards, knowing what to look for — and what to avoid — can make the difference between a great experience and a nightmare. Here are the 3 worst things a waxing salon can do , and why you'll never encounter them at Wax Me Too . <h2>1. Double-Dipping</h2> Double-dipping — reusing the same applicator stick in the wax pot after it's touched a client's skin — is the single most egregious hygiene violation in the waxing industry. Every time a used applicator goes back into the wax pot, bacteria from the previous client's skin are introduced into the wax. That wax then gets applied to the next client. At Wax Me Too, we use a fresh, single-use applicator for every application. No exceptions, no shortcuts. This is non-negotiable. <h2>2. No Sink in the Treatment Room</h2> Your esthetician should wash her hands in front of you before beginning any service. If there's no sink in the treatment room, that's simply not possible. A salon without sinks in treatment rooms is a salon that's cutting corners on hygiene. Every Wax Me Too treatment room is equipped with a sink. You'll see your esthetician wash her hands before she touches you — every single time. <h2>3. Rushing Through Services</h2> A Brazilian wax that's rushed is a Brazilian wax that's incomplete. Estheticians who are overbooked or undertrained often rush through services, leaving hairs behind and clients feeling unsatisfied. At Wax Me Too, we schedule Brazilian waxes for 30-minute appointments even though the service typically takes 15 minutes. You'll never feel rushed, and you'll never leave with hairs we missed. <h2>The Wax Me Too Standard</h2> These aren't just policies — they're the foundation of everything we do. Book at waxmetoo.com and experience the difference that genuine standards make.",
  "brazilian-wax-benefits-vs-shaving": "The debate between waxing and shaving has a clear winner — and it's not even close. At Wax Me Too , we've helped thousands of clients make the switch from shaving to professional waxing, and the transformation in their skin, their confidence, and their daily routine is remarkable. Here's a comprehensive comparison. Results Duration Shaving: 1–3 days. Shaving cuts hair at the surface, leaving a blunt tip that's visible (and prickly) within hours. Brazilian wax: 3–6 weeks. Waxing removes hair from the root, leaving skin genuinely smooth for weeks. Hair Texture Over Time Shaving: Hair grows back the same — or coarser — with every shave. The blunt cut creates the illusion of thicker, darker regrowth. Brazilian wax: Hair grows back progressively finer and sparser with each waxing session. Long-term waxers often report barely noticeable regrowth after years of consistent waxing. Skin Quality Shaving: Razor burn, nicks, ingrown hairs, and irritation are common — especially in sensitive areas like the bikini zone. Brazilian wax: Waxing acts as a mild exfoliant, removing dead skin cells along with hair and leaving skin visibly smoother. When done correctly, waxing significantly reduces the risk of ingrown hairs compared to shaving. Daily Maintenance Shaving: Daily or near-daily maintenance required. Razor replacement, shaving cream, post-shave care — it adds up in time and money. Brazilian wax: One appointment every 4–6 weeks. No daily routine, no razor burns, no stubble. The Verdict For anyone who shaves regularly, switching to professional waxing is one of the best decisions you can make for your skin and your routine. Book your first Brazilian wax at waxmetoo.com — first-time clients get their Brazilian wax for $50.",
  "brazilian-waxing-salon-qa": "Thinking about trying a Brazilian wax but still have questions? You're not alone. At Wax Me Too , we answer these questions every day — and we love helping new clients feel informed and confident before their first appointment. <h2>Brazilian Wax Q&amp;A</h2> <h3>What exactly is a Brazilian wax?</h3> A Brazilian wax removes all or nearly all hair from the bikini area — front, back, and everything in between. Clients can choose to leave a small strip or triangle in the front, or opt for a completely bare look. It's the most comprehensive bikini waxing service available. <h3>How long does the appointment take?</h3> We schedule Brazilian wax appointments for 30 minutes. The actual waxing typically takes about 15 minutes — the extra time ensures you never feel rushed. <h3>How much does it cost?</h3> Our Brazilian wax is $65. First-time clients get their Brazilian wax for $50 — see our full pricing at waxmetoo.com. <h3>How long does hair need to be?</h3> At least ¼ inch — roughly 10 days of growth after shaving, or 3 to 4 weeks after waxing. If you're not sure, err on the side of more growth rather than less. <h3>Will it hurt?</h3> There's a sensation — a quick, sharp sting that passes immediately. Most clients are surprised by how manageable it is. It gets significantly easier with each subsequent visit. <h3>How do I prepare?</h3> Stop shaving at least 10 days before your appointment. Exfoliate gently 24–48 hours before. Shower and cleanse the area on the day of your appointment. Ready to book? Visit waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "prevention-magazine-bikini-wax-tips": "When Prevention magazine featured professional waxing tips, the advice aligned perfectly with what we've been telling our clients at Wax Me Too for years. Great waxing results come down to preparation, technique, and aftercare — and all three matter enormously. Pre-Wax Preparation: The Foundation of Great Results The most important thing you can do before a bikini wax is let your hair grow. Prevention recommends at least ¼ inch of growth — and we agree completely. Hair that's too short won't grip the wax properly, leading to incomplete results and a more uncomfortable experience. Beyond hair length, gentle exfoliation 24–48 hours before your appointment helps remove dead skin cells that can interfere with the wax's grip. And staying well-hydrated — both by drinking water and moisturizing your skin — makes for a smoother, more comfortable wax. Choosing the Right Salon Not all waxing salons are equal. Prevention 's advice: look for a salon that uses fresh applicators for every client (no double-dipping), has sinks in the treatment rooms, and employs experienced estheticians who specialize in waxing. That's exactly what you'll find at every Wax Me Too location. Post-Wax Care After your wax, avoid heat, sun exposure, and tight clothing for 24 hours. Begin gentle exfoliation 48 hours after your appointment and continue 2–3 times per week to prevent ingrown hairs. Moisturize daily to keep skin hydrated and smooth. Book your bikini wax at waxmetoo.com. First-time clients get their Brazilian wax for $50. Read our full before-care guide for preparation tips, or view our services menu to choose the right bikini wax for you.",
  "throw-away-your-razor": "It's time to have a serious conversation about your razor. That daily ritual of shaving — the nicks, the razor burn, the stubble that appears within hours — is it really serving you? At Wax Me Too , we've been helping Utah women (and men) throw away their razors since 2007. Here's why you should join them. <h2>The Real Cost of Shaving</h2> Think about how much time you spend shaving. Five minutes a day, every day, adds up to over 30 hours a year. Add in the cost of razors, shaving cream, and aftershave products, and you're spending hundreds of dollars annually on a method that delivers results lasting less than 24 hours. Now compare that to professional waxing: one 30-minute appointment every 4–6 weeks. The time savings alone are significant — but the skin benefits are even more compelling. <h2>What Happens When You Switch to Waxing</h2> Clients who make the switch from shaving to professional waxing consistently report: Smoother skin that lasts weeks, not hours No more razor burn or ingrown hairs Progressively finer, sparser regrowth over time More confidence in swimwear and intimate situations A simplified daily routine — no more shaving in the shower <h2>Ready to Make the Switch?</h2> Your first step: stop shaving now and let your hair grow to at least ¼ inch (about 10 days). Then book your first appointment at waxmetoo.com. First-time clients get their Brazilian wax for $50. Throw away your razor. You won't miss it.",
  "pre-vacation-waxing-checklist": "Vacation is coming — and your skin deserves to be ready. Whether you're heading to a tropical beach, a ski resort, or a European adventure, pre-vacation waxing ensures you arrive at your destination feeling confident, smooth, and completely carefree. Here's Wax Me Too's complete pre-vacation waxing checklist. 4–6 Weeks Before: Book Your Appointment Don't wait until the last minute. Book your pre-vacation waxing appointment 4–6 weeks in advance to secure your preferred esthetician and time slot. If this is your first wax, we strongly recommend doing a trial run well before your trip to see how your skin responds. 10 Days Before: Stop Shaving Hair needs to be at least ¼ inch long for waxing to work effectively. Stop shaving at least 10 days before your appointment to ensure optimal hair length. 2–3 Days Before Your Appointment: Prepare Your Skin Exfoliate gently to remove dead skin cells Moisturize daily to keep skin hydrated Avoid retinol and AHA/BHA products on areas to be waxed Day of Appointment Shower and cleanse the area Avoid caffeine and alcohol After Your Appointment Avoid sun exposure for 24 hours Skip the pool or hot tub for 24 hours Pack SPF for freshly waxed areas Book Your Pre-Vacation Wax Wax Me Too has 6 locations across Utah. Book online at waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "spring-adventure-waxing-utah": "Spring in Utah means hiking the red rock canyons of Moab, biking the trails of Park City, and finally shedding the layers that have kept you covered all winter. It also means it's time to get your skin ready for the season ahead. At Wax Me Too , spring is one of our busiest seasons — and for good reason. Spring Waxing Services As the temperatures rise and the outdoor adventures begin, here are the services our clients book most frequently in spring: Brazilian wax — get ready for swimsuit season before the summer rush Leg waxing — silky smooth legs for shorts, skirts, and hiking trails Eyebrow design — refresh your brows after a winter of neglect Underarm waxing — smooth underarms for tank tops and outdoor activities Back waxing (men) — get beach-ready before the season starts Spring Skin Care Tips After a dry Utah winter, your skin needs some extra attention before waxing season: Hydrate intensively. Winter air is notoriously drying. Moisturize daily for 2–3 weeks before your first spring wax. Exfoliate regularly. Remove the buildup of dead skin cells from winter to allow the wax to grip hair effectively. Protect with SPF. As UV exposure increases in spring, protect freshly waxed skin with sunscreen. Book Your Spring Appointment Spring appointments fill up fast — book early at waxmetoo.com. First-time clients get their Brazilian wax for $50. Find your nearest location and read our pre-wax preparation guide before your first spring appointment.",
  "holiday-waxing-on-top-of-the-world": "The holidays are a time for family gatherings, festive parties, and — at Wax Me Too — a full calendar of clients getting holiday-ready. Whether you're attending an office party, a family reunion, or a New Year's Eve celebration, professional waxing is the finishing touch that makes you feel your absolute best. Holiday Waxing Services The most popular holiday waxing services at Wax Me Too: Eyebrow design and waxing. Perfectly shaped brows for every holiday photo. Our estheticians are experts at creating clean, defined brows that frame your face beautifully. Brazilian wax. For holiday getaways, New Year's Eve celebrations, and everything in between. Full leg waxing. Silky smooth legs for holiday dresses and party outfits. Facial waxing. Upper lip, chin, and sideburns — a flawless complexion for holiday photos. Book Early for the Holidays The holiday season is our busiest time of year. We strongly recommend booking your holiday appointments at least 2–3 weeks in advance to secure your preferred time slot. Our online booking system makes it easy — visit waxmetoo.com and select your preferred location, esthetician, and service. Gift Cards Available Looking for the perfect holiday gift? Wax Me Too gift cards are available at all 6 locations. Give the gift of smooth, confident skin — it's a present that's always appreciated. View our full services menu or find a location near you to book your holiday appointment.",
  "sundance-film-festival-waxing-utah": "Every January, Park City transforms into one of the world's most glamorous destinations as the Sundance Film Festival brings celebrities, filmmakers, and film lovers from around the globe to Utah. And every January, Wax Me Too sees a surge of clients getting festival-ready. Looking Your Best at Sundance Whether you're attending screenings, parties, or simply soaking in the festival atmosphere on Main Street, looking and feeling your best matters. Professional waxing is a key part of the pre-festival beauty routine for many of our clients — and it's easy to see why. A Brazilian wax, perfectly shaped brows, and smooth legs give you the confidence to focus on the films, the conversations, and the experiences — not your appearance. That's the Wax Me Too promise. Pre-Festival Waxing Tips Book 2–3 days before the festival begins. This gives your skin time to settle after the service. Include eyebrow design. Festival photos are everywhere — make sure your brows are camera-ready. Consider a full leg wax. Park City in January means layers, but the après-ski parties mean showing some skin. Book at Our Draper or Salt Lake City Location Our Draper and Salt Lake City studios are the most convenient for Sundance attendees. Book online at waxmetoo.com — first-time clients get their Brazilian wax for $50. View all our Utah locations or browse our full services menu to plan your pre-festival waxing.",
  "valentines-day-waxing-rippp-and-swear": "Valentine's Day is coming — and at Wax Me Too , we have a saying: \"Rip it and swear by it.\" Because once you experience the results of a professional Brazilian wax, you'll never go back to shaving. And there's no better time to make the switch than before Valentine's Day. The Valentine's Day Brazilian: Why It's Worth It Valentine's Day is one of our busiest times of year — and it's not hard to understand why. Whether you're celebrating with a long-term partner or someone new, feeling confident and smooth makes the occasion even more special. A Brazilian wax provides weeks of smooth, carefree skin — no last-minute shaving, no razor burn, no stubble. Just smooth, confident skin that lets you focus on what matters. Book Early — Valentine's Week Fills Up Fast Valentine's Day appointments at Wax Me Too fill up weeks in advance. We strongly recommend booking at least 2 weeks before February 14th to secure your preferred time slot. Book online at waxmetoo.com and select your preferred location from our 6 Utah studios. New Client Special Never tried a Brazilian wax before? Valentine's Day is the perfect occasion for your first experience. First-time clients get their Brazilian wax for $50 — and our estheticians are experts at making first-timers feel comfortable and at ease. Rip it. Swear by it. Book at waxmetoo.com.",
  "valentines-day-free-brazilian-2013": "Love is in the air — and so is the chance to win a free Brazilian wax. At Wax Me Too , we're celebrating Valentine's Day 2013 with a special giveaway: one lucky winner will receive a complimentary Brazilian wax at any of our Utah locations. How to Enter Entering is simple. Visit our website, fill out the entry form, and you're automatically in the drawing. The winner will be notified by text message before Valentine's Day — giving you plenty of time to book your appointment and get smooth for the occasion. Why a Brazilian Wax Makes the Perfect Valentine's Gift Whether you're treating yourself or someone special, a Brazilian wax is a gift that keeps giving — literally. Professional waxing provides 3–6 weeks of smooth, confident skin, making it one of the most practical and appreciated beauty gifts you can give. And for first-time clients, our Valentine's giveaway is the perfect opportunity to experience professional waxing risk-free. Our licensed estheticians are experts at making new clients feel comfortable, informed, and completely at ease. About Wax Me Too Wax Me Too has been Utah's premier waxing-only studio since 2007. We were the first waxing-only salon in Utah, and we remain the most trusted name in professional waxing across the state. Book at waxmetoo.com.",
  "valentines-day-free-wax-giveaway-2017": "Happy Valentine's Day from Wax Me Too ! To celebrate the season of love, we're giving away a free waxing service to one lucky winner. Whether you're treating yourself or someone special, this is your chance to experience Utah's most trusted waxing studio on us. How to Enter Visit our website and fill out the entry form. It takes less than a minute, and you'll be entered to win a complimentary waxing service at any of our Utah locations. Winners are notified by text message. Valentine's Day Waxing: Our Most Popular Services As Valentine's Day approaches, here are the services our clients book most frequently: Brazilian wax — the ultimate Valentine's Day service Eyebrow design — perfectly shaped brows for Valentine's Day photos Full leg waxing — silky smooth legs for Valentine's evening Facial waxing — a flawless complexion for the occasion Book Your Valentine's Appointment Valentine's week fills up fast. Book your appointment now at waxmetoo.com — first-time clients get their Brazilian wax for $50. And don't forget to enter our giveaway for a chance to win a free service!",
  "free-bikini-wax-drawing-utah": "Here's your chance to win a free bikini wax from Wax Me Too — Utah's premier professional waxing studio. We're running a monthly drawing, and entering takes less than a minute. How to Enter Visit our website and fill out the entry form. Winners are selected monthly and notified by text message. Some months, we draw winners more frequently — so the sooner you enter, the better your chances. Why We Do Giveaways At Wax Me Too, we believe that every woman deserves to feel confident and cared for. Our monthly giveaways are our way of saying thank you to our incredible Utah community — and of giving new clients a risk-free way to discover what professional waxing can do for them. If you've been curious about waxing but haven't taken the plunge, winning a free bikini wax is the perfect way to try it without any commitment. Our licensed estheticians will make you feel comfortable, informed, and completely at ease from the moment you walk in. About Wax Me Too Wax Me Too has been Utah's most trusted waxing studio since 2007. We have 6 locations across the state — Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Book at waxmetoo.com. First-time clients get their Brazilian wax for $50.",
  "waxing-south-jordan-utah-opening": "The wait is over, South Jordan! Wax Me Too is thrilled to announce the opening of our South Jordan studio — bringing Utah's premier professional waxing experience to the heart of the Salt Lake Valley's southwest corridor. Welcome to Wax Me Too South Jordan Our South Jordan studio is located at 3674 W South Jordan Pkwy , conveniently situated for residents of South Jordan, West Jordan, Herriman, and Riverton. The studio features fully equipped treatment rooms with sinks, ensuring the hygiene standards our clients have come to expect at every Wax Me Too location. Grand Opening Special To celebrate our South Jordan opening, we're offering a special grand opening discount for new clients. Visit waxmetoo.com and book at the South Jordan location to take advantage of this limited-time offer. The Wax Me Too Experience Every Wax Me Too location is built on the same foundation: exceptional hygiene, expert estheticians, transparent pricing, and a warm, welcoming atmosphere. Our South Jordan team brings years of waxing expertise and a genuine passion for client care to every appointment. No double-dipping — ever Sinks in every treatment room No memberships, no pressure your first Brazilian wax for $50 Book your South Jordan appointment at waxmetoo.com. We can't wait to welcome you.",
  "south-jordan-waxing-grand-opening": "South Jordan, we're officially open! Wax Me Too is proud to welcome our South Jordan community to our newest studio. After months of preparation, we're ready to bring Utah's most trusted waxing experience to this vibrant, growing community. Meet Your South Jordan Team Our South Jordan studio is staffed by experienced, licensed estheticians who share the same passion for professional waxing that has defined Wax Me Too since 2007. They've been trained in our signature techniques and are committed to the hygiene standards, client care, and attention to detail that our clients have come to expect. Services Available at South Jordan Our South Jordan studio offers the full Wax Me Too menu: Brazilian wax and bikini waxing Eyebrow design, waxing, and tinting Full body waxing — legs, arms, back, chest Men's waxing services including the Manzilian Facial waxing Book Your Appointment Book online at waxmetoo.com and select the South Jordan location. First-time clients get their Brazilian wax for $50. We're so excited to be part of the South Jordan community — we can't wait to meet you.",
  "utah-waxing-salon-established-2007": "In 2007, two best friends with a shared vision opened Utah's first waxing-only salon in Draper. They called it Wax Me Too . Nearly two decades later, that vision has grown into a network of 6 studios across Utah — and the values that guided those first appointments still guide every service we provide today. <h2>The Story of Wax Me Too</h2> Before Wax Me Too, professional waxing in Utah was an afterthought — a service offered alongside haircuts and manicures at general beauty salons. The quality was inconsistent, the hygiene standards were often questionable, and clients had no way of knowing whether they were in the hands of a true specialist or a generalist who waxed occasionally. Our founders saw an opportunity to do something different: create a salon dedicated entirely to waxing, staffed by estheticians who specialized exclusively in this craft, and built on hygiene standards that clients could trust. <h2>What We Stand For</h2> Specialization. We do one thing, and we do it exceptionally well. Hygiene. No double-dipping, sinks in every room, sanitized between every client. Transparency. No memberships, no hidden fees, no pressure. Community. Women-owned, locally operated, deeply invested in Utah. Thank You, Utah To every client who has trusted us with their waxing needs since 2007: thank you. You are the reason we do what we do. Book your next appointment at waxmetoo.com.",
  "st-george-waxing-salon-utah": "Southern Utah's most trusted waxing studio is right here in St. George. Wax Me Too St. George has been serving Washington County since 2008 — just one year after we opened Utah's first waxing-only salon in Draper. We know Southern Utah, we love this community, and we're proud to be your go-to destination for professional waxing. <h2>Our St. George Studio</h2> Located inside Salon Aubri McKai at 175 W 900 S #9, St. George, UT 84770 , our studio features two fully equipped treatment rooms on the upper floor. We serve clients from throughout Washington County — including St. George, Washington, Hurricane, and Santa Clara — as well as visitors from nearby Mesquite, Nevada. <h2>Our Services in St. George</h2> We offer the full Wax Me Too menu in St. George: Brazilian wax and bikini waxing Eyebrow design, waxing, and tinting featuring The London Brow Company Full body waxing for women and men The Manzilian — men's Brazilian wax Facial waxing <h2>The London Brow Company — Exclusively at Wax Me Too</h2> We are proud to be the exclusive Utah retailer of The London Brow Company — a premium, vegan, cruelty-free brow product line. Available at our St. George location and select other Wax Me Too studios. Book Your St. George Appointment Book online at waxmetoo.com and select the St. George location. First-time clients get their Brazilian wax for $50.",
  "valentines-day-brazilian-wax-gift": "Brazilian Wax: The Ultimate Valentine's Day Gift. Looking for a Valentine's Day gift that's unisex, intimate, and genuinely useful? The Brazilian wax is the answer. Here's why thousands of Utah couples make Wax Me Too their Valentine's Day tradition. A Brazilian wax removes all hair from the bikini area, leaving skin smooth for 3-6 weeks. It's the perfect gift for yourself or your partner. At Wax Me Too, we've been providing professional Brazilian waxes in Utah since 2007. Our licensed estheticians are experts at making clients comfortable. Book your Valentine's Day wax at any of our 6 Utah locations: Layton, South Jordan, Orem, Salt Lake City, Draper, or St. George. First-time clients get their Brazilian wax for $50.",
  "mens-eyebrow-waxing-metrosexual": "Gentlemen, it's time to talk about your eyebrows. Well-groomed brows are no longer the exclusive domain of women — and they haven't been for years. At Wax Me Too , men's eyebrow waxing is one of our fastest-growing services, and the results speak for themselves. <h2>Why Men Should Wax Their Eyebrows</h2> Your eyebrows frame your face. Overgrown, unruly brows can make you look older, more tired, and less polished than you actually are. A clean, well-shaped brow — even a subtle one — makes a significant difference in your overall appearance. The key for men's eyebrow waxing is subtlety. We're not here to give you a dramatic arch or a heavily defined shape. We're here to clean up the edges, remove the strays, and give your natural brow a neat, groomed appearance that looks intentional without looking overdone. <h2>What to Expect</h2> Men's eyebrow waxing at Wax Me Too takes about 10–15 minutes. Your esthetician will assess your natural brow shape and discuss your preferences before beginning. The service removes stray hairs above, below, and between the brows, leaving a clean, natural-looking result. <h2>The Unibrow: We Can Help</h2> If you're dealing with a unibrow, we can take care of that too — quickly, cleanly, and with results that last 3–4 weeks. No more daily tweezing or shaving between the brows. Book Your Men's Eyebrow Wax Book at waxmetoo.com and select \"Men's Eyebrow Wax\" from the service menu. First-time clients get their Brazilian wax for $50.",
};

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
  "wax-me-too-happy-faces-community": {
    title: "Wax Me Too Gives Back to Utah's Youth",
    description: "At Wax Me Too , our greatest reward isn't a five-star review or a full appointment book — it's the look on a client's face when they leave our studio feeling...",
    excerpt: "At Wax Me Too , our greatest reward isn't a five-star review or a full appointment book — it's the look on a client's face when they leave our studio feeling confident, cared for, and completely smoot",
  },
  "draper-waxing-salon-expansion": {
    title: "Draper Waxing Salon Expands | Wax Me Too",
    description: "Due to overwhelming demand, our Draper studio inside Image Studios has opened its fourth treatment room. Owner Joann Gibb shares what drives the summer surge...",
    excerpt: "Due to overwhelming demand, our Draper studio inside Image Studios has opened its fourth treatment room. Owner Joann Gibb shares what drives the summer surge in waxing appointments — and why once clie",
  },
  "salt-lake-city-waxing-salon": {
    title: "Brazilian Waxing in Salt Lake City | Wax Me Too",
    description: "Our downtown Salt Lake City studio is one of our busiest — and for good reason. 3 treatment rooms, 7 expert waxers, and hours from early morning to late even...",
    excerpt: "Our downtown Salt Lake City studio is one of our busiest — and for good reason. 3 treatment rooms, 7 expert waxers, and hours from early morning to late evening. Here",
  },
  "layton-waxing-salon-new-location": {
    title: "Wax Me Too Layton Moves to Fort Lane Plaza",
    description: "After 4 years of outgrowing our old space, Wax Me Too Layton has moved to a stunning new studio at 360 Fort Lane. Fresh paint, new flooring, sinks in every r...",
    excerpt: "After 4 years of outgrowing our old space, Wax Me Too Layton has moved to a stunning new studio at 360 Fort Lane. Fresh paint, new flooring, sinks in every room, and the same expert team you",
  },
  "layton-waxing-milly-speaks-spanish": {
    title: "Brazilian Waxing in Layton | Habla Español",
    description: "Meet Milly — our newest Layton esthetician with 20 years of experience, originally from Venezuela, and fluent in Spanish. Wax Me Too Layton is proud to serve...",
    excerpt: "Meet Milly — our newest Layton esthetician with 20 years of experience, originally from Venezuela, and fluent in Spanish. Wax Me Too Layton is proud to serve our Spanish-speaking community at our beau",
  },
  "hair-removal-layton-utah": {
    title: "Hair Removal in Layton Utah | Wax Me Too Team",
    description: "Our Layton studio has grown from a one-woman operation to a full team of 5 licensed waxing specialists in a beautiful stand-alone space just off Layton Parkw...",
    excerpt: "Our Layton studio has grown from a one-woman operation to a full team of 5 licensed waxing specialists in a beautiful stand-alone space just off Layton Parkway. Here",
  },
  "how-often-should-you-wax": {
    title: "How Often Should You Wax? Frequency Guide",
    description: "Most clients wax every 4 weeks — but the right frequency depends on your hair growth cycle, the area being waxed, and your personal preference. Here",
    excerpt: "Most clients wax every 4 weeks — but the right frequency depends on your hair growth cycle, the area being waxed, and your personal preference. Here",
  },
  "ingrown-hair-prevention-waxing": {
    title: "Ingrown Hairs After Waxing: How to Prevent",
    description: "Ingrown hairs are one of the most common concerns after waxing — but they",
    excerpt: "Ingrown hairs are one of the most common concerns after waxing — but they",
  },
  "waxing-aftercare-guide": {
    title: "Waxing Aftercare: Complete Post-Wax Guide",
    description: "What you do in the 24–48 hours after your wax matters as much as the wax itself. Here",
    excerpt: "What you do in the 24–48 hours after your wax matters as much as the wax itself. Here",
  },
  "waxing-before-care-guide": {
    title: "How to Prepare for Your Wax | Before-Care Guide",
    description: "The secret to a great wax starts before you even walk in the door. Here",
    excerpt: "The secret to a great wax starts before you even walk in the door. Here",
  },
  "waxing-faq-utah": {
    title: "Waxing FAQ: Top Questions Answered | Wax Me Too",
    description: "Can you wax during your period? How long does hair need to be? Does waxing hurt less over time? We answer the 20 most common questions we hear from new and r...",
    excerpt: "Can you wax during your period? How long does hair need to be? Does waxing hurt less over time? We answer the 20 most common questions we hear from new and returning clients at Wax Me Too",
  },
  "waxing-for-men-manzilian-guide": {
    title: "Men's Waxing Guide: The Manzilian | Wax Me Too",
    description: "Men's waxing has gone mainstream — and for good reason. From athletes seeking peak performance to professionals who simply prefer a cleaner look, more men th...",
    excerpt: "Men's waxing has gone mainstream — and for good reason. From athletes seeking peak performance to professionals who simply prefer a cleaner look, more men than ever are discovering the benefits of pro",
  },
  "waxing-sensitive-skin-guide": {
    title: "Waxing with Sensitive Skin | Wax Me Too Tips",
    description: "Sensitive skin doesn",
    excerpt: "Sensitive skin doesn",
  },
  "waxing-while-pregnant-utah": {
    title: "Can You Wax While Pregnant? | Wax Me Too Utah",
    description: "Yes, you can wax while pregnant — with a few important considerations. Our licensed estheticians at Wax Me Too have helped hundreds of expecting moms stay sm...",
    excerpt: "Yes, you can wax while pregnant — with a few important considerations. Our licensed estheticians at Wax Me Too have helped hundreds of expecting moms stay smooth and comfortable throughout their pregn",
  },
  "15-minute-brazilian-wax-experience": {
    title: "The 15-Minute Brazilian Wax | Wax Me Too",
    description: "Fifteen minutes. That",
    excerpt: "Fifteen minutes. That",
  },
  "naked-and-afraid-first-brazilian": {
    title: "The Real Truth About Your First Brazilian Wax",
    description: "Being naked in front of a stranger, the pain, the embarrassing positions — these are the fears that keep first-timers away from their first Brazilian wax. Here",
    excerpt: "Being naked in front of a stranger, the pain, the embarrassing positions — these are the fears that keep first-timers away from their first Brazilian wax. Here",
  },
  "bikini-wax-types-explained": {
    title: "Brazilian vs. Bikini Wax: Which Is Right for You?",
    description: "Not sure which bikini wax to book? We break down the differences between a Brazilian, Deep Bikini, and standard Bikini wax — so you can walk into your appoin...",
    excerpt: "Not sure which bikini wax to book? We break down the differences between a Brazilian, Deep Bikini, and standard Bikini wax — so you can walk into your appointment knowing exactly what you want.",
  },
  "eyebrow-design-waxing-guide": {
    title: "Eyebrow Design: Get the Best Brows of Your Life",
    description: "At Wax Me Too, we don",
    excerpt: "At Wax Me Too, we don",
  },
  "underarm-waxing-guide-utah": {
    title: "Underarm Waxing Guide | Wax Me Too Utah",
    description: "Underarm waxing is one of the most underrated services at Wax Me Too. It takes just 10 minutes, lasts 3–4 weeks, and leaves your underarms smoother than any ...",
    excerpt: "Underarm waxing is one of the most underrated services at Wax Me Too. It takes just 10 minutes, lasts 3–4 weeks, and leaves your underarms smoother than any razor ever could. Here",
  },
  "3-worst-things-waxing-salon": {
    title: "3 Red Flags in a Waxing Salon | Wax Me Too",
    description: "A dirty sink. A messy workstation. An unhappy esthetician. These are the three biggest red flags in any waxing salon — and why Wax Me Too",
    excerpt: "A dirty sink. A messy workstation. An unhappy esthetician. These are the three biggest red flags in any waxing salon — and why Wax Me Too",
  },
  "brazilian-wax-benefits-vs-shaving": {
    title: "Brazilian Wax vs. Shaving: Why Waxing Wins",
    description: "Shaving leaves stubble, ingrown hairs, and razor burn. Waxing removes hair from the root, leaving skin smooth for weeks and causing hair to grow back finer o...",
    excerpt: "Shaving leaves stubble, ingrown hairs, and razor burn. Waxing removes hair from the root, leaving skin smooth for weeks and causing hair to grow back finer over time. Here",
  },
  "brazilian-waxing-salon-qa": {
    title: "Brazilian Waxing Q&A: Your Top Questions",
    description: "How do I choose the right waxing salon? What should I look for in a treatment room? How do I prepare for my first Brazilian? We answer the most common questi...",
    excerpt: "How do I choose the right waxing salon? What should I look for in a treatment room? How do I prepare for my first Brazilian? We answer the most common questions we hear from new clients at Wax Me Too.",
  },
  "prevention-magazine-bikini-wax-tips": {
    title: "Prevention Magazine: 9 Bikini Wax Tips",
    description: "Prevention Magazine called us — one of America",
    excerpt: "Prevention Magazine called us — one of America",
  },
  "throw-away-your-razor": {
    title: "7 Reasons to Switch from Shaving to Waxing",
    description: "Razor burn, stubble, nicks, and hair that grows back thicker — shaving is the worst. Here are 7 compelling reasons to throw away your razor and switch to pro...",
    excerpt: "Razor burn, stubble, nicks, and hair that grows back thicker — shaving is the worst. Here are 7 compelling reasons to throw away your razor and switch to professional waxing at Wax Me Too.",
  },
  "holiday-waxing-on-top-of-the-world": {
    title: "Holiday Waxing at Wax Me Too | Utah",
    description: "The holidays are hectic — but a 15-minute Brazilian wax can make even the most exhausted mom feel amazing. Here",
    excerpt: "The holidays are hectic — but a 15-minute Brazilian wax can make even the most exhausted mom feel amazing. Here",
  },
  "valentines-day-free-brazilian-2013": {
    title: "Win a Free Brazilian Wax — Valentine's 2013",
    description: "Love is in the air — and so is the chance to win a free Brazilian wax. At Wax Me Too , we're celebrating Valentine's Day 2013 with a special giveaway: one lu...",
    excerpt: "Love is in the air — and so is the chance to win a free Brazilian wax. At Wax Me Too , we're celebrating Valentine's Day 2013 with a special giveaway: one lucky winner will receive a complimentary Bra",
  },
  "free-bikini-wax-drawing-utah": {
    title: "Free Bikini Wax Drawing | Wax Me Too Utah",
    description: "Here's your chance to win a free bikini wax from Wax Me Too — Utah's premier professional waxing studio. We're running a monthly drawing, and entering takes ...",
    excerpt: "Here's your chance to win a free bikini wax from Wax Me Too — Utah's premier professional waxing studio. We're running a monthly drawing, and entering takes less than a minute. How to Enter Visit our ",
  },
  "utah-waxing-salon-established-2007": {
    title: "Utah's First Waxing-Only Salon | Wax Me Too",
    description: "In 2007, two best friends with a shared vision opened Utah's first waxing-only salon in Draper. They called it Wax Me Too . Nearly two decades later, that vi...",
    excerpt: "In 2007, two best friends with a shared vision opened Utah's first waxing-only salon in Draper. They called it Wax Me Too . Nearly two decades later, that vision has grown into a network of 6 studios ",
  },
  "st-george-waxing-salon-utah": {
    title: "Waxing in St. George Utah | Wax Me Too",
    description: "Southern Utah's most trusted waxing studio is right here in St. George. Wax Me Too St. George has been serving Washington County since 2008 — just one year a...",
    excerpt: "Southern Utah's most trusted waxing studio is right here in St. George. Wax Me Too St. George has been serving Washington County since 2008 — just one year after we opened Utah's first waxing-only sal",
  },
  "mens-eyebrow-waxing-metrosexual": {
    title: "Men's Eyebrow Waxing: Why Guys Love Wax Me Too",
    description: "Gentlemen, it's time to talk about your eyebrows. Well-groomed brows are no longer the exclusive domain of women — and they haven't been for years. At Wax Me...",
    excerpt: "Gentlemen, it's time to talk about your eyebrows. Well-groomed brows are no longer the exclusive domain of women — and they haven't been for years. At Wax Me Too , men's eyebrow waxing is one of our f",
  },
  "valentines-day-brazilian-wax-gift": {
    title: "Brazilian Wax: The Ultimate Valentine's Day Gift",
    description: "The Brazilian wax is the perfect Valentine's Day gift. Wax Me Too Utah offers professional waxing for couples since 2007. Book at any of our 6 Utah locations.",
    excerpt: "Looking for a Valentine's Day gift that's unisex, intimate, and genuinely useful? The Brazilian wax is the answer. Thousands of Utah couples choose Wax Me Too.",
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
        bodyText: `<h2>${loc.name} Waxing Studio — Wax Me Too Utah</h2>
Wax Me Too ${loc.name}. ${loc.address}. Phone: ${loc.phone}.
${loc.description}
Services: Brazilian Wax $65 | Deep Bikini Wax $55 | Bikini Wax $45 | Brow Wax $20 | Brow Lamination $75 | Full Leg Wax $75 | Half Leg Wax $45 | Underarm Wax $25 | Lip Wax $12 | Chin Wax $12.
First-time clients: Brazilian wax for $50. Book online at booking.mangomint.com/593822.`,
      };
    }
  }

  // Blog post pages: /blog/:slug
  const blogMatch = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    const post = BLOG_POSTS[slug];
    if (post) {
      const imageRelPath = BLOG_POST_IMAGES[slug];
      const ogImage = imageRelPath ? `https://waxmetoo.com${imageRelPath}` : undefined;
      return {
        title: post.title,
        description: post.description,
        ogImage,
        bodyText: BLOG_BODY_TEXTS[slug]
          ? `<h2>${post.title}</h2>\n${BLOG_BODY_TEXTS[slug]}\n\nWax Me Too — Utah's women-owned waxing studio since 2007. 6 locations: Layton, South Jordan, Orem, Salt Lake City, Draper, St. George. Book: booking.mangomint.com/593822.`
          : `<h2>${post.title}</h2>\n${post.excerpt}\nWax Me Too — Utah's women-owned waxing studio since 2007. 6 locations: Layton, South Jordan, Orem, Salt Lake City, Draper, St. George. Book: booking.mangomint.com/593822.`,
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

  // Inject Open Graph tags (og:title, og:description, og:type, og:image).
  // These are inserted right after the <title> tag so social crawlers
  // (Facebook, Twitter/X, LinkedIn, Slack, iMessage) see the correct
  // preview title, description, and image without waiting for React.
  const ogTags = [
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="${meta.ogImage ? 'article' : 'website'}" />`,
    meta.ogImage ? `<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />` : '',
    meta.ogImage ? `<meta property="og:image:width" content="800" />` : '',
    meta.ogImage ? `<meta property="og:image:height" content="533" />` : '',
    meta.ogImage ? `<meta name="twitter:card" content="summary_large_image" />` : '',
    meta.ogImage ? `<meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />` : '',
  ].filter(Boolean).join('\n  ');
  // Insert OG tags after </title> — replace any existing og: tags first to avoid duplicates
  result = result.replace(/<meta property="og:[^>]*\/>/g, '');
  result = result.replace(/<meta name="twitter:[^>]*\/>/g, '');
  result = result.replace(
    /<\/title>/,
    `</title>\n  ${ogTags}`
  );

  // Strip the manus-runtime inline script (platform visual-editor tool, 366KB).
  // Crawlers don't need it; removing it reduces HTML size from ~370KB to ~2KB,
  // which is the primary fix for the low text-to-HTML ratio SEMrush flag.
  result = result.replace(/<script id="manus-runtime">[\s\S]*?<\/script>/, '');

  // Inject a <link rel="preload"> for the blog post hero image.
  // The hero is rendered as a CSS background-image (not an <img>), so the browser
  // discovers it late — only after parsing CSS and JS. A preload hint moves it
  // to the highest-priority fetch queue, reducing LCP on blog post pages.
  // This directly addresses the SEMrush "Slow page load" flag on blog posts.
  if (meta.ogImage) {
    const preloadLink = `<link rel="preload" as="image" href="${escapeHtml(meta.ogImage)}" fetchpriority="high" />`;
    result = result.replace('</head>', `  ${preloadLink}\n</head>`);
  }

  // Inject prerender body text before </body>.
  // bodyText may contain real HTML tags (h1, a, p) — inject as raw HTML so crawlers
  // can parse the h1 heading and follow the internal navigation links.
  // The div is visually hidden from users (font-size:0.01px, color:transparent) but
  // fully readable by search engine crawlers — same content, no cloaking.
  //
  // SITE-WIDE NAV BLOCK: appended to every page so every sitemap URL has at least
  // one inbound internal link visible in server HTML, fixing the SEMrush
  // "orphaned sitemap pages" issue (Issue #6).
  const siteNavBlock = `
<nav id="prerender-site-nav" aria-label="Site navigation" style="font-size:0.01px;line-height:0;color:transparent;pointer-events:none;user-select:none;">
<a href="/">Home</a>
<a href="/services">Waxing Services &amp; Pricing</a>
<a href="/locations">Locations</a>
<a href="/about">About Us</a>
<a href="/faq">FAQ</a>
<a href="/blog">Blog</a>
<a href="/contact">Contact</a>
<a href="/first-visit">First Visit</a>
<a href="/before-care">Before Care</a>
<a href="/after-care">After Care</a>
<a href="/win-a-free-wax">Win a Free Wax</a>
<a href="/privacy-policy">Privacy Policy</a>
<a href="/terms-of-service">Terms of Service</a>
<a href="/locations/layton">Layton Waxing Studio</a>
<a href="/locations/south-jordan">South Jordan Waxing Studio</a>
<a href="/locations/orem">Orem Waxing Studio</a>
<a href="/locations/salt-lake-city">Salt Lake City Waxing Studio</a>
<a href="/locations/draper">Draper Waxing Studio</a>
<a href="/locations/st-george">St. George Waxing Studio</a>
<a href="/blog/win-complimentary-bikini-wax-summer">Win a Free Bikini Wax — Smooth Just in Time for Summer</a>
<a href="/blog/st-george-premier-waxing-salon">St. George's Premier Waxing Salon</a>
<a href="/blog/vacation-waxing-prep-guide">How to Prep for Your Winter Escape with Wax Me Too</a>
<a href="/blog/military-discounts-wax-me-too-layton">Military Discounts at Wax Me Too Layton</a>
<a href="/blog/why-waxing-is-best-hair-removal">Why Waxing Is the Best Hair Removal Method</a>
<a href="/blog/bridal-waxing-guide">Pre-Wedding Waxing: Brows to Toes Bridal Guide</a>
<a href="/blog/south-jordan-waxing-salon-relocation">Wax Me Too South Jordan Moves to a Better Space</a>
<a href="/blog/south-jordan-6th-location-opening">Why Wax Me Too South Jordan Stands Apart</a>
<a href="/blog/free-bikini-wax-layton-utah">Win a Free Bikini Wax in Layton Utah</a>
<a href="/blog/wax-me-too-difference-local-salon">Why Wax Me Too Beats Every Chain in Utah</a>
<a href="/blog/summer-waxing-utah-guide">Summer Waxing in Utah: Stay Smooth All Season</a>
<a href="/blog/first-brazilian-wax-step-by-step">Your First Brazilian Wax at Wax Me Too: What to Know</a>
<a href="/blog/spring-adventure-waxing-utah">Get Waxed and Ready for Utah's Outdoor Season</a>
<a href="/blog/south-jordan-waxing-grand-opening">Wax Me Too South Jordan: Utah's 6th Waxing Studio</a>
<a href="/blog/waxing-south-jordan-utah-opening">South Jordan Waxing: What to Know Before Your Visit</a>
<a href="/blog/valentines-day-waxing-rippp-and-swear">Valentine's Day Waxing at Wax Me Too</a>
<a href="/blog/valentines-day-free-wax-giveaway-2017">Valentine's Day Free Wax Giveaway 2017</a>
<a href="/blog/sundance-film-festival-waxing-utah">Sundance Film Festival Waxing Utah</a>
<a href="/blog/layton-waxing-salon-new-team">Layton Waxing Salon New Team</a>
<a href="/blog/pre-vacation-waxing-checklist">Pre-Vacation Waxing Checklist</a>
<a href="/blog/free-bikini-wax-drawing-utah">Free Bikini Wax Drawing Utah</a>
<a href="/blog/holiday-waxing-on-top-of-the-world">Holiday Waxing at Wax Me Too</a>
<a href="/blog/3-worst-things-waxing-salon">3 Red Flags in a Waxing Salon</a>
<a href="/blog/underarm-waxing-guide-utah">Underarm Waxing Guide Utah</a>
<a href="/blog/throw-away-your-razor">7 Reasons to Switch from Shaving to Waxing</a>
<a href="/blog/bikini-wax-types-explained">Brazilian vs. Bikini Wax: Which Is Right for You?</a>
<a href="/blog/naked-and-afraid-first-brazilian">The Real Truth About Your First Brazilian Wax</a>
<a href="/blog/mens-eyebrow-waxing-metrosexual">Men's Eyebrow Waxing: Why Guys Love Wax Me Too</a>
<a href="/blog/eyebrow-design-waxing-guide">Eyebrow Design: Get the Best Brows of Your Life</a>
<a href="/blog/hair-removal-layton-utah">Hair Removal in Layton Utah</a>
<a href="/blog/brazilian-waxing-salon-qa">Brazilian Waxing Q&amp;A: Your Top Questions</a>
<a href="/blog/prevention-magazine-bikini-wax-tips">Prevention Magazine: 9 Bikini Wax Tips</a>
<a href="/blog/layton-waxing-milly-speaks-spanish">Layton Waxing — Milly Speaks Spanish</a>
<a href="/blog/valentines-day-brazilian-wax-gift">Brazilian Wax: The Ultimate Valentine's Day Gift</a>
<a href="/blog/layton-waxing-salon-new-location">Layton Waxing Salon New Location</a>
<a href="/blog/15-minute-brazilian-wax-experience">The 15-Minute Brazilian Wax Experience</a>
<a href="/blog/draper-waxing-salon-expansion">Draper Waxing Salon Expansion</a>
<a href="/blog/salt-lake-city-waxing-salon">Salt Lake City Waxing Salon</a>
<a href="/blog/valentines-day-free-brazilian-2013">Win a Free Brazilian Wax — Valentine's 2013</a>
<a href="/blog/utah-waxing-salon-established-2007">Utah's First Waxing-Only Salon</a>
<a href="/blog/brazilian-wax-benefits-vs-shaving">Brazilian Wax vs. Shaving: Why Waxing Wins</a>
<a href="/blog/waxing-while-pregnant-utah">Waxing While Pregnant Utah</a>
<a href="/blog/ingrown-hair-prevention-waxing">Ingrown Hair Prevention Waxing</a>
<a href="/blog/waxing-sensitive-skin-guide">Waxing Sensitive Skin Guide</a>
<a href="/blog/how-often-should-you-wax">How Often Should You Wax?</a>
<a href="/blog/waxing-for-men-manzilian-guide">Waxing for Men: Manzilian Guide</a>
<a href="/blog/st-george-waxing-salon-utah">Waxing in St. George Utah</a>
<a href="/blog/waxing-aftercare-guide">Waxing Aftercare Guide</a>
<a href="/blog/waxing-before-care-guide">Waxing Before Care Guide</a>
<a href="/blog/wax-me-too-happy-faces-community">Wax Me Too Happy Faces Community</a>
<a href="/blog/waxing-faq-utah">Waxing FAQ Utah</a>
</nav>`;

  const prerenderBlock = `
<div id="prerender-content" style="font-size:0.01px;line-height:0;color:transparent;pointer-events:none;user-select:none;" aria-hidden="true">
${meta.bodyText}
${siteNavBlock}
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
