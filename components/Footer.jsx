"use client";
import { useState } from "react";
import { Send, Phone, User, MessageSquare } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
    const [form, setForm]           = useState({ name: "", phone: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(false);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSubmitted(true);
                setForm({ name: "", phone: "", message: "" });
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                setError(true);
                setTimeout(() => setError(false), 4000);
            }
        } catch {
            setError(true);
            setTimeout(() => setError(false), 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer id="contact" className={styles.footer}>
            <div className={styles.glowTop} />
            <div className="container">
                <div className={styles.grid}>
                    <div className={styles.info}>
                        <h2 className={styles.ctaTitle}>
                            {"Bat dau ky nguyen"}
                            <br />
                            <span className={styles.gradient}>{"but pha doanh so"}</span> {"moi"}
                        </h2>
                        <p className={styles.ctaDesc}>
                            {"Lien he ngay de duoc tu van chien luoc Performance Marketing phu hop voi du an BDS cua ban. Mien phi 100%."}
                        </p>
                        <div className={styles.contactItems}>
                            <a href="tel:0943510685" className={styles.contactItem}>
                                <Phone size={18} />
                                <span>0943 510 685</span>
                            </a>
                            <a href="https://zalo.me/0943510685" className={styles.contactItem} target="_blank" rel="noopener noreferrer">
                                <MessageSquare size={18} />
                                <span>Chat Zalo</span>
                            </a>
                        </div>
                    </div>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <User size={18} className={styles.inputIcon} />
                            <input
                                type="text"
                                placeholder="Ho ten"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <Phone size={18} className={styles.inputIcon} />
                            <input
                                type="tel"
                                placeholder="So dien thoai"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                required
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <MessageSquare size={18} className={styles.inputIcon} />
                            <textarea
                                placeholder="Mo ta du an..."
                                rows={3}
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                className={`${styles.input} ${styles.textarea}`}
                            />
                        </div>
                        <button
                            type="submit"
                            className={`btn btn-primary ${styles.submitBtn}`}
                            disabled={loading || submitted}
                        >
                            {submitted ? "Da gui thanh cong! ✓" :
                             error     ? "Loi, thu lai!" :
                             loading   ? "Dang gui..." :
                             <><Send size={16} /> Gui thong tin</>}
                        </button>
                    </form>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © 2026 PerformanceAds. All rights reserved.
                    </p>
                    <div className={styles.bottomLinks}>
                        <a href="#hero">Trang chu</a>
                        <a href="#features">Dich vu</a>
                        <a href="#pricing">Bang gia</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
