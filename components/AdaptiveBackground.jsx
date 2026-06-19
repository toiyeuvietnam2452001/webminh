"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Load lazy để tránh lỗi SSR
const ScrollBgManager = dynamic(() => import("./ScrollBgManager"), { ssr: false });
const SmartBackground = dynamic(() => import("./SmartBackground"), { ssr: false });

function detectCapability() {
  try {
    // 1. Phải support WebGL2
    const testCanvas = document.createElement("canvas");
    const gl = testCanvas.getContext("webgl2");
    if (!gl) return "canvas2d";

    // 2. Phải có đủ CPU cores (4+ = máy tạm ổn)
    const cores = navigator.hardwareConcurrency || 2;
    if (cores < 4) return "canvas2d";

    // 3. RAM tối thiểu 4GB (Chrome/Edge có API này, Firefox/Safari bỏ qua)
    const memory = navigator.deviceMemory;
    if (memory !== undefined && memory < 4) return "canvas2d";

    // Đạt đủ điều kiện → dùng WebGL
    return "webgl";
  } catch (e) {
    return "canvas2d";
  }
}

export default function AdaptiveBackground() {
  // null = chưa detect (tránh flicker), "webgl" hoặc "canvas2d"
  const [mode, setMode] = useState(null);

  useEffect(() => {
    setMode(detectCapability());
  }, []);

  // Chưa detect xong → không render gì (tránh nhấp nháy)
  if (!mode) return null;

  return mode === "webgl"
    ? <ScrollBgManager />   // Máy tốt: 3 WebGL shaders đẹp
    : <SmartBackground />;  // Máy yếu: Canvas 2D mượt, tương thích mọi thiết bị
}
