"use client";
import Image from "next/image";
import styles from "./Clients.module.css";

const logos = [
  { src: "/logos/logo-vietstarland.png",    alt: "VietStar Land" },
  { src: "/logos/logo-newstarland.png",     alt: "NewStar Land" },
  { src: "/logos/logo-naman.png",           alt: "Naman Realty" },
  { src: "/logos/logo-nhakimcuong.png",     alt: "Nha Kim Cuong" },
  { src: "/logos/logo-ticaland.png",        alt: "Tica Land" },
  { src: "/logos/logo-mayhomes.png",        alt: "MayHomes" },
  { src: "/logos/logo-titanluxury.png",     alt: "Titan Luxury" },
  { src: "/logos/logo-cengroup.png",        alt: "CenGroup" },
  { src: "/logos/logo-dsun.png",            alt: "DSUN" },
  { src: "/logos/logo-khaihoanland.png",    alt: "Khai Hoan Land" },
  { src: "/logos/logo-smartland.png",       alt: "Smartland" },
  { src: "/logos/logo-salereal.png",        alt: "SaleReal" },
  { src: "/logos/logo-dongtayproperty.png", alt: "Dong Tay Property" },
  { src: "/logos/logo-dongtayland.png",     alt: "Dong Tay Land" },
];

export default function Clients() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.label}>Các Đối Tác Sàn Bất Động Sản</p>
        <div className={styles.track}>
          <div className={styles.inner}>
            {[...logos, ...logos].map((logo, i) => (
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
