import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { CheckCircle } from "lucide-react";
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

const beforeCareItems = [
  { title: "Let hair grow to ¼ inch", desc: "This is approximately 3–4 weeks of growth after shaving. Hair that is too short won't grip properly; hair that is too long may be trimmed before waxing." },
  { title: "Exfoliate 24–48 hours before", desc: "Gentle exfoliation removes dead skin cells and helps the wax grip hair more effectively. Use a soft scrub or exfoliating mitt — nothing too abrasive." },
  { title: "Skip lotion on appointment day", desc: "Avoid applying lotion, oils, or body butter to the area on the day of your appointment. These create a barrier that can interfere with wax adhesion." },
  { title: "Wear loose, comfortable clothing", desc: "Especially for bikini, Brazilian, and leg services. Tight clothing can cause friction and irritation on freshly waxed skin." },
  { title: "Consider ibuprofen beforehand", desc: "If you're concerned about discomfort, take an over-the-counter pain reliever like ibuprofen 30–45 minutes before your appointment." },
  { title: "Avoid caffeine on appointment day", desc: "Caffeine can heighten skin sensitivity. Skipping your morning coffee may make your experience more comfortable." },
  { title: "Stay hydrated", desc: "Well-hydrated skin waxes more cleanly. Drink plenty of water in the days leading up to your appointment." },
  { title: "Avoid sun exposure", desc: "Avoid sunbathing, tanning beds, or prolonged sun exposure on the areas to be waxed for at least 24 hours before your appointment." },
  { title: "Skip retinol and AHAs", desc: "If you use retinol, AHAs, or other exfoliating skincare products, avoid applying them to the wax area for 3–5 days before your appointment." },
  { title: "Schedule wisely", desc: "If possible, avoid scheduling bikini or Brazilian services during your menstrual cycle, as skin sensitivity is heightened during this time." },
];

export default function BeforeCare() {
  useEffect(() => {
    document.title = "Before Care Guide — How to Prepare for Your Wax | Wax Me Too";
    let m = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (!m) { m = document.createElement('meta') as HTMLMetaElement; m.name = 'description'; document.head.appendChild(m); }
    m.content = "Get the best possible waxing results by following Wax Me Too's before-care guide. Learn what to do (and avoid) in the days before your appointment for a smoother, more comfortable wax.";
    return () => { document.title = "Wax Me Too — Professional Waxing Studio | Utah"; };
  }, []);

  return (
    <Layout>
      <section className="bg-[#3B2F2A] py-20">
        <div className="container">
          <FadeUp>
            <div className="max-w-xl">
              <p className="section-label text-[#CFA7A0] mb-3">Preparation Guide</p>
              <h1 className="font-display text-5xl md:text-6xl text-white mb-5">
                Before your<br /><em className="text-[#CFA7A0]">appointment</em>
              </h1>
              <p className="text-[#D8C6B6] font-body leading-relaxed">
                A little preparation goes a long way. Follow these guidelines to ensure the best possible results from your waxing service.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 bg-[#F7F3EE]">
        <div className="container max-w-3xl mx-auto">
          <div className="space-y-4">
            {beforeCareItems.map((item, i) => (
              <FadeUp key={item.title} delay={i * 50}>
                <div className="bg-white rounded-lg p-5 shadow-sm flex gap-4">
                  <CheckCircle size={20} className="text-[#CFA7A0] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-body font-600 text-[#3B2F2A] mb-1">{item.title}</h3>
                    <p className="text-sm text-[#4A4A4A] font-body leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={200}>
            <div className="mt-10 bg-[#CFA7A0] rounded-lg p-6 text-center">
              <h2 className="font-display text-2xl text-[#3B2F2A] mb-3">Ready to book?</h2>
              <p className="text-[#3B2F2A]/80 font-body text-sm mb-4">New clients receive 20% off their first service.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">Book Now</a>
                <Link href="/after-care"><span className="btn-outline cursor-pointer">After Care Guide</span></Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </Layout>
  );
}
