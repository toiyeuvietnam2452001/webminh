import { Check, Star } from "lucide-react";
import styles from "./Pricing.module.css";

const plans = [
    {
        name: "Gói Khởi Tạo",
        price: "20",
        unit: "triệu/tháng",
        desc: "Dành cho CĐT hoặc Sales cá nhân mới bắt đầu xây dựng kênh quảng cáo online.",
        popular: false,
        features: [
            "Setup 1 kênh quảng cáo (Facebook hoặc Google)",
            "Tối ưu phễu cơ bản",
            "Báo cáo hàng tuần",
            "Tư vấn chiến lược cơ bản",
            "Hỗ trợ qua Zalo/Chat",
        ],
    },
    {
        name: "Gói Thực Chiến",
        price: "30 - 100",
        unit: "triệu/tháng",
        desc: "Gói phổ biến nhất – phù hợp các dự án muốn scale nhanh và tối ưu chuyển đổi.",
        popular: true,
        features: [
            "Tất cả gói Khởi Tạo",
            "Đa kênh: Facebook + Google + Zalo",
            "Landing page chuyên dụng",
            "A/B Testing liên tục",
            "Tối ưu CPL & ROAS real-time",
            "Báo cáo hàng ngày",
            "Remarketing chuyên sâu",
        ],
    },
    {
        name: "Gói Toàn Diện",
        price: "Trên 100",
        unit: "triệu/tháng",
        desc: "Dành cho CĐT lớn muốn phủ sóng toàn diện và bứt phá doanh số.",
        popular: false,
        features: [
            "Tất cả gói Thực Chiến",
            "Phủ thêm TikTok Ads, Cốc Cốc",
            "Sản xuất Content & Video Ads",
            "Đội ngũ chuyên trách riêng",
            "Tư vấn chiến lược 1-1",
            "Dashboard real-time 24/7",
            "Cam kết KPI cứng",
        ],
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="section">
            <div className="container">
                <h2 className="section-title">
                    Bảng giá <span>Dịch vụ</span>
                </h2>
                <p className="section-subtitle">
                    Chọn gói dịch vụ phù hợp với quy mô dự án và mục tiêu kinh doanh của bạn.
                </p>

                <div className={styles.grid}>
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`${styles.card} ${plan.popular ? styles.popular : ""}`}
                        >
                            {plan.popular && (
                                <div className={styles.badge}>
                                    <Star size={14} /> Phổ biến nhất
                                </div>
                            )}
                            <h3 className={styles.planName}>{plan.name}</h3>
                            <div className={styles.priceRow}>
                                <span className={styles.price}>{plan.price}</span>
                                <span className={styles.unit}>{plan.unit}</span>
                            </div>
                            <p className={styles.planDesc}>{plan.desc}</p>
                            <ul className={styles.features}>
                                {plan.features.map((f, j) => (
                                    <li key={j} className={styles.feature}>
                                        <Check size={16} className={styles.checkIcon} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            
                                href="#contact"
                                className={`btn ${plan.popular ? "btn-primary" : "btn-outline"} ${styles.planBtn}`}
                            >
                                Bắt đầu ngay
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
