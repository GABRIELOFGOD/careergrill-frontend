"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ApiError, apiRequest, apiUpload, apiUrl, type SessionUser } from "@/lib/api";
import { contentHref, type ContentType, type SiteContent } from "@/lib/site-data";
import type { ResourceAttachment } from "@/lib/resource-tools";
import { SiteBrand } from "@/components/site-shell";
import RichTextEditor from "@/components/rich-text-editor";
import ContentPreview from "@/components/content-preview";
import AdminContentFields from "@/components/admin-content-fields";
import AdminTrash from "@/components/admin-trash";
import AdminFaqs from "@/components/admin-faqs";
import AdminResourceFields from "@/components/admin-resource-fields";
import type { ServicePricingConfig } from "@/lib/service-pricing";
import { summarizeCountrySelection } from "@/lib/countries";

type AdminContent = SiteContent & { status: "draft" | "published" | "archived"; body: string; id: string; deleted_at: string | null };
type AiProvider = "openai" | "anthropic" | "google";
interface AdminFile {
  id: string;
  filename: string;
  mimetype: string;
  size_bytes: number;
  created_at: string;
  processing_status: "processing" | "ready" | "failed";
}
interface AdminCareerAudit {
  id: string;
  goal: string;
  feedback: string;
  rating: number | null;
  created_at: string;
}
interface CareerAuditDashboard {
  totalAudits: number;
  totalRatings: number;
  averageRating: number | null;
  totalUsage: number;
  todayUsage: number;
  items: AdminCareerAudit[];
}
interface Settings {
  ai_provider: AiProvider;
  ai_model: string;
  ai_models: Record<AiProvider, string>;
  career_audit_prompt: string;
  gtm_container_id: string;
  service_pricing: ServicePricingConfig;
  storage_provider: "supabase" | "cloudinary";
  configured_ai_providers: AiProvider[];
  cloudinary_configured: boolean;
  supabase_storage_bucket: string;
  email_configured: boolean;
}

function PriceSetting({ label, value, onChange, step = 1000 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) {
  return <label className="grid gap-1.5 text-sm font-semibold">{label}
    <input type="number" min={0} max={1_000_000_000} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} required />
  </label>;
}

const contentTypes: { value: ContentType; label: string }[] = [
  { value: "job", label: "Job" },
  { value: "scholarship", label: "Scholarship" },
  { value: "article", label: "Blog article" },
  { value: "resource", label: "Resource" },
  { value: "service", label: "Service" },
  { value: "testimonial", label: "Client feedback" },
];
const editableCareerBands = [
  { key: "0-3", label: "0–3 years" },
  { key: "4-6", label: "4–6 years" },
  { key: "7-10", label: "7–10 years" },
  { key: "10+", label: "10+ years" },
] as const;
const editableScholarshipBands = [
  { key: "1-2", label: "1–2 essays" },
  { key: "3-4", label: "3–4 essays" },
  { key: "5-6", label: "5–6 essays" },
] as const;
const pricingPackageFields = [
  { key: "clarity", label: "Clarity" },
  { key: "precision", label: "Precision" },
  { key: "distinction", label: "Distinction" },
] as const;
const scholarshipPackageFields = [
  { index: 0, label: "Clarity" },
  { index: 1, label: "Precision" },
  { index: 2, label: "Distinction" },
] as const;
const aiProviders: { value: AiProvider; label: string; defaultModel: string }[] = [
  { value: "openai", label: "OpenAI", defaultModel: "gpt-4.1-mini" },
  { value: "anthropic", label: "Anthropic", defaultModel: "claude-sonnet-4-20250514" },
  { value: "google", label: "Google Gemini", defaultModel: "gemini-2.5-flash" },
];
const careerAuditPromptWordLimit = 10_000;
const careerAuditPromptCharacterLimit = 100_000;
const contentTypeBySection: Partial<Record<string, ContentType>> = {
  jobs: "job",
  scholarships: "scholarship",
  blog: "article",
  resources: "resource",
  services: "service",
  feedback: "testimonial",
};
const fieldsByType: Partial<Record<ContentType, { key: string; label: string }[]>> = {
  job: [
    { key: "employer", label: "Employer" },
    { key: "location", label: "Location" },
    { key: "experience_level", label: "Experience level" },
    { key: "work_arrangement", label: "Work arrangement" },
    { key: "employment_type", label: "Employment type" },
    { key: "closing_date", label: "Closing date" },
    { key: "source_checked_at", label: "Source checked date" },
    { key: "featured", label: "Feature on public listing" },
    { key: "application_page_available", label: "Application page available" },
    { key: "qualification", label: "Qualification" },
    { key: "eligibility", label: "Location and eligibility callout" },
    { key: "application_instructions", label: "Application documents / instructions" },
    { key: "salary", label: "Salary information" },
  ],
  scholarship: [
    { key: "study_level", label: "Study level" },
    { key: "destination", label: "Destination" },
    { key: "funding_type", label: "Funding type" },
    { key: "subject_areas", label: "Subject areas" },
    { key: "eligible_countries", label: "Eligible applicant countries" },
    { key: "deadline_type", label: "Application deadline" },
    { key: "deadline", label: "Closing date" },
    { key: "provider", label: "Award provider" },
    { key: "coverage_primary_title", label: "Funding card 1 heading" },
    { key: "coverage_primary_text", label: "Funding card 1 details" },
    { key: "coverage_secondary_title", label: "Funding card 2 heading" },
    { key: "coverage_secondary_text", label: "Funding card 2 details" },
    { key: "award_coverage", label: "Funding coverage summary (fallback)" },
    { key: "award_badge", label: "Award badge" },
    { key: "application_status", label: "Application status" },
    { key: "cycle_label", label: "Cycle label" },
    { key: "source_checked_at", label: "Source checked date" },
    { key: "eligibility_status", label: "Eligibility status badge" },
    { key: "nationality_residence", label: "Nationality and residence" },
    { key: "eligibility_points", label: "Eligibility checks (one per line)" },
    { key: "eligibility_note", label: "Eligibility note" },
    { key: "provider_record", label: "Provider record summary" },
    { key: "featured", label: "Feature on public listing" },
  ],
  article: [
    { key: "author", label: "Author" },
    { key: "featured", label: "Feature as the lead blog article" },
    { key: "cover_theme", label: "Article cover colour theme" },
    { key: "cover_label", label: "Article cover topic label" },
    { key: "cover_lines", label: "Article cover prompts (one per line)" },
    { key: "related_resource_slug", label: "Related resource URL slug" },
    { key: "related_resource_title", label: "Related resource title" },
  ],
  resource: [{ key: "format", label: "Resource format" }],
  testimonial: [{ key: "author", label: "Client name" }, { key: "attribution", label: "Feedback context" }],
};
const emptyDraft = { type: "article" as ContentType, title: "", slug: "", excerpt: "", body: "", category: "", source_url: "", expires_at: "", published_at: "", status: "draft" as "draft" | "published", tags: "", data: {} as Record<string, string> };

function serializedContentData(data: Record<string, string>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).flatMap(([key, value]) => {
    if (value.trim() === "") return [];
    if (key === "resource_schema") {
      try {
        return [[key, JSON.parse(value) as unknown]];
      } catch {
        throw new Error("Check the resource section configuration before saving.");
      }
    }
    if (["study_level", "destination", "funding_type", "subject_areas", "eligible_countries"].includes(key)) {
      try {
        const parsed: unknown = JSON.parse(value);
        if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
          const selected = key === "subject_areas" ? parsed.filter((item) => item !== "Other") : parsed;
          return selected.length ? [[key, selected]] : [];
        }
      } catch {
        return [[key, [value]]];
      }
      return [[key, [value]]];
    }
    return [[key, ["featured", "application_page_available"].includes(key) ? value === "true" : value]];
  }));
}

function selectedFieldValues(value: string | undefined, key?: string): string[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
      return key === "subject_areas" ? parsed.filter((item) => item !== "Other") : parsed;
    }
  } catch {
    return key === "subject_areas" && value === "Other" ? [] : [value];
  }
  return key === "subject_areas" && value === "Other" ? [] : [value];
}

