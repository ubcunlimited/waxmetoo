/*
 * WAX ME TOO — About Page
 * Design: Modern Feminine Craft
 * Content: Brand story, women-owned, eco-friendly, privacy-first, team values
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, Leaf, Shield, Star, Heart, Users } from "lucide-react";
import Layout from "@/components/Layout";
import { BOOKING_URL, testimonials } from "@/lib/data";
import MascotEasterEgg from "@/components/MascotEasterEgg";

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

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Every service is performed in a private room. Your comfort and dignity are non-negotiable. We've built our entire studio experience around discretion.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "We use premium, eco-conscious wax products that are gentle on your skin and kind to the environment. Sustainability is part of how we do business.",
  },
  {
    icon: Heart,
    title: "Women-Owned",
    description: "Founded and led by women, for women — and everyone. We understand the experience from the inside out, and we've built a studio that reflects that.",
  },
  {
    icon: Star,
    title: "Expert Craft",
    description: "Every esthetician on our team is fully licensed and continuously trained. Waxing is a skill, and we take it seriously.",
  },
  {
    icon: CheckCircle,
    title: "Strict Sanitation",
    description: "No double-dipping. Ever. Fresh applicators for every client, fully sanitized rooms between every appointment. This is our baseline standard.",
  },
  {
    icon: Users,
    title: "Community Roots",
    description: "We're a Utah business, built by and for our community. We're proud to serve clients across the state and to be a trusted part of their self-care routines.",
  },
];

const stats = [
  { number: "2007", label: "Year Founded" },
  { number: "4+", label: "Utah Locations" },
  { number: "500+", label: "5-Star Reviews" },
  { number: "17+", label: "Years of Excellence" },
];

export default function About() {
  useEffect(() => {
    document.title = "About Wax Me Too — Utah's First Waxing-Only Studio Since 2007";
    let m = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (!m) { m = document.createElement('meta') as HTMLMetaElement; m.name = 'description'; document.head.appendChild(m); }
    m.content = "Learn the story behind Wax Me Too — Utah's first waxing-only salon, founded in 2007 by two best friends. Women-owned, locally operated, and committed to professional waxing excellence across 6 Utah locations.";
    return () => { document.title = "Wax Me Too — Professional Waxing Studio | Utah"; };
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/manus-storage/about-hero_3c8ee818.jpg)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B2F2A]/85 to-[#3B2F2A]/40" />
        <div className="container relative z-10 py-24">
          <FadeUp>
            <div className="max-w-xl">
              <p className="section-label text-[#CFA7A0] mb-3">Our Story</p>
              <h1 className="font-display text-5xl md:text-6xl text-white leading-tight mb-5">
                Built on trust.<br /><em className="text-[#CFA7A0]">Since 2007.</em>
              </h1>
              <p className="text-[#D8C6B6] font-body text-lg leading-relaxed">
                Wax Me Too is a women-owned professional waxing studio with a simple mission: make every client feel comfortable, respected, and genuinely cared for.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-[#CFA7A0] py-8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <FadeUp key={stat.label} delay={i * 80}>
                <div>
                  <p className="font-display text-4xl text-[#3B2F2A]">{stat.number}</p>
                  <p className="text-xs font-body font-600 text-[#3B2F2A]/70 uppercase tracking-wide mt-1">{stat.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Story */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <FadeUp>
              <div>
                <p className="section-label mb-3">The Wax Me Too Story</p>
                <h2 className="font-display text-4xl md:text-5xl text-[#3B2F2A] mb-6">
                  Where It All Began
                </h2>
                <div className="space-y-4 text-[#4A4A4A] font-body leading-relaxed">
                  <p>
                    Wax Me Too was founded in 2007 with one big idea: waxing didn't need to feel cold, clinical, or awkward. We wanted to be the best at one thing — waxing — and we wanted to do it differently.
                  </p>
                  <p>
                    At the time, most waxing happened quietly inside traditional day spas, with whispered voices, spa music, and candles flickering in the corner while clients nervously stared at the ceiling wondering what they'd gotten themselves into. We thought there had to be a better way.
                  </p>
                  <p>
                    So we created something different. We laughed with our clients. We talked them through every step. We built an environment that felt warm, relaxed, and human — because distraction, conversation, and comfort make a huge difference when someone is trusting you with a very personal service.
                  </p>
                  <p>
                    Wax Me Too became Utah's first waxing-only salon, founded by women who actually understood the experience from the client's side of the waxing table. Long before waxing chains and corporate-owned salons entered the industry, we were building a business centered around comfort, professionalism, privacy, and genuinely great estheticians.
                  </p>
                  <p>
                    Nineteen years later, that philosophy still drives everything we do. We've grown to multiple locations across Utah, but we've never lost the personality and warmth that made clients fall in love with Wax Me Too in the first place. We're still women-owned. Still client-focused. Still passionate about creating expert waxing experiences with zero judgment, plenty of laughter, and estheticians who know exactly how to make clients feel comfortable from the moment they walk through the door.
                  </p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={150}>
              <div className="relative">
                <img
                  src="/manus-storage/about-hero_3c8ee818.jpg"
                  alt="Wax Me Too studio interior"
                  className="w-full rounded-lg object-cover aspect-[4/5]"
                />
                <div className="absolute -bottom-5 -left-5 bg-[#3B2F2A] rounded-lg p-5 shadow-lg hidden md:block">
                  <p className="font-display text-2xl text-[#CFA7A0] italic">"Comfort, privacy,<br />and results."</p>
                  <p className="text-xs font-body text-[#D8C6B6] mt-2">Our founding promise</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="section-label mb-3">What We Stand For</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#3B2F2A]">
                Our values
              </h2>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((value, i) => (
              <FadeUp key={value.title} delay={i * 70}>
                <div className="bg-[#F7F3EE] rounded-lg p-6">
                  <div className="w-10 h-10 rounded-full bg-[#CFA7A0]/15 flex items-center justify-center mb-4">
                    <value.icon size={20} className="text-[#CFA7A0]" />
                  </div>
                  <h3 className="font-display text-xl text-[#3B2F2A] mb-2">{value.title}</h3>
                  <p className="text-sm text-[#4A4A4A] font-body leading-relaxed">{value.description}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Promise */}
      <section className="py-16 bg-[#3B2F2A]">
        <div className="container">
          <FadeUp>
            <div className="max-w-2xl mx-auto text-center">
              <p className="section-label text-[#CFA7A0] mb-3">Our Promise</p>
              <h2 className="font-display text-4xl text-white mb-5">
                The Wax Me Too Standard
              </h2>
              <p className="text-[#D8C6B6] font-body leading-relaxed mb-4">
                Clean rooms. Great estheticians. Zero judgment. Energetic music optional.
              </p>
              <p className="text-[#D8C6B6] font-body leading-relaxed mb-4">
                From the moment you walk in, our goal is simple: make you feel comfortable and cared for.
              </p>
              <p className="text-[#D8C6B6] font-body leading-relaxed mb-8">
                We don't rush services, cut corners on sanitation, or believe waxing needs to feel awkward and clinical. We believe it should feel warm, professional, and human. That's been the Wax Me Too standard since 2007.
              </p>
              <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose">
                Book Your Appointment
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-10">
              <p className="section-label mb-3">Client Stories</p>
              <h2 className="font-display text-4xl text-[#3B2F2A]">What our clients say</h2>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.slice(3, 6).map((t, i) => (
              <FadeUp key={t.id} delay={i * 80}>
                <div className="card-testimonial">
                  <div className="flex mb-3">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} className="w-4 h-4 fill-[#CFA7A0]" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                    ))}
                  </div>
                  <p className="text-sm text-[#4A4A4A] font-body leading-relaxed mb-4 italic">"{t.text}"</p>
                  <p className="text-xs font-600 text-[#3B2F2A] font-body">{t.name}</p>
                  <p className="text-xs text-[#CFA7A0] font-body mt-0.5">{t.service} · {t.location}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    <MascotEasterEgg pageId="about" />
    </Layout>
  );
}
