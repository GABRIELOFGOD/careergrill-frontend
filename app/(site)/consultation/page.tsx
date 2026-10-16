import { ConsultationPage } from "@/components/public-site";

export default async function Consultation({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  return <ConsultationPage mode={mode === "call" ? "call" : "enquiry"} />;
}
