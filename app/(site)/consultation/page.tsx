import { Suspense } from "react";
import { ConsultationPage } from "@/components/public-site";

export default function Consultation() {
  return <Suspense fallback={<section className="grid gap-3 py-7 mx-auto w-full max-w-7xl px-4 sm:px-8"><p role="status">Loading consultation options…</p></section>}>
    <ConsultationPage />
  </Suspense>;
}
