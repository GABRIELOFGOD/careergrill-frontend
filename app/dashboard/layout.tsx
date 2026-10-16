import type { ReactNode } from "react";
import AdminConsole from "@/components/admin-console";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <><AdminConsole />{children}</>;
}
