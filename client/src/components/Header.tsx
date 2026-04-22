/*
 * WAX ME TOO — Header Component
 * Design: Modern Feminine Craft
 * Features: Sticky nav, mobile hamburger, promo banner, Book Now CTA
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { BOOKING_URL } from "@/lib/data";

const navLinks: { label: string; href: string; hasDropdown?: boolean; highlight?: boolean }[] = [
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "First Visit", href: "/first-visit" },
  { label: "Locations", href: "/locations" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "🎁 Win a Free Wax", href: "/win-a-free-wax", highlight: true },
];

const serviceDropdown = [
  { label: "Women's Waxing", href: "/services#womens-waxing" },
  { label: "Men's Waxing", href: "/services#mens-waxing" },
  { label: "Face Waxing", href: "/services#face" },
  { label: "Tinting", href: "/services#tinting" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Promo Banner */}
      <div className="promo-banner" style={{ background: "linear-gradient(90deg, #CFA7A0 0%, #A8B3AA 100%)", color: "#3B2F2A" }}>
        <span>✦ New Clients: Enjoy 20% off your first service — </span>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Book Now</a>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#F7F3EE]/97 backdrop-blur-sm shadow-sm"
            : "bg-[#F7F3EE]"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-24 md:h-28">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer">
                <img
                  src="/manus-storage/logo-main_dd69d8bf.png"
                  alt="Wax Me Too — Professional Waxing Studio"
                  className="h-20 md:h-24 w-auto"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                  >
                    <Link href={link.href}>
                      <span className="nav-link flex items-center gap-1 cursor-pointer">
                        {link.label}
                        <ChevronDown size={13} className="opacity-70" />
                      </span>
                    </Link>
                    {servicesOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-[#D8C6B6] py-2 min-w-[180px] z-50">
                        {serviceDropdown.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <span className="block px-4 py-2.5 text-sm font-body text-[#4A4A4A] hover:bg-[#F7F3EE] hover:text-[#A8B3AA] transition-colors cursor-pointer">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : link.highlight ? (
                  <Link key={link.href} href={link.href}>
                    <span
                      className="cursor-pointer text-sm font-semibold px-3 py-1.5 rounded-full transition-all"
                      style={{ background: "rgba(207,167,160,0.15)", color: "#CFA7A0", border: "1px solid rgba(207,167,160,0.4)" }}
                    >
                      {link.label}
                    </span>
                  </Link>
                ) : (
                  <Link key={link.href} href={link.href}>
                    <span className="nav-link cursor-pointer">{link.label}</span>
                  </Link>
                )
              )}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm py-3 px-6"
              >
                Book Now
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-[#3B2F2A]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#F7F3EE] border-t border-[#D8C6B6] shadow-lg">
            <nav className="container py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="block py-3 px-2 font-body font-medium text-base border-b cursor-pointer transition-colors"
                    style={{
                      color: link.highlight ? "#CFA7A0" : "#3B2F2A",
                      borderBottomColor: i % 2 === 0 ? "rgba(207,167,160,0.2)" : "rgba(168,179,170,0.2)"
                    }}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-center mt-4"
              >
                Book Now
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Sticky Mobile Book Button */}
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="sticky-book-btn lg:hidden"
      >
        Book Your Appointment →
      </a>
    </>
  );
}
