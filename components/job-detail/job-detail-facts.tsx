import type { SiteContent } from "@/lib/site-data";
import { jobField } from "./job-detail-utils";

export default function JobDetailFacts({ item }: { item: SiteContent }) {
  const facts = [
    ["Experience", jobField(item, "experience_level", "Not stated")],
    ["Work arrangement", jobField(item, "work_arrangement", "Not stated")],
    ["Employment type", jobField(item, "employment_type", "Not stated")],
    ["Advertised pay", jobField(item, "salary", "Not disclosed")],
  ];

  return (
    <dl className="job-detail-facts">
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
