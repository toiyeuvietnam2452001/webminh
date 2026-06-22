"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import AuroraShaderBG from "./AuroraShaderBG";

/* ─── Projects ─── */
const projects = [
  { name: "Vinhomes Green Paradise\nVinhomes Cần Giờ",   image: "/projects/vinhomes-can-gio.jpg" },
  { name: "Ecopark Hưng Yên",                             image: "/projects/ecopark-hung-yen.jpg" },
  { name: "Empire City",                                   image: "/projects/empire-city.jpg" },
  { name: "Vinhomes Global Gate\nVinhomes Hạ Long Xanh", image: "/projects/vinhomes-ha-long.jpg" },
  { name: "The Metropole Thủ Thiêm",                      image: "/projects/metropole-thu-thiem.jpg" },
  { name: "Masteri Cao Xà Lá",                            image: "/projects/masteri-cao-xa-la.jpg" },
  { name: "Blanca City",                                   image: "/projects/blanca-city.jpg" },
  { name: "The Global City",                               image: "/projects/the-global-city.jpg" },
  { name: "Charmora City",                                 image: "/projects/charmora-city.jpg" },
  { name: "Vinhomes Hải Vân Bay",                         image: "/projects/vinhomes-hai-van-bay.jpg" },
  { name: "Capital Square",                                image: "/projects/capital-square.jpg" },
  { name: "Eco Retreat",                                   image: "/projects/eco-retreat.jpg" },
];

function ProjectCard({ name, image }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div style={{
      borderRadius: "16px", overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.03)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,212,255,0.12)";
        e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ position: "relative", width: "100%", paddingTop: "62%", background: "rgba(255,255,255,0.05)" }}>
        {!imgError ? (
          <Image src={image} alt={name.replace("\n", " ")} fill style={{ objectFit: "cover" }} onError={() => setImgError(true)} />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(124,92,252,0.08) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "2rem", opacity: 0.3 }}>🏙️</span>
          </div>
        )}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "50%",
          background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
        }} />
      </div>
      <div style={{ padding: "16px 18px" }}>
        <p style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem", lineHeight: 1.5, margin: 0, whiteSpace: "pre-line" }}>{name}</p>
      </div>
    </div>
  );
}


