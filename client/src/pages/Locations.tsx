/*
 * WAX ME TOO — Locations Hub Page
 * Design: Modern Feminine Craft
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { locations, BOOKING_URL } from "@/lib/data";

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

export default function Locations() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#3B2F2A] py-20">
        <div className="container">
          <FadeUp>
            <div className="max-w-xl">
              <p className="section-label text-[#CFA7A0] mb-3">Find Us</p>
              <h1 className="font-display text-5xl md:text-6xl text-white mb-5">
                Our Utah<br /><em className="text-[#CFA7A0]">locations</em>
              </h1>
              <p className="text-[#D8C6B6] font-body leading-relaxed">
                From Weber County to Utah County, and from Washington County to Mesquite, Nevada — there's a Wax Me Too near you. Each location offers the same premium experience, expert estheticians, and strict sanitation standards.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc, i) => (
              <FadeUp key={loc.id} delay={i * 80}>
                <div className="location-card bg-white">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="font-display text-3xl text-[#3B2F2A]">{loc.name}</h2>
                        <p className="text-xs font-body text-[#A8B3AA] mt-1 uppercase tracking-wide">{loc.county} · {loc.state}</p>
                      </div>
                      <span className="text-[#CFA7A0] text-2xl">✦</span>
                    </div>

                    <p className="text-sm text-[#4A4A4A] font-body leading-relaxed mb-5">{loc.description}</p>

                    <div className="space-y-2 mb-5">
                      <div className="flex items-start gap-2.5">
                        <MapPin size={15} className="text-[#CFA7A0] mt-0.5 shrink-0" />
                        <p className="text-sm font-body text-[#4A4A4A]">{loc.address}</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone size={15} className="text-[#CFA7A0] shrink-0" />
                        <a href={`tel:${loc.phone}`} className="text-sm font-body text-[#4A4A4A] hover:text-[#CFA7A0] transition-colors">{loc.phone}</a>
                      </div>
                    </div>

                    <div className="bg-[#F7F3EE] rounded-lg p-4 mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={14} className="text-[#CFA7A0]" />
                        <p className="text-xs font-body font-600 text-[#3B2F2A] uppercase tracking-wide">Hours</p>
                      </div>
                      <div className="space-y-1">
                        {Object.entries(loc.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between text-sm font-body">
                            <span className="text-[#4A4A4A]">{day}</span>
                            <span className="text-[#3B2F2A] font-500">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {(loc as any).note && (
                      <div className="flex items-center gap-1.5 mb-4">
                        <span className="text-xs font-body font-600 text-[#A8B3AA] bg-[#F7F3EE] px-2.5 py-1 rounded-full">★ {(loc as any).note}</span>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <a
                        href={BOOKING_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex-1 text-center text-sm py-3"
                      >
                        Book at {loc.name}
                      </a>
                      <Link href={`/locations/${loc.id}`}>
                        <span className="btn-outline text-sm py-3 px-4 cursor-pointer">Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-white">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-10">
              <p className="section-label mb-3">Service Areas</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#3B2F2A] mb-4">
                Serving communities across Utah &amp; Nevada
              </h2>
              <p className="text-[#4A4A4A] font-body max-w-xl mx-auto">
                Our studios serve clients from Weber County in the north to Utah County in the south, and from Washington County all the way to Mesquite, Nevada.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { county: "Davis & Weber County", cities: ["Layton", "Ogden", "Kaysville", "Clearfield", "Bountiful"] },
                { county: "Salt Lake County", cities: ["South Jordan", "Salt Lake City", "Draper", "Sandy", "West Jordan"] },
                { county: "Utah County", cities: ["Orem", "Provo", "American Fork", "Lehi", "Spanish Fork"] },
                { county: "Washington County & NV", cities: ["St. George", "Washington City", "Hurricane", "Ivins", "Mesquite, NV"] },
              ].map((area) => (
                <div key={area.county} className="bg-[#F7F3EE] rounded-lg p-5">
                  <h3 className="font-body text-sm font-600 text-[#CFA7A0] uppercase tracking-wide mb-3">{area.county}</h3>
                  <ul className="space-y-1.5">
                    {area.cities.map((city) => (
                      <li key={city} className="text-sm font-body text-[#4A4A4A] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#CFA7A0] shrink-0" />
                        {city}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#CFA7A0]">
        <div className="container text-center">
          <FadeUp>
            <h2 className="font-display text-3xl md:text-4xl text-[#3B2F2A] mb-4">
              Ready to book at your nearest location?
            </h2>
            <p className="text-[#3B2F2A]/80 font-body mb-6">New clients receive 20% off their first service.</p>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Book Your Appointment
            </a>
          </FadeUp>
        </div>
      </section>
    </Layout>
  );
}
