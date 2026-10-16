"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { ApiError, apiRequest, apiUpload, apiUrl, type SessionUser } from "@/lib/api";
import { contentHref, type ContentType, type SiteContent } from "@/lib/site-data";
import RichTextEditor from "@/components/rich-text-editor";
import ContentPreview from "@/components/content-preview";
import AdminContentFields from "@/components/admin-content-fields";
import AdminTrash from "@/components/admin-trash";

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
interface Settings {
  ai_provider: AiProvider;
  ai_models: Record<AiProvider, string>;
  career_audit_prompt: string;
  storage_provider: "supabase" | "cloudinary";
  configured_ai_providers: AiProvider[];
  cloudinary_configured: boolean;
  supabase_storage_bucket: string;
  email_configured: boolean;
}

const contentTypes: { value: ContentType; label: string }[] = [
  { value: "job", label: "Job" },
  { value: "scholarship", label: "Scholarship" },
  { value: "article", label: "Blog article" },
  { value: "resource", label: "Resource" },
  { value: "service", label: "Service" },
  { value: "faq", label: "FAQ" },
  { value: "testimonial", label: "Client feedback" },
];
const aiProviders: { value: AiProvider; label: string; defaultModel: string }[] = [
  { value: "openai", label: "OpenAI", defaultModel: "gpt-4.1-mini" },
  { value: "anthropic", label: "Anthropic", defaultModel: "claude-sonnet-4-20250514" },
  { value: "google", label: "Google Gemini", defaultModel: "gemini-2.5-flash" },
];
const contentTypeBySection: Partial<Record<string, ContentType>> = {
  jobs: "job",
  scholarships: "scholarship",
  blog: "article",
  resources: "resource",
  services: "service",
  faqs: "faq",
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
    { key: "provider", label: "Award provider" },
    { key: "study_level", label: "Study level" },
    { key: "destination", label: "Destination" },
    { key: "coverage_primary_title", label: "Funding card 1 heading" },
    { key: "coverage_primary_text", label: "Funding card 1 details" },
    { key: "coverage_secondary_title", label: "Funding card 2 heading" },
    { key: "coverage_secondary_text", label: "Funding card 2 details" },
    { key: "award_coverage", label: "Funding coverage summary (fallback)" },
    { key: "deadline", label: "Application deadline" },
    { key: "funding_type", label: "Funding type" },
    { key: "award_badge", label: "Award badge" },
    { key: "application_status", label: "Application status" },
    { key: "cycle_label", label: "Cycle label" },
    { key: "source_checked_at", label: "Source checked date" },
    { key: "eligibility_status", label: "Eligibility status badge" },
    { key: "subject_areas", label: "Subject areas" },
    { key: "nationality_residence", label: "Nationality and residence" },
    { key: "eligibility_points", label: "Eligibility checks (one per line)" },
    { key: "eligibility_note", label: "Eligibility note" },
    { key: "provider_record", label: "Provider record summary" },
    { key: "featured", label: "Feature on public listing" },
  ],
  article: [
    { key: "author", label: "Author" },
    { key: "reading_minutes", label: "Reading time (minutes)" },
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
const emptyDraft = { type: "article" as ContentType, title: "", slug: "", excerpt: "", body: "", category: "", source_url: "", expires_at: "", status: "draft" as "draft" | "published", tags: "", data: {} as Record<string, string> };

function serializedContentData(data: Record<string, string>): Record<string, string | boolean> {
  return Object.fromEntries(Object.entries(data)
    .filter(([, value]) => value.trim() !== "")
    .map(([key, value]) => [
      key,
      ["featured", "application_page_available"].includes(key) ? value === "true" : value,
    ]));
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
  return <main className="admin-login-shell"><div className="admin-login-aside"><Link href="/" className="brand"><span className="brand-mark">c</span> careergrill<span className="brand-dot">.</span></Link><div><span className="admin-label">CAREERGRILL / CONTENT STUDIO</span><h1>Good work deserves<br /><em>good editing.</em></h1><p>A calm workspace for planning, writing and publishing practical career guidance.</p></div><span className="muted-copy">Private administrator access · JWT session</span></div><form className="admin-login-card" onSubmit={(event) => void submit(event)}><span className="admin-label">ADMINISTRATOR ACCESS</span><h2>{mode === "login" ? "Welcome back." : "Create the first admin."}</h2><p>{mode === "login" ? "Sign in to manage Careergrill content." : "One-time setup. The bootstrap secret is configured on the server."}</p>{initialError && <p className="inline-notice" role="alert">{initialError}</p>}{mode === "bootstrap" && <><label>Your name<input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} /></label><label>One-time setup secret<input value={bootstrapToken} onChange={(event) => setBootstrapToken(event.target.value)} required autoComplete="off" /></label></>}{mode === "login" && <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" /></label>}{mode === "bootstrap" && <label>Admin email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>}<label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={mode === "bootstrap" ? 12 : 1} maxLength={128} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label><button className="button button-dark" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create administrator"}</button>{notice && <p className="inline-notice" role="alert">{notice}</p>}<button type="button" className="admin-switch" onClick={() => { setMode(mode === "login" ? "bootstrap" : "login"); setNotice(""); }}>{mode === "login" ? "First time? Set up the first admin" : "Already set up? Sign in"}</button><Link className="text-link" href="/">← Return to website</Link></form></main>;
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
  const [settings, setSettings] = useState<Settings | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState("");
  const editingContentId = useRef("");
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
    storage_provider: "supabase" as Settings["storage_provider"],
    ai_api_key: "",
    cloudinary_cloud_name: "",
    cloudinary_api_key: "",
    cloudinary_api_secret: "",
  });

  useEffect(() => {
    setContentPreview(false);
    if (contentType) {
      if (preserveDraftOnNavigation.current) {
        preserveDraftOnNavigation.current = false;
        setAiDraftReady(false);
      } else {
        setDraft({ ...emptyDraft, type: contentType });
        editingContentId.current = "";
        setEditingId("");
        setIsEditingPublished(false);
      }
    }
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
    setEditingId(item.id);
    setIsEditingPublished(item.status === "published");
    setDraft({
      type: item.type,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      body: item.body,
      category: item.category,
      source_url: item.source_url ?? "",
      expires_at: item.expires_at ? item.expires_at.slice(0, 10) : "",
      status: item.status === "published" ? "published" : "draft",
      tags: item.tags.join(", "),
      data: Object.fromEntries(Object.entries(item.data).map(([key, value]) => [key, String(value)])),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveContent(status = draft.status) {
    if (draft.title.trim().length < 3) {
      setNotice("Add a title of at least three characters before saving.");
      setContentPreview(false);
      return;
    }
    setBusy(true);
    setNotice("");
    const contentId = editingContentId.current;
    const body = {
      ...draft,
      body: persistedContentBody(draft.body),
      type: contentType ?? draft.type,
      status,
      tags: draft.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      expires_at: draft.expires_at ? new Date(`${draft.expires_at}T23:59:59.000Z`).toISOString() : null,
      source_url: draft.source_url || null,
      data: serializedContentData(draft.data),
    };
    try {
      await apiRequest(contentId ? `/admin/content/${contentId}` : "/admin/content", {
        method: contentId ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });
      setNotice(status === "published" ? "Content published." : "Draft saved.");
      editingContentId.current = "";
      setEditingId("");
      setIsEditingPublished(false);
      setDraft({ ...emptyDraft, type: contentType ?? "article" });
      setContentPreview(false);
      await loadDashboard();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save this content.");
    } finally {
      setBusy(false);
    }
  }

  function submitContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isEditingPublished) {
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
      expires_at: draft.expires_at ? new Date(`${draft.expires_at}T23:59:59.000Z`).toISOString() : null,
      source_url: draft.source_url || null,
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
      ...Object.fromEntries(Object.entries(settingsForm).filter(([, value]) => value !== "")),
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
  }

  if (access === "checking") {
    return <div className="admin-loading"><span className="admin-loader" /><p>Connecting to the Careergrill content studio…</p></div>;
  }
  if (access === "signed-out") return <AdminLogin onAuthenticated={() => void loadDashboard()} initialError={connectionError} />;
  if (access === "denied") {
    return <main className="admin-login-shell">
      <div className="admin-login-aside"><Link href="/" className="brand"><span className="brand-mark">c</span> careergrill<span className="brand-dot">.</span></Link><div><span className="admin-label">CAREERGRILL / CONTENT STUDIO</span><h1>Private access<br /><em>by role.</em></h1><p>The dashboard is available only to accounts assigned the administrator role.</p></div><span className="muted-copy">Administrator access · JWT session</span></div>
      <section className="admin-login-card"><span className="admin-label">ACCESS DENIED</span><h2>Administrator role required.</h2><p>{sessionUser?.email} is signed in as <strong>{sessionUser?.role}</strong>. Ask an administrator to grant the required role.</p>{notice && <p className="inline-notice" role="alert">{notice}</p>}<button className="button button-dark" type="button" onClick={() => void logout()}>Sign out</button><Link className="text-link" href="/">← Return to website</Link></section>
    </main>;
  }
  if (access === "error") {
    return <main className="admin-loading"><p role="alert">{connectionError}</p><button className="button button-dark" type="button" onClick={() => void loadDashboard()}>Try again</button></main>;
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
    ai: "AI writing studio",
    files: "Reference library",
    settings: "Studio settings",
  };
  const title = sectionTitles[section] ?? "Your studio";
  const sectionContents = contentType ? contents.filter((item) => item.type === contentType) : contents;

  return <div className="admin-shell min-h-screen bg-brand-cream font-sans">
    <aside className="admin-sidebar"><div className="admin-brand"><Link href="/" className="brand"><span className="brand-mark">c</span> careergrill<span className="brand-dot">.</span></Link><span className="admin-label">CONTENT STUDIO</span></div><nav aria-label="Dashboard navigation">{navItems.map(([label, href, key]) => <Link key={href} href={href} className={section === key ? "active" : ""}><span className="nav-dot" />{label}</Link>)}</nav><div className="sidebar-bottom"><Link href="/">↗ View website</Link><button onClick={() => void logout()}>↗ Sign out</button><small>Careergrill · Private dashboard</small></div></aside>
    <main className="admin-main">
      <header className="admin-topbar"><div><span className="admin-label">CONTENT STUDIO / {section || "OVERVIEW"}</span><h1>{title}</h1></div><span className="admin-avatar" title={sessionUser?.email}>{sessionUser?.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "AD"}</span></header>
      <div className="admin-content">
        {["ai", "files"].includes(section) && files.some((item) => item.processing_status !== "ready") && <div className="admin-notice" role="status">
          {files.filter((item) => item.processing_status === "processing").map((item) => `${item.filename}: indexing in progress.`).join(" ")}
          {files.filter((item) => item.processing_status === "failed").map((item) => `${item.filename}: indexing failed; remove it and upload it again.`).join(" ")}
        </div>}
        {section === "settings" && <p className="muted-copy">
          Cloudinary credentials come from the Cloudinary Console dashboard: cloud name, API key and API secret. Enter all three together, save, then select Cloudinary. Cloudinary uses folders, not buckets; Supabase uses the private bucket <strong>{settings?.supabase_storage_bucket}</strong>.
        </p>}
        {section === "files" && uploadProgress !== null && <div className="admin-card" role="status">
          <p>{uploadProgress === 100 ? "Upload received; processing and storing document…" : `Uploading document… ${uploadProgress}%`}</p>
          <progress aria-label="Document upload progress" max={100} value={uploadProgress} />
        </div>}
        {section === "ai" && aiDraftReady && draft.type === aiType && <section className="admin-card ai-generated-draft">
          <div className="admin-card-heading"><div><span className="admin-label">AI CONTENT · REVIEW BEFORE PUBLISHING</span><h2>Preview it as a reader.</h2></div><span className="admin-card-icon">✦</span></div>
          <ContentPreview type={aiType} title={draft.title} excerpt={draft.excerpt} body={draft.body} category={draft.category} data={draft.data} sourceUrl={draft.source_url} />
          <div className="editor-actions ai-preview-actions">
            <button className="button button-outline" type="button" disabled={busy} onClick={() => setAiDraftReady(false)}>Discard</button>
            <div>
              <button className="button button-outline" type="button" disabled={busy} onClick={editAIDraft}>Edit details</button>
              <button className="button button-outline" type="button" disabled={busy} onClick={() => void saveAIDraft("draft")}>{busy ? "Saving…" : "Save as draft"}</button>
              <button className="button button-dark" type="button" disabled={busy} onClick={() => void saveAIDraft("published")}>{busy ? "Publishing…" : "Approve & publish"}</button>
            </div>
          </div>
        </section>}
        {section === "trash" && <AdminTrash items={trashedContents} onRestore={restoreContent} />}
        {notice && <div className="admin-notice" role="status">{notice}</div>}
        {connectionError && <div className="admin-notice error" role="alert">{connectionError}</div>}
        {isContentSection ? <section className="admin-grid content-editor-grid">
          <div>
            <form className="admin-card admin-editor" onSubmit={submitContent}>
              <div className="admin-card-heading"><div><span className="admin-label">{editingId ? "EDIT CONTENT" : "MANUAL EDITOR"}</span><h2>{contentPreview ? "Reader preview." : editingId ? "Refine your draft." : "Write for the reader."}</h2></div><button type="button" className={`admin-card-icon admin-preview-toggle${contentPreview ? " active" : ""}`} onClick={() => setContentPreview((current) => !current)}>{contentPreview ? "✎ Edit" : "Preview ↗"}</button></div>
              {contentPreview ? <>
                <ContentPreview type={contentType ?? draft.type} title={draft.title} excerpt={draft.excerpt} body={draft.body} category={draft.category} data={draft.data} sourceUrl={draft.source_url} />
                <div className="editor-actions ai-preview-actions">
                  <button className="button button-outline" type="button" onClick={() => setContentPreview(false)}>Back to editor</button>
                  <div>
                    {!isEditingPublished && <button className="button button-outline" type="button" disabled={busy} onClick={() => void saveContent("draft")}>{busy ? "Saving…" : "Save as draft"}</button>}
                    <button className="button button-dark" type="button" disabled={busy} onClick={() => void saveContent("published")}>{busy ? "Publishing…" : "Approve & publish"}</button>
                  </div>
                </div>
              </> : <>
              <div className="admin-form-grid">{contentType ? <label>Content type<input value={contentTypes.find((item) => item.value === contentType)?.label ?? contentType} readOnly /></label> : <label>Content type<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as ContentType })}>{contentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></label>}<label>Category<input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} placeholder="Scholarships, graduate admissions…" /></label></div>
              <label>Title<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required minLength={3} maxLength={180} /></label>
              <div className="admin-form-grid"><label>URL slug<input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} placeholder="leave blank to generate" /></label><label>Tags<input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} placeholder="Comma-separated" /></label></div>
              <label>Short introduction<textarea value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} rows={3} maxLength={500} /></label>
              {fieldsByType[draft.type]?.length ? <AdminContentFields fields={fieldsByType[draft.type] ?? []} data={draft.data} onChange={(key, value) => setDraft((current) => ({ ...current, data: { ...current.data, [key]: value } }))} /> : null}
              <label>Content</label><RichTextEditor value={draft.body} onChange={(body) => setDraft((current) => ({ ...current, body }))} onError={setNotice} />
              <div className="admin-form-grid"><label>Official source URL<input type="url" value={draft.source_url} onChange={(event) => setDraft({ ...draft, source_url: event.target.value })} placeholder="https://" /></label><label>Expiry date<input type="date" value={draft.expires_at} onChange={(event) => setDraft({ ...draft, expires_at: event.target.value })} /></label></div>
              <div className="editor-actions"><span className="muted-copy">{editingId ? "Preview your edits before updating this item." : "Preview before publishing to check how this appears to readers."}</span><div><button type="button" className="button button-outline" onClick={() => { editingContentId.current = ""; setEditingId(""); setIsEditingPublished(false); setContentPreview(false); setDraft({ ...emptyDraft, type: contentType ?? "article" }); }}>Clear</button><button className="button button-dark" disabled={busy}>{busy ? "Saving…" : editingId ? "Preview changes" : "Save draft"}</button></div></div>
              </>}
            </form>
          </div>
          <div className="admin-card content-list-card"><div className="admin-card-heading"><div><span className="admin-label">{contentType ? (contentTypes.find((item) => item.value === contentType)?.label ?? "Content").toUpperCase() : "CONTENT LIBRARY"}</span><h2>{sectionContents.length} items</h2></div><Link href="/dashboard/ai" className="admin-inline-link">Create with AI ↗</Link></div>{sectionContents.map((item) => <article className="cms-item" key={item.id}><div><span className={`status-dot status-${item.status}`} />{item.status} · {item.type}</div><h3>{item.title}</h3><p>{item.excerpt || "No description added yet."}</p><div className="cms-item-actions"><button onClick={() => editContent(item)}>Edit</button>{item.status === "published" ? <Link href={contentHref(item.type, item.slug)} target="_blank">Preview ↗</Link> : <button onClick={() => { editContent(item); setContentPreview(true); }}>Preview ↗</button>}<button className="danger-text" onClick={() => void deleteContent(item.id)}>Delete</button></div></article>)}{!sectionContents.length && <p className="empty-note">No {contentType ? `${contentTypes.find((item) => item.value === contentType)?.label.toLowerCase()} items` : "content"} yet. Create a draft or use the AI studio to get started.</p>}</div>
        </section> : null}
        {section === "ai" && <section className="admin-grid ai-layout">
          <div className="admin-card ai-prompt-card">
            <div className="admin-card-heading">
              <div><span className="admin-label">AI WRITING STUDIO</span><h2>Start with a thought.<br /><em>Build something useful.</em></h2></div>
              <span className="ai-spark">✳</span>
            </div>
            <p>Give the AI a topic, a reader and a useful outcome. Select private reference material when you want it to work from your own documents.</p>
            <form onSubmit={(event) => void generate(event)}>
              <label>AI provider
                <select value={aiProvider} onChange={(event) => setAiProvider(event.target.value as AiProvider)} disabled={!settings?.configured_ai_providers.length}>
                  {aiProviders.filter((provider) => settings?.configured_ai_providers.includes(provider.value)).map((provider) =>
                    <option key={provider.value} value={provider.value}>{provider.label} · {settings?.ai_models[provider.value]}</option>)}
                </select>
                {!settings?.configured_ai_providers.length && <small>No AI provider configured. Add a provider API key in Settings to continue. <Link href="/dashboard/settings">Open settings ↗</Link></small>}
              </label>
              <label>What are we creating?
                <select value={aiType} onChange={(event) => setAiType(event.target.value as ContentType)}>
                  {contentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>
              </label>
              <label>Your prompt
                <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={7} minLength={2} maxLength={4000} required placeholder="e.g. Create a clear guide for African graduates checking whether a scholarship covers their living costs. Keep claims grounded in the selected documents and highlight anything that needs verification." />
              </label>
              <div className="document-picker">
                <div><strong>Use reference documents</strong><span>Optional · only selected files are shared with the AI provider</span></div>
                {files.length ? files.map((item) => <label className="document-option" key={item.id}>
                  <input type="checkbox" disabled={item.processing_status !== "ready"} checked={selectedDocuments.includes(item.id)} onChange={(event) => setSelectedDocuments((current) => event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id))} />
                  <span>{item.filename}<small>{(item.size_bytes / 1024).toFixed(0)} KB · {item.processing_status === "ready" ? "indexed text" : item.processing_status === "processing" ? "indexing…" : "indexing failed"}</small></span>
                </label>) : <p>No reference files uploaded yet. <Link href="/dashboard/files">Add a document ↗</Link></p>}
              </div>
              <div className="ai-consent">The AI creates an unpublished draft. Review facts, dates and source links before publishing. Never upload sensitive personal information.</div>
              <button className="button button-dark" disabled={busy || !settings?.configured_ai_providers.includes(aiProvider)}>{busy ? "Drafting…" : "✦ Generate a draft"}</button>
            </form>
          </div>
          <aside className="ai-side-stack">
            <div className="admin-card ai-tip-card"><span className="admin-label">A STRONG START</span><h3>Make the audience clear.</h3><p>Who is this for? What decision are they making? What should they be able to do next?</p></div>
            <div className="admin-card"><span className="admin-label">YOUR EDITORIAL FLOW</span><ol className="editorial-steps"><li><b>01</b><span>Prompt with a reader in mind</span></li><li><b>02</b><span>Check the facts and sources</span></li><li><b>03</b><span>Polish in the content editor</span></li><li><b>04</b><span>Publish when ready</span></li></ol></div>
          </aside>
        </section>}
        {section === "settings" && <form className="admin-card settings-card" onSubmit={(event) => void saveAiModels(event)}>
          <div className="admin-card-heading"><div><span className="admin-label">AI MODEL CATALOG</span><h2>Set a model for each provider.</h2></div></div>
          <p>Use the exact model ID available to your API account. Provider API keys are configured below, one provider at a time.</p>
          <div className="admin-form-grid">
            {aiProviders.map((provider) => <label key={provider.value}>{provider.label} model ID
              <input value={settingsForm.ai_models[provider.value]} onChange={(event) => setSettingsForm((current) => ({
                ...current,
                ai_models: { ...current.ai_models, [provider.value]: event.target.value },
              }))} required minLength={2} maxLength={120} />
              <small>{settings?.configured_ai_providers.includes(provider.value) ? "API configured" : "API key not configured"}</small>
            </label>)}
          </div>
          <button className="button button-dark" disabled={busy}>{busy ? "Saving…" : "Save AI model names"}</button>
        </form>}
        {section === "files" ? <section className="admin-grid files-layout"><div className="admin-card"><div className="admin-card-heading"><div><span className="admin-label">REFERENCE LIBRARY</span><h2>Give the AI useful context.</h2></div><span className="admin-card-icon">↥</span></div><p>Private reference files are stored using the selected provider. Text is extracted for AI drafts. Supported: PDF, DOCX, TXT and Markdown. Maximum 10 MB each.</p><form className="upload-panel" onSubmit={(event) => void uploadFile(event)}><label className="file-drop"><input type="file" accept=".pdf,.docx,.txt,.md" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /><span className="upload-symbol">↑</span><strong>{file ? file.name : "Choose a document to upload"}</strong><small>{file ? `${(file.size / 1024).toFixed(0)} KB` : "Private files · 10 MB maximum"}</small></label><button className="button button-dark" disabled={busy || !file}>{busy ? "Uploading…" : "Upload reference file"}</button></form><p className="muted-copy">Only administrators can view or use uploaded material. Select individual files for each AI draft.</p></div><div className="admin-card"><div className="admin-card-heading"><div><span className="admin-label">UPLOADED DOCUMENTS</span><h2>{files.length} files</h2></div></div>{files.map((item) => <article className="file-row" key={item.id}><div className="file-icon">DOC</div><div className="file-info"><strong>{item.filename}</strong><span>{(item.size_bytes / 1024).toFixed(0)} KB · {new Date(item.created_at).toLocaleDateString()} · {item.processing_status === "ready" ? "Ready for AI" : item.processing_status === "processing" ? "Processing" : "Failed — remove and upload again"}</span></div><button className="danger-text" onClick={() => void deleteFile(item.id)}>Remove</button></article>)}{!files.length && <p className="empty-note">Your private reference library is empty.</p>}</div></section> : null}
        {section === "settings" ? <>
          <section className="admin-grid settings-layout">
            <form className="admin-card settings-card" onSubmit={(event) => void saveSettings(event)}>
              <div className="admin-card-heading"><div><span className="admin-label">AI PROVIDER</span><h2>Choose your writing assistant.</h2></div><span className="connection-state">{settings?.configured_ai_providers.length ? "● Connected" : "○ Not connected"}</span></div>
              <p>Bring your own provider key. Keys are encrypted with AES-256-GCM on the server and never shown again after saving.</p>
              <label>AI provider<select value={settingsForm.ai_provider} onChange={(event) => setSettingsForm({ ...settingsForm, ai_provider: event.target.value as Settings["ai_provider"] })}><option value="openai">OpenAI</option><option value="anthropic">Anthropic</option><option value="google">Google AI Studio</option></select></label>
              <label>Model name<input value={settingsForm.ai_model} onChange={(event) => setSettingsForm({ ...settingsForm, ai_model: event.target.value })} required /></label>
              <label>API key<input type="password" autoComplete="new-password" value={settingsForm.ai_api_key} onChange={(event) => setSettingsForm({ ...settingsForm, ai_api_key: event.target.value })} placeholder={settings?.configured_ai_providers.includes(settingsForm.ai_provider) ? "Key saved · enter a new key to replace" : "Paste provider API key"} /></label>
              <button className="button button-dark" disabled={busy}>Save AI settings</button>
            </form>
            <form className="admin-card settings-card" onSubmit={(event) => void saveSettings(event)}>
              <div className="admin-card-heading"><div><span className="admin-label">FILE STORAGE</span><h2>Your files, your choice.</h2></div><span className="connection-state">{settings?.cloudinary_configured ? "● Cloudinary ready" : "○ Configure credentials"}</span></div>
              <p>Select where private source files are stored. Supabase uses your configured private bucket. Cloudinary assets use authenticated access.</p>
              <label>Storage provider<select value={settingsForm.storage_provider} onChange={(event) => setSettingsForm({ ...settingsForm, storage_provider: event.target.value as Settings["storage_provider"] })}><option value="supabase">Supabase Storage</option><option value="cloudinary">Cloudinary</option></select></label>
              {settingsForm.storage_provider === "cloudinary" && <><label>Cloudinary cloud name<input value={settingsForm.cloudinary_cloud_name} onChange={(event) => setSettingsForm({ ...settingsForm, cloudinary_cloud_name: event.target.value })} /></label><label>Cloudinary API key<input value={settingsForm.cloudinary_api_key} onChange={(event) => setSettingsForm({ ...settingsForm, cloudinary_api_key: event.target.value })} /></label><label>Cloudinary API secret<input type="password" autoComplete="new-password" value={settingsForm.cloudinary_api_secret} onChange={(event) => setSettingsForm({ ...settingsForm, cloudinary_api_secret: event.target.value })} /></label></>}
              <button className="button button-dark" disabled={busy}>Save storage settings</button>
            </form>
            <div className="admin-card settings-card">
              <div className="admin-card-heading"><div><span className="admin-label">EMAIL REMINDERS</span><h2>Keep people in the loop.</h2></div><span className="connection-state">{settings?.email_configured ? "● Configured" : "○ Needs setup"}</span></div>
              <p>SMTP settings are provided as environment variables. Verified users who save expiring listings can receive one reminder up to three days before expiry.</p>
              <Link className="admin-inline-link" href="/privacy">Review privacy information ↗</Link>
            </div>
          </section>
          <form className="admin-card settings-card settings-audit-prompt" onSubmit={(event) => void saveCareerAuditPrompt(event)}>
            <div className="admin-card-heading"><div><span className="admin-label">CAREER AUDIT INSTRUCTIONS</span><h2>Set the guidance for AI feedback.</h2></div></div>
            <p>This additional instruction is combined with the Career Audit’s safety and accuracy rules, then used with the applicant’s answers. Keep applicant answers as the source of their personal facts.</p>
            <label>Administrator pre-prompt
              <textarea value={settingsForm.career_audit_prompt} onChange={(event) => setSettingsForm((current) => ({ ...current, career_audit_prompt: event.target.value }))} rows={8} maxLength={8000} placeholder="Add guidance on how the AI should assess preparation and shape practical feedback…" />
              <small>{settingsForm.career_audit_prompt.length}/8000 characters</small>
            </label>
            <button className="button button-dark" disabled={busy}>{busy ? "Saving…" : "Save Career Audit prompt"}</button>
          </form>
        </> : null}
        {section === "" ? <section className="dashboard-view"><div className="dashboard-welcome"><div><span className="admin-label">WEDNESDAY · YOUR EDITORIAL OVERVIEW</span><h2>Let’s make something <em>worth keeping.</em></h2><p>Shape the practical next steps your readers are looking for.</p></div><Link href="/dashboard/ai" className="button button-dark">✦ Start an AI draft</Link></div><div className="dashboard-stats">{[["All content", overview?.contentCount ?? 0, "Across every content type"], ["Published", overview?.publishedCount ?? 0, "Live on your website"], ["Reference files", overview?.documentCount ?? 0, "Available to AI drafts"], ["Members", overview?.userCount ?? 0, "Private workspaces"]].map(([label, count, detail]) => <div className="stat-card" key={label}><span>{label}</span><strong>{count}</strong><small>{detail}</small></div>)}</div><div className="admin-grid dashboard-lower"><div className="admin-card"><div className="admin-card-heading"><div><span className="admin-label">RECENT CONTENT</span><h2>In the studio</h2></div><Link href="/dashboard/content" className="admin-inline-link">Open library ↗</Link></div>{contents.slice(0, 5).map((item) => <article className="cms-item compact" key={item.id}><div><span className={`status-dot status-${item.status}`} />{item.status} · {item.type}</div><h3>{item.title}</h3></article>)}{!contents.length && <p className="empty-note">Your first useful story can start here.</p>}</div><div className="dashboard-side"><div className="admin-card quick-actions"><span className="admin-label">QUICK START</span><Link href="/dashboard/content">＋ Write manually</Link><Link href="/dashboard/ai">✦ Prompt the AI</Link><Link href="/dashboard/files">↥ Upload a source file</Link></div><div className="admin-card privacy-admin"><span className="admin-label">A NOTE ON TRUST</span><p>AI creates drafts, not facts. Review every detail before you publish.</p><Link href="/privacy">Privacy details ↗</Link></div></div></div></section> : null}
      </div>
    </main>
  </div>;
}
