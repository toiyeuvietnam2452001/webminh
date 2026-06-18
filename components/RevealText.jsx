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

export function RevealText({
  text = "STUNNING",
  fontSize = "clamp(2.2rem, 5.5vw, 4rem)",
  letterDelay = 0.06,
  overlayDelay = 0.04,
  overlayDuration = 0.4,
  springDuration = 600,
  images = BDS_IMAGES,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  // Pre-compute letter metadata
  const letters = text.split("").map((char, i) => ({
    char,
    index: i,
    letterIdx: text.slice(0, i).replace(/ /g, "").length,
    isSpace: char === " ",
  }));

  useEffect(() => {
    const letterCount = text.replace(/ /g, "").length;
    const totalDelay = ((letterCount - 1) * letterDelay * 1000) + springDuration;
    const timer = setTimeout(() => setShowOverlay(true), totalDelay);
    return () => clearTimeout(timer);
  }, [text, letterDelay, springDuration]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "wrap",
      lineHeight: 1.15,
    }}>
      {letters.map(({ char, index, letterIdx, isSpace }) => {
        if (isSpace) {
          return (
            <span key={index} style={{ display: "inline-block", width: "0.35em" }} />
          );
        }

        const imgUrl = images[letterIdx % images.length];

        return (
          <motion.span
            key={index}
            onMouseEnter={() => setHoveredIndex(letterIdx)}
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
              delay: letterIdx * letterDelay,
              type: "spring",
              damping: 8,
              stiffness: 200,
              mass: 0.8,
            }}
          >
            {/* Base layer — gradient cyan, absolute */}
            <motion.span
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0, bottom: 0,
                background: "linear-gradient(135deg, #00d4ff 0%, #0077b6 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              animate={{ opacity: hoveredIndex === letterIdx ? 0 : 1 }}
              transition={{ duration: 0.1 }}
            >
              {char}
            </motion.span>

            {/* Image layer on hover — natural flow, gives parent size */}
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
                opacity: hoveredIndex === letterIdx ? 1 : 0,
                backgroundPosition: hoveredIndex === letterIdx ? "20% center" : "0% center",
              }}
              transition={{
                opacity: { duration: 0.15 },
                backgroundPosition: { duration: 3, ease: "easeInOut" },
              }}
            >
              {char}
            </motion.span>

            {/* Overlay sweep sau khi animate xong */}
            {showOverlay && (
              <motion.span
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: "linear-gradient(135deg, #00d4ff 0%, #0077b6 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  pointerEvents: "none",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 1, 0] }}
                transition={{
                  delay: letterIdx * overlayDelay,
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
