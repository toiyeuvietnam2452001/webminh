"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ScrollBgManager = dynamic(() => import("./ScrollBgManager"), { ssr: false });
const SmartBackground = dynamic(() => import("./SmartBackground"), { ssr: false });

function detectCapability() {
  try {
    // Phải support WebGL2
    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return "canvas2d"; // Không có WebGL2 → SmartBackground

    // IOS/Safari giấu số cores thật, nên iPhone xịn vẫn trả < 4, RAM undefined.
    // Nếu thiết bị có hỗ trợ WebGL2, ta cho qua để chạy WebGL, các Shader tự drop cấu hình.
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
