/**
 * Admin Subscribers — /admin/subscribers
 * Shows newsletter subscriber list, stats, and CSV export.
 * Requires admin role.
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  ChevronLeft, Users, UserCheck, UserX, Download,
  Search, Loader2, Mail, CheckCircle, XCircle, Trash2
} from "lucide-react";

function exportCSV(subscribers: any[]) {
  const header = ["ID", "Email", "First Name", "Confirmed", "Source", "Subscribed At"];
  const rows = subscribers.map(s => [
    s.id,
    s.email,
    s.firstName ?? "",
    s.confirmed ? "Yes" : "No",
    s.source ?? "footer",
    new Date(s.createdAt).toLocaleDateString("en-US"),
  ]);
  const csv = [header, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminSubscribers() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [showUnsubscribed, setShowUnsubscribed] = useState(false);
  const [unsubConfirm, setUnsubConfirm] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const { data: subscribers, isLoading } = trpc.blog.subscribers.useQuery(
    { includeUnsubscribed: showUnsubscribed },
    { enabled: !!user && user.role === "admin" }
  );
  const { data: stats } = trpc.blog.subscriberStats.useQuery(
    undefined,
    { enabled: !!user && user.role === "admin" }
  );
  const unsubMutation = trpc.blog.unsubscribe.useMutation({
    onSuccess: () => {
      utils.blog.subscribers.invalidate();
      utils.blog.subscriberStats.invalidate();
      setUnsubConfirm(null);
    },
  });

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

  const filtered = (subscribers ?? []).filter(s =>
    search === "" ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.firstName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: "#F7F3EE" }}>
      {/* Header */}
      <div className="sticky top-0 z-20 border-b" style={{ background: "#ffffff", borderColor: "#D8C6B6" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <span className="flex items-center gap-1.5 text-sm cursor-pointer" style={{ color: "#A8B3AA" }}>
                <ChevronLeft size={16} /> Admin
              </span>
            </Link>
            <span style={{ color: "#D8C6B6" }}>/</span>
            <span className="font-semibold text-sm" style={{ color: "#3B2F2A" }}>Newsletter Subscribers</span>
          </div>
          <button
            onClick={() => subscribers && exportCSV(subscribers)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: "#F7F3EE", color: "#3B2F2A", border: "1.5px solid #D8C6B6" }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="font-serif text-2xl font-semibold mb-6" style={{ color: "#3B2F2A" }}>Newsletter Subscribers</h1>
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Subscribers", value: stats.total, icon: <Users size={18} />, color: "#CFA7A0", accent: "#CFA7A0" },
              { label: "Confirmed", value: stats.confirmed, icon: <UserCheck size={18} />, color: "#A8B3AA", accent: "#A8B3AA" },
              { label: "Pending Confirmation", value: stats.total - stats.confirmed, icon: <Mail size={18} />, color: "#CFA7A0", accent: "#CFA7A0" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #D8C6B6", borderTop: `3px solid ${s.accent}` }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>{s.icon}</div>
                <p className="font-display text-3xl font-bold" style={{ color: "#3B2F2A" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "#A8B3AA" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#A8B3AA" }} />
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by email or name…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ border: "1.5px solid #D8C6B6", background: "#fff", color: "#3B2F2A" }}
            />
          </div>
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm cursor-pointer select-none"
            style={{ background: "#fff", border: "1.5px solid #D8C6B6", color: "#3B2F2A" }}>
            <input
              type="checkbox" checked={showUnsubscribed}
              onChange={e => setShowUnsubscribed(e.target.checked)}
              className="accent-[#CFA7A0]"
            />
            Show unsubscribed
          </label>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20" style={{ color: "#A8B3AA" }}>
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users size={40} className="mx-auto mb-3" style={{ color: "#D8C6B6" }} />
            <p className="font-serif text-xl mb-2" style={{ color: "#3B2F2A" }}>No subscribers yet</p>
            <p className="text-sm" style={{ color: "#A8B3AA" }}>Subscribers will appear here once they sign up.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #D8C6B6" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#F7F3EE", borderBottom: "1px solid #D8C6B6" }}>
                  {["Email", "Name", "Status", "Source", "Joined", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#A8B3AA" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{
                      background: i % 2 === 0 ? "#ffffff" : "#fafaf9",
                      borderBottom: "1px solid #F7F3EE",
                      opacity: s.unsubscribed ? 0.5 : 1,
                    }}
                  >
                    <td className="px-4 py-3" style={{ color: "#3B2F2A" }}>
                      <div className="flex items-center gap-2">
                        <Mail size={13} style={{ color: "#CFA7A0" }} />
                        <span className="font-medium">{s.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ color: "#4A4A4A" }}>{s.firstName ?? "—"}</td>
                    <td className="px-4 py-3">
                      {s.unsubscribed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#fef2f2", color: "#e57373" }}>
                          <XCircle size={10} /> Unsubscribed
                        </span>
                      ) : s.confirmed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(168,179,170,0.2)", color: "#4a7c59" }}>
                          <CheckCircle size={10} /> Confirmed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(207,167,160,0.15)", color: "#CFA7A0" }}>
                          <Mail size={10} /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#A8B3AA" }}>{s.source ?? "footer"}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "#A8B3AA" }}>
                      {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      {!s.unsubscribed && (
                        <button
                          onClick={() => setUnsubConfirm(s.email)}
                          className="p-1.5 rounded-lg"
                          style={{ background: "#fef2f2", color: "#e57373" }}
                          title="Unsubscribe"
                        >
                          <UserX size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 py-3 text-xs" style={{ background: "#F7F3EE", color: "#A8B3AA", borderTop: "1px solid #D8C6B6" }}>
              Showing {filtered.length} of {subscribers?.length ?? 0} subscriber{subscribers?.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>

      {/* Unsubscribe confirm modal */}
      {unsubConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="rounded-2xl p-8 max-w-sm w-full mx-4" style={{ background: "#fff" }}>
            <h3 className="font-serif text-xl mb-3" style={{ color: "#3B2F2A" }}>Unsubscribe?</h3>
            <p className="text-sm mb-2" style={{ color: "#4A4A4A" }}>
              This will mark <strong>{unsubConfirm}</strong> as unsubscribed.
            </p>
            <p className="text-xs mb-6" style={{ color: "#A8B3AA" }}>They will no longer receive newsletter emails.</p>
            <div className="flex gap-3">
              <button
                onClick={() => unsubMutation.mutate({ email: unsubConfirm })}
                disabled={unsubMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "#e57373", color: "#fff" }}
              >
                {unsubMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <UserX size={14} />}
                Unsubscribe
              </button>
              <button
                onClick={() => setUnsubConfirm(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "#F7F3EE", color: "#3B2F2A", border: "1.5px solid #D8C6B6" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
