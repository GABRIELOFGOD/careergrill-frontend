import type { Metadata } from "next";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Careergrill | Jobs, scholarships and application support",
  description: "Make sense of your strengths, choose where to apply, and build applications that reflect what you can offer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} ${manrope.variable} font-sans`}>
      <body className="min-h-screen text-base leading-relaxed antialiased">{children}</body>
    </html>
  );
}
