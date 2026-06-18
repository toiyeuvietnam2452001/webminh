"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import để tránh SSR lỗi WebGL
const ShaderBackground = dynamic(() => import("./ShaderBackground"), { ssr: false });
const NeuralNoise       = dynamic(() => import("./NeuralNoise"),      { ssr: false });
const AnimatedShaderBG  = dynamic(() => import("./AnimatedShaderBG"), { ssr: false });

/*
  3 backgrounds chuyển cảnh theo section:
  ┌─────────────────────────────────────────────────────┐
  │  Hero + Clients     →  BG1: ShaderBackground (hiện tại) │
  │  Features + Process →  BG2: NeuralNoise (tím/neural)    │
  │  Pricing + Footer   →  BG3: AnimatedShaderBG (cloud)    │
  └─────────────────────────────────────────────────────┘
  Transition: opacity 0.9s ease — IntersectionObserver
  trigger khi section vào 15% viewport.
*/

export default function ScrollBgManager() {
  // 0 = ShaderBG, 1 = NeuralNoise, 2 = CloudShader
  const [activeBg, setActiveBg] = useState(0);

  useEffect(() => {
    // Track từng section có đang visible không
    const visible = { features: false, process: false, pricing: false };

    const decide = () => {
      if (visible.pricing) {
        setActiveBg(2);
      } else if (visible.features || visible.process) {
        setActiveBg(1);
      } else {
        setActiveBg(0);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible[entry.target.id] = entry.isIntersecting;
        });
        decide();
      },
      {
        threshold: 0.15,          // trigger khi 15% section vào viewport
        rootMargin: "0px 0px 0px 0px",
      }
    );

    ["features", "process", "pricing"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const layer = (index, content) => (
    <div
      key={index}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: activeBg === index ? 1 : 0,
        transition: "opacity 0.9s ease",
        // willChange để browser chuẩn bị composite layer
        willChange: "opacity",
      }}
    >
      {content}
    </div>
  );

  return (
    <>
      {layer(0, <ShaderBackground />)}
      {layer(1, <NeuralNoise color={[0.4, 0.1, 0.88]} speed={0.001} />)}
      {layer(2, <AnimatedShaderBG />)}
    </>
  );
}
