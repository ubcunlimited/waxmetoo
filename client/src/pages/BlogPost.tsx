import FadeUp from "@/components/FadeUp";
/**
 * WAX ME TOO — Blog Post Detail Page
 * Design: Modern Feminine Craft
 * Real blog content pulled from waxmetoo.blogspot.com and SEO-optimized
 */

import { useEffect, useRef, useState, useMemo } from "react";
import { Link, useParams, useLocation } from "wouter";
import { ArrowLeft, Clock, Hash, Calendar, Check, Copy, ArrowRight, ExternalLink, ChevronDown, ChevronRight, BookOpen, Tag } from "lucide-react";
import Layout from "@/components/Layout";
import { blogPosts, BOOKING_URL } from "@/lib/data";
import MascotEasterEgg from "@/components/MascotEasterEgg";
import { useBreadcrumbSchema } from "@/hooks/useBreadcrumbSchema";

// SEO helper — sets document title and meta description dynamically
function useSEO(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} | Wax Me Too`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
    return () => {
      document.title = 'Wax Me Too — Professional Waxing Studio | Utah';
    };
  }, [title, description]);
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-semibold border transition-all duration-200 ${
        copied
          ? 'bg-[#A8B3AA] border-[#A8B3AA] text-white'
          : 'bg-white border-[#D8C6B6] text-[#4A4A4A] hover:bg-[#F7F3EE] hover:border-[#CFA7A0]'
      }`}
      aria-label="Copy link"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? 'Copied!' : 'Copy Link'}
    </button>
  );
}


