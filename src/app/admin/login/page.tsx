"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/projects");
      router.refresh();
    } else {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0f1e" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #00d9ff22, #a855f722)",
              border: "1px solid rgba(0,217,255,0.2)",
            }}
          >
            <Lock size={24} style={{ color: "#00d9ff" }} />
          </div>
        </div>

        <h1
          className="text-2xl font-extrabold text-center mb-1"
          style={{ color: "#f1f5f9", fontFamily: "Syne, sans-serif" }}
        >
          Portfolio Admin
        </h1>
        <p
          className="text-sm text-center mb-8"
          style={{ color: "#94a3b8", fontFamily: "DM Sans, sans-serif" }}
        >
          Enter your password to manage content
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: error
                  ? "1px solid #f87171"
                  : "1px solid rgba(255,255,255,0.1)",
                color: "#f1f5f9",
                fontFamily: "DM Sans, sans-serif",
              }}
              onFocus={(e) => {
                if (!error) e.currentTarget.style.borderColor = "rgba(0,217,255,0.4)";
              }}
              onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              }}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: "#64748b" }}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #00d9ff, #a855f7)",
              color: "#050812",
              fontFamily: "Syne, sans-serif",
              boxShadow: loading ? "none" : "0 0 24px rgba(0,217,255,0.3)",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