function isHttpUrl(value: string): boolean {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

function plainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function persistedContentBody(body: string): string {
    const container = document.createElement("div");
    container.innerHTML = body;
    const apiOrigin = new URL(apiUrl("/content")).origin;
    container.querySelectorAll("img[src]").forEach((image) => {
      const source = image.getAttribute("src");
      if (!source) return;
      const url = new URL(source, window.location.origin);
      if (url.origin === apiOrigin && /^\/api\/content\/assets\/[a-f0-9-]{36}$/i.test(url.pathname)) {
        image.setAttribute("src", url.pathname);
      }
    });
    return container.innerHTML;
}

function localDateTimeValue(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function publicationDateValue(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error("Choose a valid publication date and time.");
  return date.toISOString();
}

function AdminLogin({ onAuthenticated, initialError }: { onAuthenticated: () => void; initialError: string }) {
  const [mode, setMode] = useState<"login" | "bootstrap">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bootstrapToken, setBootstrapToken] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("");
    setBusy(true);
    try {
      await apiRequest(mode === "login" ? "/auth/login" : "/admin/bootstrap", {
        method: "POST",
        headers: mode === "bootstrap" ? { "x-bootstrap-token": bootstrapToken } : undefined,
        body: JSON.stringify({ ...(mode === "bootstrap" ? { name } : {}), email, password }),
      });
      onAuthenticated();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }
  return <main className="grid min-h-screen bg-brand-ink lg:grid-cols-2"><div className="flex flex-col justify-between gap-12 bg-brand-purple p-8 text-white lg:p-12"><SiteBrand footer /><div className="max-w-lg"><span className="text-xs font-bold uppercase tracking-widest text-brand-footer-hover">CAREERGRILL / CONTENT STUDIO</span><h1 className="my-4 text-5xl leading-tight text-white">Good work deserves<br /><em>good editing.</em></h1><p className="text-lg text-brand-footer-muted">A calm workspace for planning, writing and publishing practical career guidance.</p></div><span className="text-xs text-brand-footer-muted">Private administrator access · JWT session</span></div><form className="m-auto grid w-full max-w-lg content-start gap-4 rounded-lg bg-white p-6 shadow-lg sm:p-9" onSubmit={(event) => void submit(event)}><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">ADMINISTRATOR ACCESS</span><h2 className="mb-0 text-3xl">{mode === "login" ? "Welcome back." : "Create the first admin."}</h2><p className="mb-0 text-sm text-brand-muted">{mode === "login" ? "Sign in to manage Careergrill content." : "One-time setup. The bootstrap secret is configured on the server."}</p>{initialError && <p className="rounded border border-brand-line bg-brand-blue p-3 text-sm" role="alert">{initialError}</p>}{mode === "bootstrap" && <><label className="grid gap-1.5 text-sm font-semibold">Your name<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} /></label><label className="grid gap-1.5 text-sm font-semibold">One-time setup secret<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" value={bootstrapToken} onChange={(event) => setBootstrapToken(event.target.value)} required autoComplete="off" /></label></>}{mode === "login" && <label className="grid gap-1.5 text-sm font-semibold">Email<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" /></label>}{mode === "bootstrap" && <label className="grid gap-1.5 text-sm font-semibold">Admin email<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>}<label className="grid gap-1.5 text-sm font-semibold">Password<input className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === "bootstrap" ? 12 : 1} maxLength={128} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label><button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create administrator"}</button>{notice && <p className="rounded border border-brand-line bg-brand-blue p-3 text-sm" role="alert">{notice}</p>}<button type="button" className="justify-self-start text-sm font-semibold text-brand-purple hover:underline" onClick={() => { setMode(mode === "login" ? "bootstrap" : "login"); setNotice(""); }}>{mode === "login" ? "First time? Set up the first admin" : "Already set up? Sign in"}</button><Link className="text-sm font-semibold text-brand-purple hover:underline" href="/">← Return to website</Link></form></main>;
}

