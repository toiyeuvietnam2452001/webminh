"use client";
import { useEffect, useRef } from "react";

/* ── 3 dòng tiêu đề Hero ── */
const LINES = [
  { text: "Tối ưu hoá sức mạnh", type: "white" },
  { text: "Performance Marketing", type: "gradient" },
  { text: "Bất động sản",         type: "white" },
];

/* ── Particle: bắt đầu tán loạn → hội tụ về vị trí chữ ── */
class Particle {
  constructor(tx, ty, r, g, b, a) {
    this.tx = tx; this.ty = ty;
    const angle = Math.random() * Math.PI * 2;
    const dist  = 100 + Math.random() * 400;
    this.x  = tx + Math.cos(angle) * dist;
    this.y  = ty + Math.sin(angle) * dist;
    this.vx = (Math.random() - 0.5) * 7;
    this.vy = (Math.random() - 0.5) * 7;
    this.r = r; this.g = g; this.b = b;
    this.a  = 0;
    this.ta = a;                        /* alpha mục tiêu */
    this.delay = Math.random() * 0.5;   /* stagger để hạt đến lần lượt */
    this.settled = false;
  }

  update(t) {
    if (this.settled || t < this.delay) return;
    const dx = this.tx - this.x;
    const dy = this.ty - this.y;
    this.vx += dx * 0.055;
    this.vy += dy * 0.055;
    this.vx *= 0.86;
    this.vy *= 0.86;
    this.x += this.vx;
    this.y += this.vy;
    this.a = Math.min(this.ta, this.a + 0.018);
    if (
      Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 &&
      Math.abs(this.vx) < 0.2 && Math.abs(this.vy) < 0.2
    ) {
      this.x = this.tx; this.y = this.ty;
      this.a = this.ta;
      this.settled = true;
    }
  }

  draw(ctx) {
    if (this.a <= 0) return;
    ctx.globalAlpha = this.a;
    ctx.fillStyle = `rgb(${this.r},${this.g},${this.b})`;
    ctx.fillRect(this.x - 0.5, this.y - 0.5, 1, 1);
  }
}

/* ── Component chính ── */
export default function VaporTitle() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let rafId;

    const run = async () => {
      /* Chờ font Inter load xong mới sample pixel */
      await document.fonts.ready;

      const container = canvas.parentElement;
      const W        = container.offsetWidth;
      const isMobile = W < 768;
      const dpr      = Math.min(window.devicePixelRatio || 1, 2);

      /* font-size khớp Hero.module.css: 3.2rem / 2.2rem (base 16px) */
      const FS     = isMobile ? 36 : 52;
      const LH     = Math.round(FS * 1.15);   /* line-height 1.15 */
      const PAD    = 4;
      const TOTAL  = LINES.length * LH + PAD * 2;
      const SAMPLE = isMobile ? 4 : 3;        /* bước lấy mẫu pixel */

      /* Thiết lập canvas */
      canvas.width        = W * dpr;
      canvas.height       = TOTAL * dpr;
      canvas.style.width  = W + "px";
      canvas.style.height = TOTAL + "px";

      /* Canvas ẩn để render chữ → lấy pixel */
      const off  = document.createElement("canvas");
      off.width  = W * dpr;
      off.height = TOTAL * dpr;
      const octx = off.getContext("2d");
      octx.scale(dpr, dpr);

      const particles = [];

      LINES.forEach((line, i) => {
        const y = PAD + i * LH;

        octx.save();
        octx.font          = `800 ${FS}px Inter,"Segoe UI",system-ui,sans-serif`;
        octx.textBaseline  = "top";
        octx.letterSpacing = "-0.03em";

        if (line.type === "gradient") {
          /* Gradient cyan → blue như trong CSS .gradient */
          const g = octx.createLinearGradient(0, 0, W * 0.9, 0);
          g.addColorStop(0, "rgb(0,212,255)");
          g.addColorStop(1, "rgb(0,102,255)");
          octx.fillStyle = g;
        } else {
          octx.fillStyle = "rgb(255,255,255)";
        }

        octx.fillText(line.text, 0, y);
        octx.restore();

        /* Lấy mẫu pixel → tạo particle */
        const id = octx.getImageData(0, y * dpr, W * dpr, LH * dpr);
        for (let py = 0; py < LH * dpr; py += SAMPLE) {
          for (let px = 0; px < W * dpr; px += SAMPLE) {
            const idx = (py * W * dpr + px) * 4;
            if (id.data[idx + 3] > 80) {
              particles.push(new Particle(
                px / dpr,
                y + py / dpr,
                id.data[idx],
                id.data[idx + 1],
                id.data[idx + 2],
                id.data[idx + 3] / 255,
              ));
            }
          }
        }
      });

      /* Animation loop — dừng khi tất cả đã hội tụ */
      const t0 = performance.now();

      const animate = (now) => {
        const elapsed = (now - t0) / 1000;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.scale(dpr, dpr);

        let allSettled = true;
        for (const p of particles) {
          p.update(elapsed);
          if (!p.settled) allSettled = false;
          p.draw(ctx);
        }

        ctx.globalAlpha = 1;
        ctx.restore();

        if (!allSettled) rafId = requestAnimationFrame(animate);
      };

      rafId = requestAnimationFrame(animate);
    };

    run();
    return () => { if (rafId) cancelAnimationFrame(rafId); };
  }, []);

  return (
    /* margin-bottom 24px như .title gốc */
    <div style={{ marginBottom: "24px" }}>
      {/* h1 ẩn cho SEO / screen reader */}
      <h1 style={{
        position: "absolute",
        width: "1px", height: "1px",
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
        whiteSpace: "nowrap",
      }}>
        Tối ưu hoá sức mạnh Performance Marketing Bất động sản
      </h1>
      <canvas ref={canvasRef} aria-hidden="true" style={{ display: "block" }} />
    </div>
  );
}
