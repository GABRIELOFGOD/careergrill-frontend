"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { buttonVariants } from "@/components/ui/button";
import RichTextEditor from "@/components/rich-text-editor";
import RichContent from "@/components/rich-content";
import { apiRequest } from "@/lib/api";

interface AdminFaq {
  id: string;
  title: string;
  body: string;
  category: string;
  status: "draft" | "published" | "archived";
  updated_at: string;
}

const blankFaq = { title: "", body: "" };

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  const [draft, setDraft] = useState(blankFaq);
  const [editingId, setEditingId] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [editorError, setEditorError] = useState("");

  const loadFaqs = useCallback(async (clearNotice = true) => {
    if (clearNotice) setNotice("");
    try {
      const { items } = await apiRequest<{ items: AdminFaq[] }>("/admin/faqs");
      setFaqs(items);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load FAQs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFaqs();
  }, [loadFaqs]);

  function editFaq(faq: AdminFaq) {
    setEditingId(faq.id);
    setDraft({ title: faq.title, body: faq.body });
    setNotice("");
    setEditorError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveFaq(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      await apiRequest(editingId ? `/admin/faqs/${editingId}` : "/admin/faqs", {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify(draft),
      });
      setDraft(blankFaq);
      setEditingId("");
      await loadFaqs(false);
      setNotice(editingId ? "FAQ updated and published." : "FAQ published.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save this FAQ.");
    } finally {
      setBusy(false);
    }
  }

  async function removeFaq(faq: AdminFaq) {
    if (!window.confirm(`Delete “${faq.title}” permanently?`)) return;
    setNotice("");
    try {
      await apiRequest(`/admin/faqs/${faq.id}`, { method: "DELETE" });
      setFaqs((current) => current.filter((item) => item.id !== faq.id));
      if (editingId === faq.id) {
        setEditingId("");
        setDraft(blankFaq);
      }
      setNotice("FAQ deleted.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not delete this FAQ.");
    }
  }

  return <section className="grid items-start gap-5 xl:grid-cols-[minmax(0,.85fr)_minmax(20rem,1.15fr)]">
    <form className="grid content-start gap-4 rounded border border-brand-line bg-white p-5" onSubmit={(event) => void saveFaq(event)}>
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">{editingId ? "EDIT FAQ" : "FAQ EDITOR"}</span>
        <h2 className="mb-0 mt-1 text-2xl">{editingId ? "Update an answer." : "Add a question and answer."}</h2>
      </div>
      <label className="grid gap-1.5 text-sm font-semibold">
        Title
        <input
          className="min-h-10 rounded border border-brand-line px-3 py-2 font-normal"
          value={draft.title}
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          required
          minLength={3}
          maxLength={180}
        />
      </label>
      <div className="grid gap-1.5 text-sm font-semibold">
        <span>Rich text content</span>
        <RichTextEditor value={draft.body} onChange={(body) => setDraft((current) => ({ ...current, body }))} onError={setEditorError} />
        {editorError && <p className="mb-0 text-sm font-normal text-red-700" role="alert">{editorError}</p>}
      </div>
      {notice && <p className="mb-0 rounded border border-brand-line bg-brand-blue p-3 text-sm" role="status">{notice}</p>}
      <div className="flex flex-wrap gap-2">
        <button className={buttonVariants({ variant: "brand", size: "sm" })} disabled={busy}>
          {busy ? "Saving…" : editingId ? "Update FAQ" : "Publish FAQ"}
        </button>
        {editingId && <button
          className={buttonVariants({ variant: "outline", size: "sm" })}
          type="button"
          disabled={busy}
          onClick={() => { setEditingId(""); setDraft(blankFaq); setNotice(""); }}
        >Cancel</button>}
      </div>
    </form>
    <div className="grid content-start gap-3 rounded border border-brand-line bg-white p-5">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-eyebrow">FAQs</span>
        <h2 className="mb-0 mt-1 text-2xl">{faqs.length} questions</h2>
      </div>
      {loading && <p className="mb-0 text-sm text-brand-muted">Loading FAQs…</p>}
      {!loading && !faqs.length && <p className="mb-0 rounded bg-brand-blue p-4 text-sm text-brand-muted">No FAQs have been added yet.</p>}
      {faqs.map((faq) => <article className="grid gap-2 border-t border-brand-line pt-3" key={faq.id}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h3 className="mb-1 text-base font-bold">{faq.title}</h3><p className="mb-0 text-xs text-brand-muted">{faq.category || "General questions"}</p></div>
          <div className="flex shrink-0 gap-3 text-sm font-semibold">
            <button className="text-brand-purple hover:underline" type="button" onClick={() => editFaq(faq)}>Edit</button>
            <button className="text-red-700 hover:underline" type="button" onClick={() => void removeFaq(faq)}>Delete</button>
          </div>
        </div>
        <RichContent value={faq.body} className="text-sm leading-relaxed text-brand-muted [&_p:last-child]:mb-0 [&_a]:text-brand-purple" />
      </article>)}
    </div>
  </section>;
}
