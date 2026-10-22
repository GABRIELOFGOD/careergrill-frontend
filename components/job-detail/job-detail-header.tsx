import { Eyebrow } from "@/components/site-shell";
import type { SiteContent } from "@/lib/site-data";
import { jobField } from "./job-detail-utils";
import { buttonVariants } from "@/components/ui/button";

export default function JobDetailHeader({
  item,
  onSave,
}: {
  item: SiteContent;
  onSave: () => void;
}) {
  return (
    <header className="mb-5 flex items-start justify-between gap-6 border-b border-brand-line pb-5 max-sm:flex-col">
      <div className="min-w-0">
        <Eyebrow>{jobField(item, "employer", "Employer")}</Eyebrow>
        <h1 className="job-detail-title mb-3 tracking-tight">{item.title}</h1>
        <p className="mb-2 text-base text-brand-muted">{jobField(item, "location", "Location not stated")}</p>
        {item.data.application_page_available === true && (
          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-900">Application page available</span>
        )}
      </div>
      <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={onSave}>
        Save job
      </button>
    </header>
  );
}