/* ── Meta Partner GradientCard ── */
function MetaPartnerCard() {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotation({ x: -(y / rect.height) * 5, y: (x / rect.width) * 5 });
  };

  const glowShadow = isHovered
    ? "0 0 20px 4px rgba(172,92,255,0.9), 0 0 30px 6px rgba(138,58,185,0.7), 0 0 40px 8px rgba(56,189,248,0.5)"
    : "0 0 15px 3px rgba(172,92,255,0.8), 0 0 25px 5px rgba(138,58,185,0.6), 0 0 35px 7px rgba(56,189,248,0.4)";

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <motion.div
        ref={cardRef}
        style={{
          position: "relative", borderRadius: "32px", overflow: "hidden",
          width: "360px",
          transformStyle: "preserve-3d",
          backgroundColor: "#0e131f",
          boxShadow: "0 -10px 100px 10px rgba(78,99,255,0.25), 0 0 10px rgba(0,0,0,0.5)",
        }}
        animate={{ y: isHovered ? -5 : 0, rotateX: rotation.x, rotateY: rotation.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setRotation({ x: 0, y: 0 }); }}
        onMouseMove={handleMouseMove}
      >
        {/* Glass reflection */}
        <motion.div style={{
          position: "absolute", inset: 0, zIndex: 35, pointerEvents: "none",
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 80%, rgba(255,255,255,0.05) 100%)",
        }} animate={{ opacity: isHovered ? 0.7 : 0.5 }} transition={{ duration: 0.4 }} />

        {/* Dark bg */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(180deg, #0e131f 0%, #070a12 100%)" }} />

        {/* Noise texture */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 10, opacity: 0.3, mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Purple/blue glow */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "66%", zIndex: 20,
          background: "radial-gradient(ellipse at bottom right, rgba(172,92,255,0.7) -10%, rgba(79,70,229,0) 70%), radial-gradient(ellipse at bottom left, rgba(56,189,248,0.7) -10%, rgba(79,70,229,0) 70%)",
          filter: "blur(40px)",
        }} animate={{ opacity: isHovered ? 0.9 : 0.8 }} transition={{ duration: 0.4 }} />

        {/* Central purple glow */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "66%", zIndex: 21,
          background: "radial-gradient(circle at bottom center, rgba(161,58,229,0.7) -20%, rgba(79,70,229,0) 60%)",
          filter: "blur(45px)",
        }} animate={{ opacity: isHovered ? 0.85 : 0.75 }} transition={{ duration: 0.4 }} />

        {/* Bottom border glow */}
        <motion.div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", zIndex: 25,
          background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.05) 100%)",
        }} animate={{ boxShadow: glowShadow, opacity: isHovered ? 1 : 0.9 }} transition={{ duration: 0.4 }} />
        {/* Corner glows */}
        {["left", "right"].map(side => (
          <motion.div key={side} style={{
            position: "absolute", bottom: 0, [side]: 0, height: "25%", width: "1px", zIndex: 25, borderRadius: "999px",
            background: "linear-gradient(to top, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 100%)",
          }} animate={{ boxShadow: glowShadow }} transition={{ duration: 0.4 }} />
        ))}

        {/* Card content */}
        <motion.div style={{
          position: "relative", zIndex: 40,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "32px 32px 36px",
          gap: "20px",
        }} animate={{ z: 2 }}>

          {/* Meta BP Image */}
          <motion.div style={{
            borderRadius: "16px", overflow: "hidden", width: "100%",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
            initial={{ filter: "blur(3px)", opacity: 0.7 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <Image
              src="/meta-business-partner.png"
              alt="Meta Business Partner"
              width={296}
              height={167}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </motion.div>

          {/* Title */}
          <motion.div style={{ textAlign: "center" }}
            initial={{ filter: "blur(3px)", opacity: 0.7 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>
              Meta Business Partner
            </div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", lineHeight: 1.6 }}>
              Đối tác chính thức được Meta công nhận<br />trong lĩnh vực quảng cáo Bất động sản
            </div>
          </motion.div>

          {/* Checkmarks */}
          <motion.div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", textAlign: "left" }}
            initial={{ filter: "blur(3px)", opacity: 0.7 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            {["Được đào tạo trực tiếp từ Meta", "Hỗ trợ kỹ thuật ưu tiên từ Meta", "Cập nhật sản phẩm & chính sách sớm nhất"].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.6)", fontSize: "0.87rem" }}>
                <CheckCircle size={15} style={{ color: "#4da6ff", flexShrink: 0 }} />{t}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AboutSection() {
  return (
    <main style={{ minHeight: "100vh", paddingTop: "80px", color: "#fff", position: "relative" }}>

      {/* ── Aurora phủ toàn trang ── */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <AuroraShaderBG />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.62)" }} />
      </div>

      {/* ── HERO + Aurora Background ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "100px 0 80px" }}>



        {/* Nội dung */}
        <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "820px" }}>

          {/* Meta badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(0,130,251,0.15)", border: "1px solid rgba(0,130,251,0.4)",
            borderRadius: "999px", padding: "6px 18px",
            marginBottom: "28px", fontSize: "13px", color: "#4da6ff", fontWeight: 500,
          }}>
            <svg width="15" height="15" viewBox="0 0 32 32" fill="none">
              <path d="M5 16C5 10.5 9 6 14 6C17.5 6 20 8.5 22.5 12L16 16L22.5 20C20 23.5 17.5 26 14 26C9 26 5 21.5 5 16Z" fill="#4da6ff"/>
              <path d="M27 16C27 21.5 23 26 18 26C14.5 26 12 23.5 9.5 20L16 16L9.5 12C12 8.5 14.5 6 18 6C23 6 27 10.5 27 16Z" fill="#4da6ff"/>
            </svg>
            Meta Business Partner
          </div>

          <h1 style={{
            fontSize: "clamp(2.4rem, 5.5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.15,
            background: "linear-gradient(135deg, #ffffff 0%, #00d4ff 55%, #7c5cfc 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text", marginBottom: "12px",
          }}>
            Nguyễn Công Minh
          </h1>

          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", marginBottom: "40px" }}>
            Performance Marketing Expert · 7 năm kinh nghiệm · TP.Hồ Chí Minh
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {[
              "Tôi bước vào ngành marketing khi quảng cáo số còn là khái niệm mới mẻ với hầu hết các chủ đầu tư BĐS. Thay vì chạy theo xu hướng, tôi chọn đi sâu vào một thứ duy nhất: hiệu suất có thể đo lường được.",
              "Bất động sản là ngành đòi hỏi khắt khe nhất — ticket cao, chu kỳ mua dài, khách hàng kỹ tính. Chính sự khó đó khiến tôi chọn nó. Tôi xây hệ thống phễu từ đầu: từ cách phân phối quảng cáo đúng tệp, đến cách nuôi dưỡng lead cho đến khi chốt sales.",
              "Hơn 500 chiến dịch đã được triển khai — trải dài từ các dự án tại Hà Nội, Đà Nẵng đến TP.HCM và các tỉnh vệ tinh. Mỗi thị trường có đặc thù riêng về hành vi khách hàng, và tôi hiểu điều đó hơn ai hết.",
              "Là Meta Business Partner chính thức, tôi tiếp cận mỗi dự án bằng tư duy đo lường thực tế: không chạy theo số lượt xem hay lượt click, mà tập trung vào Lead chất lượng — và giao dịch thực sự khép lại.",
            ].map((para, i) => (
              <p key={i} style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.85, fontSize: "0.97rem", margin: 0 }}>{para}</p>
            ))}
          </div>

          <div style={{ marginTop: "40px" }}>
            <a href="/#contact" className="btn btn-primary" style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
              Liên hệ hợp tác <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ── DỰ ÁN TIÊU BIỂU ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 0", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="container">
          <p style={{ color: "#00d4ff", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: "12px", fontWeight: 600 }}>Portfolio</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 700, marginBottom: "8px" }}>Dự án tiêu biểu</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "48px", fontSize: "0.95rem" }}>Những chiến dịch Performance Marketing đã triển khai thực chiến</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {projects.map((p, i) => <ProjectCard key={i} name={p.name} image={p.image} />)}
          </div>
        </div>
      </section>

      {/* ── META BUSINESS PARTNER ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "72px 0", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "2.5px", marginBottom: "36px", fontWeight: 600 }}>Chứng nhận chính thức</p>
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "24px",
            background: "linear-gradient(135deg, rgba(0,130,251,0.08) 0%, rgba(124,92,252,0.08) 100%)",
            border: "1px solid rgba(0,130,251,0.2)", borderRadius: "24px",
            padding: "40px 48px", maxWidth: "460px", width: "100%",
          }}>
            {/* Ảnh thật Meta Business Partner */}
            <div style={{
              borderRadius: "16px", overflow: "hidden",
              width: "100%", maxWidth: "320px",
              boxShadow: "0 8px 32px rgba(0,130,251,0.2)",
            }}>
              <Image
                src="/meta-business-partner.png"
                alt="Meta Business Partner"
                width={320}
                height={180}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>Meta Business Partner</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                Đối tác chính thức được Meta công nhận<br/>trong lĩnh vực quảng cáo Bất động sản
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", textAlign: "left" }}>
              {["Được đào tạo trực tiếp từ Meta", "Hỗ trợ kỹ thuật ưu tiên từ Meta", "Cập nhật sản phẩm & chính sách sớm nhất"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.55)", fontSize: "0.88rem" }}>
                  <CheckCircle size={15} style={{ color: "#4da6ff", flexShrink: 0 }} />{t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ position: "relative", zIndex: 1, padding: "80px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.2rem)", fontWeight: 700, marginBottom: "16px" }}>Sẵn sàng hợp tác?</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "36px", fontSize: "0.95rem" }}>Cùng xây dựng chiến lược Performance Marketing cho dự án BĐS của anh/chị</p>
          <a href="/#contact" className="btn btn-primary" style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
            Liên hệ ngay <ArrowRight size={18} />
          </a>
        </div>
      </section>

    </main>
  );
}
