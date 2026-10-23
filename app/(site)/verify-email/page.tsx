import type { Metadata } from "next";
import { VerifyPage } from "@/components/public-site";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return <VerifyPage />;
}
