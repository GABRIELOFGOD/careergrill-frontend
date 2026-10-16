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
    <div className="admin-extra-fields">
      <span className="admin-label">DETAILS SHOWN ON THE WEBSITE</span>
      <div className="admin-form-grid">
        {fields.map(({ key, label }) => (
          <label
            key={key}
            className={booleanFields.has(key) ? "admin-boolean-field" : undefined}
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
              />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
