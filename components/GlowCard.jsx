"use client";
import { useRef, forwardRef } from "react";

export const GlowCard = forwardRef(function GlowCard(
  { children, className = "", style = {} },
  forwardedRef
) {
  const outerRef = useRef(null);

  const setRef = (el) => {
    outerRef.current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
  };

  const handleMouseMove = (e) => {
    const el = outerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Trừ 1px để bù cho padding border
    el.style.setProperty("--mx", `${(e.clientX - rect.left - 1).toFixed(1)}px`);
    el.style.setProperty("--my", `${(e.clientY - rect.top - 1).toFixed(1)}px`);
  };

  const handleMouseLeave = () => {
    const el = outerRef.current;
    if (!el) return;
    // Đẩy spotlight ra ngoài card khi rời chuột
    el.style.setProperty("--mx", "-500px");
    el.style.setProperty("--my", "-500px");
  };

  return (
    // Outer div: hiệu ứng viền sáng (1px gradient border)
    <div
      ref={setRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        borderRadius: "16px",
        padding: "1px",
        background: `radial-gradient(
          circle 220px at var(--mx, -500px) var(--my, -500px),
          rgba(0, 212, 255, 0.5),
          rgba(0, 212, 255, 0.06) 50%,
          rgba(0, 212, 255, 0.04)
        )`,
        ...style,
      }}
    >
      {/* Inner div: spotlight tròn bên trong card */}
      <div
        className={className}
        style={{
          borderRadius: "15px",
          background: `
            radial-gradient(
              circle 280px at var(--mx, -500px) var(--my, -500px),
              rgba(0, 212, 255, 0.11),
              transparent 65%
            ),
            rgba(8, 18, 45, 0.82)
          `,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
});
