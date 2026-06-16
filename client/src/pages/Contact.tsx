import { usePageSEO } from "@/hooks/usePageSEO";
import FadeUp from "@/components/FadeUp";
/*
 * WAX ME TOO — Contact Page
 */

import { useEffect, useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import { locations, BOOKING_URL } from "@/lib/data";
import { useBreadcrumbSchema } from "@/hooks/useBreadcrumbSchema";


export default function Contact() {
  useBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);

  usePageSEO(
    "Contact Wax Me Too — 6 Utah Waxing Studio Locations",
    "Contact Wax Me Too at any of our 6 Utah locations — Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Call (801) 572-7771 or book online.",
  );

  const [submitted, setSubmitted] = useState(false);

  return (
    <Layout>
      <section className="bg-[#3B2F2A] py-20">
        <div className="container">
          <FadeUp>
            <div className="max-w-xl">
              <p className="section-label text-[#CFA7A0] mb-3">Get in Touch</p>
              <h1 className="font-display text-5xl md:text-6xl text-white mb-5">
                We're here<br /><em className="text-[#CFA7A0]">to help.</em>
              </h1>
              <p className="text-[#D8C6B6] font-body leading-relaxed">
                Have a question, concern, or just want to say hello? Reach out to your nearest location or send us a message below.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <FadeUp>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h2 className="font-display text-2xl text-[#3B2F2A] mb-6">Send us a message</h2>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-[#CFA7A0]/15 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✓</span>
                    </div>
                    <h3 className="font-display text-2xl text-[#3B2F2A] mb-2">Message sent!</h3>
                    <p className="text-[#4A4A4A] font-body">We'll get back to you within 1–2 business days.</p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-body font-600 text-[#3B2F2A] uppercase tracking-wide block mb-1.5">First Name</label>
                        <input type="text" required className="w-full px-4 py-3 rounded border border-[#D8C6B6] font-body text-sm text-[#3B2F2A] outline-none focus:ring-2 focus:ring-[#CFA7A0] bg-[#F7F3EE]" />
                      </div>
                      <div>
                        <label className="text-xs font-body font-600 text-[#3B2F2A] uppercase tracking-wide block mb-1.5">Last Name</label>
                        <input type="text" required className="w-full px-4 py-3 rounded border border-[#D8C6B6] font-body text-sm text-[#3B2F2A] outline-none focus:ring-2 focus:ring-[#CFA7A0] bg-[#F7F3EE]" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-body font-600 text-[#3B2F2A] uppercase tracking-wide block mb-1.5">Email</label>
                      <input type="email" required className="w-full px-4 py-3 rounded border border-[#D8C6B6] font-body text-sm text-[#3B2F2A] outline-none focus:ring-2 focus:ring-[#CFA7A0] bg-[#F7F3EE]" />
                    </div>
                    <div>
                      <label className="text-xs font-body font-600 text-[#3B2F2A] uppercase tracking-wide block mb-1.5">Preferred Location</label>
                      <select className="w-full px-4 py-3 rounded border border-[#D8C6B6] font-body text-sm text-[#3B2F2A] outline-none focus:ring-2 focus:ring-[#CFA7A0] bg-[#F7F3EE]">
                        <option value="general">General Inquiry</option>
                        {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-body font-600 text-[#3B2F2A] uppercase tracking-wide block mb-1.5">Message</label>
                      <textarea required rows={5} className="w-full px-4 py-3 rounded border border-[#D8C6B6] font-body text-sm text-[#3B2F2A] outline-none focus:ring-2 focus:ring-[#CFA7A0] bg-[#F7F3EE] resize-none" />
                    </div>
                    <button type="submit" className="btn-primary w-full">Send Message</button>
                  </form>
                )}
              </div>
            </FadeUp>

            {/* Location Info */}
            <FadeUp delay={150}>
              <div>
                <h2 className="font-display text-2xl text-[#3B2F2A] mb-6">Our locations</h2>
                <div className="space-y-4">
                  {locations.map((loc) => (
                    <div key={loc.id} className="bg-white rounded-lg p-5 shadow-sm">
                      <h3 className="font-display text-xl text-[#3B2F2A] mb-3">{loc.name}</h3>
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2.5">
                          <MapPin size={14} className="text-[#CFA7A0] mt-0.5 shrink-0" />
                          <p className="text-sm font-body text-[#4A4A4A]">{loc.address}</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Phone size={14} className="text-[#CFA7A0] shrink-0" />
                          <a href={`tel:${loc.phone}`} className="text-sm font-body text-[#4A4A4A] hover:text-[#CFA7A0] transition-colors">{loc.phone}</a>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Mail size={14} className="text-[#CFA7A0] shrink-0" />
                          <a href={`mailto:${loc.email}`} className="text-sm font-body text-[#4A4A4A] hover:text-[#CFA7A0] transition-colors">{loc.email}</a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-[#CFA7A0] rounded-lg p-5">
                  <p className="font-display text-xl text-[#3B2F2A] mb-2">Ready to book?</p>
                  <p className="text-sm font-body text-[#3B2F2A]/80 mb-3">Skip the wait — book your appointment online in minutes.</p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2.5">
                    Book Now
                  </a>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </Layout>
  );
}
