"use client";

import { useEffect, useRef } from "react";

/* Deterministic pseudo-random — same values server + client, no hydration mismatch */
function seededVal(seed: number, mod: number) {
  return ((seed * 1664525 + 1013904223) & 0x7fffffff) % mod;
}

const PARTICLE_COUNT = 70;

const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const s1 = seededVal(i * 31 + 7, 10000);
  const s2 = seededVal(i * 53 + 13, 10000);
  const s3 = seededVal(i * 17 + 29, 60);
  const s4 = seededVal(i * 41 + 3, 70);
  const s5 = seededVal(i * 67 + 11, 30);
  const s6 = seededVal(i * 23 + 5, 20);
  return {
    id: i,
    left: s1 / 100,        // 0–100 %
    startY: s2 / 100,      // 0–100 %  (starting vertical pos)
    size: (s3 % 3) + 1,    // 1–3 px
    opacity: (s4 + 15) / 100, // 0.15–0.85
    duration: (s5 + 25),   // 25–55 s
    delay: -(s6),          // 0–20 s (negative = already in progress)
  };
});

const STAR_COUNT = 120;
const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
  const x = seededVal(i * 79 + 3, 10000) / 100;
  const y = seededVal(i * 43 + 17, 10000) / 100;
  const size = seededVal(i * 31 + 7, 3);
  const twinkleDur = seededVal(i * 19 + 11, 40) + 20;
  const twinkleDelay = seededVal(i * 11 + 29, 15);
  return { id: i, x, y, size: size + 1, twinkleDur, twinkleDelay };
});

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* Optional: subtle grid drawn on canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      /* Perspective grid at the bottom */
      const vp = { x: canvas.width / 2, y: canvas.height * 0.72 };
      const lineCount = 14;
      const spread = canvas.width * 1.6;

      ctx.strokeStyle = "rgba(0, 217, 255, 0.04)";
      ctx.lineWidth = 1;

      for (let i = 0; i <= lineCount; i++) {
        const xStart = vp.x - spread / 2 + (spread / lineCount) * i;
        ctx.beginPath();
        ctx.moveTo(xStart, canvas.height);
        ctx.lineTo(vp.x, vp.y);
        ctx.stroke();
      }

      /* Horizontal lines */
      const rows = 10;
      for (let j = 1; j <= rows; j++) {
        const t = j / rows;
        const y = vp.y + (canvas.height - vp.y) * t;
        const halfW = ((spread / 2) * t) * 1.0;
        ctx.beginPath();
        ctx.moveTo(vp.x - halfW, y);
        ctx.lineTo(vp.x + halfW, y);
        ctx.stroke();
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
      style={{ background: "var(--bg-deep)" }}
    >
      {/* ── Ambient colour orbs ──────────────────────── */}
      <div
        className="absolute rounded-full blur-[160px] opacity-30"
        style={{
          width: 700,
          height: 700,
          top: "-15%",
          left: "-10%",
          background: "radial-gradient(circle, rgba(0,217,255,0.55) 0%, transparent 70%)",
          animation: "orb-drift 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full blur-[180px] opacity-25"
        style={{
          width: 800,
          height: 800,
          bottom: "-20%",
          right: "-15%",
          background: "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)",
          animation: "orb-drift-2 34s ease-in-out infinite",
          animationDelay: "-8s",
        }}
      />
      <div
        className="absolute rounded-full blur-[140px] opacity-20"
        style={{
          width: 500,
          height: 500,
          top: "45%",
          left: "40%",
          background: "radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)",
          animation: "orb-drift-3 22s ease-in-out infinite",
          animationDelay: "-14s",
        }}
      />

      {/* ── Twinkling stars ──────────────────────────── */}
      {stars.map((s) => (
        <div
          key={`star-${s.id}`}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.twinkleDur * 0.1 + 1.5}s ease-in-out ${s.twinkleDelay * 0.3}s infinite`,
          }}
        />
      ))}

      {/* ── Rising particles ─────────────────────────── */}
      {particles.map((p) => (
        <div
          key={`p-${p.id}`}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: `${p.startY}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background: p.id % 3 === 0
              ? "var(--cyan)"
              : p.id % 3 === 1
              ? "var(--violet)"
              : "white",
            animation: `particle-rise ${p.duration}s linear ${p.delay}s infinite`,
            filter: p.id % 5 === 0 ? "blur(1px)" : "none",
          }}
        />
      ))}

      {/* ── Perspective grid (canvas) ────────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
        style={{ mixBlendMode: "screen" }}
      />

      {/* ── Subtle vignette overlay ──────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5,8,18,0.7) 100%)",
        }}
      />
    </div>
  );
}
