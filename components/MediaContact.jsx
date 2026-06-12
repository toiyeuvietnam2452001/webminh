"use client";
import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import styles from "./MediaContact.module.css";

export default function MediaContact() {
  const [form, setForm] = useState({
    name: "", phone: "", project: "", package: "",
  });
  const [status, setStatus] = useState("idle");

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: `[MEDIA INQUIRY]\nDự án: ${form.project || "–"}\nGói quan tâm: ${form.package || "–"}`,
        }),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <h2 className="section-title">
          Nhận <span>Báo Giá Miễn Phí</span>
        </h2>
        <p className="section-subtitle">
          Mô tả nhu cầu quay dựng — chúng tôi tư vấn gói phù hợp và gửi báo
          giá chi tiết trong 2 giờ làm việc.
        </p>

        <form onSubmit={submit} className={`glass-card ${styles.form}`}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Họ và tên / Sàn BĐS</label>
              <input
                name="name"
                value={form.name}
                onChange={handle}
                placeholder="Tên sàn hoặc Leader..."
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Số điện thoại</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handle}
                placeholder="09x xxx xxxx"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Dự án cần Quay / Chụp</label>
            <input
              name="project"
              value={form.project}
              onChange={handle}
              placeholder="Ví dụ: Vinhomes Ocean Park 2..."
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Gói Media Quan Tâm</label>
            <textarea
              name="package"
              value={form.package}
              onChange={handle}
              placeholder="Bạn cần quay TVC, bay Flycam hay làm Video Tiktok xây kênh?..."
              className={styles.textarea}
              rows={4}
            />
          </div>

          {status === "ok" ? (
            <div className={styles.success}>
              <CheckCircle size={22} strokeWidth={1.8} />
              <span>Gửi thành công — chúng tôi sẽ liên hệ trong 2 giờ làm việc.</span>
            </div>
          ) : (
            <button
              type="submit"
              className={styles.submit}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Đang gửi..." : "Nhận Bảng Báo Giá Media"}
            </button>
          )}

          {status === "error" && (
            <p className={styles.error}>Có lỗi xảy ra. Vui lòng thử lại.</p>
          )}
        </form>
      </div>
    </section>
  );
}
