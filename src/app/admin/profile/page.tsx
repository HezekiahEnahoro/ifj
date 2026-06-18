"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Trash2, Upload, Save, CheckCircle } from "lucide-react";
import type { Profile, HighlightCard, Skill } from "@/lib/types";

const DEFAULT_HIGHLIGHTS: HighlightCard[] = [
  { icon: "📊", title: "Data Visualization",  desc: "Tableau · Power BI · interactive dashboards"  },
  { icon: "🔍", title: "Analytics",           desc: "SQL · Python · turning raw data into insight" },
  { icon: "📋", title: "Reporting",           desc: "Executive reports · automated pipelines"      },
];

const DEFAULT_INTERESTS: HighlightCard[] = [
  { icon: "📊", title: "Data Storytelling",  desc: "Making numbers speak through compelling visual narratives" },
  { icon: "🔍", title: "Business Analytics", desc: "Connecting data insights to real business decisions"       },
  { icon: "🚀", title: "Continuous Growth",  desc: "Always learning new tools and visualization best practices" },
];

const DEFAULT_PROFILE: Profile = {
  id: 1,
  name: "",
  title: "",
  tagline: "",
  bio: [""],
  photo_url: null,
  resume_url: null,
  linkedin_url: null,
  github_url: null,
  tableau_public_url: null,
  email: null,
  open_to_work: true,
  stats: [
    { value: "10+", label: "Dashboards Built" },
    { value: "5+",  label: "Industries" },
    { value: "100%", label: "Client Focused" },
  ],
  logo_text: null,
  highlights: DEFAULT_HIGHLIGHTS,
  interests: DEFAULT_INTERESTS,
  location: "Remote",
  contact_tagline: "",
  availability_text: "",
  faqs: [],
  hero_skill_ids: [],
};

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<"photo" | "resume" | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/profile").then((r) => r.json()),
      fetch("/api/admin/skills").then((r) => r.json()),
    ]).then(([profileData, skillsData]) => {
      if (profileData && !profileData.error) setProfile(profileData);
      if (Array.isArray(skillsData)) setAllSkills(skillsData);
    }).finally(() => setLoading(false));
  }, []);

  function toggleHeroSkill(id: string) {
    setProfile((p) => {
      const ids = p.hero_skill_ids ?? [];
      return {
        ...p,
        hero_skill_ids: ids.includes(id)
          ? ids.filter((x) => x !== id)
          : ids.length < 6 ? [...ids, id] : ids,
      };
    });
  }

  async function save() {
    setSaving(true);
    await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function uploadFile(file: File, folder: string): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    return data.url ?? null;
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("photo");
    const url = await uploadFile(file, "photos");
    if (url) setProfile((p) => ({ ...p, photo_url: url }));
    setUploading(null);
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("resume");
    const url = await uploadFile(file, "resumes");
    if (url) setProfile((p) => ({ ...p, resume_url: url }));
    setUploading(null);
  }

  function updateBio(index: number, value: string) {
    const bio = [...profile.bio];
    bio[index] = value;
    setProfile((p) => ({ ...p, bio }));
  }

  function addBioParagraph() {
    setProfile((p) => ({ ...p, bio: [...p.bio, ""] }));
  }

  function removeBioParagraph(index: number) {
    setProfile((p) => ({ ...p, bio: p.bio.filter((_, i) => i !== index) }));
  }

  function updateStat(index: number, field: "value" | "label", val: string) {
    const stats = [...profile.stats];
    stats[index] = { ...stats[index], [field]: val };
    setProfile((p) => ({ ...p, stats }));
  }

  function addStat() {
    setProfile((p) => ({ ...p, stats: [...p.stats, { value: "", label: "" }] }));
  }

  function removeStat(index: number) {
    setProfile((p) => ({ ...p, stats: p.stats.filter((_, i) => i !== index) }));
  }

  function updateCard(
    field: "highlights" | "interests",
    index: number,
    key: keyof HighlightCard,
    val: string,
  ) {
    setProfile((p) => {
      const arr = [...(p[field] ?? [])];
      arr[index] = { ...arr[index], [key]: val };
      return { ...p, [field]: arr };
    });
  }

  function addCard(field: "highlights" | "interests") {
    setProfile((p) => ({ ...p, [field]: [...(p[field] ?? []), { icon: "📌", title: "", desc: "" }] }));
  }

  function removeCard(field: "highlights" | "interests", index: number) {
    setProfile((p) => ({ ...p, [field]: (p[field] ?? []).filter((_, i) => i !== index) }));
  }

  if (loading) return <div className="p-8" style={{ color: "#94a3b8" }}>Loading…</div>;

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
    fontWeight: 600,
    color: "#94a3b8",
    marginBottom: "0.375rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  };

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9", fontFamily: "Syne, sans-serif" }}>
            Profile
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
            Your name, bio, photo, and contact info
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
          style={{
            background: saved
              ? "rgba(52,211,153,0.15)"
              : "linear-gradient(135deg, #00d9ff, #a855f7)",
            color: saved ? "#34d399" : "#050812",
            border: saved ? "1px solid rgba(52,211,153,0.3)" : "none",
            boxShadow: saved ? "none" : "0 0 20px rgba(0,217,255,0.25)",
          }}
        >
          {saved ? (
            <><CheckCircle size={15} /> Saved</>
          ) : saving ? (
            "Saving…"
          ) : (
            <><Save size={15} /> Save Changes</>
          )}
        </button>
      </div>

      <div className="space-y-7">
        {/* Photo */}
        <div>
          <span style={labelStyle}>Profile Photo</span>
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {profile.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
              )}
            </div>
            <div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <button
                onClick={() => photoInputRef.current?.click()}
                disabled={uploading === "photo"}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#94a3b8",
                }}
              >
                <Upload size={13} />
                {uploading === "photo" ? "Uploading…" : "Upload Photo"}
              </button>
              <p className="text-xs mt-1.5" style={{ color: "#475569" }}>
                JPG, PNG, WebP — max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              style={fieldStyle}
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div>
            <label style={labelStyle}>Job Title</label>
            <input
              style={fieldStyle}
              value={profile.title}
              onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Tableau Developer"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Tagline (short headline under your name)</label>
          <input
            style={fieldStyle}
            value={profile.tagline}
            onChange={(e) => setProfile((p) => ({ ...p, tagline: e.target.value }))}
            placeholder="e.g. Turning data into decisions with Tableau"
          />
        </div>

        {/* Bio paragraphs */}
        <div>
          <label style={labelStyle}>About Me (each box = one paragraph)</label>
          <div className="space-y-3">
            {profile.bio.map((para, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  style={{ ...fieldStyle, resize: "vertical", minHeight: "80px" }}
                  value={para}
                  onChange={(e) => updateBio(i, e.target.value)}
                  placeholder={`Paragraph ${i + 1}…`}
                />
                <button
                  onClick={() => removeBioParagraph(i)}
                  className="flex-shrink-0 w-8 h-8 mt-1 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addBioParagraph}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "#00d9ff" }}
          >
            <Plus size={13} /> Add Paragraph
          </button>
        </div>

        {/* Open to work */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProfile((p) => ({ ...p, open_to_work: !p.open_to_work }))}
            className="w-11 h-6 rounded-full relative transition-all"
            style={{
              background: profile.open_to_work
                ? "linear-gradient(90deg, #00d9ff, #a855f7)"
                : "rgba(255,255,255,0.1)",
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
              style={{
                transform: profile.open_to_work ? "translateX(20px)" : "translateX(0)",
              }}
            />
          </button>
          <span className="text-sm" style={{ color: "#94a3b8" }}>
            Show "Open to work / freelance" badge on the homepage
          </span>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "email",              label: "Email",               placeholder: "you@email.com"                },
            { key: "linkedin_url",       label: "LinkedIn URL",        placeholder: "https://linkedin.com/in/…"    },
            { key: "tableau_public_url", label: "Tableau Public URL",  placeholder: "https://public.tableau.com/…" },
            { key: "github_url",         label: "GitHub URL",          placeholder: "https://github.com/…"         },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                style={fieldStyle}
                value={((profile as unknown) as Record<string, string>)[key] ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        {/* Resume */}
        <div>
          <label style={labelStyle}>Resume / CV (PDF)</label>
          <div className="flex items-center gap-3">
            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium"
                style={{ color: "#00d9ff" }}
              >
                View current resume ↗
              </a>
            )}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleResumeUpload}
            />
            <button
              onClick={() => resumeInputRef.current?.click()}
              disabled={uploading === "resume"}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#94a3b8",
              }}
            >
              <Upload size={13} />
              {uploading === "resume" ? "Uploading…" : "Upload PDF"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div>
          <label style={labelStyle}>Homepage Stats (shown below your name)</label>
          <div className="space-y-2">
            {profile.stats.map((stat, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  style={{ ...fieldStyle, width: "30%" }}
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  placeholder="e.g. 50+"
                />
                <input
                  style={{ ...fieldStyle, flex: 1 }}
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  placeholder="e.g. Dashboards Built"
                />
                <button
                  onClick={() => removeStat(i)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addStat}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "#00d9ff" }}
          >
            <Plus size={13} /> Add Stat
          </button>
        </div>

        {/* Hero skill chips selector */}
        <div>
          <label style={labelStyle}>Skills shown around homepage photo (pick up to 6)</label>
          <p style={{ color: "#475569", fontSize: "0.75rem", marginBottom: "0.75rem" }}>
            Select exactly 6 — 3 appear on the left, 3 on the right. If none selected, the first 6 skills are used automatically. Add skills first on the Skills page.
          </p>
          {allSkills.length === 0 ? (
            <p style={{ color: "#475569", fontSize: "0.875rem" }}>
              No skills added yet — go to the Skills page and add some first.
            </p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {allSkills.map((skill) => {
                const selected = (profile.hero_skill_ids ?? []).includes(skill.id);
                const maxed = !selected && (profile.hero_skill_ids ?? []).length >= 6;
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleHeroSkill(skill.id)}
                    disabled={maxed}
                    style={{
                      padding: "0.35rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.8125rem",
                      fontFamily: "DM Sans, sans-serif",
                      background: selected ? "rgba(0,217,255,0.15)" : "rgba(255,255,255,0.04)",
                      border: selected ? "1px solid rgba(0,217,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
                      color: selected ? "#00d9ff" : "#94a3b8",
                      cursor: maxed ? "not-allowed" : "pointer",
                      opacity: maxed ? 0.35 : 1,
                      transition: "all 0.15s",
                    }}
                  >
                    {skill.name}
                    {selected && (
                      <span style={{ marginLeft: "0.35rem", opacity: 0.6, fontSize: "0.7rem" }}>
                        #{(profile.hero_skill_ids ?? []).indexOf(skill.id) + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          {(profile.hero_skill_ids ?? []).length > 0 && (
            <button
              onClick={() => setProfile((p) => ({ ...p, hero_skill_ids: [] }))}
              style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Clear selection
            </button>
          )}
        </div>

        {/* Logo text */}
        <div>
          <label style={labelStyle}>Navbar Logo Text (leave blank to use initials from your name)</label>
          <input
            style={fieldStyle}
            value={profile.logo_text ?? ""}
            onChange={(e) => setProfile((p) => ({ ...p, logo_text: e.target.value || null }))}
            placeholder="e.g. JD  (blank → auto-initials)"
            maxLength={6}
          />
        </div>

        {/* Highlights */}
        <div>
          <label style={labelStyle}>Homepage Highlight Cards (3 cards below the hero)</label>
          <div className="space-y-3">
            {(profile.highlights ?? []).map((h, i) => (
              <div
                key={i}
                className="rounded-xl p-4 space-y-2"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold" style={{ color: "#00d9ff" }}>Card {i + 1}</span>
                  <button
                    onClick={() => removeCard("highlights", i)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label style={{ ...labelStyle, textTransform: "none", letterSpacing: "normal" }}>Icon (emoji)</label>
                    <input
                      style={fieldStyle}
                      value={h.icon}
                      onChange={(e) => updateCard("highlights", i, "icon", e.target.value)}
                      placeholder="📊"
                    />
                  </div>
                  <div className="col-span-2">
                    <label style={{ ...labelStyle, textTransform: "none", letterSpacing: "normal" }}>Title</label>
                    <input
                      style={fieldStyle}
                      value={h.title}
                      onChange={(e) => updateCard("highlights", i, "title", e.target.value)}
                      placeholder="e.g. Data Visualization"
                    />
                  </div>
                </div>
                <div>
                  <label style={{ ...labelStyle, textTransform: "none", letterSpacing: "normal" }}>Description</label>
                  <input
                    style={fieldStyle}
                    value={h.desc}
                    onChange={(e) => updateCard("highlights", i, "desc", e.target.value)}
                    placeholder="Short description…"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => addCard("highlights")}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "#00d9ff" }}
          >
            <Plus size={13} /> Add Card
          </button>
        </div>

        {/* Interests */}
        <div>
          <label style={labelStyle}>"What Drives Me" Cards (About page)</label>
          <div className="space-y-3">
            {(profile.interests ?? []).map((h, i) => (
              <div
                key={i}
                className="rounded-xl p-4 space-y-2"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold" style={{ color: "#a855f7" }}>Card {i + 1}</span>
                  <button
                    onClick={() => removeCard("interests", i)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label style={{ ...labelStyle, textTransform: "none", letterSpacing: "normal" }}>Icon (emoji)</label>
                    <input
                      style={fieldStyle}
                      value={h.icon}
                      onChange={(e) => updateCard("interests", i, "icon", e.target.value)}
                      placeholder="📊"
                    />
                  </div>
                  <div className="col-span-2">
                    <label style={{ ...labelStyle, textTransform: "none", letterSpacing: "normal" }}>Title</label>
                    <input
                      style={fieldStyle}
                      value={h.title}
                      onChange={(e) => updateCard("interests", i, "title", e.target.value)}
                      placeholder="e.g. Data Storytelling"
                    />
                  </div>
                </div>
                <div>
                  <label style={{ ...labelStyle, textTransform: "none", letterSpacing: "normal" }}>Description</label>
                  <input
                    style={fieldStyle}
                    value={h.desc}
                    onChange={(e) => updateCard("interests", i, "desc", e.target.value)}
                    placeholder="Short description…"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => addCard("interests")}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "#a855f7" }}
          >
            <Plus size={13} /> Add Card
          </button>
        </div>
      </div>
    </div>
  );
}
