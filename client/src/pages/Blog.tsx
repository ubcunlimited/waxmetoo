/*
 * WAX ME TOO — Blog / Journal Index
 * Design: Modern Feminine Craft
 * Layout: Two-column — posts grid (left) + sticky archive sidebar (right)
 */

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Clock, Search, ChevronDown, ChevronRight, Tag, Calendar, BookOpen, Hash } from "lucide-react";
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

// Build archive tree: { year -> { month -> posts[] } }
function buildArchive() {
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const tree: Record<number, Record<string, typeof blogPosts>> = {};
  blogPosts.forEach(post => {
    const d = new Date(post.date);
    if (isNaN(d.getTime())) return;
    const year = d.getFullYear();
    const month = monthNames[d.getMonth()];
    if (!tree[year]) tree[year] = {};
    if (!tree[year][month]) tree[year][month] = [];
    tree[year][month].push(post);
  });
  // Sort years descending
  return Object.entries(tree)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, months]) => ({
      year: Number(year),
      months: Object.entries(months)
        .sort(([, a], [, b]) => new Date(b[0].date).getTime() - new Date(a[0].date).getTime())
        .map(([month, posts]) => ({ month, posts }))
    }));
}

const archive = buildArchive();
const allCategories = Array.from(new Set(blogPosts.map(p => p.category))).sort();

// Build tag frequency map, sorted by count desc
function buildTagCloud() {
  const freq: Record<string, number> = {};
  blogPosts.forEach(post => {
    const tags = (post as any).tags as string[] | undefined;
    if (tags) tags.forEach(t => { freq[t] = (freq[t] || 0) + 1; });
  });
  return Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
}
const tagCloud = buildTagCloud();

