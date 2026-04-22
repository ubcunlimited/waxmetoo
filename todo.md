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
