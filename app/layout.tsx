import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Careergrill | Jobs, scholarships and application support",
  description: "Make sense of your strengths, choose where to apply, and build applications that reflect what you can offer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="font-sans">
      <body className="min-h-screen text-base leading-relaxed antialiased">{children}</body>
    </html>
  );
}
