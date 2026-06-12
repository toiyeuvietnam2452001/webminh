"use client";
import styles from "./MediaPricing.module.css";
import { Check } from "lucide-react";

const scrollToContact = () => {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
};

const PLANS = [
  {
    name: "Edit Dựng Clip",
    sub: "Dựng clip từ source khách có sẵn",
    price: "Từ 500K",
    highlight: false,
    badge: null,
    features: [
      "Cắt ghép, tối ưu nhịp độ",
      "Chỉnh màu (Color grading) cơ bản",
      "Thêm phụ đề (Subtitle) Text",
      "Chèn nhạc background bản quyền",
    ],
    cta: "Chọn gói này",
    ctaStyle: "outline",
  },
  {
    name: "Quay Dựng Theo Buổi",
    sub: "Sale review / Chụp VP / Dự án lẻ",
    price: "Từ 3Tr",
    highlight: false,
    badge: null,
    features: [
      "Thiết bị quay 4K chất lượng cao",
      "Setup ánh sáng & Âm thanh thu âm",
      "Hướng dẫn biểu cảm ống kính",
      "Dựng clip hoàn thiện chuẩn Trend",
    ],
    cta: "Booking Lẻ",
    ctaStyle: "outline",
  },
  {
    name: "Gói 10 Video",
    sub: "Tối ưu chi phí chạy chiến dịch",
    price: "20Tr",
    unit: "/ Gói",
    highlight: true,
    badge: "Chiến Dịch Ngắn",
    features: [
      "Lên ý tưởng 10 Kịch bản độc quyền",
      "1–2 Buổi quay tập trung tại Sàn",
      "Dựng form Tiktok/Reels hút view",
      "Thiết kế Cover/Thumbnail dính mắt",
    ],
    cta: "Tư vấn Gói 10",
    ctaStyle: "primary",
  },
  {
    name: "Cày Phẫu 30 Video",
    sub: "Xây Kênh Trọn Gói / Phủ Sóng Mạng XH",
    price: "45Tr",
    unit: "/ Tháng",
    highlight: true,
    badge: "Best Seller",
    features: [
      "30 Kịch bản Viral đu Trend BĐS",
      "Quay 3–4 buổi / Đổi bối cảnh liên tục",
      "Edit hiệu ứng mạnh, giật cáp, caption tự động",
      "Cam kết KPI & Hỗ trợ chiến lược định hướng kênh",
    ],
    cta: "Booking Trọn Gói",
    ctaStyle: "primary",
  },
];

export default function MediaPricing() {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">
          Bảng Báo Giá <span>Tham Khảo</span>
        </h2>
        <p className="section-subtitle">
          Chi phí tối ưu – Cam kết chất lượng cao nhất cho từng khuôn hình
          Bất Động Sản.
        </p>

        <div className={styles.grid}>
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className={`glass-card ${styles.card} ${plan.highlight ? styles.highlighted : ""}`}
            >
              {plan.badge && (
                <span className={styles.badge}>{plan.badge}</span>
              )}
              <p className={styles.planName}>{plan.name}</p>
              <p className={styles.planSub}>{plan.sub}</p>
              <div className={styles.price}>
                {plan.price}
                {plan.unit && <span className={styles.unit}>{plan.unit}</span>}
              </div>
              <ul className={styles.features}>
                {plan.features.map((f, j) => (
                  <li key={j}>
                    <Check size={15} className={styles.checkIcon} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={scrollToContact}
                className={`${styles.cta} ${plan.ctaStyle === "primary" ? styles.ctaPrimary : styles.ctaOutline}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
