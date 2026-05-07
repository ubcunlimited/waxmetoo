/*
 * WAX ME TOO — After Care Page
 * Updated per waxdoc.docx:
 *   - "Avoid hot showers and baths" → "Don't swim in Utah Lake" (funny replacement)
 *   - Removed "No heavy exercise"
 *   - Removed "Wear loose clothing" from do list
 *   - Added PFB product note under ingrown hair prevention
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, XCircle, Sparkles } from "lucide-react";
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

const doItems = [
  { title: "Keep the area clean", desc: "Gently cleanse waxed areas with a mild, fragrance-free cleanser. Pat dry — don't rub." },
  { title: "Apply a gentle moisturizer", desc: "Use a fragrance-free, alcohol-free moisturizer to soothe and hydrate the skin. Aloe vera gel is also excellent for calming any redness." },
  { title: "Start exfoliating after 48 hours", desc: "Beginning 48 hours after your wax, gently exfoliate the area 2–3 times per week. This is the most effective way to prevent ingrown hairs." },
  { title: "Moisturize daily", desc: "Daily moisturizing keeps skin soft, reduces irritation, and helps maintain smooth results between appointments." },
  { title: "Book your next appointment", desc: "For best results, schedule your next appointment 4–6 weeks out. Regular waxing leads to finer, sparser regrowth over time." },
];

const dontItems = [
  { title: "Don't swim in Utah Lake", desc: "Seriously — freshly waxed skin and questionable water don't mix. Avoid pools, hot tubs, and any open water for 24–48 hours after your wax." },
  { title: "Skip the sauna and steam room", desc: "Avoid saunas, steam rooms, and hot tubs for at least 48 hours after waxing." },
  { title: "Avoid direct sun exposure", desc: "Keep waxed areas out of direct sunlight for 24–48 hours. Freshly waxed skin is more susceptible to sun damage and hyperpigmentation." },
  { title: "Don't pick or scratch", desc: "If you experience any bumps or ingrown hairs, resist the urge to pick or scratch. This can cause scarring and infection." },
  { title: "Skip retinol and AHAs", desc: "Avoid applying exfoliating skincare products (retinol, AHAs, BHAs) to waxed areas for at least 3–5 days." },
];

export default function AfterCare() {
  useEffect(() => {
    document.title = "After Care Guide — How to Care for Your Skin After Waxing | Wax Me Too";
    let m = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (!m) { m = document.createElement('meta') as HTMLMetaElement; m.name = 'description'; document.head.appendChild(m); }
    m.content = "Protect your freshly waxed skin with Wax Me Too's expert aftercare guide. Learn what to avoid in the 24-48 hours after your wax, how to prevent ingrown hairs, and how to keep skin smooth longer.";
    return () => { document.title = "Wax Me Too — Professional Waxing Studio | Utah"; };
  }, []);

  return (
    <Layout>
      <section className="bg-[#3B2F2A] py-20">
        <div className="container">
          <FadeUp>
            <div className="max-w-xl">
              <p className="section-label text-[#CFA7A0] mb-3">Aftercare Guide</p>
              <h1 className="font-display text-5xl md:text-6xl text-white mb-5">
                After your<br /><em className="text-[#CFA7A0]">appointment</em>
              </h1>
              <p className="text-[#D8C6B6] font-body leading-relaxed">
                Proper aftercare extends your results and keeps your skin smooth, healthy, and ingrown-free. Follow these guidelines for the best possible outcome.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeUp>
              <div>
                <h2 className="font-display text-2xl text-[#3B2F2A] mb-5 flex items-center gap-2">
                  <CheckCircle size={20} className="text-[#CFA7A0]" /> What to do
                </h2>
                <div className="space-y-3">
                  {doItems.map((item) => (
                    <div key={item.title} className="bg-white rounded-lg p-4 shadow-sm">
                      <h3 className="font-body font-600 text-[#3B2F2A] text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-[#4A4A4A] font-body leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={100}>
              <div>
                <h2 className="font-display text-2xl text-[#3B2F2A] mb-5 flex items-center gap-2">
                  <XCircle size={20} className="text-[#A8B3AA]" /> What to avoid
                </h2>
                <div className="space-y-3">
                  {dontItems.map((item) => (
                    <div key={item.title} className="bg-white rounded-lg p-4 shadow-sm border-l-2 border-[#A8B3AA]">
                      <h3 className="font-body font-600 text-[#3B2F2A] text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-[#4A4A4A] font-body leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Ingrown Hair Prevention — with PFB product note */}
          <FadeUp delay={200}>
            <div className="mt-10 max-w-4xl mx-auto bg-[#A8B3AA] rounded-lg p-6">
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3 text-center">Ingrown hair prevention</h2>
              <p className="text-[#3B2F2A]/80 font-body mb-3 max-w-xl mx-auto text-center">
                The most effective way to prevent ingrown hairs is consistent, gentle exfoliation starting 48 hours after your wax. Use a soft exfoliating scrub or mitt 2–3 times per week, and moisturize daily.
              </p>
              <p className="text-[#3B2F2A]/80 font-body text-sm max-w-xl mx-auto text-center mb-5">
                With regular waxing appointments, ingrown hairs typically become much less of an issue over time as hair grows back finer and sparser.
              </p>

              {/* PFB product callout */}
              <div
                className="rounded-xl p-4 flex gap-3 items-start max-w-xl mx-auto"
                style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(59,47,42,0.2)" }}
              >
                <Sparkles size={20} className="shrink-0 mt-0.5 text-[#3B2F2A]" />
                <div>
                  <p className="font-body font-semibold text-[#3B2F2A] text-sm mb-1">
                    Ask about PFB — our favourite ingrown hair treatment
                  </p>
                  <p className="text-xs text-[#3B2F2A]/80 font-body leading-relaxed">
                    After a Brazilian wax, your esthetician will apply PFB directly to your skin. You can also pick up a sample size for just <strong>$3</strong> to take home — it's the easiest thing you can do to keep your skin bump-free between appointments.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={250}>
            <div className="mt-6 max-w-4xl mx-auto text-center">
              <div className="flex flex-wrap justify-center gap-3">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Book Your Next Appointment</a>
                <Link href="/before-care"><span className="btn-outline cursor-pointer">Before Care Guide</span></Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    <MascotEasterEgg
        style={{ bottom: "200px", right: "-22px" }}
        transform="scaleX(-1) rotate(9deg)"
        size={82}
        baseOpacity={0.5}
      />
    </Layout>
  );
}
