"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const ShaderBackground = dynamic(() => import("./ShaderBackground"), { ssr: false });
const NeuralNoise      = dynamic(() => import("./NeuralNoise"),      { ssr: false });
const AnimatedShaderBG = dynamic(() => import("./AnimatedShaderBG"), { ssr: false });

/* ─── Gradient mobile — màu đủ sáng để thấy rõ ─── */
const MOBILE_BG = [
  // 0 Hero: xanh cyan đậm
  "linear-gradient(145deg, #00102a 0%, #001d4a 45%, #003580 75%, #001d4a 100%)",
  // 1 Features/Process: tím violet
  "radial-gradient(ellipse at 55% 40%, #4a0096 0%, #280050 40%, #100020 75%, #060010 100%)",
  // 2 Pricing: teal xanh biển
  "radial-gradient(ellipse at 45% 55%, #004a70 0%, #002545 40%, #001025 75%, #000810 100%)",
];

function getTransMs() {
  if (typeof window === "undefined") return 800;
  const cores = navigator.hardwareConcurrency || 4;
  const ram   = navigator.deviceMemory;
  if (cores >= 8 || (ram && ram >= 8)) return 1200;
  if (cores <= 2 || (ram && ram <= 2)) return 500;
  return 800;
}

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile Safari/i
    .test(navigator.userAgent);
}

export default function ScrollBgManager() {
  const [layers,   setLayers]   = useState([{ uid: 0, bgIndex: 0, opacity: 1 }]);
  const [mobile,   setMobile]   = useState(null); // null = chưa detect
  const activeRef  = useRef(0);
  const uidRef     = useRef(1);
  const timerRef   = useRef(null);
  const msRef      = useRef(800);

  /* Detect mobile + transition duration */
  useEffect(() => {
    setMobile(isMobileDevice());
    msRef.current = getTransMs();
  }, []);

  /* Crossfade chung cho cả mobile lẫn desktop */
  const crossfadeTo = (next) => {
    if (next === activeRef.current) return;
    activeRef.current = next;

    const ms  = msRef.current;
    const uid = uidRef.current++;

    setLayers(prev => [...prev, { uid, bgIndex: next, opacity: 0 }]);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      setLayers(prev => prev.map(l => ({
        ...l, opacity: l.uid === uid ? 1 : 0,
      })));
    }));

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLayers([{ uid, bgIndex: next, opacity: 1 }]);
    }, ms + 200);
  };

  /* IntersectionObserver — theo dõi scroll */
  useEffect(() => {
    const vis = { features: false, process: false, pricing: false };
    const decide = () => {
      const next = vis.pricing ? 2 : (vis.features || vis.process) ? 1 : 0;
      crossfadeTo(next);
    };
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { vis[e.target.id] = e.isIntersecting; });
        decide();
      },
      { threshold: 0.08 } // threshold thấp hơn để trigger sớm hơn trên mobile
    );
    ["features", "process", "pricing"].forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => { obs.disconnect(); clearTimeout(timerRef.current); };
  }, []);

  /* Chưa detect xong → không render tránh flash */
  if (mobile === null) return null;

  const ms = msRef.current;

  /* ─── MOBILE: CSS gradient div thuần, không WebGL ─── */
  if (mobile) {
    return (
      <>
        {layers.map(({ uid, bgIndex, opacity }) => (
          <div
            key={uid}
            style={{
              position: "fixed",
              top: 0, left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 0,
              pointerEvents: "none",
              background: MOBILE_BG[bgIndex],
              opacity,
              transition: `opacity ${ms}ms cubic-bezier(0.45, 0, 0.55, 1)`,
            }}
          />
        ))}
      </>
    );
  }

  /* ─── DESKTOP: WebGL shader components ─── */
  const COMPS = {
    0: (k) => <ShaderBackground key={k} />,
    1: (k) => <NeuralNoise key={k} color={[0.4, 0.1, 0.88]} speed={0.001} />,
    2: (k) => <AnimatedShaderBG key={k} />,
  };

  return (
    <>
      {layers.map(({ uid, bgIndex, opacity }) => (
        <div
          key={uid}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            opacity,
            transition: `opacity ${ms}ms cubic-bezier(0.45, 0, 0.55, 1)`,
          }}
        >
          {COMPS[bgIndex](uid)}
        </div>
      ))}
    </>
  );
}