export default function AdminConsole() {
  const pathname = usePathname();
  const router = useRouter();
  const section = pathname.split("/")[2] ?? "";
  const contentType = contentTypeBySection[section];
  const isContentSection = section === "content" || contentType !== undefined;
  const [access, setAccess] = useState<"checking" | "signed-out" | "denied" | "error" | "authorized">("checking");
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [connectionError, setConnectionError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [overview, setOverview] = useState<{ contentCount: number; publishedCount: number; documentCount: number; userCount: number } | null>(null);
  const [contents, setContents] = useState<AdminContent[]>([]);
  const [trashedContents, setTrashedContents] = useState<AdminContent[]>([]);
  const [files, setFiles] = useState<AdminFile[]>([]);
  const [careerAudits, setCareerAudits] = useState<CareerAuditDashboard | null>(null);
  const [careerAuditsError, setCareerAuditsError] = useState("");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [resourceAttachments, setResourceAttachments] = useState<ResourceAttachment[]>([]);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState("");
  const editingContentId = useRef("");
  const preservedContentData = useRef<Record<string, unknown>>({});
  const [isEditingPublished, setIsEditingPublished] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [aiType, setAiType] = useState<ContentType>("article");
  const [aiProvider, setAiProvider] = useState<AiProvider>("openai");
  const [aiDraftReady, setAiDraftReady] = useState(false);
  const [contentPreview, setContentPreview] = useState(false);
  const preserveDraftOnNavigation = useRef(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    ai_provider: "openai" as AiProvider,
    ai_model: "gpt-4.1-mini",
    ai_models: {
      openai: "gpt-4.1-mini",
      anthropic: "claude-sonnet-4-20250514",
      google: "gemini-2.5-flash",
    },
    career_audit_prompt: "",
    gtm_container_id: "",
    service_pricing: null as ServicePricingConfig | null,
    storage_provider: "supabase" as Settings["storage_provider"],
    ai_api_key: "",
    cloudinary_cloud_name: "",
    cloudinary_api_key: "",
    cloudinary_api_secret: "",
  });

  function updateServicePricing(update: (pricing: ServicePricingConfig) => ServicePricingConfig) {
    setSettingsForm((current) => current.service_pricing
      ? { ...current, service_pricing: update(current.service_pricing) }
      : current);
  }

  function updateCareerPrice(band: keyof ServicePricingConfig["career"]["bands"], field: "individual" | "bundle", value: number) {
    updateServicePricing((pricing) => ({
      ...pricing,
      career: {
        ...pricing.career,
        bands: {
          ...pricing.career.bands,
          [band]: { ...pricing.career.bands[band], [field]: value },
        },
      },
    }));
  }

  function updateScholarshipPrice(band: "1-2" | "3-4" | "5-6", index: 0 | 1 | 2, value: number) {
    updateServicePricing((pricing) => {
      const prices: [number, number, number] = [...pricing.scholarships[band]];
      prices[index] = value;
      return { ...pricing, scholarships: { ...pricing.scholarships, [band]: prices } };
    });
  }

  function updateAdmissionPrice(key: keyof ServicePricingConfig["admissions"], value: number) {
    updateServicePricing((pricing) => ({ ...pricing, admissions: { ...pricing.admissions, [key]: value } }));
  }

  function updateMbaPrice(key: keyof ServicePricingConfig["mba"], value: number) {
    updateServicePricing((pricing) => ({ ...pricing, mba: { ...pricing.mba, [key]: value } }));
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setContentPreview(false);
      if (contentType) {
        if (preserveDraftOnNavigation.current) {
          preserveDraftOnNavigation.current = false;
          setAiDraftReady(false);
        } else {
          setDraft({ ...emptyDraft, type: contentType });
          setResourceAttachments([]);
          setResourceFiles([]);
          editingContentId.current = "";
          preservedContentData.current = {};
          setEditingId("");
          setIsEditingPublished(false);
        }
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [contentType]);

  const loadDashboard = useCallback(async () => {
    setNotice("");
    setConnectionError("");
    setAccess("checking");
    try {
      const { user } = await apiRequest<{ user: SessionUser }>("/auth/me");
      setSessionUser(user);
      if (user.role !== "admin") {
        setConnectionError("This account does not have administrator access.");
        setAccess("denied");
        return;
      }
      const [summary, contentResult, filesResult, settingsResult] = await Promise.all([
        apiRequest<typeof overview>("/admin/overview"),
        apiRequest<{ items: AdminContent[] }>("/admin/content"),
        apiRequest<{ items: AdminFile[] }>("/admin/files"),
        apiRequest<Settings>("/admin/settings"),
      ]);
      setOverview(summary);
      setContents(contentResult.items);
      setFiles(filesResult.items);
      setSettings(settingsResult);
      setSettingsForm((current) => ({
        ...current,
        ai_provider: settingsResult.ai_provider,
        ai_model: settingsResult.ai_model,
        ai_models: settingsResult.ai_models,
        career_audit_prompt: settingsResult.career_audit_prompt,
        gtm_container_id: settingsResult.gtm_container_id,
        service_pricing: settingsResult.service_pricing,
        storage_provider: settingsResult.storage_provider,
      }));
      setAiProvider((current) => settingsResult.configured_ai_providers.includes(current)
        ? current
        : settingsResult.configured_ai_providers[0] ?? current);
      setAccess("authorized");
    } catch (error) {
      if (error instanceof ApiError && ["AUTH_REQUIRED", "SESSION_INVALID", "SESSION_EXPIRED"].includes(error.code ?? "")) {
        setSessionUser(null);
        setAccess("signed-out");
        return;
      }
      if (error instanceof ApiError && error.code === "ADMIN_REQUIRED") {
        setAccess("denied");
        setConnectionError("This account does not have administrator access.");
        return;
      }
      if (error instanceof ApiError && error.status === 401) {
        setSessionUser(null);
        setAccess("signed-out");
        return;
      }
      setConnectionError(error instanceof Error ? error.message : "The API could not be reached.");
      setAccess("error");
    }
  }, []);

  useEffect(() => {
    if (access !== "authorized" || section !== "trash") return;
    void apiRequest<{ items: AdminContent[] }>("/admin/content/trash")
      .then(({ items }) => setTrashedContents(items))
      .catch((error: unknown) => setNotice(error instanceof Error ? error.message : "Could not load trash."));
  }, [access, section]);

  useEffect(() => {
    if (access !== "authorized" || section !== "audits") return;
    void apiRequest<CareerAuditDashboard>("/admin/audits")
      .then((result) => {
        setCareerAudits(result);
        setCareerAuditsError("");
      })
      .catch((error: unknown) => setCareerAuditsError(error instanceof Error ? error.message : "Could not load Career Audit activity."))
  }, [access, section]);

  useEffect(() => {
    if (access !== "authorized" || !["ai", "files"].includes(section)
      || !files.some((item) => item.processing_status === "processing")) return;
    const timer = window.setInterval(() => {
      void apiRequest<{ items: AdminFile[] }>("/admin/files")
        .then(({ items }) => setFiles(items))
        .catch((error: unknown) => setNotice(error instanceof Error ? error.message : "Could not refresh document status."));
    }, 3000);
    return () => window.clearInterval(timer);
  }, [access, files, section]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadDashboard(), 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  useEffect(() => {
    if (section === "ai" && aiDraftReady) {
      document.querySelector(".ai-generated-draft")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [section, aiDraftReady]);

  async function logout() {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      setAccess("signed-out");
      setSessionUser(null);
      setConnectionError("");
      setOverview(null);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not sign out.");
    }
  }

  function editContent(item: AdminContent) {
    setContentPreview(false);
    editingContentId.current = item.id;
    preservedContentData.current = item.type === "service" ? item.data : {};
    setEditingId(item.id);
    setIsEditingPublished(item.status === "published");
    setResourceFiles([]);
    setResourceAttachments([]);
    if (item.type === "resource") {
      void apiRequest<{ items: ResourceAttachment[] }>(`/admin/content/resources/${item.id}/attachments`)
        .then(({ items }) => setResourceAttachments(items))
        .catch((error: unknown) => setNotice(error instanceof Error ? error.message : "Could not load resource downloads."));
    }
    setDraft({
      type: item.type,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      body: item.body,
      category: item.category,
      source_url: item.source_url ?? "",
      expires_at: item.expires_at ? item.expires_at.slice(0, 10) : "",
      published_at: localDateTimeValue(item.published_at ?? (
        typeof item.data.published_date === "string"
          ? `${item.data.published_date}T00:00:00Z`
          : null
      )),
      status: item.status === "published" ? "published" : "draft",
      tags: item.tags.join(", "),
      data: item.type === "service" ? {} : Object.fromEntries(Object.entries(item.data)
        .filter(([key]) => key !== "attachments")
        .map(([key, value]) => [
          key,
          key === "resource_schema" || Array.isArray(value)
            ? JSON.stringify(value)
            : String(value),
        ])),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveContent(status = draft.status) {
    if (draft.title.trim().length < 3) {
      setNotice("Add a title of at least three characters before saving.");
      setContentPreview(false);
      return;
    }
    if (draft.type === "scholarship" && status === "published") {
      const requiredFilters = ["study_level", "destination", "funding_type", "subject_areas", "eligible_countries"];
      const missingFilters = requiredFilters.filter((key) => selectedFieldValues(draft.data[key], key).length === 0);
      const deadlineType = draft.data.deadline_type;
      const hasDeadline = deadlineType === "rolling"
        || deadlineType === "unknown"
        || (deadlineType === "fixed" && /^\d{4}-\d{2}-\d{2}$/.test(draft.data.deadline ?? ""));
      const hasDetails = plainText(draft.body).length >= 80;
      const issues = [
        ...missingFilters.map((key) => `${key.replaceAll("_", " ")} selection`),
        ...(!hasDeadline ? ["deadline"] : []),
        ...(!isHttpUrl(draft.source_url) ? ["official application link"] : []),
        ...(!hasDetails ? ["scholarship details (at least 80 characters)"] : []),
      ];
      if (issues.length) {
        setNotice(`Complete these details before publishing: ${issues.join(", ")}.`);
        return;
      }
    }
    setBusy(true);
    setNotice("");
    const contentId = editingContentId.current;
    try {
      const body = {
        ...draft,
        body: persistedContentBody(draft.body),
        excerpt: draft.type === "scholarship" && !draft.excerpt.trim()
          ? plainText(draft.body).slice(0, 240)
          : draft.excerpt,
        type: contentType ?? draft.type,
        status,
        tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        published_at: draft.type === "article" ? publicationDateValue(draft.published_at) : undefined,
        expires_at: (() => {
          const scholarshipDeadline = draft.data.deadline_type === "fixed"
            && /^\d{4}-\d{2}-\d{2}$/.test(draft.data.deadline ?? "")
            ? draft.data.deadline
            : "";
          const expiryDate = draft.type === "article" ? "" : draft.type === "scholarship" ? scholarshipDeadline : draft.expires_at;
          return expiryDate ? new Date(`${expiryDate}T23:59:59.000Z`).toISOString() : null;
        })(),
        source_url: draft.type === "article" ? null : draft.source_url || null,
        data: draft.type === "service"
          ? { ...preservedContentData.current, ...serializedContentData(draft.data) }
          : serializedContentData(draft.data),
      };
      const { item: savedContent } = await apiRequest<{ item: AdminContent }>(contentId ? `/admin/content/${contentId}` : "/admin/content", {
        method: contentId ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });
      if (draft.type === "resource") {
        editingContentId.current = savedContent.id;
        setEditingId(savedContent.id);
      }
      for (const resourceFile of draft.type === "resource" ? resourceFiles : []) {
        const form = new FormData();
        form.append("file", resourceFile);
        const { item } = await apiUpload<{ item: ResourceAttachment }>(`/admin/content/resources/${savedContent.id}/attachments`, form);
        setResourceAttachments((current) => [...current, item]);
        setResourceFiles((current) => current.filter((file) => file !== resourceFile));
      }
      setNotice(status === "published" ? "Content published." : "Draft saved.");
      editingContentId.current = "";
      preservedContentData.current = {};
      setEditingId("");
      setIsEditingPublished(false);
      setDraft({ ...emptyDraft, type: contentType ?? "article" });
      setResourceAttachments([]);
      setResourceFiles([]);
      setContentPreview(false);
      await loadDashboard();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save this content. Any successfully uploaded files remain attached.");
    } finally {
      setBusy(false);
    }
  }

  function submitContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isEditingPublished || ["job", "scholarship"].includes(contentType ?? draft.type)) {
      setContentPreview(true);
      return;
    }
    void saveContent();
  }

  async function deleteContent(id: string) {
    if (!window.confirm("Move this content to trash? You can restore it later.")) return;
    try {
      await apiRequest(`/admin/content/${id}`, { method: "DELETE" });
      setContents((current) => current.filter((item) => item.id !== id));
      setNotice("Content moved to trash.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete this content.");
    }
  }

  async function restoreContent(id: string) {
    try {
      const { item } = await apiRequest<{ item: AdminContent }>(`/admin/content/${id}/restore`, { method: "POST" });
      setTrashedContents((current) => current.filter((entry) => entry.id !== id));
      setContents((current) => [item, ...current]);
      setNotice("Content restored.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not restore this content.");
    }
  }

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedFileNotReady = files.some((item) =>
      selectedDocuments.includes(item.id) && item.processing_status !== "ready");
    if (selectedFileNotReady) {
      setNotice("Wait for selected documents to finish indexing before generating a draft.");
      return;
    }
    setBusy(true);
    setAiDraftReady(false);
    setNotice("Drafting content from your prompt…");
    try {
      const result = await apiRequest<{ item: { title: string; excerpt: string; body: string; category: string; suggested_slug: string; expires_at: string | null; source_url: string | null } }>("/admin/ai/generate", {
        method: "POST",
        body: JSON.stringify({ prompt, type: aiType, document_ids: selectedDocuments, provider: aiProvider }),
      });
      setDraft({
        ...emptyDraft,
        type: aiType,
        title: result.item.title,
        slug: result.item.suggested_slug,
        excerpt: result.item.excerpt,
        body: result.item.body,
        category: result.item.category,
        source_url: result.item.source_url ?? "",
        expires_at: result.item.expires_at?.slice(0, 10) ?? "",
        status: "draft",
        data: {},
      });
      editingContentId.current = "";
      setEditingId("");
      setAiDraftReady(true);
      setNotice("AI draft ready. Review every detail and save it below when you’re satisfied.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The AI draft could not be generated.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAIDraft(status: "draft" | "published" = "draft") {
    setBusy(true);
    setNotice("");
    const body = {
      ...draft,
      body: persistedContentBody(draft.body),
      type: aiType,
      status,
      tags: [],
      published_at: aiType === "article" ? publicationDateValue(draft.published_at) : undefined,
      expires_at: aiType === "article" ? null : draft.expires_at ? new Date(`${draft.expires_at}T23:59:59.000Z`).toISOString() : null,
      source_url: aiType === "article" ? null : draft.source_url || null,
      data: serializedContentData(draft.data),
    };
    try {
      await apiRequest("/admin/content", { method: "POST", body: JSON.stringify(body) });
      setAiDraftReady(false);
      setDraft({ ...emptyDraft, type: aiType });
      await loadDashboard();
      setNotice(status === "published"
        ? "AI content approved and published."
        : "AI draft saved in its separate content library. Review and publish it from that dashboard page.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save the AI draft.");
    } finally {
      setBusy(false);
    }
  }

  function editAIDraft() {
    const section = Object.entries(contentTypeBySection).find(([, type]) => type === aiType)?.[0];
    if (!section) return;
    preserveDraftOnNavigation.current = true;
    router.push(`/dashboard/${section}`);
  }

  async function uploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) { setNotice("Choose a document to upload."); return; }
    setBusy(true);
    setUploadProgress(0);
    setNotice("");
    const body = new FormData();
    body.append("file", file);
    try {
      const { item } = await apiUpload<{ item: AdminFile }>("/admin/files", body, (percent) => {
        setUploadProgress(percent);
        setNotice(percent === 100 ? "Upload received; processing and storing document…" : `Uploading document… ${percent}%`);
      });
      setFiles((current) => [item, ...current.filter((existing) => existing.id !== item.id)]);
      setOverview((current) => current ? { ...current, documentCount: current.documentCount + 1 } : current);
      setFile(null);
      setUploadProgress(null);
      setNotice("File uploaded and indexed. It is ready to use in AI drafts.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The document could not be uploaded.");
    } finally {
      setUploadProgress(null);
      setBusy(false);
    }
  }

  async function deleteFile(id: string) {
    if (!window.confirm("Remove this document and its stored file?")) return;
    try {
      await apiRequest(`/admin/files/${id}`, { method: "DELETE" });
      setFiles((current) => current.filter((item) => item.id !== id));
      setSelectedDocuments((current) => current.filter((item) => item !== id));
      setNotice("Document removed.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not remove the document.");
    }
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cloudinaryValues = [
      settingsForm.cloudinary_cloud_name,
      settingsForm.cloudinary_api_key,
      settingsForm.cloudinary_api_secret,
    ];
    if (cloudinaryValues.some(Boolean) && !cloudinaryValues.every(Boolean)) {
      setNotice("To configure or replace Cloudinary credentials, enter the cloud name, API key and API secret together.");
      return;
    }
    setBusy(true);
    setNotice("");
    const aiModels = { ...settingsForm.ai_models, [settingsForm.ai_provider]: settingsForm.ai_model };
    const payload = {
      ...Object.fromEntries(Object.entries(settingsForm).filter(([key, value]) => !["service_pricing", "gtm_container_id"].includes(key) && value !== "")),
      ai_models: aiModels,
    };
    try {
      await apiRequest("/admin/settings", { method: "PUT", body: JSON.stringify(payload) });
      setSettingsForm((current) => ({
        ...current,
        ai_api_key: "",
        cloudinary_cloud_name: "",
        cloudinary_api_key: "",
        cloudinary_api_secret: "",
      }));
      setNotice("Settings saved. Secret values are encrypted on the server and cannot be read back.");
      await loadDashboard();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save settings.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAiModels(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      await apiRequest("/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ ai_models: settingsForm.ai_models }),
      });
      setSettings((current) => current ? { ...current, ai_models: { ...settingsForm.ai_models } } : current);
      setNotice("Model names saved for all three AI providers.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save AI model names.");
    } finally {
      setBusy(false);
    }
  }

  async function saveCareerAuditPrompt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      await apiRequest("/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ career_audit_prompt: settingsForm.career_audit_prompt }),
      });
      setSettings((current) => current
        ? { ...current, career_audit_prompt: settingsForm.career_audit_prompt.trim() }
        : current);
      setSettingsForm((current) => ({ ...current, career_audit_prompt: current.career_audit_prompt.trim() }));
      setNotice("Career Audit instructions saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save Career Audit instructions.");
    } finally {
      setBusy(false);
    }
  }

  async function saveGtmContainerId(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const containerId = settingsForm.gtm_container_id.trim().toUpperCase();
      await apiRequest("/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ gtm_container_id: containerId }),
      });
      setSettings((current) => current ? { ...current, gtm_container_id: containerId } : current);
      setSettingsForm((current) => ({ ...current, gtm_container_id: containerId }));
      setNotice(containerId
        ? "Google Tag Manager saved. Analytics tags will load for all visitors."
        : "Google Tag Manager removed.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save Google Tag Manager.");
    } finally {
      setBusy(false);
    }
  }

  async function saveServicePricing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const servicePricing = settingsForm.service_pricing;
    if (!servicePricing) {
      setNotice("Service pricing has not been loaded from the database.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      await apiRequest("/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ service_pricing: servicePricing }),
      });
      setSettings((current) => current
        ? { ...current, service_pricing: servicePricing }
        : current);
      setNotice("Service prices saved and are now available on the services page.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save service prices.");
    } finally {
      setBusy(false);
    }
  }

  if (access === "checking") {
    return <div className="grid min-h-screen place-content-center justify-items-center gap-3 bg-brand-cream text-brand-muted"><span className="size-8 animate-spin rounded-full border-4 border-brand-line border-t-brand-purple" /><p>Connecting to the Careergrill content studio…</p></div>;
  }
  if (access === "signed-out") return <AdminLogin onAuthenticated={() => void loadDashboard()} initialError={connectionError} />;
  if (access === "denied") {
    return <main className="grid min-h-screen bg-brand-ink lg:grid-cols-2">
      <div className="flex flex-col justify-between gap-12 bg-brand-purple p-8 text-white lg:p-12"><SiteBrand footer /><div><span className="text-xs font-bold uppercase tracking-widest text-brand-footer-hover">CAREERGRILL / CONTENT STUDIO</span><h1 className="my-4 text-5xl text-white">Private access<br /><em>by role.</em></h1><p className="text-brand-footer-muted">The dashboard is available only to accounts assigned the administrator role.</p></div><span className="text-xs text-brand-footer-muted">Administrator access · JWT session</span></div>
      <section className="m-auto grid w-full max-w-lg content-start gap-4 rounded-lg bg-white p-6 shadow-lg sm:p-9"><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">ACCESS DENIED</span><h2 className="mb-0 text-3xl">Administrator role required.</h2><p className="text-sm text-brand-muted">{sessionUser?.email} is signed in as <strong>{sessionUser?.role}</strong>. Ask an administrator to grant the required role.</p>{notice && <p className="rounded border border-brand-line bg-brand-blue p-3 text-sm" role="alert">{notice}</p>}<button className={buttonVariants({ variant: "brand", size: "sm" })} type="button" onClick={() => void logout()}>Sign out</button><Link className="text-sm font-semibold text-brand-purple hover:underline" href="/">← Return to website</Link></section>
    </main>;
  }
  if (access === "error") {
    return <main className="grid min-h-screen content-center justify-items-center gap-3 bg-brand-cream"><p role="alert">{connectionError}</p><button className={buttonVariants({ variant: "brand", size: "sm" })} type="button" onClick={() => void loadDashboard()}>Try again</button></main>;
  }

  const navItems = [
    ["Overview", "/dashboard", ""],
    ["Jobs", "/dashboard/jobs", "jobs"],
    ["Scholarships", "/dashboard/scholarships", "scholarships"],
    ["Blog", "/dashboard/blog", "blog"],
    ["Resources", "/dashboard/resources", "resources"],
    ["Services", "/dashboard/services", "services"],
    ["FAQs", "/dashboard/faqs", "faqs"],
    ["Feedback", "/dashboard/feedback", "feedback"],
    ["Career audits", "/dashboard/audits", "audits"],
    ["All content", "/dashboard/content", "content"],
    ["Trash", "/dashboard/trash", "trash"],
    ["AI studio", "/dashboard/ai", "ai"],
    ["Reference files", "/dashboard/files", "files"],
    ["Settings", "/dashboard/settings", "settings"],
  ];
  const sectionTitles: Record<string, string> = {
    content: "All content",
    trash: "Trash",
    jobs: "Jobs",
    scholarships: "Scholarships",
    blog: "Blog posts",
    resources: "Resources",
    services: "Services",
    faqs: "FAQs",
    feedback: "Client feedback",
    audits: "Career Audit activity",
    ai: "AI writing studio",
    files: "Reference library",
    settings: "Studio settings",
  };
  const title = sectionTitles[section] ?? "Your studio";
  const sectionContents = contentType ? contents.filter((item) => item.type === contentType) : contents;
  const pricingForm = settingsForm.service_pricing;
  const careerAuditPromptWords = settingsForm.career_audit_prompt.trim().split(/\s+/).filter(Boolean).length;
  const scholarshipChecks = [
    { label: "Scholarship title", complete: draft.title.trim().length >= 3 },
    { label: "Search filters selected", complete: ["study_level", "destination", "funding_type", "subject_areas", "eligible_countries"].every((key) => selectedFieldValues(draft.data[key]).length > 0) },
    { label: "Deadline selected", complete: draft.data.deadline_type === "rolling" || draft.data.deadline_type === "unknown" || (draft.data.deadline_type === "fixed" && /^\d{4}-\d{2}-\d{2}$/.test(draft.data.deadline ?? "")) },
    { label: "Official link added", complete: isHttpUrl(draft.source_url) },
    { label: "Scholarship details added", complete: plainText(draft.body).length >= 80 },
  ];
  const scholarshipSlugPreview = draft.slug || draft.title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return <div className="min-h-screen bg-brand-cream font-sans lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
    <aside className="sticky top-0 z-20 flex max-h-screen flex-col gap-4 overflow-y-auto border-r border-brand-line bg-white p-4 text-brand-ink max-lg:static max-lg:max-h-none">
      <div className="grid gap-2 border-b border-brand-line pb-4"><SiteBrand footer /><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">CONTENT STUDIO</span></div>
      <nav className="grid gap-1" aria-label="Dashboard navigation">{navItems.map(([label, href, key]) => <Link key={href} href={href} aria-current={section === key ? "page" : undefined} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-brand-blue ${section === key ? "bg-brand-sage text-brand-purple" : "text-brand-muted"}`}><span className={`size-1.5 rounded-full ${section === key ? "bg-brand-orange" : "bg-brand-line"}`} />{label}</Link>)}</nav>
      <div className="mt-auto grid gap-2 border-t border-brand-line pt-4 text-sm"><Link className="text-brand-purple hover:underline" href="/">↗ View website</Link><button className="text-left text-brand-purple hover:underline" onClick={() => void logout()}>↗ Sign out</button><small className="text-xs text-brand-muted">Careergrill · Private dashboard</small></div>
    </aside>
    <main className="min-w-0">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-line bg-white px-5 py-3 sm:px-8"><div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">CONTENT STUDIO / {section || "OVERVIEW"}</span><h1 className="mb-0 mt-1 text-2xl">{title}</h1></div><span className="grid size-10 place-items-center rounded-full bg-brand-sage text-sm font-bold text-brand-purple" title={sessionUser?.email}>{sessionUser?.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AD"}</span></header>
      <div className="mx-auto grid max-w-7xl gap-4 p-4 sm:p-7">
        {["ai", "files"].includes(section) && files.some((item) => item.processing_status !== "ready") && <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900" role="status">
          {files.filter((item) => item.processing_status === "processing").map((item) => `${item.filename}: indexing in progress.`).join(" ")}
          {files.filter((item) => item.processing_status === "failed").map((item) => `${item.filename}: indexing failed; remove it and upload it again.`).join(" ")}
        </div>}
        {section === "settings" && <p className="mb-0 rounded border border-brand-line bg-brand-blue p-3 text-sm leading-relaxed text-brand-muted">
          Cloudinary credentials come from the Cloudinary Console dashboard: cloud name, API key and API secret. Enter all three together, save, then select Cloudinary. Cloudinary uses folders, not buckets; Supabase uses the private bucket <strong>{settings?.supabase_storage_bucket}</strong>.
        </p>}
        {section === "files" && uploadProgress !== null && <div className="grid gap-2 rounded border border-brand-line bg-white p-4" role="status">
          <p className="mb-0 text-sm">{uploadProgress === 100 ? "Upload received; processing and storing document…" : `Uploading document… ${uploadProgress}%`}</p>
          <progress className="h-2 w-full accent-brand-purple" aria-label="Document upload progress" max={100} value={uploadProgress} />
        </div>}
        {section === "audits" && <section className="grid gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">CAREER AUDIT / SERVICE INSIGHTS</span>
            <h2 className="mb-1 mt-1 text-2xl">Usage, AI responses and ratings</h2>
            <p className="mb-0 text-sm text-brand-muted">Usage includes all reserved generation attempts, including attempts that did not produce a saved response. The table shows the 100 most recent saved audits.</p>
          </div>
          {careerAuditsError && <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">{careerAuditsError}</p>}
          {!careerAudits && !careerAuditsError && <p className="text-sm text-brand-muted" role="status">Loading Career Audit activity…</p>}
          {careerAudits && <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Saved audits", careerAudits.totalAudits, "All generated responses"],
                ["Attempts today", careerAudits.todayUsage, "Includes failed attempts"],
                ["All-time attempts", careerAudits.totalUsage, "Reserved generations"],
                ["Average rating", careerAudits.averageRating === null ? "—" : `${careerAudits.averageRating.toFixed(1)}/5`, `${careerAudits.totalRatings} ratings submitted`],
              ].map(([label, value, detail]) => <div className="rounded border border-brand-line bg-white p-4" key={label}>
                <span className="text-sm text-brand-muted">{label}</span>
                <strong className="my-2 block font-display text-3xl">{value}</strong>
                <small className="text-xs text-brand-muted">{detail}</small>
              </div>)}
            </div>
            {careerAudits.items.length ? careerAudits.items.map((audit) => <article className="grid gap-3 rounded border border-brand-line bg-white p-5" key={audit.id}>
              <header className="flex flex-wrap items-start justify-between gap-3 border-b border-brand-line pb-3">
                <div>
                  <span className="rounded-full bg-brand-blue px-2.5 py-1 text-xs font-semibold">{audit.goal}</span>
                  <p className="mb-0 mt-2 text-xs text-brand-muted">{new Date(audit.created_at).toLocaleString()}</p>
                </div>
                <span className="rounded bg-brand-sage px-2.5 py-1 text-sm font-semibold text-brand-purple">{audit.rating === null ? "Not rated" : `Rating: ${audit.rating}/5`}</span>
              </header>
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-brand-muted">{audit.feedback}</div>
            </article>) : <p className="rounded border border-brand-line bg-white p-5 text-sm text-brand-muted">No Career Audit responses have been saved yet.</p>}
          </>}
        </section>}
        {section === "ai" && aiDraftReady && draft.type === aiType && <section className="grid gap-4 rounded border border-brand-line bg-white p-5">
          <div className="flex items-center justify-between gap-3"><div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">AI CONTENT · REVIEW BEFORE PUBLISHING</span><h2 className="mb-0 mt-1 text-2xl">Preview it as a reader.</h2></div><span className="grid size-10 place-items-center rounded bg-brand-sage text-xl text-brand-purple">✦</span></div>
          <ContentPreview type={aiType} title={draft.title} excerpt={draft.excerpt} body={draft.body} category={draft.category} data={draft.data} sourceUrl={draft.source_url} />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-line pt-4">
            <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" disabled={busy} onClick={() => setAiDraftReady(false)}>Discard</button>
            <div className="flex flex-wrap gap-2">
              <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" disabled={busy} onClick={editAIDraft}>Edit details</button>
              <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" disabled={busy} onClick={() => void saveAIDraft("draft")}>{busy ? "Saving…" : "Save as draft"}</button>
              <button className={buttonVariants({ variant: "brand", size: "sm" })} type="button" disabled={busy} onClick={() => void saveAIDraft("published")}>{busy ? "Publishing…" : "Approve & publish"}</button>
            </div>
          </div>
        </section>}
        {section === "trash" && <AdminTrash items={trashedContents} onRestore={restoreContent} />}
        {notice && <div className="rounded border border-brand-line bg-brand-blue p-3 text-sm" role="status">{notice}</div>}
        {connectionError && <div className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">{connectionError}</div>}
        {section === "faqs" && <AdminFaqs />}
        {isContentSection ? <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,.8fr)]">
          <div>
            <form className="grid content-start gap-4 rounded border border-brand-line bg-white p-5 [&_label]:grid [&_label]:gap-1.5 [&_label]:text-sm [&_label]:font-semibold [&_input]:min-h-10 [&_input]:rounded [&_input]:border [&_input]:border-brand-line [&_input]:px-3 [&_input]:py-2 [&_input]:font-normal [&_select]:min-h-10 [&_select]:rounded [&_select]:border [&_select]:border-brand-line [&_select]:bg-white [&_select]:px-3 [&_select]:py-2 [&_select]:font-normal [&_textarea]:rounded [&_textarea]:border [&_textarea]:border-brand-line [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:font-normal" onSubmit={submitContent}>
              <div className="flex items-center justify-between gap-3"><div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">{editingId ? "EDIT CONTENT" : "MANUAL EDITOR"}</span><h2 className="mb-0 mt-1 text-2xl">{contentPreview ? "Reader preview." : editingId ? "Refine your draft." : "Write for the reader."}</h2></div><button type="button" className="rounded border border-brand-line px-3 py-2 text-sm font-semibold text-brand-purple hover:bg-brand-blue" aria-pressed={contentPreview} onClick={() => setContentPreview((current) => !current)}>{contentPreview ? "✎ Edit" : "Preview ↗"}</button></div>
              {contentPreview ? <>
                <ContentPreview type={contentType ?? draft.type} title={draft.title} excerpt={draft.excerpt || (draft.type === "scholarship" ? plainText(draft.body).slice(0, 240) : "")} body={draft.body} category={draft.category} data={draft.data} sourceUrl={draft.source_url} />
                <div className="flex flex-wrap justify-between gap-2 border-t border-brand-line pt-4">
                  <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" onClick={() => setContentPreview(false)}>Back to editor</button>
                  <div className="flex flex-wrap gap-2">
                    {!isEditingPublished && <button className={buttonVariants({ variant: "outline", size: "sm" })} type="button" disabled={busy} onClick={() => void saveContent("draft")}>{busy ? "Saving…" : "Save as draft"}</button>}
                    <button className={buttonVariants({ variant: "brand", size: "sm" })} type="button" disabled={busy} onClick={() => void saveContent("published")}>{busy ? "Publishing…" : "Approve & publish"}</button>
                  </div>
                </div>
              </> : <>
              {contentType === "scholarship" ? <>
                <section className="grid gap-4">
                  <label>Scholarship title<input className="font-display text-lg font-bold" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required minLength={3} maxLength={180} placeholder="Paste the scholarship title" /></label>
                  <p className="-mt-2 mb-0 text-xs text-brand-muted">careergrill.com/scholarship/{scholarshipSlugPreview || "your-scholarship-title"}</p>
                </section>
                {fieldsByType.scholarship && <AdminContentFields
                  fields={fieldsByType.scholarship}
                  data={draft.data}
                  compactScholarship
                  optionalContent={<label>Custom listing introduction<textarea value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} rows={3} maxLength={500} placeholder="Leave blank to use the opening text" /></label>}
                  onChange={(key, value) => setDraft((current) => ({ ...current, data: { ...current.data, [key]: value } }))}
                />}
                <label>Official application link<input type="text" inputMode="url" value={draft.source_url} onChange={(event) => setDraft({ ...draft, source_url: event.target.value })} placeholder="https://…" /><small className="font-normal text-brand-muted">Link to the provider’s official page or application.</small></label>
                <div className="grid gap-2">
                  <label>Scholarship details</label>
                  <RichTextEditor value={draft.body} onChange={(body) => setDraft((current) => ({ ...current, body }))} onError={setNotice} />
                  <p className="mb-0 text-xs text-brand-muted">Paste the complete write-up. Headings, lists and links are preserved.</p>
                  <div className="rounded bg-brand-blue p-3 text-xs"><strong className="mb-1 block text-brand-purple">Automatic listing introduction</strong><span className="text-brand-muted">{draft.excerpt || plainText(draft.body).slice(0, 240) || "The opening text will appear here."}</span></div>
                </div>
              </> : <>
                <div className="grid gap-3 sm:grid-cols-2">{contentType ? <label>Content type<input value={contentTypes.find((item) => item.value === contentType)?.label ?? contentType} readOnly /></label> : <label>Content type<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as ContentType })}>{contentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>}<label>Category<input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} placeholder="Scholarships, graduate admissions…" /></label></div>
                <label>Title<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required minLength={3} maxLength={180} /></label>
                <div className="grid gap-3 sm:grid-cols-2"><label>URL slug<input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="leave blank to generate" /></label><label>Tags<input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="Comma-separated" /></label></div>
                <label>Short introduction<textarea value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} rows={3} maxLength={500} /></label>
                {draft.type === "article" && <label>Publication date and time<input type="datetime-local" value={draft.published_at} onChange={(event) => setDraft({ ...draft, published_at: event.target.value })} /><small className="font-normal text-brand-muted">Optional. Leave blank to set automatically when published; choose an earlier date and time to backdate this post.</small></label>}
                {fieldsByType[draft.type]?.length ? <AdminContentFields fields={fieldsByType[draft.type] ?? []} data={draft.data} articleEditor={draft.type === "article"} onChange={(key, value) => setDraft((current) => ({ ...current, data: { ...current.data, [key]: value } }))} /> : null}
                {draft.type === "resource" && <AdminResourceFields
                  value={draft.data.resource_schema ?? ""}
                  onChange={(value) => setDraft((current) => ({ ...current, data: { ...current.data, resource_schema: value } }))}
                  attachments={resourceAttachments}
                  onAttachmentsChange={setResourceAttachments}
                  files={resourceFiles}
                  onFilesChange={setResourceFiles}
                  resourceId={editingId}
                />}
                <label>Content</label><RichTextEditor value={draft.body} onChange={(body) => setDraft((current) => ({ ...current, body }))} onError={setNotice} />
              </>}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-line pt-4"><span className="text-xs text-brand-muted">{editingId ? "Preview your edits before updating this item." : "Preview before publishing to check how this appears to readers."}</span><div className="flex gap-2"><button type="button" className={buttonVariants({ variant: "outline", size: "sm" })} onClick={() => { editingContentId.current = ""; setEditingId(""); setIsEditingPublished(false); setContentPreview(false); setResourceAttachments([]); setResourceFiles([]); setDraft({ ...emptyDraft, type: contentType ?? "article" }); }}>Clear</button><button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy}>{busy ? "Saving…" : editingId || ["job", "scholarship"].includes(contentType ?? draft.type) ? "Preview before saving" : "Save draft"}</button></div></div>
              </>}
            </form>
          </div>
          {contentType === "scholarship" ? <aside className="grid content-start gap-4">
            <section className="grid gap-3 rounded-lg border border-brand-line bg-white p-5">
              <h2 className="mb-0 text-lg">Publication</h2>
              <div className="flex items-center justify-between text-sm"><span className="text-brand-muted">Status</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${draft.status === "published" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>{draft.status}</span></div>
              <label className="flex cursor-pointer items-start gap-3 rounded bg-brand-cream p-3 text-sm">
                <input className="mt-1 size-4 accent-brand-purple" type="checkbox" checked={draft.data.featured === "true"} onChange={(event) => setDraft((current) => ({ ...current, data: { ...current.data, featured: String(event.target.checked) } }))} />
                <span><strong>Feature this scholarship</strong><small className="mt-1 block font-normal text-brand-muted">Show it in the featured list. Other listings remain searchable.</small></span>
              </label>
            </section>
            <section className="grid gap-3 rounded-lg border border-brand-line bg-white p-5">
              <h2 className="mb-0 text-lg">Ready to publish?</h2>
              <ul className="grid gap-2">
                {scholarshipChecks.map(({ label, complete }) => <li className="flex items-center gap-2 text-sm" key={label}><span className={`grid size-5 place-items-center rounded-full text-xs ${complete ? "bg-emerald-100 text-emerald-800" : "bg-brand-cream text-brand-muted"}`}>{complete ? "✓" : "·"}</span><span className={complete ? "text-brand-ink" : "text-brand-muted"}>{label}</span></li>)}
              </ul>
            </section>
            <section className="grid gap-3 rounded-lg border border-brand-line bg-white p-5">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">LIVE FILTER PREVIEW</span>
              <h2 className="mb-0 text-lg">Your listing will match</h2>
              <p className="mb-0 text-sm text-brand-muted">These are the values readers will use to find this scholarship.</p>
              <dl className="grid gap-2">
                {[
                  { label: "Study level", values: selectedFieldValues(draft.data.study_level) },
                  { label: "Destination", values: selectedFieldValues(draft.data.destination) },
                  { label: "Funding", values: selectedFieldValues(draft.data.funding_type) },
                  { label: "Subjects", values: selectedFieldValues(draft.data.subject_areas, "subject_areas") },
                  { label: "Applicant countries", values: selectedFieldValues(draft.data.eligible_countries) },
                ].map(({ label, values }) => <div className="border-t border-brand-line pt-2" key={label}><dt className="text-xs text-brand-muted">{label}</dt><dd className="mb-0 mt-1 text-sm font-semibold">{values.length ? (label === "Destination" || label === "Applicant countries" ? summarizeCountrySelection(values) : values.join(", ")) : "Not selected"}</dd></div>)}
              </dl>
            </section>
            <details className="rounded-lg border border-brand-line bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-brand-purple">{sectionContents.length} existing scholarships</summary>
              <div className="mt-3 grid gap-3">
                <Link href="/dashboard/ai" className="text-sm font-semibold text-brand-purple hover:underline">Create with AI ↗</Link>
                {sectionContents.map((item) => <article className="grid gap-1 border-t border-brand-line pt-3" key={item.id}>
                  <div className="text-xs font-semibold uppercase text-brand-muted">{item.status}</div>
                  <h3 className="mb-0 text-sm font-bold">{item.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm font-semibold text-brand-purple">
                    <button className="hover:underline" onClick={() => editContent(item)}>Edit</button>
                    {item.status === "published" ? <Link className="hover:underline" href={contentHref(item.type, item.slug)} target="_blank">Preview ↗</Link> : <button className="hover:underline" onClick={() => { editContent(item); setContentPreview(true); }}>Preview ↗</button>}
                    <button className="text-red-700 hover:underline" onClick={() => void deleteContent(item.id)}>Delete</button>
                  </div>
                </article>)}
                {!sectionContents.length && <p className="mb-0 text-sm text-brand-muted">No scholarships have been added yet.</p>}
              </div>
            </details>
          </aside> : <div className="grid content-start gap-4 rounded border border-brand-line bg-white p-5"><div className="flex items-center justify-between gap-3"><div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">{contentType ? (contentTypes.find((item) => item.value === contentType)?.label ?? "Content").toUpperCase() : "CONTENT LIBRARY"}</span><h2 className="mb-0 mt-1 text-2xl">{sectionContents.length} items</h2></div><Link href="/dashboard/ai" className="text-sm font-semibold text-brand-purple hover:underline">Create with AI ↗</Link></div>{sectionContents.map((item) => <article className="grid gap-2 border-t border-brand-line pt-4" key={item.id}><div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-muted"><span className={`size-2 rounded-full ${item.status === "published" ? "bg-green-600" : item.status === "draft" ? "bg-amber-500" : "bg-slate-400"}`} />{item.status} · {item.type}</div><h3 className="mb-0 text-lg font-bold">{item.title}</h3><p className="mb-0 text-sm text-brand-muted">{item.excerpt || "No description added yet."}</p><div className="flex flex-wrap gap-3 text-sm font-semibold text-brand-purple"><button className="hover:underline" onClick={() => editContent(item)}>Edit</button>{item.status === "published" ? <Link className="hover:underline" href={contentHref(item.type, item.slug)} target="_blank">Preview ↗</Link> : <button className="hover:underline" onClick={() => { editContent(item); setContentPreview(true); }}>Preview ↗</button>}<button className="text-red-700 hover:underline" onClick={() => void deleteContent(item.id)}>Delete</button></div></article>)}{!sectionContents.length && <p className="mb-0 rounded bg-brand-blue p-4 text-sm text-brand-muted">No {contentType ? `${contentTypes.find((item) => item.value === contentType)?.label.toLowerCase()} items` : "content"} yet. Create a draft or use the AI studio to get started.</p>}</div>}
        </section> : null}
        {section === "ai" && <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(16rem,.8fr)]">
          <div className="grid content-start gap-4 rounded border border-brand-line bg-white p-5 [&_label]:grid [&_label]:gap-1.5 [&_label]:text-sm [&_label]:font-semibold [&_select]:min-h-10 [&_select]:rounded [&_select]:border [&_select]:border-brand-line [&_select]:bg-white [&_select]:px-3 [&_select]:py-2 [&_select]:font-normal [&_textarea]:rounded [&_textarea]:border [&_textarea]:border-brand-line [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:font-normal">
            <div className="flex items-start justify-between gap-3">
              <div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">AI WRITING STUDIO</span><h2 className="mb-0 mt-1 text-2xl">Start with a thought.<br /><em>Build something useful.</em></h2></div>
              <span className="grid size-10 place-items-center rounded bg-brand-sage text-xl text-brand-purple">✳</span>
            </div>
            <p className="mb-0 text-sm leading-relaxed text-brand-muted">Give the AI a topic, a reader and a useful outcome. Select private reference material when you want it to work from your own documents.</p>
            <form className="grid gap-4" onSubmit={(event) => void generate(event)}>
              <label>AI provider
                <select value={aiProvider} onChange={(event) => setAiProvider(event.target.value as AiProvider)} disabled={!settings?.configured_ai_providers.length}>
                  {aiProviders.filter((provider) => settings?.configured_ai_providers.includes(provider.value)).map((provider) =>
                    <option key={provider.value} value={provider.value}>{provider.label} · {settings?.ai_models[provider.value]}</option>)}
                </select>
                {!settings?.configured_ai_providers.length && <small className="text-xs font-normal text-brand-muted">No AI provider configured. Add a provider API key in Settings to continue. <Link className="font-semibold text-brand-purple hover:underline" href="/dashboard/settings">Open settings ↗</Link></small>}
              </label>
              <label>What are we creating?
                <select value={aiType} onChange={(event) => setAiType(event.target.value as ContentType)}>
                  {contentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </label>
              <label>Your prompt
                <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={7} minLength={2} maxLength={4000} required placeholder="e.g. Create a clear guide for African graduates checking whether a scholarship covers their living costs. Keep claims grounded in the selected documents and highlight anything that needs verification." />
              </label>
              <div className="grid gap-2 rounded border border-brand-line bg-brand-cream p-3">
                <div className="grid"><strong className="text-sm">Use reference documents</strong><span className="text-xs text-brand-muted">Optional · only selected files are shared with the AI provider</span></div>
                {files.length ? files.map((item) => <label className="flex items-start gap-2 rounded border border-brand-line bg-white p-3 text-sm" key={item.id}>
                  <input className="mt-1" type="checkbox" disabled={item.processing_status !== "ready"} checked={selectedDocuments.includes(item.id)} onChange={(event) => setSelectedDocuments((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} />
                  <span className="grid">{item.filename}<small className="text-xs font-normal text-brand-muted">{(item.size_bytes / 1024).toFixed(0)} KB · {item.processing_status === "ready" ? "indexed text" : item.processing_status === "processing" ? "indexing…" : "indexing failed"}</small></span>
                </label>) : <p>No reference files uploaded yet. <Link href="/dashboard/files">Add a document ↗</Link></p>}
              </div>
              <div className="rounded bg-brand-blue p-3 text-xs leading-relaxed text-brand-muted">The AI creates an unpublished draft. Review facts, dates and source links before publishing. Never upload sensitive personal information.</div>
              <button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy || !settings?.configured_ai_providers.includes(aiProvider)}>{busy ? "Drafting…" : "✦ Generate a draft"}</button>
            </form>
          </div>
          <aside className="grid gap-4">
            <div className="grid gap-2 rounded border border-brand-line bg-brand-blue p-5"><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">A STRONG START</span><h3 className="mb-0 text-lg">Make the audience clear.</h3><p className="mb-0 text-sm leading-relaxed text-brand-muted">Who is this for? What decision are they making? What should they be able to do next?</p></div>
            <div className="grid gap-3 rounded border border-brand-line bg-white p-5"><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">YOUR EDITORIAL FLOW</span><ol className="grid gap-2">{["Prompt with a reader in mind", "Check the facts and sources", "Polish in the content editor", "Publish when ready"].map((label, index) => <li className="flex items-center gap-3 text-sm" key={label}><b className="font-display text-sm text-brand-orange">0{index + 1}</b><span>{label}</span></li>)}</ol></div>
          </aside>
        </section>}
        {section === "settings" && <form className="grid content-start gap-4 rounded border border-brand-line bg-white p-5 [&_label]:grid [&_label]:gap-1.5 [&_label]:text-sm [&_label]:font-semibold [&_input]:min-h-10 [&_input]:rounded [&_input]:border [&_input]:border-brand-line [&_input]:px-3 [&_input]:py-2 [&_input]:font-normal" onSubmit={(event) => void saveAiModels(event)}>
          <div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">AI MODEL CATALOG</span><h2 className="mb-0 mt-1 text-2xl">Set a model for each provider.</h2></div>
          <p className="mb-0 text-sm text-brand-muted">Use the exact model ID available to your API account. Provider API keys are configured below, one provider at a time.</p>
          <div className="grid gap-3 md:grid-cols-3">
            {aiProviders.map((provider) => <label key={provider.value}>{provider.label} model ID
              <input value={settingsForm.ai_models[provider.value]} onChange={(event) => setSettingsForm((current) => ({
                ...current,
                ai_models: { ...current.ai_models, [provider.value]: event.target.value },
              }))} required minLength={2} maxLength={120} />
              <small className="text-xs font-normal text-brand-muted">{settings?.configured_ai_providers.includes(provider.value) ? "API configured" : "API key not configured"}</small>
            </label>)}
          </div>
          <button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy}>{busy ? "Saving…" : "Save AI model names"}</button>
        </form>}
        {section === "files" ? <section className="grid items-start gap-5 xl:grid-cols-2">
          <div className="grid content-start gap-4 rounded border border-brand-line bg-white p-5">
            <div className="flex items-center justify-between gap-3"><div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">REFERENCE LIBRARY</span><h2 className="mb-0 mt-1 text-2xl">Give the AI useful context.</h2></div><span className="grid size-10 place-items-center rounded bg-brand-sage text-xl text-brand-purple">↥</span></div>
            <p className="mb-0 text-sm leading-relaxed text-brand-muted">Private reference files are stored using the selected provider. Text is extracted for AI drafts. Supported: PDF, DOCX, TXT and Markdown. Maximum 10 MB each.</p>
            <form className="grid gap-3" onSubmit={(event) => void uploadFile(event)}><label className="grid cursor-pointer justify-items-center gap-2 rounded border-2 border-dashed border-brand-line bg-brand-cream p-6 text-center hover:border-brand-purple"><input className="sr-only" type="file" accept=".pdf,.docx,.txt,.md" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /><span className="grid size-10 place-items-center rounded-full bg-brand-sage text-xl text-brand-purple">↑</span><strong className="text-sm">{file ? file.name : "Choose a document to upload"}</strong><small className="text-xs text-brand-muted">{file ? `${(file.size / 1024).toFixed(0)} KB` : "Private files · 10 MB maximum"}</small></label><button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy || !file}>{busy ? "Uploading…" : "Upload reference file"}</button></form>
            <p className="mb-0 text-xs leading-relaxed text-brand-muted">Only administrators can view or use uploaded material. Select individual files for each AI draft.</p>
          </div>
          <div className="grid content-start gap-3 rounded border border-brand-line bg-white p-5"><div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">UPLOADED DOCUMENTS</span><h2 className="mb-0 mt-1 text-2xl">{files.length} files</h2></div>{files.map((item) => <article className="flex items-center gap-3 border-t border-brand-line pt-3" key={item.id}><div className="grid size-10 shrink-0 place-items-center rounded bg-brand-sage text-xs font-bold text-brand-purple">DOC</div><div className="grid min-w-0 flex-1"><strong className="truncate text-sm">{item.filename}</strong><span className="text-xs leading-relaxed text-brand-muted">{(item.size_bytes / 1024).toFixed(0)} KB · {new Date(item.created_at).toLocaleDateString()} · {item.processing_status === "ready" ? "Ready for AI" : item.processing_status === "processing" ? "Processing" : "Failed — remove and upload again"}</span></div><button className="shrink-0 text-sm font-semibold text-red-700 hover:underline" onClick={() => void deleteFile(item.id)}>Remove</button></article>)}{!files.length && <p className="mb-0 rounded bg-brand-blue p-4 text-sm text-brand-muted">Your private reference library is empty.</p>}</div>
        </section> : null}
        {section === "settings" ? <>
          <section className="grid items-start gap-4 xl:grid-cols-2 [&_label]:grid [&_label]:gap-1.5 [&_label]:text-sm [&_label]:font-semibold [&_input]:min-h-10 [&_input]:rounded [&_input]:border [&_input]:border-brand-line [&_input]:px-3 [&_input]:py-2 [&_input]:font-normal [&_select]:min-h-10 [&_select]:rounded [&_select]:border [&_select]:border-brand-line [&_select]:bg-white [&_select]:px-3 [&_select]:py-2 [&_select]:font-normal">
            <form className="grid content-start gap-3 rounded border border-brand-line bg-white p-5" onSubmit={(event) => void saveGtmContainerId(event)}>
              <div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">GOOGLE TAG MANAGER</span><h2 className="mb-0 mt-1 text-2xl">Measure site activity.</h2><span className="text-xs font-semibold text-brand-purple">{settings?.gtm_container_id ? "● Connected" : "○ Not configured"}</span></div>
              <p className="mb-0 text-sm text-brand-muted">Enter your GTM container ID, not the full script snippet. When configured, the container loads for every visitor on every page.</p>
              <label>Container ID<input value={settingsForm.gtm_container_id} onChange={(event) => setSettingsForm((current) => ({ ...current, gtm_container_id: event.target.value }))} placeholder="GTM-XXXXXXX" pattern="GTM-[A-Za-z0-9]+" /></label>
              <small className="text-xs text-brand-muted">Leave blank and save to disable Google Tag Manager.</small>
              <button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy}>{busy ? "Saving…" : "Save Google Tag Manager"}</button>
            </form>
            <form className="grid content-start gap-3 rounded border border-brand-line bg-white p-5" onSubmit={(event) => void saveSettings(event)}>
              <div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">AI PROVIDER</span><h2 className="mb-0 mt-1 text-2xl">Choose your writing assistant.</h2><span className="text-xs font-semibold text-brand-purple">{settings?.configured_ai_providers.length ? "● Connected" : "○ Not connected"}</span></div>
              <p className="mb-0 text-sm text-brand-muted">Bring your own provider key. Keys are encrypted with AES-256-GCM on the server and never shown again after saving.</p>
              <label>AI provider<select value={settingsForm.ai_provider} onChange={(event) => setSettingsForm({ ...settingsForm, ai_provider: event.target.value as Settings["ai_provider"] })}><option value="openai">OpenAI</option><option value="anthropic">Anthropic</option><option value="google">Google AI Studio</option></select></label>
              <label>Model name<input value={settingsForm.ai_model} onChange={(event) => setSettingsForm({ ...settingsForm, ai_model: event.target.value })} required /></label>
              <label>API key<input type="password" autoComplete="new-password" value={settingsForm.ai_api_key} onChange={(event) => setSettingsForm({ ...settingsForm, ai_api_key: event.target.value })} placeholder={settings?.configured_ai_providers.includes(settingsForm.ai_provider) ? "Key saved · enter a new key to replace" : "Paste provider API key"} /></label>
              <button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy}>Save AI settings</button>
            </form>
            <form className="grid content-start gap-3 rounded border border-brand-line bg-white p-5" onSubmit={(event) => void saveSettings(event)}>
              <div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">FILE STORAGE</span><h2 className="mb-0 mt-1 text-2xl">Your files, your choice.</h2><span className="text-xs font-semibold text-brand-purple">{settings?.cloudinary_configured ? "● Cloudinary ready" : "○ Configure credentials"}</span></div>
              <p className="mb-0 text-sm text-brand-muted">Select where private source files are stored. Supabase uses your configured private bucket. Cloudinary assets use authenticated access.</p>
              <label>Storage provider<select value={settingsForm.storage_provider} onChange={(event) => setSettingsForm({ ...settingsForm, storage_provider: event.target.value as Settings["storage_provider"] })}><option value="supabase">Supabase Storage</option><option value="cloudinary">Cloudinary</option></select></label>
              {settingsForm.storage_provider === "cloudinary" && <><label>Cloudinary cloud name<input value={settingsForm.cloudinary_cloud_name} onChange={(event) => setSettingsForm({ ...settingsForm, cloudinary_cloud_name: event.target.value })} /></label><label>Cloudinary API key<input value={settingsForm.cloudinary_api_key} onChange={(event) => setSettingsForm({ ...settingsForm, cloudinary_api_key: event.target.value })} /></label><label>Cloudinary API secret<input type="password" autoComplete="new-password" value={settingsForm.cloudinary_api_secret} onChange={(event) => setSettingsForm({ ...settingsForm, cloudinary_api_secret: event.target.value })} /></label></>}
              <button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy}>Save storage settings</button>
            </form>
            <div className="grid content-start gap-3 rounded border border-brand-line bg-white p-5">
              <div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">EMAIL REMINDERS</span><h2 className="mb-0 mt-1 text-2xl">Keep people in the loop.</h2><span className="text-xs font-semibold text-brand-purple">{settings?.email_configured ? "● Configured" : "○ Needs setup"}</span></div>
              <p className="mb-0 text-sm leading-relaxed text-brand-muted">SMTP settings are provided as environment variables. Verified users who save expiring listings can receive one reminder up to three days before expiry.</p>
              <Link className="text-sm font-semibold text-brand-purple hover:underline" href="/privacy">Review privacy information ↗</Link>
            </div>
          </section>
          {pricingForm ? <form className="grid gap-5 rounded border border-brand-line bg-white p-5 [&_label]:grid [&_label]:gap-1.5 [&_label]:text-sm [&_label]:font-semibold [&_input]:min-h-10 [&_input]:rounded [&_input]:border [&_input]:border-brand-line [&_input]:px-3 [&_input]:py-2 [&_input]:font-normal" onSubmit={(event) => void saveServicePricing(event)}>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">SERVICE PRICING</span>
              <h2 className="mb-1 mt-1 text-2xl">Update the prices shown on the website.</h2>
              <p className="mb-0 text-sm text-brand-muted">Amounts are in Nigerian Naira. Saving publishes the new amounts to the public services page.</p>
            </div>
            <section className="grid gap-4 border-t border-brand-line pt-4">
              <h3 className="mb-0 text-lg">Career services</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {editableCareerBands.map(({ key, label }) => <div className="grid gap-2 rounded border border-brand-line p-3 sm:grid-cols-2" key={key}>
                  <strong className="sm:col-span-2">{label}</strong>
                  <PriceSetting label="Individual service" value={pricingForm.career.bands[key].individual} onChange={(value) => updateCareerPrice(key, "individual", value)} />
                  <PriceSetting label="Three-service bundle" value={pricingForm.career.bands[key].bundle} onChange={(value) => updateCareerPrice(key, "bundle", value)} />
                </div>)}
              </div>
              <div className="max-w-sm"><PriceSetting label="Interview preparation (two sessions)" value={pricingForm.career.interview} onChange={(value) => updateServicePricing((pricing) => ({ ...pricing, career: { ...pricing.career, interview: value } }))} /></div>
            </section>
            <section className="grid gap-4 border-t border-brand-line pt-4">
              <h3 className="mb-0 text-lg">Admission essay packages (per school)</h3>
              <div className="grid gap-3 md:grid-cols-3">
                {pricingPackageFields.map(({ key, label }) => <PriceSetting key={key} label={label} value={pricingForm.admissions[key]} onChange={(value) => updateAdmissionPrice(key, value)} />)}
              </div>
            </section>
            <section className="grid gap-4 border-t border-brand-line pt-4">
              <h3 className="mb-0 text-lg">Scholarship essay packages</h3>
              {editableScholarshipBands.map(({ key, label }) => <div className="grid gap-3 rounded border border-brand-line p-3 sm:grid-cols-3" key={key}>
                <strong className="sm:col-span-3">{label}</strong>
                {scholarshipPackageFields.map(({ index, label: packageLabel }) => <PriceSetting key={packageLabel} label={packageLabel} value={pricingForm.scholarships[key][index]} onChange={(value) => updateScholarshipPrice(key, index, value)} />)}
              </div>)}
              <p className="mb-0 text-sm text-brand-muted">Seven or more essays remain custom-quoted.</p>
            </section>
            <section className="grid gap-4 border-t border-brand-line pt-4">
              <h3 className="mb-0 text-lg">MBA packages and volume discounts</h3>
              <div className="grid gap-3 md:grid-cols-3">
                <PriceSetting label="Application Essentials (per school)" value={pricingForm.mba.essentials} onChange={(value) => updateMbaPrice("essentials", value)} />
                <PriceSetting label="Scholarship Mastery (per school)" value={pricingForm.mba.mastery} onChange={(value) => updateMbaPrice("mastery", value)} />
                <PriceSetting label="Full-Ride Pro (per school)" value={pricingForm.mba.fullRide} onChange={(value) => updateMbaPrice("fullRide", value)} />
                <PriceSetting label="Discount from five schools (%)" value={pricingForm.mba.discountAtFive} step={1} onChange={(value) => updateMbaPrice("discountAtFive", value)} />
                <PriceSetting label="Discount from ten schools (%)" value={pricingForm.mba.discountAtTen} step={1} onChange={(value) => updateMbaPrice("discountAtTen", value)} />
              </div>
            </section>
            <button className={`${buttonVariants({ variant: "brand", size: "sm" })} justify-self-start`} disabled={busy}>{busy ? "Saving…" : "Save service pricing"}</button>
          </form> : <p className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800" role="alert">Service pricing is missing from the database. Apply the backend pricing seed migration before editing prices.</p>}
          <form className="grid content-start gap-3 rounded border border-brand-line bg-white p-5 [&_label]:grid [&_label]:gap-1.5 [&_label]:text-sm [&_label]:font-semibold [&_textarea]:rounded [&_textarea]:border [&_textarea]:border-brand-line [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:font-normal" onSubmit={(event) => void saveCareerAuditPrompt(event)}>
            <div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">CAREER AUDIT INSTRUCTIONS</span><h2 className="mb-0 mt-1 text-2xl">Set the guidance for AI feedback.</h2></div>
            <p className="mb-0 text-sm leading-relaxed text-brand-muted">This additional instruction is combined with the Career Audit’s safety and accuracy rules, then used with the applicant’s answers. Keep applicant answers as the source of their personal facts.</p>
            <label>Administrator pre-prompt
              <textarea value={settingsForm.career_audit_prompt} onChange={(event) => setSettingsForm((current) => ({ ...current, career_audit_prompt: event.target.value }))} rows={8} maxLength={careerAuditPromptCharacterLimit} placeholder="Add guidance on how the AI should assess preparation and shape practical feedback…" />
              <small className="text-xs font-normal text-brand-muted">{careerAuditPromptWords.toLocaleString()}/{careerAuditPromptWordLimit.toLocaleString()} words · {settingsForm.career_audit_prompt.length.toLocaleString()}/{careerAuditPromptCharacterLimit.toLocaleString()} characters</small>
            </label>
            <button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy || careerAuditPromptWords > careerAuditPromptWordLimit}>{busy ? "Saving…" : "Save Career Audit prompt"}</button>
          </form>
        </> : null}
        {section === "" ? <section className="grid gap-5"><div className="flex items-center justify-between gap-4 rounded border border-brand-line bg-brand-purple p-6 text-white max-sm:flex-col max-sm:items-start"><div><span className="text-xs font-bold uppercase tracking-widest text-brand-footer-hover">WEDNESDAY · YOUR EDITORIAL OVERVIEW</span><h2 className="mb-1 mt-2 text-3xl text-white">Let’s make something <em>worth keeping.</em></h2><p className="mb-0 text-sm text-brand-footer-muted">Shape the practical next steps your readers are looking for.</p></div><Link href="/dashboard/ai" className={buttonVariants({ variant: "light", size: "sm" })}>✦ Start an AI draft</Link></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["All content", overview?.contentCount ?? 0, "Across every content type"], ["Published", overview?.publishedCount ?? 0, "Live on your website"], ["Reference files", overview?.documentCount ?? 0, "Available to AI drafts"], ["Members", overview?.userCount ?? 0, "Private workspaces"]].map(([label, count, detail]) => <div className="rounded border border-brand-line bg-white p-4" key={label}><span className="text-sm text-brand-muted">{label}</span><strong className="my-2 block font-display text-3xl">{count}</strong><small className="text-xs text-brand-muted">{detail}</small></div>)}</div><div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(16rem,.8fr)]"><div className="grid content-start gap-3 rounded border border-brand-line bg-white p-5"><div className="flex items-center justify-between gap-3"><div><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">RECENT CONTENT</span><h2 className="mb-0 mt-1 text-2xl">In the studio</h2></div><Link href="/dashboard/content" className="text-sm font-semibold text-brand-purple hover:underline">Open library ↗</Link></div>{contents.slice(0, 5).map((item) => <article className="grid gap-1 border-t border-brand-line pt-3" key={item.id}><div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-muted"><span className={`size-2 rounded-full ${item.status === "published" ? "bg-green-600" : item.status === "draft" ? "bg-amber-500" : "bg-slate-400"}`} />{item.status} · {item.type}</div><h3 className="mb-0 text-base font-bold">{item.title}</h3></article>)}{!contents.length && <p className="mb-0 text-sm text-brand-muted">Your first useful story can start here.</p>}</div><div className="grid gap-4"><div className="grid gap-2 rounded border border-brand-line bg-white p-5"><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">QUICK START</span><Link className="text-sm font-semibold text-brand-purple hover:underline" href="/dashboard/content">＋ Write manually</Link><Link className="text-sm font-semibold text-brand-purple hover:underline" href="/dashboard/ai">✦ Prompt the AI</Link><Link className="text-sm font-semibold text-brand-purple hover:underline" href="/dashboard/files">↥ Upload a source file</Link></div><div className="grid gap-2 rounded border border-brand-line bg-brand-sage p-5"><span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">A NOTE ON TRUST</span><p className="mb-0 text-sm text-brand-muted">AI creates drafts, not facts. Review every detail before you publish.</p><Link className="text-sm font-semibold text-brand-purple hover:underline" href="/privacy">Privacy details ↗</Link></div></div></div></section> : null}
      </div>
    </main>
  </div>;
}
