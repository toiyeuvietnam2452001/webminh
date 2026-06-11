"use client";
import Image from "next/image";
import styles from "./Clients.module.css";

const sanLogos = [
  { src: "/logo-vietstarland.png",    alt: "VietStar Land" },
  { src: "/logo-newstarland.png",     alt: "NewStar Land" },
  { src: "/logo-naman.png",           alt: "Naman Realty" },
  { src: "/logo-nhakimcuong.png",     alt: "Nha Kim Cuong" },
  { src: "/logo-ticaland.png",        alt: "Tica Land" },
  { src: "/logo-mayhomes.png",        alt: "MayHomes" },
  { src: "/logo-titanluxury.png",     alt: "Titan Luxury" },
  { src: "/logo-cengroup.png",        alt: "CenGroup" },
  { src: "/logo-dsun.png",            alt: "DSUN" },
  { src: "/logo-khaihoanland.png",    alt: "Khai Hoan Land" },
  { src: "/logo-smartland.png",       alt: "Smartland" },
  { src: "/logo-salereal.png",        alt: "SaleReal" },
  { src: "/logo-dongtayproperty.png", alt: "Dong Tay Property" },
  { src: "/logo-dongtayland.png",     alt: "Dong Tay Land" },
];

const cdtLogos = [
  { src: "/logo-cdt-vinhomes.png",   alt: "Vinhomes" },
  { src: "/logo-cdt-sungroup.png",   alt: "Sun Group" },
  { src: "/logo-cdt-masterise.png",  alt: "Masterise Homes" },
  { src: "/logo-cdt-novaland.png",   alt: "Novaland" },
  { src: "/logo-cdt-sonkimland.png", alt: "Son Kim Land" },
  { src: "/logo-cdt-ecopark.png",    alt: "Ecopark" },
  { src: "/logo-cdt-bimgroup.png",   alt: "BIM Group" },
  { src: "/logo-cdt-capitaland.png", alt: "CapitaLand" },
  { src: "/logo-cdt-gamuda.png",     alt: "Gamuda" },
  { src: "/logo-cdt-mikgroup.png",   alt: "MIK Group" },
];

export default function Clients() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* DẢI 1 — Sàn đại lý, cuộn TRÁI */}
        <p className={styles.label}>Các Đối Tác Sàn Bất Động Sản</p>
        <div className={styles.track}>
          <div className={styles.inner}>
            {[...sanLogos, ...sanLogos].map((logo, i) => (
              <div key={i} className={styles.logoWrap}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={48}
                  style={{ objectFit: "contain" }}
                  className={styles.logo}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.divider} />

        {/* DẢI 2 — Chủ đầu tư, cuộn PHẢI (ngược chiều) */}
        <p className={styles.label}>Đồng Hành Cùng Các Chủ Đầu Tư</p>
        <div className={styles.track}>
          <div className={`${styles.inner} ${styles.innerReverse}`}>
            {[...cdtLogos, ...cdtLogos].map((logo, i) => (
              <div key={i} className={styles.logoWrap}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={48}
                  style={{ objectFit: "contain" }}
                  className={styles.logo}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
