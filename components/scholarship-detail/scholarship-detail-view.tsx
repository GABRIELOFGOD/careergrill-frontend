import Link from "next/link";
import type { SiteContent } from "@/lib/site-data";
import { Eyebrow } from "@/components/site-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import RichContent from "@/components/rich-content";
import { summarizeCountrySelection } from "@/lib/countries";

function field(item: SiteContent, key: string): string {
  const value = item.data[key];
  if (Array.isArray(value) && value.every((entry): entry is string => typeof entry === "string")) {
    return key === "destination" || key === "eligible_countries"
      ? summarizeCountrySelection(value)
      : value.join(", ");
  }
  if (typeof value !== "string") return "";
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((entry): entry is string => typeof entry === "string")) {
      return key === "destination" || key === "eligible_countries"
        ? summarizeCountrySelection(parsed)
        : parsed.join(", ");
    }
  } catch {
    return key === "destination" || key === "eligible_countries"
      ? summarizeCountrySelection(value.trim())
      : value.trim();
  }
  return key === "destination" || key === "eligible_countries"
    ? summarizeCountrySelection(value.trim())
    : value.trim();
}

function list(value: string): string[] {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

function display(value: string, fallback = "Not stated"): string {
  return value || fallback;
}

export default function ScholarshipDetailView({
  item,
  onSave,
  preview = false,
}: {
  item: SiteContent;
  onSave?: () => void;
  preview?: boolean;
}) {
  const coverage = [
    { title: field(item, "coverage_primary_title") || "Funding and fees", text: field(item, "coverage_primary_text") },
    { title: field(item, "coverage_secondary_title") || "Additional funding", text: field(item, "coverage_secondary_text") },
  ].filter((card) => card.text);
  const eligibilityPoints = list(field(item, "eligibility_points"));
  const studyLevel = field(item, "study_level");
  const destination = field(item, "destination");
  const cycle = field(item, "cycle_label") || field(item, "application_status");
  const deadline = field(item, "deadline");
  const awardBadge = field(item, "application_status") || field(item, "award_badge");

  return (
    <article className={cn("mx-auto w-full max-w-7xl px-4 sm:px-8 py-8 pb-16", preview && "max-w-full")}>
      {!preview && <Link className="mb-5 inline-block text-sm text-brand-muted underline underline-offset-4" href="/scholarships">Back to results</Link>}
      <header className="mb-5 flex items-start justify-between gap-6 border-b border-brand-line pb-5 max-md:flex-col">
        <div>
          <Eyebrow>{field(item, "provider") || item.category || "Scholarship provider"}</Eyebrow>
          <h1 className="scholarship-detail-title mb-3 tracking-tight">{item.title}</h1>
          <p className="mb-2 text-base text-brand-muted">{item.excerpt}</p>
          {awardBadge && <span className="inline-flex rounded-full bg-brand-blue px-2.5 py-1 text-xs font-semibold text-brand-purple">{awardBadge}</span>}
        </div>
        <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={onSave} disabled={!onSave}>
          {preview ? "Save opportunity" : "Save opportunity"}
        </button>
      </header>

      <dl className="mb-5 grid grid-cols-2 border-y border-brand-line py-3 md:grid-cols-4">
        {[
          ["Study level / route", studyLevel],
          ["Destination", destination],
          ["Application cycle", cycle],
          ["Deadline", deadline],
        ].map(([label, value]) => (
          <div className="grid gap-1 border-r border-brand-line px-2.5 first:pl-0 last:border-0 max-md:mb-3" key={label}><dt className="text-xs uppercase text-brand-muted">{label}</dt><dd className="m-0 text-sm font-bold">{display(value)}</dd></div>
        ))}
      </dl>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(15rem,1fr)]">
        <div className="grid gap-4">
          <section className="rounded border border-brand-line bg-white p-5">
            <h2 className="mb-3 text-xl font-bold">What does the funding cover?</h2>
            {coverage.length ? (
              <div className="grid gap-3 md:grid-cols-2">
                {coverage.map((card) => <article className="rounded bg-brand-cream p-4" key={card.title}><h3 className="mb-2 text-base font-bold">{card.title}</h3><p className="mb-0 text-sm text-brand-muted">{card.text}</p></article>)}
              </div>
            ) : field(item, "award_coverage") || field(item, "funding_type") ? (
              <div className="grid gap-3">
                <article className="rounded bg-brand-cream p-4">
                  <h3 className="mb-2 text-base font-bold">{field(item, "funding_type") || "Award coverage"}</h3>
                  <p className="mb-0 text-sm text-brand-muted">{field(item, "award_coverage") || "Confirm exact benefits and conditions with the provider."}</p>
                </article>
              </div>
            ) : <p className="mb-0 text-sm text-brand-muted">Check the provider’s current funding details.</p>}
          </section>

          {item.body.trim() && <RichContent value={item.body} className="prose max-w-none text-base leading-relaxed [&_h2]:mt-7 [&_h2]:font-display [&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_li]:mb-1 [&_p]:mb-4" />}

          <section className="rounded border-l-4 border-brand-orange bg-brand-blue p-5">
            <h2 className="mb-3 text-xl font-bold">What needs checking?</h2>
            <span className="mb-3 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-brand-purple">{field(item, "eligibility_status") || "Individual eligibility not assessed"}</span>
            {field(item, "subject_areas") && <p className="text-sm"><strong>Subject areas:</strong> {field(item, "subject_areas")}</p>}
            {field(item, "eligible_countries") && <p className="text-sm"><strong>Eligible applicant countries:</strong> {field(item, "eligible_countries")}</p>}
            {field(item, "nationality_residence") && <p className="text-sm"><strong>Nationality and residence:</strong> {field(item, "nationality_residence")}</p>}
            {eligibilityPoints.length > 0 && <ul className="list-disc pl-5 text-sm [&>li+li]:mt-1">{eligibilityPoints.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ul>}
            {field(item, "eligibility_note") && <p className="mb-0 text-sm text-brand-muted">{field(item, "eligibility_note")}</p>}
          </section>

          <section className="grid gap-2 rounded border border-brand-line p-4">
            <h2 className="mb-0 text-lg font-bold">Provider record</h2>
            <p className="mb-0 text-sm leading-relaxed text-brand-muted">{field(item, "provider_record") || "Check the provider’s current information for confirmed funding, eligibility and application details."}</p>
            {item.source_url && <a className="text-sm font-semibold text-brand-purple hover:underline" href={item.source_url} target="_blank" rel="noreferrer">Read the provider’s page</a>}
            <small className="text-xs leading-relaxed text-brand-muted">
              {field(item, "source_checked_at")
                ? `Official source checked ${field(item, "source_checked_at")}. Status and deadlines can change; check the provider before applying.`
                : "Status and deadlines can change; check the provider before applying."}
            </small>
          </section>
        </div>

        <aside className="sticky top-6 grid gap-3 rounded-md bg-brand-ink p-5 text-white">
          <Eyebrow className="mb-0 text-brand-footer-hover">From discovery to preparation</Eyebrow>
          <h2 className="mb-0 text-2xl text-white">What do you need to work on next?</h2>
          <p className="mb-0 text-sm leading-relaxed text-brand-footer-muted">Use the Career Audit to examine your experience, preparation gaps and next steps for this opportunity.</p>
          <Link className={buttonVariants({ variant: "brand", size: "sm" })} href="/career-audit?goal=scholarship">Check my preparation</Link>
          <Link className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/50 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10" href="/workspace">Open my application workspace</Link>
          {item.source_url
            ? <a className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/50 px-4 py-2 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10" href={item.source_url} target="_blank" rel="noreferrer">View provider guidance</a>
            : <span className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/50 px-4 py-2 text-center text-sm font-semibold text-white">Provider guidance not provided</span>}
          <small className="text-xs leading-relaxed text-brand-footer-muted">Applications and award decisions are handled by the provider. Careergrill support is optional and cannot guarantee an award.</small>
        </aside>
      </div>
    </article>
  );
}
