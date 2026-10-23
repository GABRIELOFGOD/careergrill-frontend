import type { Metadata } from "next";
import { WorkspacePage } from "@/components/public-site";

export const metadata: Metadata = {
  title: "My career audits",
  robots: { index: false, follow: false },
};

export default function MyAuditsPage() {
  return <WorkspacePage view="audits" />;
}
