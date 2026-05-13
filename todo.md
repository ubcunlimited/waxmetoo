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

- [x] Add isPastJune1 constant (new Date() >= new Date('2026-06-01')) to Services.tsx
- [x] Conditionally hide the current price column and "Price update" badge when isPastJune1 is true
- [x] Rename the "From June 1" label to just the price when isPastJune1 is true (no more "upcoming" framing)
- [x] Remove the June 1 notice banner when isPastJune1 is true

## Phase 15 — Mascot Easter Egg (Where's Waldo)

- [x] Generate full-body transparent PNG mascot (red hair, black tank, confident pose, no background)
- [x] Upload mascot PNG to webdev static assets (/manus-storage/mascot_transparent_2e3ceae0.png)
- [x] Create MascotEasterEgg component with unique position/pose per page
- [x] Add hidden mascot to: Home, Services, Blog, BlogPost, FirstVisit, BeforeCare, AfterCare, FAQ, Locations, About, WinAFreeWax (11 pages)
- [x] Add a fun tooltip on hover: "You found me! 💅"

## Phase 16 — Mascot Redesign (Where's Waldo Game)

- [x] Regenerate mascot: full-body, mini skirt knee dress, bare feet, red updo, transparent background
- [x] Upload new mascot PNG to webdev static assets (/manus-storage/mascot_v2_transparent_835c9480.png)
- [x] Update MascotEasterEgg component: 82px tall (≈2 inches), 45-52% opacity, low saturation filter
- [x] Each page gets a unique hiding spot — partially off left/right edge, rotated, flipped on 11 pages
- [x] Add subtle CSS: low opacity + saturate(0.7) filter until hovered, then full color + scale(1.18)

## Phase 17 — Mascot Hunt Redesign + Reward System

- [x] Generate mascot pose variants: laying down (horizontal), peeking sideways, sitting/crouching
- [x] Remove fixed positioning — mascot scrolls with page content (absolute/relative in page flow)
- [x] Mascot peeks behind real elements: card edges, section dividers, footer, image overlaps
- [x] Vary size per page: 100-280px wide, larger than previous 82px
- [x] DB schema: mascot_finds table (userId, pageId, foundAt) + mascot_rewards table (discountCode)
- [x] tRPC: recordFind, getProgress procedures (mascotRouter.ts)
- [x] Account registration page (/register) — explains hunt, links to Manus OAuth sign-in
- [x] Mascot hunt progress tracker (/mascot-hunt) — grid of 11 pages, found/not-found status, progress bar
- [x] Reward: one-time 15% discount code generated when all 11 mascots found (one per user)
- [x] Discount code stored in mascot_rewards table, shown with copy button, cannot be claimed twice
- [x] Vitest tests: 7 mascot tests — all passing (41 total tests across 5 test files)

## Phase 18 — Mascot Click-to-Disappear

- [x] Clicking the mascot plays a "caught!" scale-up + spin-out CSS animation (1.1 s)
- [x] After animation, mascot is removed from the DOM entirely
- [x] Found state persisted in localStorage (key: wmt_mascot_found) so mascot stays gone after page refresh
- [x] tRPC recordFind still called for authenticated users to sync server-side progress
- [x] Celebration bubble appears on click ("💅 Found her! See progress" or "Create account to track finds!")
- [x] Bubble fades out gracefully before mascot disappears
- [x] 0 TypeScript errors, 42 tests passing

## Phase 19 — Mascot Hunt Enhancements

- [x] DB schema: mascot_rewards updated with fullName/phone/email columns, discount changed to 20%
- [x] DB migration pushed (drizzle/0004_loving_dragon_lord.sql)
- [x] server/mascotDb.ts: resetUserFinds() helper deletes all finds for a user
- [x] server/mascotDb.ts: claimReward() stores contact info (fullName, phone, email) alongside discount code
- [x] server/mascotDb.ts: getOrCreateReward() no longer auto-creates reward (explicit claim required)
- [x] server/mascotRouter.ts: resetHunt procedure — clears DB finds for authenticated user
- [x] server/mascotRouter.ts: claimReward procedure — validates all 11 found, stores contact info, returns 20% code
- [x] MascotHuntBadge component — fixed bottom-left floating pill showing "🔍 X / 11" live
- [x] Badge updates instantly via custom "mascot-found" event dispatched from MascotEasterEgg
- [x] Badge hidden on /mascot-hunt page, invisible until first mascot found
- [x] Badge turns green with 🎉 and "Claim reward!" text when all 11 found
- [x] App.tsx: MascotHuntBadge mounted globally
- [x] MascotHunt page: Reset Hunt button with confirmation step (clears DB + localStorage)
- [x] MascotHunt page: Congratulations modal auto-opens on completion (if not yet claimed)
- [x] CongratsModal: Full Name / Phone / Email form → calls claimReward → shows discount code with copy button
- [x] MascotHunt page: reward card shown when already claimed (code + copy button + earned date)
- [x] 47 tests passing (5 test files), 0 TypeScript errors

## Phase 20 — Admin Mascot Page, Reward Email & Hint Tooltips

- [x] server/mascotEmail.ts: branded HTML reward confirmation email (matches site style)
- [x] server/mascotRouter.ts: claimReward now sends confirmation email to submitted address on first claim
- [x] server/mascotDb.ts: getAllRewards() — joins mascot_rewards with users table, ordered newest first
- [x] server/mascotDb.ts: getMascotStats() — returns totalClaimed and totalFinds counts
- [x] server/mascotRouter.ts: adminGetRewards procedure (admin-only)
- [x] server/mascotRouter.ts: adminStats procedure (admin-only)
- [x] AdminMascot.tsx: /admin/mascot page with stats cards, searchable table, CSV export, staff redemption guide
- [x] AdminHub.tsx: Mascot Hunt Claims card added with live stats
- [x] App.tsx: /admin/mascot route registered
- [x] MascotHunt.tsx: unfound grid cards show "Hover for a hint…" placeholder; tooltip bubble appears on hover with hint text and arrow
- [x] 47 tests passing (5 test files), 0 TypeScript errors

