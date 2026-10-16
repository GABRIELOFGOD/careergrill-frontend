import RichContent from "@/components/rich-content";
import {
  JobEligibilityCallout,
  JobEmployerSource,
  JobPreparationSection,
} from "./job-detail-sections";

interface JobDetailPreviewProps {
  title: string;
  body: string;
  data: Record<string, string>;
  sourceUrl: string;
}

export default function JobDetailPreview({
  title,
  body,
  data,
  sourceUrl,
}: JobDetailPreviewProps) {
  return (
    <div className="mx-auto w-full">
      <div className="relative pb-5">
        <span className="text-sm font-bold uppercase tracking-widest text-brand-orange">{data.employer || "Employer"}</span>
        <h2 className="my-2 max-w-2xl text-3xl">{title || "Your job title"}</h2>
        <p className="mb-2 text-sm text-brand-muted">{data.location || "Location not stated"}</p>
        {data.application_page_available === "true" && (
          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">Application page available</span>
        )}
      </div>
      <div className="mb-5 grid grid-cols-2 border-y border-brand-line py-3 md:grid-cols-4">
        {[
          ["Experience", data.experience_level],
          ["Work arrangement", data.work_arrangement],
          ["Employment type", data.employment_type],
          ["Advertised pay", data.salary],
        ].map(([label, value]) => (
          <div className="grid gap-1 border-r border-brand-line px-2.5 first:pl-0 last:border-0" key={label}>
            <small className="text-xs uppercase text-brand-muted">{label}</small>
            <strong className="text-xs leading-snug">{value || "Not stated"}</strong>
          </div>
        ))}
      </div>
      <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1.7fr)_minmax(12rem,1fr)]">
        <div className="grid gap-3">
          <RichContent
            value={body || "<h2>About the role</h2><p>Your job description will appear here.</p>"}
            className="text-sm leading-relaxed text-brand-muted [&_h2]:font-display [&_h2]:text-lg [&_h3]:font-display [&_h3]:text-base [&_img]:h-auto [&_img]:max-w-full [&_table]:w-full [&_td]:border [&_td]:border-brand-line [&_td]:p-2 [&_th]:border [&_th]:border-brand-line [&_th]:p-2"
          />
          <JobEligibilityCallout text={data.eligibility || data.qualification || ""} />
          <JobPreparationSection />
          <JobEmployerSource sourceCheckedAt={data.source_checked_at} sourceUrl={sourceUrl || null} />
        </div>
        <aside className="grid gap-2 rounded bg-brand-ink p-4 text-white">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-footer-hover">Application details</span>
          <h3 className="mb-2 text-lg font-bold text-white">Your next step</h3>
          <small className="text-xs text-brand-footer-muted">Closing date</small>
          <p className="mb-2 text-sm">{data.closing_date || "Not stated by employer"}</p>
          <small className="text-xs text-brand-footer-muted">Documents / instructions</small>
          <p className="mb-2 text-sm">{data.application_instructions || "Follow the employer’s application form and document instructions."}</p>
          <small className="text-xs leading-relaxed text-brand-footer-muted">
            Confirm the closing time and timezone on the employer’s page.
          </small>
          {sourceUrl && <span className="font-semibold text-brand-footer-hover">View application on employer site ↗</span>}
          <small className="text-xs text-brand-footer-muted">Careergrill does not receive this application.</small>
        </aside>
      </div>
    </div>
  );
}
