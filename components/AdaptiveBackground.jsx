"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ScrollBgManager = dynamic(() => import("./ScrollBgManager"), { ssr: false });
const SmartBackground  = dynamic(() => import("./SmartBackground"),  { ssr: false });

function detectCapability() {
  try {
    // Phải support WebGL2
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return "canvas2d"; // Không có WebGL2 → SmartBackground

    // CPU cores tối thiểu 4
    const cores = navigator.hardwareConcurrency || 2;
    if (cores < 4) return "canvas2d";

    // RAM tối thiểu 4GB (chỉ Chrome/Edge)
    const memory = navigator.deviceMemory;
    if (memory !== undefined && memory < 4) return "canvas2d";

    // Mobile/Desktop đều dùng ScrollBgManager nếu đủ điều kiện
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

  // ScrollBgManager chạy cả desktop lẫn mobile (shader tự detect và dùng CSS fallback)
  return mode === "webgl"
    ? <ScrollBgManager />
    : <SmartBackground />;
}
