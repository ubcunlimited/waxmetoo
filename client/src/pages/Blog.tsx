/*
 * WAX ME TOO — Blog / Journal Index
 * Design: Modern Feminine Craft
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight, Clock } from "lucide-react";
import Layout from "@/components/Layout";
import { blogPosts } from "@/lib/data";

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

const categories = ["All", ...Array.from(new Set(blogPosts.map(p => p.category)))];

export default function Blog() {
  useEffect(() => {
    document.title = "Waxing Tips, News & Guides — The Wax Me Too Journal";
    let m = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (!m) { m = document.createElement('meta') as HTMLMetaElement; m.name = 'description'; document.head.appendChild(m); }
    m.content = "Read the latest waxing tips, how-to guides, studio news, and beauty advice from Wax Me Too — Utah's professional waxing studio since 2007. From Brazilian wax prep to eyebrow design trends.";
    return () => { document.title = "Wax Me Too — Professional Waxing Studio | Utah"; };
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = blogPosts.filter(p => activeCategory === "All" || p.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#3B2F2A] py-20">
        <div className="container">
          <FadeUp>
            <div className="max-w-xl">
              <p className="section-label text-[#CFA7A0] mb-3">Tips & Education</p>
              <h1 className="font-display text-5xl md:text-6xl text-white mb-5">
                The Wax Me Too<br /><em className="text-[#CFA7A0]">Journal</em>
              </h1>
              <p className="text-[#D8C6B6] font-body leading-relaxed">
                Expert waxing tips, prep and aftercare guides, service education, and beauty advice — written by our team of licensed estheticians.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Category Filter */}
      <div className="bg-white border-b border-[#D8C6B6]">
        <div className="container">
          <div className="flex gap-0 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-4 text-sm font-body font-500 whitespace-nowrap border-b-2 transition-all ${
                  activeCategory === cat
                    ? "border-[#CFA7A0] text-[#3B2F2A]"
                    : "border-transparent text-[#4A4A4A] hover:text-[#3B2F2A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <section className="py-16 bg-[#F7F3EE]">
        <div className="container">
          {/* Featured Post */}
          {activeCategory === "All" && (
            <FadeUp>
              <Link href={`/blog/${filtered[0].slug}`}>
                <div className="blog-card cursor-pointer mb-8 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                  <div className="aspect-[16/9] md:aspect-auto overflow-hidden">
                    <img
                      src={filtered[0].image}
                      alt={filtered[0].title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-body font-600 text-[#CFA7A0] uppercase tracking-wide">{filtered[0].category}</span>
                      <span className="text-[#D8C6B6]">·</span>
                      <span className="text-xs text-[#A8B3AA] font-body flex items-center gap-1">
                        <Clock size={11} /> {filtered[0].readTime}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl text-[#3B2F2A] mb-3 leading-snug">{filtered[0].title}</h2>
                    <p className="text-[#4A4A4A] font-body leading-relaxed mb-5">{filtered[0].excerpt}</p>
                    <span className="text-sm font-body font-600 text-[#CFA7A0] flex items-center gap-1 hover:gap-2 transition-all">
                      Read Article <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </FadeUp>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeCategory === "All" ? filtered.slice(1) : filtered).map((post, i) => (
              <FadeUp key={post.id} delay={i * 70}>
                <Link href={`/blog/${post.slug}`}>
                  <div className="blog-card cursor-pointer h-full">
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
                      <h3 className="font-display text-xl text-[#3B2F2A] mb-2 leading-snug">{post.title}</h3>
                      <p className="text-sm text-[#4A4A4A] font-body leading-relaxed">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 bg-[#D8C6B6]">
        <div className="container">
          <FadeUp>
            <div className="max-w-xl mx-auto text-center">
              <p className="section-label text-[#3B2F2A] mb-3">Stay Informed</p>
              <h2 className="font-display text-3xl text-[#3B2F2A] mb-4">Get new articles in your inbox</h2>
              <p className="text-[#4A4A4A] font-body mb-6">Waxing tips, seasonal guides, and exclusive offers — delivered monthly.</p>
              <form className="flex gap-2 max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 rounded text-[#3B2F2A] bg-white placeholder-[#9a7a74] font-body text-sm border-0 outline-none focus:ring-2 focus:ring-[#3B2F2A]"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
              </form>
            </div>
          </FadeUp>
        </div>
      </section>
    </Layout>
  );
}
