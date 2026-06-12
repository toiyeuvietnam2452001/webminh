import styles from './MediaPricing.module.css';
import { Sparkles, Video, Flame, Star } from 'lucide-react';

const tiers = [
    {
        name: 'Edit Dựng Clip',
        subtitle: 'Dựng clip từ source khách có sẵn',
        price: 'Từ 500K',
        icon: <Video className={styles.icon} />,
        features: [
            'Cắt ghép, tối ưu nhịp độ',
            'Chỉnh màu (Color grading) cơ bản',
            'Thêm phụ đề (Subtitle) Text',
            'Chèn nhạc background bản quyền'
        ],
        button: 'Chọn gói này',
        highlight: false
    },
    {
        name: 'Quay Dựng Theo Buổi',
        subtitle: 'Sale review / Chụp VP / Dự án lẻ',
        price: 'Từ 3Tr',
        icon: <Sparkles className={styles.icon} />,
        features: [
            'Thiết bị quay 4K chất lượng cao',
            'Setup ánh sáng & Âm thanh thu âm',
            'Hướng dẫn biểu cảm ống kính',
            'Dựng clip hoàn thiện chuẩn Trend'
        ],
        button: 'Booking Lẻ',
        highlight: false
    },
    {
        name: 'Gói 10 Video',
        badge: 'CHIẾN DỊCH NGẮN',
        subtitle: 'Tối ưu chi phí chạy chiến dịch',
        price: '20Tr / Gói',
        icon: <Star className={styles.iconHighlight} />,
        features: [
            'Lên ý tưởng 10 Kịch bản độc quyền',
            '1-2 Buổi quay tập trung tại Sàn',
            'Dựng form Tiktok/Reels hút view',
            'Thiết kế Cover/Thumbnail dính mắt'
        ],
        button: 'Tư vấn Gói 10',
        highlight: true,
        bgVariant: 'red'
    },
    {
        name: 'Cày Phễu 30 Video',
        badge: 'BEST SELLER',
        subtitle: 'Xây Kênh Trọn Gói / Phủ Sóng Mạng XH',
        price: '45Tr / Tháng',
        icon: <Flame className={styles.iconHighlight} />,
        features: [
            '30 Kịch bản Viral đu Trend BĐS',
            'Quay 3-4 buổi / Đổi bối cảnh liên tục',
            'Edit hiệu ứng mạnh, giật cap, caption tự động',
            'Cam kết KPI & Hỗ trợ chiến lược định hướng kênh'
        ],
        button: 'Booking Trọn Gói',
        highlight: true,
        bgVariant: 'darkred'
    }
];

export default function MediaPricing() {
    return (
        <section className={styles.section} id="media-pricing">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Bảng Báo Giá <span className={styles.highlight}>Tham Khảo</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Chi phí tối ưu - Cam kết chất lượng cao nhất cho từng khuôn hình Bất Động Sản.
                    </p>
                </div>

                <div className={styles.grid}>
                    {tiers.map((tier, idx) => (
                        <div
                            key={idx}
                            className={`${styles.card} ${tier.highlight ? styles.highlightCard : ''} ${tier.bgVariant === 'darkred' ? styles.darkRedCard : ''}`}
                        >
                            {tier.badge && <div className={styles.badge}>{tier.badge}</div>}

                            <div className={styles.cardHeader}>
                                {tier.icon}
                                <h3 className={styles.tierName}>{tier.name}</h3>
                                <p className={styles.tierSubtitle}>{tier.subtitle}</p>
                            </div>

                            <div className={styles.priceContainer}>
                                <span className={styles.price}>{tier.price}</span>
                            </div>

                            <ul className={styles.featureList}>
                                {tier.features.map((feature, i) => (
                                    <li key={i} className={styles.featureItem}>
                                        <div className={styles.check}>✓</div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`${styles.ctaButton} ${tier.highlight ? styles.btnHighlight : ''}`}>
                                {tier.button}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
