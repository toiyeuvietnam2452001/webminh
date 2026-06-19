import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdaptiveMediaBG from "@/components/AdaptiveMediaBG";
import MediaServices from "@/components/MediaServices";
import MediaEquipment from "@/components/MediaEquipment";
import MediaPricing from "@/components/MediaPricing";
import MediaContact from "@/components/MediaContact";
import { RevealText } from "@/components/RevealText";

export const metadata = {
  title: "Dịch Vụ Quay Dựng Media BĐS | Hình Ảnh Chuyên Nghiệp",
  description: "Giải pháp hình ảnh toàn diện cho Bất động sản. Từ TVC, Flycam Dự án đến Tiktok Reels Xây kênh và Profile Chuyên gia.",
};

export default function MediaPage() {
  return (
    <>
      <AdaptiveMediaBG />
      <Navbar />
      <main style={{ paddingTop: "80px", position: "relative", zIndex: 10 }}>

        {/* Hero */}
        <section style={{ textAlign: "center", padding: "6rem 1.5rem 4rem" }}>
          <div style={{
            display: "inline-block",
            background: "var(--accent-cyan-dim)",
            color: "var(--accent-cyan)",
            padding: "0.5rem 1rem",
            borderRadius: "50px",
            fontSize: "0.9rem",
            fontWeight: 700,
            marginBottom: "2rem",
            border: "1px solid var(--border-glow)",
          }}>
            DỊCH VỤ PREMIUM
          </div>

          <div style={{ marginBottom: "0.3rem" }}>
            <RevealText
              text="GIẢI PHÁP HÌNH ẢNH"
              letterDelay={0.05}
              overlayDelay={0.04}
              wordColors={["white", "cyan", "white", "cyan"]}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <RevealText
              text="BẤT ĐỘNG SẢN ĐIỆN ẢNH"
              letterDelay={0.05}
              overlayDelay={0.04}
              wordColors={["white", "cyan", "white", "cyan", "white"]}
            />
          </div>

          <p style={{
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "1.15rem",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}>
            Hơn cả một thước phim, chúng tôi kiến tạo "Vũ khí Sale" truyền tải trọn vẹn quy mô dự án, thúc đẩy cảm xúc và chốt Deal bùng nổ.
          </p>
        </section>

        <MediaServices />
        <MediaEquipment />
        <MediaPricing />
        <MediaContact />

      </main>
      <Footer />
    </>
  );
}
