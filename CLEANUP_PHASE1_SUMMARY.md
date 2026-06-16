# Phase 1 Code Audit — Wax Me Too
**Audited:** 9,579 lines across 40 custom source files  
**Status:** Awaiting approval before any changes are applied

---

## Category 1 — Dead Code (Pruning)

These are code paths that can never execute and should be deleted entirely.

| # | File | What to Remove | Why It's Dead |
|---|------|----------------|---------------|
| D1 | `Services.tsx` | `JUNE_1_2026` constant, `isPastJune1()` function | June 1 has passed; the function always returns `true` now |
| D2 | `Services.tsx` | `June1Banner` component (lines 120–132) | `isPastJune1()` is always `true` → component always returns `null` |
| D3 | `Services.tsx` | `PriceHeader` `hasChanges` prop and all conditional branches inside it | `hasChanges` is hardcoded `false` in every call site |
| D4 | `Services.tsx` | `hasChanges = false` and `popularHasChanges = false` local variables | Never `true`; only used in dead branches |
| D5 | `Services.tsx` | `CalendarClock` lucide import | Only used inside `June1Banner` (dead above) |
| D6 | `Services.tsx` | Block comment at top of file referencing "Dual pricing / June 1 2026" | Describes a feature that no longer exists |
| D7 | `data.ts` | `TopSection` type export (line 145) | Defined but never imported anywhere in the codebase |
| D8 | `shared/const.ts` | `AXIOS_TIMEOUT_MS` export | Only used in `server/_core/sdk.ts` (framework file); can be inlined there or kept — minor |

---

## Category 2 — Duplicate Files (Pruning)

Two pairs of pages exist for the same content, creating split routing and maintenance confusion.

| # | Files | Situation | Recommendation |
|---|-------|-----------|----------------|
| P1 | `Privacy.tsx` (54 lines) vs `PrivacyPolicy.tsx` (158 lines) | Both are routed (`/privacy` and `/privacy-policy`). `PrivacyPolicy.tsx` is the full, up-to-date version with a "Last updated" date. `Privacy.tsx` is a shorter, older stub. | **Delete `Privacy.tsx`**, redirect `/privacy` → `/privacy-policy` in `App.tsx` |
| P2 | `Terms.tsx` (68 lines) vs `TermsOfService.tsx` (166 lines) | Same situation — both routed (`/terms` and `/terms-of-service`). `TermsOfService.tsx` is the full version with AI disclosure section. | **Delete `Terms.tsx`**, redirect `/terms` → `/terms-of-service` in `App.tsx` |
| P3 | `ComponentShowcase.tsx` | Imported nowhere, no route in `App.tsx` | **Delete** — scaffolding leftover |

---

## Category 3 — DRY Violations (Refactoring)

These are identical or near-identical code blocks copy-pasted across multiple files.

| # | Pattern | Duplicated In | Fix |
|---|---------|---------------|-----|
| R1 | `FadeUp` component (11 lines, identical signature) | `Home.tsx`, `FirstVisit.tsx`, `About.tsx`, `Locations.tsx`, `LocationDetail.tsx`, `FAQ.tsx`, `Blog.tsx`, `BlogPost.tsx`, `Contact.tsx`, `BeforeCare.tsx`, `AfterCare.tsx` — **11 copies** | Extract to `client/src/components/FadeUp.tsx` and import in each page |
| R2 | SEO `useEffect` (12-line pattern: set `document.title`, create/update `<meta name="description">`, reset on unmount) | All 12 content pages | Extract to `client/src/hooks/usePageSEO(title, description)` hook |
| R3 | `sendEmail()` private helper (identical 40-line fetch function) | `server/giveawayEmail.ts` and `server/mascotEmail.ts` | Extract to `server/emailHelper.ts` and import in both |

---

## Category 4 — Clarity & Naming (Refactoring)

| # | File | Issue | Fix |
|---|------|-------|-----|
| C1 | `Services.tsx` | `PriceHeader` component still accepts a `hasChanges: boolean` prop that is always `false` — the prop is vestigial | Remove the prop; simplify `PriceHeader` to just render "Price" label unconditionally |
| C2 | `Services.tsx` | `SubCategoryPanel` still contains a `{!isPastJune1() && hasChanges && ...}` conditional badge that can never render | Remove the dead conditional |
| C3 | `data.ts` | Comment at line 121 says "prices from pricingforwaxmetoo2.xlsx" — internal file reference that means nothing to future developers | Replace with "Prices updated June 2026" |
| C4 | `server/giveawayEmail.ts` | Module-level `sendEmail` is `private` (not exported) but its 40-line body is duplicated in `mascotEmail.ts` | After R3 above, the local copy can be deleted |
| C5 | `useBreadcrumbSchema.ts` | Hook creates and removes a `<script>` tag on every render cycle with no memoization of the JSON string | Wrap JSON.stringify in `useMemo` to avoid unnecessary DOM churn |
| C6 | `useLocalBusinessSchema.ts` | Same issue — no memoization | Same fix |
| C7 | Multiple pages | Hardcoded hex colors (`#3B2F2A`, `#CFA7A0`, `#A8B3AA`, `#F7F3EE`) appear as inline `style={{}}` props instead of Tailwind tokens | These are already defined as CSS variables in `index.css`; replace `style={{ color: "#CFA7A0" }}` with `className="text-rose-300"` (or the project's custom token class) where possible |

---

## Category 5 — Standards (SOLID / Single Responsibility)

| # | File | Issue | Fix |
|---|------|-------|-----|
| S1 | `BlogPost.tsx` (1,528 lines) | One file contains: 5 full blog post bodies as JSX, a sidebar component, a related-posts component, a table-of-contents component, and the page shell | Split into `BlogPost.tsx` (shell + routing) + `posts/` directory with one file per post |
| S2 | `Home.tsx` (617 lines) | Contains 9 distinct section components (Hero, NewClientOffer, ServicesPreview, TrustBadges, Testimonials, Locations, BlogTeaser, FAQ Preview, CTA Strip) all defined inline | Extract each section into `client/src/components/home/` sub-components |
| S3 | `data.ts` (1,146 lines) | Mixes location data, service data, FAQ data, blog metadata, and testimonials in one file | Split into `data/locations.ts`, `data/services.ts`, `data/faq.ts`, `data/blog.ts` with a barrel `data/index.ts` |

---

## Summary Table

| Category | Items | Estimated Line Reduction |
|----------|-------|--------------------------|
| Dead code removed | 8 items | ~80 lines |
| Duplicate files deleted | 3 files | ~290 lines |
| DRY extractions | 3 patterns | ~400 lines eliminated (moved to shared) |
| Clarity fixes | 7 items | ~30 lines |
| File splits (S1–S3) | 3 files | 0 net lines — reorganisation only |
| **Total** | **24 items** | **~800 lines net reduction** |

---

## What Will NOT Be Changed

- All `server/_core/` framework files (OAuth, tRPC, context, env) — framework plumbing, not application code
- All `client/src/components/ui/` shadcn components — third-party generated, not hand-written
- All `drizzle/` schema and migration files — schema changes require a DB migration
- All test files (`*.test.ts`) — tests are correct and should not be modified during a cleanup pass
- All content (copy, prices, descriptions) — content changes are out of scope for a code cleanup

---

**Awaiting your approval to proceed to Phase 2 (applying all changes).**  
You may approve all, or exclude specific items by number (e.g., "approve all except S1, S2, S3").
