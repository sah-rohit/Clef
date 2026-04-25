import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, Download, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

function parseMarkdown(md: string): string {
  let html = md;
  // Code blocks (triple backtick)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#0d0d0d;color:#e5e5e5;padding:16px;border:3px solid #1a1a1a;overflow-x:auto;font-family:monospace;font-size:13px;margin:16px 0;"><code>$2</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2px 6px;border:1px solid #ddd;font-family:monospace;font-size:13px;">$1</code>');
  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6 style="font-family:Oswald,sans-serif;font-size:14px;font-weight:700;margin:12px 0 8px;text-transform:uppercase;">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 style="font-family:Oswald,sans-serif;font-size:16px;font-weight:700;margin:14px 0 8px;text-transform:uppercase;">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 style="font-family:Oswald,sans-serif;font-size:18px;font-weight:700;margin:16px 0 8px;text-transform:uppercase;">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 style="font-family:Oswald,sans-serif;font-size:22px;font-weight:700;margin:20px 0 10px;text-transform:uppercase;">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 style="font-family:Oswald,sans-serif;font-size:28px;font-weight:700;margin:24px 0 12px;text-transform:uppercase;">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 style="font-family:Oswald,sans-serif;font-size:36px;font-weight:700;margin:28px 0 16px;text-transform:uppercase;">$1</h1>');
  // Bold & Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote style="border-left:4px solid #F9FF00;padding:8px 16px;margin:12px 0;background:#fafafa;">$1</blockquote>');
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr style="border:none;border-top:3px solid #1a1a1a;margin:24px 0;" />');
  // Unordered lists
  html = html.replace(/^\-\s+(.+)$/gm, '<li style="margin:4px 0;margin-left:20px;">$1</li>');
  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li style="margin:4px 0;margin-left:20px;list-style-type:decimal;">$1</li>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#FF0004;text-decoration:underline;">$1</a>');
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border:3px solid #1a1a1a;margin:12px 0;" />');
  // Line breaks
  html = html.replace(/\n\n/g, '<br/><br/>');
  return html;
}

const SAMPLE_MD = `# Welcome to Clef Markdown Workbench

## Features

This editor supports **bold**, *italic*, ***bold italic***, and ~~strikethrough~~ text.

### Code Blocks

\`\`\`javascript
function hello() {
  console.log("Hello from Clef AI!");
}
\`\`\`

You can also use \`inline code\` like this.

### Lists

- Focus on your work
- Export when ready
- Stay private

### Blockquotes

> Clef is my personal contribution to the web ecosystem. Free forever.

### Links

[Visit Clef Home](/)

---

*Your daily workbench for code, text, and color.*`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(SAMPLE_MD);
  const [showPreview, setShowPreview] = useState(true);
  const { showToast } = useToast();

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(parseMarkdown(markdown));
    showToast("HTML copied to clipboard!", "success");
  };

  const handleCopyMD = () => {
    navigator.clipboard.writeText(markdown);
    showToast("Markdown copied to clipboard!", "success");
  };

  const handleDownloadMD = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clef_document.md";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Markdown file downloaded!", "success");
  };

  const handleDownloadHTML = () => {
    const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Clef Document</title><style>body{font-family:Inter,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a1a1a;line-height:1.7;}</style></head><body>${parseMarkdown(markdown)}</body></html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clef_document.html";
    a.click();
    URL.revokeObjectURL(url);
    showToast("HTML file downloaded!", "success");
  };

  return (
    <ToolLayout toolId="markdown-editor">
      <div className="max-w-6xl mx-auto">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-brutal btn-brutal-yellow text-xs py-2 px-4 flex items-center gap-2"
          >
            {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPreview ? "HIDE PREVIEW" : "SHOW PREVIEW"}
          </button>
          <button onClick={handleCopyMD} className="btn-brutal text-xs py-2 px-4 bg-white flex items-center gap-2">
            <Copy size={14} />
            COPY MD
          </button>
          <button onClick={handleCopyHTML} className="btn-brutal text-xs py-2 px-4 bg-white flex items-center gap-2">
            <Copy size={14} />
            COPY HTML
          </button>
          <button onClick={handleDownloadMD} className="btn-brutal btn-brutal-black text-xs py-2 px-4 flex items-center gap-2">
            <Download size={14} />
            DOWNLOAD MD
          </button>
          <button onClick={handleDownloadHTML} className="btn-brutal text-xs py-2 px-4 bg-white flex items-center gap-2">
            <Download size={14} />
            DOWNLOAD HTML
          </button>
        </div>

        {/* Editor + Preview */}
        <div className={`grid ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-0`}>
          {/* Markdown Input */}
          <div className="border-[3px] border-black">
            <div className="bg-[#1a1a1a] text-white px-4 py-2">
              <span className="font-oswald text-xs font-bold uppercase tracking-wider">Markdown</span>
            </div>
            <textarea
              className="w-full min-h-[500px] px-4 py-3 bg-white font-mono text-sm outline-none resize-y leading-relaxed"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="border-[3px] border-black lg:border-l-0">
              <div className="bg-[#F9FF00] px-4 py-2">
                <span className="font-oswald text-xs font-bold uppercase tracking-wider">Preview</span>
              </div>
              <div
                className="min-h-[500px] px-6 py-4 font-inter text-sm leading-relaxed overflow-auto prose max-w-none"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
              />
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
