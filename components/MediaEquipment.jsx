import styles from './MediaEquipment.module.css';
import { Video, Plane, Film, Mic } from 'lucide-react';

const equipments = [
    {
        title: 'Thiết Bị Quay',
        desc: 'Sony FX3, Red Komodo chuẩn điện ảnh mang tới màu sắc siêu thực hoặc iPhone 15 Pro Max cơ động đời mới nhất.',
        icon: <Video className={styles.icon} />
    },
    {
        title: 'Drones 4K',
        desc: 'DJI Mavic 3 Cine quét Flycam toàn cảnh dự án góc siêu rộng với độ phân giải siêu cao.',
        icon: <Plane className={styles.icon} />
    },
    {
        title: 'Post-Production',
        desc: 'Dàn máy mạnh mẽ cùng Davinci Resolve, Color Grading chuẩn không gian màu rạp phim.',
        icon: <Film className={styles.icon} />
    },
    {
        title: 'Âm Thanh Studio',
        desc: 'Set thiết bị thu âm Microphone không dây đỉnh cao, loại bỏ tạp âm gió 100% tại công trường dự án.',
        icon: <Mic className={styles.icon} />
    }
];

export default function MediaEquipment() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        Cơ Sở Vật Chất & <span className={styles.highlight}>Thiết Bị Điện Ảnh</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Chúng tôi đầu tư cấu hình máy quay chuẩn TVC, đảm bảo chất lượng hình ảnh (Output) luôn rực rỡ và sắc nét tinh tế nhất, đánh trúng thị giác người xem.
                    </p>
                </div>

                <div className={styles.grid}>
                    {equipments.map((item, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                {item.icon}
                            </div>
                            <h3 className={styles.itemTitle}>{item.title}</h3>
                            <p className={styles.itemDesc}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
