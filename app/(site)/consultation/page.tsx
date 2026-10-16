import { Suspense } from "react";
import { ConsultationPage } from "@/components/public-site";

export default function Consultation() {
  return <Suspense fallback={<section className="consultation-page content-wrap"><p role="status">Loading consultation options…</p></section>}>
    <ConsultationPage />
  </Suspense>;
}
