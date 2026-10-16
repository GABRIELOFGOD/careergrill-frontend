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
    <dl className="mb-5 grid grid-cols-2 border-y border-brand-line py-3 md:grid-cols-4">
      {facts.map(([label, value]) => (
        <div className="grid min-w-0 gap-1 border-r border-brand-line px-2.5 first:pl-0 last:border-0 odd:max-md:border-r max-md:mb-3 max-md:last:mb-0" key={label}>
          <dt className="text-xs uppercase text-brand-muted">{label}</dt>
          <dd className="m-0 break-words text-sm font-bold leading-snug">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
