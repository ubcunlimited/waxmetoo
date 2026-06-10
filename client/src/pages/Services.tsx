/*
 * WAX ME TOO — Services & Pricing Page
 * Category hierarchy (from wax_me_too_pricing_sheet_june_1_2026.xlsx):
 *   Most Popular
 *   Full Body Waxing Services for the Ladies
 *     Bikini Area | Combos | Arms & Legs | Face Waxing | Other Body Parts | Tinting
 *   Full Body Waxing Services for Men
 *     Face Waxing | Combos | Below the Belt | Arms & Legs | Neck to Stomach
 *
 * Dual pricing: current price shown alongside June 1 2026 guaranteed price.
 */

import { useState, useEffect } from "react";
import { useBreadcrumbSchema } from "@/hooks/useBreadcrumbSchema";
import { Link } from "wouter";
import { ChevronDown, ChevronUp, Star, ArrowRight, CalendarClock } from "lucide-react";
import Layout from "@/components/Layout";
import MascotEasterEgg from "@/components/MascotEasterEgg";
import {
  mostPopular,
  ladiesSections,
  menSections,
  type ServiceItem,
  type SubCategory,
  BOOKING_URL,
} from "@/lib/data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `$${n % 1 === 0 ? n : n.toFixed(2)}`;
}

/**
 * After June 1 2026 the old prices are retired — hide the "current" column
 * and the notice banner automatically so no manual update is needed.
 * Evaluated at call-time (not build-time) so the live site always reflects
 * the real current date.
 */
const JUNE_1_2026 = new Date("2026-06-01T00:00:00");
const isPastJune1 = () => new Date() >= JUNE_1_2026;

// ─── PriceRow ─────────────────────────────────────────────────────────────────

function PriceRow({ item }: { item: ServiceItem }) {
  return (
    <div
      className="flex items-start justify-between py-3 border-b last:border-0 gap-3"
      style={{ borderColor: "#F0EAE4" }}
    >
      {/* Left: name + badges + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium" style={{ color: "#3B2F2A" }}>
            {item.name}
          </span>
          {item.popular && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(207,167,160,0.18)", color: "#CFA7A0" }}
            >
              Popular
            </span>
          )}
        </div>
        {item.duration && (
          <p className="text-xs mt-0.5" style={{ color: "#A8B3AA" }}>
            {item.duration}
          </p>
        )}
        {item.note && (
          <p className="text-xs mt-0.5 italic" style={{ color: "#A8B3AA" }}>
            {item.note}
          </p>
        )}
      </div>

      {/* Right: price */}
      <div className="flex-shrink-0 text-right">
        <p className="text-base font-bold" style={{ color: "#3B2F2A" }}>
          {fmt(item.price)}
        </p>
      </div>
    </div>
  );
}

// ─── Column header row ────────────────────────────────────────────────────────

function PriceHeader({ hasChanges }: { hasChanges: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-5 py-3 border-b"
      style={{ borderColor: "#F0EAE4", background: "#FBF8F5" }}
    >
      <span className="text-xs font-semibold" style={{ color: "#A8B3AA" }}>
        Service
      </span>
      {!isPastJune1() && hasChanges ? (
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold" style={{ color: "#9CA3AF" }}>
            Current
          </span>
          <span className="text-xs font-semibold" style={{ color: "#CFA7A0" }}>
            June 1
          </span>
        </div>
      ) : (
        <span className="text-xs font-semibold" style={{ color: "#CFA7A0" }}>
          Price
        </span>
      )}
    </div>
  );
}

// ─── June 1 notice banner ─────────────────────────────────────────────────────

function June1Banner() {
  if (isPastJune1()) return null;
  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3 mb-6"
      style={{ background: "rgba(207,167,160,0.12)", border: "1px solid rgba(207,167,160,0.35)" }}
    >
      <CalendarClock size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#CFA7A0" }} />
      <p className="text-sm leading-relaxed" style={{ color: "#3B2F2A" }}>
        <strong>Pricing update effective June 1, 2026.</strong> Where two prices are shown, the left column is today's price and the right column (in rose) is the new guaranteed price across all Wax Me Too locations.
      </p>
    </div>
  );
}

