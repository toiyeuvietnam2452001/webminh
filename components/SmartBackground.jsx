"use client";
import { useEffect, useRef } from "react";

// 3 theme màu theo section
const THEMES = [
  // Hero + Clients: cyan/blue
  { bg: [[0,8,20],[0,29,61],[0,53,102]], particle: [0,212,255], line: [0,150,220] },
  // Features + Process: purple/violet
  { bg: [[10,0,21],[26,0,53],[45,0,96]], particle: [160,60,255], line: [120,40,220] },
  // Pricing + Contact: deep gold/teal
  { bg: [[10,8,0],[26,18,0],[45,32,0]], particle: [255,170,0], line: [220,130,0] },
];

function lerp(a, b, t) { return a + (b - a) * t; }
function lerpArr(a, b, t) { return a.map((v, i) => Math.round(lerp(v, b[i], t))); }

export default function SmartBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    // State
    let particles    = [];
    let count        = 70;       // số particle ban đầu
    let theme        = 0;        // theme hiện tại
    let targetTheme  = 0;
    let themeT       = 1.0;      // 0→1 transition progress
    let mouse        = { x: -2000, y: -2000 };
    let animId       = null;
    let fps          = 60;
    let frameCount   = 0;
    let lastCheck    = performance.now();

    // ── Helpers ──────────────────────────────────────────
    const mkParticle = () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r:  Math.random() * 1.8 + 0.8,
      op: Math.random() * 0.45 + 0.3,
    });

    const init = () => {
      particles = Array.from({ length: count }, mkParticle);
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    // ── Render loop ───────────────────────────────────────
    const render = (now) => {
      // FPS check — tự điều chỉnh số particle
      frameCount++;
      if (now - lastCheck >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastCheck  = now;

        if (fps < 28 && count > 30) {
          count -= 15;
          particles = particles.slice(0, count);
        } else if (fps > 55 && count < 110) {
          count += 8;
          while (particles.length < count) particles.push(mkParticle());
        }
      }

      // Advance theme transition (0.007/frame ≈ 2.4s)
      if (themeT < 1) {
        themeT = Math.min(1, themeT + 0.007);
        if (themeT >= 1) theme = targetTheme;
      }

      // Lerp colors
      const t1 = THEMES[theme];
      const t2 = THEMES[targetTheme];
      const p  = themeT;
      const pc = lerpArr(t1.particle, t2.particle, p);
      const lc = lerpArr(t1.line,     t2.line,     p);
      const b0 = lerpArr(t1.bg[0], t2.bg[0], p);
      const b1 = lerpArr(t1.bg[1], t2.bg[1], p);
      const b2 = lerpArr(t1.bg[2], t2.bg[2], p);

      // Background
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0,   `rgb(${b0})`);
      grad.addColorStop(0.5, `rgb(${b1})`);
      grad.addColorStop(1,   `rgb(${b2})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;

        // Chuột đẩy nhẹ
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 12000) {
          const d  = Math.sqrt(d2);
          const f  = (110 - d) / 110 * 0.25;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }

        // Dampen
        p.vx *= 0.99; p.vy *= 0.99;

        // Giới hạn tốc độ
        const spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        if (spd > 1.5) { p.vx = p.vx/spd*1.5; p.vy = p.vy/spd*1.5; }

        // Bounce edges
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > canvas.width)  { p.x = canvas.width;  p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy = -Math.abs(p.vy); }
      }

      // Vẽ lines (O(n²) nhưng Canvas 2D rất nhanh)
      const MAX_DIST = 140;
      const len = particles.length;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lc},${((1 - d/MAX_DIST) * 0.38).toFixed(2)})`;
            ctx.stroke();
          }
        }
      }

      // Vẽ dots
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pc},${p.op})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    // ── Events ────────────────────────────────────────────
    const onMove  = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = ()  => { mouse.x = -2000; mouse.y = -2000; };
    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize",     resize,  { passive: true });

    // IntersectionObserver đổi theme theo section
    const visible = {};
    const decide  = () => {
      let next = 0;
      if (visible.pricing)                          next = 2;
      else if (visible.features || visible.process) next = 1;
      if (next !== targetTheme) {
        theme       = targetTheme;
        targetTheme = next;
        themeT      = 0;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { visible[e.target.id] = e.isIntersecting; });
        decide();
      },
      { threshold: 0.15 }
    );
    ["features", "process", "pricing"].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Start
    resize();
    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",     resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
