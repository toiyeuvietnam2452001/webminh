"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// Index 5 bị lỗi load — thay bằng ảnh khác đã verified
const BDS_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
];

export function RevealText({
  text = "STUNNING",
  fontSize = "clamp(2.2rem, 5.5vw, 4rem)",
  letterDelay = 0.06,
  overlayDelay = 0.04,
  overlayDuration = 0.4,
  springDuration = 600,
  images = BDS_IMAGES,
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
    }}>
      {chars.map(({ char, isSpace, wordIdx: wIdx, letterIdx: lIdx }, i) => {
        if (isSpace) {
          return <span key={i} style={{ display: "inline-block", width: "0.3em" }} />;
        }

        const color = wordColors[wIdx] || "cyan";
        const baseColor = color === "white" ? "#ffffff" : "#00c8e8";
        const imgUrl = images[lIdx % images.length];
        const isHovered = hoveredIndex === lIdx;

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
              lineHeight: 1.2,
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
            {/* IMAGE LAYER — opacity:1 luôn, không animate → không bao giờ mất chữ */}
            <span
              style={{
                display: "block",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundImage: `url('${imgUrl}')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: isHovered ? "10% center" : "0% center",
                transition: "background-position 3s ease-in-out",
                userSelect: "none",
              }}
            >
              {char}
            </span>

            {/* BASE LAYER — phủ lên image, fade out khi hover */}
            <motion.span
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: baseColor,
                WebkitTextFillColor: baseColor,
                pointerEvents: "none",
              }}
              animate={{ opacity: isHovered ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            >
              {char}
            </motion.span>

            {/* OVERLAY SWEEP */}
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
