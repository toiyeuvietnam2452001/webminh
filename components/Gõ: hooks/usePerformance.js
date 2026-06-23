"use client";
import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────
   Config theo tier
   high   → Mac M-series / GPU rời (GeForce, Radeon RX...)
   medium → Intel/AMD integrated, laptop tầm trung
   low    → Máy cũ / điện thoại / không có WebGL2
──────────────────────────────────────────────────── */
export const PERF_CONFIGS = {
  high: {
    enableShader:   true,
    iterations:     35,   // AuroraShaderBG
    octaves:        3,
    fbmIter:        5,    // AnimatedShaderBG
    mainIter:       12,
    neuralIter:     15,   // NeuralNoise
    fps:            60,
    pixelRatio:     2,
    motionEnabled:  true,
    particleCount:  140,
  },
  medium: {
    enableShader:   true,
    iterations:     20,
    octaves:        2,
    fbmIter:        3,
    mainIter:       8,
    neuralIter:     10,
    fps:            30,
    pixelRatio:     1,
    motionEnabled:  true,
    particleCount:  70,
  },
  low: {
    enableShader:   false,
    iterations:     0,
    octaves:        0,
    fbmIter:        0,
    mainIter:       0,
    neuralIter:     0,
    fps:            0,
    pixelRatio:     1,
    motionEnabled:  false,
    particleCount:  30,
  },
};

function detectTier() {
  if (typeof window === "undefined") return "medium";

  // Mobile → low ngay
  if (/Mobi|Android/i.test(navigator.userAgent)) return "low";

  const cores  = navigator.hardwareConcurrency || 4;
  const ram    = navigator.deviceMemory; // Chrome only, undefined trên Safari

  // Kiểm tra WebGL2
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return "low";

    // Đọc thông tin GPU (nếu browser cho phép)
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL).toLowerCase();

      // Mac M-series hoặc GPU rời → high
      if (renderer.includes("apple")) return "high";
      const dedicated = ["geforce", "quadro", "radeon rx", "radeon pro", "tesla", "arc a"];
      if (dedicated.some(p => renderer.includes(p))) return "high";

      // Intel integrated → medium (không phải low vì vẫn chạy được)
      if (renderer.includes("intel")) return "medium";

      // AMD integrated → medium
      if (renderer.includes("amd") || renderer.includes("radeon")) return "medium";
    }
  } catch { return "low"; }

  // Fallback: dùng CPU cores + RAM
  if (cores <= 2 || (ram && ram <= 2)) return "low";
  if (cores >= 8 || (ram && ram >= 8)) return "high";
  return "medium";
}

export function usePerformance() {
  const [tier, setTier] = useState("medium"); // SSR-safe default

  useEffect(() => {
    setTier(detectTier());
  }, []);

  const config = PERF_CONFIGS[tier];
  const pixelRatio = Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio : 1,
    config.pixelRatio
  );

  return { tier, config, pixelRatio };
}
