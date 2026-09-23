"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { IBlogPost } from "@/schemas/types";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Calendar,
  Clock,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

async function fetchAdminPosts(): Promise<IBlogPost[]> {
  const res = await fetch("/api/blog?admin=true");
  if (!res.ok) throw new Error("Failed to load journal articles");
  return res.json();
}

async function savePost(id: string | null, data: Partial<IBlogPost>) {
  const url = id ? `/api/blog/${id}` : "/api/blog";
  const res = await fetch(url, {
    method: id ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save post");
  return res.json();
}

async function deletePostApi(id: string) {
  const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
}

export default function JournalManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPost, setEditingPost] = useState<IBlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: fetchAdminPosts,
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | null; data: Partial<IBlogPost> }) => savePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      setEditingPost(null);
      setIsCreating(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePostApi(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  const togglePublishedMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) => savePost(id, { isPublished }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    const term = searchTerm.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term)
    );
  }, [posts, searchTerm]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-black/5 text-center text-sm text-muted-foreground animate-pulse">
        Loading journal archives…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-black/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search journal articles…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm bg-muted/20 focus:bg-white transition"
          />
        </div>

        <button
          onClick={() => {
            setEditingPost(null);
            setIsCreating(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Draft New Article
        </button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => {
          const wordCount = post.content.split(/\s+/).length;
          const readTime = Math.max(1, Math.ceil(wordCount / 200));

          return (
            <div
              key={post._id}
              className="bg-white rounded-2xl overflow-hidden border border-black/10 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 w-full bg-muted">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                      No cover photo
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold shadow-xs ${
                        post.isPublished ? "bg-emerald-600 text-white" : "bg-zinc-700 text-white"
                      }`}
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span>·</span>
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{readTime} min read</span>
                  </div>

                  <h3 className="font-display text-xl font-semibold text-foreground line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {post.content.slice(0, 140)}…
                  </p>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-4 bg-muted/20 border-t border-black/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => togglePublishedMutation.mutate({ id: post._id, isPublished: !post.isPublished })}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 rounded-md hover:bg-white"
                >
                  {post.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{post.isPublished ? "Unpublish" : "Publish"}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingPost(post);
                    }}
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition px-2.5 py-1.5 rounded-lg hover:bg-primary/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Permanently delete article "${post.title}"?`)) {
                        deleteMutation.mutate(post._id);
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:text-rose-600 transition rounded-lg hover:bg-rose-50"
                    title="Delete Article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Journal Editor Modal */}
      {(isCreating || editingPost) && (
        <JournalEditorModal
          post={editingPost}
          onClose={() => {
            setIsCreating(false);
            setEditingPost(null);
          }}
          onSave={(data) => {
            saveMutation.mutate({
              id: editingPost?._id ?? null,
              data,
            });
          }}
          isSaving={saveMutation.isPending}
        />
      )}
    </div>
  );
}

function JournalEditorModal({
  post,
  onClose,
  onSave,
  isSaving,
}: {
  post: IBlogPost | null;
  onClose: () => void;
  onSave: (data: Partial<IBlogPost>) => void;
  isSaving: boolean;
}) {
  const isNew = !post;
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [isPublished, setIsPublished] = useState(post?.isPublished ?? true);

  const handleTitleBlur = () => {
    if (isNew && !slug) {
      setSlug(
        title
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
      );
    }
  };

  const wordCount = content.trim().length > 0 ? content.trim().split(/\s+/).length : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      coverImage: coverImage || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
      content,
      isPublished,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl border border-black/10 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-black/10 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              {isNew ? "Compose Travel Guide" : `Edit Article: ${post.title}`}
            </h2>
            <p className="text-xs text-muted-foreground">Publish SEO travel guides, insider tips, and seasonal itinerary recommendations.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Article Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder="e.g. When to Visit Sri Lanka: Weather & Monsoons"
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">URL Slug</label>
              <input
                required
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. when-to-visit-sri-lanka"
                className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full border rounded-xl px-3 py-2 text-sm bg-muted/20 focus:bg-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-foreground">
                Article Narrative & Body
              </label>
              <span className="text-[11px] text-muted-foreground">
                {wordCount} words · ~{Math.max(1, Math.ceil(wordCount / 200))} min read
              </span>
            </div>
            <textarea
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write detailed guidance, historical context, and recommendations for travelers…"
              className="w-full border rounded-xl p-3 text-sm bg-muted/20 focus:bg-white font-sans leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPostPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-primary"
            />
            <label htmlFor="isPostPublished" className="text-xs font-medium cursor-pointer">
              Publish publicly on Travel Journal / Blog
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-black/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-black/10 text-xs font-medium hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition shadow-sm disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {isSaving ? "Saving…" : isNew ? "Publish Article" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
