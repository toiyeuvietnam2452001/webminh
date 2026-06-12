import styles from "./MediaHero.module.css";
import { ChevronDown } from "lucide-react";

export default function MediaHero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          Quay Dựng Điện Ảnh Bất Động Sản
        </div>

        <h1 className={styles.title}>
          Khai Phóng Đẳng Cấp
          <br />
          <span className={styles.gradient}>Dự Án Bất Động Sản</span>
        </h1>

        <p className={styles.subtitle}>
          Không chỉ là Quay Dựng Video thông thường. Chúng tôi mang đến cỗ máy{" "}
          <strong>"Thôi miên thị giác"</strong> bằng ngôn ngữ điện ảnh chuyên
          nghiệp, tối ưu hóa kịch bản đa nền tảng để Chủ Đầu Tư, Đại Lý và
          Sales BĐS chốt sale mạnh mẽ ngay từ điểm chạm đầu tiên.
        </p>

        <a href="#services" className={styles.cta}>
          Khám phá Dịch vụ <ChevronDown size={18} />
        </a>
      </div>
    </section>
  );
}
