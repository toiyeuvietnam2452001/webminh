import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Clients from "@/components/Clients";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import ShaderBackground from "@/components/ShaderBackground";

export default function Home() {
    return (
        <>
            <ShaderBackground />
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
