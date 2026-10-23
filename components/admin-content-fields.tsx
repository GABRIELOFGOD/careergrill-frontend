"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { apiRequest, apiUrl } from "@/lib/api";

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
  const imageInput = useRef<HTMLInputElement>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState("");

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
          <span>OG image</span>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="min-h-10 rounded border border-brand-line bg-white px-3 py-2 text-sm font-semibold text-brand-purple hover:bg-brand-blue"
              type="button"
              disabled={imageBusy}
              onClick={() => imageInput.current?.click()}
            >
              {imageBusy ? "Uploading…" : data.seo_image ? "Replace OG image" : "Upload OG image"}
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
          <span className="text-xs font-normal text-brand-muted">Use a 1200 × 630 image for best sharing results. The branded site image is used if no item image is selected.</span>
          {data.seo_image && <Image
            className="max-h-40 w-fit rounded border border-brand-line object-contain"
            width={640}
            height={336}
            unoptimized
            src={data.seo_image.startsWith("http") ? data.seo_image : apiUrl(data.seo_image.replace(/^\/api(?=\/)/, ""))}
            alt="Current OG image preview"
          />}
          {imageError && <span className="text-xs font-normal text-red-700" role="alert">{imageError}</span>}
        </div>
      </fieldset>
    </div>
  );
}
