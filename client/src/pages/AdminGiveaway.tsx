/**
 * Admin Giveaway Dashboard
 * Route: /admin/giveaway
 *
 * Protected: requires user.role === 'admin'
 * Shows: confirmed entry count, scheduler status, draw winner button,
 *        past winners table, all entries table.
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Gift, Users, Trophy, RefreshCw, ChevronLeft, Loader2,
  CheckCircle, Clock, AlertCircle, Calendar, Play, Pause,
  ToggleLeft, ToggleRight, Mail, Download
} from "lucide-react";

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(207,167,160,0.15)" }}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color: "#3B2F2A" }}>{value}</p>
      <p className="text-sm font-medium" style={{ color: "#4A4A4A" }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "#A8B3AA" }}>{sub}</p>}
    </div>
  );
}

function exportEntriesCSV(entries: any[]) {
  const header = ["ID", "First Name", "Last Name", "Email", "Confirmed At", "IP Address"];
  const rows = entries.map(e => [
    e.id, e.firstName, e.lastName, e.email,
    e.confirmedAt ? new Date(e.confirmedAt).toLocaleDateString("en-US") : "",
    e.ipAddress ?? "",
  ]);
  const csv = [header, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `giveaway-entries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminGiveaway() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [drawResult, setDrawResult] = useState<{ success: boolean; reason: string; winner?: any } | null>(null);
  const [activeTab, setActiveTab] = useState<"winners" | "entries">("winners");

  const utils = trpc.useUtils();
  const { data: stats } = trpc.giveaway.stats.useQuery(undefined, { enabled: !!user && user.role === "admin" });
  const { data: winners } = trpc.giveaway.winners.useQuery(undefined, { enabled: !!user && user.role === "admin" });
  const { data: entries } = trpc.giveaway.entries.useQuery(undefined, { enabled: !!user && user.role === "admin" });
  const { data: schedulerStatus, refetch: refetchScheduler } = trpc.giveaway.schedulerStatus.useQuery(
    undefined, { enabled: !!user && user.role === "admin", refetchInterval: 30000 }
  );

  const drawMutation = trpc.giveaway.drawWinner.useMutation({
    onSuccess: (data) => {
      setDrawResult(data);
      utils.giveaway.stats.invalidate();
      utils.giveaway.winners.invalidate();
    },
  });

  const schedulerMutation = trpc.giveaway.setScheduler.useMutation({
    onSuccess: () => refetchScheduler(),
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

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const thisMonthWinner = winners?.find(w => w.drawMonth === currentMonth);

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
            <span className="font-semibold text-sm" style={{ color: "#3B2F2A" }}>Giveaway Management</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Users size={20} style={{ color: "#CFA7A0" }} />}
            label="Confirmed Entries"
            value={stats?.confirmedCount ?? "—"}
            sub="In the active drawing pool"
          />
          <StatCard
            icon={<Trophy size={20} style={{ color: "#CFA7A0" }} />}
            label="Total Winners"
            value={winners?.length ?? "—"}
            sub="All-time monthly draws"
          />
          <StatCard
            icon={<Calendar size={20} style={{ color: "#CFA7A0" }} />}
            label="This Month"
            value={thisMonthWinner ? "Winner Drawn" : "No Winner Yet"}
            sub={currentMonthLabel}
          />
          <StatCard
            icon={schedulerStatus?.enabled ? <Play size={20} style={{ color: "#4a7c59" }} /> : <Pause size={20} style={{ color: "#CFA7A0" }} />}
            label="Auto-Draw"
            value={schedulerStatus?.enabled ? "Active" : "Paused"}
            sub="1st of each month, 9 AM MT"
          />
        </div>

        {/* Scheduler Control */}
        <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg mb-1" style={{ color: "#3B2F2A" }}>Monthly Auto-Draw Scheduler</h3>
              <p className="text-sm mb-2" style={{ color: "#4A4A4A" }}>
                When enabled, a winner is automatically drawn on the 1st of each month at 9:00 AM Mountain Time.
                The winner receives a notification email automatically.
              </p>
              {schedulerStatus?.lastRunAt && (
                <p className="text-xs" style={{ color: "#A8B3AA" }}>
                  Last run: {new Date(schedulerStatus.lastRunAt).toLocaleString("en-US")}
                  {schedulerStatus.lastRunResult && <> — {schedulerStatus.lastRunResult}</>}
                </p>
              )}
              {!schedulerStatus?.lastRunAt && (
                <p className="text-xs" style={{ color: "#A8B3AA" }}>
                  Schedule: {schedulerStatus?.nextRunDescription ?? "1st of every month at 9:00 AM Mountain Time"}
                </p>
              )}
            </div>
            <button
              onClick={() => schedulerMutation.mutate({ enabled: !schedulerStatus?.enabled })}
              disabled={schedulerMutation.isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all"
              style={{
                background: schedulerStatus?.enabled ? "#fef2f2" : "rgba(207,167,160,0.15)",
                color: schedulerStatus?.enabled ? "#e57373" : "#CFA7A0",
                border: `1.5px solid ${schedulerStatus?.enabled ? "#fecaca" : "rgba(207,167,160,0.4)"}`,
              }}
            >
              {schedulerMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : schedulerStatus?.enabled ? (
                <><ToggleRight size={16} /> Disable Auto-Draw</>
              ) : (
                <><ToggleLeft size={16} /> Enable Auto-Draw</>
              )}
            </button>
          </div>
        </div>

        {/* Manual Draw */}
        <div className="rounded-2xl p-6" style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}>
          <h3 className="font-serif text-lg mb-1" style={{ color: "#3B2F2A" }}>Manual Winner Draw</h3>
          <p className="text-sm mb-4" style={{ color: "#4A4A4A" }}>
            Draw a winner for <strong>{currentMonthLabel}</strong> right now.
            {thisMonthWinner && " A winner has already been drawn for this month."}
          </p>

          {drawResult && (
            <div
              className="rounded-xl px-4 py-3 mb-4 flex items-start gap-3"
              style={{
                background: drawResult.success ? "rgba(168,179,170,0.12)" : "#fef2f2",
                border: `1px solid ${drawResult.success ? "#A8B3AA" : "#fecaca"}`,
              }}
            >
              {drawResult.success ? (
                <CheckCircle size={18} style={{ color: "#4a7c59", flexShrink: 0, marginTop: 1 }} />
              ) : (
                <AlertCircle size={18} style={{ color: "#e57373", flexShrink: 0, marginTop: 1 }} />
              )}
              <div>
                {drawResult.success && drawResult.winner ? (
                  <>
                    <p className="text-sm font-semibold" style={{ color: "#3B2F2A" }}>
                      🎉 Winner: {drawResult.winner.firstName} {drawResult.winner.lastName}
                    </p>
                    <p className="text-xs" style={{ color: "#4A4A4A" }}>
                      {drawResult.winner.email} — Notification email sent automatically.
                    </p>
                  </>
                ) : (
                  <p className="text-sm" style={{ color: "#e57373" }}>
                    {drawResult.reason === "already_drawn" && "A winner has already been drawn for this month."}
                    {drawResult.reason === "no_entries" && "No confirmed entries in the pool. Ask participants to confirm their email."}
                    {drawResult.reason === "error" && "An error occurred during the draw. Please try again."}
                  </p>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => { setDrawResult(null); drawMutation.mutate({}); }}
            disabled={drawMutation.isPending || !!thisMonthWinner}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: (drawMutation.isPending || !!thisMonthWinner) ? "#D8C6B6" : "#CFA7A0",
              color: "#ffffff",
              cursor: (drawMutation.isPending || !!thisMonthWinner) ? "not-allowed" : "pointer",
            }}
          >
            {drawMutation.isPending ? (
              <><Loader2 size={16} className="animate-spin" /> Drawing…</>
            ) : (
              <><Gift size={16} /> Draw Winner for {currentMonthLabel}</>
            )}
          </button>
          {thisMonthWinner && (
            <p className="text-xs mt-2" style={{ color: "#A8B3AA" }}>
              Winner already drawn: {thisMonthWinner.firstName} {thisMonthWinner.lastName} ({thisMonthWinner.email})
            </p>
          )}
        </div>

        {/* Tabs: Winners / Entries */}
        <div>
          <div className="flex gap-2 mb-4">
            {(["winners", "entries"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all"
                style={{
                  background: activeTab === tab ? "#CFA7A0" : "#fff",
                  color: activeTab === tab ? "#fff" : "#3B2F2A",
                  border: "1.5px solid #D8C6B6",
                }}
              >
                {tab === "winners" ? <><Trophy size={13} className="inline mr-1.5" />Past Winners</> : <><Users size={13} className="inline mr-1.5" />All Entries</>}
              </button>
            ))}
            {activeTab === "entries" && entries && entries.length > 0 && (
              <button
                onClick={() => exportEntriesCSV(entries)}
                className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: "#F7F3EE", color: "#3B2F2A", border: "1.5px solid #D8C6B6" }}
              >
                <Download size={13} /> Export CSV
              </button>
            )}
          </div>

          {/* Winners Table */}
          {activeTab === "winners" && (
            winners && winners.length > 0 ? (
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #D8C6B6" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#F7F3EE", borderBottom: "1px solid #D8C6B6" }}>
                      {["Month", "Winner", "Email", "Drawn At", "Notified"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#A8B3AA" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {winners.map((w, i) => (
                      <tr key={w.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#fafaf9", borderBottom: "1px solid #F7F3EE" }}>
                        <td className="px-4 py-3 font-semibold" style={{ color: "#3B2F2A" }}>
                          {new Date(w.drawMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3" style={{ color: "#3B2F2A" }}>{w.firstName} {w.lastName}</td>
                        <td className="px-4 py-3" style={{ color: "#4A4A4A" }}>{w.email}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#A8B3AA" }}>
                          {new Date(w.drawnAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          {w.notified ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(168,179,170,0.2)", color: "#4a7c59" }}>
                              <CheckCircle size={10} /> Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(207,167,160,0.15)", color: "#CFA7A0" }}>
                              <Clock size={10} /> Pending
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl" style={{ background: "#fff", border: "1px solid #D8C6B6" }}>
                <Trophy size={36} className="mx-auto mb-3" style={{ color: "#D8C6B6" }} />
                <p className="font-serif text-lg mb-1" style={{ color: "#3B2F2A" }}>No winners yet</p>
                <p className="text-sm" style={{ color: "#A8B3AA" }}>Draw the first winner using the button above.</p>
              </div>
            )
          )}

          {/* Entries Table */}
          {activeTab === "entries" && (
            entries && entries.length > 0 ? (
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #D8C6B6" }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#F7F3EE", borderBottom: "1px solid #D8C6B6" }}>
                      {["Name", "Email", "Confirmed At", "IP Address"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold" style={{ color: "#A8B3AA" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((e, i) => (
                      <tr key={e.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#fafaf9", borderBottom: "1px solid #F7F3EE" }}>
                        <td className="px-4 py-3 font-medium" style={{ color: "#3B2F2A" }}>{e.firstName} {e.lastName}</td>
                        <td className="px-4 py-3" style={{ color: "#4A4A4A" }}>
                          <div className="flex items-center gap-2">
                            <Mail size={12} style={{ color: "#CFA7A0" }} />
                            {e.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#A8B3AA" }}>
                          {e.confirmedAt ? new Date(e.confirmedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: "#A8B3AA" }}>{e.ipAddress ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3 text-xs" style={{ background: "#F7F3EE", color: "#A8B3AA", borderTop: "1px solid #D8C6B6" }}>
                  {entries.length} confirmed {entries.length === 1 ? "entry" : "entries"} in the drawing pool
                </div>
              </div>
            ) : (
              <div className="text-center py-16 rounded-2xl" style={{ background: "#fff", border: "1px solid #D8C6B6" }}>
                <Users size={36} className="mx-auto mb-3" style={{ color: "#D8C6B6" }} />
                <p className="font-serif text-lg mb-1" style={{ color: "#3B2F2A" }}>No confirmed entries yet</p>
                <p className="text-sm" style={{ color: "#A8B3AA" }}>Entries appear here once participants confirm their email.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
