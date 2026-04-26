import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, Download, Scissors, Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")       // remove comments
    .replace(/\s*([{}:;,>~+])\s*/g, "$1")   // remove spaces around symbols
    .replace(/;\}/g, "}")                    // remove last semicolon in block
    .replace(/\s+/g, " ")                   // collapse whitespace
    .replace(/^\s+|\s+$/g, "")              // trim
    .replace(/\s*{\s*/g, "{")
    .replace(/\s*}\s*/g, "}")
    .replace(/\s*;\s*/g, ";");
}

function beautifyCSS(css: string): string {
  let result = "";
  let indent = 0;
  const lines = css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*{\s*/g, " {\n")
    .replace(/\s*}\s*/g, "\n}\n")
    .replace(/\s*;\s*/g, ";\n")
    .split("\n");

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line === "}") indent = Math.max(0, indent - 1);
    result += "  ".repeat(indent) + line + "\n";
    if (line.endsWith("{")) indent++;
  }
  return result.trim();
}

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"minify" | "beautify">("minify");
  const { showToast } = useToast();

  const process = (m = mode) => {
    if (!input.trim()) { showToast("Paste some CSS first.", "warning"); return; }
    try {
      setOutput(m === "minify" ? minifyCSS(input) : beautifyCSS(input));
    } catch {
      showToast("Invalid CSS — check your input.", "error");
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    showToast("Copied to clipboard!", "success");
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/css" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = mode === "minify" ? "styles.min.css" : "styles.css";
    a.click();
  };

  const savings = input && output
    ? Math.round((1 - output.length / input.length) * 100)
    : null;

  return (
    <ToolLayout toolId="css-minifier">
      {/* Mode toggle */}
      <div className="flex gap-0 border-[3px] border-black w-fit mb-6">
        {(["minify", "beautify"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); if (output) process(m); }}
            className={`px-6 py-2 font-oswald text-xs font-bold uppercase tracking-widest border-r-[3px] border-black last:border-r-0 transition-colors ${
              mode === m ? "bg-[#00E5FF]" : "hover:bg-[#F9FF00]/30"
            }`}
          >
            {m === "minify" ? <><Minimize2 size={12} className="inline mr-1" />Minify</> : <><Maximize2 size={12} className="inline mr-1" />Beautify</>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-[3px] border-black">
        {/* Input */}
        <div className="border-r-[3px] border-black">
          <div className="flex items-center justify-between px-4 py-2 border-b-[3px] border-black bg-[#fafafa]">
            <span className="font-oswald text-xs font-bold uppercase tracking-widest">INPUT CSS</span>
            <span className="font-inter text-[10px] text-black/40">{input.length} chars</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSS here..."
            className="w-full h-80 p-4 font-mono text-xs resize-none outline-none bg-white"
          />
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between px-4 py-2 border-b-[3px] border-black bg-[#fafafa]">
            <span className="font-oswald text-xs font-bold uppercase tracking-widest">OUTPUT</span>
            <div className="flex items-center gap-3">
              {savings !== null && savings > 0 && (
                <span className="font-oswald text-[10px] font-bold bg-[#00FF87] px-2 py-0.5 border border-black">
                  -{savings}% SIZE
                </span>
              )}
              <span className="font-inter text-[10px] text-black/40">{output.length} chars</span>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Output will appear here..."
            className="w-full h-80 p-4 font-mono text-xs resize-none outline-none bg-[#fafafa]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={() => process()}
          className="bg-[#00E5FF] border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-black hover:text-[#00E5FF] transition-colors flex items-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
        >
          <Scissors size={14} />
          {mode === "minify" ? "MINIFY CSS" : "BEAUTIFY CSS"}
        </button>
        <button onClick={copy} className="border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F9FF00] transition-colors flex items-center gap-2">
          <Copy size={14} /> COPY
        </button>
        <button onClick={download} className="border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#F9FF00] transition-colors flex items-center gap-2">
          <Download size={14} /> DOWNLOAD
        </button>
        <button onClick={() => { setInput(""); setOutput(""); }} className="border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#FF0004] hover:text-white transition-colors">
          CLEAR
        </button>
      </div>
    </ToolLayout>
  );
}
