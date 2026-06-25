"use client";
import { useEffect, useRef } from "react";

/*
  3 theme màu rõ ràng, đẹp trên cả desktop & mobile:
  Hero + Clients     → Theme 0: Cyan/Blue (tím xanh đặc trưng)
  Features + Process → Theme 1: Purple/Violet (tím neural)
  Pricing + Contact  → Theme 2: Deep Blue/Teal (xanh đậm sang)
*/
const THEMES = [
  {
    bg:       [[0, 6, 18],   [0, 22, 55],   [0, 40, 90]],
    particle: [0, 212, 255],
    line:     [0, 150, 220],
  },
  {
    bg:       [[12, 0, 25],  [28, 0, 60],   [50, 0, 105]],
    particle: [160, 80, 255],
    line:     [120, 50, 220],
  },
  {
    bg:       [[0, 12, 25],  [0, 30, 60],   [0, 55, 100]],
    particle: [0, 200, 180],
    line:     [0, 160, 140],
  },
];

function lerp(a, b, t) { return a + (b - a) * t; }
function lerpArr(a, b, t) { return a.map((v, i) => Math.round(lerp(v, b[i], t))); }

export default function SmartBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");

    let particles   = [];
    let count       = 60;
    let theme       = 0;
    let targetTheme = 0;
    let themeT      = 1.0;
    let animId      = null;
    let fps         = 60;
    let frameCount  = 0;
    let lastCheck   = performance.now();

    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) count = 35; // Ít particle hơn trên mobile

    const mkParticle = () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (isMobile ? 0.4 : 0.6),
      vy: (Math.random() - 0.5) * (isMobile ? 0.4 : 0.6),
      r:  Math.random() * 1.6 + 0.6,
      op: Math.random() * 0.45 + 0.25,
    });

    const init = () => {
      particles = Array.from({ length: count }, mkParticle);
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const render = (now) => {
      // FPS tự điều chỉnh
      frameCount++;
      if (now - lastCheck >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastCheck  = now;
        if (fps < 25 && count > 20) {
          count -= 10;
          particles = particles.slice(0, count);
        } else if (fps > 50 && count < (isMobile ? 50 : 100)) {
          count += 5;
          while (particles.length < count) particles.push(mkParticle());
        }
      }

      // Theme transition mượt (0.006/frame ≈ 2.5s)
      if (themeT < 1) {
        themeT = Math.min(1, themeT + 0.006);
        if (themeT >= 1) theme = targetTheme;
      }

      const t1 = THEMES[theme];
      const t2 = THEMES[targetTheme];
      const p  = themeT;

      const pc = lerpArr(t1.particle, t2.particle, p);
      const lc = lerpArr(t1.line,     t2.line,     p);
      const b0 = lerpArr(t1.bg[0],    t2.bg[0],    p);
      const b1 = lerpArr(t1.bg[1],    t2.bg[1],    p);
      const b2 = lerpArr(t1.bg[2],    t2.bg[2],    p);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0,   `rgb(${b0})`);
      grad.addColorStop(0.5, `rgb(${b1})`);
      grad.addColorStop(1,   `rgb(${b2})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update + vẽ particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.99; p.vy *= 0.99;
        const spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        if (spd > 1.2) { p.vx = p.vx/spd*1.2; p.vy = p.vy/spd*1.2; }
        if (p.x < 0)            { p.x = 0;            p.vx =  Math.abs(p.vx); }
        if (p.x > canvas.width) { p.x = canvas.width;  p.vx = -Math.abs(p.vx); }
        if (p.y < 0)            { p.y = 0;            p.vy =  Math.abs(p.vy); }
        if (p.y > canvas.height){ p.y = canvas.height; p.vy = -Math.abs(p.vy); }
      }

      // Lines
      const MAX_DIST = isMobile ? 110 : 140;
      ctx.lineWidth = 0.7;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < MAX_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lc},${((1 - d/MAX_DIST) * 0.35).toFixed(2)})`;
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pc},${p.op})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    // Mouse interaction (chỉ desktop)
    let mouse = { x: -9999, y: -9999 };
    const onMove  = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = ()  => { mouse.x = -9999; mouse.y = -9999; };
    if (!isMobile) {
      window.addEventListener("mousemove",  onMove,  { passive: true });
      window.addEventListener("mouseleave", onLeave);
    }

    window.addEventListener("resize", resize, { passive: true });

    // Đổi theme theo section
    const vis = {};
    const decide = () => {
      let next = 0;
      if (vis.pricing || vis.contact)            next = 2;
      else if (vis.features || vis.process)       next = 1;
      if (next !== targetTheme) {
        theme       = targetTheme;
        targetTheme = next;
        themeT      = 0;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { vis[e.target.id] = e.isIntersecting; });
        decide();
      },
      { threshold: 0.1 }
    );
    ["features", "process", "pricing", "contact"].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Dừng khi tab ẩn
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else animId = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVis);

    resize();
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",     resize);
      document.removeEventListener("visibilitychange", onVis);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