## Phase 21 — Footer Mascot Hunt Promo

- [x] Footer: add Mascot Hunt promo strip above bottom bar (🔍 headline, 20% discount callout, "Start the Hunt →" pill button)
- [x] Footer Quick Links: added "Win a Free Wax" link

## Phase 22 — Content Updates from Wax.docx

- [x] Home: hero headline → "Brazilian Waxing…. Perfected"
- [x] Home: review count → "1000+ five-star reviews"
- [x] Home: first-service offer → "Your first Brazilian, Deep Bikini, or Bikini wax 50% off"
- [x] Home: remove Manzilian from services, add Brow Wax and Design with new description
- [x] Home: Brazilian description → "Our signature service. Completely bare. Completely confident."
- [x] Home: Deep Bikini description → "More than a bikini, less than a Brazilian."
- [x] Home: Bikini description → "Perfectly tidy, removes anything outside the bikini line. Clean and classic."
- [x] Home: Most Popular — replace Manzilian with Eyebrow Wax
- [x] Home: New Clients banner → "50% off select services your first time in"
- [x] FirstVisit: "Completely private" copy update
- [x] FirstVisit: "Zero judgment" copy update
- [x] FirstVisit: Step 2 prep — remove exfoliate 24hrs, remove avoid lotion, add sun/spray tan warning
- [x] FirstVisit: Discomfort section — replace with new honest copy
- [x] FirstVisit: Before appt list — reorder sun exposure to #2, remove "hair too long" trim note
- [x] FirstVisit: After appt list — add Utah Lake / hot tub note, PFB mention
- [x] About: founding story copy update (remove "turned up the music" ambiguity, refine)
- [x] About: Our Values → Our Promise / The Wax Me Too Standard — replace with new copy
- [x] Locations: South Jordan — change "boutique" to "Wax Me Too signature experience", add "Inside My Salon Suite"
- [x] Locations: Orem — change "boutique experience" to "Wax Me Too signature"
- [x] Locations: Draper — update to Image Studios copy, freeway access note
- [x] Locations: St. George — add "Inside Salon Aubri McKi", note closed Mondays
- [x] Locations: add "By Appointment Only" note site-wide or on location pages
- [x] FAQ: update first-visit answer to include booking confirmation / release form / reminder texts / cancellation policy
- [x] BeforeCare: reorder sun exposure to #2, remove "hair too long" trim note
- [x] AfterCare: add Utah Lake / hot tub note with humor, add PFB product mention

## Phase 22 — Content Updates from Wax.docx

- [x] Home: hero headline changed to "Brazilian Waxing…. Perfected."
- [x] Home: review count updated to 1000+ five-star reviews
- [x] Home: new client offer updated to 50% off first Brazilian, Deep Bikini, or Bikini wax (was 20%)
- [x] Home: mostPopular — Manzilian replaced with Eyebrow Wax & Design
- [x] Home: Brazilian tagline → "Completely bare. Completely confident.", Deep Bikini → "More than a bikini, less than a Brazilian.", Bikini → "Perfectly tidy. Clean and classic."
- [x] FirstVisit: step 2 prep updated — removed exfoliate/lotion, added no spray tan/tanning/sunburns
- [x] FirstVisit: "Completely private" card updated to "Your own room with time to change…"
- [x] FirstVisit: "Zero judgment" card updated to "We've seen it all and waxed it all…"
- [x] FirstVisit: discomfort section rewritten — "it's waxing, not a massage" with 15-min waxing note
- [x] FirstVisit: before list — sun exposure moved to #2, lotion item removed
- [x] FirstVisit: after list — Utah Lake expanded to "or any lake", PFB Vanish mention added
- [x] FirstVisit: new client offer updated to 50% off
- [x] About: founding story rewritten — candles/whispered voices, "Nineteen years later", women-owned origin
- [x] About: Our Promise rewritten — "Clean rooms. Great estheticians. Zero judgment."
- [x] About: "Sinks in every treatment room" values card description updated
- [x] Locations data: South Jordan — "boutique" → "signature experience", added "inside My Salon Suite"
- [x] Locations data: Orem — "boutique" → "signature experience"
- [x] Locations data: Draper — rewritten to mention Image Studios suites and west side of I-15
- [x] Locations data: St. George — added "inside Salon Aubri McKi", Monday closed (Tue–Fri hours)
- [x] LocationDetail: "By Appointment Only" note added below hours on all location pages
- [x] LocationDetail: new client offer updated to 50% off
- [x] FAQ: first-visit answer expanded with booking confirmation/reminder/release form info
- [x] FAQ: cancellation policy updated — no deposit required, trust-based policy
- [x] FAQ: new client offer FAQ updated to 50% off
- [x] BeforeCare: "hair too long may be trimmed" phrase removed; sun/spray tan/tanning moved to #2
- [x] AfterCare: Utah Lake item expanded with "we wish we were kidding" + pore explanation
- [x] 0 TypeScript errors, 47 tests passing

## Phase 23 — Scroll to Top on Navigation

- [x] ScrollToTop component already exists (client/src/components/ScrollToTop.tsx) — fires window.scrollTo({ top: 0, behavior: 'instant' }) on every route change
- [x] ScrollToTop is mounted inside Router in App.tsx — confirmed working: navigating from mid-page homepage to First Visit loads at top (0px above viewport)
