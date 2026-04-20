import type { Metadata, Viewport } from "next";
import { Noto_Serif_Thai } from "next/font/google";
import "./globals.css";

const notoSerifThai = Noto_Serif_Thai({
  variable: "--font-noto-serif-thai",
  subsets: ["thai"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BEYONDE Health Longevity Checkup",
  description: "ประเมินสุขภาพและอายุยืนของคุณผ่านแบบทดสอบ 8 ด้าน พร้อมรับ Longevity Score และคำแนะนำเพื่อสุขภาพที่ดีขึ้น",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${notoSerifThai.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
