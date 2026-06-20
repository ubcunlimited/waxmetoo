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
      {/* Main Footer */}
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <img
              src="/manus-storage/logo-main_d068419a.webp"
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
                className="w-9 h-9 rounded-full bg-[#4a3d38] flex items-center justify-center hover:bg-[#A8B3AA] hover:text-[#3B2F2A] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-body font-600 text-xs tracking-widest uppercase mb-5" style={{ color: "#A8B3AA" }}>Services</h4>
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
            <h4 className="font-body font-600 text-xs tracking-widest uppercase mb-5" style={{ color: "#CFA7A0" }}>Quick Links</h4>
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
            <h4 className="font-body font-600 text-xs tracking-widest uppercase mb-5" style={{ color: "#A8B3AA" }}>Our Locations</h4>
            <ul className="space-y-4">
              {locations.map((loc) => (
                <li key={loc.id}>
                  <div className="cursor-pointer group">
                    <Link href={`/locations/${loc.id}`}>
                      <p className="text-sm font-medium text-[#D8C6B6] group-hover:text-white transition-colors mb-0.5">{loc.name}</p>
                    </Link>
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#A8B3AA] mt-0.5 hover:text-[#CFA7A0] transition-colors underline-offset-2 hover:underline block"
                    >
                      {loc.address}
                    </a>
                    {(loc as any).note && (
                      <p className="text-xs mt-0.5" style={{ color: "#CFA7A0" }}>📍 {(loc as any).note}</p>
                    )}
                    {(loc as any).militaryDiscount && (
                      <p className="text-xs mt-0.5 font-600" style={{ color: "#7a9e72" }}>★ Military Discount Available</p>
                    )}
                    <p className="text-xs text-[#A8B3AA]">{loc.phone}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: "1px solid", borderImage: "linear-gradient(90deg, #4a3d38, #A8B3AA40, #4a3d38) 1" }}>
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#7a6a62]">
            © {new Date().getFullYear()} Wax Me Too. All rights reserved. Women-Owned · Est. 2007 · Utah
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Terms & Conditions", href: "/terms-of-service" },
              { label: "Accessibility", href: "/terms-of-service#accessibility" },
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
