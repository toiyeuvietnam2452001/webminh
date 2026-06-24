"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const ShaderBackground = dynamic(() => import("./ShaderBackground"), { ssr: false });
const NeuralNoise      = dynamic(() => import("./NeuralNoise"),      { ssr: false });
const AnimatedShaderBG = dynamic(() => import("./AnimatedShaderBG"), { ssr: false });

/* Thời gian crossfade theo cấu hình máy */
function getTransMs() {
  if (typeof window === "undefined") return 900;
  const cores = navigator.hardwareConcurrency || 4;
  const ram   = navigator.deviceMemory;
  if (cores >= 8 || (ram && ram >= 8)) return 1400; // Máy mạnh: fade dài, mượt nhất
  if (cores <= 2 || (ram && ram <= 2)) return 500;  // Máy yếu: fade nhanh, ít tải
  return 900;                                         // Tầm trung
}

const COMPS = [
  (key) => <ShaderBackground key={key} />,
  (key) => <NeuralNoise key={key} color={[0.4, 0.1, 0.88]} speed={0.001} />,
  (key) => <AnimatedShaderBG key={key} />,
];

export default function ScrollBgManager() {
  // layers = [{uid, bgIndex, opacity}]
  // Luôn chỉ có 1 layer (idle) hoặc 2 layer (đang crossfade)
  const [layers,  setLayers]  = useState([{ uid: 0, bgIndex: 0, opacity: 1 }]);
  const activeRef  = useRef(0);
  const uidRef     = useRef(1);
  const timerRef   = useRef(null);
  const transMsRef = useRef(900);

  useEffect(() => { transMsRef.current = getTransMs(); }, []);

  const crossfadeTo = (next) => {
    if (next === activeRef.current) return;
    activeRef.current = next;

    const ms  = transMsRef.current;
    const uid = uidRef.current++;

    // 1. Thêm layer mới ở opacity 0 (chưa thấy)
    setLayers(prev => [...prev, { uid, bgIndex: next, opacity: 0 }]);

    // 2. Sau 2 frame: bắt đầu crossfade
    //    → layer cũ: 1 → 0  |  layer mới: 0 → 1  (đồng thời)
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setLayers(prev => prev.map(l => ({
        ...l,
        opacity: l.uid === uid ? 1 : 0,
      })));
    }));

    // 3. Sau khi fade xong: giữ lại đúng 1 layer (dọn sạch)
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setLayers([{ uid, bgIndex: next, opacity: 1 }]);
    }, ms + 150);
  };

  useEffect(() => {
    const vis = { features: false, process: false, pricing: false };

    const decide = () => {
      const next = vis.pricing ? 2
        : (vis.features || vis.process) ? 1
        : 0;
      crossfadeTo(next);
    };

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { vis[e.target.id] = e.isIntersecting; });
        decide();
      },
      { threshold: 0.15 }
    );

    ["features", "process", "pricing"].forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    return () => { obs.disconnect(); clearTimeout(timerRef.current); };
  }, []);

  const ms = transMsRef.current;

  return (
    <>
      {layers.map(({ uid, bgIndex, opacity }) => (
        <div
          key={uid}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            opacity,
            transition: `opacity ${ms}ms cubic-bezier(0.45, 0, 0.55, 1)`,
            willChange: "opacity",
          }}
        >
          {COMPS[bgIndex](uid)}
        </div>
      ))}
    </>
  );
}
