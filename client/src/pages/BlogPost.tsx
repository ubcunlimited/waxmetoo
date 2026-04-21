/*
 * WAX ME TOO — Blog Post Detail Page
 * Design: Modern Feminine Craft
 */

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { blogPosts, BOOKING_URL } from "@/lib/data";

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

// Sample article content generator
function getArticleContent(post: typeof blogPosts[0]) {
  return `
    <p>${post.excerpt}</p>
    <h2>The key things you need to know</h2>
    <p>Professional waxing is one of the most effective methods of hair removal available today. Unlike shaving, which cuts hair at the surface, waxing removes hair from the root — resulting in smoother skin that lasts significantly longer.</p>
    <p>At Wax Me Too, we've been helping clients achieve their best results since 2007. Over the years, we've refined our techniques, upgraded our products, and deepened our understanding of what makes for an exceptional waxing experience.</p>
    <h2>What our estheticians recommend</h2>
    <p>Our licensed estheticians have a few key recommendations that make a real difference in your results:</p>
    <ul>
      <li><strong>Consistency is everything.</strong> Regular waxing appointments — every 4–6 weeks — lead to finer, sparser regrowth over time. The longer you maintain a consistent schedule, the easier and more comfortable each appointment becomes.</li>
      <li><strong>Exfoliation is your best friend.</strong> Gentle exfoliation 2–3 times per week (starting 48 hours after your wax) is the single most effective way to prevent ingrown hairs and keep skin smooth between appointments.</li>
      <li><strong>Moisturize daily.</strong> Well-hydrated skin waxes more cleanly and recovers faster. Use a fragrance-free moisturizer on waxed areas every day.</li>
    </ul>
    <h2>Common questions we hear</h2>
    <p>After thousands of appointments, we've heard every question imaginable. The most common ones usually come down to preparation, pain management, and aftercare — all of which are covered in detail in our First Visit guide and FAQ center.</p>
    <p>The short answer to most concerns: it gets easier. The first appointment is almost always the most intense, and regular clients often tell us they barely notice the sensation at all after a few visits.</p>
    <h2>Ready to experience the difference?</h2>
    <p>Whether you're a first-timer or a returning client, we're here to make your experience exceptional. Book your appointment online and receive 20% off your first service as a new client.</p>
  `;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find(p => p.slug === slug);
  const related = blogPosts.filter(p => p.slug !== slug).slice(0, 3);

  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-4xl text-[#3B2F2A] mb-4">Article not found</h1>
          <Link href="/blog"><span className="btn-primary cursor-pointer">Back to Journal</span></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#3B2F2A] py-12">
        <div className="container">
          <Link href="/blog">
            <span className="flex items-center gap-2 text-[#D8C6B6] text-sm font-body mb-6 cursor-pointer hover:text-[#CFA7A0] transition-colors">
              <ArrowLeft size={14} /> Back to Journal
            </span>
          </Link>
          <FadeUp>
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-body font-600 text-[#CFA7A0] uppercase tracking-wide">{post.category}</span>
                <span className="text-[#D8C6B6]">·</span>
                <span className="text-xs text-[#D8C6B6] font-body flex items-center gap-1">
                  <Clock size={11} /> {post.readTime}
                </span>
                <span className="text-[#D8C6B6]">·</span>
                <span className="text-xs text-[#D8C6B6] font-body">{post.date}</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-white leading-tight">{post.title}</h1>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Article */}
      <section className="py-16 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Content */}
            <div className="lg:col-span-2">
              <FadeUp>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full rounded-lg object-cover aspect-[16/9] mb-8"
                />
                <div
                  className="prose prose-lg max-w-none"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#4A4A4A",
                    lineHeight: "1.8",
                  }}
                  dangerouslySetInnerHTML={{ __html: getArticleContent(post) }}
                />
              </FadeUp>

              {/* CTA in article */}
              <FadeUp delay={100}>
                <div className="mt-10 bg-[#CFA7A0] rounded-lg p-6">
                  <h3 className="font-display text-2xl text-[#3B2F2A] mb-2">Ready to book?</h3>
                  <p className="text-[#3B2F2A]/80 font-body text-sm mb-4">New clients receive 20% off their first service.</p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Book Your Appointment
                  </a>
                </div>
              </FadeUp>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <FadeUp>
                <div className="bg-white rounded-lg p-5 shadow-sm border-t-4 border-[#CFA7A0]">
                  <h3 className="font-display text-xl text-[#3B2F2A] mb-4">Quick Links</h3>
                  <ul className="space-y-2">
                    {[
                      { label: "First Visit Guide", href: "/first-visit" },
                      { label: "Before Care", href: "/before-care" },
                      { label: "After Care", href: "/after-care" },
                      { label: "FAQ Center", href: "/faq" },
                      { label: "Services & Pricing", href: "/services" },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>
                          <span className="text-sm font-body text-[#4A4A4A] hover:text-[#CFA7A0] transition-colors cursor-pointer flex items-center gap-1">
                            <ArrowRight size={12} /> {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>

              <FadeUp delay={100}>
                <div className="bg-[#3B2F2A] rounded-lg p-5">
                  <p className="text-xs font-body font-600 text-[#CFA7A0] uppercase tracking-wide mb-2">New Client Special</p>
                  <p className="font-display text-xl text-white mb-2">20% off your first service</p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose text-sm py-2.5 w-full text-center block mt-3">
                    Book Now
                  </a>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-14 bg-white">
        <div className="container">
          <FadeUp>
            <h2 className="font-display text-3xl text-[#3B2F2A] mb-8">More from the Journal</h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p, i) => (
              <FadeUp key={p.id} delay={i * 70}>
                <Link href={`/blog/${p.slug}`}>
                  <div className="blog-card cursor-pointer">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-body font-600 text-[#CFA7A0] uppercase tracking-wide">{p.category}</span>
                      <h3 className="font-display text-lg text-[#3B2F2A] mt-1 leading-snug">{p.title}</h3>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
