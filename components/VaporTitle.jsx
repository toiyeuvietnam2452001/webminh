"use client";
import styles from "./VaporTitle.module.css";

const LINES = [
  { words: ["Tối", "ưu", "hoá", "sức", "mạnh"], gradient: false },
  { words: ["Performance", "Marketing"],          gradient: true  },
  { words: ["Bất", "động", "sản"],               gradient: false },
];

/* Inline gradient style cho từng từ — tránh bug background-clip + child span */
const GRAD_STYLE = {
  background: "linear-gradient(135deg, #00d4ff, #0066ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

export default function VaporTitle() {
  let idx = 0;

  return (
    <h1 className={styles.title}>
      {LINES.map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {line.words.map((word, wi) => {
            const delay = `${idx++ * 0.1}s`;
            return (
              <span
                key={wi}
                className={styles.word}
                style={{
                  animationDelay: delay,
                  ...(line.gradient ? GRAD_STYLE : {}),
                }}
              >
                {word}
                {wi < line.words.length - 1 ? "\u00A0" : ""}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}
