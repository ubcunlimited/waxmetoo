/*
 * WAX ME TOO — Footer Component
 * Design: Modern Feminine Craft
 * Features: Location links, nav, newsletter, social, legal
 */

import { Link } from "wouter";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { locations, BOOKING_URL } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#3B2F2A] text-[#D8C6B6]">
      {/* Newsletter Strip */}
      <div className="bg-[#CFA7A0]">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="section-label text-[#3B2F2A]">Stay in the Loop</p>
              <h3 className="font-display text-2xl text-[#3B2F2A] mt-1">
                Get exclusive offers & waxing tips
              </h3>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 md:w-72 px-4 py-3 rounded text-[#3B2F2A] bg-white placeholder-[#9a7a74] font-body text-sm border-0 outline-none focus:ring-2 focus:ring-[#3B2F2A]"
              />
              <button type="submit" className="btn-primary whitespace-nowrap text-sm py-3 px-5">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img
              src="/manus-storage/logo-main_dd69d8bf.png"
              alt="Wax Me Too — Professional Waxing Studio"
              className="h-16 w-auto mb-2 brightness-0 invert opacity-80"
            />
            <p className="text-xs text-[#CFA7A0] font-body italic mb-4 tracking-wide">
              From Brows to Toes &amp; Anything in Between!<sup className="text-[10px]">&#8482;</sup>
            </p>
            <p className="text-sm text-[#A8B3AA] leading-relaxed mb-5">
              Women-owned professional waxing studio established in 2007. Expert estheticians, premium wax, and a private, comfortable experience across Utah.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/waxmetoo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#4a3d38] flex items-center justify-center hover:bg-[#CFA7A0] hover:text-[#3B2F2A] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com/waxmetoo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#4a3d38] flex items-center justify-center hover:bg-[#CFA7A0] hover:text-[#3B2F2A] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-body font-600 text-xs tracking-widest uppercase text-[#CFA7A0] mb-5">Services</h4>
            <ul className="space-y-2.5">
              {["Brazilian Wax", "Bikini Wax", "Deep Bikini Wax", "Brow Wax", "Underarm Wax", "Full Leg Wax", "Men's Waxing", "Tinting"].map((s) => (
                <li key={s}>
                  <Link href="/services">
                    <span className="text-sm text-[#A8B3AA] hover:text-[#D8C6B6] transition-colors cursor-pointer">{s}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-body font-600 text-xs tracking-widest uppercase text-[#CFA7A0] mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: "First Visit", href: "/first-visit" },
                { label: "Locations", href: "/locations" },
                { label: "About Us", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Blog & Tips", href: "/blog" },
                { label: "Contact", href: "/contact" },
                { label: "Before Care", href: "/before-care" },
                { label: "After Care", href: "/after-care" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-sm text-[#A8B3AA] hover:text-[#D8C6B6] transition-colors cursor-pointer">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations Column */}
          <div>
            <h4 className="font-body font-600 text-xs tracking-widest uppercase text-[#CFA7A0] mb-5">Our Locations</h4>
            <ul className="space-y-4">
              {locations.map((loc) => (
                <li key={loc.id}>
                  <Link href={`/locations/${loc.id}`}>
                    <div className="cursor-pointer group">
                      <p className="text-sm font-medium text-[#D8C6B6] group-hover:text-white transition-colors">{loc.name}</p>
                      <p className="text-xs text-[#A8B3AA] mt-0.5">{loc.address}</p>
                      <p className="text-xs text-[#A8B3AA]">{loc.phone}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#4a3d38]">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#7a6a62]">
            © {new Date().getFullYear()} Wax Me Too. All rights reserved. Women-Owned · Est. 2007 · Utah
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "AI Disclosure", href: "/terms#ai-disclosure" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="text-xs text-[#7a6a62] hover:text-[#A8B3AA] transition-colors cursor-pointer">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
