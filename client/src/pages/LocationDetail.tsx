import FadeUp from "@/components/FadeUp";
/*
 * WAX ME TOO — Individual Location Page
 * Design: Modern Feminine Craft
 */

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { MapPin, Phone, Mail, Clock, Star, ArrowLeft, Navigation } from "lucide-react";
import Layout from "@/components/Layout";
import { locations, testimonials, BOOKING_URL } from "@/lib/data";
import { useBreadcrumbSchema } from "@/hooks/useBreadcrumbSchema";
import { useLocalBusinessSchema } from "@/hooks/useLocalBusinessSchema";

// Geo coordinates for each studio (lat/lng)
const GEO: Record<string, { latitude: number; longitude: number }> = {
  "layton":          { latitude: 41.0602,  longitude: -111.9710 },
  "south-jordan":    { latitude: 40.5621,  longitude: -111.9996 },
  "orem":            { latitude: 40.2969,  longitude: -111.6938 },
  "salt-lake-city":  { latitude: 40.7282,  longitude: -111.9044 },
  "draper":          { latitude: 40.5246,  longitude: -111.8638 },
  "st-george":       { latitude: 37.1041,  longitude: -113.5841 },
};

// Parse "9:00 AM – 7:00 PM" → { opens: "09:00", closes: "19:00" }
function parseHours(raw: string): { opens: string; closes: string } | null {
  const m = raw.match(/(\d+):(\d+)\s*(AM|PM)\s*[–-]\s*(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return null;
  const to24 = (h: string, min: string, ampm: string) => {
    let hour = parseInt(h, 10);
    if (ampm.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${min}`;
  };
  return { opens: to24(m[1], m[2], m[3]), closes: to24(m[4], m[5], m[6]) };
}

// Map human-readable day ranges to schema.org day URIs
const DAY_MAP: Record<string, string[]> = {
  "Mon–Fri":       ["Monday","Tuesday","Wednesday","Thursday","Friday"],
  "Saturday":      ["Saturday"],
  "Sunday":        ["Sunday"],
  "Tuesday–Friday":["Tuesday","Wednesday","Thursday","Friday"],
  "Sunday–Monday": ["Sunday","Monday"],
};


export default function LocationDetail() {
  const { id } = useParams<{ id: string }>();
  const location = locations.find(l => l.id === id);

  // Build opening hours spec for schema.org
  const openingHoursSpecification = location
    ? Object.entries(location.hours).flatMap(([dayRange, timeRange]) => {
        const parsed = parseHours(timeRange);
        if (!parsed) return [];
        const days = DAY_MAP[dayRange] ?? [dayRange];
        return days.map(day => ({ dayOfWeek: day, opens: parsed.opens, closes: parsed.closes }));
      })
    : [];

  // Extract postal code from address (last 5-digit sequence)
  const postalCode = location?.address.match(/(\d{5})(?!\d)/)?.[1] ?? "";

  useLocalBusinessSchema({
    name: `Wax Me Too ${location?.city ?? ""}`,
    description: location?.description ?? "",
    url: `https://www.waxmetoo.com/locations/${id}`,
    telephone: location?.phone ?? "",
    email: location?.email ?? "",
    address: {
      streetAddress: location?.address.split(",")[0] ?? "",
      addressLocality: location?.city ?? "",
      addressRegion: "UT",
      postalCode,
      addressCountry: "US",
    },
    geo: id ? GEO[id] : undefined,
    openingHoursSpecification,
    priceRange: "$$",
  });

  useBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations" },
    { name: location?.city ?? "Location", url: `/locations/${id}` },
  ]);

  // Dynamic SEO per location
  useEffect(() => {
    if (!location) return;
    document.title = `Waxing in ${location.city}, Utah | Wax Me Too — Professional Waxing Studio`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = `Wax Me Too ${location.city} — Professional Brazilian waxing, eyebrow design, and full body waxing in ${location.city}, ${location.county}, Utah. ${location.address}. Book online today. First-time clients get their Brazilian wax for $50.`;
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

              {/* Getting Here — only shown for suite/shared-building locations */}
              {(location as any).gettingHere && (
                <FadeUp delay={120}>
                  <div className="bg-[#CFA7A0]/10 border border-[#CFA7A0]/30 rounded-lg p-6 mb-6 flex gap-4 items-start">
                    <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(207,167,160,0.2)" }}>
                      <Navigation size={16} style={{ color: "#CFA7A0" }} />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-[#3B2F2A] mb-1">Getting Here</h3>
                      <p className="text-sm text-[#4A4A4A] font-body leading-relaxed">{(location as any).gettingHere}</p>
                      <a
                        href={location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-600 font-body hover:underline"
                        style={{ color: "#CFA7A0" }}
                      >
                        <MapPin size={12} /> Open in Google Maps
                      </a>
                    </div>
                  </div>
                </FadeUp>
              )}

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
                  {(location as any).militaryDiscount && (
                    <div className="mt-4 rounded-md px-3 py-2 flex items-center gap-2" style={{ background: "rgba(168,179,170,0.18)", border: "1px solid rgba(74,103,65,0.25)" }}>
                      <span className="text-base" aria-hidden>🎖️</span>
                      <p className="text-xs font-body font-600" style={{ color: "#4A6741" }}>Military Discount Available — ask your esthetician for details.</p>
                    </div>
                  )}
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
                  <p className="font-display text-xl text-[#3B2F2A] mb-2">Brazilian wax for $50 — first visit only</p>
                  <p className="text-xs font-body text-[#3B2F2A]/80 mb-3">First time at Wax Me Too? Book your first Brazilian wax and pay just $50.</p>
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
