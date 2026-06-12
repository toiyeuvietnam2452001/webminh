import Navbar        from "@/components/Navbar";
import Footer        from "@/components/Footer";
import ShaderBackground from "@/components/ShaderBackground";
import MediaServices from "@/components/MediaServices";
import MediaEquipment from "@/components/MediaEquipment";
import MediaPricing  from "@/components/MediaPricing";
import MediaContact  from "@/components/MediaContact";

export const metadata = {
  title: "Dịch Vụ Quay Dựng Media BĐS | Hình Ảnh Chuyên Nghiệp",
  description: "Giải pháp hình ảnh toàn diện cho Bất động sản. Từ TVC, Flycam Dự án đến Tiktok Reels Xây kênh và Profile Chuyên gia.",
};

export default function MediaPage() {
  return (
    <>
      <ShaderBackground />
      <Navbar />
      <main style={{ paddingTop: "80px", position: "relative", zIndex: 10 }}>

        {/* Hero */}
        <section style={{ textAlign: "center", padding: "6rem 1.5rem 4rem" }}>
          <div style={{ display: "inline-block", background: "var(--accent-cyan-dim)", color: "var(--accent-cyan)", padding: "0.5rem 1rem", borderRadius: "50px", fontSize: "0.9rem", fontWeight: 700, marginBottom: "2rem", border: "1px solid var(--border-glow)" }}>
            DỊCH VỤ PREMIUM
          </div>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.5rem", lineHeight: 1.2 }}>
            Giải Pháp Hình Ảnh<br />
            <span style={{ background: "var(--accent-gradient)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Bất Động Sản Điện Ảnh
            </span>
          </h1>
          <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            Hơn cả một thước phim, chúng tôi kiến tạo "Vũ khí Sale" truyền tải trọn vẹn quy mô dự án, thúc đẩy cảm xúc và chốt Deal bùng nổ.
          </p>
        </section>

        <MediaServices />
        <MediaEquipment />
        <MediaPricing />

        {/* Form — dùng MediaContact có submit handler đầy đủ */}
        <MediaContact />

      </main>
      <Footer />
    </>
  );
}
