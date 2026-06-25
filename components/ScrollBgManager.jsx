"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const NeuralNoise      = dynamic(() => import("./NeuralNoise"),      { ssr: false });
const AnimatedShaderBG = dynamic(() => import("./AnimatedShaderBG"), { ssr: false });

/*
  Nửa trên (Hero → Features)   → 0: NeuralNoise     (tím)
  Nửa dưới (Process → Pricing) → 1: AnimatedShaderBG (xanh)

  z-index strategy:
  - Background layers: z-index = 0  (sau content)
  - Page content (page.jsx wrapper): z-index = 1  (trước background)
  → Content KHÔNG BAO GIỜ bị che
*/

const CSS_BG = [
  "radial-gradient(ellipse at 55% 38%, #4a0096 0%, #280050 38%, #100020 72%, #060010 100%)",
  "radial-gradient(ellipse at 42% 55%, #004a70 0%, #002545 40%, #001025 72%, #000810 100%)",
];

function isMobileDevice() {
  if (typeof navigator === "undefined") return false;
  return /Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function canWebGL2() {
  try { return !!document.createElement("canvas").getContext("webgl2"); }
  catch { return false; }
}

function getMs() {
  if (typeof window === "undefined") return 900;
  const c = navigator.hardwareConcurrency || 4;
  const r = navigator.deviceMemory;
  if (c >= 8 || (r && r >= 8)) return 1400;
  if (c <= 2 || (r && r <= 2)) return 500;
  return 900;
}

export default function ScrollBgManager() {
  /* Luôn render ngay — không có null */
  const [layers, setLayers]   = useState([{ uid: 0, idx: 0, opacity: 1 }]);
  const [shaderIdx, setShaderIdx]     = useState(0);
  const [shaderVisible, setShaderVisible] = useState(true);
  const [useShader, setUseShader]     = useState(false);

  const activeRef = useRef(0);
  const uidRef    = useRef(1);
  const timerCSS  = useRef(null);
  const timerShdr = useRef(null);
  const msRef     = useRef(900);

  useEffect(() => {
    msRef.current = getMs();
    /* Chỉ dùng shader trên desktop có WebGL2 */
    if (!isMobileDevice() && canWebGL2()) setUseShader(true);
  }, []);

  const crossfadeTo = (next) => {
    if (next === activeRef.current) return;
    activeRef.current = next;
    const ms  = msRef.current;
    const uid = uidRef.current++;

    /* CSS crossfade */
    setLayers(prev => [...prev, { uid, idx: next, opacity: 0 }]);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setLayers(prev => prev.map(l => ({ ...l, opacity: l.uid === uid ? 1 : 0 })));
    }));
    clearTimeout(timerCSS.current);
    timerCSS.current = setTimeout(() => {
      setLayers([{ uid, idx: next, opacity: 1 }]);
    }, ms + 200);

    /* Shader crossfade đồng bộ — fade out → đổi → fade in */
    if (useShader) {
      setShaderVisible(false);
      clearTimeout(timerShdr.current);
      timerShdr.current = setTimeout(() => {
        setShaderIdx(next);
        setShaderVisible(true);
      }, ms * 0.5);
    }
  };

  useEffect(() => {
    const vis = { process: false, pricing: false };
    const decide = () => {
      crossfadeTo((vis.process || vis.pricing) ? 1 : 0);
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
    return () => { obs.disconnect(); clearTimeout(timerCSS.current); clearTimeout(timerShdr.current); };
  }, [useShader]);

  const ms = msRef.current;

  return (
    <>
      {/* CSS gradient — luôn hiện, mọi thiết bị, z-index 0 */}
      {layers.map(({ uid, idx, opacity }) => (
        <div
          key={uid}
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh",
            zIndex: 0,
            pointerEvents: "none",
            background: CSS_BG[idx],
            opacity,
            transition: `opacity ${ms}ms cubic-bezier(0.45, 0, 0.55, 1)`,
          }}
        />
      ))}

      {/* WebGL shader — chỉ desktop, cũng z-index 0 */}
      {useShader && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            opacity: shaderVisible ? 1 : 0,
            transition: `opacity ${ms * 0.5}ms cubic-bezier(0.45, 0, 0.55, 1)`,
          }}
        >
          {shaderIdx === 0
            ? <NeuralNoise color={[0.4, 0.1, 0.88]} speed={0.001} />
            : <AnimatedShaderBG />
          }
        </div>
      )}
    </>
  );
}
