import { Check, Star } from "lucide-react";
import styles from "./Pricing.module.css";

const plans = [
    {
        name: "Goi Khoi Tao",
        price: "20",
        unit: "trieu/thang",
        desc: "Danh cho CDT hoac Sales ca nhan moi bat dau xay dung kenh quang cao online.",
        popular: false,
        features: [
            "Setup 1 kenh quang cao (Facebook hoac Google)",
            "Toi uu pheu co ban",
            "Bao cao hang tuan",
            "Tu van chien luoc co ban",
            "Ho tro qua Zalo/Chat",
        ],
    },
    {
        name: "Goi Thuc Chien",
        price: "30 - 100",
        unit: "trieu/thang",
        desc: "Goi pho bien nhat - phu hop cac du an muon scale nhanh va toi uu chuyen doi.",
        popular: true,
        features: [
            "Tat ca goi Khoi Tao",
            "Da kenh: Facebook + Google + Zalo",
            "Landing page chuyen dung",
            "A/B Testing lien tuc",
            "Toi uu CPL & ROAS real-time",
            "Bao cao hang ngay",
            "Remarketing chuyen sau",
        ],
    },
    {
        name: "Goi Toan Dien",
        price: "Tren 100",
        unit: "trieu/thang",
        desc: "Danh cho CDT lon muon phu song toan dien va but pha doanh so.",
        popular: false,
        features: [
            "Tat ca goi Thuc Chien",
            "Phu them TikTok Ads, Coc Coc",
            "San xuat Content & Video Ads",
            "Doi ngu chuyen trach rieng",
            "Tu van chien luoc 1-1",
            "Dashboard real-time 24/7",
            "Cam ket KPI cung",
        ],
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="section">
            <div className="container">
                <h2 className="section-title">
                    Bang gia <span>Dich vu</span>
                </h2>
                <p className="section-subtitle">
                    Chon goi dich vu phu hop voi quy mo du an va muc tieu kinh doanh cua ban.
                </p>
                <div className={styles.grid}>
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            className={`${styles.card} ${plan.popular ? styles.popular : ""}`}
                        >
                            {plan.popular && (
                                <div className={styles.badge}>
                                    <Star size={14} /> Pho bien nhat
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
                            <a
                                href="#contact"
                                className={`btn ${plan.popular ? "btn-primary" : "btn-outline"} ${styles.planBtn}`}
                            >
                                Bat dau ngay
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
