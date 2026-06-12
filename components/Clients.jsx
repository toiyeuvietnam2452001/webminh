"use client";
import { useEffect, useRef } from "react";
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

/* ── RAF Marquee — không dùng CSS animation, tránh iOS Safari bug ── */
function Marquee({ logos, reverse = false }) {
  const trackRef = useRef(null);
  const posRef   = useRef(reverse ? -50 : 0);
  const rafRef   = useRef(null);
  const tsRef    = useRef(null);
  const paused   = useRef(false);
  const SPEED    = 0.0016; /* % per ms — tương đương animation 32s */

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const tick = (now) => {
      if (tsRef.current !== null && !paused.current) {
        const dt = now - tsRef.current;
        if (reverse) {
          posRef.current += SPEED * dt;
          if (posRef.current >= 0) posRef.current = -50;
        } else {
          posRef.current -= SPEED * dt;
          if (posRef.current <= -50) posRef.current = 0;
        }
        track.style.transform = `translate3d(${posRef.current}%,0,0)`;
      }
      tsRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    /* Pause on hover */
    const wrap = track.parentElement;
    const onEnter = () => { paused.current = true; };
    const onLeave = () => { paused.current = false; tsRef.current = null; };
    wrap?.addEventListener("mouseenter", onEnter);
    wrap?.addEventListener("mouseleave", onLeave);

    /* iOS Safari: reset timestamp khi quay lại tab / BFCache */
    const onVis  = () => { if (document.visibilityState === "visible") tsRef.current = null; };
    const onShow = (e) => { if (e.persisted) tsRef.current = null; };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pageshow", onShow);

    return () => {
      cancelAnimationFrame(rafRef.current);
      wrap?.removeEventListener("mouseenter", onEnter);
      wrap?.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pageshow", onShow);
    };
  }, [reverse]);

  return (
    <div className={styles.track}>
      <div
        ref={trackRef}
        className={styles.inner}
        style={{ transform: `translate3d(${reverse ? -50 : 0}%,0,0)` }}
      >
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
  );
}

export default function Clients() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.label}>Các Đối Tác Sàn Bất Động Sản</p>
        <Marquee logos={sanLogos} reverse={false} />

        <div className={styles.divider} />

        <p className={styles.label}>Đồng Hành Cùng Các Chủ Đầu Tư</p>
        <Marquee logos={cdtLogos} reverse={true} />
      </div>
    </section>
  );
}
