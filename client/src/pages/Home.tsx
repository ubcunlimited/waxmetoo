/*
 * WAX ME TOO — Homepage
 * Design: Modern Feminine Craft
 * Sections: Hero, New Client Offer, Services Preview, Trust Badges, Testimonials, Locations, Blog Teaser, FAQ Preview, CTA Strip
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Star, ChevronDown, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { serviceCategories, testimonials, locations, faqs, blogPosts, trustBadges, BOOKING_URL } from "@/lib/data";

// Scroll-triggered fade-up hook
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useFadeUp();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const featuredServices = [
  { name: "Brazilian Wax", price: "from $55", icon: "✦", desc: "Our signature service. Complete, clean, confident.", href: "/services#brazilian" },
  { name: "Bikini Wax", price: "from $35", icon: "◆", desc: "Clean lines, effortless confidence.", href: "/services#bikini" },
  { name: "Deep Bikini Wax", price: "from $45", icon: "◇", desc: "More coverage, more confidence.", href: "/services#deep-bikini" },
  { name: "Brow Wax", price: "from $18", icon: "◈", desc: "Your best brows. Every time.", href: "/services#brow-wax" },
  { name: "Underarm Wax", price: "from $20", icon: "✧", desc: "Smooth underarms that last for weeks.", href: "/services#underarm" },
  { name: "Full Leg Wax", price: "from $65", icon: "❋", desc: "Silky smooth from hip to toe.", href: "/services#full-leg" },
];

export default function Home() {
  useEffect(() => {
    document.title = "Wax Me Too — Utah's Professional Waxing Studio Since 2007";
    let m = document.querySelector<HTMLMetaElement>("meta[name='description']"); if (!m) { m = document.createElement('meta') as HTMLMetaElement; m.name = 'description'; document.head.appendChild(m); }
    m.content = "Wax Me Too is Utah's first and most trusted waxing-only studio. 6 locations across Utah — Layton, Salt Lake City, South Jordan, Draper, Orem, and St. George. Brazilian wax, eyebrow design, full body waxing. New clients receive 20% off.";
    return () => { document.title = "Wax Me Too — Professional Waxing Studio | Utah"; };
  }, []);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {/* ─── HERO ─── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/manus-storage/hero-main_9c0c850f.jpg)`,
          }}
        />
        {/* Left-to-right gradient — ensures text always readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B2F2A]/90 via-[#3B2F2A]/70 to-[#3B2F2A]/20" />
        {/* Bottom vignette — extra legibility on small screens where image shifts */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3B2F2A]/60 via-transparent to-transparent" />

        <div className="container relative z-10">
          <div className="max-w-xl">
            <div className="animate-fade-up">
              <p className="section-label text-[#CFA7A0] mb-3">Professional Waxing Studio · Est. 2007</p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
                Smooth skin.<br />
                <em className="text-[#CFA7A0]">Confident you.</em>
              </h1>
              <p className="text-[#D8C6B6] text-lg leading-relaxed mb-8 font-body">
                Utah's women-owned waxing studio since 2007. Expert estheticians, premium wax, and a private experience designed to make you feel at ease — every single time.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose">
                  Book Your Appointment
                </a>
                <Link href="/first-visit">
                  <span className="btn-outline-ivory cursor-pointer">First Visit? Start Here</span>
                </Link>
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="flex">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-[#CFA7A0] text-[#CFA7A0]" />)}
                </div>
                <p className="text-[#D8C6B6] text-sm font-body">500+ five-star reviews across Utah</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* ─── NEW CLIENT OFFER ─── */}
      <section className="bg-[#CFA7A0] py-14">
        <div className="container">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <p className="font-body text-xs font-600 tracking-widest uppercase text-[#3B2F2A]/70 mb-2">New Client Special</p>
                <h2 className="font-display text-3xl md:text-4xl text-[#3B2F2A]">
                  Your first service, <em>20% off.</em>
                </h2>
                <p className="text-[#3B2F2A]/80 mt-2 font-body">
                  First time at Wax Me Too? We'd love to welcome you. Book any service and receive 20% off.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Claim Your Offer
                </a>
                <Link href="/first-visit">
                  <span className="btn-outline cursor-pointer">What to Expect</span>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── TRUST BADGES ─── */}
      <section className="bg-white py-10 border-b border-[#D8C6B6]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trustBadges.map((badge, i) => (
              <FadeUp key={badge.label} delay={i * 60}>
                <div className="flex flex-col items-center text-center gap-2 py-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-xs font-body font-500 text-[#4A4A4A] leading-tight">{badge.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED SERVICES ─── */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="section-label mb-3">Our Services</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#3B2F2A] mb-4">
                From Brows to Toes & Anything in Between!<sup className="text-2xl align-super text-[#CFA7A0]">&#8482;</sup>
              </h2>
              <p className="text-[#4A4A4A] max-w-xl mx-auto font-body leading-relaxed">
                We offer a complete waxing menu for women and men. Every service is performed by licensed estheticians using premium, skin-safe wax.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((service, i) => (
              <FadeUp key={service.name} delay={i * 80}>
                <Link href={service.href}>
                  <div className="card-service group cursor-pointer p-6 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl text-[#CFA7A0]">{service.icon}</span>
                      <span className="text-xs font-body font-600 text-[#CFA7A0] tracking-wide">{service.price}</span>
                    </div>
                    <h3 className="font-display text-xl text-[#3B2F2A] mb-2">{service.name}</h3>
                    <p className="text-sm text-[#4A4A4A] font-body leading-relaxed mb-4">{service.desc}</p>
                    <span className="text-xs font-body font-600 text-[#CFA7A0] tracking-wide uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn More <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={200}>
            <div className="text-center mt-10">
              <Link href="/services">
                <span className="btn-outline cursor-pointer">View Full Service Menu</span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── ABOUT / BRAND STORY ─── */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="relative">
                <img
                  src="/manus-storage/about-hero_3c8ee818.jpg"
                  alt="Wax Me Too esthetician in treatment room"
                  className="w-full rounded-lg object-cover aspect-[4/3]"
                />
                <div className="absolute -bottom-5 -right-5 bg-[#CFA7A0] rounded-lg p-5 shadow-lg hidden md:block">
                  <p className="font-display text-3xl text-[#3B2F2A]">17+</p>
                  <p className="text-xs font-body font-600 text-[#3B2F2A]/80 uppercase tracking-wide">Years of Excellence</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={150}>
              <div>
                <p className="section-label mb-3">Our Story</p>
                <h2 className="font-display text-4xl md:text-5xl text-[#3B2F2A] mb-5">
                  Waxing done right,<br /><em>since 2007.</em>
                </h2>
                <p className="text-[#4A4A4A] font-body leading-relaxed mb-4">
                  Wax Me Too was founded with a single belief: that professional waxing should feel comfortable, private, and completely judgment-free. Since opening our first studio in 2007, we've grown into a multi-location Utah brand built on trust, expertise, and results.
                </p>
                <p className="text-[#4A4A4A] font-body leading-relaxed mb-6">
                  We're women-owned, eco-conscious, and deeply committed to your comfort. Every esthetician on our team is licensed, trained, and passionate about making your experience exceptional — whether it's your first visit or your fiftieth.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Women-owned and operated since 2007",
                    "Eco-friendly, skin-safe wax products",
                    "Strict sanitation — no double-dipping, ever",
                    "Private rooms for every service",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 font-body text-sm text-[#4A4A4A]">
                      <CheckCircle size={16} className="text-[#CFA7A0] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/about">
                  <span className="btn-outline cursor-pointer">Our Full Story</span>
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── FIRST VISIT CALLOUT ─── */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/manus-storage/first-visit_66b40ffa.jpg)`,
          }}
        />
        <div className="absolute inset-0 bg-[#3B2F2A]/75" />
        <div className="container relative z-10">
          <FadeUp>
            <div className="max-w-2xl mx-auto text-center">
              <p className="section-label text-[#CFA7A0] mb-3">First Time?</p>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
                Nothing scary.<br /><em className="text-[#CFA7A0]">Nothing embarrassing.</em>
              </h2>
              <p className="text-[#D8C6B6] font-body leading-relaxed mb-8">
                We understand that walking into a waxing studio for the first time can feel intimidating. That's why we've created a complete First Visit guide — covering what to expect, how to prepare, and exactly why our clients keep coming back.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/first-visit">
                  <span className="btn-rose cursor-pointer">Read the First Visit Guide</span>
                </Link>
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-outline-ivory">
                  Book Now
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="section-label mb-3">Client Love</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#3B2F2A]">
                What our clients say
              </h2>
            </div>
          </FadeUp>

          {/* Featured Testimonial */}
          <FadeUp delay={100}>
            <div className="max-w-2xl mx-auto mb-10">
              <div className="card-testimonial text-center">
                <div className="flex justify-center mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={18} className="fill-[#CFA7A0] text-[#CFA7A0]" />)}
                </div>
                <p className="font-display text-xl md:text-2xl text-[#3B2F2A] italic leading-relaxed mb-4">
                  "{testimonials[activeTestimonial].text}"
                </p>
                <p className="font-body text-sm font-600 text-[#4A4A4A]">{testimonials[activeTestimonial].name}</p>
                <p className="font-body text-xs text-[#CFA7A0] mt-1">{testimonials[activeTestimonial].service} · {testimonials[activeTestimonial].location}</p>
              </div>
              <div className="flex justify-center gap-2 mt-5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? "bg-[#CFA7A0] w-5" : "bg-[#D8C6B6]"}`}
                  />
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Grid of smaller testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.slice(0, 3).map((t, i) => (
              <FadeUp key={t.id} delay={i * 80}>
                <div className="bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} className="fill-[#CFA7A0] text-[#CFA7A0]" />)}
                  </div>
                  <p className="text-sm text-[#4A4A4A] font-body leading-relaxed mb-3">"{t.text.substring(0, 120)}..."</p>
                  <p className="text-xs font-600 text-[#3B2F2A] font-body">{t.name} · {t.location}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCATIONS ─── */}
      <section className="py-20 bg-white">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="section-label mb-3">Find Us</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#3B2F2A] mb-4">
                From Weber County to Utah County
              </h2>
              <p className="text-[#4A4A4A] font-body max-w-lg mx-auto">
                From Weber County to Utah County, and from Washington County to Mesquite, Nevada — there's a Wax Me Too near you.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {locations.map((loc, i) => (
              <FadeUp key={loc.id} delay={i * 80}>
                <div className="location-card cursor-pointer" onClick={() => window.location.href = `/locations/${loc.id}`}>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin size={16} className="text-[#CFA7A0]" />
                      <h3 className="font-display text-xl text-[#3B2F2A]">{loc.name}</h3>
                    </div>
                    <p className="text-xs text-[#4A4A4A] font-body mb-2">{loc.address}</p>
                    <p className="text-xs text-[#4A4A4A] font-body mb-4">{loc.phone}</p>
                    <div className="text-xs text-[#A8B3AA] font-body space-y-1 mb-4">
                      {Object.entries(loc.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span>{day}</span>
                          <span>{hours}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs py-2.5 px-4 w-full text-center block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Book at {loc.name}
                    </a>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={200}>
            <div className="text-center mt-10">
              <Link href="/locations">
                <span className="btn-outline cursor-pointer">View All Locations</span>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── FAQ PREVIEW ─── */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <FadeUp>
              <div>
                <p className="section-label mb-3">Common Questions</p>
                <h2 className="font-display text-4xl md:text-5xl text-[#3B2F2A] mb-5">
                  We've got answers
                </h2>
                <p className="text-[#4A4A4A] font-body leading-relaxed mb-6">
                  Whether it's your first time or you're a seasoned regular, we want you to feel informed and confident. Browse our most common questions below.
                </p>
                <Link href="/faq">
                  <span className="btn-outline cursor-pointer">View All FAQs</span>
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={150}>
              <div className="space-y-0">
                {faqs.slice(0, 5).map((faq) => (
                  <div key={faq.id} className="faq-item">
                    <button
                      className="w-full text-left py-4 flex items-center justify-between gap-4"
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    >
                      <span className="font-body font-500 text-[#3B2F2A] text-sm">{faq.question}</span>
                      <ChevronDown
                        size={16}
                        className={`text-[#CFA7A0] shrink-0 transition-transform ${openFaq === faq.id ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openFaq === faq.id && (
                      <div className="pb-4">
                        <p className="text-sm text-[#4A4A4A] font-body leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── BLOG TEASER ─── */}
      <section className="py-20 bg-white">
        <div className="container">
          <FadeUp>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label mb-3">Tips & Education</p>
                <h2 className="font-display text-4xl md:text-5xl text-[#3B2F2A]">
                  From the journal
                </h2>
              </div>
              <Link href="/blog">
                <span className="text-sm font-body font-600 text-[#CFA7A0] hover:text-[#3B2F2A] transition-colors cursor-pointer flex items-center gap-1">
                  All Articles <ArrowRight size={14} />
                </span>
              </Link>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post, i) => (
              <FadeUp key={post.id} delay={i * 80}>
                <Link href={`/blog/${post.slug}`}>
                  <div className="blog-card cursor-pointer">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-body font-600 text-[#CFA7A0] uppercase tracking-wide">{post.category}</span>
                        <span className="text-[#D8C6B6]">·</span>
                        <span className="text-xs text-[#A8B3AA] font-body">{post.readTime}</span>
                      </div>
                      <h3 className="font-display text-lg text-[#3B2F2A] mb-2 leading-snug">{post.title}</h3>
                      <p className="text-sm text-[#4A4A4A] font-body leading-relaxed">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GIVEAWAY PROMO ─── */}
      <section className="py-20 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3B2F2A 0%, #5a3e38 60%, #3B2F2A 100%)" }}>
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background: "#CFA7A0", transform: "translate(35%, -35%)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 pointer-events-none" style={{ background: "#D8C6B6", transform: "translate(-35%, 35%)" }} />

        <div className="container relative z-10">
          <FadeUp>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left: copy */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: "rgba(207,167,160,0.2)", border: "1px solid rgba(207,167,160,0.4)" }}>
                    <span className="text-sm font-medium" style={{ color: "#CFA7A0", letterSpacing: "0.05em" }}>🎁 Monthly Giveaway</span>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl mb-5 leading-tight" style={{ color: "#F7F3EE" }}>
                    Win a<br /><em style={{ color: "#CFA7A0" }}>Free Wax!</em>
                  </h2>
                  <p className="font-body text-lg leading-relaxed mb-4" style={{ color: "#D8C6B6" }}>
                    Every month we give away a complimentary waxing service — a $25–$80 value — to one lucky winner drawn from all confirmed entries.
                  </p>
                  <p className="font-body text-sm mb-8" style={{ color: "#A8B3AA" }}>
                    Enter once and stay in the drawing every month. No purchase necessary. One winner per month, notified by email.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/win-a-free-wax">
                      <span className="btn-rose cursor-pointer">Enter the Giveaway</span>
                    </Link>
                    <Link href="/win-a-free-wax">
                      <span className="font-body text-sm font-semibold cursor-pointer flex items-center gap-1" style={{ color: "#CFA7A0" }}>
                        Learn more <ArrowRight size={14} />
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Right: steps */}
                <div className="space-y-4">
                  {[
                    { step: "01", title: "Enter Your Info", desc: "Just your name and email — takes 30 seconds." },
                    { step: "02", title: "Confirm Your Email", desc: "Click the link we send you to lock in your entry." },
                    { step: "03", title: "Monthly Drawing", desc: "One winner randomly selected on the 1st of each month." },
                    { step: "04", title: "Enjoy Your Free Wax!", desc: "Redeem at any of our 6 Utah locations." },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: "rgba(247,243,238,0.06)", border: "1px solid rgba(207,167,160,0.2)" }}>
                      <span className="font-display text-2xl font-bold flex-shrink-0" style={{ color: "#CFA7A0", lineHeight: 1 }}>{item.step}</span>
                      <div>
                        <p className="font-body font-semibold text-sm mb-0.5" style={{ color: "#F7F3EE" }}>{item.title}</p>
                        <p className="font-body text-xs leading-relaxed" style={{ color: "#A8B3AA" }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── FINAL CTA STRIP ─── */}
      <section className="py-16 bg-[#3B2F2A]">
        <div className="container">
          <FadeUp>
            <div className="text-center">
              <p className="section-label text-[#CFA7A0] mb-3">Ready to Book?</p>
              <h2 className="font-display text-4xl md:text-5xl text-white mb-5">
                Your smoothest skin is<br /><em className="text-[#CFA7A0]">one appointment away.</em>
              </h2>
              <p className="text-[#D8C6B6] font-body mb-8 max-w-md mx-auto">
                Book online in minutes. New clients receive 20% off their first service.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose">
                  Book Your Appointment
                </a>
                <Link href="/locations">
                  <span className="btn-outline-ivory cursor-pointer">Find a Location</span>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </Layout>
  );
}
