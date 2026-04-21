import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, XCircle } from "lucide-react";
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

const doItems = [
  { title: "Keep the area clean", desc: "Gently cleanse waxed areas with a mild, fragrance-free cleanser. Pat dry — don't rub." },
  { title: "Apply a gentle moisturizer", desc: "Use a fragrance-free, alcohol-free moisturizer to soothe and hydrate the skin. Aloe vera gel is also excellent for calming any redness." },
  { title: "Wear loose clothing", desc: "For the first 24 hours, wear loose, breathable clothing over waxed areas to minimize friction and allow skin to breathe." },
  { title: "Start exfoliating after 48 hours", desc: "Beginning 48 hours after your wax, gently exfoliate the area 2–3 times per week. This is the most effective way to prevent ingrown hairs." },
  { title: "Moisturize daily", desc: "Daily moisturizing keeps skin soft, reduces irritation, and helps maintain smooth results between appointments." },
  { title: "Book your next appointment", desc: "For best results, schedule your next appointment 4–6 weeks out. Regular waxing leads to finer, sparser regrowth over time." },
];

const dontItems = [
  { title: "Avoid hot showers and baths", desc: "For the first 24–48 hours, stick to lukewarm water. Hot water can irritate freshly waxed skin and open pores." },
  { title: "Skip the sauna and steam room", desc: "Avoid saunas, steam rooms, and hot tubs for at least 48 hours after waxing." },
  { title: "No heavy exercise", desc: "Avoid workouts that cause heavy sweating for 24 hours. Sweat can irritate open follicles and increase the risk of breakouts." },
  { title: "Avoid direct sun exposure", desc: "Keep waxed areas out of direct sunlight for 24–48 hours. Freshly waxed skin is more susceptible to sun damage and hyperpigmentation." },
  { title: "Don't pick or scratch", desc: "If you experience any bumps or ingrown hairs, resist the urge to pick or scratch. This can cause scarring and infection." },
  { title: "Skip retinol and AHAs", desc: "Avoid applying exfoliating skincare products (retinol, AHAs, BHAs) to waxed areas for at least 3–5 days." },
];

export default function AfterCare() {
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
                  {doItems.map((item, i) => (
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

          <FadeUp delay={200}>
            <div className="mt-10 max-w-4xl mx-auto bg-[#A8B3AA] rounded-lg p-6 text-center">
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">Ingrown hair prevention</h2>
              <p className="text-[#3B2F2A]/80 font-body mb-2 max-w-xl mx-auto">
                The most effective way to prevent ingrown hairs is consistent, gentle exfoliation starting 48 hours after your wax. Use a soft exfoliating scrub or mitt 2–3 times per week, and moisturize daily.
              </p>
              <p className="text-[#3B2F2A]/80 font-body text-sm max-w-xl mx-auto">
                With regular waxing appointments, ingrown hairs typically become much less of an issue over time as hair grows back finer and sparser.
              </p>
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
    </Layout>
  );
}
