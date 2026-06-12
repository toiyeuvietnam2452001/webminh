import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShaderBackground from "@/components/ShaderBackground";
import MediaServices from "@/components/MediaServices";
import MediaEquipment from "@/components/MediaEquipment";
import MediaPricing from "@/components/MediaPricing";

export const metadata = {
    title: "Dịch Vụ Quay Dựng Media BĐS | Hình Ảnh Chuyên Nghiệp",
    description: "Giải pháp hình ảnh toàn diện cho Bất động sản. Từ TVC, Flycam Dự án đến Tiktok Reels Xây kênh và Profile Chuyên gia.",
};

export default function MediaPage() {
    return (
        <>
            <ShaderBackground />
            <Navbar />
            <main style={{ paddingTop: '80px', position: 'relative', zIndex: 10 }}>
                {/* Media Hero Section */}
                <section style={{ textAlign: 'center', padding: '6rem 1.5rem 4rem' }}>
                    <div style={{ display: 'inline-block', background: 'var(--accent-cyan-dim)', color: 'var(--accent-cyan)', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '2rem', border: '1px solid var(--border-glow)' }}>
                        DỊCH VỤ PREMIUM
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: 1.2 }}>
                        Giải Pháp Hình Ảnh <br />
                        <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Bất Động Sản Điện Ảnh
                        </span>
                    </h1>
                    <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        Hơn cả một thước phim, chúng tôi kiến tạo "Vũ khí Sale" truyền tải trọn vẹn quy mô dự án, thúc đẩy cảm xúc và chốt Deal bùng nổ.
                    </p>
                </section>

                <MediaServices />
                <MediaEquipment />
                <MediaPricing />

                {/* Form Báo Giá Đơn Giản */}
                <section style={{ padding: '6rem 1.5rem', textAlign: 'center', background: 'var(--bg-primary)' }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', backdropFilter: 'blur(20px)', padding: '3rem', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)', fontWeight: 800, marginBottom: '2rem' }}>Nhận Bảng Báo Giá Media</h2>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <input type="text" placeholder="Họ và tên / Sàn BĐS" style={{ padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', outline: 'none' }} />
                            <input type="tel" placeholder="Số điện thoại" style={{ padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', outline: 'none' }} />
                            <input type="text" placeholder="Dự án cần Quay / Chụp (Ví dụ: Vinhomes...)" style={{ padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', outline: 'none' }} />
                            <textarea placeholder="Gói Media quan tâm (TVC, Flycam, Tiktok...)" rows="3" style={{ padding: '1.2rem', borderRadius: '12px', border: '1px solid var(--border-glass)', background: 'rgba(0,0,0,0.5)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}></textarea>
                            <button type="button" style={{ padding: '1.2rem', borderRadius: '12px', background: 'var(--accent-gradient)', color: 'white', fontWeight: 800, fontSize: '1.1rem', border: 'none', cursor: 'pointer', marginTop: '1rem', boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)' }}>
                                ĐĂNG KÝ NHẬN BÁO GIÁ
                            </button>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
