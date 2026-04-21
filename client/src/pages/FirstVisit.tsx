/*
 * WAX ME TOO — First Visit Page
 * Design: Modern Feminine Craft
 * Purpose: Reduce hesitation, increase first-time conversions
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, Shield, Leaf, Star, Clock, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import { BOOKING_URL } from "@/lib/data";

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

const steps = [
  {
    number: "01",
    title: "Book your appointment",
    description: "Choose your location, service, and preferred time online. It takes less than 2 minutes. New clients receive 20% off their first service.",
  },
  {
    number: "02",
    title: "Prepare at home",
    description: "Let hair grow to at least ¼ inch (3–4 weeks from shaving). Gently exfoliate 24 hours before. Avoid lotion on the day of your appointment.",
  },
  {
    number: "03",
    title: "Arrive & check in",
    description: "Arrive a few minutes early. You'll be greeted warmly and taken to your private treatment room. No waiting in a crowded lobby.",
  },
  {
    number: "04",
    title: "Meet your esthetician",
    description: "Your esthetician will introduce themselves, ask about your goals, and walk you through the service before beginning. Questions are always welcome.",
  },
  {
    number: "05",
    title: "Your service",
    description: "Relax in your private room. Your esthetician works efficiently and professionally. Most services take 15–45 minutes depending on the area.",
  },
  {
    number: "06",
    title: "Aftercare & rebooking",
    description: "You'll receive aftercare guidance before you leave. We recommend booking your next appointment before you go to maintain your results.",
  },
];

const reassurances = [
  {
    icon: Shield,
    title: "Completely private",
    description: "Every service takes place in a private room. Just you and your esthetician — no open-floor settings, no shared spaces.",
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
    icon: Leaf,
    title: "Eco-friendly products",
    description: "We use premium, eco-conscious wax products that are gentle on skin and kind to the environment.",
  },
  {
    icon: Star,
    title: "Expert estheticians",
    description: "Every esthetician on our team is fully licensed and trained in professional waxing techniques. You're in skilled hands.",
  },
  {
    icon: Clock,
    title: "Efficient & respectful",
    description: "We respect your time. Services are performed efficiently without rushing, and we always stay on schedule.",
  },
];

export default function FirstVisit() {
  useEffect(() => {
    document.title = "First Visit Guide — What to Expect at Wax Me Too | Utah Waxing";
    let m = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (!m) { m = document.createElement('meta') as HTMLMetaElement; m.name = 'description'; document.head.appendChild(m); }
    m.content = "Everything first-time clients need to know before their first waxing appointment at Wax Me Too. What to expect, how to prepare, what to wear, and what happens during your first Brazilian wax.";
    return () => { document.title = "Wax Me Too — Professional Waxing Studio | Utah"; };
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(/manus-storage/first-visit_66b40ffa.jpg)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B2F2A]/85 to-[#3B2F2A]/50" />
        <div className="container relative z-10 py-24">
          <FadeUp>
            <div className="max-w-xl">
              <p className="section-label text-[#CFA7A0] mb-3">New to Waxing?</p>
              <h1 className="font-display text-5xl md:text-6xl text-white leading-tight mb-5">
                Your first visit,<br /><em className="text-[#CFA7A0]">made easy.</em>
              </h1>
              <p className="text-[#D8C6B6] font-body text-lg leading-relaxed mb-8">
                We know first-time waxing can feel intimidating. This guide covers everything you need to know — from preparation to aftercare — so you can walk in feeling confident.
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
                  <div className="w-10 h-10 rounded-full bg-[#CFA7A0]/15 flex items-center justify-center mb-4">
                    <item.icon size={20} className="text-[#CFA7A0]" />
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
                Tips to minimize discomfort: take ibuprofen 30 minutes before, avoid caffeine on the day of your appointment, and breathe steadily during the service.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* What to Wear / Prepare */}
      <section className="py-20 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FadeUp>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <h3 className="font-display text-2xl text-[#3B2F2A] mb-5">Before your appointment</h3>
                <ul className="space-y-3">
                  {[
                    "Let hair grow to at least ¼ inch (3–4 weeks from shaving)",
                    "Gently exfoliate the area 24–48 hours before",
                    "Avoid applying lotion or oils on the day of your appointment",
                    "Wear loose, comfortable clothing — especially for bikini/leg services",
                    "Take ibuprofen 30 minutes before if you're concerned about discomfort",
                    "Avoid scheduling during your menstrual cycle if possible (increased sensitivity)",
                    "Stay hydrated and avoid caffeine on the day of your appointment",
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
                    "Avoid hot showers, saunas, and steam rooms for 24–48 hours",
                    "Skip tight clothing for 24 hours to prevent irritation",
                    "Avoid sun exposure on waxed areas for 24 hours",
                    "Hold off on exercise that causes heavy sweating for 24 hours",
                    "Apply a gentle, fragrance-free moisturizer",
                    "After 48 hours: begin gentle exfoliation 2–3 times per week",
                    "Exfoliate regularly to prevent ingrown hairs",
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
    </Layout>
  );
}
