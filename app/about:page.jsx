import AboutSection from "@/components/AboutSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Về Minh | Nguyễn Công Minh - Performance Marketing BĐS",
  description:
    "7 năm kinh nghiệm Performance Marketing BĐS. Meta Business Partner chính thức. Đã quản lý 60 tỷ+ ngân sách quảng cáo, 83K+ leads chất lượng.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutSection />
      <Footer />
    </>
  );
}
