/*
 * WAX ME TOO — Individual Location Page
 * Design: Modern Feminine Craft
 */

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { MapPin, Phone, Mail, Clock, Star, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { locations, testimonials, BOOKING_URL } from "@/lib/data";

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

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const location = locations.find(l => l.id === id);

  // Dynamic SEO per location
  useEffect(() => {
    if (!location) return;
    document.title = `Waxing in ${location.city}, Utah | Wax Me Too — Professional Waxing Studio`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = `Wax Me Too ${location.city} — Professional Brazilian waxing, eyebrow design, and full body waxing in ${location.city}, ${location.county}, Utah. ${location.address}. Book online today. New clients receive 50% off their first Brazilian, Deep Bikini, or Bikini wax.`;
    return () => { document.title = 'Wax Me Too — Professional Waxing Studio | Utah'; };
  }, [location]);

  if (!location) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-4xl text-[#3B2F2A] mb-4">Location not found</h1>
          <Link href="/locations"><span className="btn-primary cursor-pointer">View All Locations</span></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#3B2F2A] py-16">
        <div className="container">
          <Link href="/locations">
            <span className="flex items-center gap-2 text-[#D8C6B6] text-sm font-body mb-6 cursor-pointer hover:text-[#CFA7A0] transition-colors">
              <ArrowLeft size={14} /> All Locations
            </span>
          </Link>
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="section-label text-[#CFA7A0] mb-2">{location.county} · Utah</p>
                <h1 className="font-display text-5xl md:text-6xl text-white">
                  Wax Me Too<br /><em className="text-[#CFA7A0]">{location.name}</em>
                </h1>
              </div>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose shrink-0">
                Book at {location.name}
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-16 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <FadeUp>
                <p className="text-[#4A4A4A] font-body leading-relaxed text-lg mb-8">{location.description}</p>
              </FadeUp>

              <FadeUp delay={100}>
                <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                  <h2 className="font-display text-2xl text-[#3B2F2A] mb-5">Services at {location.name}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Brazilian Wax", "Bikini Wax", "Deep Bikini Wax", "Brow Wax", "Underarm Wax", "Full Leg Wax", "Men's Waxing", "Face Waxing", "Tinting"].map((service) => (
                      <div key={service} className="flex items-center gap-2 text-sm font-body text-[#4A4A4A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CFA7A0] shrink-0" />
                        {service}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-5 border-t border-[#F7F3EE] flex gap-3">
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2.5">
                      Book a Service
                    </a>
                    <Link href="/services">
                      <span className="btn-outline text-sm py-2.5 cursor-pointer">Full Menu & Pricing</span>
                    </Link>
                  </div>
                </div>
              </FadeUp>

              {/* Local SEO Content */}
              <FadeUp delay={150}>
                <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                  <h2 className="font-display text-2xl text-[#3B2F2A] mb-4">
                    Professional Waxing in {location.city}
                  </h2>
                  <p className="text-[#4A4A4A] font-body leading-relaxed mb-3">
                    Looking for professional waxing in {location.city}? Wax Me Too {location.name} is {location.city}'s trusted waxing studio, serving clients across {location.county} with expert Brazilian waxing, bikini waxing, brow waxing, and full-body waxing services.
                  </p>
                  <p className="text-[#4A4A4A] font-body leading-relaxed">
                    Our {location.city} studio offers the same premium experience as all Wax Me Too locations — licensed estheticians, strict sanitation standards, eco-friendly products, and a private, judgment-free environment. Whether you're a first-time client or a long-time regular, you'll receive the same exceptional care.
                  </p>
                </div>
              </FadeUp>

              {/* Reviews */}
              <FadeUp delay={200}>
                <div>
                  <h2 className="font-display text-2xl text-[#3B2F2A] mb-5">Client Reviews</h2>
                  <div className="space-y-4">
                    {testimonials.slice(0, 3).map((t) => (
                      <div key={t.id} className="bg-white rounded-lg p-5 shadow-sm">
                        <div className="flex mb-2">
                          {[1,2,3,4,5].map(s => <Star key={s} size={13} className="fill-[#CFA7A0] text-[#CFA7A0]" />)}
                        </div>
                        <p className="text-sm text-[#4A4A4A] font-body leading-relaxed mb-2 italic">"{t.text}"</p>
                        <p className="text-xs font-600 text-[#3B2F2A] font-body">{t.name} · {t.service}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <FadeUp>
                <div className="bg-white rounded-lg p-6 shadow-sm border-t-4 border-[#CFA7A0]">
                  <h3 className="font-display text-xl text-[#3B2F2A] mb-4">Contact & Hours</h3>
                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <MapPin size={15} className="text-[#CFA7A0] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-body text-[#4A4A4A]">{location.address}</p>
                        {location.note && (
                          <p className="text-xs font-600 font-body mt-1" style={{ color: "#CFA7A0" }}>
                            📍 {location.note}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={15} className="text-[#CFA7A0] shrink-0" />
                      <a href={`tel:${location.phone}`} className="text-sm font-body text-[#4A4A4A] hover:text-[#CFA7A0] transition-colors">{location.phone}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={15} className="text-[#CFA7A0] shrink-0" />
                      <a href={`mailto:${location.email}`} className="text-sm font-body text-[#4A4A4A] hover:text-[#CFA7A0] transition-colors">{location.email}</a>
                    </div>
                  </div>
                  <div className="border-t border-[#F7F3EE] pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={14} className="text-[#CFA7A0]" />
                      <p className="text-xs font-body font-600 text-[#3B2F2A] uppercase tracking-wide">Hours</p>
                    </div>
                    <div className="space-y-1.5">
                      {Object.entries(location.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm font-body">
                          <span className="text-[#4A4A4A]">{day}</span>
                          <span className="text-[#3B2F2A] font-500">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 mb-1 rounded-md bg-[#F7F3EE] border border-[#D8C6B6] px-3 py-2">
                    <p className="text-xs font-body text-[#4A4A4A] leading-relaxed">
                      <span className="font-600 text-[#3B2F2A]">By Appointment Only.</span> While we appreciate walk-ins, our estheticians are usually booked. We recommend scheduling in advance to guarantee your preferred time.
                    </p>
                  </div>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center mt-4 block">
                    Book at {location.name}
                  </a>
                </div>
              </FadeUp>

              <FadeUp delay={100}>
                <div className="bg-[#CFA7A0] rounded-lg p-5">
                  <p className="font-body text-xs font-600 text-[#3B2F2A] uppercase tracking-wide mb-2">New Client Special</p>
                  <p className="font-display text-xl text-[#3B2F2A] mb-2">50% off your first Brazilian, Deep Bikini, or Bikini wax</p>
                  <p className="text-xs font-body text-[#3B2F2A]/80 mb-3">First time at Wax Me Too? Book your first Brazilian, Deep Bikini, or Bikini wax and receive 50% off.</p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2.5 w-full text-center block">
                    Claim Offer
                  </a>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
