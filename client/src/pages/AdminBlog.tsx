/**
 * Admin Blog Management — /admin/blog
 * Requires admin role. Lists all blog posts, allows create/edit/delete.
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  PlusCircle, Edit2, Trash2, Eye, EyeOff, Archive,
  ChevronLeft, Save, X, FileText, Globe, BookOpen, Loader2,
  Search, Filter, Tag, Calendar
} from "lucide-react";

// ─── Slug generator ───────────────────────────────────────────────────────────
function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "draft" | "published" | "archived" }) {
  const map = {
    draft: { bg: "#F7F3EE", color: "#A8B3AA", label: "Draft" },
    published: { bg: "rgba(168,179,170,0.2)", color: "#4a7c59", label: "Published" },
    archived: { bg: "rgba(207,167,160,0.15)", color: "#CFA7A0", label: "Archived" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}
    >
      {status === "published" ? <Globe size={10} /> : status === "draft" ? <FileText size={10} /> : <Archive size={10} />}
      {s.label}
    </span>
  );
}

// ─── Post Form ────────────────────────────────────────────────────────────────
interface PostFormProps {
  initial?: {
    id?: number;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    heroImage?: string;
    category?: string;
    tags?: string[];
    status?: "draft" | "published" | "archived";
    authorName?: string;
    readTime?: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

function PostForm({ initial, onSave, onCancel }: PostFormProps) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    heroImage: initial?.heroImage ?? "",
    category: initial?.category ?? "",
    tags: (initial?.tags ?? []).join(", "),
    status: initial?.status ?? "draft" as "draft" | "published" | "archived",
    authorName: initial?.authorName ?? "Wax Me Too Team",
    readTime: initial?.readTime ?? "",
  });
  const [slugManual, setSlugManual] = useState(isEdit);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && form.title) {
      setForm(f => ({ ...f, slug: toSlug(f.title) }));
    }
  }, [form.title, slugManual]);

  const createMutation = trpc.blog.create.useMutation({ onSuccess: onSave });
  const updateMutation = trpc.blog.update.useMutation({ onSuccess: onSave });

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.slug.trim()) e.slug = "Slug is required.";
    if (!/^[a-z0-9-]+$/.test(form.slug)) e.slug = "Slug must be lowercase letters, numbers, and hyphens only.";
    if (!form.content.trim()) e.content = "Content is required.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});

    const tags = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      excerpt: form.excerpt.trim() || undefined,
      content: form.content.trim(),
      heroImage: form.heroImage.trim() || undefined,
      category: form.category.trim() || undefined,
      tags,
      status: form.status,
      authorName: form.authorName.trim() || undefined,
      readTime: form.readTime.trim() || undefined,
    };

    if (isEdit && initial?.id) {
      updateMutation.mutate({ id: initial.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const serverError = createMutation.error?.message || updateMutation.error?.message;

  const inputStyle = (field: string) => ({
    border: errors[field] ? "1.5px solid #e57373" : "1.5px solid #D8C6B6",
    background: "#F7F3EE",
    color: "#3B2F2A",
    borderRadius: "0.75rem",
    padding: "0.625rem 0.875rem",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>Title *</label>
        <input
          type="text" value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          style={inputStyle("title")} placeholder="e.g. The Ultimate Brazilian Wax Guide"
        />
        {errors.title && <p className="text-xs mt-1" style={{ color: "#e57373" }}>{errors.title}</p>}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>Slug *</label>
        <input
          type="text" value={form.slug}
          onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: e.target.value })); }}
          style={inputStyle("slug")} placeholder="e.g. ultimate-brazilian-wax-guide"
        />
        {errors.slug && <p className="text-xs mt-1" style={{ color: "#e57373" }}>{errors.slug}</p>}
        <p className="text-xs mt-1" style={{ color: "#A8B3AA" }}>URL: /blog/{form.slug || "…"}</p>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>Excerpt</label>
        <textarea
          value={form.excerpt} rows={2}
          onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
          style={{ ...inputStyle("excerpt"), resize: "vertical" }}
          placeholder="Short description shown in blog listings (max 500 chars)"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>Content * (Markdown supported)</label>
        <textarea
          value={form.content} rows={14}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          style={{ ...inputStyle("content"), resize: "vertical", fontFamily: "monospace", fontSize: "0.8rem" }}
          placeholder="Write your blog post content here. Markdown is supported."
        />
        {errors.content && <p className="text-xs mt-1" style={{ color: "#e57373" }}>{errors.content}</p>}
      </div>

      {/* Hero Image */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>Hero Image URL</label>
        <input
          type="url" value={form.heroImage}
          onChange={e => setForm(f => ({ ...f, heroImage: e.target.value }))}
          style={inputStyle("heroImage")} placeholder="https://…"
        />
      </div>

      {/* Row: Category + Author + Read Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>Category</label>
          <input
            type="text" value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            style={inputStyle("category")} placeholder="e.g. Skin Care"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>Author</label>
          <input
            type="text" value={form.authorName}
            onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))}
            style={inputStyle("authorName")} placeholder="Wax Me Too Team"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>Read Time</label>
          <input
            type="text" value={form.readTime}
            onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))}
            style={inputStyle("readTime")} placeholder="e.g. 5 min read"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>Tags (comma-separated)</label>
        <input
          type="text" value={form.tags}
          onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
          style={inputStyle("tags")} placeholder="e.g. waxing, skin care, tips"
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold mb-1" style={{ color: "#3B2F2A" }}>Status</label>
        <select
          value={form.status}
          onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
          style={{ ...inputStyle("status"), appearance: "auto" }}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {serverError && (
        <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#fef2f2", color: "#e57373", border: "1px solid #fecaca" }}>
          {serverError}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit" disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: isPending ? "#D8C6B6" : "#CFA7A0", color: "#fff", cursor: isPending ? "not-allowed" : "pointer" }}
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isEdit ? "Save Changes" : "Create Post"}
        </button>
        <button
          type="button" onClick={onCancel}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "#F7F3EE", color: "#3B2F2A", border: "1.5px solid #D8C6B6" }}
        >
          <X size={14} /> Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type View = "list" | "create" | "edit";

export default function AdminBlog() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [view, setView] = useState<View>("list");
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.blog.list.useQuery(
    { status: statusFilter === "all" ? undefined : statusFilter },
    { enabled: !!user && user.role === "admin" }
  );
  const { data: stats } = trpc.blog.stats.useQuery(undefined, { enabled: !!user && user.role === "admin" });
  const { data: editPost } = trpc.blog.get.useQuery(
    { id: editId! },
    { enabled: view === "edit" && editId !== null }
  );
  const deleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      utils.blog.list.invalidate();
      utils.blog.stats.invalidate();
      setDeleteConfirm(null);
    },
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F3EE" }}>
        <Loader2 className="animate-spin" style={{ color: "#CFA7A0" }} size={32} />
      </div>
    );
  }

  if (!user || user.role !== "admin") return null;

  const filtered = (posts ?? []).filter(p =>
    search === "" ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category ?? "").toLowerCase().includes(search.toLowerCase())
  );

  function handleSave() {
    utils.blog.list.invalidate();
    utils.blog.stats.invalidate();
    setView("list");
    setEditId(null);
  }

  return (
    <div className="min-h-screen" style={{ background: "#F7F3EE" }}>
      {/* Header */}
      <div className="sticky top-0 z-20 border-b" style={{ background: "#ffffff", borderColor: "#D8C6B6" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <span className="flex items-center gap-1.5 text-sm cursor-pointer" style={{ color: "#A8B3AA" }}>
                <ChevronLeft size={16} /> Admin
              </span>
            </Link>
            <span style={{ color: "#D8C6B6" }}>/</span>
            <span className="font-semibold text-sm" style={{ color: "#3B2F2A" }}>Blog Management</span>
          </div>
          {view === "list" && (
            <button
              onClick={() => setView("create")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#CFA7A0", color: "#fff" }}
            >
              <PlusCircle size={15} /> New Post
            </button>
          )}
          {view !== "list" && (
            <button
              onClick={() => { setView("list"); setEditId(null); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#F7F3EE", color: "#3B2F2A", border: "1.5px solid #D8C6B6" }}
            >
              <ChevronLeft size={15} /> Back to List
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats row */}
        {view === "list" && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Posts", value: stats.total, icon: <BookOpen size={18} /> },
              { label: "Published", value: stats.published, icon: <Globe size={18} /> },
              { label: "Drafts", value: stats.draft, icon: <FileText size={18} /> },
              { label: "Archived", value: stats.archived, icon: <Archive size={18} /> },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-5" style={{ background: "#fff", border: "1px solid #D8C6B6" }}>
                <div className="flex items-center gap-2 mb-2" style={{ color: "#CFA7A0" }}>{s.icon}</div>
                <p className="font-display text-3xl font-bold" style={{ color: "#3B2F2A" }}>{s.value}</p>
                <p className="text-xs" style={{ color: "#A8B3AA" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit form */}
        {(view === "create" || view === "edit") && (
          <div className="rounded-2xl p-8" style={{ background: "#fff", border: "1px solid #D8C6B6" }}>
            <h2 className="font-serif text-2xl mb-6" style={{ color: "#3B2F2A" }}>
              {view === "create" ? "Create New Post" : "Edit Post"}
            </h2>
            {view === "edit" && !editPost ? (
              <div className="flex items-center gap-2" style={{ color: "#A8B3AA" }}>
                <Loader2 size={16} className="animate-spin" /> Loading post…
              </div>
            ) : (
              <PostForm
                initial={editPost ? {
                  id: editPost.id,
                  title: editPost.title,
                  slug: editPost.slug,
                  excerpt: editPost.excerpt ?? "",
                  content: editPost.content,
                  heroImage: editPost.heroImage ?? "",
                  category: editPost.category ?? "",
                  tags: editPost.tags ?? [],
                  status: editPost.status,
                  authorName: editPost.authorName ?? "",
                  readTime: editPost.readTime ?? "",
                } : undefined}
                onSave={handleSave}
                onCancel={() => { setView("list"); setEditId(null); }}
              />
            )}
          </div>
        )}

        {/* Post list */}
        {view === "list" && (
          <>
            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#A8B3AA" }} />
                <input
                  type="text" value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search posts…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ border: "1.5px solid #D8C6B6", background: "#fff", color: "#3B2F2A" }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ border: "1.5px solid #D8C6B6", background: "#fff", color: "#3B2F2A", minWidth: 140 }}
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20" style={{ color: "#A8B3AA" }}>
                <Loader2 size={24} className="animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <FileText size={40} className="mx-auto mb-3" style={{ color: "#D8C6B6" }} />
                <p className="font-serif text-xl mb-2" style={{ color: "#3B2F2A" }}>No posts found</p>
                <p className="text-sm mb-6" style={{ color: "#A8B3AA" }}>
                  {search ? "Try a different search term." : "Create your first blog post to get started."}
                </p>
                {!search && (
                  <button
                    onClick={() => setView("create")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold mx-auto"
                    style={{ background: "#CFA7A0", color: "#fff" }}
                  >
                    <PlusCircle size={15} /> Create First Post
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(post => (
                  <div
                    key={post.id}
                    className="rounded-2xl p-5 flex items-start gap-4"
                    style={{ background: "#fff", border: "1px solid #D8C6B6" }}
                  >
                    {/* Hero thumbnail */}
                    {post.heroImage ? (
                      <img
                        src={post.heroImage} alt=""
                        className="w-20 h-14 object-cover rounded-xl flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-14 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "#F7F3EE" }}>
                        <FileText size={20} style={{ color: "#D8C6B6" }} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-semibold text-sm leading-snug" style={{ color: "#3B2F2A" }}>{post.title}</h3>
                        <StatusBadge status={post.status} />
                      </div>
                      <p className="text-xs mb-2 truncate" style={{ color: "#A8B3AA" }}>
                        /blog/{post.slug}
                        {post.category && <> · {post.category}</>}
                        {post.readTime && <> · {post.readTime}</>}
                      </p>
                      {post.excerpt && (
                        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#4A4A4A" }}>{post.excerpt}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                        className="p-2 rounded-lg transition-colors"
                        style={{ background: "#F7F3EE", color: "#A8B3AA" }}
                        title="View post"
                      >
                        <Eye size={14} />
                      </a>
                      <button
                        onClick={() => { setEditId(post.id); setView("edit"); }}
                        className="p-2 rounded-lg transition-colors"
                        style={{ background: "#F7F3EE", color: "#3B2F2A" }}
                        title="Edit post"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ background: "#fef2f2", color: "#e57373" }}
                        title="Delete post"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="rounded-2xl p-8 max-w-sm w-full mx-4" style={{ background: "#fff" }}>
            <h3 className="font-serif text-xl mb-3" style={{ color: "#3B2F2A" }}>Delete Post?</h3>
            <p className="text-sm mb-6" style={{ color: "#4A4A4A" }}>
              This action cannot be undone. The post will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteMutation.mutate({ id: deleteConfirm })}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "#e57373", color: "#fff" }}
              >
                {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
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
