"use client";
import styles from "./VaporTitle.module.css";

/* Tiêu đề Hero: mỗi từ xuất hiện từ mờ → rõ theo thứ tự */
const LINES = [
  { words: ["Tối", "ưu", "hoá", "sức", "mạnh"], gradient: false },
  { words: ["Performance", "Marketing"],          gradient: true  },
  { words: ["Bất", "động", "sản"],               gradient: false },
];

export default function VaporTitle() {
  let globalIdx = 0; /* đếm chỉ số delay xuyên suốt toàn bộ từ */

  return (
    <h1 className={styles.title}>
      {LINES.map((line, li) => {
        const lineContent = line.words.map((word, wi) => {
          const idx = globalIdx++;
          return (
            <span
              key={wi}
              className={styles.word}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {word}
              {wi < line.words.length - 1 ? "\u00A0" : ""}
            </span>
          );
        });

        return (
          <span key={li}>
            {li > 0 && <br />}
            {line.gradient
              ? <span className={styles.gradient}>{lineContent}</span>
              : lineContent}
          </span>
        );
      })}
    </h1>
  );
}