/// ─── SubCategoryPanel ─────────────────────────────────────────────────────────
function SubCategoryPanel({
  sub,
  open,
  onToggle,
}: {
  sub: SubCategory;
  open: boolean;
  onToggle: () => void;
}) {
  const hasChanges = false; // priceNew field retired after June 1 2026
  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{ border: "1px solid #E8DDD6" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ background: open ? "#FBF8F5" : "#ffffff" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="font-serif text-base font-semibold"
            style={{ color: "#3B2F2A" }}
          >
            {sub.title}
          </span>
          {!isPastJune1() && hasChanges && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(207,167,160,0.18)", color: "#CFA7A0" }}
            >
              Price update
            </span>
          )}
        </div>
        <span style={{ color: "#A8B3AA" }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && (
        <div style={{ background: "#ffffff" }}>
          <PriceHeader hasChanges={hasChanges} />
          <div className="px-5 pb-2 pt-1">
            {sub.items.map((item) => (
              <PriceRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Booking CTA block ────────────────────────────────────────────────────────

// ─── Single-open accordion wrappers ───────────────────────────────────────────────
function LadiesAccordion() {
  const [openId, setOpenId] = useState<string>(ladiesSections[0]?.id ?? "");
  return (
    <div>
      <p className="section-label-sage mb-2">For the Ladies</p>
      <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: "#3B2F2A" }}>
        Full Body Waxing Services — For the Ladies
      </h2>
      <p className="text-sm mb-5" style={{ color: "#4A4A4A" }}>
        Tap a category to expand its price list. Only one section is open at a time.
      </p>
      <June1Banner />
      {ladiesSections.map((sub) => (
        <SubCategoryPanel
          key={sub.id}
          sub={sub}
          open={openId === sub.id}
          onToggle={() => setOpenId(openId === sub.id ? "" : sub.id)}
        />
      ))}
      <BookingCTA />
    </div>
  );
}

function MenAccordion() {
  const [openId, setOpenId] = useState<string>(menSections[0]?.id ?? "");
  return (
    <div>
      <p className="section-label-sage mb-2">For the Men</p>
      <h2 className="font-serif text-2xl font-bold mb-2" style={{ color: "#3B2F2A" }}>
        Full Body Waxing Services — For the Men
      </h2>
      <p className="text-sm mb-5" style={{ color: "#4A4A4A" }}>
        Clean, professional waxing services designed for men. No judgment, just results.
      </p>
      <June1Banner />
      {menSections.map((sub) => (
        <SubCategoryPanel
          key={sub.id}
          sub={sub}
          open={openId === sub.id}
          onToggle={() => setOpenId(openId === sub.id ? "" : sub.id)}
        />
      ))}
      <BookingCTA />
    </div>
  );
}

function BookingCTA() {
  return (
    <div
      className="mt-6 rounded-2xl p-6 text-center"
      style={{ background: "linear-gradient(135deg, #3B2F2A, #5a4540)" }}
    >
      <p className="font-serif text-xl text-white mb-2">Ready to book?</p>
      <p className="text-sm mb-4" style={{ color: "#D8C6B6" }}>
        First time at Wax Me Too? New clients get their Brazilian wax for $50.
      </p>
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-3 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
        style={{ background: "#CFA7A0", color: "#ffffff" }}
      >
        Book Your Appointment
      </a>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "popular" | "ladies" | "men";

export default function Services() {
  const [activeTab, setActiveTab] = useState<Tab>("popular");

  // Handle ?tab= query param for deep-linking
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    if (t === "ladies" || t === "men" || t === "popular") setActiveTab(t);
  }, []);

  // Dynamic SEO
  useEffect(() => {
    document.title =
      "Services & Pricing | Wax Me Too — Utah's Professional Waxing Studio";
    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content =
      "Browse Wax Me Too's full waxing menu — Brazilian, bikini, brow & body waxing. Standardized pricing guaranteed across all 6 Utah locations. First-time Brazilian wax $50.";
    return () => {
      document.title = "Wax Me Too — Professional Waxing Studio | Utah";
    };
  }, []);

  useBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Services & Pricing", url: "/services" },
  ]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "popular", label: "⭐ Most Popular" },
    { id: "ladies", label: "For the Ladies" },
    { id: "men", label: "For the Men" },
  ];

  // priceNew field retired after June 1 2026 — no pending changes
  const popularHasChanges = false;

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/manus-storage/hero-services_d8b61cd1.webp)",
          }}
        />
        <div className="absolute inset-0 bg-[#3B2F2A]/80" />
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <p className="section-label-sage mb-3">Services &amp; Pricing</p>
            <h1 className="font-display text-5xl md:text-6xl text-white mb-5">
              Our complete
              <br />
              <em style={{ color: "#A8B3AA" }}>waxing menu</em>
            </h1>
            <p
              className="font-body leading-relaxed text-lg"
              style={{ color: "#D8C6B6" }}
            >
              From Brazilian to brows, every service is performed by licensed
              estheticians using premium, skin-safe wax. Full pricing listed
              below — no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* ── Tab bar ── */}
      <div
        className="sticky top-[calc(4rem+2.5rem)] z-30 border-b shadow-sm"
        style={{ background: "#ffffff", borderColor: "#D8C6B6" }}
      >
        <div className="container">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all"
                style={{
                  borderBottomColor:
                    activeTab === tab.id ? "#A8B3AA" : "transparent",
                  color: activeTab === tab.id ? "#3B2F2A" : "#4A4A4A",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="py-12 pb-20" style={{ background: "#F7F3EE" }}>
        <div className="container max-w-3xl">

          {/* Most Popular */}
          {activeTab === "popular" && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Star size={22} style={{ color: "#CFA7A0" }} fill="#CFA7A0" />
                <h2
                  className="font-serif text-2xl font-bold"
                  style={{ color: "#3B2F2A" }}
                >
                  Most Popular Services
                </h2>
              </div>
              <p className="text-sm mb-5" style={{ color: "#4A4A4A" }}>
                Our most-requested services — loved by clients across all our
                Utah locations.
              </p>

              <June1Banner />

              <div
                className="rounded-2xl overflow-hidden mb-8"
                style={{ border: "1px solid #E8DDD6", background: "#ffffff" }}
              >
                <PriceHeader hasChanges={popularHasChanges} />
                <div className="px-5 pb-2 pt-1">
                  {mostPopular.map((item) => (
                    <PriceRow key={item.id} item={item} />
                  ))}
                </div>
              </div>

              <BookingCTA />
            </div>
          )}

          {/* For the Ladies */}
          {activeTab === "ladies" && (
            <LadiesAccordion />
          )}
          {/* For the Men */}
          {activeTab === "men" && (
            <MenAccordion />
          )}

        </div>
      </section>

      {/* ── Before / After Care links ── */}
      <section className="py-14" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link href="/before-care">
              <div
                className="rounded-xl p-6 cursor-pointer transition-colors group"
                style={{ background: "#D8C6B6" }}
              >
                <p className="section-label text-[#3B2F2A] mb-2">
                  Before Your Appointment
                </p>
                <h3 className="font-display text-2xl text-[#3B2F2A] mb-2">
                  Before Care Guide
                </h3>
                <p className="text-sm text-[#4A4A4A] font-body mb-3">
                  How to prepare for the best possible waxing results.
                </p>
                <span className="text-sm font-semibold text-[#3B2F2A] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Guide <ArrowRight size={14} />
                </span>
              </div>
            </Link>
            <Link href="/after-care">
              <div
                className="rounded-xl p-6 cursor-pointer transition-colors group"
                style={{ background: "#A8B3AA" }}
              >
                <p className="section-label text-[#3B2F2A] mb-2">
                  After Your Appointment
                </p>
                <h3 className="font-display text-2xl text-[#3B2F2A] mb-2">
                  After Care Guide
                </h3>
                <p className="text-sm text-[#3B2F2A]/80 font-body mb-3">
                  Keep your skin smooth and prevent ingrown hairs.
                </p>
                <span className="text-sm font-semibold text-[#3B2F2A] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Guide <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    <MascotEasterEgg pageId="services" />
    </Layout>
  );
}
