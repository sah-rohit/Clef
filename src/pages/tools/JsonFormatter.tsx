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
      <div className="flex flex-col gap-8">
        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b-[2px] border-black/5">
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleFormat} 
              className="group btn-brutal btn-brutal-yellow py-3 px-6 flex items-center gap-3 hover:-translate-y-1 transition-all duration-300"
            >
              <CheckCircle size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="font-oswald text-sm">FORMAT_DATA</span>
            </button>
            <button 
              onClick={handleMinify} 
              className="group btn-brutal btn-brutal-black py-3 px-6 flex items-center gap-3 hover:-translate-y-1 transition-all duration-300"
            >
              <Minimize2 size={18} className="group-hover:scale-90 transition-transform" />
              <span className="font-oswald text-sm">MINIFY_DATA</span>
            </button>
            <button 
              onClick={handleValidate} 
              className="group btn-brutal bg-white py-3 px-6 flex items-center gap-3 hover:-translate-y-1 transition-all duration-300"
            >
              <AlertCircle size={18} className="group-hover:animate-pulse transition-transform" />
              <span className="font-oswald text-sm">VALIDATE_JSON</span>
            </button>
            <button 
              onClick={() => { navigator.clipboard.writeText(output || input); showToast("Copied!", "success"); }} 
              className="group btn-brutal bg-white py-3 px-6 flex items-center gap-3 hover:-translate-y-1 transition-all duration-300"
            >
              <Copy size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <span className="font-oswald text-sm">COPY_OUTPUT</span>
            </button>
          </div>

          <div className="flex items-center gap-4 bg-black/5 p-2 rounded-sm border-[2px] border-black/10">
            <span className="font-oswald text-[10px] font-black uppercase tracking-widest px-2">INDENT_SIZE:</span>
            <div className="flex gap-1">
              {[2, 4].map(s => (
                <button 
                  key={s} 
                  onClick={() => setIndentSize(s)} 
                  className={`w-10 h-10 border-[2px] border-black font-oswald text-xs font-bold transition-all duration-200 ${indentSize === s ? "bg-[#F9FF00] shadow-[2px_2px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-black/5"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        {isValid !== null && (
          <div 
            className={`animate-slide-up px-6 py-4 border-[3px] border-black flex items-center justify-between transition-all duration-500 ${isValid ? "bg-[#00FF87]/10" : "bg-[#FF0004]/10"}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 border-[2px] border-black ${isValid ? "bg-[#00FF87]" : "bg-[#FF0004]"}`}>
                {isValid ? <CheckCircle size={18} className="text-black" /> : <AlertCircle size={18} className="text-white" />}
              </div>
              <div className="flex flex-col">
                <span className="font-oswald text-xs font-bold uppercase tracking-widest">{isValid ? "STATUS: VALID_JSON" : "STATUS: SYNTAX_ERROR"}</span>
                <span className="font-inter text-[10px] font-bold opacity-50 uppercase">{isValid ? "Ready for implementation" : "Check the output for details"}</span>
              </div>
            </div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rotate-45 ${isValid ? "bg-[#00FF87]" : "bg-[#FF0004]"}`} style={{ opacity: 0.3 + (i * 0.3) }} />
              ))}
            </div>
          </div>
        )}

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-black rotate-45" />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">INPUT_TERMINAL</span>
              </div>
              <span className="font-mono text-[9px] opacity-40">RAW_BUFFER</span>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-x-1.5 translate-y-1.5 group-focus-within:translate-x-2.5 group-focus-within:translate-y-2.5 transition-all duration-300" />
              <div className="relative border-[3px] border-black bg-white overflow-hidden">
                <div className="bg-[#1a1a1a] px-4 py-2 border-b-[3px] border-black flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-white/20 rounded-full" />
                    <div className="w-2 h-2 bg-white/20 rounded-full" />
                  </div>
                  <span className="font-mono text-[8px] text-white/40 uppercase">SOURCE.json</span>
                </div>
                <textarea 
                  className="w-full h-[500px] p-6 font-mono text-sm outline-none resize-none bg-[#fdfdfd] focus:bg-white transition-colors custom-scrollbar" 
                  value={input} 
                  onChange={(e) => { setInput(e.target.value); setIsValid(null); }} 
                  spellCheck={false} 
                  placeholder="Paste your JSON here..."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#F9FF00] rotate-45 border border-black" />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">OUTPUT_CONSOLE</span>
              </div>
              <span className="font-mono text-[9px] opacity-40">FORMATTED_BUFFER</span>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-[#F9FF00] translate-x-1.5 translate-y-1.5 group-hover:translate-x-2.5 group-hover:translate-y-2.5 transition-all duration-300 border-[2px] border-black" />
              <div className="relative border-[3px] border-black bg-white overflow-hidden">
                <div className="bg-[#F9FF00] px-4 py-2 border-b-[3px] border-black flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-black/20 rounded-full" />
                    <div className="w-2 h-2 bg-black/20 rounded-full" />
                  </div>
                  <span className="font-mono text-[8px] text-black/40 uppercase">RENDERED_OUTPUT</span>
                </div>
                <div className="h-[500px] overflow-auto custom-scrollbar bg-[#1a1a1a]">
                  <pre className="p-6 font-mono text-sm text-[#F9FF00] whitespace-pre-wrap leading-relaxed">
                    {output || "// Click FORMAT, MINIFY, or VALIDATE to process data..."}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
