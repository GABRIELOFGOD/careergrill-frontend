import type { Metadata } from "next";
import { WorkspacePage } from "@/components/public-site";

export const metadata: Metadata = {
  title: "Saved jobs",
  robots: { index: false, follow: false },
};

export default function SavedJobsPage() {
  return <WorkspacePage view="jobs" />;
}
