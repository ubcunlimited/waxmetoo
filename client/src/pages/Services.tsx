/*
 * WAX ME TOO — Services & Pricing Page
 * Category hierarchy (from pricingforwaxmetoo2.xlsx):
 *   Most Popular
 *   Full Body Waxing Services for the Ladies
 *     Bikini Area | Combos | Arms & Legs | Face Waxing | Other Body Parts | Tinting
 *   Full Body Waxing Services for Men
 *     Face Waxing | Combos | Below the Belt | Arms & Legs | Neck to Stomach
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronDown, ChevronUp, Star, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import {
  mostPopular,
  ladiesSections,
  menSections,
  type ServiceItem,
  type SubCategory,
  BOOKING_URL,
} from "@/lib/data";

// ─── Sub-components ───────────────────────────────────────────────────────────

function PriceRow({ item, showCash }: { item: ServiceItem; showCash: boolean }) {
  const price = showCash ? item.priceCash : item.priceCard;
  const displayPrice = price % 1 === 0 ? `$${price}` : `$${price.toFixed(2)}`;

  return (
    <div
      className="flex items-center justify-between py-3 border-b last:border-0"
      style={{ borderColor: "#F0EAE4" }}
    >
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium" style={{ color: "#3B2F2A" }}>
            {item.name}
          </span>
          {item.popular && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(207,167,160,0.2)", color: "#CFA7A0" }}
            >
              Popular
            </span>
          )}
        </div>
        {item.note && (
          <p className="text-xs mt-0.5" style={{ color: "#A8B3AA" }}>
            {item.note}
          </p>
        )}
        {item.duration && (
          <p className="text-xs mt-0.5" style={{ color: "#A8B3AA" }}>
            {item.duration}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-lg font-bold" style={{ color: "#3B2F2A" }}>
          {displayPrice}
        </p>
      </div>
    </div>
  );
}

function SubCategoryPanel({
  sub,
  showCash,
  defaultOpen = true,
}: {
  sub: SubCategory;
  showCash: boolean;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{ border: "1px solid #E8DDD6" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        style={{ background: open ? "#FBF8F5" : "#ffffff" }}
      >
        <span
          className="font-serif text-base font-semibold"
          style={{ color: "#3B2F2A" }}
        >
          {sub.title}
        </span>
        <span style={{ color: "#A8B3AA" }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-2 pt-1" style={{ background: "#ffffff" }}>
          {sub.items.map((item) => (
            <PriceRow key={item.id} item={item} showCash={showCash} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "popular" | "ladies" | "men";

export default function Services() {
  const [activeTab, setActiveTab] = useState<Tab>("popular");
  const [showCash, setShowCash] = useState(false);

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
      "Browse Wax Me Too's full waxing menu — Brazilian wax, eyebrow design, full body waxing, men's waxing, and more. Transparent pricing, 6 Utah locations. New clients receive 20% off.";
    return () => {
      document.title = "Wax Me Too — Professional Waxing Studio | Utah";
    };
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "popular", label: "⭐ Most Popular" },
    { id: "ladies", label: "For the Ladies" },
    { id: "men", label: "For the Men" },
  ];

  return (
    <Layout>
      {/* ── Hero ── */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(/manus-storage/hero-services_3fc5840d.jpg)",
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
              className="font-body leading-relaxed mb-6 text-lg"
              style={{ color: "#D8C6B6" }}
            >
              From Brazilian to brows, every service is performed by licensed
              estheticians using premium, skin-safe wax. Full pricing listed
              below — no surprises.
            </p>

            {/* Cash / Card toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-body" style={{ color: "#D8C6B6" }}>
                Show prices as:
              </span>
              <button
                onClick={() => setShowCash(false)}
                className="px-4 py-2 rounded text-sm font-semibold transition-all"
                style={{
                  background: !showCash ? "#CFA7A0" : "#4a3d38",
                  color: !showCash ? "#3B2F2A" : "#D8C6B6",
                }}
              >
                Card
              </button>
              <button
                onClick={() => setShowCash(true)}
                className="px-4 py-2 rounded text-sm font-semibold transition-all"
                style={{
                  background: showCash ? "#CFA7A0" : "#4a3d38",
                  color: showCash ? "#3B2F2A" : "#D8C6B6",
                }}
              >
                Cash
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cash / Card note ── */}
      <div
        className="border-b"
        style={{ background: "#ffffff", borderColor: "#E8DDD6" }}
      >
        <div className="container py-3">
          <p className="text-xs" style={{ color: "#4A4A4A" }}>
            <strong>Pricing note:</strong> Cash pricing reflects a small
            discount for clients who pay with cash. Card prices include a 3%
            processing fee. Both prices are listed transparently — no hidden
            fees, ever.
          </p>
        </div>
      </div>

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
                  color:
                    activeTab === tab.id ? "#3B2F2A" : "#4A4A4A",
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
              <p className="text-sm mb-6" style={{ color: "#4A4A4A" }}>
                Our most-requested services — loved by clients across all our
                Utah locations.
              </p>

              <div
                className="rounded-2xl overflow-hidden mb-8"
                style={{ border: "1px solid #E8DDD6", background: "#ffffff" }}
              >
                {/* Column header */}
                <div
                  className="flex items-center justify-between px-5 py-3 border-b"
                  style={{
                    borderColor: "#F0EAE4",
                    background: "#FBF8F5",
                  }}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#A8B3AA" }}
                  >
                    Service
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: showCash ? "#3B2F2A" : "#CFA7A0" }}
                  >
                    {showCash ? "Cash Price" : "Card Price"}
                  </span>
                </div>
                <div className="px-5 pb-2 pt-1">
                  {mostPopular.map((item) => (
                    <PriceRow key={item.id} item={item} showCash={showCash} />
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: "linear-gradient(135deg, #3B2F2A, #5a4540)",
                }}
              >
                <p className="font-serif text-xl text-white mb-2">
                  Ready to book?
                </p>
                <p className="text-sm mb-4" style={{ color: "#D8C6B6" }}>
                  First visit? New clients enjoy 20% off their first service.
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
            </div>
          )}

          {/* For the Ladies */}
          {activeTab === "ladies" && (
            <div>
              <p className="section-label-sage mb-2">For the Ladies</p>
              <h2
                className="font-serif text-2xl font-bold mb-2"
                style={{ color: "#3B2F2A" }}
              >
                Full Body Waxing Services — For the Ladies
              </h2>
              <p className="text-sm mb-6" style={{ color: "#4A4A4A" }}>
                Click any category to expand or collapse its price list. Prices
                shown as {showCash ? "cash" : "card"} — toggle above to switch.
              </p>

              {ladiesSections.map((sub, i) => (
                <SubCategoryPanel
                  key={sub.id}
                  sub={sub}
                  showCash={showCash}
                  defaultOpen={i === 0}
                />
              ))}

              {/* CTA */}
              <div
                className="mt-6 rounded-2xl p-6 text-center"
                style={{
                  background: "linear-gradient(135deg, #3B2F2A, #5a4540)",
                }}
              >
                <p className="font-serif text-xl text-white mb-2">
                  Ready to book?
                </p>
                <p className="text-sm mb-4" style={{ color: "#D8C6B6" }}>
                  First visit? New clients enjoy 20% off their first service.
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
            </div>
          )}

          {/* For the Men */}
          {activeTab === "men" && (
            <div>
              <p className="section-label-sage mb-2">For the Men</p>
              <h2
                className="font-serif text-2xl font-bold mb-2"
                style={{ color: "#3B2F2A" }}
              >
                Full Body Waxing Services — For the Men
              </h2>
              <p className="text-sm mb-6" style={{ color: "#4A4A4A" }}>
                Clean, professional waxing services designed for men. No
                judgment, just results. Prices shown as{" "}
                {showCash ? "cash" : "card"} — toggle above to switch.
              </p>

              {menSections.map((sub, i) => (
                <SubCategoryPanel
                  key={sub.id}
                  sub={sub}
                  showCash={showCash}
                  defaultOpen={i === 0}
                />
              ))}

              {/* CTA */}
              <div
                className="mt-6 rounded-2xl p-6 text-center"
                style={{
                  background: "linear-gradient(135deg, #3B2F2A, #5a4540)",
                }}
              >
                <p className="font-serif text-xl text-white mb-2">
                  Ready to book?
                </p>
                <p className="text-sm mb-4" style={{ color: "#D8C6B6" }}>
                  First visit? New clients enjoy 20% off their first service.
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
            </div>
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
    </Layout>
  );
}
