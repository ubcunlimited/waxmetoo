# Wax Me Too — Project TODO

## Core Website

- [x] Homepage (Hero, Services preview, Testimonials, Locations, Blog teaser, FAQ preview, CTA strip)
- [x] Services page (Women's, Men's, Face, Tinting sections)
- [x] First Visit page
- [x] About page
- [x] Locations hub page — 6 real locations in 3-column grid
- [x] Location detail pages (dynamic /locations/:id)
- [x] FAQ page
- [x] Contact page
- [x] Before Care page
- [x] After Care page
- [x] Privacy Policy page
- [x] Terms & Conditions page
- [x] 404 Not Found page

## Brand & Design

- [x] Brand color palette (#F7F3EE, #3B2F2A, #CFA7A0, #A8B3AA, #D8C6B6, #4A4A4A)
- [x] Cormorant Garamond + DM Sans typography
- [x] Horizontal logo in header and footer
- [x] Header: warm ivory background, sticky, mobile hamburger menu
- [x] Footer: horizontal logo + "From Brows to Toes & Anything in Between!™" tagline
- [x] Promo banner: "New Clients: Enjoy 20% off your first service"
- [x] Sticky mobile booking button

## Locations

- [x] 6 real locations: Layton, South Jordan, Orem, Salt Lake City, Draper, St. George
- [x] Real addresses from waxmetoo.com
- [x] 3 cards per row on Locations page
- [x] Coverage copy: "From Weber County to Utah County, and from Washington County to Mesquite, Nevada"
- [x] No Provo location (replaced with Layton)

## Blog

- [x] 51 SEO-optimized blog posts from waxmetoo.blogspot.com (2012–2024)
- [x] Blog index with 2-column layout (posts grid + sidebar)
- [x] Blog sidebar: search, category filter, tag cloud, year/month archive tree, recent posts
- [x] Blog post detail page: full-width hero, article prose, tags, related posts, social share
- [x] Social share buttons: Facebook, Pinterest, X, Copy Link
- [x] Related posts section (tag-based, 3 posts)
- [x] Tags displayed at bottom linking to filtered blog grid
- [x] Unique hero images for all 51 posts (no duplicates, spa/wellness only)
- [x] In-article images distinct from hero images
- [x] Dynamic meta titles/descriptions on all pages

## Backend & Database

- [x] Full-stack upgrade (web-db-user template: Express + tRPC + MySQL/Drizzle)
- [x] Database schema: users, giveaway_entries, giveaway_winners tables
- [x] DB migration pushed (pnpm db:push)
- [x] giveawayDb.ts — all DB query helpers
- [x] giveawayEmail.ts — confirmation + winner email HTML templates
- [x] giveawayRouter.ts — tRPC router (enter, confirm, drawWinner, winners, entries, stats)
- [x] routers.ts — giveaway router registered at trpc.giveaway.*

## Giveaway Feature

- [x] Win a Free Wax landing page (/win-a-free-wax) — form with first name, last name, email
- [x] Double opt-in: confirmation email sent on entry, resent if unconfirmed duplicate
- [x] Email confirmation page (/win-a-free-wax/confirm?token=...) — reads token, calls confirm
- [x] Admin Giveaway Dashboard (/admin/giveaway) — stats, draw winner, past winners, all entries
- [x] Admin protection: role === 'admin' check on all admin procedures + frontend redirect
- [x] "🎁 Win a Free Wax" highlighted link in header navigation (desktop + mobile)
- [x] Vitest tests: 12 giveaway tests + 1 auth test — all passing

## New Features (Phase 2)

- [x] Homepage giveaway promo section (teaser card between blog teaser and CTA strip)
- [x] Social share feature on /win-a-free-wax (Facebook, Instagram, X, copy link with pre-filled text)
- [x] Automated monthly winner draw via server-side cron job (node-cron, runs 1st of month)
- [x] DB schema: blog_posts table (title, slug, excerpt, content, hero_image, tags, published_at, status)
- [x] DB schema: newsletter_subscribers table (email, first_name, confirmed, source)
- [x] DB migration pushed for new tables
- [x] Blog post DB helpers (CRUD)
- [x] Blog post tRPC router (list, get, create, update, delete — admin protected)
- [x] Newsletter subscriber DB helpers and tRPC router
- [x] Admin blog management UI: list all posts, create new post, edit post, delete post
- [x] Admin blog management UI: markdown editor for post content
- [x] Admin subscriber management UI: list all subscribers, export CSV
- [x] Admin giveaway automation controls: enable/disable auto-draw, view cron status
- [x] Admin Hub page (/admin) — central landing page with links to all admin sections
- [x] Admin Blog Management page (/admin/blog) — list, create, edit, delete with search/filter
- [x] Admin Subscribers page (/admin/subscribers) — list, stats, CSV export, force-unsubscribe
- [x] Vitest tests: 16 blog + 5 scheduler + 12 giveaway + 1 auth = 34 total, all passing

## Phase 5 — Sage Green (#A8B3AA) Accent Highlights

- [x] Add --sage CSS variable to index.css and define sage utility classes
- [x] Apply sage green to section eyebrow labels (e.g. "OUR SERVICES", "TESTIMONIALS")
- [x] Apply sage green to decorative dividers and horizontal rules
- [x] Apply sage green to tag chips on blog posts and service cards
- [x] Apply sage green to icon accents (checkmarks, bullets, step numbers)
- [x] Apply sage green to secondary nav link hover states
- [x] Apply sage green tint to alternating section backgrounds
- [x] Apply sage green to footer accent elements
- [x] Apply sage green to giveaway step indicators and share panel
- [x] Apply sage green to admin stat cards and table headers

## Phase 6 — Pricing Update from Spreadsheet

- [x] Parse pricingforwaxmetoo2.xlsx and extract all service/price data
- [x] Rewrite Services page with new category hierarchy (Most Popular, Ladies sections, Men sections)
- [x] Apply real prices from spreadsheet to all service items

## Phase 7 — Pricing Simplification

- [x] Remove priceCard from all ServiceItem entries in data.ts
- [x] Remove cash/card toggle from Services page hero
- [x] Remove "Pricing note" cash discount banner from Services page
- [x] Remove cash/card column header and dual-price display from PriceRow
- [x] Remove cash/card references from expanded service detail panels
- [x] Remove cash discount language from FAQ (data.ts + BlogPost.tsx + Terms.tsx)

## Phase 8 — Homepage Most Popular Sync

- [x] Replace hardcoded homepage service cards with dynamic mostPopular data array
- [x] Link each card to /services?tab=popular for direct navigation

## Phase 9 — Homepage Services Grid Layout

- [x] Change homepage services grid from lg:grid-cols-3 to lg:grid-cols-2

## Phase 10 — Dual Pricing (Current + June 1 2026)

- [x] Parse wax_me_too_pricing_sheet_june_1_2026.xlsx and extract all current and new prices
- [x] Update data.ts ServiceItem type to include priceNew (June 1) alongside price (current)
- [x] Update all service items in data.ts with correct current and June 1 prices
- [x] Redesign Services page PriceRow to show current price and upcoming price side-by-side
- [x] Add June 1 notice banner and "Price update" badge on subcategory panels with changes
- [x] Update homepage mostPopular cards to reflect current pricing (synced via data.ts)

## Phase 11 — waxdoc.docx Changes

### Header / Promo Banner
- [x] Add Book Now pill button to the top promo banner
- [x] Add Win a Free Wax button to the top promo banner
- [x] Keep "New Clients: Enjoy 20% off" text but replace plain "Book Now" text with pill button

### First Visit Page
- [x] Add "nerves" after "First-time" in the hero copy
- [x] Update "Completely private" bullet copy (add laughter/music line)
- [x] Update "Efficient & Respectful" bullet copy (change "stay on schedule" to "do our best to stay on time")
- [x] Add new "Sinks in every treatment room" bullet point
- [x] Rewrite "Arrive & check in" step (Mangomint app / text message check-in)
- [x] Delete "Meet your esthetician" step
- [x] Rewrite "Your Service" step (treatment room, preparation, privacy for intimate services)
- [x] Remove any suggestion that clients shouldn't wax on their period (First Visit, Before Care, FAQ)
- [x] Add highlighted callout box: Accutane, AHA, and retinol users cannot wax (First Visit + Before Care)
- [x] Change "3-4 weeks of shaving" to "10 days from shaving" everywhere on the site (First Visit, Before Care, FAQ)

### Before Care / After Care Pages
- [x] Replace "avoid hot showers and baths" with "don't swim in Utah Lake" (funny tone)
- [x] Delete "avoid heavy exercise" from after care
- [x] Delete "wear loose comfortable clothing" from after care
- [x] Delete "Avoid Caffeine" from before/after care
- [x] Add PFB product note under ingrown hair prevention in after care
- [x] Add military and student discount highlight (First Visit page — sage green callout card)

## Phase 12 — Men's Services Accordion

- [x] Reorder menSections in data.ts: Below the Belt, Combos, Arms & Legs, Neck to Stomach, Face Waxing
- [x] Services page accordion: single-open behavior (opening one closes the others), first item open by default

## Phase 13 — Copy Edits (FAQ, Hair Length, Clothing)

- [x] Update "Is it embarrassing to get a Brazilian wax?" FAQ answer with body-positive language
- [x] Add period note "On your period? No problem. We will work around the string." to FAQ
- [x] Fix hair length copy to: 1/4 inch long, 10 days after shaving, 3-4 weeks after waxing
- [x] Remove all "loose/comfortable clothing" references site-wide (BlogPost.tsx x9, data.ts, FAQ auto-synced)

## Phase 14 — Auto-Hide Current Pricing After June 1, 2026

- [ ] Add isPastJune1 constant (new Date() >= new Date('2026-06-01')) to Services.tsx
- [ ] Conditionally hide the current price column and "Price update" badge when isPastJune1 is true
- [ ] Rename the "From June 1" label to just the price when isPastJune1 is true (no more "upcoming" framing)
- [ ] Remove the June 1 notice banner when isPastJune1 is true

## Phase 15 — Mascot Easter Egg (Where's Waldo)

- [x] Generate full-body transparent PNG mascot (red hair, black tank, confident pose, no background)
- [x] Upload mascot PNG to webdev static assets (/manus-storage/mascot_transparent_2e3ceae0.png)
- [x] Create MascotEasterEgg component with unique position/pose per page
- [x] Add hidden mascot to: Home, Services, Blog, BlogPost, FirstVisit, BeforeCare, AfterCare, FAQ, Locations, About, WinAFreeWax (11 pages)
- [x] Add a fun tooltip on hover: "You found me! 💅"
