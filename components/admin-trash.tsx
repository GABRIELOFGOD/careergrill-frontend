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

  return <section className="admin-card content-list-card">
    <div className="admin-card-heading">
      <div><span className="admin-label">CONTENT TRASH</span><h2>{items.length} items</h2></div>
      <p>Deleted content is hidden from the website and can be restored here.</p>
    </div>
    {items.map((item) => <article className="cms-item" key={item.id}>
      <div><span className={`status-dot status-${item.status}`} />{item.status} · {item.type}</div>
      <h3>{item.title}</h3>
      <p>Moved to trash {item.deleted_at ? new Date(item.deleted_at).toLocaleString() : "at an unknown time"}</p>
      <div className="cms-item-actions">
        <button disabled={restoringId === item.id} onClick={() => void restore(item.id)}>
          {restoringId === item.id ? "Restoring…" : "Restore"}
        </button>
      </div>
    </article>)}
    {!items.length && <p className="empty-note">Trash is empty. Deleted content will appear here.</p>}
  </section>;
}
