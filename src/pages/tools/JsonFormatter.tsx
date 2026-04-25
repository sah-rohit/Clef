import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, Minimize2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

export default function JsonFormatter() {
  const [input, setInput] = useState('{\n  "name": "Clef",\n  "version": "1.0",\n  "tools": ["Text Editor", "Code IDE", "Markdown"]\n}');
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const { showToast } = useToast();

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setIsValid(true);
      showToast("JSON formatted successfully!", "success");
    } catch (err) {
      setOutput("Error: " + (err instanceof Error ? err.message : "Invalid JSON"));
      setIsValid(false);
      showToast("Invalid JSON — check your syntax.", "error");
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      showToast("JSON minified!", "success");
    } catch (err) {
      setOutput("Error: " + (err instanceof Error ? err.message : "Invalid JSON"));
      setIsValid(false);
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(input);
      setIsValid(true);
      setOutput("✓ Valid JSON");
      showToast("JSON is valid!", "success");
    } catch (err) {
      setIsValid(false);
      setOutput("✗ Invalid: " + (err instanceof Error ? err.message : ""));
      showToast("Invalid JSON.", "error");
    }
  };

  return (
    <ToolLayout toolId="json-formatter">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-4">
          <button onClick={handleFormat} className="btn-brutal btn-brutal-yellow text-xs py-2 px-4 flex items-center gap-2">
            <CheckCircle size={14} />
            FORMAT
          </button>
          <button onClick={handleMinify} className="btn-brutal btn-brutal-black text-xs py-2 px-4 flex items-center gap-2">
            <Minimize2 size={14} />
            MINIFY
          </button>
          <button onClick={handleValidate} className="btn-brutal bg-white text-xs py-2 px-4 flex items-center gap-2">
            <AlertCircle size={14} />
            VALIDATE
          </button>
          <button onClick={() => { navigator.clipboard.writeText(output || input); showToast("Copied!", "success"); }} className="btn-brutal bg-white text-xs py-2 px-4 flex items-center gap-2">
            <Copy size={14} />
            COPY OUTPUT
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <span className="font-oswald text-xs uppercase tracking-wider">Indent:</span>
            {[2, 4].map(s => (
              <button key={s} onClick={() => setIndentSize(s)} className={`px-3 py-1 border-[3px] border-black font-oswald text-xs ${indentSize === s ? "bg-[#F9FF00]" : "bg-white"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {isValid !== null && (
          <div className={`mb-4 px-4 py-2 border-[3px] border-black flex items-center gap-2 ${isValid ? "bg-green-50" : "bg-red-50"}`}>
            {isValid ? <CheckCircle size={16} className="text-green-600" /> : <AlertCircle size={16} className="text-[#FF0004]" />}
            <span className="font-inter text-sm">{isValid ? "Valid JSON" : "Invalid JSON"}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="border-[3px] border-black">
            <div className="bg-[#1a1a1a] text-white px-4 py-2">
              <span className="font-oswald text-xs font-bold uppercase tracking-wider">Input</span>
            </div>
            <textarea className="w-full min-h-[400px] px-4 py-3 font-mono text-sm outline-none resize-y" value={input} onChange={(e) => { setInput(e.target.value); setIsValid(null); }} spellCheck={false} />
          </div>
          <div className="border-[3px] border-black lg:border-l-0">
            <div className="bg-[#F9FF00] px-4 py-2">
              <span className="font-oswald text-xs font-bold uppercase tracking-wider">Output</span>
            </div>
            <pre className="w-full min-h-[400px] px-4 py-3 font-mono text-sm overflow-auto whitespace-pre-wrap">{output || "// Click FORMAT, MINIFY, or VALIDATE..."}</pre>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
