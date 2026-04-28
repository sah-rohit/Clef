import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, ArrowDownUp } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

export default function UrlEncoder() {
  const [input, setInput] = useState("https://clef.dev/search?q=hello world&lang=en");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { showToast } = useToast();

  const handleConvert = () => {
    try {
      setOutput(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input));
      showToast(`URL ${mode === "encode" ? "encoded" : "decoded"}!`, "success");
    } catch { showToast("Invalid input.", "error"); setOutput("Error"); }
  };

  return (
    <ToolLayout toolId="url-encoder">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-0 mb-4 border-[3px] border-black">
          <button onClick={() => setMode("encode")} className={`flex-1 px-4 py-2 font-oswald text-xs font-bold uppercase border-r-[3px] border-black ${mode === "encode" ? "bg-[#1a1a1a] text-white" : "bg-white hover:bg-[#F9FF00]"}`}>ENCODE</button>
          <button onClick={() => setMode("decode")} className={`flex-1 px-4 py-2 font-oswald text-xs font-bold uppercase ${mode === "decode" ? "bg-[#1a1a1a] text-white" : "bg-white hover:bg-[#F9FF00]"}`}>DECODE</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-4">
          <div className="border-[3px] border-black">
            <div className="bg-[#1a1a1a] text-white px-4 py-2"><span className="font-oswald text-xs font-bold uppercase">Input</span></div>
            <textarea className="w-full min-h-[250px] px-4 py-3 font-mono text-sm outline-none resize-y" value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
          <div className="border-[3px] border-black lg:border-l-0">
            <div className="bg-[#F9FF00] px-4 py-2 flex justify-between">
              <span className="font-oswald text-xs font-bold uppercase">Output</span>
              <button onClick={() => { navigator.clipboard.writeText(output); showToast("Copied!", "success"); }}><Copy size={14} /></button>
            </div>
            <pre className="w-full min-h-[250px] px-4 py-3 font-mono text-sm overflow-auto whitespace-pre-wrap">{output || "..."}</pre>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleConvert} className="btn-brutal btn-brutal-yellow">{mode === "encode" ? "ENCODE URL" : "DECODE URL"}</button>
          <button onClick={() => { setMode(m => m === "encode" ? "decode" : "encode"); setInput(output); setOutput(input); }} className="btn-brutal bg-white flex items-center gap-2"><ArrowDownUp size={16} /> SWAP</button>
        </div>
      </div>
    </ToolLayout>
  );
}
