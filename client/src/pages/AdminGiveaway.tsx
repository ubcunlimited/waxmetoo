/**
 * Admin Giveaway Dashboard
 * Route: /admin/giveaway
 *
 * Protected: requires user.role === 'admin'
 * Shows: confirmed entry count, draw winner button, past winners table, all entries table
 */

import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  Gift,
  Users,
  Trophy,
  RefreshCw,
  ChevronLeft,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(207,167,160,0.15)" }}
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

export default function AdminGiveaway() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useAuth();

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const statsQuery = trpc.giveaway.stats.useQuery(undefined, {
    enabled: user?.role === "admin",
    refetchInterval: 30_000,
  });

  const winnersQuery = trpc.giveaway.winners.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const entriesQuery = trpc.giveaway.entries.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const utils = trpc.useUtils();

  const drawMutation = trpc.giveaway.drawWinner.useMutation({
    onSuccess() {
      utils.giveaway.stats.invalidate();
      utils.giveaway.winners.invalidate();
    },
  });

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#F7F3EE" }}
      >
        <Loader2 size={32} className="animate-spin" style={{ color: "#CFA7A0" }} />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const alreadyDrawn = winnersQuery.data?.some((w) => w.drawMonth === currentMonth);

  function formatDate(d: Date | string | null) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatMonth(m: string) {
    const [year, month] = m.split("-");
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="min-h-screen" style={{ background: "#F7F3EE" }}>
      {/* Top Bar */}
      <div style={{ background: "#3B2F2A" }} className="px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm"
              style={{ color: "#D8C6B6" }}
            >
              <ChevronLeft size={16} />
              Back to Site
            </Link>
            <span style={{ color: "#5a3e38" }}>|</span>
            <span className="font-serif text-lg" style={{ color: "#F7F3EE" }}>
              Wax Me Too — Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "#CFA7A0", color: "#ffffff" }}
            >
              {user.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <span className="text-sm" style={{ color: "#D8C6B6" }}>
              {user.name ?? "Admin"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(207,167,160,0.2)" }}
            >
              <Gift size={20} style={{ color: "#CFA7A0" }} />
            </div>
            <h1 className="font-serif text-3xl" style={{ color: "#3B2F2A" }}>
              Giveaway Dashboard
            </h1>
          </div>
          <p className="text-sm" style={{ color: "#A8B3AA" }}>
            Manage the Win a Free Wax monthly giveaway — view entries, draw winners, and track past draws.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Users size={20} style={{ color: "#CFA7A0" }} />}
            label="Confirmed Entries"
            value={statsQuery.isLoading ? "…" : (statsQuery.data?.confirmedCount ?? 0)}
            sub="Eligible for the monthly draw"
          />
          <StatCard
            icon={<Trophy size={20} style={{ color: "#CFA7A0" }} />}
            label="Past Winners Drawn"
            value={winnersQuery.isLoading ? "…" : (winnersQuery.data?.length ?? 0)}
            sub="Since the giveaway launched"
          />
          <StatCard
            icon={<Clock size={20} style={{ color: "#CFA7A0" }} />}
            label="Current Month"
            value={currentMonthLabel}
            sub={alreadyDrawn ? "Winner already drawn ✓" : "No winner drawn yet"}
          />
        </div>

        {/* Draw Winner Card */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
        >
          <h2 className="font-serif text-xl mb-1" style={{ color: "#3B2F2A" }}>
            Monthly Draw
          </h2>
          <p className="text-sm mb-4" style={{ color: "#A8B3AA" }}>
            Randomly select one winner from all confirmed entries for {currentMonthLabel}.
          </p>

          {alreadyDrawn ? (
            <div
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
              style={{ background: "rgba(207,167,160,0.12)", border: "1px solid #CFA7A0" }}
            >
              <CheckCircle size={18} style={{ color: "#CFA7A0" }} />
              <span style={{ color: "#3B2F2A" }}>
                A winner has already been drawn for {currentMonthLabel}. See the winners table below.
              </span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => drawMutation.mutate({ month: currentMonth })}
                disabled={drawMutation.isPending || (statsQuery.data?.confirmedCount ?? 0) === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all"
                style={{
                  background:
                    drawMutation.isPending || (statsQuery.data?.confirmedCount ?? 0) === 0
                      ? "#D8C6B6"
                      : "#CFA7A0",
                  color: "#ffffff",
                  cursor:
                    drawMutation.isPending || (statsQuery.data?.confirmedCount ?? 0) === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {drawMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Drawing…
                  </>
                ) : (
                  <>
                    <Trophy size={16} />
                    Draw {currentMonthLabel} Winner
                  </>
                )}
              </button>

              {(statsQuery.data?.confirmedCount ?? 0) === 0 && (
                <p className="text-xs" style={{ color: "#e57373" }}>
                  No confirmed entries yet — cannot draw a winner.
                </p>
              )}
            </div>
          )}

          {/* Draw result */}
          {drawMutation.isSuccess && drawMutation.data && (
            <div className="mt-4">
              {drawMutation.data.reason === "drawn" && drawMutation.data.winner && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "rgba(207,167,160,0.12)", border: "1px solid #CFA7A0" }}
                >
                  <p className="font-semibold mb-1" style={{ color: "#3B2F2A" }}>
                    🎉 Winner drawn!
                  </p>
                  <p style={{ color: "#4A4A4A" }}>
                    {(drawMutation.data.winner as any).firstName}{" "}
                    {(drawMutation.data.winner as any).lastName} —{" "}
                    {(drawMutation.data.winner as any).email}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#A8B3AA" }}>
                    Winner notification email sent automatically.
                  </p>
                </div>
              )}
              {drawMutation.data.reason === "already_drawn" && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                >
                  <p style={{ color: "#e57373" }}>A winner was already drawn for this month.</p>
                </div>
              )}
              {drawMutation.data.reason === "no_entries" && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                >
                  <p style={{ color: "#e57373" }}>No confirmed entries to draw from.</p>
                </div>
              )}
            </div>
          )}

          {drawMutation.isError && (
            <div
              className="mt-4 rounded-xl px-4 py-3 text-sm flex items-center gap-2"
              style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
            >
              <AlertCircle size={16} style={{ color: "#e57373" }} />
              <span style={{ color: "#e57373" }}>
                {drawMutation.error?.message ?? "Failed to draw winner. Please try again."}
              </span>
            </div>
          )}
        </div>

        {/* Past Winners Table */}
        <div
          className="rounded-2xl p-6 mb-8"
          style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl" style={{ color: "#3B2F2A" }}>
              Past Winners
            </h2>
            <button
              onClick={() => winnersQuery.refetch()}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
              style={{ background: "#F7F3EE", color: "#A8B3AA", border: "1px solid #D8C6B6" }}
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>

          {winnersQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin" style={{ color: "#CFA7A0" }} />
            </div>
          ) : (winnersQuery.data?.length ?? 0) === 0 ? (
            <div className="text-center py-8">
              <Trophy size={32} className="mx-auto mb-2" style={{ color: "#D8C6B6" }} />
              <p className="text-sm" style={{ color: "#A8B3AA" }}>
                No winners drawn yet. Use the draw button above to select the first winner.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #D8C6B6" }}>
                    {["Month", "Name", "Email", "Drawn On", "Notified"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 font-semibold text-xs uppercase tracking-wide"
                        style={{ color: "#A8B3AA" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...(winnersQuery.data ?? [])].reverse().map((w) => (
                    <tr
                      key={w.id}
                      style={{ borderBottom: "1px solid #F7F3EE" }}
                      className="hover:bg-[#F7F3EE] transition-colors"
                    >
                      <td className="py-3 px-3 font-medium" style={{ color: "#3B2F2A" }}>
                        {formatMonth(w.drawMonth)}
                      </td>
                      <td className="py-3 px-3" style={{ color: "#4A4A4A" }}>
                        {w.firstName} {w.lastName}
                      </td>
                      <td className="py-3 px-3" style={{ color: "#4A4A4A" }}>
                        {w.email}
                      </td>
                      <td className="py-3 px-3" style={{ color: "#A8B3AA" }}>
                        {formatDate(w.drawnAt)}
                      </td>
                      <td className="py-3 px-3">
                        {w.notified ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: "rgba(207,167,160,0.15)", color: "#CFA7A0" }}
                          >
                            <CheckCircle size={11} /> Sent
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: "#F7F3EE", color: "#A8B3AA" }}
                          >
                            <Clock size={11} /> Pending
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

        {/* All Entries Table */}
        <div
          className="rounded-2xl p-6"
          style={{ background: "#ffffff", border: "1px solid #D8C6B6" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl" style={{ color: "#3B2F2A" }}>
                All Confirmed Entries
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#A8B3AA" }}>
                {entriesQuery.data?.length ?? 0} total confirmed entries
              </p>
            </div>
            <button
              onClick={() => entriesQuery.refetch()}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg"
              style={{ background: "#F7F3EE", color: "#A8B3AA", border: "1px solid #D8C6B6" }}
            >
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>

          {entriesQuery.isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin" style={{ color: "#CFA7A0" }} />
            </div>
          ) : (entriesQuery.data?.length ?? 0) === 0 ? (
            <div className="text-center py-8">
              <Users size={32} className="mx-auto mb-2" style={{ color: "#D8C6B6" }} />
              <p className="text-sm" style={{ color: "#A8B3AA" }}>
                No confirmed entries yet. Share the giveaway page to start collecting entries!
              </p>
              <Link
                href="/win-a-free-wax"
                className="inline-flex items-center gap-1 mt-3 text-sm"
                style={{ color: "#CFA7A0" }}
              >
                <Gift size={14} /> View Giveaway Page
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #D8C6B6" }}>
                    {["#", "Name", "Email", "Entered On", "Confirmed On"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 font-semibold text-xs uppercase tracking-wide"
                        style={{ color: "#A8B3AA" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...(entriesQuery.data ?? [])].reverse().map((e, i, arr) => (
                    <tr
                      key={e.id}
                      style={{ borderBottom: "1px solid #F7F3EE" }}
                      className="hover:bg-[#F7F3EE] transition-colors"
                    >
                      <td className="py-3 px-3 text-xs" style={{ color: "#A8B3AA" }}>
                        {arr.length - i}
                      </td>
                      <td className="py-3 px-3 font-medium" style={{ color: "#3B2F2A" }}>
                        {e.firstName} {e.lastName}
                      </td>
                      <td className="py-3 px-3" style={{ color: "#4A4A4A" }}>
                        {e.email}
                      </td>
                      <td className="py-3 px-3" style={{ color: "#A8B3AA" }}>
                        {formatDate(e.createdAt)}
                      </td>
                      <td className="py-3 px-3" style={{ color: "#A8B3AA" }}>
                        {formatDate(e.confirmedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
