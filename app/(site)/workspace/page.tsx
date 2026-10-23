import type { Metadata } from "next";
import { WorkspacePage } from "@/components/public-site";

export const metadata: Metadata = {
  title: "Your workspace",
  robots: { index: false, follow: false },
};

export default function Workspace() {
  return <WorkspacePage />;
}
