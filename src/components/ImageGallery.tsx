"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div
        className="relative h-56 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-3"
        style={{
          background: "rgba(10,17,38,0.8)",
          border: "1px solid var(--border)",
        }}
      >
        <Image
          src={images[active]}
          alt={title}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(5,8,18,0.5) 0%, transparent 55%)" }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="relative h-20 rounded-xl overflow-hidden transition-all"
            style={{
              border: active === i ? "2px solid var(--cyan)" : "2px solid var(--border)",
              boxShadow: active === i ? "0 0 12px var(--cyan-glow)" : "none",
              opacity: active === i ? 1 : 0.55,
            }}
          >
            <Image
              src={img}
              alt={`${title} screenshot ${i + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
