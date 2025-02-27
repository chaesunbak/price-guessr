import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "시장에가면 | 전국민 물가 체감 프로젝트",
  description: "물건 가격 맞추기 게임",
  keywords: ["물가", "게임", "가격", "퀴즈", "웹게임"],
  authors: [{ name: "Chaesunbak" }],
  openGraph: {
    title: "시장에 가면 | 전국민 물가 체감 프로젝트",
    description: "물건 가격 맞추기 게임",
    type: "website",
    locale: "ko_KR",
    url: "https://price-guessr.vercel.app",
  },
  twitter: {
    title: "시장에 가면 | 전국민 물가 체감 프로젝트",
    description: "물건 가격 맞추기 게임",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
