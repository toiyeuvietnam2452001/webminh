"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const BDS_IMAGES = [
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582407947304-fd86f28f1977?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?auto=format&fit=crop&w=800&q=80",
];

const CYAN_GRADIENT = "linear-gradient(135deg, #00d4ff 0%, #0077b6 100%)";

export function RevealText({
  text = "STUNNING",
  fontSize = "clamp(2.2rem, 5.5vw, 4rem)",
  letterDelay = 0.06,
  overlayDelay = 0.04,
  overlayDuration = 0.4,
  springDuration = 600,
  images = BDS_IMAGES,
  // wordColors: array theo thứ tự từng từ, "white" hoặc "cyan"
  // VD: ["white", "cyan", "white", "cyan"]
  wordColors = [],
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Map mỗi char → word index
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
        const imgUrl = images[lIdx % images.length];

        const baseStyle = isWhite
          ? { color: "#ffffff", WebkitTextFillColor: "#ffffff" }
          : {
              background: CYAN_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            };

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
              overflow: "hidden",
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
            {/* Base layer — absolute */}
            <motion.span
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                ...baseStyle,
              }}
              animate={{ opacity: hoveredIndex === lIdx ? 0 : 1 }}
              transition={{ duration: 0.1 }}
            >
              {char}
            </motion.span>

            {/* Image layer on hover — natural flow */}
            <motion.span
              style={{
                display: "block",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundImage: `url('${imgUrl}')`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
              animate={{
                opacity: hoveredIndex === lIdx ? 1 : 0,
                backgroundPosition: hoveredIndex === lIdx ? "20% center" : "0% center",
              }}
              transition={{
                opacity: { duration: 0.15 },
                backgroundPosition: { duration: 3, ease: "easeInOut" },
              }}
            >
              {char}
            </motion.span>

            {/* Overlay sweep */}
            {showOverlay && (
              <motion.span
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: CYAN_GRADIENT,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
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
