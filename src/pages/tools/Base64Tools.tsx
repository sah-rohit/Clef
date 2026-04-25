import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, ArrowDownUp } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

export default function Base64Tools() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { showToast } = useToast();

  const handleConvert = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
        showToast("Encoded to Base64!", "success");
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
        showToast("Decoded from Base64!", "success");
      }
    } catch {
      showToast("Invalid input for " + mode + ".", "error");
      setOutput("Error: Invalid input");
    }
  };

  const swap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput(input);
  };

  return (
    <ToolLayout toolId="base64-tools">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-0 mb-4 border-[3px] border-black">
          <button onClick={() => setMode("encode")} className={`flex-1 px-4 py-2 font-oswald text-xs font-bold uppercase border-r-[3px] border-black ${mode === "encode" ? "bg-[#1a1a1a] text-white" : "bg-white hover:bg-[#F9FF00]"}`}>
            ENCODE
          </button>
          <button onClick={() => setMode("decode")} className={`flex-1 px-4 py-2 font-oswald text-xs font-bold uppercase ${mode === "decode" ? "bg-[#1a1a1a] text-white" : "bg-white hover:bg-[#F9FF00]"}`}>
            DECODE
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-4">
          <div className="border-[3px] border-black">
            <div className="bg-[#1a1a1a] text-white px-4 py-2">
              <span className="font-oswald text-xs font-bold uppercase">{mode === "encode" ? "Plain Text" : "Base64 String"}</span>
            </div>
            <textarea className="w-full min-h-[300px] px-4 py-3 font-mono text-sm outline-none resize-y" value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."} />
          </div>
          <div className="border-[3px] border-black lg:border-l-0">
            <div className="bg-[#F9FF00] px-4 py-2 flex items-center justify-between">
              <span className="font-oswald text-xs font-bold uppercase">{mode === "encode" ? "Base64 Output" : "Decoded Text"}</span>
              <button onClick={() => { navigator.clipboard.writeText(output); showToast("Copied!", "success"); }} className="p-1 hover:bg-black/10 transition-colors"><Copy size={14} /></button>
            </div>
            <pre className="w-full min-h-[300px] px-4 py-3 font-mono text-sm overflow-auto whitespace-pre-wrap">{output || "// Output will appear here..."}</pre>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleConvert} className="btn-brutal btn-brutal-yellow flex items-center gap-2">
            {mode === "encode" ? "ENCODE" : "DECODE"}
          </button>
          <button onClick={swap} className="btn-brutal bg-white flex items-center gap-2">
            <ArrowDownUp size={16} />
            SWAP
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
