import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminConsole from "@/components/admin-console";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <><AdminConsole />{children}</>;
}
