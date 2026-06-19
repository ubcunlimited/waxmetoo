import FadeUp from "@/components/FadeUp";
/*
 * WAX ME TOO — FAQ Center
 * Design: Modern Feminine Craft
 * Features: Search, category filter, accordion
 */

import { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { faqs, BOOKING_URL } from "@/lib/data";
import { useBreadcrumbSchema } from "@/hooks/useBreadcrumbSchema";


const categories = ["All", ...Array.from(new Set(faqs.map(f => f.category)))];

export default function FAQ() {
  useEffect(() => {
    document.title = "Waxing FAQ — Common Questions Answered | Wax Me Too Utah";
    let m = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (!m) { m = document.createElement('meta') as HTMLMetaElement; m.name = 'description'; document.head.appendChild(m); }
    m.content = "Find answers to the most common waxing questions — from how to prepare for your first Brazilian wax to how often you should wax. Expert guidance from Wax Me Too's licensed estheticians.";

    // schema.org FAQPage structured data for Google rich snippets
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.title = "Wax Me Too — Professional Waxing Studio | Utah";
      document.getElementById('faq-schema')?.remove();
    };
  }, []);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<number | null>(null);

  useBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" },
  ]);

  const filtered = faqs.filter(faq => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = !search || 
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#3B2F2A] py-20">
        <div className="container">
          <FadeUp>
            <div className="max-w-2xl">
              <p className="section-label-sage mb-3">FAQ Center</p>
              <h1 className="font-display text-5xl md:text-6xl text-white mb-5">
                Your questions,<br /><em style={{ color: "#A8B3AA" }}>answered.</em>
              </h1>
              <p className="text-[#D8C6B6] font-body leading-relaxed mb-8">
                We've compiled answers to the questions we hear most often. Browse by category or search for a specific topic.
              </p>
              {/* Search */}
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8B3AA]" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-white text-[#3B2F2A] placeholder-[#A8B3AA] font-body text-sm border-0 outline-none focus:ring-2 focus:ring-[#CFA7A0]"
                />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Category Filter */}
      <div className="bg-white border-b border-[#D8C6B6] sticky top-[calc(4rem+2.5rem)] z-30">
        <div className="container">
          <div className="flex gap-0 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-4 text-sm font-body font-500 whitespace-nowrap border-b-2 transition-all ${
                  activeCategory === cat
                    ? "border-[#A8B3AA] text-[#3B2F2A]"
                    : "border-transparent text-[#4A4A4A] hover:text-[#3B2F2A] hover:border-[#A8B3AA]/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <section className="py-16 bg-[#F7F3EE]">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Pricing last-updated note — shown when Pricing category is active or all categories shown */}
            {(activeCategory === "All" || activeCategory === "Pricing") && !search && (
              <div
                className="flex items-center gap-2 mb-4 px-4 py-2.5 rounded-lg text-sm font-body"
                style={{ background: "rgba(168,179,170,0.12)", border: "1px solid rgba(168,179,170,0.35)", color: "#4A4A4A" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A8B3AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                  <strong style={{ color: "#3B2F2A" }}>Pricing last updated June 2026.</strong>{" "}
                  All prices are standardized across all 6 Utah locations.{" "}
                  <a href="/services" className="underline" style={{ color: "#CFA7A0" }}>View full menu →</a>
                </span>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-display text-2xl text-[#3B2F2A] mb-3">No results found</p>
                <p className="text-[#4A4A4A] font-body mb-6">Try a different search term or browse all categories.</p>
                <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="btn-outline">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-0">
                {filtered.map((faq, i) => (
                  <FadeUp key={faq.id} delay={i * 40}>
                    <div className="faq-item bg-white mb-2 rounded-lg overflow-hidden shadow-sm">
                      <button
                        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                      >
                        <div className="flex-1">
                          <span className="text-xs font-body font-600 uppercase tracking-wide block mb-1" style={{ color: "#A8B3AA" }}>{faq.category}</span>
                          <span className="font-body font-500 text-[#3B2F2A] text-base">{faq.question}</span>
                        </div>
                        <ChevronDown
                          size={18}
                          className={`shrink-0 transition-transform ${openId === faq.id ? "rotate-180" : ""}`}
                          style={{ color: "#A8B3AA" }}
                        />
                      </button>
                      {openId === faq.id && (
                        <div className="px-6 pb-5 border-t border-[#F7F3EE]">
                          <p className="text-[#4A4A4A] font-body leading-relaxed pt-4">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  </FadeUp>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-14 bg-[#D8C6B6]">
        <div className="container">
          <FadeUp>
            <div className="max-w-xl mx-auto text-center">
              <h2 className="font-display text-3xl text-[#3B2F2A] mb-4">Still have questions?</h2>
              <p className="text-[#4A4A4A] font-body mb-6">
                Our team is happy to help. Reach out directly or book a consultation.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/contact">
                  <span className="btn-primary cursor-pointer">Contact Us</span>
                </Link>
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  Book Now
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </Layout>
  );
}
