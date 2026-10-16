import Link from "next/link";
import { Eyebrow } from "@/components/site-shell";
import type { SiteContent } from "@/lib/site-data";
import { formatJobDate, jobField } from "./job-detail-utils";

export default function JobApplicationPanel({ item }: { item: SiteContent }) {
  const closingDate = formatJobDate(jobField(item, "closing_date", "Not stated by employer"));
  const instructions = jobField(
    item,
    "application_instructions",
    "Follow the employer’s application form and document instructions.",
  );
  const reportUrl = `mailto:info@careergrill.com?subject=${encodeURIComponent(`Report outdated job listing: ${item.title}`)}&body=${encodeURIComponent(`Please review this job listing: ${item.title} (${item.slug})`)}`;

  return (
    <aside className="job-application-panel">
      <Eyebrow>Application details</Eyebrow>
      <h2>Your next step</h2>
      <dl>
        <div>
          <dt>Closing date</dt>
          <dd>{closingDate}</dd>
        </div>
        <div>
          <dt>Documents / instructions</dt>
          <dd>{instructions}</dd>
        </div>
      </dl>
      <p className="job-application-timezone">
        Confirm the closing time and timezone on the employer’s page.
      </p>
      {item.source_url ? (
        <a className="button button-dark" href={item.source_url} target="_blank" rel="noreferrer">
          View application on employer site
        </a>
      ) : (
        <p className="job-application-unavailable">
          The employer’s application link has not been provided.
        </p>
      )}
      <Link className="button button-outline-light" href="/workspace/jobs">
        Open my saved jobs
      </Link>
      <p className="job-application-disclaimer">
        Careergrill does not receive this application. Applying through the directory does not
        require buying a Careergrill service.
      </p>
      <a className="job-report-link" href={reportUrl}>Report an outdated listing</a>
    </aside>
  );
}