export default function Blog() {
  const [location] = useLocation();

  useEffect(() => {
    document.title = "Waxing Tips, News & Guides — The Wax Me Too Journal";
    let m = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (!m) { m = document.createElement('meta') as HTMLMetaElement; m.name = 'description'; document.head.appendChild(m); }
    m.content = "Read the latest waxing tips, how-to guides, studio news, and beauty advice from Wax Me Too — Utah's professional waxing studio since 2007. From Brazilian wax prep to eyebrow design trends.";
    return () => { document.title = "Wax Me Too — Professional Waxing Studio | Utah"; };
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set([2024, 2020]));
  const [selectedArchiveMonth, setSelectedArchiveMonth] = useState<{ year: number; month: string } | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  // Read ?tag= URL parameter and pre-filter on mount / location change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tagParam = params.get('tag');
    if (tagParam) {
      setActiveTag(decodeURIComponent(tagParam));
      setActiveCategory("All");
      setSearchQuery("");
      setSelectedArchiveMonth(null);
      // Scroll to posts grid
      setTimeout(() => {
        document.getElementById('blog-posts-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [location]);

  const toggleYear = (year: number) => {
    setExpandedYears(prev => {
      const next = new Set(prev);
      next.has(year) ? next.delete(year) : next.add(year);
      return next;
    });
  };

  const handleArchiveClick = (year: number, month: string) => {
    if (selectedArchiveMonth?.year === year && selectedArchiveMonth?.month === month) {
      setSelectedArchiveMonth(null);
      setActiveCategory("All");
      setSearchQuery("");
    } else {
      setSelectedArchiveMonth({ year, month });
      setActiveCategory("All");
      setSearchQuery("");
      setActiveTag(null);
    }
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setSelectedArchiveMonth(null);
    setSearchQuery("");
    setActiveTag(null);
  };

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag(null);
    } else {
      setActiveTag(tag);
      setActiveCategory("All");
      setSelectedArchiveMonth(null);
      setSearchQuery("");
    }
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setActiveCategory("All");
    setSelectedArchiveMonth(null);
    setActiveTag(null);
  };

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const filtered = blogPosts.filter(post => {
    if (selectedArchiveMonth) {
      const d = new Date(post.date);
      return d.getFullYear() === selectedArchiveMonth.year &&
        monthNames[d.getMonth()] === selectedArchiveMonth.month;
    }
    if (activeTag) {
      const tags = (post as any).tags as string[] | undefined;
      return tags ? tags.includes(activeTag) : false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
    }
    if (activeCategory !== "All") return post.category === activeCategory;
    return true;
  });

  const showFeatured = !selectedArchiveMonth && !searchQuery && activeCategory === "All" && !activeTag;

  // Sidebar: recent posts
  const recentPosts = blogPosts.slice(0, 5);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-[#3B2F2A] py-20">
        <div className="container">
          <FadeUp>
            <div className="max-w-xl">
              <p className="section-label-sage mb-3">Tips &amp; Education</p>
              <h1 className="font-display text-5xl md:text-6xl text-white mb-5">
                The Wax Me Too<br /><em style={{ color: "#A8B3AA" }}>Journal</em>
              </h1>
              <p className="text-[#D8C6B6] font-body leading-relaxed">
                Expert waxing tips, prep and aftercare guides, service education, and beauty advice — written by our team of licensed estheticians.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Main Content: Posts + Sidebar */}
      <section className="py-14 bg-[#F7F3EE]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* ── LEFT: Posts Column ── */}
            <div id="blog-posts-grid" className="flex-1 min-w-0">

              {/* Active filter label */}
              {(activeCategory !== "All" || searchQuery || selectedArchiveMonth || activeTag) && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm font-body text-[#4A4A4A]">
                    {selectedArchiveMonth
                      ? `Showing: ${selectedArchiveMonth.month} ${selectedArchiveMonth.year}`
                      : activeTag
                        ? `Tag: #${activeTag}`
                        : searchQuery
                          ? `Search results for "${searchQuery}"`
                          : `Category: ${activeCategory}`}
                  </span>
                  <button
                    onClick={() => { setActiveCategory("All"); setSearchQuery(""); setSelectedArchiveMonth(null); setActiveTag(null); }}
                    className="text-xs text-[#CFA7A0] hover:text-[#3B2F2A] underline font-body transition-colors"
                  >
                    Clear filter
                  </button>
                  <span className="text-xs text-[#A8B3AA] font-body">({filtered.length} post{filtered.length !== 1 ? "s" : ""})</span>
                </div>
              )}

              {/* Featured Post — only when showing "All" unfiltered */}
              {showFeatured && filtered.length > 0 && (
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

              {/* Posts Grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen size={40} className="mx-auto text-[#D8C6B6] mb-4" />
                  <p className="font-display text-xl text-[#3B2F2A] mb-2">No posts found</p>
                  <p className="text-sm text-[#4A4A4A] font-body">Try a different search term or category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {(showFeatured ? filtered.slice(1) : filtered).map((post, i) => (
                    <FadeUp key={post.id} delay={i * 60}>
                      <Link href={`/blog/${post.slug}`}>
                        <div className="blog-card cursor-pointer h-full flex flex-col">
                          <div className="aspect-[16/9] overflow-hidden">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-body font-600 text-[#CFA7A0] uppercase tracking-wide">{post.category}</span>
                              <span className="text-[#D8C6B6]">·</span>
                              <span className="text-xs text-[#A8B3AA] font-body">{post.readTime}</span>
                            </div>
                            <h3 className="font-display text-xl text-[#3B2F2A] mb-2 leading-snug flex-1">{post.title}</h3>
                            <p className="text-sm text-[#4A4A4A] font-body leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
                            <span className="text-xs text-[#A8B3AA] font-body">{post.date}</span>
                          </div>
                        </div>
                      </Link>
                    </FadeUp>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Sidebar ── */}
            <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-28 space-y-6" style={{ maxHeight: 'calc(100vh - 7rem)', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#D8C6B6 transparent' }}>

              {/* Search */}
              <div className="bg-white rounded-xl border border-[#D8C6B6] p-5 shadow-sm">
                <h3 className="font-display text-lg text-[#3B2F2A] mb-3 flex items-center gap-2">
                  <Search size={16} style={{ color: "#A8B3AA" }} /> Search Posts
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search the journal..."
                    value={searchQuery}
                    onChange={e => handleSearch(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-[#D8C6B6] text-sm font-body text-[#3B2F2A] bg-[#F7F3EE] placeholder-[#A8B3AA] focus:outline-none focus:ring-2 focus:ring-[#CFA7A0]"
                  />
                  <Search size={14} className="absolute right-3 top-3 text-[#A8B3AA]" />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl border border-[#D8C6B6] p-5 shadow-sm">
                <h3 className="font-display text-lg text-[#3B2F2A] mb-3 flex items-center gap-2">
                  <Tag size={16} style={{ color: "#A8B3AA" }} /> Categories
                </h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => handleCategoryClick("All")}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors flex items-center justify-between ${
                        activeCategory === "All" && !selectedArchiveMonth && !searchQuery
                          ? "bg-[#3B2F2A] text-white"
                          : "text-[#4A4A4A] hover:bg-[#F7F3EE] hover:text-[#3B2F2A]"
                      }`}
                    >
                      All Posts
                      <span className={`text-xs rounded-full px-2 py-0.5 ${activeCategory === "All" && !selectedArchiveMonth && !searchQuery ? "bg-white/20 text-white" : "bg-[#F7F3EE] text-[#A8B3AA]"}`}>
                        {blogPosts.length}
                      </span>
                    </button>
                  </li>
                  {allCategories.map(cat => {
                    const count = blogPosts.filter(p => p.category === cat).length;
                    const isActive = activeCategory === cat && !selectedArchiveMonth && !searchQuery;
                    return (
                      <li key={cat}>
                        <button
                          onClick={() => handleCategoryClick(cat)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-colors flex items-center justify-between ${
                            isActive
                              ? "bg-[#CFA7A0] text-white"
                              : "text-[#4A4A4A] hover:bg-[#F7F3EE] hover:text-[#3B2F2A]"
                          }`}
                        >
                          {cat}
                          <span className={`text-xs rounded-full px-2 py-0.5 ${isActive ? "bg-white/20 text-white" : "bg-[#F7F3EE] text-[#A8B3AA]"}`}>
                            {count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Archive by Year/Month */}
              <div className="bg-white rounded-xl border border-[#D8C6B6] p-5 shadow-sm">
                <h3 className="font-display text-lg text-[#3B2F2A] mb-3 flex items-center gap-2">
                  <Calendar size={16} style={{ color: "#A8B3AA" }} /> Archive
                </h3>
                <ul className="space-y-1">
                  {archive.map(({ year, months }) => {
                    const yearCount = months.reduce((acc, m) => acc + m.posts.length, 0);
                    const isExpanded = expandedYears.has(year);
                    return (
                      <li key={year}>
                        <button
                          onClick={() => toggleYear(year)}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm font-body font-semibold text-[#3B2F2A] hover:bg-[#F7F3EE] transition-colors flex items-center justify-between group"
                        >
                          <span className="flex items-center gap-2">
                            {isExpanded
                              ? <ChevronDown size={14} className="text-[#CFA7A0]" />
                              : <ChevronRight size={14} className="text-[#A8B3AA] group-hover:text-[#CFA7A0]" />
                            }
                            {year}
                          </span>
                          <span className="text-xs bg-[#F7F3EE] text-[#A8B3AA] rounded-full px-2 py-0.5">{yearCount}</span>
                        </button>
                        {isExpanded && (
                          <ul className="ml-6 mt-1 space-y-0.5">
                            {months.map(({ month, posts }) => {
                              const isSelected = selectedArchiveMonth?.year === year && selectedArchiveMonth?.month === month;
                              return (
                                <li key={month}>
                                  <button
                                    onClick={() => handleArchiveClick(year, month)}
                                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm font-body transition-colors flex items-center justify-between ${
                                      isSelected
                                        ? "bg-[#CFA7A0] text-white"
                                        : "text-[#4A4A4A] hover:bg-[#F7F3EE] hover:text-[#3B2F2A]"
                                    }`}
                                  >
                                    {month}
                                    <span className={`text-xs rounded-full px-1.5 py-0.5 ${isSelected ? "bg-white/20 text-white" : "bg-[#F7F3EE] text-[#A8B3AA]"}`}>
                                      {posts.length}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Tag Cloud */}
              <div className="bg-white rounded-xl border border-[#D8C6B6] p-5 shadow-sm">
                <h3 className="font-display text-lg text-[#3B2F2A] mb-4 flex items-center gap-2">
                  <Hash size={16} style={{ color: "#A8B3AA" }} /> Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(showAllTags ? tagCloud : tagCloud.slice(0, 24)).map(({ tag, count }) => {
                    const isActive = activeTag === tag;
                    // Size tag by frequency: top 5 = large, next 10 = medium, rest = small
                    const rank = tagCloud.findIndex(t => t.tag === tag);
                    const sizeClass = rank < 5 ? "text-sm font-semibold" : rank < 15 ? "text-xs font-medium" : "text-xs";
                    return (
                      <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        title={`${count} post${count !== 1 ? 's' : ''}`}
                        className={`${sizeClass} px-2.5 py-1 rounded-full border transition-all duration-200 ${
                          isActive
                            ? "bg-[#CFA7A0] border-[#CFA7A0] text-white shadow-sm"
                            : "bg-[#F7F3EE] border-[#D8C6B6] text-[#4A4A4A] hover:bg-[#D8C6B6] hover:border-[#CFA7A0] hover:text-[#3B2F2A]"
                        }`}
                      >
                        #{tag}
                        {count > 1 && <span className={`ml-1 ${isActive ? "text-white/70" : "text-[#A8B3AA]"}`}>({count})</span>}
                      </button>
                    );
                  })}
                </div>
                {tagCloud.length > 24 && (
                  <button
                    onClick={() => setShowAllTags(v => !v)}
                    className="mt-3 text-xs text-[#CFA7A0] hover:text-[#3B2F2A] font-body transition-colors underline"
                  >
                    {showAllTags ? "Show fewer tags" : `Show all ${tagCloud.length} tags`}
                  </button>
                )}
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-xl border border-[#D8C6B6] p-5 shadow-sm">
                <h3 className="font-display text-lg text-[#3B2F2A] mb-4 flex items-center gap-2">
                  <BookOpen size={16} style={{ color: "#A8B3AA" }} /> Recent Posts
                </h3>
                <ul className="space-y-4">
                  {recentPosts.map(post => (
                    <li key={post.id}>
                      <Link href={`/blog/${post.slug}`}>
                        <div className="flex gap-3 group cursor-pointer">
                          <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-body mb-0.5" style={{ color: "#A8B3AA" }}>{post.date}</p>
                            <p className="text-sm font-body text-[#3B2F2A] leading-snug transition-colors line-clamp-2" style={{ ['--hover-color' as any]: "#A8B3AA" }}>
                              {post.title}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book CTA */}
              <div className="rounded-xl p-6 text-center" style={{ background: "linear-gradient(135deg, #3B2F2A 0%, #4a3d38 100%)", border: "1px solid #A8B3AA30" }}>
                <p className="font-display text-xl text-white mb-2">Ready to get smooth?</p>
                <p className="text-sm font-body mb-4" style={{ color: "#A8B3AA" }}>New clients get 20% off their first service.</p>
                <a
                  href="https://app.mangomint.com/waxmetoo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 rounded-lg text-sm font-body font-semibold transition-colors"
                  style={{ background: "linear-gradient(90deg, #CFA7A0, #A8B3AA)", color: "#3B2F2A" }}
                >
                  Book Your Appointment
                </a>
              </div>
            </aside>
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