export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const post = blogPosts.find(p => p.slug === slug);
  const postTags: string[] = (post as any)?.tags ?? [];
  const [articleContent, setArticleContent] = useState<string>('');
  useEffect(() => {
    if (!slug) return;
    setArticleContent('');
    import(`./blog-content/${slug}.ts`)
      .then((m: { default: string }) => setArticleContent(m.default))
      .catch(() => setArticleContent('<p>Article content coming soon.</p>'));
  }, [slug]);

  // Blog archive: group all posts by year → month
  const archiveTree = useMemo(() => {
    const tree: Record<number, Record<number, typeof blogPosts>> = {};
    blogPosts.forEach(p => {
      const d = new Date(p.date);
      const y = d.getFullYear();
      const m = d.getMonth();
      if (!tree[y]) tree[y] = {};
      if (!tree[y][m]) tree[y][m] = [];
      tree[y][m].push(p);
    });
    return tree;
  }, []);

  const sortedYears = useMemo(() => Object.keys(archiveTree).map(Number).sort((a, b) => b - a), [archiveTree]);
  const [expandedYears, setExpandedYears] = useState<Set<number>>(() => {
    const currentYear = new Date().getFullYear();
    return new Set([currentYear, currentYear - 1]);
  });

  const toggleYear = (year: number) => {
    setExpandedYears(prev => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const recentPosts = blogPosts.filter(p => p.slug !== slug).slice(0, 4);

  // Tag-based related posts: score by shared tags, fall back to category
  const scoredPosts = blogPosts
    .filter(p => p.slug !== slug)
    .map(p => {
      const pTags: string[] = (p as any).tags ?? [];
      const sharedTags = postTags.filter(t => pTags.includes(t)).length;
      const sameCategory = p.category === post?.category ? 1 : 0;
      return { post: p, score: sharedTags * 2 + sameCategory };
    })
    .sort((a, b) => b.score - a.score);
  const related = scoredPosts.slice(0, 3).map(r => r.post);
  // Full-width bottom section: top 4 related posts
  const relatedFull = scoredPosts.slice(0, 4).map(r => r.post);

  // Dynamic SEO meta
  useSEO(
    post?.title ?? 'Blog',
    post?.excerpt ?? 'Read the latest waxing tips, news, and guides from Wax Me Too — Utah\'s professional waxing studio since 2007.'
  );

  useBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Journal", url: "/blog" },
    { name: post?.title ?? "Article", url: `/blog/${slug}` },
  ]);

  if (!post) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="font-display text-4xl text-[#3B2F2A] mb-4">Article not found</h2>
          <Link href="/blog"><span className="btn-primary cursor-pointer">Back to Journal</span></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero — full-width image with gradient overlay */}
      <section className="relative overflow-hidden" style={{ minHeight: '380px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${post.image})` }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(59,47,42,0.92) 0%, rgba(59,47,42,0.75) 55%, rgba(59,47,42,0.35) 100%)' }} />
        <div className="relative container py-14 md:py-20">
          <Link href="/blog">
            <span className="inline-flex items-center gap-2 text-[#D8C6B6] text-sm font-body mb-8 cursor-pointer hover:text-[#CFA7A0] transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Journal
            </span>
          </Link>
          <FadeUp>
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs font-body font-semibold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: "rgba(168,179,170,0.2)", border: "1px solid rgba(168,179,170,0.4)", color: "#A8B3AA" }}>{post.category}</span>
                <span className="flex items-center gap-1 text-xs text-[#D8C6B6] font-body">
                  <Clock size={11} /> {post.readTime}
                </span>
                <span className="flex items-center gap-1 text-xs text-[#D8C6B6] font-body">
                  <Calendar size={11} /> {post.date}
                </span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl text-white leading-tight mb-4">{post.title}</h1>
              <p className="text-[#D8C6B6] font-body text-base leading-relaxed max-w-xl">{post.excerpt}</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Article */}
      <section className="py-14 bg-[#F7F3EE]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Content */}
            <div className="lg:col-span-2">
              <FadeUp>
                {/* Article body */}
                <div
                  className="prose prose-lg max-w-none"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "#4A4A4A",
                    lineHeight: "1.9",
                    fontSize: "1.0625rem",
                  }}
                  dangerouslySetInnerHTML={{ __html: articleContent }}
                />
              </FadeUp>

              {/* Tags section */}
              {postTags.length > 0 && (
                <FadeUp delay={80}>
                  <div className="mt-10 pt-8 border-t border-[#D8C6B6]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 text-xs font-body font-semibold text-[#A8B3AA] uppercase tracking-widest mr-1">
                        <Hash size={13} /> Tags
                      </span>
                      {postTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => navigate(`/blog?tag=${encodeURIComponent(tag)}`)}
                          className="text-xs px-3 py-1.5 rounded-full border border-[#D8C6B6] bg-white text-[#4A4A4A] hover:bg-[#CFA7A0] hover:border-[#CFA7A0] hover:text-white transition-all duration-200 font-body cursor-pointer"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              )}

              {/* Social Share */}
              <FadeUp delay={90}>
                <div className="mt-8 pt-6 border-t border-[#D8C6B6]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-body font-semibold text-[#A8B3AA] uppercase tracking-widest">Share this post</span>
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-semibold bg-[#1877F2] text-white hover:bg-[#1565d8] transition-colors"
                      aria-label="Share on Facebook"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                    {/* Pinterest */}
                    <a
                      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&media=${encodeURIComponent(post.image)}&description=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-semibold bg-[#E60023] text-white hover:bg-[#c0001d] transition-colors"
                      aria-label="Pin on Pinterest"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                      Pinterest
                    </a>
                    {/* X / Twitter */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-body font-semibold bg-[#000000] text-white hover:bg-[#333] transition-colors"
                      aria-label="Share on X"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      X
                    </a>
                    {/* Copy Link */}
                    <CopyLinkButton />
                  </div>
                </div>
              </FadeUp>

              {/* CTA in article */}
              <FadeUp delay={100}>
                <div className="mt-10 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #3B2F2A 0%, #5a4540 100%)' }}>
                  <div className="p-8 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                      <p className="text-xs font-body font-semibold uppercase tracking-widest mb-2" style={{ color: "#A8B3AA" }}>New Client Special</p>
                      <h3 className="font-display text-2xl text-white mb-2">Ready to get smooth?</h3>
                      <p className="text-[#D8C6B6] font-body text-sm">First time at Wax Me Too? Get your Brazilian wax for $50 at any of our 6 Utah locations.</p>
                    </div>
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose whitespace-nowrap shrink-0">
                      Book Your Appointment
                    </a>
                  </div>
                </div>
              </FadeUp>

              {/* Tag-based Related Posts */}
              {related.length > 0 && (
                <FadeUp delay={120}>
                  <div className="mt-14">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px flex-1 bg-[#D8C6B6]" />
                      <h2 className="font-display text-2xl text-[#3B2F2A] whitespace-nowrap">You Might Also Like</h2>
                      <div className="h-px flex-1 bg-[#D8C6B6]" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {related.map((p, i) => (
                        <FadeUp key={p.id} delay={i * 60}>
                          <Link href={`/blog/${p.slug}`}>
                            <div className="group cursor-pointer rounded-xl overflow-hidden border border-[#D8C6B6] bg-white hover:shadow-md transition-shadow duration-300">
                              <div className="aspect-[4/3] overflow-hidden">
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              <div className="p-4">
                                <span className="text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "#A8B3AA" }}>{p.category}</span>
                                <h3 className="font-display text-base text-[#3B2F2A] mt-1 leading-snug group-hover:text-[#A8B3AA] transition-colors line-clamp-2">{p.title}</h3>
                                <p className="text-xs text-[#A8B3AA] font-body mt-2 flex items-center gap-1">
                                  <Clock size={10} /> {p.readTime}
                                </p>
                                {/* Show shared tags */}
                                {(() => {
                                  const pTags: string[] = (p as any).tags ?? [];
                                  const shared = postTags.filter(t => pTags.includes(t)).slice(0, 2);
                                  return shared.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {shared.map(t => (
                                        <span key={t} className="text-xs bg-[#F7F3EE] text-[#A8B3AA] px-2 py-0.5 rounded-full">#{t}</span>
                                      ))}
                                    </div>
                                  ) : null;
                                })()}
                              </div>
                            </div>
                          </Link>
                        </FadeUp>
                      ))}
                    </div>
                  </div>
                </FadeUp>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-28 space-y-5" style={{ maxHeight: 'calc(100vh - 7rem)', overflowY: 'auto', paddingRight: '4px' }}>

              {/* Book Now CTA */}
              <FadeUp>
                <div className="bg-[#3B2F2A] rounded-xl p-5">
                  <p className="text-xs font-body font-semibold uppercase tracking-wide mb-2" style={{ color: "#A8B3AA" }}>New Client Special</p>
                  <p className="font-display text-xl text-white mb-1">Brazilian wax for $50 — first visit only</p>
                  <p className="text-xs text-[#D8C6B6] font-body mb-3">6 Utah locations. Book online in minutes.</p>
                  <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn-rose text-sm py-2.5 w-full text-center block">
                    Book Now
                  </a>
                </div>
              </FadeUp>

              {/* Related Service */}
              {(post as any).relatedService && (
                <FadeUp delay={60}>
                  <div className="bg-[#F7F3EE] rounded-xl p-4 border border-[#D8C6B6]">
                    <p className="text-xs font-body font-semibold text-[#A8B3AA] uppercase tracking-wide mb-2 flex items-center gap-1"><Tag size={11} /> Related Service</p>
                    <Link href={(post as any).relatedService}>
                      <span className="flex items-center gap-2 text-[#3B2F2A] font-display text-base hover:text-[#CFA7A0] transition-colors cursor-pointer">
                        <ExternalLink size={13} className="text-[#CFA7A0]" />
                        View Service & Pricing
                      </span>
                    </Link>
                  </div>
                </FadeUp>
              )}

              {/* Quick Links */}
              <FadeUp delay={80}>
                <div className="bg-white rounded-xl p-4 shadow-sm" style={{ borderTop: "4px solid", borderImage: "linear-gradient(90deg, #CFA7A0, #A8B3AA) 1" }}>
                  <h3 className="font-display text-base text-[#3B2F2A] mb-3">Quick Links</h3>
                  <ul className="space-y-1.5">
                    {[
                      { label: "First Visit Guide", href: "/first-visit" },
                      { label: "Before Care", href: "/before-care" },
                      { label: "After Care", href: "/after-care" },
                      { label: "FAQ Center", href: "/faq" },
                      { label: "Services & Pricing", href: "/services" },
                      { label: "All Locations", href: "/locations" },
                    ].map((link) => (
                      <li key={link.href}>
                        <Link href={link.href}>
                          <span className="text-sm font-body text-[#4A4A4A] hover:text-[#A8B3AA] transition-colors cursor-pointer flex items-center gap-1.5">
                            <ArrowRight size={11} style={{ color: "#A8B3AA" }} /> {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>

              {/* Recent Posts */}
              <FadeUp delay={100}>
                <div className="bg-white rounded-xl p-4 shadow-sm border-t-4 border-[#A8B3AA]">
                  <h3 className="font-display text-base text-[#3B2F2A] mb-3 flex items-center gap-2"><BookOpen size={14} className="text-[#A8B3AA]" /> Recent Posts</h3>
                  <ul className="space-y-3">
                    {recentPosts.map(p => (
                      <li key={p.slug}>
                        <Link href={`/blog/${p.slug}`}>
                          <div className="flex gap-2.5 group cursor-pointer">
                            <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-body font-semibold text-[#3B2F2A] group-hover:text-[#CFA7A0] transition-colors leading-snug line-clamp-2">{p.title}</p>
                              <p className="text-xs text-[#A8B3AA] font-body mt-0.5">{new Date(p.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href="/blog">
                    <span className="text-xs hover:underline cursor-pointer mt-3 block" style={{ color: "#A8B3AA" }}>View all posts →</span>
                  </Link>
                </div>
              </FadeUp>

              {/* Blog Archive Tree */}
              <FadeUp delay={120}>
                <div className="bg-white rounded-xl p-4 shadow-sm" style={{ borderTop: "4px solid #A8B3AA" }}>
                  <h3 className="font-display text-base text-[#3B2F2A] mb-3 flex items-center gap-2"><Calendar size={14} style={{ color: "#A8B3AA" }} /> Blog Archive</h3>
                  <div className="space-y-1" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {sortedYears.map(year => {
                      const yearPosts = Object.values(archiveTree[year]).flat();
                      const isExpanded = expandedYears.has(year);
                      return (
                        <div key={year}>
                          <button
                            onClick={() => toggleYear(year)}
                            className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#F7F3EE] transition-colors group"
                          >
                            <span className="text-sm font-body font-semibold text-[#3B2F2A] group-hover:text-[#CFA7A0] transition-colors">{year}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-[#A8B3AA] font-body">{yearPosts.length}</span>
                              {isExpanded ? <ChevronDown size={12} className="text-[#CFA7A0]" /> : <ChevronRight size={12} className="text-[#A8B3AA]" />}
                            </div>
                          </button>
                          {isExpanded && (
                            <div className="ml-3 border-l border-[#D8C6B6] pl-3 space-y-0.5 mb-1">
                              {Object.keys(archiveTree[year]).map(Number).sort((a, b) => b - a).map(month => {
                                const monthPosts = archiveTree[year][month];
                                return (
                                  <div key={month}>
                                    <p className="text-xs font-body font-semibold text-[#A8B3AA] uppercase tracking-wide py-1">{monthNames[month]}</p>
                                    <ul className="space-y-0.5">
                                      {monthPosts.map(p => (
                                        <li key={p.slug}>
                                          <Link href={`/blog/${p.slug}`}>
                                            <span className={`text-xs font-body block py-0.5 px-1 rounded transition-colors cursor-pointer line-clamp-1 ${
                                              p.slug === slug
                                                ? 'text-[#CFA7A0] font-semibold bg-[#F7F3EE]'
                                                : 'text-[#4A4A4A] hover:text-[#CFA7A0] hover:bg-[#F7F3EE]'
                                            }`}>
                                              {p.title}
                                            </span>
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Link href="/blog">
                    <span className="text-xs text-[#CFA7A0] hover:underline cursor-pointer mt-3 block">← Back to Journal</span>
                  </Link>
                </div>
              </FadeUp>

            </div>
          </div>
        </div>
      </section>

      {/* Full-width Related Articles section */}
      {relatedFull.length > 0 && (
        <section className="py-16 bg-white border-t border-[#D8C6B6]">
          <div className="container">
            <FadeUp>
              <div className="flex items-center gap-4 mb-10">
                <div className="h-px flex-1 bg-[#D8C6B6]" />
                <div className="text-center">
                  <p className="text-xs font-body font-semibold uppercase tracking-widest text-[#A8B3AA] mb-1">Keep Reading</p>
                  <h2 className="font-display text-3xl text-[#3B2F2A]">Related Articles</h2>
                </div>
                <div className="h-px flex-1 bg-[#D8C6B6]" />
              </div>
            </FadeUp>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedFull.map((p, i) => (
                <FadeUp key={p.id} delay={i * 80}>
                  <Link href={`/blog/${p.slug}`}>
                    <article className="group cursor-pointer rounded-2xl overflow-hidden border border-[#D8C6B6] bg-[#F7F3EE] hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      <div className="aspect-video overflow-hidden flex-shrink-0">
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-body font-semibold uppercase tracking-wide text-[#A8B3AA]">{p.category}</span>
                          <span className="text-[#D8C6B6]">·</span>
                          <span className="text-xs text-[#A8B3AA] font-body flex items-center gap-1">
                            <Clock size={10} /> {p.readTime}
                          </span>
                        </div>
                        <h3 className="font-display text-lg text-[#3B2F2A] leading-snug group-hover:text-[#CFA7A0] transition-colors line-clamp-2 mb-2">{p.title}</h3>
                        <p className="text-sm text-[#4A4A4A] font-body line-clamp-2 leading-relaxed flex-1">{p.excerpt}</p>
                        <div className="mt-4 flex items-center gap-1 text-[#CFA7A0] text-sm font-body font-semibold group-hover:gap-2 transition-all">
                          Read article <ArrowRight size={14} />
                        </div>
                      </div>
                    </article>
                  </Link>
                </FadeUp>
              ))}
            </div>
            <FadeUp delay={200}>
              <div className="text-center mt-10">
                <Link href="/blog">
                  <span className="inline-flex items-center gap-2 text-sm font-body font-semibold text-[#3B2F2A] hover:text-[#CFA7A0] transition-colors cursor-pointer border border-[#D8C6B6] rounded-full px-6 py-2.5 hover:border-[#CFA7A0]">
                    <BookOpen size={14} /> Browse All Articles
                  </span>
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>
      )}
    <MascotEasterEgg pageId="blogpost" />
    </Layout>
  );
}
