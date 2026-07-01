"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, CheckCircle, Pencil, X } from "lucide-react";
import type { Skill } from "@/lib/types";

const PRESET_COLORS = [
  "#00d9ff", "#a855f7", "#34d399", "#818cf8",
  "#f472b6", "#fb923c", "#fbbf24", "#22d3ee",
];

const fieldStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f1f5f9",
  borderRadius: "0.75rem",
  padding: "0.5rem 0.75rem",
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

type SkillsByCategory = Record<string, { color: string; skills: Skill[] }>;

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<{ name: string; level: number }>({ name: "", level: 75 });
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    fetch("/api/admin/skills")
      .then((r) => r.json())
      .then((data) => setSkills(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const grouped: SkillsByCategory = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = { color: s.category_color, skills: [] };
    acc[s.category].skills.push(s);
    return acc;
  }, {} as SkillsByCategory);

  function startEdit(skill: Skill) {
    setEditingId(skill.id);
    setEditDraft({ name: skill.name, level: skill.level });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({ name: "", level: 75 });
  }

  async function saveEdit(skill: Skill) {
    const updated = { ...skill, ...editDraft };
    setSavingId(skill.id);

    let res = await fetch("/api/admin/skills", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    // Retry once — catches CDN cache lag after a rapid add→save
    if (!res.ok) {
      await new Promise((r) => setTimeout(r, 800));
      res = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
    }

    setSavingId(null);

    if (!res.ok) {
      alert("Save failed — please try again.");
      return;
    }

    setSkills((prev) => prev.map((s) => (s.id === skill.id ? updated : s)));
    setSavedIds((prev) => new Set([...prev, skill.id]));
    setTimeout(() => setSavedIds((prev) => { const s = new Set(prev); s.delete(skill.id); return s; }), 1500);
    setEditingId(null);
    setEditDraft({ name: "", level: 75 });
  }

  async function deleteSkill(id: string) {
    if (!confirm("Remove this skill?")) return;
    await fetch("/api/admin/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }

  async function addSkill(category: string, color: string) {
    const payload = {
      category,
      category_color: color,
      name: "New Skill",
      level: 75,
      sort_order: grouped[category]?.skills.length ?? 0,
    };
    const res = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    if (created && !created.error) {
      setSkills((prev) => [...prev, created]);
      startEdit(created);
    }
  }

  async function addCategory() {
    const name = newCat.trim();
    if (!name) return;
    const color = PRESET_COLORS[Object.keys(grouped).length % PRESET_COLORS.length];
    const payload = { category: name, category_color: color, name: "New Skill", level: 75, sort_order: 0 };
    const res = await fetch("/api/admin/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const created = await res.json();
    if (created && !created.error) {
      setSkills((prev) => [...prev, created]);
      startEdit(created);
    }
    setNewCat("");
  }

  if (loading) return <div className="p-8" style={{ color: "#94a3b8" }}>Loading…</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9", fontFamily: "Syne, sans-serif" }}>
          Skills
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
          Manage your skills by category — click the pencil to edit a skill
        </p>
      </div>

      {Object.entries(grouped).map(([category, { color, skills: catSkills }]) => (
        <div
          key={category}
          className="mb-8 rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: color }} />
              <span className="font-bold text-sm" style={{ color: "#f1f5f9", fontFamily: "Syne, sans-serif" }}>
                {category}
              </span>
            </div>
            <button
              onClick={() => addSkill(category, color)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: `${color}15`, color, border: `1px solid ${color}33` }}
            >
              <Plus size={12} /> Add Skill
            </button>
          </div>

          <div className="space-y-3">
            {catSkills.map((skill) =>
              editingId === skill.id ? (
                /* ── Edit mode ── */
                <div
                  key={skill.id}
                  className="rounded-xl p-3 space-y-2"
                  style={{ background: `${color}08`, border: `1px solid ${color}33` }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      style={{ ...fieldStyle, flex: 1 }}
                      value={editDraft.name}
                      onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                      placeholder="Skill name"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(skill);
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                    <span className="text-xs font-bold w-10 text-right flex-shrink-0" style={{ color }}>
                      {editDraft.level}%
                    </span>
                    <button
                      onClick={() => saveEdit(skill)}
                      disabled={savingId === skill.id}
                      title="Save"
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: savedIds.has(skill.id) ? "rgba(52,211,153,0.15)" : `${color}20`,
                        color: savedIds.has(skill.id) ? "#34d399" : color,
                      }}
                    >
                      {savedIds.has(skill.id) ? <CheckCircle size={13} /> : <Save size={13} />}
                    </button>
                    <button
                      onClick={cancelEdit}
                      title="Cancel"
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs w-12 flex-shrink-0" style={{ color: "#475569" }}>0%</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={editDraft.level}
                      onChange={(e) => setEditDraft((d) => ({ ...d, level: parseInt(e.target.value) }))}
                      className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${color} 0%, ${color} ${editDraft.level}%, rgba(255,255,255,0.1) ${editDraft.level}%, rgba(255,255,255,0.1) 100%)`,
                      }}
                    />
                    <span className="text-xs w-12 text-right flex-shrink-0" style={{ color: "#475569" }}>100%</span>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div key={skill.id} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-sm font-medium" style={{ color: "#f1f5f9" }}>
                      {skill.name}
                    </span>
                    <span className="text-xs font-bold w-10 text-right flex-shrink-0" style={{ color }}>
                      {skill.level}%
                    </span>
                    <button
                      onClick={() => startEdit(skill)}
                      title="Edit"
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${color}15`, color }}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteSkill(skill.id)}
                      title="Delete"
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(248,113,113,0.08)", color: "#f87171" }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${skill.level}%`, background: color }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}

      {/* Add new category */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}
      >
        <label style={labelStyle}>Add a New Skill Category</label>
        <div className="flex gap-2">
          <input
            style={{ ...fieldStyle, flex: 1 }}
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="e.g. Visualization Tools"
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
          />
          <button
            onClick={addCategory}
            disabled={!newCat.trim()}
            className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40"
            style={{ background: "linear-gradient(135deg, #00d9ff, #a855f7)", color: "#050812" }}
          >
            Add
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: "#475569" }}>
          Suggested: Visualization Tools · Analytics · SQL / Data · Reporting · Soft Skills
        </p>
      </div>
    </div>
  );
}
