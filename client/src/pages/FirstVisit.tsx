/*
 * WAX ME TOO — First Visit Page
 * Design: Modern Feminine Craft
 * Purpose: Reduce hesitation, increase first-time conversions
 * Updated per waxdoc.docx: copy edits, step rewrites, Accutane/AHA/retinol callout,
 *   removed period/caffeine/exercise/loose-clothing references, added PFB note,
 *   added military/student discount callout.
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, Shield, Leaf, Star, Clock, Heart, Droplets, AlertTriangle, BadgePercent } from "lucide-react";
import Layout from "@/components/Layout";
import { BOOKING_URL } from "@/lib/data";
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

// Steps updated per waxdoc.docx:
// - Step 02: "3–4 weeks" → "10 days"
// - Step 03: rewritten to Mangomint app / text check-in
// - Step 04 ("Meet your esthetician"): DELETED
// - Step 05 ("Your service"): rewritten for treatment room / privacy
const steps = [
  {
    number: "01",
    title: "Book your appointment",
    description: "Choose your location, service, and preferred time online. It takes less than 2 minutes. New clients receive 20% off their first service.",
  },
  {
    number: "02",
    title: "Prepare at home",
    description: "Let hair grow to at least ¼ inch (10 days from shaving). Gently exfoliate 24 hours before. Avoid lotion on the day of your appointment.",
  },
  {
    number: "03",
    title: "Arrive & check in",
    description: "Arrive and check in via the Mangomint app — or check in via the text message you received. Have a seat and your waxer will be with you as soon as she can.",
  },
  {
    number: "04",
    title: "Your service",
    description: "Welcome to the treatment room! Your esthetician will guide you through preparation and answer any questions. For intimate services you will have privacy while you get ready.",
  },
  {
    number: "05",
    title: "Aftercare & rebooking",
    description: "You'll receive aftercare guidance before you leave. We recommend booking your next appointment before you go to maintain your results.",
  },
];

// Reassurances updated per waxdoc.docx:
// - "Completely private": added laughter/music line
// - "Efficient & respectful": "stay on schedule" → "do our best to stay on time"
// - New "Sinks in every treatment room" card added
const reassurances = [
  {
    icon: Shield,
    title: "Completely private",
    description: "Every service takes place in a private room — just you and your esthetician. Expect some laughter and loud music.",
  },
  {
    icon: Heart,
    title: "Zero judgment",
    description: "Our estheticians are professionals who perform these services every day. There is nothing awkward, embarrassing, or unusual about any of our services.",
  },
  {
    icon: CheckCircle,
    title: "Strict sanitation",
    description: "We use fresh, single-use applicators for every client. No double-dipping. Rooms are fully sanitized between every appointment.",
  },
  {
    icon: Droplets,
    title: "Sinks in every treatment room",
    description: "We believe proper washing up should never happen behind the scenes. Your esthetician will wash her hands in front of you before every service.",
  },
  {
    icon: Star,
    title: "Expert estheticians",
    description: "Every esthetician on our team is fully licensed and trained in professional waxing techniques. You're in skilled hands.",
  },
  {
    icon: Clock,
    title: "Efficient & respectful",
    description: "We respect your time. Services are performed efficiently without rushing, and we will do our best to stay on time.",
  },
  {
    icon: Leaf,
    title: "Eco-friendly products",
    description: "We use premium, eco-conscious wax products that are gentle on skin and kind to the environment.",
  },
];

export default function FirstVisit() {
  useEffect(() => {
    document.title = "First Visit Guide — What to Expect at Wax Me Too | Utah Waxing";
    let m = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (!m) { m = document.createElement('meta') as HTMLMetaElement; m.name = 'description'; document.head.appendChild(m); }
    m.content = "Everything first-time clients need to know before their first waxing appointment at Wax Me Too. What to expect, how to prepare, and what happens during your first Brazilian wax.";
    return () => { document.title = "Wax Me Too — Professional Waxing Studio | Utah"; };
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/manus-storage/first-visit_66b40ffa.jpg)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B2F2A]/85 to-[#3B2F2A]/50" />
        <div className="container relative z-10 py-24">
          <FadeUp>
            <div className="max-w-xl">
              <p className="section-label text-[#CFA7A0] mb-3">New to Waxing?</p>
              <h1 className="font-display text-5xl md:text-6xl text-white leading-tight mb-5">
                Your first visit,<br /><em className="text-[#CFA7A0]">made easy.</em>
              </h1>
              <p className="text-[#D8C6B6] font-body text-lg leading-relaxed mb-4">
                First-time nerves waxing is completely normal, and our estheticians are experienced at making new clients feel at ease. You'll be taken to a private room, given a moment to prepare, and your esthetician will walk you through every step before they begin. Most clients are surprised by how manageable the experience is — especially when they return regularly.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose">
                  Book Your First Appointment
                </a>
                <a href="#what-to-expect" className="btn-outline-ivory">
                  What to Expect
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* New Client Offer Banner */}
      <div className="bg-[#CFA7A0] py-5">
        <div className="container text-center">
          <p className="font-body text-[#3B2F2A] font-500">
            ✦ <strong>New Client Special:</strong> Enjoy 20% off your first service when you book online.{" "}
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="underline font-600">
              Claim your offer →
            </a>
          </p>
        </div>
      </div>

      {/* ── IMPORTANT: Accutane / AHA / Retinol Warning Box ── */}
      <div className="bg-[#FFF8F0] border-l-4 border-[#CFA7A0] py-0">
        <div className="container py-6">
          <div
            className="rounded-xl p-5 flex gap-4 items-start"
            style={{ background: "rgba(207,167,160,0.12)", border: "1.5px solid #CFA7A0" }}
          >
            <AlertTriangle size={24} className="shrink-0 mt-0.5" style={{ color: "#CFA7A0" }} />
            <div>
              <p className="font-display text-lg text-[#3B2F2A] font-semibold mb-1">
                Important: Accutane, AHA &amp; Retinol Users — Please Read
              </p>
              <p className="text-sm text-[#4A4A4A] font-body leading-relaxed">
                <strong>If you are currently taking Accutane (isotretinoin), you cannot receive waxing services.</strong> Accutane thins the skin and waxing can cause serious skin lifting and damage. You must be off Accutane for at least 6 months before waxing.
              </p>
              <p className="text-sm text-[#4A4A4A] font-body leading-relaxed mt-2">
                <strong>If you use AHA (alpha hydroxy acid) or retinol products</strong> — including prescription tretinoin, Retin-A, or over-the-counter retinol serums — you cannot be waxed on areas where those products are applied. These ingredients thin and sensitize the skin, making it prone to tearing during waxing. Please discontinue use on the area for at least 5–7 days before your appointment and let your esthetician know.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reassurance Grid */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-12">
              <p className="section-label mb-3">Why Clients Love Us</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#3B2F2A] mb-4">
                Nothing scary.<br /><em>Nothing embarrassing.</em>
              </h2>
              <p className="text-[#4A4A4A] font-body max-w-xl mx-auto leading-relaxed">
                We hear these concerns from first-timers all the time. Here's why our clients are always glad they came.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reassurances.map((item, i) => (
              <FadeUp key={item.title} delay={i * 70}>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
                    style={{ background: i % 2 === 0 ? "rgba(207,167,160,0.15)" : "rgba(168,179,170,0.15)" }}
                  >
                    <item.icon size={20} style={{ color: i % 2 === 0 ? "#CFA7A0" : "#A8B3AA" }} />
                  </div>
                  <h3 className="font-display text-xl text-[#3B2F2A] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#4A4A4A] font-body leading-relaxed">{item.description}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Step by Step */}
      <section id="what-to-expect" className="py-20 bg-white">
        <div className="container">
          <FadeUp>
            <div className="text-center mb-14">
              <p className="section-label mb-3">The Process</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#3B2F2A]">
                What to expect,<br /><em>step by step</em>
              </h2>
            </div>
          </FadeUp>

          <div className="max-w-3xl mx-auto">
            {steps.map((step, i) => (
              <FadeUp key={step.number} delay={i * 80}>
                <div className="flex gap-6 mb-10 last:mb-0">
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#CFA7A0]/15 border-2 border-[#CFA7A0] flex items-center justify-center">
                      <span className="font-display text-sm text-[#CFA7A0] font-600">{step.number}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px h-10 bg-[#D8C6B6] mx-auto mt-2" />
                    )}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-display text-xl text-[#3B2F2A] mb-2">{step.title}</h3>
                    <p className="text-[#4A4A4A] font-body leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Framing */}
      <section className="py-16 bg-[#D8C6B6]">
        <div className="container">
          <FadeUp>
            <div className="max-w-2xl mx-auto text-center">
              <p className="section-label text-[#3B2F2A] mb-3">About Discomfort</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#3B2F2A] mb-5">
                Let's talk about pain — honestly.
              </h2>
              <p className="text-[#4A4A4A] font-body leading-relaxed mb-4">
                We won't pretend waxing is completely painless. There is a quick, sharp sensation when the wax is removed — but it passes in an instant. Most clients describe it as far more manageable than they expected.
              </p>
              <p className="text-[#4A4A4A] font-body leading-relaxed mb-4">
                Here's the good news: it gets significantly easier with each visit. As you wax regularly, hair grows back finer and sparser, which means less discomfort over time. Many regular clients barely notice it at all.
              </p>
              <p className="text-[#4A4A4A] font-body leading-relaxed font-500">
                Tip: taking ibuprofen 30 minutes before your appointment can help take the edge off.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Before / After care quick lists */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FadeUp>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="font-display text-2xl text-[#3B2F2A] mb-5">Before your appointment</h3>
                <ul className="space-y-3">
                  {[
                    "Let hair grow to at least ¼ inch (10 days from shaving)",
                    "Gently exfoliate the area 24–48 hours before",
                    "Avoid applying lotion or oils on the day of your appointment",
                    "Take ibuprofen 30 minutes before if you're concerned about discomfort",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-body text-[#4A4A4A]">
                      <CheckCircle size={16} className="text-[#CFA7A0] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/before-care">
                    <span className="text-sm font-body font-600 text-[#CFA7A0] hover:text-[#3B2F2A] transition-colors cursor-pointer">
                      Full Before Care Guide →
                    </span>
                  </Link>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={100}>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="font-display text-2xl text-[#3B2F2A] mb-5">After your appointment</h3>
                <ul className="space-y-3">
                  {[
                    "Don't swim in Utah Lake for 24–48 hours (or any hot tub/pool)",
                    "Avoid sun exposure on waxed areas for 24 hours",
                    "Apply a gentle, fragrance-free moisturizer",
                    "After 48 hours: begin gentle exfoliation 2–3 times per week to prevent ingrown hairs",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-body text-[#4A4A4A]">
                      <CheckCircle size={16} className="text-[#A8B3AA] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/after-care">
                    <span className="text-sm font-body font-600 text-[#CFA7A0] hover:text-[#3B2F2A] transition-colors cursor-pointer">
                      Full After Care Guide →
                    </span>
                  </Link>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Military & Student Discount Callout */}
      <section className="py-10 bg-white">
        <div className="container">
          <FadeUp>
            <div
              className="rounded-2xl p-6 flex gap-4 items-start max-w-2xl mx-auto"
              style={{ background: "rgba(168,179,170,0.15)", border: "1.5px solid #A8B3AA" }}
            >
              <BadgePercent size={28} className="shrink-0 mt-0.5" style={{ color: "#A8B3AA" }} />
              <div>
                <p className="font-display text-xl text-[#3B2F2A] font-semibold mb-1">
                  Military &amp; Student Discounts
                </p>
                <p className="text-sm text-[#4A4A4A] font-body leading-relaxed">
                  We proudly offer discounts for active-duty military, veterans, and students. Just mention it when you book or at check-in — we appreciate your service and your studies.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[#3B2F2A]">
        <div className="container">
          <FadeUp>
            <div className="text-center">
              <p className="section-label text-[#CFA7A0] mb-3">Ready to Book?</p>
              <h2 className="font-display text-4xl text-white mb-4">
                Your first visit is waiting.
              </h2>
              <p className="text-[#D8C6B6] font-body mb-8 max-w-md mx-auto">
                New clients receive 20% off their first service. Book online in minutes.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose">
                  Book Your First Appointment
                </a>
                <Link href="/faq">
                  <span className="btn-outline-ivory cursor-pointer">More Questions? See FAQ</span>
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    <MascotEasterEgg
        style={{ bottom: "280px", right: "12px" }}
        size={46}
      transform="rotate(-12deg)"
      />
    </Layout>
  );
}
