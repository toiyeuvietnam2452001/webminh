"use client";
import { useEffect, useRef, forwardRef } from "react";

const glowColorMap = {
  cyan:   { base: 192, spread: 40 },
  blue:   { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green:  { base: 120, spread: 200 },
};

const GLOW_STYLES = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius) * 1px);
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    -webkit-mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    -webkit-mask-clip: padding-box, border-box;
    mask-composite: intersect;
    -webkit-mask-composite: source-in;
  }
  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue, 192) 100% 60% / 0.9), transparent 100%
    );
    filter: brightness(2);
  }
  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / 0.15), transparent 100%
    );
  }
  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius) * 1px);
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }
  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
  }
`;

export const GlowCard = forwardRef(function GlowCard(
  { children, className = "", style = {}, glowColor = "cyan" },
  forwardedRef
) {
  const cardRef = useRef(null);
  const { base, spread } = glowColorMap[glowColor] || glowColorMap.cyan;

  // Inject global glow styles một lần
  useEffect(() => {
    if (!document.getElementById("glow-card-styles")) {
      const tag = document.createElement("style");
      tag.id = "glow-card-styles";
      tag.textContent = GLOW_STYLES;
      document.head.appendChild(tag);
    }
  }, []);

  // Track con trỏ chuột → cập nhật CSS vars
  useEffect(() => {
    const syncPointer = (e) => {
      const el = cardRef.current;
      if (!el) return;
      el.style.setProperty("--x", e.clientX.toFixed(2));
      el.style.setProperty("--xp", (e.clientX / window.innerWidth).toFixed(2));
      el.style.setProperty("--y", e.clientY.toFixed(2));
      el.style.setProperty("--yp", (e.clientY / window.innerHeight).toFixed(2));
    };
    document.addEventListener("pointermove", syncPointer);
    return () => document.removeEventListener("pointermove", syncPointer);
  }, []);

  // Merge forwardedRef và cardRef
  const setRef = (el) => {
    cardRef.current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  };

  return (
    <div
      ref={setRef}
      data-glow
      className={className}
      style={{
        "--base": base,
        "--spread": spread,
        "--radius": "16",
        "--border": "1",
        "--size": "260",
        "--outer": "1",
        "--border-size": "calc(var(--border, 1) * 1px)",
        "--spotlight-size": "calc(var(--size, 260) * 1px)",
        "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
        background: `radial-gradient(
          var(--spotlight-size) var(--spotlight-size) at
          calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
          hsl(var(--hue, 192) 100% 70% / 0.07), transparent
        ), rgba(255, 255, 255, 0.04)`,
        backgroundAttachment: "fixed, scroll",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(0, 212, 255, 0.12)",
        borderRadius: "16px",
        position: "relative",
        touchAction: "none",
        ...style,
      }}
    >
      <div data-glow />
      {children}
    </div>
  );
});
