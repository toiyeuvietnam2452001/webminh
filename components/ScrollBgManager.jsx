"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const NeuralNoise      = dynamic(() => import("./NeuralNoise"),      { ssr: false });
const AnimatedShaderBG = dynamic(() => import("./AnimatedShaderBG"), { ssr: false });

/*
  Nửa trên (Hero, Clients, Features)  → index 0: NeuralNoise
  Nửa dưới (Process, Pricing)         → index 1: AnimatedShaderBG
*/

/* CSS gradient hiện ngay — fallback cho mọi thiết bị */
const CSS_BG = [
  "radial-gradient(ellipse at 55% 38%, #4a0096 0%, #280050 38%, #100020 72%, #060010 100%)",
  "radial-gradient(ellipse at 42% 55%, #004a70 0%, #002545 40%, #001025 72%, #000810 100%)",
];

function isMobile() {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function canUseWebGL2() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch { return false; }
}

function getTransMs() {
  if (typeof window === "undefined") return 900;
  const c = navigator.hardwareConcurrency || 4;
  const r = navigator.deviceMemory;
  if (c >= 8 || (r && r >= 8)) return 1400;
  if (c <= 2 || (r && r <= 2)) return 500;
  return 900;
}

/* Mỗi layer = 1 "tầng" background trong crossfade */
export default function ScrollBgManager() {
  /* CSS layers luôn render ngay từ đầu — không bao giờ null */
  const [cssLayers, setCssLayers] = useState([
    { uid: 0, bgIndex: 0, opacity: 1 },
  ]);

  /* Desktop + WebGL: shader component overlay */
  const [shaderOn,   setShaderOn]   = useState(false);
  const [shaderIdx,  setShaderIdx]  = useState(0);
  const [shaderOpacity, setShaderOpacity] = useState(1);

  const activeRef = useRef(0);
  const uidRef    = useRef(1);
  const timerRef  = useRef(null);
  const msRef     = useRef(900);

  /* Detect desktop + webgl sau khi mount */
  useEffect(() => {
    msRef.current = getTransMs();
    const desktop = !isMobile() && canUseWebGL2();
    setShaderOn(desktop);
  }, []);

  /* Crossfade CSS layers */
  const crossfadeCSS = (next) => {
    const ms  = msRef.current;
    const uid = uidRef.current++;

    setCssLayers(prev => [...prev, { uid, bgIndex: next, opacity: 0 }]);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      setCssLayers(prev =>
        prev.map(l => ({ ...l, opacity: l.uid === uid ? 1 : 0 }))
      );
    }));

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCssLayers([{ uid, bgIndex: next, opacity: 1 }]);
    }, ms + 200);
  };

  /* Crossfade shader overlay (desktop) */
  const crossfadeShader = (next) => {
    const ms = msRef.current;
    setShaderOpacity(0); // fade out hiện tại

    setTimeout(() => {
      setShaderIdx(next);   // đổi shader
      setShaderOpacity(1);  // fade in mới
    }, ms * 0.6); // đổi ở điểm giữa crossfade
  };

  /* Hàm chuyển cảnh chung */
  const switchTo = (next) => {
    if (next === activeRef.current) return;
    activeRef.current = next;
    crossfadeCSS(next);
    if (shaderOn) crossfadeShader(next);
  };

  /* IntersectionObserver — nửa dưới khi thấy process/pricing */
  useEffect(() => {
    const vis = { process: false, pricing: false };
    const decide = () => {
      switchTo((vis.process || vis.pricing) ? 1 : 0);
    };
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { vis[e.target.id] = e.isIntersecting; });
        decide();
      },
      { threshold: 0.08 }
    );
    ["process", "pricing"].forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => { obs.disconnect(); clearTimeout(timerRef.current); };
  }, [shaderOn]); // re-run sau khi shaderOn được set

  const ms = msRef.current;

  const SHADER = {
    0: <NeuralNoise      color={[0.4, 0.1, 0.88]} speed={0.001} />,
    1: <AnimatedShaderBG />,
  };

  return (
    <>
      {/* CSS gradient layers — luôn visible mọi thiết bị */}
      {cssLayers.map(({ uid, bgIndex, opacity }) => (
        <div
          key={uid}
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh",
            zIndex: 0,
            pointerEvents: "none",
            background: CSS_BG[bgIndex],
            opacity,
            transition: `opacity ${ms}ms cubic-bezier(0.45, 0, 0.55, 1)`,
          }}
        />
      ))}

      {/* Shader overlay — chỉ desktop có WebGL2 */}
      {shaderOn && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            opacity: shaderOpacity,
            transition: `opacity ${ms * 0.6}ms cubic-bezier(0.45, 0, 0.55, 1)`,
          }}
        >
          {SHADER[shaderIdx]}
        </div>
      )}
    </>
  );
}
