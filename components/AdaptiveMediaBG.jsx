"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Máy tốt: ParticlesBackground (hiện tại) — cyan network particles
// Máy yếu: SmartBackground Canvas 2D — theme 0 (cyan) vì không có section IDs
const ParticlesBackground = dynamic(() => import("./particles-bg"),   { ssr: false });
const SmartBackground     = dynamic(() => import("./SmartBackground"), { ssr: false });

function detectCapability() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return "low";

    const cores  = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory;
    if (cores < 4) return "low";
    if (memory !== undefined && memory < 4) return "low";

    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL).toLowerCase();

      if (renderer.includes("apple"))    return "high"; // Mac M-series
      const dedicated = ["geforce", "quadro", "radeon rx", "radeon pro", "tesla", "arc a"];
      if (dedicated.some(p => renderer.includes(p))) return "high";
      if (renderer.includes("intel"))    return "low";  // Intel integrated
      if (renderer.includes("amd") || renderer.includes("radeon")) return "low"; // AMD integrated
    }

    return cores >= 12 ? "high" : "low";
  } catch (e) {
    return "low";
  }
}

export default function AdaptiveMediaBG() {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    setMode(detectCapability());
  }, []);

  if (!mode) return null;

  return mode === "high"
    ? <ParticlesBackground />   // Mac/card rời: cyan network đẹp
    : <SmartBackground />;      // Máy yếu: Canvas 2D theme cyan (tự nhiên vì không có section)
}
