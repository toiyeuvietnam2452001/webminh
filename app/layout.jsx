import "./globals.css";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://minhnguyenmkt.website"),
  title: "Performance Marketing BĐS | Chuyên gia Tối ưu Chuyển đổi",
  description:
    "Giải pháp Performance Marketing toàn diện cho Bất động sản – Từ chiến lược phân phối quảng cáo, tối ưu phễu chuyển đổi đến chốt sales thực chiến.",
  keywords: [
    "performance marketing",
    "bất động sản",
    "quảng cáo BĐS",
    "lead generation",
    "digital marketing",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Google Analytics GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GNG3KPK3QH"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GNG3KPK3QH');
          `}
        </Script>

        <div className="bg-grid" />
        <div className="bg-radial-top" />
        {children}
      </body>
    </html>
  );
}
