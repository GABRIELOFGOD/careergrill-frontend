interface AdminContentField {
  key: string;
  label: string;
}

interface AdminContentFieldsProps {
  fields: AdminContentField[];
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const booleanFields = new Set(["featured", "application_page_available"]);
const multilineFields = new Set([
  "eligibility",
  "application_instructions",
  "coverage_primary_text",
  "coverage_secondary_text",
  "nationality_residence",
  "eligibility_points",
  "eligibility_note",
  "provider_record",
  "cover_lines",
]);

export default function AdminContentFields({ fields, data, onChange }: AdminContentFieldsProps) {
  return (
    <div className="grid gap-4">
      <span className="text-sm font-bold uppercase tracking-widest text-brand-muted">Details shown on the website</span>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, label }) => (
          <label
            key={key}
            className={booleanFields.has(key) ? "flex items-center justify-between gap-3 text-sm font-semibold text-brand-ink [&_input]:size-5 [&_input]:accent-brand-purple" : "grid gap-2 text-sm font-semibold text-brand-ink"}
          >
            {label}
            {booleanFields.has(key) ? (
              <input
                type="checkbox"
                checked={data[key] === "true"}
                onChange={(event) => onChange(key, String(event.target.checked))}
              />
            ) : multilineFields.has(key) ? (
              <textarea
                value={data[key] ?? ""}
                onChange={(event) => onChange(key, event.target.value)}
                rows={3}
                className="min-h-24 w-full rounded border border-brand-line bg-white p-3 text-sm font-normal"
                placeholder={key === "eligibility_points"
                  ? "Enter one eligibility check per line."
                  : key === "eligibility"
                    ? "For example: National contract with field responsibilities. Confirm local employment eligibility."
                    : "Add relevant details."}
              />
            ) : (
              <input
                value={data[key] ?? ""}
                onChange={(event) => onChange(key, event.target.value)}
                className="min-h-10 w-full rounded border border-brand-line bg-white px-3 py-2 text-sm font-normal"
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
