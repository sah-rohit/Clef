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
      <div className="flex flex-col gap-8">
        {/* Advanced Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b-[2px] border-black/5">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`group btn-brutal py-3 px-6 flex items-center gap-3 hover:-translate-y-1 transition-all duration-300 ${showPreview ? "btn-brutal-yellow" : "bg-white"}`}
            >
              {showPreview ? <EyeOff size={18} className="group-hover:scale-110 transition-transform" /> : <Eye size={18} className="group-hover:scale-110 transition-transform" />}
              <span className="font-oswald text-sm">{showPreview ? "HIDE_PREVIEW" : "SHOW_PREVIEW"}</span>
            </button>
            <div className="h-12 w-[2px] bg-black/10 mx-2 hidden sm:block" />
            <button onClick={handleCopyMD} className="group btn-brutal bg-white py-3 px-6 flex items-center gap-3 hover:-translate-y-1 transition-all duration-300">
              <Copy size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="font-oswald text-sm">COPY_MARKDOWN</span>
            </button>
            <button onClick={handleCopyHTML} className="group btn-brutal bg-white py-3 px-6 flex items-center gap-3 hover:-translate-y-1 transition-all duration-300">
              <Copy size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="font-oswald text-sm">COPY_HTML</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={handleDownloadMD} className="group btn-brutal btn-brutal-black py-3 px-6 flex items-center gap-3 hover:-translate-y-1 transition-all duration-300">
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="font-oswald text-sm">EXPORT_MD</span>
            </button>
            <button onClick={handleDownloadHTML} className="group btn-brutal bg-white py-3 px-6 flex items-center gap-3 hover:-translate-y-1 transition-all duration-300">
              <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="font-oswald text-sm">EXPORT_HTML</span>
            </button>
          </div>
        </div>

        {/* Editor + Preview Split View */}
        <div className={`grid ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-8`}>
          {/* Markdown Input Console */}
          <div className="flex flex-col gap-4 animate-slide-up">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-black rotate-45" />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">MARKDOWN_SOURCE</span>
              </div>
              <span className="font-mono text-[9px] opacity-40">UTF-8_BUFFER</span>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 group-focus-within:translate-x-2.5 group-focus-within:translate-y-2.5 transition-all duration-300" />
              <div className="relative border-[3px] border-black bg-white overflow-hidden">
                <div className="bg-[#1a1a1a] px-4 py-2 border-b-[3px] border-black flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-[#FF0004] rounded-full" />
                    <div className="w-2 h-2 bg-[#F9FF00] rounded-full" />
                  </div>
                  <span className="font-mono text-[8px] text-white/40 uppercase">EDITOR_CORE</span>
                </div>
                <textarea
                  className="w-full h-[600px] p-8 bg-[#fdfdfd] font-mono text-sm outline-none resize-none leading-relaxed focus:bg-white transition-colors custom-scrollbar"
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  spellCheck={false}
                  placeholder="Start writing your masterpiece..."
                />
              </div>
            </div>
          </div>

          {/* Preview Console */}
          {showPreview && (
            <div className="flex flex-col gap-4 animate-slide-left">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FF0004] rotate-45 border border-black" />
                  <span className="font-oswald text-xs font-black uppercase tracking-widest">RENDER_PREVIEW</span>
                </div>
                <span className="font-mono text-[9px] opacity-40">VIEWPORT_VIRTUAL</span>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-[#FF0004] translate-x-1.5 translate-y-1.5 group-hover:translate-x-2.5 group-hover:translate-y-2.5 transition-all duration-300 border-[2px] border-black" />
                <div className="relative border-[3px] border-black bg-white overflow-hidden">
                  <div className="bg-[#FF0004] px-4 py-2 border-b-[3px] border-black flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-white/30 rounded-full" />
                      <div className="w-2 h-2 bg-white/30 rounded-full" />
                    </div>
                    <span className="font-mono text-[8px] text-white/60 uppercase">COMPILED_HTML</span>
                  </div>
                  <div
                    className="h-[600px] p-8 sm:p-12 font-inter text-sm leading-relaxed overflow-auto custom-scrollbar bg-white prose prose-neutral max-w-none prose-headings:font-oswald prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#FF0004] prose-blockquote:border-l-[6px] prose-blockquote:border-[#F9FF00] prose-blockquote:bg-[#fafafa]"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
