import type { Metadata } from "next";
import { AuthPage } from "@/components/public-site";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <AuthPage />;
}
