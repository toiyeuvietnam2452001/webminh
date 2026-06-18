"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function RevealText({
  text = "STUNNING",
  fontSize = "clamp(2.2rem, 5.5vw, 4rem)",
  letterDelay = 0.06,
  overlayDelay = 0.04,
  overlayDuration = 0.4,
  springDuration = 600,
  wordColors = [],
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const chars = [];
  let wordIdx = 0;
  let letterIdx = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === " ") {
      chars.push({ char, isSpace: true, wordIdx: -1, letterIdx: -1 });
      wordIdx++;
    } else {
      chars.push({ char, isSpace: false, wordIdx, letterIdx });
      letterIdx++;
    }
  }

  const totalLetters = letterIdx;

  useEffect(() => {
    const totalDelay = ((totalLetters - 1) * letterDelay * 1000) + springDuration;
    const timer = setTimeout(() => setShowOverlay(true), totalDelay);
    return () => clearTimeout(timer);
  }, [totalLetters, letterDelay, springDuration]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      lineHeight: 1.15,
    }}>
      {chars.map(({ char, isSpace, wordIdx: wIdx, letterIdx: lIdx }, i) => {
        if (isSpace) {
          return <span key={i} style={{ display: "inline-block", width: "0.35em" }} />;
        }

        const color = wordColors[wIdx] || "cyan";
        const isWhite = color === "white";

        // Dùng solid color — tránh hoàn toàn WebkitBackgroundClip trên absolute element
        const baseColor = isWhite ? "#ffffff" : "#00c8e8";

        return (
          <motion.span
            key={i}
            onMouseEnter={() => setHoveredIndex(lIdx)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              fontSize,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              cursor: "pointer",
              position: "relative",
              display: "inline-block",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: lIdx * letterDelay,
              type: "spring",
              damping: 8,
              stiffness: 200,
              mass: 0.8,
            }}
          >
            {/* Spacer invisible giữ kích thước */}
            <span style={{ visibility: "hidden", userSelect: "none", display: "block" }}>
              {char}
            </span>

            {/* Base layer — solid color, không dùng backgroundClip */}
            <motion.span
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: baseColor,
                WebkitTextFillColor: baseColor,
              }}
              animate={{ opacity: hoveredIndex === lIdx ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            >
              {char}
            </motion.span>

            {/* Hover layer — trắng sáng + glow */}
            <motion.span
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                WebkitTextFillColor: "#ffffff",
                textShadow: "0 0 20px rgba(0, 212, 255, 0.9), 0 0 40px rgba(0, 212, 255, 0.5)",
                pointerEvents: "none",
              }}
              animate={{ opacity: hoveredIndex === lIdx ? 1 : 0 }}
              transition={{ duration: 0.15 }}
            >
              {char}
            </motion.span>

            {/* Overlay sweep */}
            {showOverlay && (
              <motion.span
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#00c8e8",
                  WebkitTextFillColor: "#00c8e8",
                  pointerEvents: "none",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  delay: lIdx * overlayDelay,
                  duration: overlayDuration,
                  times: [0, 0.1, 0.7, 1],
                  ease: "easeInOut",
                }}
              >
                {char}
              </motion.span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
}
