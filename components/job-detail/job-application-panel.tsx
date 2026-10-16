import Link from "next/link";
import { Eyebrow } from "@/components/site-shell";
import type { SiteContent } from "@/lib/site-data";
import { formatJobDate, jobField } from "./job-detail-utils";
import { buttonVariants } from "@/components/ui/button";

export default function JobApplicationPanel({ item }: { item: SiteContent }) {
  const closingDate = formatJobDate(jobField(item, "closing_date", "Not stated by employer"));
  const instructions = jobField(
    item,
    "application_instructions",
    "Follow the employer’s application form and document instructions.",
  );
  const reportUrl = `mailto:info@careergrill.com?subject=${encodeURIComponent(`Report outdated job listing: ${item.title}`)}&body=${encodeURIComponent(`Please review this job listing: ${item.title} (${item.slug})`)}`;

  return (
    <aside className="sticky top-6 grid gap-3 rounded-md bg-brand-ink p-5 text-white">
      <Eyebrow className="mb-0 text-brand-footer-hover">Application details</Eyebrow>
      <h2 className="mb-0 text-2xl text-white">Your next step</h2>
      <dl className="mb-0 grid gap-3">
        <div className="grid gap-1">
          <dt className="text-sm text-brand-footer-muted">Closing date</dt>
          <dd className="m-0 text-base font-semibold">{closingDate}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-sm text-brand-footer-muted">Documents / instructions</dt>
          <dd className="m-0 text-sm">{instructions}</dd>
        </div>
      </dl>
      <p className="mb-0 text-sm leading-relaxed text-brand-footer-muted">
        Confirm the closing time and timezone on the employer’s page.
      </p>
      {item.source_url ? (
        <a className={buttonVariants({ variant: "brand", size: "sm" })} href={item.source_url} target="_blank" rel="noreferrer">
          View application on employer site
        </a>
      ) : (
        <p className="mb-0 text-sm text-brand-footer-muted">
          The employer’s application link has not been provided.
        </p>
      )}
      <Link className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/50 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10" href="/workspace/jobs">
        Open my saved jobs
      </Link>
      <p className="mb-0 text-xs leading-relaxed text-brand-footer-muted">
        Careergrill does not receive this application. Applying through the directory does not
        require buying a Careergrill service.
      </p>
      <a className="text-sm text-brand-footer-hover underline underline-offset-4" href={reportUrl}>Report an outdated listing</a>
    </aside>
  );
}
