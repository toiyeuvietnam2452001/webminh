import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import AdaptiveBackground from "@/components/AdaptiveBackground";

export default function Home() {
  return (
    <>
      {/* Background layers — z-index 0, luôn sau content */}
      <AdaptiveBackground />

      {/* Content wrapper — z-index 1, luôn TRƯỚC background */}
      {/* Đảm bảo KHÔNG BAO GIỜ bị che bởi background dù đang transition */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <main>
          <Hero />
          <Clients />
          <Features />
          <HowItWorks />
          <Pricing />
        </main>
        <Footer />
      </div>
    </>
  );
}
