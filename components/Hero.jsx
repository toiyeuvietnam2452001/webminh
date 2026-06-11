"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import styles from "./Hero.module.css";

/* ─── Counter đếm số từ 0 lên khi scroll đến ─── */
function CountUp({ target, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          const step = target / (duration / 16);
          let cur = 0;
          const timer = setInterval(() => {
            cur += step;
            if (cur >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(cur));
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref} className={styles.statNumber}>{count}{suffix}</span>;
}

/* ─── Hero Section ─── */
export default function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.orbCyan} />
      <div className={styles.orbBlue} />
      <div className={styles.orbPurple} />

      <div className={`container ${styles.content}`}>
        <div className={styles.grid}>

          {/* Left — slide từ trái vào */}
          <div
            className={styles.textSide}
            style={{ animation: "heroFadeLeft 0.9s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Performance Marketing Expert
            </div>
            <h1 className={styles.title}>
              Tối ưu hoá sức mạnh
              <br />
              <span className={styles.gradient}>Performance Marketing</span>
              <br />
              Bất động sản
            </h1>
            <p className={styles.subtitle}>
              Chiến lược quảng cáo đa kênh, tối ưu phễu chuyển đổi từ Click → Lead → Chốt Sales.
              Đo lường bằng doanh số thực – không phải vanity metrics.
            </p>
            <div className={styles.actions}>
              <a href="#contact" className="btn btn-primary">
                Bắt đầu ngay <ArrowRight size={18} />
              </a>
              <a href="#process" className="btn btn-outline">
                <Play size={16} /> Khám phá quy trình
              </a>
            </div>
          </div>

          {/* Right — slide từ phải vào, delay nhẹ */}
          <div
            className={styles.imageSide}
            style={{ animation: "heroFadeRight 0.9s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}
          >
            <div className={styles.imageGlow} />
            <div className={styles.techCircle} />

            <div className={styles.floatingBadgeCPA}>
              <div className={styles.badgeIcon}>🎯</div>
              <div>
                <div className={styles.badgeLabel}>CPA (Lead Mua Bán)</div>
                <div className={styles.badgeValue}>
                  45,000đ <span className={styles.trendUp}>↓ 20%</span>
                </div>
              </div>
            </div>

            <div className={styles.imageWrapper}>
              <div className={`${styles.platformLogo} ${styles.logoFB}`}>
                <Image src="https://img.icons8.com/color/48/facebook-new.png" width={32} height={32} alt="Facebook Ads" />
              </div>
              <div className={`${styles.platformLogo} ${styles.logoGoogle}`}>
                <Image src="https://img.icons8.com/color/48/google-logo.png" width={32} height={32} alt="Google Ads" />
              </div>
              <div className={`${styles.platformLogo} ${styles.logoTikTok}`}>
                <Image src="https://img.icons8.com/color/48/tiktok.png" width={32} height={32} alt="TikTok Ads" />
              </div>
              <div className={`${styles.platformLogo} ${styles.logoZalo}`}>
                <Image src="https://img.icons8.com/color/48/zalo.png" width={32} height={32} alt="Zalo" />
              </div>
              <Image
                src="/hero-portrait.png"
                alt="Performance Marketing Specialist"
                width={480}
                height={580}
                priority
                className={styles.portrait}
              />
            </div>

            <div className={styles.floatingBadgeROAS}>
              <div className={styles.badgeIcon}>📈</div>
              <div>
                <div className={styles.badgeLabel}>Tỉ lệ chuyển đổi (CVR)</div>
                <div className={styles.badgeValue}>
                  8.5% <span className={styles.trendUp}>↑ +2.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats — fade từ dưới lên, delay sau cùng */}
        <div
          className={styles.stats}
          style={{ animation: "heroFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.4s both" }}
        >
          <div className={styles.stat}>
            <CountUp target={500} suffix="+" />
            <span className={styles.statLabel}>Chiến dịch triển khai</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <CountUp target={50} suffix="K+" />
            <span className={styles.statLabel}>Lead chất lượng</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <CountUp target={98} suffix="%" />
            <span className={styles.statLabel}>Khách hàng hài lòng</span>
          </div>
        </div>
      </div>
    </section>
  );
}
