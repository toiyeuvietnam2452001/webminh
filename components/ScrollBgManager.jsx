"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const ShaderBackground = dynamic(() => import("./ShaderBackground"), { ssr: false });
const NeuralNoise      = dynamic(() => import("./NeuralNoise"),      { ssr: false });
const AnimatedShaderBG = dynamic(() => import("./AnimatedShaderBG"), { ssr: false });

const COMPONENTS = {
  0: () => <ShaderBackground />,
  1: () => <NeuralNoise color={[0.4, 0.1, 0.88]} speed={0.001} />,
  2: () => <AnimatedShaderBG />,
};

export default function ScrollBgManager() {
  const [active, setActive]   = useState(0); // đang hiện
  const [prev,   setPrev]     = useState(null); // đang fade out
  const [show,   setShow]     = useState(true); // opacity active
  const activeRef = useRef(0);
  const timerRef  = useRef(null);

  const changeTo = (next) => {
    if (next === activeRef.current) return;
    const curr = activeRef.current;
    activeRef.current = next;

    // Bắt đầu fade out current
    setShow(false);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Sau khi fade out xong → mount shader mới, fade in
      setPrev(null);
      setActive(next);
      setShow(true);
    }, 500); // 500ms = thời gian fade out
  };

  useEffect(() => {
    const visible = { features: false, process: false, pricing: false };

    const decide = () => {
      const next = visible.pricing ? 2
        : (visible.features || visible.process) ? 1
        : 0;
      changeTo(next);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { visible[e.target.id] = e.isIntersecting; });
        decide();
      },
      { threshold: 0.15 }
    );

    ["features", "process", "pricing"].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => { observer.disconnect(); clearTimeout(timerRef.current); };
  }, []);

  const Comp = COMPONENTS[active];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      opacity: show ? 1 : 0,
      transition: "opacity 0.5s ease",
      willChange: "opacity",
    }}>
      <Comp />
    </div>
  );
}
