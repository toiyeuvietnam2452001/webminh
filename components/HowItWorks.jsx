"use client";
import { useEffect, useRef } from "react";
import {
  Search, Handshake, Megaphone,
  Rocket, LineChart, FileCheck,
} from "lucide-react";
import { GlowCard } from "./GlowCard";
import styles from "./HowItWorks.module.css";

const steps = [
  {
    icon: Search,
    num: "01",
    title: "Khám bệnh Dự án & Giải mã Insight",
    desc: "Phân tích chuyên sâu thị trường, đối thủ, chân dung khách mục tiêu. Xác định điểm yếu và cơ hội bứt phá.",
  },
  {
    icon: Handshake,
    num: "02",
    title: "Thống nhất KPI & Ký kết",
    desc: "Đặt KPI rõ ràng: CPL, số lượng Lead, tỷ lệ chốt. Minh bạch ngân sách, không chi phí ẩn.",
  },
  {
    icon: Megaphone,
    num: "03",
    title: "Thiết kế Funnel & Trận địa Ads",
    desc: "Xây phễu chuyển đổi đa kênh: Facebook, Google, Zalo, TikTok. Landing page tối ưu chuyển đổi.",
  },
  {
    icon: Rocket,
    num: "04",
    title: 'Triển khai "Máy bơm" Lead',
    desc: "Kích hoạt chiến dịch tốc độ cao. Scaling ngân sách thông minh, A/B testing liên tục.",
  },
  {
    icon: LineChart,
    num: "05",
    title: "Tối ưu Real-time & Ép phễu",
    desc: "Monitor 24/7, cắt chiến dịch xấu, đẩy mạnh chiến dịch tốt. Remarketing ép chốt.",
  },
  {
    icon: FileCheck,
    num: "06",
    title: "Nghiệm thu & Báo cáo",
    desc: "Báo cáo minh bạch chi tiết: chi phí, Lead, tỷ lệ chốt. Đánh giá và tư vấn giai đoạn tiếp.",
  },
];

export default function HowItWorks() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const isLeft = i % 2 === 0;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateX(0)";
            }, i * 120);
            obs.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section id="process" className="section">
      <div className="container">
        <h2 className="section-title">
          Từ chiến lược đến <span>thực thi</span>
        </h2>
        <p className="section-subtitle">
          Quy trình 6 bước thực chiến đã được kiểm chứng qua hàng trăm dự án BĐS trên toàn quốc.
        </p>

        <div className={styles.timeline}>
          {steps.map((s, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div
                key={i}
                className={`${styles.row} ${isLeft ? styles.rowLeft : styles.rowRight}`}
              >
                <GlowCard
                  ref={(el) => (cardRefs.current[i] = el)}
                  className={styles.card}
                  glowColor="cyan"
                  style={{
                    opacity: 0,
                    transform: isLeft ? "translateX(-40px)" : "translateX(40px)",
                    transition: "opacity 0.65s ease, transform 0.65s ease",
                  }}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.iconWrap}>
                      <s.icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className={styles.num}>{s.num}</span>
                  </div>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </GlowCard>

                <div className={styles.connector}>
                  <div className={styles.dot} />
                </div>

                <div className={styles.spacer} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
