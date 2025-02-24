import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xpang에 가면 | 전국민 물가 체감 프로젝트",
  description: "상품의 가격을 맞추면서 물가를 체감해보세요.",
  keywords: ["물가", "게임", "가격", "퀴즈", "웹게임"],
  authors: [{ name: "Chaesunbak" }],
  openGraph: {
    title: "Xpang에 가면 | 전국민 물가 체감 프로젝트",
    description: "쿠팡 상품의 가격을 맞추면서 물가를 체감해보세요",
    type: "website",
    locale: "ko_KR",
    url: "https://xpang.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Xpang에 가면 | 전국민 물가 체감 프로젝트",
    description: "쿠팡 상품의 가격을 맞추면서 물가를 체감해보세요",
  },
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
