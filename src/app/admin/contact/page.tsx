"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import type { FAQ } from "@/lib/types";

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

export default function AdminContactPage() {
  const [location,          setLocation]          = useState("");
  const [contactTagline,    setContactTagline]    = useState("");
  const [availabilityText,  setAvailabilityText]  = useState("");
  const [faqs,              setFaqs]              = useState<FAQ[]>([]);
  const [loading,           setLoading]           = useState(true);
  const [saving,            setSaving]            = useState(false);
  const [saved,             setSaved]             = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((p) => {
        if (p && !p.error) {
          setLocation(p.location || "");
          setContactTagline(p.contact_tagline || "");
          setAvailabilityText(p.availability_text || "");
          setFaqs(Array.isArray(p.faqs) ? p.faqs : []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, contact_tagline: contactTagline, availability_text: availabilityText, faqs }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function updateFaq(i: number, field: "q" | "a", val: string) {
    setFaqs((prev) => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  }

  function addFaq() {
    setFaqs((prev) => [...prev, { q: "", a: "" }]);
  }

  function removeFaq(i: number) {
    setFaqs((prev) => prev.filter((_, idx) => idx !== i));
  }

  if (loading) return <div className="p-8" style={{ color: "#94a3b8" }}>Loading…</div>;

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: "#f1f5f9", fontFamily: "Syne, sans-serif" }}>
            Contact Page
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748b" }}>
            Edit your contact info, taglines, and FAQs
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
          style={{
            background: saved ? "rgba(52,211,153,0.15)" : "linear-gradient(135deg, #00d9ff, #a855f7)",
            color: saved ? "#34d399" : "#050812",
            border: saved ? "1px solid rgba(52,211,153,0.3)" : "none",
            boxShadow: saved ? "none" : "0 0 20px rgba(0,217,255,0.25)",
          }}
        >
          {saved ? <><CheckCircle size={15} /> Saved</> : saving ? "Saving…" : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      <div className="space-y-7">
        {/* Location */}
        <div>
          <label style={labelStyle}>Location (shown in contact info panel)</label>
          <input
            style={fieldStyle}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Remote · Lagos, Nigeria"
          />
        </div>

        {/* Contact tagline */}
        <div>
          <label style={labelStyle}>Contact Page Tagline (under "Get In Touch")</label>
          <textarea
            style={{ ...fieldStyle, resize: "vertical", minHeight: "80px" }}
            value={contactTagline}
            onChange={(e) => setContactTagline(e.target.value)}
            placeholder="e.g. Have a project or want to collaborate? Send a message…"
          />
        </div>

        {/* Availability text */}
        <div>
          <label style={labelStyle}>Availability Text (shown in the "Available now" block)</label>
          <input
            style={fieldStyle}
            value={availabilityText}
            onChange={(e) => setAvailabilityText(e.target.value)}
            placeholder="e.g. Open to freelance and full-time data visualization roles."
          />
        </div>

        {/* FAQs */}
        <div>
          <label style={labelStyle}>FAQs (shown at the bottom of the contact page)</label>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl p-4 space-y-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold" style={{ color: "#00d9ff" }}>
                    FAQ {i + 1}
                  </span>
                  <button
                    onClick={() => removeFaq(i)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <div>
                  <label style={{ ...labelStyle, textTransform: "none", letterSpacing: "normal" }}>Question</label>
                  <input
                    style={fieldStyle}
                    value={faq.q}
                    onChange={(e) => updateFaq(i, "q", e.target.value)}
                    placeholder="e.g. What services do you offer?"
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, textTransform: "none", letterSpacing: "normal" }}>Answer</label>
                  <textarea
                    style={{ ...fieldStyle, resize: "vertical", minHeight: "72px" }}
                    value={faq.a}
                    onChange={(e) => updateFaq(i, "a", e.target.value)}
                    placeholder="Your answer…"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addFaq}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "#00d9ff" }}
          >
            <Plus size={13} /> Add FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
