/**
 * Admin Mascot Hunt Dashboard
 * Route: /admin/mascot
 *
 * Protected: requires user.role === 'admin'
 * Shows: total claims, total finds, claimed rewards table with contact info, CSV export.
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Search, Trophy, Users, Download, ChevronLeft, Loader2,
  Copy, Check, MapPin, Mail, Phone,
} from "lucide-react";

function StatCard({
  icon,
  label,
  value,
  sub,
  accent = "#CFA7A0",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  const isRose = accent === "#CFA7A0";
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "#ffffff",
        border: "1px solid #D8C6B6",
        borderTop: `3px solid ${accent}`,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: isRose
              ? "rgba(207,167,160,0.12)"
              : "rgba(168,179,170,0.12)",
          }}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: "#3B2F2A" }}>
        {value}
      </p>
      <p className="text-sm font-medium" style={{ color: "#4A4A4A" }}>
        {label}
      </p>
      {sub && (
        <p className="text-xs mt-1" style={{ color: "#A8B3AA" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      onClick={handleCopy}
      title="Copy code"
      className="ml-2 p-1 rounded transition-colors"
      style={{ color: copied ? "#A8B3AA" : "#CFA7A0" }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function exportCSV(rewards: any[]) {
  const header = [
    "ID",
    "Full Name",
    "Phone",
    "Email",
    "Discount Code",
    "Discount %",
    "Claimed At",
    "Used At",
    "Account Name",
    "Account Email",
  ];
  const rows = rewards.map((r) => [
    r.id,
    r.fullName ?? "",
    r.phone ?? "",
    r.email ?? "",
    r.discountCode,
    r.discountPercent,
    r.claimedAt ? new Date(r.claimedAt).toLocaleDateString("en-US") : "",
    r.usedAt ? new Date(r.usedAt).toLocaleDateString("en-US") : "",
    r.userName ?? "",
    r.userEmail ?? "",
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mascot-rewards-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminMascot() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");

  const isAdmin = !!user && user.role === "admin";

  const { data: rewards, isLoading: rewardsLoading } =
    trpc.mascot.adminGetRewards.useQuery(undefined, { enabled: isAdmin });
  const { data: stats, isLoading: statsLoading } =
    trpc.mascot.adminStats.useQuery(undefined, { enabled: isAdmin });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) navigate("/");
  }, [user, loading, navigate]);

  if (loading || statsLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F7F3EE" }}
      >
        <Loader2 className="animate-spin" style={{ color: "#CFA7A0" }} size={32} />
      </div>
    );
  }
  if (!user || user.role !== "admin") return null;

  const filtered = (rewards ?? []).filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (r.fullName ?? "").toLowerCase().includes(q) ||
      (r.email ?? "").toLowerCase().includes(q) ||
      (r.phone ?? "").toLowerCase().includes(q) ||
      r.discountCode.toLowerCase().includes(q) ||
      (r.userName ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen" style={{ background: "#F7F3EE" }}>
      {/* Header */}
      <div
        className="border-b"
        style={{ background: "#ffffff", borderColor: "#D8C6B6" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin">
                <span
                  className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest mb-2 cursor-pointer"
                  style={{ color: "#A8B3AA" }}
                >
                  <ChevronLeft size={14} /> Admin Panel
                </span>
              </Link>
              <h1 className="font-serif text-3xl" style={{ color: "#3B2F2A" }}>
                Mascot Hunt Claims
              </h1>
              <p className="text-sm mt-1" style={{ color: "#A8B3AA" }}>
                All users who found all 11 mascots and claimed their discount
              </p>
            </div>
            <button
              onClick={() => rewards && exportCSV(rewards)}
              disabled={!rewards || rewards.length === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
              style={{
                background: "#F7F3EE",
                color: "#3B2F2A",
                border: "1px solid #D8C6B6",
              }}
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            icon={<Trophy size={20} style={{ color: "#CFA7A0" }} />}
            label="Rewards Claimed"
            value={stats?.totalClaimed ?? "—"}
            sub="Unique discount codes issued"
            accent="#CFA7A0"
          />
          <StatCard
            icon={<Search size={20} style={{ color: "#A8B3AA" }} />}
            label="Total Mascot Finds"
            value={stats?.totalFinds ?? "—"}
            sub="Across all users"
            accent="#A8B3AA"
          />
          <StatCard
            icon={<Users size={20} style={{ color: "#CFA7A0" }} />}
            label="Completion Rate"
            value={
              stats && stats.totalFinds > 0
                ? `${Math.round((stats.totalClaimed / Math.max(stats.totalFinds / 11, 1)) * 100)}%`
                : "—"
            }
            sub="Hunters who claimed vs. started"
            accent="#CFA7A0"
          />
        </div>

        {/* Search + table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
        >
          {/* Table header */}
          <div
            className="px-6 py-4 border-b flex items-center justify-between gap-4"
            style={{ borderColor: "#D8C6B6" }}
          >
            <h2 className="font-serif text-lg" style={{ color: "#3B2F2A" }}>
              Claimed Rewards
              {rewards && (
                <span
                  className="ml-2 text-sm font-sans font-normal"
                  style={{ color: "#A8B3AA" }}
                >
                  ({filtered.length}
                  {search ? ` of ${rewards.length}` : ""})
                </span>
              )}
            </h2>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#A8B3AA" }}
              />
              <input
                type="text"
                placeholder="Search by name, email, code…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 rounded-xl text-sm outline-none"
                style={{
                  background: "#F7F3EE",
                  border: "1px solid #D8C6B6",
                  color: "#3B2F2A",
                  width: "240px",
                }}
              />
            </div>
          </div>

          {rewardsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2
                className="animate-spin"
                style={{ color: "#CFA7A0" }}
                size={24}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Trophy
                size={36}
                className="mx-auto mb-3"
                style={{ color: "#D8C6B6" }}
              />
              <p className="font-serif text-lg mb-1" style={{ color: "#3B2F2A" }}>
                {search ? "No results found" : "No rewards claimed yet"}
              </p>
              <p className="text-sm" style={{ color: "#A8B3AA" }}>
                {search
                  ? "Try a different search term."
                  : "Once a user finds all 11 mascots and submits their info, they'll appear here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #D8C6B6" }}>
                    {[
                      "Contact",
                      "Phone",
                      "Email",
                      "Discount Code",
                      "Discount",
                      "Claimed",
                      "Used",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#A8B3AA" }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom:
                          i < filtered.length - 1
                            ? "1px solid #F0E8E0"
                            : "none",
                      }}
                    >
                      {/* Contact */}
                      <td className="px-5 py-4">
                        <p
                          className="font-semibold"
                          style={{ color: "#3B2F2A" }}
                        >
                          {r.fullName ?? (
                            <span style={{ color: "#A8B3AA" }}>—</span>
                          )}
                        </p>
                        {r.userName && r.userName !== r.fullName && (
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: "#A8B3AA" }}
                          >
                            Account: {r.userName}
                          </p>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="px-5 py-4">
                        {r.phone ? (
                          <a
                            href={`tel:${r.phone}`}
                            className="flex items-center gap-1.5"
                            style={{ color: "#4A4A4A" }}
                          >
                            <Phone size={12} style={{ color: "#CFA7A0" }} />
                            {r.phone}
                          </a>
                        ) : (
                          <span style={{ color: "#A8B3AA" }}>—</span>
                        )}
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        {r.email ? (
                          <a
                            href={`mailto:${r.email}`}
                            className="flex items-center gap-1.5"
                            style={{ color: "#4A4A4A" }}
                          >
                            <Mail size={12} style={{ color: "#CFA7A0" }} />
                            {r.email}
                          </a>
                        ) : (
                          <span style={{ color: "#A8B3AA" }}>—</span>
                        )}
                      </td>

                      {/* Discount code */}
                      <td className="px-5 py-4">
                        <div className="flex items-center">
                          <span
                            className="font-mono text-xs px-2 py-1 rounded-lg"
                            style={{
                              background: "rgba(61,26,26,0.06)",
                              color: "#3D1A1A",
                            }}
                          >
                            {r.discountCode}
                          </span>
                          <CopyButton text={r.discountCode} />
                        </div>
                      </td>

                      {/* Discount % */}
                      <td className="px-5 py-4">
                        <span
                          className="font-semibold"
                          style={{ color: "#CFA7A0" }}
                        >
                          {r.discountPercent}%
                        </span>
                      </td>

                      {/* Claimed at */}
                      <td className="px-5 py-4" style={{ color: "#4A4A4A" }}>
                        {r.claimedAt
                          ? new Date(r.claimedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Used at */}
                      <td className="px-5 py-4">
                        {r.usedAt ? (
                          <span
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{
                              background: "rgba(168,179,170,0.15)",
                              color: "#A8B3AA",
                            }}
                          >
                            {new Date(r.usedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        ) : (
                          <span
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{
                              background: "rgba(207,167,160,0.15)",
                              color: "#CFA7A0",
                            }}
                          >
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Hint for staff */}
        <div
          className="rounded-2xl p-5 flex items-start gap-3"
          style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
        >
          <MapPin size={18} style={{ color: "#CFA7A0", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>
              Staff Redemption Guide
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#7A6A5A" }}>
              When a client presents a <strong>WAXHUNT-</strong> code at the front desk, look it up in
              the table above to verify it is marked <strong>Active</strong> (not already used). Apply
              the discount manually in your booking system, then note the redemption date. If you need
              to mark a code as used, update the <code>usedAt</code> field directly via the Database
              panel in the Manus admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
