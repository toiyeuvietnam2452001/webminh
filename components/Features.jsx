"use client";
import { useEffect, useRef } from "react";
import { Target, BarChart3, Zap, Shield } from "lucide-react";
import { GlowCard } from "./GlowCard";
import styles from "./Features.module.css";

const features = [
  {
    icon: Target,
    title: "Tối ưu Chuyển đổi",
    desc: "Toàn bộ chiến dịch được thiết kế với 1 mục tiêu duy nhất: Chuyển đổi. Từ quảng cáo đến landing page, mọi pixel đều phải làm việc.",
  },
  {
    icon: BarChart3,
    title: "Data-Driven",
    desc: "Quyết định dựa trên số liệu thực: CPL, CPA, ROAS. Minh bạch 100% ngân sách và hiệu quả – không đoán mò.",
  },
  {
    icon: Zap,
    title: "Triển khai Thần tốc",
    desc: "Setup chiến dịch trong 24h. Hệ thống phễu quảng cáo đa kênh Facebook, Google, Zalo được kích hoạt tức thì.",
  },
  {
    icon: Shield,
    title: "Cam kết Hiệu quả",
    desc: "Hiệu quả đo bằng Lead chất lượng và Doanh số thực của dự án. Không cam kết suông – cam kết bằng KPI rõ ràng.",
  },
];

export default function Features() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, i * 120);
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section id="features" className="section">
      <div className="container">
        <h2 className="section-title">
          Tại sao chọn <span>Performance Marketing?</span>
        </h2>
        <p className="section-subtitle">
          Trong thị trường BĐS cạnh tranh khốc liệt, bạn cần một hệ thống quảng cáo
          đo lường được từng đồng – và chuyển đổi chúng thành doanh số.
        </p>

        <div className={styles.grid}>
          {features.map((f, i) => (
            <GlowCard
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className={styles.card}
              glowColor="cyan"
              style={{
                opacity: 0,
                transform: "translateY(40px)",
                transition: "opacity 0.65s ease, transform 0.65s ease",
              }}
            >
              <div className={styles.iconWrap}>
                <f.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </GlowCard>
          ))}
        </div>
      </div>
    </section>
  );
}
