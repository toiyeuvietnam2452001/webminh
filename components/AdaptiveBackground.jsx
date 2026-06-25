"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ScrollBgManager = dynamic(() => import("./ScrollBgManager"), { ssr: false });
const SmartBackground  = dynamic(() => import("./SmartBackground"),  { ssr: false });

function detectCapability() {
  try {
    // Mobile/tablet → SmartBackground Canvas 2D (ổn định, mượt trên mọi điện thoại)
    if (/Mobi|Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return "canvas2d";
    }

    // Phải support WebGL2
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return "canvas2d";

    // CPU cores tối thiểu 4
    const cores = navigator.hardwareConcurrency || 2;
    if (cores < 4) return "canvas2d";

    // RAM tối thiểu 4GB (chỉ Chrome/Edge có API này)
    const memory = navigator.deviceMemory;
    if (memory !== undefined && memory < 4) return "canvas2d";

    return "webgl";
  } catch (e) {
    return "canvas2d";
  }
}

export default function AdaptiveBackground() {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    setMode(detectCapability());
  }, []);

  if (!mode) return null;

  return mode === "webgl"
    ? <ScrollBgManager />
    : <SmartBackground />;
}
