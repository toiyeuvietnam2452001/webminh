"use client";
import { useRef, forwardRef, useEffect } from "react";

const GLOW_CSS = `
  /* Đăng ký CSS custom property để animate góc quay */
  @property --border-angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  @keyframes glow-spin {
    to { --border-angle: 360deg; }
  }

  [data-glow-card] {
    isolation: isolate;
  }

  /* ::before — vùng sáng spotlight theo cursor (static border glow) */
  [data-glow-card]::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.5px;
    background: radial-gradient(
      circle 200px at var(--mx, -500px) var(--my, -500px),
      rgba(0, 220, 255, 1.0)   0%,
      rgba(0, 180, 255, 0.55) 30%,
      transparent              65%
    );
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    pointer-events: none;
    z-index: 1;
    filter: brightness(1.6);
  }

  /* ::after — viền chạy vòng khi hover */
  [data-glow-card]::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1.5px;
    opacity: 0;
    background: conic-gradient(
      from var(--border-angle, 0deg),
      transparent         0%,
      rgba(0, 210, 255, 0.0)  5%,
      rgba(0, 220, 255, 0.95) 18%,
      rgba(180, 245, 255, 1)  24%,
      rgba(0, 220, 255, 0.95) 30%,
      rgba(0, 210, 255, 0.0)  42%,
      transparent         100%
    );
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    pointer-events: none;
    z-index: 2;
    transition: opacity 0.35s ease;
    filter: brightness(1.4) drop-shadow(0 0 4px rgba(0,212,255,0.8));
  }

  [data-glow-card]:hover::after {
    opacity: 1;
    animation: glow-spin 2.2s linear infinite;
  }
`;

export const GlowCard = forwardRef(function GlowCard(
  { children, className = "", style = {} },
  forwardedRef
) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("glow-card-css")) {
      const tag = document.createElement("style");
      tag.id = "glow-card-css";
      tag.textContent = GLOW_CSS;
      document.head.appendChild(tag);
    }
  }, []);

  const setRef = (el) => {
    cardRef.current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  };

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${(e.clientX - rect.left).toFixed(1)}px`);
    el.style.setProperty("--my", `${(e.clientY - rect.top).toFixed(1)}px`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--mx", "-500px");
    el.style.setProperty("--my", "-500px");
  };

  return (
    <div
      ref={setRef}
      data-glow-card
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        borderRadius: "16px",
        border: "1px solid rgba(0, 212, 255, 0.10)",
        backgroundColor: "rgba(6, 14, 40, 0.84)",
        backgroundImage: `radial-gradient(
          circle 300px at var(--mx, -500px) var(--my, -500px),
          rgba(0, 212, 255, 0.20),
          transparent 65%
        )`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
});
