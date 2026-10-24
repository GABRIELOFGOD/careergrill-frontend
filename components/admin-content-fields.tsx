"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import { apiRequest, apiUrl } from "@/lib/api";
import { countryContinents, countryNames } from "@/lib/countries";

interface AdminContentField {
  key: string;
  label: string;
}

interface AdminContentFieldsProps {
  fields: AdminContentField[];
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
  compactScholarship?: boolean;
  articleEditor?: boolean;
  optionalContent?: ReactNode;
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

const multiSelectOptions: Record<string, string[]> = {
  study_level: [
    "Undergraduate",
    "Master's",
    "MBA",
    "PhD / Doctoral",
    "Postdoctoral",
    "Short course / Certificate",
    "Diploma",
    "Not yet confirmed",
  ],
  destination: [...countryNames, "Not yet confirmed"],
  funding_type: [
    "Fully funded",
    "Partially funded",
    "Tuition waiver",
    "Stipend / Living allowance",
    "Scholarship",
    "Fellowship",
    "Graduate assistantship (GA)",
    "Teaching assistantship (TA)",
    "Research assistantship (RA)",
    "Not yet confirmed",
  ],
  subject_areas: [
    "All subjects",
    "Business & Management",
    "Computer Science & IT",
    "Engineering",
    "Medicine & Health",
    "Social Sciences",
    "Education",
    "Natural Sciences",
    "Law",
    "Arts & Humanities",
    "Agriculture",
    "Environment & Climate",
    "Finance & Economics",
    "Media & Communication",
    "Public Policy & Development",
    "Design & Architecture",
    "Mathematics & Statistics",
    "Religion & Islamic Studies",
    "Not yet confirmed",
  ],
  eligible_countries: [...countryNames, "Not yet confirmed"],
};

const selectOptions: Record<string, string[]> = {
  deadline_type: ["fixed", "rolling", "unknown"],
  experience_level: ["Internship", "Entry-level", "Mid-level", "Senior", "Not yet confirmed"],
  work_arrangement: ["On-site", "Hybrid", "Remote", "Field-based", "Not yet confirmed"],
  employment_type: ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Graduate programme", "Not yet confirmed"],
};

function readSelectedOptions(value: string): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return parsed;
    }
  } catch {
    return [value];
  }
  return [value];
}

