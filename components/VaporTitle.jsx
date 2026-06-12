"use client";
import { useEffect, useRef, useState } from "react";

const LINES = [
  { text: "Tối ưu hoá sức mạnh", gradient: false },
  { text: "Performance Marketing", gradient: true  },
  { text: "Bất động sản",         gradient: false },
];

const GRADIENT_STYLE = {
  background: "linear-gradient(135deg, #00d4ff, #0066ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

class Particle {
  constructor(tx, ty, r, g, b, canvasW) {
    this.tx = tx; this.ty = ty;
    const angle = Math.random() * Math.PI * 2;
    const dist  = 120 + Math.random() * 480;
    this.x  = tx + Math.cos(angle) * dist;
    this.y  = ty + Math.sin(angle) * dist;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = (Math.random() - 0.5) * 8;
    this.r = r; this.g = g; this.b = b;
    this.delay   = (tx / canvasW) * 1.2 + Math.random() * 0.15;
    this.alpha   = 0;
    this.settled = false;
  }
  update(t) {
    if (t < this.delay || this.settled) return;
    const dx = this.tx - this.x, dy = this.ty - this.y;
    this.vx += dx * 0.06; this.vy += dy * 0.06;
    this.vx *= 0.87;      this.vy *= 0.87;
    this.x  += this.vx;   this.y  += this.vy;
    this.alpha = Math.min(1, this.alpha + 0.022);
    if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4 &&
        Math.abs(this.vx) < 0.18 && Math.abs(this.vy) < 0.18) {
      this.x = this.tx; this.y = this.ty; this.alpha = 1; this.settled = true;
    }
  }
  draw(ctx, sz) {
    if (this.alpha <= 0) return;
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = `rgb(${this.r},${this.g},${this.b})`;
    ctx.fillRect(this.x - sz / 2, this.y - sz / 2, sz, sz);
  }
}

export default function VaporTitle() {
  const canvasRef = useRef(null);
  /* phase: "canvas" → "crossfade" → "text" */
  const [phase, setPhase] = useState("canvas");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId;

    const run = async () => {
      await document.fonts.ready;

      const W      = canvas.parentElement.offsetWidth;
      const mobile = W < 768;
      const dpr    = Math.min(window.devicePixelRatio || 1, 2);
      const SAMPLE = mobile ? 3 : 2;
      const PSIZE  = SAMPLE * 0.95;
      const FS     = mobile ? 36 : 52;
      const LH     = Math.round(FS * 1.15);
      const PAD    = 6;
      const TOTAL  = LINES.length * LH + PAD * 2;

      canvas.width        = W * dpr;
      canvas.height       = TOTAL * dpr;
      canvas.style.width  = W + "px";
      canvas.style.height = TOTAL + "px";

      const off = document.createElement("canvas");
      off.width = W * dpr; off.height = TOTAL * dpr;
      const octx = off.getContext("2d");
      octx.scale(dpr, dpr);

      const particles = [];
      LINES.forEach((line, i) => {
        const y = PAD + i * LH;
        octx.save();
        octx.font = `800 ${FS}px Inter,"Segoe UI",system-ui,sans-serif`;
        octx.textBaseline = "top";
        if (line.gradient) {
          const g = octx.createLinearGradient(0, 0, W * 0.85, 0);
          g.addColorStop(0, "rgb(0,212,255)"); g.addColorStop(1, "rgb(0,102,255)");
          octx.fillStyle = g;
        } else { octx.fillStyle = "rgb(255,255,255)"; }
        octx.fillText(line.text, 0, y);
        octx.restore();

        const id = octx.getImageData(0, y * dpr, W * dpr, LH * dpr);
        for (let py = 0; py < LH * dpr; py += SAMPLE)
          for (let px = 0; px < W * dpr; px += SAMPLE) {
            const idx = (py * W * dpr + px) * 4;
            if (id.data[idx + 3] > 60)
              particles.push(new Particle(
                px / dpr, y + py / dpr,
                id.data[idx], id.data[idx + 1], id.data[idx + 2], W
              ));
          }
      });

      const t0 = performance.now();
      const animate = (now) => {
        const t = (now - t0) / 1000;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save(); ctx.scale(dpr, dpr);
        let done = true;
        for (const p of particles) {
          p.update(t);
          if (!p.settled) done = false;
          p.draw(ctx, PSIZE);
        }
        ctx.globalAlpha = 1; ctx.restore();
        if (done) {
          /* Particle xong → crossfade sang chữ CSS */
          setPhase("crossfade");
          setTimeout(() => setPhase("text"), 500);
        } else {
          rafId = requestAnimationFrame(animate);
        }
      };
      rafId = requestAnimationFrame(animate);
    };

    run();
    return () => { if (rafId) cancelAnimationFrame(rafId); };
  }, []);

  const TITLE_STYLE = {
    fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: "-0.03em",
    margin: 0,
  };

  return (
    <div style={{ position: "relative", marginBottom: "24px" }}>

      {/* h1 thật — ẩn trong lúc animate, hiện ra khi crossfade xong */}
      <h1 style={{
        ...TITLE_STYLE,
        opacity: phase === "text" ? 1 : phase === "crossfade" ? 1 : 0,
        transition: "opacity 0.5s ease",
        visibility: phase === "canvas" ? "hidden" : "visible",
      }}>
        Tối ưu hoá sức mạnh<br />
        <span style={GRADIENT_STYLE}>Performance Marketing</span><br />
        Bất động sản
      </h1>

      {/* Canvas particle — absolute phủ lên h1, fade out khi xong */}
      {phase !== "text" && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0, left: 0,
            display: "block",
            pointerEvents: "none",
            opacity: phase === "crossfade" ? 0 : 1,
            transition: phase === "crossfade" ? "opacity 0.5s ease" : "none",
            zIndex: 2,
          }}
        />
      )}
    </div>
  );
}
