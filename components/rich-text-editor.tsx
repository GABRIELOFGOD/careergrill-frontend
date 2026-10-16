"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { marked } from "marked";
import { apiRequest, apiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

const TextBox = Node.create({
  name: "textBox",
  group: "block",
  content: "block+",
  defining: true,
  addAttributes() {
    return {
      backgroundColor: {
        default: "#eee8f4",
        parseHTML: (element) => element.style.backgroundColor || "#eee8f4",
        renderHTML: (attributes) => ({
          style: `background-color: ${attributes.backgroundColor}`,
        }),
      },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-text-box]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-text-box": "" }, 0];
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onError: (message: string) => void;
}

function editorHtml(value: string): string {
  if (!value) return "";
  const parsed = /<[a-z][^>]*>/i.test(value)
    ? value
    : marked.parse(value, { async: false, breaks: false });
  if (typeof parsed !== "string") return "";
  return parsed.replace(
    /(<img\b[^>]*\bsrc=["'])\/api\/content\/assets\/([a-f0-9-]{36})(["'])/gi,
    (_match, prefix: string, id: string, suffix: string) => `${prefix}${apiUrl(`/content/assets/${id}`)}${suffix}`,
  );
}

export default function RichTextEditor({ value, onChange, onError }: RichTextEditorProps) {
  const imageInput = useRef<HTMLInputElement>(null);
  const [tableOptionsOpen, setTableOptionsOpen] = useState(false);
  const [tableRows, setTableRows] = useState("3");
  const [tableColumns, setTableColumns] = useState("3");
  const [textBoxColor, setTextBoxColor] = useState("#eee8f4");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false, underline: false }),
      Image.configure({ allowBase64: false, HTMLAttributes: { loading: "lazy" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextBox,
    ],
    content: editorHtml(value),
    editorProps: {
      attributes: {
        class: "min-h-80 p-5 outline-none text-brand-ink leading-relaxed [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-2xl [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:font-display [&_h3]:text-xl [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:pl-1 [&_li_p]:mb-0 [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-orange [&_blockquote]:pl-4 [&_blockquote]:text-brand-muted [&_a]:text-brand-orange-dark [&_a]:underline [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-brand-line [&_th]:bg-brand-blue [&_th]:p-2 [&_td]:border [&_td]:border-brand-line [&_td]:p-2 [&_[data-text-box]]:my-4 [&_[data-text-box]]:rounded [&_[data-text-box]]:border [&_[data-text-box]]:border-brand-line [&_[data-text-box]]:p-4",
        "aria-label": "Content editor",
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const nextContent = editorHtml(value);
    if (editor.getHTML() !== nextContent) editor.commands.setContent(nextContent, { emitUpdate: false });
  }, [editor, value]);

  async function insertImage(file: File) {
    if (!editor) return;
    const alt = window.prompt("Describe the image for screen readers. Leave blank if decorative.", file.name);
    if (alt === null) return;
    onError("");
    const formData = new FormData();
    formData.set("file", file);
    try {
      const result = await apiRequest<{ item: { url: string } }>("/admin/assets/images", {
        method: "POST",
        body: formData,
      });
      editor.chain().focus().setImage({ src: apiUrl(result.item.url), alt: alt.trim() }).run();
    } catch (error) {
      onError(error instanceof Error ? error.message : "The image could not be uploaded.");
    }
  }

  function addLink() {
    if (!editor) return;
    const current = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Paste the web address for this link", current ?? "https://");
    if (href === null) return;
    if (!href.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  }

  function insertTable() {
    if (!editor) return;
    const rows = Number(tableRows);
    const cols = Number(tableColumns);
    if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || rows > 20 || cols < 1 || cols > 20) return;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setTableOptionsOpen(false);
  }

  function toggleTextBox() {
    if (!editor) return;
    const chain = editor.chain().focus();
    if (editor.isActive("textBox")) chain.lift("textBox").run();
    else chain.wrapIn("textBox", { backgroundColor: textBoxColor }).run();
  }

  if (!editor) return <div className="grid min-h-32 place-items-center rounded border border-brand-line bg-white p-6 text-sm text-brand-muted" aria-busy="true">Preparing editor…</div>;

  const action = (label: string, icon: string, active: boolean, run: () => void) => (
    <button
      key={label}
      type="button"
      className={cn("grid size-8 shrink-0 place-items-center rounded border border-transparent px-1.5 text-sm font-semibold text-brand-ink hover:border-brand-line hover:bg-brand-blue", active && "border-brand-line bg-brand-blue text-brand-purple")}
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={run}
    >
      {icon}
    </button>
  );

  return <div className="overflow-hidden rounded-md border border-brand-line bg-white" onClick={(event) => event.stopPropagation()}>
    <div className="flex flex-wrap items-center gap-1.5 border-b border-brand-line bg-brand-cream p-2" role="toolbar" aria-label="Text formatting">
      {action("Undo", "↶", false, () => editor.chain().focus().undo().run())}
      {action("Redo", "↷", false, () => editor.chain().focus().redo().run())}
      <span className="mx-1 h-6 border-l border-brand-line" />
      {action("Paragraph", "¶", editor.isActive("paragraph"), () => editor.chain().focus().setParagraph().run())}
      {action("Heading 2", "H2", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
      {action("Heading 3", "H3", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
      {action("Align left", "≡", editor.isActive({ textAlign: "left" }), () => editor.chain().focus().setTextAlign("left").run())}
      {action("Align center", "☷", editor.isActive({ textAlign: "center" }), () => editor.chain().focus().setTextAlign("center").run())}
      {action("Align right", "≣", editor.isActive({ textAlign: "right" }), () => editor.chain().focus().setTextAlign("right").run())}
      <span className="mx-1 h-6 border-l border-brand-line" />
      {action("Bold", "B", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
      {action("Italic", "I", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
      {action("Underline", "U", editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run())}
      {action("Strike-through", "S̶", editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run())}
      <span className="mx-1 h-6 border-l border-brand-line" />
      {action("Bulleted list", "•≡", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run())}
      {action("Numbered list", "1≡", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run())}
      {action("Quote", "❝", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run())}
      {action("Link", "↗", editor.isActive("link"), addLink)}
      {action("Insert table", "▦", tableOptionsOpen || editor.isActive("table"), () => setTableOptionsOpen((open) => !open))}
      {action(editor.isActive("textBox") ? "Remove text box" : "Insert text box", "▤", editor.isActive("textBox"), toggleTextBox)}
      <label className="flex items-center gap-2 rounded border border-brand-line px-2 py-1 text-xs text-brand-muted" title="Text box background color">
        <span>Box color</span>
        <input
          className="size-6 cursor-pointer border-0 bg-transparent p-0"
          type="color"
          aria-label="Text box background color"
          value={textBoxColor}
          onChange={(event) => {
            const color = event.target.value;
            setTextBoxColor(color);
            if (editor.isActive("textBox")) {
              editor.chain().focus().updateAttributes("textBox", { backgroundColor: color }).run();
            }
          }}
        />
      </label>
      {tableOptionsOpen && <div className="flex flex-wrap items-end gap-2 rounded border border-brand-line bg-white p-2" role="group" aria-label="Table size">
        <label className="grid gap-1 text-xs text-brand-muted">Rows
          <input className="h-8 w-20 rounded border border-brand-line px-2 text-sm text-brand-ink" type="number" min="1" max="20" step="1" required value={tableRows} onChange={(event) => setTableRows(event.target.value)} />
        </label>
        <label className="grid gap-1 text-xs text-brand-muted">Columns
          <input className="h-8 w-20 rounded border border-brand-line px-2 text-sm text-brand-ink" type="number" min="1" max="20" step="1" required value={tableColumns} onChange={(event) => setTableColumns(event.target.value)} />
        </label>
        <button
          type="button"
          className="h-8 rounded border border-brand-line px-2 text-xs font-semibold text-brand-ink hover:bg-brand-blue disabled:opacity-50"
          disabled={!Number.isInteger(Number(tableRows)) || !Number.isInteger(Number(tableColumns))
            || Number(tableRows) < 1 || Number(tableRows) > 20 || Number(tableColumns) < 1 || Number(tableColumns) > 20}
          onClick={insertTable}
        >Insert table</button>
      </div>}
      {editor.isActive("table") && <>
        <button type="button" className="h-8 rounded border border-brand-line px-2 text-xs font-semibold text-brand-ink hover:bg-brand-blue" onClick={() => editor.chain().focus().addRowAfter().run()}>Add row</button>
        <button type="button" className="h-8 rounded border border-brand-line px-2 text-xs font-semibold text-brand-ink hover:bg-brand-blue" onClick={() => editor.chain().focus().addColumnAfter().run()}>Add column</button>
        <button type="button" className="h-8 rounded border border-brand-line px-2 text-xs font-semibold text-brand-ink hover:bg-brand-blue" onClick={() => editor.chain().focus().deleteTable().run()}>Delete table</button>
      </>}
      <button type="button" className="h-8 rounded border border-brand-line px-2 text-xs font-semibold text-brand-ink hover:bg-brand-blue" onClick={() => imageInput.current?.click()}>Image</button>
      <button type="button" className="h-8 rounded border border-brand-line px-2 text-xs font-semibold text-brand-ink hover:bg-brand-blue" onClick={() => editor.chain().focus().setHorizontalRule().run()}>Divider</button>
      <input
        ref={imageInput}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        aria-label="Choose image to insert"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void insertImage(file);
          event.target.value = "";
        }}
      />
    </div>
    <EditorContent editor={editor} />
    <div className="border-t border-brand-line bg-brand-cream px-3 py-2 text-xs leading-relaxed text-brand-muted">Select text to format. Set table size before inserting, add a colored text box, or upload PNG, JPEG, GIF and WebP images up to 10 MB.</div>
  </div>;
}
