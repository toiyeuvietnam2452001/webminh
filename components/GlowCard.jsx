"use client";
import { useRef, forwardRef, useEffect } from "react";

// CSS inject 1 lần — ::before dùng mask để chỉ hiện ở phần viền
const GLOW_CSS = `
  [data-glow-card] {
    isolation: isolate;
  }
  [data-glow-card]::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    padding: 1px;
    background: radial-gradient(
      circle 220px at var(--mx, -500px) var(--my, -500px),
      rgba(0, 212, 255, 0.95) 0%,
      rgba(0, 212, 255, 0.3) 30%,
      transparent 65%
    );
    /* Mask chỉ giữ lại vùng viền, ẩn phần bên trong */
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    pointer-events: none;
    z-index: 0;
  }
`;

export const GlowCard = forwardRef(function GlowCard(
  { children, className = "", style = {} },
  forwardedRef
) {
  const cardRef = useRef(null);

  // Inject CSS 1 lần vào <head>
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
        // Viền tĩnh mờ khi chuột chưa vào
        border: "1px solid rgba(0, 212, 255, 0.10)",
        // Spotlight bên trong theo chuột
        backgroundColor: "rgba(8, 18, 45, 0.82)",
        backgroundImage: `radial-gradient(
          circle 290px at var(--mx, -500px) var(--my, -500px),
          rgba(0, 212, 255, 0.12),
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
