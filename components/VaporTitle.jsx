"use client";

/* Dùng global class "vapor-word" định nghĩa trong globals.css
   → tránh vấn đề CSS module không được apply */

const LINES = [
  { words: ["Tối", "ưu", "hoá", "sức", "mạnh"], gradient: false },
  { words: ["Performance", "Marketing"],          gradient: true  },
  { words: ["Bất", "động", "sản"],               gradient: false },
];

const GRAD = {
  background: "linear-gradient(135deg, #00d4ff, #0066ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

export default function VaporTitle() {
  let idx = 0;
  return (
    <h1 style={{
      fontSize: "3.2rem",
      fontWeight: 800,
      lineHeight: 1.15,
      letterSpacing: "-0.03em",
      marginBottom: "24px",
    }}>
      {LINES.map((line, li) => (
        <span key={li}>
          {li > 0 && <br />}
          {line.words.map((word, wi) => (
            <span
              key={wi}
              className="vapor-word"
              style={{
                animationDelay: `${idx++ * 0.1}s`,
                ...(line.gradient ? GRAD : {}),
              }}
            >
              {word}{wi < line.words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
