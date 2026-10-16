import type { SiteContent } from "@/lib/site-data";

export function jobField(item: SiteContent, key: string, fallback: string): string {
  const value = item.data[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function formatJobDate(value: string): string {
  if (!value || value === "Not stated by employer") return value || "Not stated by employer";
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);
}
