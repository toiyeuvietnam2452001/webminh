"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const NeuralNoise      = dynamic(() => import("./NeuralNoise"),      { ssr: false });
const AnimatedShaderBG = dynamic(() => import("./AnimatedShaderBG"), { ssr: false });

const CSS_BG = [
  "radial-gradient(ellipse at 55% 38%, #00a8d4 0%, #004d70 38%, #001a28 72%, #000810 100%)",
  "radial-gradient(ellipse at 42% 55%, #001a4d 0%, #000d2e 40%, #00061a 72%, #000308 100%)",
];

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch { return false; }
}

function getMs() {
  if (typeof window === "undefined") return 900;
  const c = navigator.hardwareConcurrency || 4;
  const r = navigator.deviceMemory;
  if (c >= 8 || (r && r >= 8)) return 1200;
  if (c <= 2 || (r && r <= 2)) return 500;
  return 800;
}

export default function ScrollBgManager() {
  const [layers,        setLayers]        = useState([{ uid:0, idx:0, opacity:1 }]);
  const [shaderIdx,     setShaderIdx]     = useState(0);
  const [shaderVisible, setShaderVisible] = useState(true);
  const [useShader,     setUseShader]     = useState(false);

  const activeRef = useRef(0);
  const uidRef    = useRef(1);
  const timerCSS  = useRef(null);
  const timerShdr = useRef(null);
  const msRef     = useRef(800);

  useEffect(() => {
    msRef.current = getMs();
    // Cho phép shader cả mobile lẫn desktop — miễn có WebGL
    if (canUseWebGL()) setUseShader(true);
  }, []);

  const crossfadeTo = (next) => {
    if (next === activeRef.current) return;
    activeRef.current = next;
    const ms  = msRef.current;
    const uid = uidRef.current++;

    // CSS crossfade
    setLayers(prev => [...prev, { uid, idx:next, opacity:0 }]);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setLayers(prev => prev.map(l => ({ ...l, opacity: l.uid===uid ? 1 : 0 })));
    }));
    clearTimeout(timerCSS.current);
    timerCSS.current = setTimeout(() => {
      setLayers([{ uid, idx:next, opacity:1 }]);
    }, ms + 200);

    // Shader crossfade: fade out → swap → fade in
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
    const vis = { process:false, pricing:false };
    const decide = () => crossfadeTo((vis.process || vis.pricing) ? 1 : 0);
    const obs = new IntersectionObserver(
      entries => { entries.forEach(e => { vis[e.target.id]=e.isIntersecting; }); decide(); },
      { threshold: 0.08 }
    );
    ["process","pricing"].forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => { obs.disconnect(); clearTimeout(timerCSS.current); clearTimeout(timerShdr.current); };
  }, [useShader]);

  const ms = msRef.current;

  return (
    <>
      {/* CSS gradient base — mọi thiết bị, luôn hiện */}
      {layers.map(({ uid, idx, opacity }) => (
        <div key={uid} style={{
          position:"fixed", inset:0,
          zIndex:0, pointerEvents:"none",
          background: CSS_BG[idx],
          opacity,
          transition:`opacity ${ms}ms cubic-bezier(0.45,0,0.55,1)`,
        }} />
      ))}

      {/* WebGL shader overlay — mobile + desktop, nếu có WebGL */}
      {useShader && (
        <div style={{
          position:"fixed", inset:0,
          zIndex:0, pointerEvents:"none",
          opacity: shaderVisible ? 1 : 0,
          transition:`opacity ${ms*0.5}ms cubic-bezier(0.45,0,0.55,1)`,
        }}>
          {shaderIdx === 0
            ? <NeuralNoise color={[0.0, 0.72, 1.0]} speed={0.001} />
            : <AnimatedShaderBG />
          }
        </div>
      )}
    </>
  );
}
