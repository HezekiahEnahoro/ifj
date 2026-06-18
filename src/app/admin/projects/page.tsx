"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Edit2, Upload, Save, CheckCircle, ArrowLeft, Star } from "lucide-react";
import type { Project, ProjectCategory } from "@/lib/types";

const CATEGORIES: { id: ProjectCategory; label: string }[] = [
  { id: "tableau",    label: "Tableau"           },
  { id: "power-bi",   label: "Power BI"          },
  { id: "analytics",  label: "Analytics"         },
  { id: "data-viz",   label: "Data Visualization" },
];

const EMPTY_PROJECT: Omit<Project, "id" | "created_at"> = {
  title: "",
  category: "tableau",
  description: "",
  long_description: "",
  technologies: [],
  image: "",
  images: [],
  demo_url: "",
  github_url: "",
  featured: false,
  metrics: [],
  challenges: [],
  solutions: [],
  outcomes: [],
  sort_order: 0,
};

function slug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const fieldStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f1f5f9",
  borderRadius: "0.75rem",
  padding: "0.625rem 0.875rem",
  width: "100%",
  fontSize: "0.875rem",
  outline: "none",
};

const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600 as const,
  color: "#94a3b8",
  marginBottom: "0.375rem",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "edit">("list");
  const [editing, setEditing] = useState<Partial<Project> & typeof EMPTY_PROJECT>(EMPTY_PROJECT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  function openNew() {
    setEditing({ ...EMPTY_PROJECT });
    setEditingId(null);
    setTechInput("");
    setView("edit");
  }

  function openEdit(p: Project) {
    setEditing({ ...p });
    setEditingId(p.id);
    setTechInput(p.technologies.join(", "));
    setView("edit");
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { ...editing, technologies };

    if (editingId) {
      await fetch(`/api/admin/projects/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...payload } as Project : p))
      );
    } else {
      const id = slug(editing.title) || `project-${Date.now()}`;
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, id }),
      });
      const created = await res.json();
      if (created && !created.error) setProjects((prev) => [...prev, created]);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setView("list");
    }, 1200);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "projects");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    if (url) setEditing((p) => ({ ...p, image: url }));
    setUploading(false);
  }

  function updateArrayField(field: "challenges" | "solutions" | "outcomes", index: number, val: string) {
    const arr = [...(editing[field] as string[])];
    arr[index] = val;
    setEditing((p) => ({ ...p, [field]: arr }));
  }

  function addArrayItem(field: "challenges" | "solutions" | "outcomes") {
    setEditing((p) => ({ ...p, [field]: [...(p[field] as string[]), ""] }));
  }

  function removeArrayItem(field: "challenges" | "solutions" | "outcomes", index: number) {
    setEditing((p) => ({ ...p, [field]: (p[field] as string[]).filter((_, i) => i !== index) }));
  }

  function updateMetric(index: number, key: "label" | "value", val: string) {
    const metrics = [...(editing.metrics ?? [])];
    metrics[index] = { ...metrics[index], [key]: val };
    setEditing((p) => ({ ...p, metrics }));
  }

  if (loading) return <div className="p-8" style={{ color: "#94a3b8" }}>Loading…</div>;

  /* ── LIST VIEW ───────────────────────────── */
  if (view === "list") {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9", fontFamily: "Syne, sans-serif" }}>
              Projects
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
              {projects.length} project{projects.length !== 1 ? "s" : ""} · click Edit to update
            </p>
          </div>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #00d9ff, #a855f7)",
              color: "#050812",
              boxShadow: "0 0 20px rgba(0,217,255,0.25)",
            }}
          >
            <Plus size={15} /> Add Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}
          >
            <p className="text-4xl mb-3">📊</p>
            <p className="font-semibold mb-1" style={{ color: "#f1f5f9" }}>No projects yet</p>
            <p className="text-sm mb-5" style={{ color: "#64748b" }}>Add your first Tableau dashboard or analytics project</p>
            <button
              onClick={openNew}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #00d9ff, #a855f7)", color: "#050812" }}
            >
              Add First Project
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Thumbnail */}
                <div
                  className="w-16 h-12 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={64}
                      height={48}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">📊</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm truncate" style={{ color: "#f1f5f9" }}>{p.title}</p>
                    {p.featured && <Star size={12} style={{ color: "#fbbf24" }} fill="#fbbf24" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ background: "rgba(0,217,255,0.1)", color: "#00d9ff" }}
                    >
                      {CATEGORIES.find((c) => c.id === p.category)?.label ?? p.category}
                    </span>
                    <span className="text-xs" style={{ color: "#475569" }}>
                      {p.technologies.slice(0, 3).join(" · ")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(248,113,113,0.08)", color: "#f87171" }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── EDIT / ADD FORM ─────────────────────── */
  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView("list")}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9", fontFamily: "Syne, sans-serif" }}>
              {editingId ? "Edit Project" : "Add Project"}
            </h1>
            <p className="text-sm" style={{ color: "#64748b" }}>Fill in as much or as little as you like</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !editing.title}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
          style={{
            background: saved ? "rgba(52,211,153,0.15)" : "linear-gradient(135deg, #00d9ff, #a855f7)",
            color: saved ? "#34d399" : "#050812",
            border: saved ? "1px solid rgba(52,211,153,0.3)" : "none",
          }}
        >
          {saved ? <><CheckCircle size={15} /> Saved</> : saving ? "Saving…" : <><Save size={15} /> Save</>}
        </button>
      </div>

      <div className="space-y-6">
        {/* Title + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Project Title *</label>
            <input
              style={fieldStyle}
              value={editing.title}
              onChange={(e) => setEditing((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Sales Performance Dashboard"
            />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select
              style={{ ...fieldStyle, cursor: "pointer" }}
              value={editing.category}
              onChange={(e) => setEditing((p) => ({ ...p, category: e.target.value as ProjectCategory }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} style={{ background: "#0a0f1e" }}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing((p) => ({ ...p, featured: !p.featured }))}
            className="w-11 h-6 rounded-full relative transition-all"
            style={{
              background: editing.featured ? "linear-gradient(90deg, #00d9ff, #a855f7)" : "rgba(255,255,255,0.1)",
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
              style={{ transform: editing.featured ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
          <span className="text-sm" style={{ color: "#94a3b8" }}>
            Feature this project on the homepage
          </span>
        </div>

        {/* Short description */}
        <div>
          <label style={labelStyle}>Short Description (shown on the card)</label>
          <textarea
            style={{ ...fieldStyle, resize: "vertical", minHeight: "72px" }}
            value={editing.description}
            onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
            placeholder="1–2 sentences summarising what this project does."
          />
        </div>

        {/* Long description */}
        <div>
          <label style={labelStyle}>Full Overview (shown on the project detail page)</label>
          <textarea
            style={{ ...fieldStyle, resize: "vertical", minHeight: "120px" }}
            value={editing.long_description}
            onChange={(e) => setEditing((p) => ({ ...p, long_description: e.target.value }))}
            placeholder="Describe the project in detail — the data, the approach, the tools used, the audience."
          />
        </div>

        {/* Screenshot */}
        <div>
          <label style={labelStyle}>Screenshot / Preview Image</label>
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px dashed rgba(255,255,255,0.12)",
              minHeight: "120px",
            }}
          >
            {editing.image ? (
              <div className="relative h-40">
                <Image
                  src={editing.image}
                  alt="preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  onClick={() => setEditing((p) => ({ ...p, image: "" }))}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.7)", color: "#f87171" }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-8 gap-2 cursor-pointer"
                onClick={() => imageInputRef.current?.click()}
              >
                <Upload size={20} style={{ color: "#475569" }} />
                <p className="text-sm" style={{ color: "#64748b" }}>
                  {uploading ? "Uploading…" : "Click to upload a screenshot"}
                </p>
              </div>
            )}
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {!editing.image && (
            <p className="text-xs mt-1" style={{ color: "#475569" }}>Or paste a URL directly:</p>
          )}
          {!editing.image && (
            <input
              style={{ ...fieldStyle, marginTop: "0.375rem" }}
              value={editing.image}
              onChange={(e) => setEditing((p) => ({ ...p, image: e.target.value }))}
              placeholder="https://… (paste a public image URL)"
            />
          )}
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Live Dashboard / Demo URL</label>
            <input
              style={fieldStyle}
              value={editing.demo_url ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, demo_url: e.target.value }))}
              placeholder="https://public.tableau.com/…"
            />
          </div>
          <div>
            <label style={labelStyle}>GitHub URL (optional)</label>
            <input
              style={fieldStyle}
              value={editing.github_url ?? ""}
              onChange={(e) => setEditing((p) => ({ ...p, github_url: e.target.value }))}
              placeholder="https://github.com/…"
            />
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label style={labelStyle}>Tools & Technologies (comma-separated)</label>
          <input
            style={fieldStyle}
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Tableau, SQL, Python, Excel, Power BI"
          />
          <p className="text-xs mt-1" style={{ color: "#475569" }}>
            Separate each tool with a comma
          </p>
        </div>

        {/* Metrics */}
        <div>
          <label style={labelStyle}>Key Metrics (optional — shown as stat cards)</label>
          <div className="space-y-2">
            {(editing.metrics ?? []).map((m, i) => (
              <div key={i} className="flex gap-2">
                <input
                  style={{ ...fieldStyle, width: "35%" }}
                  value={m.value}
                  onChange={(e) => updateMetric(i, "value", e.target.value)}
                  placeholder="e.g. 50%"
                />
                <input
                  style={{ ...fieldStyle, flex: 1 }}
                  value={m.label}
                  onChange={(e) => updateMetric(i, "label", e.target.value)}
                  placeholder="e.g. Reduction in report time"
                />
                <button
                  onClick={() => setEditing((p) => ({ ...p, metrics: (p.metrics ?? []).filter((_, j) => j !== i) }))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setEditing((p) => ({ ...p, metrics: [...(p.metrics ?? []), { value: "", label: "" }] }))}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "#00d9ff" }}
          >
            <Plus size={12} /> Add Metric
          </button>
        </div>

        {/* Challenges / Solutions / Outcomes */}
        {(["challenges", "solutions", "outcomes"] as const).map((field) => (
          <div key={field}>
            <label style={labelStyle}>
              {field.charAt(0).toUpperCase() + field.slice(1)} (optional bullet points)
            </label>
            <div className="space-y-2">
              {(editing[field] as string[]).map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    style={{ ...fieldStyle, flex: 1 }}
                    value={item}
                    onChange={(e) => updateArrayField(field, i, e.target.value)}
                    placeholder={`${field.charAt(0).toUpperCase() + field.slice(1, -1)} ${i + 1}…`}
                  />
                  <button
                    onClick={() => removeArrayItem(field, i)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => addArrayItem(field)}
              className="mt-2 flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "#00d9ff" }}
            >
              <Plus size={12} /> Add {field.slice(0, -1)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
