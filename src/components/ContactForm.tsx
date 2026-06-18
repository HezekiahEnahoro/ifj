"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ValidationError { field: string; message: string; }

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");
    setValidationErrors([]);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) setValidationErrors(data.details);
        throw new Error(data.error || "Failed to send message");
      }
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setValidationErrors(prev => prev.filter(err => err.field !== e.target.name));
  };

  const getError = (field: string) => validationErrors.find(e => e.field === field)?.message;

  const inputBase = "w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 input-dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Status banners */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}
          >
            <CheckCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#34d399" }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: "#34d399", fontFamily: "Syne, sans-serif" }}>
                Message sent!
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>
                I&apos;ll get back to you as soon as possible.
              </p>
            </div>
          </motion.div>
        )}
        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}
          >
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#f87171" }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: "#f87171", fontFamily: "Syne, sans-serif" }}>
                Failed to send
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{errorMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name + Email row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-2)", fontFamily: "Syne, sans-serif" }}>
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className={`${inputBase} ${getError("name") ? "error" : ""}`}
          />
          {getError("name") && (
            <p className="mt-1 text-xs" style={{ color: "#f87171" }}>{getError("name")}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-2)", fontFamily: "Syne, sans-serif" }}>
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className={`${inputBase} ${getError("email") ? "error" : ""}`}
          />
          {getError("email") && (
            <p className="mt-1 text-xs" style={{ color: "#f87171" }}>{getError("email")}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-2)", fontFamily: "Syne, sans-serif" }}>
          Subject *
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="What is this about?"
          className={`${inputBase} ${getError("subject") ? "error" : ""}`}
        />
        {getError("subject") && (
          <p className="mt-1 text-xs" style={{ color: "#f87171" }}>{getError("subject")}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-2)", fontFamily: "Syne, sans-serif" }}>
          Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Your message..."
          className={`${inputBase} resize-none ${getError("message") ? "error" : ""}`}
        />
        {getError("message") && (
          <p className="mt-1 text-xs" style={{ color: "#f87171" }}>{getError("message")}</p>
        )}
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all"
        style={{
          background: status === "loading"
            ? "rgba(255,255,255,0.08)"
            : "linear-gradient(135deg, var(--cyan), var(--violet))",
          color: status === "loading" ? "var(--text-3)" : "#050812",
          fontFamily: "Syne, sans-serif",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          boxShadow: status === "loading" ? "none" : "0 0 28px var(--cyan-glow)",
        }}
        whileHover={status !== "loading" ? { scale: 1.02 } : {}}
        whileTap={status !== "loading" ? { scale: 0.97 } : {}}
      >
        {status === "loading" ? (
          <>
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="ml-1">Sending…</span>
          </>
        ) : (
          <>
            <Send size={16} />
            Send Message
          </>
        )}
      </motion.button>
    </form>
  );
}
