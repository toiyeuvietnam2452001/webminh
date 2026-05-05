import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import styles from "./Hero.module.css";

export default function Hero() {
    return (
        <section id="hero" className={styles.hero}>
            {/* Floating orbs */}
            <div className={styles.orbCyan} />
            <div className={styles.orbBlue} />
            <div className={styles.orbPurple} />

            <div className={`container ${styles.content}`}>
                <div className={styles.grid}>
                    {/* Left: Text */}
                    <div className={styles.textSide}>
                        <div className={styles.badge}>
                            <span className={styles.badgeDot} />
                            Performance Marketing Specialist
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
                                Bắt đầu ngay
                                <ArrowRight size={18} />
                            </a>
                            <a href="#process" className="btn btn-outline">
                                <Play size={16} />
                                Khám phá quy trình
                            </a>
                        </div>
                    </div>

                    {/* Right: Portrait & Ads Elements */}
                    <div className={styles.imageSide}>
                        <div className={styles.imageGlow} />
                        <div className={styles.techCircle} />

                        <div className={styles.floatingBadgeCPA}>
                            <div className={styles.badgeIcon}>🎯</div>
                            <div>
                                <div className={styles.badgeLabel}>CPA (Lead Mua Bán)</div>
                                <div className={styles.badgeValue}>45,000đ <span className={styles.trendUp}>↓ 20%</span></div>
                            </div>
                        </div>

                        <div className={styles.imageWrapper}>
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
                                <div className={styles.badgeValue}>8.5% <span className={styles.trendUp}>↑ +2.1%</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats bar */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>500+</span>
                        <span className={styles.statLabel}>Chiến dịch triển khai</span>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>50K+</span>
                        <span className={styles.statLabel}>Lead chất lượng</span>
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>98%</span>
                        <span className={styles.statLabel}>Khách hàng hài lòng</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