function MultiSelectField({
  fieldKey,
  label,
  value,
  options,
  onChange,
}: {
  fieldKey: string;
  label: string;
  value: string;
  options: string[];
  onChange: (key: string, value: string) => void;
}) {
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const selected = readSelectedOptions(value);
  const isCountryField = fieldKey === "destination" || fieldKey === "eligible_countries";
  const availableOptions = [...new Set([...options, ...selected])];
  const visibleOptions = availableOptions.filter((option) =>
    option.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) {
        if (dropdownRef.current) dropdownRef.current.open = false;
      }
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);

  function updateSelection(option: string, checked: boolean) {
    const next = checked
      ? [...selected, option]
      : selected.filter((item) => item !== option);
    onChange(fieldKey, JSON.stringify(next));
  }

  function updateCountries(countryList: string[], checked: boolean) {
    const existingCountries = selected.includes("All nationalities") ? countryNames : selectedCountries;
    const nextCountries = checked
      ? [...new Set([...existingCountries, ...countryList])]
      : existingCountries.filter((item) => !countryList.includes(item));
    const next = [
      ...selected.filter((item) => !countryNames.includes(item) && item !== "All nationalities"),
      ...nextCountries,
    ];
    onChange(fieldKey, JSON.stringify(next));
  }

  const selectedCountries = selected.filter((item) => countryNames.includes(item));
  const selectedContinentNames = Object.entries(countryContinents)
    .filter(([, continentCountries]) => continentCountries.length > 0
      && continentCountries.every((country) => selectedCountries.includes(country)))
    .map(([continent]) => continent);
  const remainingSelectedCountries = selectedCountries.filter((country) =>
    !selectedContinentNames.some((continent) => countryContinents[continent as keyof typeof countryContinents].includes(country)));
  const selectedCountryLabels = selected.includes("All nationalities") || selectedCountries.length === countryNames.length
    ? ["All countries"]
    : [...selectedContinentNames, ...remainingSelectedCountries];
  const selectionSummary = isCountryField
    ? [
      ...selectedCountryLabels.slice(0, 3),
      ...(selectedCountryLabels.length > 3 ? [`+${selectedCountryLabels.length - 3} more`] : []),
    ].join(", ")
    : `${selected.length} selected`;

  return (
    <div className="grid min-w-0 gap-2 text-sm font-semibold text-brand-ink">
      <span>{label}</span>
      <details ref={dropdownRef} className="group relative min-w-0">
        <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between gap-3 rounded border border-brand-line bg-white px-3 py-2 text-sm font-normal marker:hidden">
          <span className="truncate text-brand-muted">
            {selected.length ? selectionSummary : `Select ${label.toLocaleLowerCase()}`}
          </span>
          <span aria-hidden="true" className="text-xs text-brand-muted">⌄</span>
        </summary>
        <div className="absolute z-30 mt-1 max-h-72 w-full min-w-56 overflow-auto rounded-lg border border-brand-line bg-white p-2 shadow-xl">
          <input
            aria-label={`Search ${label.toLocaleLowerCase()}`}
            className="mb-2 min-h-9 w-full rounded border border-brand-line px-2 py-1 text-sm font-normal"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${label.toLocaleLowerCase()}`}
          />
          {isCountryField && <div className="mb-2 border-b border-brand-line pb-2">
            <button
              aria-pressed={selected.includes("All nationalities") || selectedCountries.length === countryNames.length}
              className="!flex !min-h-9 !w-full !items-center !gap-2 rounded px-2 py-1.5 text-left text-sm font-semibold text-brand-purple hover:bg-brand-blue"
              type="button"
              onClick={() => updateCountries(countryNames, selectedCountries.length !== countryNames.length)}
            >
              <input
                checked={selected.includes("All nationalities") || selectedCountries.length === countryNames.length}
                className="!m-0 !size-4 !min-h-0 !w-4 shrink-0 accent-brand-purple"
                type="checkbox"
                readOnly
                tabIndex={-1}
              />
              <span>All countries</span>
            </button>
            <p className="mb-1 px-2 pt-2 text-[11px] font-bold uppercase tracking-wide text-brand-muted">Select a continent</p>
            <div className="grid grid-cols-2 gap-1">
              {Object.entries(countryContinents).map(([continent, continentCountries]) => {
                const checked = continentCountries.every((country) => selectedCountries.includes(country));
                const partiallyChecked = !checked && continentCountries.some((country) => selectedCountries.includes(country));
                return (
                  <button
                    aria-pressed={checked}
                    className="!flex !min-h-9 !items-center !gap-2 rounded px-2 py-1.5 text-left text-xs font-medium hover:bg-brand-blue"
                    key={continent}
                    type="button"
                    onClick={() => updateCountries(continentCountries, !checked)}
                  >
                    <input
                      checked={checked}
                      className="!m-0 !size-4 !min-h-0 !w-4 shrink-0 accent-brand-purple"
                      type="checkbox"
                      readOnly
                      tabIndex={-1}
                      ref={(element) => {
                        if (element) element.indeterminate = partiallyChecked;
                      }}
                    />
                    <span>{continent}</span>
                  </button>
                );
              })}
            </div>
          </div>}
          {visibleOptions.map((option) => (
            <label className="!flex cursor-pointer !items-center !gap-2 rounded px-2 py-1.5 text-sm font-normal hover:bg-brand-blue" key={option}>
              <input
                checked={selected.includes(option)}
                className="!m-0 !size-4 !min-h-0 !w-4 shrink-0 accent-brand-purple"
                type="checkbox"
                onChange={(event) => updateSelection(option, event.target.checked)}
              />
              <span>{option}</span>
            </label>
          ))}
          {!visibleOptions.length && <p className="mb-0 px-2 py-2 text-xs text-brand-muted">No matching options.</p>}
        </div>
      </details>
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {(isCountryField
            ? [
              ...selectedCountryLabels.slice(0, 3),
              ...(selectedCountryLabels.length > 3 ? [`+${selectedCountryLabels.length - 3} more`] : []),
              ...selected.filter((item) => !countryNames.includes(item) && item !== "All nationalities"),
            ]
            : selected
          ).map((option) => (
            <span className="inline-flex max-w-full items-center gap-1 rounded border border-brand-line bg-brand-blue px-2 py-1 text-xs font-medium text-brand-purple" key={option}>
              <span className="truncate">{option}</span>
              {!option.startsWith("+") && <button
                aria-label={`Remove ${option}`}
                className="min-h-5 min-w-5 rounded text-brand-muted hover:bg-white"
                type="button"
                onClick={() => {
                  if (option === "All countries" || option === "All nationalities") {
                    updateCountries(countryNames, false);
                  } else if (option in countryContinents) {
                    updateCountries(countryContinents[option as keyof typeof countryContinents], false);
                  } else {
                    updateSelection(option, false);
                  }
                }}
              >
                ×
              </button>}
            </span>
          ))}
        </div>
      ) : <span className="text-xs font-normal text-brand-muted">Choose one or more options.</span>}
    </div>
  );
}

export default function AdminContentFields({ fields, data, onChange, compactScholarship = false, articleEditor = false, optionalContent }: AdminContentFieldsProps) {
  const imageInput = useRef<HTMLInputElement>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState("");
  const scholarshipCoreKeys = new Set(["study_level", "destination", "funding_type", "subject_areas", "eligible_countries", "deadline_type", "deadline"]);
  const coreFields = fields.filter(({ key }) => scholarshipCoreKeys.has(key));
  const optionalFields = fields.filter(({ key }) => !scholarshipCoreKeys.has(key) && key !== "featured");

  async function uploadOgImage(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    setImageBusy(true);
    setImageError("");
    try {
      const result = await apiRequest<{ item: { url: string } }>("/admin/assets/images", {
        method: "POST",
        body: formData,
      });
      onChange("seo_image", result.item.url);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "The OG image could not be uploaded.");
    } finally {
      setImageBusy(false);
      if (imageInput.current) imageInput.current.value = "";
    }
  }

  function renderFields(fieldList: AdminContentField[]) {
    return fieldList.map(({ key, label }) => {
      if (compactScholarship && key === "deadline" && ["rolling", "unknown"].includes(data.deadline_type ?? "")) {
        return null;
      }
      return multiSelectOptions[key] ? (
        <MultiSelectField
          key={key}
          fieldKey={key}
          label={label}
          value={data[key] ?? ""}
          options={multiSelectOptions[key]}
          onChange={handleFieldChange}
        />
      ) : (
        <label
          key={key}
          className={booleanFields.has(key) ? "flex items-center justify-between gap-3 text-sm font-semibold text-brand-ink [&_input]:size-5 [&_input]:accent-brand-purple" : "grid gap-2 text-sm font-semibold text-brand-ink"}
        >
          {label}
          {booleanFields.has(key) ? (
            <input
              type="checkbox"
              checked={data[key] === "true"}
              onChange={(event) => handleFieldChange(key, String(event.target.checked))}
            />
          ) : multilineFields.has(key) ? (
            <textarea
              value={data[key] ?? ""}
              onChange={(event) => handleFieldChange(key, event.target.value)}
              rows={3}
              className="min-h-24 w-full rounded border border-brand-line bg-white p-3 text-sm font-normal"
              placeholder={key === "eligibility_points"
                ? "Enter one eligibility check per line."
                : key === "eligibility"
                  ? "For example: National contract with field responsibilities. Confirm local employment eligibility."
                  : "Add relevant details."}
            />
          ) : selectOptions[key] ? (
            <select
              value={data[key] ?? (key === "deadline_type" && data.deadline && !["Rolling", "Not confirmed"].includes(data.deadline) ? "fixed" : "")}
              onChange={(event) => handleFieldChange(key, event.target.value)}
              className="min-h-10 w-full rounded border border-brand-line bg-white px-3 py-2 text-sm font-normal"
            >
              <option value="">{key === "deadline_type" ? "Choose a deadline type" : `Choose ${label.toLocaleLowerCase()}`}</option>
              {!selectOptions[key].includes(data[key] ?? "") && data[key] && <option value={data[key]}>{data[key]}</option>}
              {selectOptions[key].map((option) => <option key={option} value={option}>{key === "deadline_type" ? ({
                fixed: "Closing date",
                rolling: "Rolling",
                unknown: "Not confirmed",
              }[option] ?? option) : option}</option>)}
            </select>
          ) : (
            <input
              type={key === "deadline" && (!data[key] || /^\d{4}-\d{2}-\d{2}$/.test(data[key])) ? "date" : "text"}
              value={data[key] ?? ""}
              onChange={(event) => handleFieldChange(key, event.target.value)}
              className="min-h-10 w-full rounded border border-brand-line bg-white px-3 py-2 text-sm font-normal"
            />
          )}
        </label>
      );
    });
  }

  function handleFieldChange(key: string, value: string) {
    onChange(key, value);
    if (compactScholarship && key === "deadline_type") {
      onChange("deadline", value === "rolling" ? "Rolling" : value === "unknown" ? "Not confirmed" : "");
    }
  }

  const searchAndSharingFields = (
    <fieldset className="grid gap-3 rounded border border-brand-line p-4">
      <legend className="px-1 text-sm font-bold uppercase tracking-widest text-brand-muted">Search and social sharing</legend>
      <label className="grid gap-2 text-sm font-semibold text-brand-ink">
        SEO title
        <input
          value={data.seo_title ?? ""}
          onChange={(event) => onChange("seo_title", event.target.value)}
          maxLength={180}
          className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 text-sm font-normal"
          placeholder="Defaults to the content title"
        />
      </label>
      <label className="grid gap-2 text-sm font-semibold text-brand-ink">
        SEO description
        <textarea
          value={data.seo_description ?? ""}
          onChange={(event) => onChange("seo_description", event.target.value)}
          maxLength={320}
          rows={3}
          className="rounded border border-brand-line bg-white p-3 text-sm font-normal"
          placeholder="Defaults to the short introduction"
        />
      </label>
      <div className="grid gap-2 text-sm font-semibold text-brand-ink">
        <span>{articleEditor ? "Featured image" : "OG image"}</span>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 text-sm font-semibold text-brand-purple hover:bg-brand-blue"
            type="button"
            disabled={imageBusy}
            onClick={() => imageInput.current?.click()}
          >
            {imageBusy ? "Uploading…" : data.seo_image ? "Replace image" : `Upload ${articleEditor ? "featured image" : "OG image"}`}
          </button>
          {data.seo_image && <button
            className="text-sm font-semibold text-red-700 underline"
            type="button"
            onClick={() => onChange("seo_image", "")}
          >
            Remove image
          </button>}
        </div>
        <input
          ref={imageInput}
          className="sr-only"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadOgImage(file);
          }}
        />
        <span className="text-xs font-normal text-brand-muted">{articleEditor ? "This image is used for the blog article and its social sharing preview." : "Use a 1200 × 630 image for best sharing results. The branded site image is used if no item image is selected."}</span>
        {data.seo_image && <Image
          className="max-h-40 w-fit rounded border border-brand-line object-contain"
          width={640}
          height={336}
          unoptimized
          src={data.seo_image.startsWith("http") ? data.seo_image : apiUrl(data.seo_image.replace(/^\/api(?=\/)/, ""))}
          alt={articleEditor ? "Current featured image preview" : "Current OG image preview"}
        />}
        {imageError && <span className="text-xs font-normal text-red-700" role="alert">{imageError}</span>}
      </div>
    </fieldset>
  );

  return (
    <div className="grid gap-4">
      <span className="text-sm font-bold uppercase tracking-widest text-brand-muted">{compactScholarship ? "Make it easy to find" : "Details shown on the website"}</span>
      {compactScholarship && <p className="mb-0 -mt-3 text-xs text-brand-muted">Choose the filters readers can use to find this scholarship.</p>}
      <div className="grid gap-4 sm:grid-cols-2">{renderFields(compactScholarship ? coreFields : fields)}</div>
      {compactScholarship ? (
        <details className="rounded-lg border border-brand-line bg-brand-cream px-4">
          <summary className="cursor-pointer py-3 text-sm font-semibold text-brand-purple">More options <span className="ml-1 text-xs font-normal text-brand-muted">Optional · provider, eligibility and SEO</span></summary>
          <div className="grid gap-4 border-t border-brand-line py-4">
            {optionalContent}
            <div className="grid gap-4 sm:grid-cols-2">{renderFields(optionalFields)}</div>
            {searchAndSharingFields}
          </div>
        </details>
      ) : (
        searchAndSharingFields
      )}
    </div>
  );
}
