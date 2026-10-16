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
        class: "rich-editor-content",
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

  if (!editor) return <div className="rich-editor-loading" aria-busy="true">Preparing editor…</div>;

  const action = (label: string, icon: string, active: boolean, run: () => void) => (
    <button
      key={label}
      type="button"
      className={`rich-editor-tool${active ? " active" : ""}`}
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={run}
    >
      {icon}
    </button>
  );

  return <div className="rich-editor" onClick={(event) => event.stopPropagation()}>
    <div className="rich-editor-toolbar" role="toolbar" aria-label="Text formatting">
      {action("Undo", "↶", false, () => editor.chain().focus().undo().run())}
      {action("Redo", "↷", false, () => editor.chain().focus().redo().run())}
      <span className="rich-editor-divider" />
      {action("Paragraph", "¶", editor.isActive("paragraph"), () => editor.chain().focus().setParagraph().run())}
      {action("Heading 2", "H2", editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
      {action("Heading 3", "H3", editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run())}
      {action("Align left", "≡", editor.isActive({ textAlign: "left" }), () => editor.chain().focus().setTextAlign("left").run())}
      {action("Align center", "☷", editor.isActive({ textAlign: "center" }), () => editor.chain().focus().setTextAlign("center").run())}
      {action("Align right", "≣", editor.isActive({ textAlign: "right" }), () => editor.chain().focus().setTextAlign("right").run())}
      <span className="rich-editor-divider" />
      {action("Bold", "B", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
      {action("Italic", "I", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
      {action("Underline", "U", editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run())}
      {action("Strike-through", "S̶", editor.isActive("strike"), () => editor.chain().focus().toggleStrike().run())}
      <span className="rich-editor-divider" />
      {action("Bulleted list", "•≡", editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run())}
      {action("Numbered list", "1≡", editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run())}
      {action("Quote", "❝", editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run())}
      {action("Link", "↗", editor.isActive("link"), addLink)}
      {action("Insert table", "▦", tableOptionsOpen || editor.isActive("table"), () => setTableOptionsOpen((open) => !open))}
      {action(editor.isActive("textBox") ? "Remove text box" : "Insert text box", "▤", editor.isActive("textBox"), toggleTextBox)}
      <label className="rich-editor-color-tool" title="Text box background color">
        <span>Box color</span>
        <input
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
      {tableOptionsOpen && <div className="rich-editor-table-options" role="group" aria-label="Table size">
        <label>Rows
          <input type="number" min="1" max="20" step="1" required value={tableRows} onChange={(event) => setTableRows(event.target.value)} />
        </label>
        <label>Columns
          <input type="number" min="1" max="20" step="1" required value={tableColumns} onChange={(event) => setTableColumns(event.target.value)} />
        </label>
        <button
          type="button"
          className="rich-editor-text-tool"
          disabled={!Number.isInteger(Number(tableRows)) || !Number.isInteger(Number(tableColumns))
            || Number(tableRows) < 1 || Number(tableRows) > 20 || Number(tableColumns) < 1 || Number(tableColumns) > 20}
          onClick={insertTable}
        >Insert table</button>
      </div>}
      {editor.isActive("table") && <>
        <button type="button" className="rich-editor-text-tool" onClick={() => editor.chain().focus().addRowAfter().run()}>Add row</button>
        <button type="button" className="rich-editor-text-tool" onClick={() => editor.chain().focus().addColumnAfter().run()}>Add column</button>
        <button type="button" className="rich-editor-text-tool" onClick={() => editor.chain().focus().deleteTable().run()}>Delete table</button>
      </>}
      <button type="button" className="rich-editor-text-tool" onClick={() => imageInput.current?.click()}>Image</button>
      <button type="button" className="rich-editor-text-tool" onClick={() => editor.chain().focus().setHorizontalRule().run()}>Divider</button>
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
    <div className="rich-editor-footer">Select text to format. Set table size before inserting, add a colored text box, or upload PNG, JPEG, GIF and WebP images up to 10 MB.</div>
  </div>;
}
