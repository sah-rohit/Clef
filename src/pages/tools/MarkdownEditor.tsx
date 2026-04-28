import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, Download, Eye, EyeOff, Bold, Italic, Link as LinkIcon, List, ListOrdered, Heading1, Heading2, FileJson, Hash, Clock, FileText } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

// ── Markdown Parser Logic ──
function parseMarkdown(md: string): string {
  let html = md;
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-[#1a1a1a] text-[#F9FF00] p-6 border-[3px] border-black my-6 font-mono text-sm overflow-x-auto"><code>$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-black/5 px-1.5 py-0.5 border border-black/10 font-mono text-xs">$1</code>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="font-oswald text-4xl font-black uppercase tracking-tight my-8 border-b-[4px] border-black pb-4">$1</h1>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="font-oswald text-2xl font-black uppercase tracking-tight my-6 border-b-[2px] border-black pb-2">$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="font-oswald text-xl font-bold uppercase my-4">$1</h3>');
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote class="border-l-[6px] border-[#F9FF00] bg-black/5 p-6 my-6 italic font-inter text-lg">$1</blockquote>');
  html = html.replace(/^\-\s+(.+)$/gm, '<li class="ml-6 my-2 list-disc">$1</li>');
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-6 my-2 list-decimal">$1</li>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#FF0004] underline decoration-2 underline-offset-4 hover:bg-[#FF0004] hover:text-white transition-all">$1</a>');
  html = html.replace(/\n\n/g, '<br/><br/>');
  return html;
}

const TEMPLATES = {
  readme: `# Project Name\n\n## Description\nWrite a brief description of your project here.\n\n## Installation\n\`\`\`bash\nnpm install my-awesome-project\n\`\`\`\n\n## Usage\nExplain how to use the project.`,
  proposal: `# Project Proposal\n\n## Objective\nDefine the primary goal of this initiative.\n\n## Scope\nWhat is included and excluded?\n\n## Timeline\n1. Phase 1: Research\n2. Phase 2: Development\n3. Phase 3: Launch`,
  meeting: `# Meeting Notes\n\n**Date:** 2026-04-28\n**Attendees:** @user1, @user2\n\n## Agenda\n- Review progress\n- Discuss blockers\n- Next steps\n\n## Action Items\n- [ ] Update documentation\n- [ ] Fix critical bugs`
};

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(TEMPLATES.readme);
  const [showPreview, setShowPreview] = useState(true);
  const { showToast } = useToast();

  const stats = useMemo(() => ({
    words: markdown.trim() ? markdown.trim().split(/\s+/).length : 0,
    chars: markdown.length,
    readingTime: Math.ceil(markdown.length / 1000) + " min"
  }), [markdown]);

  const insertText = (before: string, after: string = "") => {
    const textarea = document.getElementById("md-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const newVal = text.substring(0, start) + before + selected + after + text.substring(end);
    setMarkdown(newVal);
    textarea.focus();
  };

  const handleDownload = (type: "md" | "html") => {
    const content = type === "md" ? markdown : `<!DOCTYPE html><html><head><style>body{font-family:sans-serif;padding:40px;line-height:1.6;}</style></head><body>${parseMarkdown(markdown)}</body></html>`;
    const blob = new Blob([content], { type: type === "md" ? "text/markdown" : "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clef_doc.${type}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`${type.toUpperCase()} exported!`, "success");
  };

  return (
    <ToolLayout toolId="markdown-editor">
      <div className="flex flex-col gap-8">
        {/* Dynamic Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b-[3px] border-black/10">
          <div className="flex items-center gap-2 bg-black p-1.5 border-[3px] border-black">
            {[
              { icon: Bold, action: () => insertText("**", "**"), label: "Bold" },
              { icon: Italic, action: () => insertText("*", "*"), label: "Italic" },
              { icon: Heading1, action: () => insertText("# ", ""), label: "H1" },
              { icon: Heading2, action: () => insertText("## ", ""), label: "H2" },
              { icon: LinkIcon, action: () => insertText("[", "](url)"), label: "Link" },
              { icon: List, action: () => insertText("- ", ""), label: "Bullet" },
              { icon: ListOrdered, action: () => insertText("1. ", ""), label: "Number" },
            ].map((btn, i) => (
              <button 
                key={i} 
                onClick={btn.action}
                className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-[#F9FF00] hover:bg-white/10 transition-all"
                title={btn.label}
              >
                <btn.icon size={18} />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 p-1.5 bg-black/5 border-[2px] border-black/10">
                <span className="font-oswald text-[10px] font-black uppercase px-2 opacity-40">TEMPLATES:</span>
                {Object.keys(TEMPLATES).map(key => (
                  <button 
                    key={key} 
                    onClick={() => { if(confirm("Overwrite current document?")) setMarkdown((TEMPLATES as any)[key]); }}
                    className="px-3 py-1 font-oswald text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all"
                  >
                    {key}
                  </button>
                ))}
             </div>
             <button 
               onClick={() => setShowPreview(!showPreview)}
               className={`w-12 h-12 border-[3px] border-black flex items-center justify-center transition-all ${showPreview ? "bg-[#F9FF00]" : "bg-white"}`}
             >
               {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
             </button>
          </div>
        </div>

        {/* Editor Workbench */}
        <div className={`grid ${showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-10`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <span className="font-oswald text-xs font-black uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FF0004]" /> EDITOR_WORKSPACE
              </span>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                   <Hash size={12} className="opacity-40" />
                   <span className="font-mono text-[10px] opacity-40 uppercase">{stats.words} WORDS</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Clock size={12} className="opacity-40" />
                   <span className="font-mono text-[10px] opacity-40 uppercase">{stats.readingTime} READ</span>
                 </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-focus-within:translate-x-3 group-focus-within:translate-y-3 transition-all duration-300" />
              <div className="relative border-[4px] border-black bg-white overflow-hidden">
                <textarea 
                  id="md-editor"
                  className="w-full h-[650px] p-10 font-mono text-[14px] outline-none resize-none leading-relaxed custom-scrollbar" 
                  value={markdown} 
                  onChange={(e) => setMarkdown(e.target.value)}
                  spellCheck={false}
                  placeholder="The document begins here..."
                />
              </div>
            </div>
          </div>

          {showPreview && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <span className="font-oswald text-xs font-black uppercase tracking-widest flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#00E5FF] rotate-45 border border-black" /> PREVIEW_RENDER
                </span>
                <div className="flex items-center gap-4">
                  <button onClick={() => handleDownload("md")} className="font-oswald text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-all">EXPORT_MD</button>
                  <button onClick={() => handleDownload("html")} className="font-oswald text-[10px] font-black uppercase opacity-40 hover:opacity-100 transition-all text-[#FF0004]">EXPORT_HTML</button>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-[#F9FF00] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300 border-[2px] border-black" />
                <div className="relative border-[4px] border-black bg-white overflow-hidden flex flex-col h-[650px]">
                  <div className="flex-1 overflow-auto custom-scrollbar p-10 sm:p-16 prose prose-neutral max-w-none prose-pre:bg-transparent prose-pre:p-0">
                    <div dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
