/*
 * WAX ME TOO — Services Page
 * Design: Modern Feminine Craft
 * Features: Category tabs, full pricing (cash + card), service details, booking CTAs
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ChevronDown, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { serviceCategories, BOOKING_URL } from "@/lib/data";

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("womens-waxing");
  const [showCashPrice, setShowCashPrice] = useState(false);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const activeServices = serviceCategories.find(c => c.id === activeCategory);

  // Handle hash navigation
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const cat = serviceCategories.find(c => c.services.some(s => s.id === hash));
      if (cat) setActiveCategory(cat.id);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/manus-storage/hero-services_3fc5840d.jpg)' }} />
        <div className="absolute inset-0 bg-[#3B2F2A]/80" />
        <div className="container relative z-10">
          <FadeUp>
            <div className="max-w-2xl">
              <p className="section-label text-[#CFA7A0] mb-3">Services & Pricing</p>
              <h1 className="font-display text-5xl md:text-6xl text-white mb-5">
                Our complete<br /><em className="text-[#CFA7A0]">waxing menu</em>
              </h1>
              <p className="text-[#D8C6B6] font-body leading-relaxed mb-6">
                From Brazilian to brows, every service is performed by licensed estheticians using premium, skin-safe wax. Full pricing listed below — no surprises.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-body text-[#D8C6B6]">Show prices as:</span>
                <button
                  onClick={() => setShowCashPrice(false)}
                  className={`px-4 py-2 rounded text-sm font-body font-500 transition-all ${!showCashPrice ? "bg-[#CFA7A0] text-[#3B2F2A]" : "bg-[#4a3d38] text-[#D8C6B6] hover:bg-[#5a4d48]"}`}
                >
                  Credit Card
                </button>
                <button
                  onClick={() => setShowCashPrice(true)}
                  className={`px-4 py-2 rounded text-sm font-body font-500 transition-all ${showCashPrice ? "bg-[#CFA7A0] text-[#3B2F2A]" : "bg-[#4a3d38] text-[#D8C6B6] hover:bg-[#5a4d48]"}`}
                >
                  Cash
                </button>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="sticky top-[calc(4rem+2.5rem)] z-30 bg-white border-b border-[#D8C6B6] shadow-sm">
        <div className="container">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-4 text-sm font-body font-500 whitespace-nowrap border-b-2 transition-all ${
                  activeCategory === cat.id
                    ? "border-[#CFA7A0] text-[#3B2F2A]"
                    : "border-transparent text-[#4A4A4A] hover:text-[#3B2F2A] hover:border-[#D8C6B6]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Content */}
      <section className="py-16 bg-[#F7F3EE]">
        <div className="container">
          {activeServices && (
            <div>
              <FadeUp>
                <div className="mb-10">
                  <h2 className="font-display text-4xl text-[#3B2F2A] mb-3">{activeServices.name}</h2>
                  <p className="text-[#4A4A4A] font-body leading-relaxed max-w-2xl">{activeServices.description}</p>
                </div>
              </FadeUp>

              <div className="space-y-3">
                {activeServices.services.map((service, i) => (
                  <FadeUp key={service.id} delay={i * 50}>
                    <div id={service.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {/* Service Header Row */}
                      <div
                        className="flex items-center justify-between p-5 cursor-pointer hover:bg-[#F7F3EE] transition-colors"
                        onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display text-xl text-[#3B2F2A]">{service.name}</h3>
                              {service.popular && (
                                <span className="text-xs font-body font-600 bg-[#CFA7A0]/20 text-[#CFA7A0] px-2 py-0.5 rounded-full">Popular</span>
                              )}
                            </div>
                            <p className="text-sm text-[#4A4A4A] font-body mt-0.5 italic">{service.tagline}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-display text-xl text-[#3B2F2A]">
                              ${showCashPrice ? service.priceCash : service.priceCard}
                            </p>
                            {service.duration && (
                              <p className="text-xs text-[#A8B3AA] font-body">{service.duration}</p>
                            )}
                          </div>
                          <ChevronDown
                            size={18}
                            className={`text-[#CFA7A0] transition-transform ${expandedService === service.id ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedService === service.id && (
                        <div className="px-5 pb-6 border-t border-[#F7F3EE]">
                          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-[#4A4A4A] font-body leading-relaxed mb-4">{service.description}</p>
                              {service.whoItsFor && (
                                <div className="mb-3">
                                  <p className="text-xs font-body font-600 text-[#CFA7A0] uppercase tracking-wide mb-1">Who It's For</p>
                                  <p className="text-sm text-[#4A4A4A] font-body">{service.whoItsFor}</p>
                                </div>
                              )}
                            </div>
                            <div>
                              {service.prep && (
                                <div className="mb-3">
                                  <p className="text-xs font-body font-600 text-[#CFA7A0] uppercase tracking-wide mb-1">How to Prepare</p>
                                  <p className="text-sm text-[#4A4A4A] font-body">{service.prep}</p>
                                </div>
                              )}
                              {service.aftercare && (
                                <div className="mb-4">
                                  <p className="text-xs font-body font-600 text-[#CFA7A0] uppercase tracking-wide mb-1">Aftercare</p>
                                  <p className="text-sm text-[#4A4A4A] font-body">{service.aftercare}</p>
                                </div>
                              )}
                              <div className="flex items-center gap-3 pt-2">
                                <div className="text-sm font-body text-[#4A4A4A]">
                                  <span className="font-500">Cash: </span>${service.priceCash}
                                  <span className="mx-2 text-[#D8C6B6]">|</span>
                                  <span className="font-500">Card: </span>${service.priceCard}
                                </div>
                              </div>
                              <a
                                href={BOOKING_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary text-sm py-2.5 px-5 mt-4 inline-block"
                              >
                                Book This Service
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing Note */}
      <section className="py-8 bg-white border-t border-[#D8C6B6]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-[#CFA7A0] text-lg">ℹ</span>
              <p className="text-sm text-[#4A4A4A] font-body">
                <strong>Pricing note:</strong> Cash pricing reflects a small discount for clients who pay with cash. Both prices are listed transparently. Prices may vary slightly by location.
              </p>
            </div>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
              Book Now
            </a>
          </div>
        </div>
      </section>

      {/* Before/After Care Links */}
      <section className="py-14 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link href="/before-care">
              <div className="bg-[#D8C6B6] rounded-lg p-6 cursor-pointer hover:bg-[#c9b5a3] transition-colors group">
                <p className="section-label text-[#3B2F2A] mb-2">Before Your Appointment</p>
                <h3 className="font-display text-2xl text-[#3B2F2A] mb-2">Before Care Guide</h3>
                <p className="text-sm text-[#4A4A4A] font-body mb-3">How to prepare for the best possible waxing results.</p>
                <span className="text-sm font-body font-600 text-[#3B2F2A] flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Guide <ArrowRight size={14} />
                </span>
              </div>
            </Link>
            <Link href="/after-care">
              <div className="bg-[#A8B3AA] rounded-lg p-6 cursor-pointer hover:bg-[#97a49c] transition-colors group">
                <p className="section-label text-[#3B2F2A] mb-2">After Your Appointment</p>
                <h3 className="font-display text-2xl text-[#3B2F2A] mb-2">After Care Guide</h3>
                <p className="text-sm text-[#3B2F2A]/80 font-body mb-3">Keep your skin smooth and prevent ingrown hairs.</p>
                <span className="text-sm font-body font-600 text-[#3B2F2A] flex items-center gap-1 group-hover:gap-2 transition-all">
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
