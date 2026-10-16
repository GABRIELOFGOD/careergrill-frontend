import { Eyebrow } from "@/components/site-shell";
import type { SiteContent } from "@/lib/site-data";
import { jobField } from "./job-detail-utils";

export default function JobDetailHeader({
  item,
  onSave,
}: {
  item: SiteContent;
  onSave: () => void;
}) {
  return (
    <header className="job-detail-header">
      <div>
        <Eyebrow>{jobField(item, "employer", "Employer")}</Eyebrow>
        <h1>{item.title}</h1>
        <p className="job-detail-location">{jobField(item, "location", "Location not stated")}</p>
        {item.data.application_page_available === true && (
          <span className="job-application-status">Application page available</span>
        )}
      </div>
      <button className="button button-outline job-detail-save" type="button" onClick={onSave}>
        Save job
      </button>
    </header>
  );
}
