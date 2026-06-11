"use client";
import Image from "next/image";
import styles from "./Clients.module.css";

const logos = [
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
