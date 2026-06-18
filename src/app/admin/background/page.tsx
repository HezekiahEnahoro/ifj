"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, CheckCircle, Edit2 } from "lucide-react";
import type { Experience, Education } from "@/lib/types";

const fieldStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f1f5f9",
  borderRadius: "0.75rem",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  outline: "none",
  width: "100%",
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

type Tab = "experience" | "education";

function EntryCard<T extends { id: string }>({
  item,
  onEdit,
  onDelete,
  title,
  subtitle,
  period,
}: {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  title: string;
  subtitle: string;
  period: string;
}) {
  return (
    <div
      className="flex items-start gap-4 rounded-xl p-4"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: "#f1f5f9" }}>{title}</p>
        <p className="text-xs mt-0.5" style={{ color: "#00d9ff" }}>{subtitle}</p>
        <p className="text-xs mt-0.5" style={{ color: "#475569" }}>{period}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}
        >
          <Edit2 size={12} /> Edit
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(248,113,113,0.08)", color: "#f87171" }}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function BackgroundAdmin() {
  const [tab, setTab] = useState<Tab>("experience");

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  const [expForm, setExpForm] = useState<Partial<Experience> | null>(null);
  const [eduForm, setEduForm] = useState<Partial<Education> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/experience").then((r) => r.json()),
      fetch("/api/admin/education").then((r) => r.json()),
    ]).then(([exp, edu]) => {
      setExperiences(Array.isArray(exp) ? exp : []);
      setEducation(Array.isArray(edu) ? edu : []);
    }).finally(() => setLoading(false));
  }, []);

  /* ── EXPERIENCE ── */
  async function saveExperience() {
    if (!expForm) return;
    setSaving(true);
    if (expForm.id) {
      await fetch("/api/admin/experience", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expForm),
      });
      setExperiences((prev) => prev.map((e) => (e.id === expForm.id ? { ...e, ...expForm } as Experience : e)));
    } else {
      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...expForm, sort_order: experiences.length }),
      });
      const created = await res.json();
      if (created && !created.error) setExperiences((prev) => [...prev, created]);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setExpForm(null); }, 1200);
  }

  async function deleteExperience(id: string) {
    if (!confirm("Delete this experience entry?")) return;
    await fetch("/api/admin/experience", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  }

  /* ── EDUCATION ── */
  async function saveEducation() {
    if (!eduForm) return;
    setSaving(true);
    if (eduForm.id) {
      await fetch("/api/admin/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eduForm),
      });
      setEducation((prev) => prev.map((e) => (e.id === eduForm.id ? { ...e, ...eduForm } as Education : e)));
    } else {
      const res = await fetch("/api/admin/education", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...eduForm, sort_order: education.length }),
      });
      const created = await res.json();
      if (created && !created.error) setEducation((prev) => [...prev, created]);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setEduForm(null); }, 1200);
  }

  async function deleteEducation(id: string) {
    if (!confirm("Delete this education entry?")) return;
    await fetch("/api/admin/education", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEducation((prev) => prev.filter((e) => e.id !== id));
  }

  function updateExpAchievement(index: number, val: string) {
    const achievements = [...((expForm?.achievements ?? []) as string[])];
    achievements[index] = val;
    setExpForm((f) => ({ ...f, achievements }));
  }

  if (loading) return <div className="p-8" style={{ color: "#94a3b8" }}>Loading…</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9", fontFamily: "Syne, sans-serif" }}>
          Background
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
          Work experience and education shown on your About page
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {(["experience", "education"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setExpForm(null); setEduForm(null); }}
            className="px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all"
            style={{
              background: tab === t ? "linear-gradient(135deg, #00d9ff, #a855f7)" : "rgba(255,255,255,0.04)",
              color: tab === t ? "#050812" : "#94a3b8",
              border: tab === t ? "none" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── EXPERIENCE TAB ── */}
      {tab === "experience" && (
        <div>
          <div className="space-y-3 mb-5">
            {experiences.map((e) => (
              <EntryCard
                key={e.id}
                item={e}
                onEdit={(item) => setExpForm({ ...item })}
                onDelete={deleteExperience}
                title={e.title}
                subtitle={e.company}
                period={e.period}
              />
            ))}
          </div>

          {!expForm ? (
            <button
              onClick={() => setExpForm({ title: "", company: "", period: "", color: "#00d9ff", achievements: [""] })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #00d9ff, #a855f7)",
                color: "#050812",
                boxShadow: "0 0 20px rgba(0,217,255,0.2)",
              }}
            >
              <Plus size={15} /> Add Experience
            </button>
          ) : (
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="font-semibold text-sm" style={{ color: "#f1f5f9" }}>
                {expForm.id ? "Edit Experience" : "New Experience"}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Job Title</label>
                  <input
                    style={fieldStyle}
                    value={expForm.title ?? ""}
                    onChange={(e) => setExpForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Data Analyst"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Company / Organization</label>
                  <input
                    style={fieldStyle}
                    value={expForm.company ?? ""}
                    onChange={(e) => setExpForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Period</label>
                <input
                  style={{ ...fieldStyle, width: "50%" }}
                  value={expForm.period ?? ""}
                  onChange={(e) => setExpForm((f) => ({ ...f, period: e.target.value }))}
                  placeholder="e.g. Jan 2022 – Present"
                />
              </div>
              <div>
                <label style={labelStyle}>Achievements / Bullet Points</label>
                <div className="space-y-2">
                  {((expForm.achievements ?? []) as string[]).map((a, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        style={{ ...fieldStyle, flex: 1 }}
                        value={a}
                        onChange={(e) => updateExpAchievement(i, e.target.value)}
                        placeholder={`Achievement ${i + 1}`}
                      />
                      <button
                        onClick={() => setExpForm((f) => ({ ...f, achievements: (f?.achievements as string[] ?? []).filter((_, j) => j !== i) }))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setExpForm((f) => ({ ...f, achievements: [...((f?.achievements ?? []) as string[]), ""] }))}
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: "#00d9ff" }}
                >
                  <Plus size={12} /> Add bullet
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveExperience}
                  disabled={saving || !expForm.title}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                  style={{
                    background: saved ? "rgba(52,211,153,0.15)" : "linear-gradient(135deg, #00d9ff, #a855f7)",
                    color: saved ? "#34d399" : "#050812",
                    border: saved ? "1px solid rgba(52,211,153,0.3)" : "none",
                  }}
                >
                  {saved ? <><CheckCircle size={14} /> Saved</> : <><Save size={14} /> Save</>}
                </button>
                <button
                  onClick={() => setExpForm(null)}
                  className="px-4 py-2 rounded-xl text-sm"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#64748b" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── EDUCATION TAB ── */}
      {tab === "education" && (
        <div>
          <div className="space-y-3 mb-5">
            {education.map((e) => (
              <EntryCard
                key={e.id}
                item={e}
                onEdit={(item) => setEduForm({ ...item })}
                onDelete={deleteEducation}
                title={e.degree}
                subtitle={e.institution}
                period={e.period}
              />
            ))}
          </div>

          {!eduForm ? (
            <button
              onClick={() => setEduForm({ degree: "", institution: "", period: "", detail: "" })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{
                background: "linear-gradient(135deg, #00d9ff, #a855f7)",
                color: "#050812",
                boxShadow: "0 0 20px rgba(0,217,255,0.2)",
              }}
            >
              <Plus size={15} /> Add Education
            </button>
          ) : (
            <div
              className="rounded-2xl p-5 space-y-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="font-semibold text-sm" style={{ color: "#f1f5f9" }}>
                {eduForm.id ? "Edit Education" : "New Education"}
              </p>
              <div>
                <label style={labelStyle}>Degree / Certification</label>
                <input
                  style={fieldStyle}
                  value={eduForm.degree ?? ""}
                  onChange={(e) => setEduForm((f) => ({ ...f, degree: e.target.value }))}
                  placeholder="e.g. Tableau Desktop Specialist"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>Institution / Platform</label>
                  <input
                    style={fieldStyle}
                    value={eduForm.institution ?? ""}
                    onChange={(e) => setEduForm((f) => ({ ...f, institution: e.target.value }))}
                    placeholder="e.g. Tableau, Coursera, BSc"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Year / Period</label>
                  <input
                    style={fieldStyle}
                    value={eduForm.period ?? ""}
                    onChange={(e) => setEduForm((f) => ({ ...f, period: e.target.value }))}
                    placeholder="e.g. 2023"
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Details (optional)</label>
                <input
                  style={fieldStyle}
                  value={eduForm.detail ?? ""}
                  onChange={(e) => setEduForm((f) => ({ ...f, detail: e.target.value }))}
                  placeholder="e.g. Tableau Desktop, Data Prep, Calculations, LOD Expressions"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveEducation}
                  disabled={saving || !eduForm.degree}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                  style={{
                    background: saved ? "rgba(52,211,153,0.15)" : "linear-gradient(135deg, #00d9ff, #a855f7)",
                    color: saved ? "#34d399" : "#050812",
                    border: saved ? "1px solid rgba(52,211,153,0.3)" : "none",
                  }}
                >
                  {saved ? <><CheckCircle size={14} /> Saved</> : <><Save size={14} /> Save</>}
                </button>
                <button
                  onClick={() => setEduForm(null)}
                  className="px-4 py-2 rounded-xl text-sm"
                  style={{ background: "rgba(255,255,255,0.04)", color: "#64748b" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
