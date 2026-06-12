import styles from './MediaServices.module.css';
import { Camera, PlaySquare, Smartphone, UserCheck } from 'lucide-react';

const services = [
    {
        target: 'DÀNH CHO CHỦ SÀN & CĐT',
        title: 'TVC & Flycam Dự Án',
        desc: 'Khẳng định vị thế thâu tóm thị trường với những thước phim Cinematic đỉnh cao nhất. Phô diễn trọn vẹn quy mô và tiềm năng sinh lời thực sự của dự án.',
        icon: <Camera className={styles.icon} />,
        points: [
            'Sản xuất TVC tiêu chuẩn phân phối truyền hình (Broadcast 4K/8K).',
            'Quay Flycam 360 độ tiến độ hạ tầng, đường vành đai và tiện ích nội-ngoại khu.',
            'Phối cảnh "Sa bàn ảo" giới thiệu chi tiết từng phân khu và sản phẩm.',
            'Kịch bản Voice-off chuyên gia, lồng tiếng MC VTV chuyên nghiệp kịch bản độc quyền.'
        ]
    },
    {
        target: 'DÀNH CHO ĐẠI LÝ PHÂN PHỐI',
        title: 'Video Sale Kit & Kick-off',
        desc: 'Vũ khí tác chiến điện tử "bơm máu" cho hàng ngàn chiến binh Sales. Truyền tải trọn vẹn lửa dự án và giải nghĩa bộ tài liệu bán hàng sinh động qua Video.',
        icon: <PlaySquare className={styles.icon} />,
        points: [
            'Phóng sự hiện trường Lễ Ra Quân (Kick-off), Lễ Mở Bán, Site-tour dâng trào cảm xúc.',
            'Video mô phỏng "Review Nhà Mẫu" & "Phân tích sa bàn" dạng Talkshow/Podcast.',
            'Cắt dựng Highlight nóng hổi, bắt trọn khoảnh khắc chốt Deal bùng cháy ngân lượng.',
            'Bàn giao tốc độ cực nhanh trong vòng 24H để kịp nhịp bơm ngân sách chạy Ads.'
        ]
    },
    {
        target: 'DÀNH CHO NHÓM SALES / TRƯỞNG PHÒNG',
        title: 'TikTok & Reels Xây Kênh',
        desc: 'Ngừng đốt tiền Ads vô tội vạ. Sở hữu ngay "Phễu Video Viral" độc quyền giúp team Sales săn Lead thụ động 0đ tận dụng triệt để thuật toán hiển thị.',
        icon: <Smartphone className={styles.icon} />,
        points: [
            'Cung cấp ý tưởng (Concept) và Kịch bản Reels BĐS "Đu Trend" tỷ views.',
            'Setup góc quay Studio Mini Podcast thu hút ngay tại Văn phòng sàn hoặc Dự án.',
            'Dựng kỹ xảo mạnh, cắt giật nhịp sâu (Cut-cap), Subtitle pop-up hiệu ứng động.',
            'Tối ưu kích thước chuẩn khung hình 9:16 phù hợp thuật toán nền tảng Tiktok/Fb.'
        ]
    },
    {
        target: 'DÀNH CHO CÁ NHÂN SALES VIP',
        title: 'Profile Chuyên Gia Nghìn Đô',
        desc: 'Khách chọn dự án nhờ CĐT, nhưng xuống tiền tỷ do tin tưởng người Sales. Nâng tầm nhân hiệu uy tín qua lăng kính điện ảnh chuyên nghiệp.',
        icon: <UserCheck className={styles.icon} />,
        points: [
            'Video phỏng vấn (Interview) chia sẻ tầm nhìn đầu tư, kỹ năng thực chiến thị trường.',
            'Video Review dự án dạng Vlog thực tế có góc nhìn cá nhân dẫn dắt khách hàng.',
            'Trực tiếp kèm cặp kỹ năng biểu cảm, làm chủ ngôn ngữ cơ thể trước camera.',
            'Sản xuất Video Profile cá nhân chuẩn dấu ấn doanh nhân phong cách Cinematic.'
        ]
    }
];

export default function MediaServices() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Sản Xuất Hình Ảnh <span className={styles.highlight}>Chuyên Nghiệp</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Cung cấp hệ sinh thái Media toàn diện, thiết kế riêng biệt cho dòng sản phẩm Bất Động Sản từ cấp Chủ đầu tư đến người bán cá nhân.
                    </p>
                </div>
                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.targetBadge}>{service.target}</div>
                            <div className={styles.cardTop}>
                                {service.icon}
                                <h3 className={styles.cardTitle}>{service.title}</h3>
                            </div>
                            <p className={styles.cardDesc}>{service.desc}</p>
                            <ul className={styles.pointList}>
                                {service.points.map((point, i) => (
                                    <li key={i} className={styles.pointItem}>
                                        <div className={styles.check}>✓</div>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
