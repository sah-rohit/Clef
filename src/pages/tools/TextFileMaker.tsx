import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Download, Copy, Trash2 } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

export default function TextFileMaker() {
  const [text, setText] = useState("");
  const [filename, setFilename] = useState("untitled");
  const { showToast } = useToast();

  const handleDownload = () => {
    if (!text.trim()) {
      showToast("Please write some content first.", "warning");
      return;
    }
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename || "untitled"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("File downloaded successfully!", "success");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    showToast("Content copied to clipboard!", "success");
  };

  const handleClear = () => {
    setText("");
    showToast("Content cleared.", "info");
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <ToolLayout toolId="text-file-maker">
      <div className="max-w-4xl mx-auto">
        {/* Filename */}
        <div className="mb-4">
          <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">
            Filename
          </label>
          <div className="flex items-center gap-0">
            <input
              type="text"
              className="input-brutal flex-1"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename..."
            />
            <span className="border-[3px] border-black border-l-0 px-4 py-3 bg-[#fafafa] font-oswald text-sm font-bold">
              .txt
            </span>
          </div>
        </div>

        {/* Editor */}
        <div className="mb-4">
          <textarea
            className="input-brutal min-h-[400px] resize-y font-inter text-sm leading-relaxed"
            placeholder="Start writing your content here... This is your personal workbench. Anything you type stays local until you download it."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-0 border-[3px] border-black mb-6">
          <div className="border-r-[3px] border-black px-4 py-3">
            <span className="font-oswald text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/50">Words</span>
            <span className="font-oswald text-lg font-bold ml-3">{wordCount}</span>
          </div>
          <div className="px-4 py-3">
            <span className="font-oswald text-xs font-bold uppercase tracking-wider text-[#1a1a1a]/50">Characters</span>
            <span className="font-oswald text-lg font-bold ml-3">{charCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button onClick={handleDownload} className="btn-brutal btn-brutal-yellow flex items-center gap-2">
            <Download size={16} />
            DOWNLOAD .TXT
          </button>
          <button onClick={handleCopy} className="btn-brutal btn-brutal-black flex items-center gap-2">
            <Copy size={16} />
            COPY TEXT
          </button>
          <button onClick={handleClear} className="btn-brutal bg-white flex items-center gap-2">
            <Trash2 size={16} />
            CLEAR
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
