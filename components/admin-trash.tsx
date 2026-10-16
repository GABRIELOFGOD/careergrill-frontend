"use client";

import { useState } from "react";
import type { ContentType } from "@/lib/site-data";

interface TrashedContent {
  id: string;
  type: ContentType;
  title: string;
  status: "draft" | "published" | "archived";
  deleted_at: string | null;
}

interface AdminTrashProps {
  items: TrashedContent[];
  onRestore: (id: string) => Promise<void>;
}

export default function AdminTrash({ items, onRestore }: AdminTrashProps) {
  const [restoringId, setRestoringId] = useState("");

  async function restore(id: string) {
    setRestoringId(id);
    try {
      await onRestore(id);
    } finally {
      setRestoringId("");
    }
  }

  return <section className="rounded-lg border border-brand-line bg-white p-5 shadow-sm">
    <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div><span className="text-xs font-bold uppercase tracking-widest text-brand-muted">Content trash</span><h2 className="mb-0 mt-2 text-2xl">{items.length} items</h2></div>
      <p className="mb-0 text-sm text-brand-muted">Deleted content is hidden from the website and can be restored here.</p>
    </div>
    {items.map((item) => <article className="border-t border-brand-line py-4" key={item.id}>
      <div className="flex items-center gap-2 text-xs uppercase text-brand-muted"><span className={`size-2.5 rounded-full ${item.status === "published" ? "bg-emerald-500" : item.status === "draft" ? "bg-amber-500" : "bg-slate-400"}`} />{item.status} · {item.type}</div>
      <h3 className="mb-2 mt-2 text-lg font-semibold">{item.title}</h3>
      <p className="mb-3 text-sm text-brand-muted">Moved to trash {item.deleted_at ? new Date(item.deleted_at).toLocaleString() : "at an unknown time"}</p>
      <div className="flex justify-end">
        <button className="rounded border border-brand-line px-3 py-2 text-sm font-semibold hover:bg-brand-blue disabled:opacity-50" disabled={restoringId === item.id} onClick={() => void restore(item.id)}>
          {restoringId === item.id ? "Restoring…" : "Restore"}
        </button>
      </div>
    </article>)}
    {!items.length && <p className="rounded bg-brand-blue p-4 text-sm text-brand-muted">Trash is empty. Deleted content will appear here.</p>}
  </section>;
}
