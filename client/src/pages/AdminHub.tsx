/**
 * Admin Hub — /admin
 * Central landing page for all admin sections.
 * Requires admin role.
 */

import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Gift, BookOpen, Users, Settings, ChevronRight,
  Loader2, Trophy, FileText, Globe, UserCheck
} from "lucide-react";

export default function AdminHub() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  const { data: giveawayStats } = trpc.giveaway.stats.useQuery(
    undefined, { enabled: !!user && user.role === "admin" }
  );
  const { data: blogStats } = trpc.blog.stats.useQuery(
    undefined, { enabled: !!user && user.role === "admin" }
  );
  const { data: subscriberStats } = trpc.blog.subscriberStats.useQuery(
    undefined, { enabled: !!user && user.role === "admin" }
  );
  const { data: schedulerStatus } = trpc.giveaway.schedulerStatus.useQuery(
    undefined, { enabled: !!user && user.role === "admin" }
  );

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) navigate("/");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F3EE" }}>
        <Loader2 className="animate-spin" style={{ color: "#CFA7A0" }} size={32} />
      </div>
    );
  }
  if (!user || user.role !== "admin") return null;

  const sections = [
    {
      href: "/admin/giveaway",
      icon: <Gift size={24} style={{ color: "#CFA7A0" }} />,
      title: "Giveaway Management",
      description: "View entries, draw monthly winners, manage the auto-draw scheduler, and export entry data.",
      stats: [
        { label: "Confirmed Entries", value: giveawayStats?.confirmedCount ?? "—" },
        { label: "Auto-Draw", value: schedulerStatus?.enabled ? "Active" : "Paused" },
      ],
    },
    {
      href: "/admin/blog",
      icon: <BookOpen size={24} style={{ color: "#CFA7A0" }} />,
      title: "Blog Management",
      description: "Create, edit, and publish blog posts. Manage drafts and archived content.",
      stats: [
        { label: "Published", value: blogStats?.published ?? "—" },
        { label: "Drafts", value: blogStats?.draft ?? "—" },
      ],
    },
    {
      href: "/admin/subscribers",
      icon: <Users size={24} style={{ color: "#CFA7A0" }} />,
      title: "Newsletter Subscribers",
      description: "View and manage newsletter subscribers, export lists, and handle unsubscribes.",
      stats: [
        { label: "Total Subscribers", value: subscriberStats?.total ?? "—" },
        { label: "Confirmed", value: subscriberStats?.confirmed ?? "—" },
      ],
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#F7F3EE" }}>
      {/* Header */}
      <div className="border-b" style={{ background: "#ffffff", borderColor: "#D8C6B6" }}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#CFA7A0" }}>
                Admin Panel
              </p>
              <h1 className="font-serif text-3xl" style={{ color: "#3B2F2A" }}>Wax Me Too Admin</h1>
              <p className="text-sm mt-1" style={{ color: "#A8B3AA" }}>
                Signed in as <strong style={{ color: "#3B2F2A" }}>{user.name}</strong>
              </p>
            </div>
            <Link href="/">
              <span className="text-sm cursor-pointer" style={{ color: "#A8B3AA" }}>← Back to Site</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map(section => (
            <Link key={section.href} href={section.href}>
              <div
                className="rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md group"
                style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(207,167,160,0.12)" }}>
                  {section.icon}
                </div>
                <h2 className="font-serif text-lg mb-2" style={{ color: "#3B2F2A" }}>{section.title}</h2>
                <p className="text-xs leading-relaxed mb-5" style={{ color: "#A8B3AA" }}>{section.description}</p>

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {section.stats.map(s => (
                    <div key={s.label} className="rounded-xl p-3" style={{ background: "#F7F3EE" }}>
                      <p className="font-bold text-lg" style={{ color: "#3B2F2A" }}>{s.value}</p>
                      <p className="text-xs" style={{ color: "#A8B3AA" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all" style={{ color: "#CFA7A0" }}>
                  Manage <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-8 rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}>
          <h3 className="font-serif text-lg mb-4" style={{ color: "#3B2F2A" }}>Quick Links</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/", label: "View Site" },
              { href: "/blog", label: "View Blog" },
              { href: "/win-a-free-wax", label: "Giveaway Page" },
              { href: "/locations", label: "Locations" },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ background: "#F7F3EE", color: "#3B2F2A", border: "1px solid #D8C6B6" }}
              >
                <Globe size={13} /> {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
