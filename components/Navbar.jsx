"use client";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import styles from "./Navbar.module.css";

const navLinks = [
    { label: "Trang chủ", href: "#hero" },
    { label: "Dịch vụ", href: "#features" },
    { label: "Quy trình", href: "#process" },
    { label: "Bảng giá", href: "#pricing" },
    { label: "Liên hệ", href: "#contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
            <div className={styles.inner}>
                <a href="#hero" className={styles.logo}>
                    <span className={styles.logoIcon}>◆</span>
                    PerformanceAds
                </a>

                <ul className={`${styles.links} ${menuOpen ? styles.open : ""}`}>
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className={styles.link}
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                    <li className={styles.ctaMobile}>
                        <a href="#contact" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                            Tư vấn ngay
                        </a>
                    </li>
                </ul>

                {/* SĐT cố định — ẩn trên mobile */}
                <a
                    href="tel:0943510685"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#00d4ff",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        transition: "opacity 0.2s",
                    }}
                    className={styles.phoneDesktop}
                >
                    <Phone size={15} strokeWidth={2} />
                    0943 510 685
                </a>

                <a href="#contact" className={`btn btn-primary ${styles.ctaDesktop}`}>
                    Tư vấn ngay
                </a>

                <button
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
}
