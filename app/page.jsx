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
      <AdaptiveBackground />
      <Navbar />
      <main>
        <Hero />
        <Clients />
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
