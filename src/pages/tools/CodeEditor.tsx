import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Play, Copy, Trash2, Download, Terminal, Maximize2, Minimize2 } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const LANGUAGES = [
  { value: "javascript", label: "JAVASCRIPT", ext: "js" },
  { value: "html", label: "HTML", ext: "html" },
  { value: "css", label: "CSS", ext: "css" },
  { value: "json", label: "JSON", ext: "json" },
  { value: "sql", label: "SQL", ext: "sql" },
];

const TEMPLATES: Record<string, string> = {
  javascript: `// Clef JS Workbench
const greeting = "Hello from Clef AI!";
console.log(greeting);

const numbers = [1, 2, 3, 4, 5];
const squares = numbers.map(n => n * n);
console.log("Squares:", squares);

// Try editing me!`,
  html: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #F9FF00; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
    .card { border: 4px solid black; padding: 2rem; background: white; box-shadow: 10px 10px 0 black; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Welcome to Clef</h1>
    <p>Your daily workbench for code, text, and color.</p>
  </div>
</body>
</html>`,
  css: `/* Clef Styling */
.workbench {
  border: 3px solid black;
  background: #F9FF00;
  padding: 20px;
  font-weight: bold;
  text-transform: uppercase;
}`,
  json: `{
  "project": "Clef",
  "author": "Sonata Interactive",
  "distributor": "Sonata Interactive",
  "status": "Active"
}`,
  sql: `CREATE TABLE workbench (
  id INT PRIMARY KEY,
  tool_name VARCHAR(50),
  status VARCHAR(20)
);

INSERT INTO workbench VALUES (1, 'Code Editor', 'Functional');
SELECT * FROM workbench;`,
};

export default function CodeEditor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(TEMPLATES.javascript);
  const [output, setOutput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { showToast } = useToast();

  const handleRun = () => {
    if (language === "javascript") {
      try {
        const logs: string[] = [];
        const mockConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
          error: (...args: any[]) => logs.push("❌ ERROR: " + args.join(" ")),
          warn: (...args: any[]) => logs.push("⚠️ WARN: " + args.join(" ")),
        };
        const fn = new Function("console", code);
        fn(mockConsole);
        setOutput(logs.join("\n") || "// Script executed (no output)");
        showToast("Execution complete.", "success");
      } catch (err: any) {
        setOutput("❌ RUNTIME ERROR: " + err.message);
        showToast("Execution failed.", "error");
      }
    } else if (language === "html") {
      showToast("HTML rendered in preview pane.", "success");
    } else {
      setOutput(`// ${language.toUpperCase()} preview mode.\n// Native execution coming soon.`);
      showToast("Previewing code structure.", "info");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    showToast("Copied to clipboard.", "success");
  };

  const handleDownload = () => {
    const ext = LANGUAGES.find(l => l.value === language)?.ext || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clef_workbench.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("File saved.", "success");
  };

  return (
    <ToolLayout toolId="code-editor">
      <div className={`flex flex-col gap-8 transition-all ${isFullscreen ? "fixed inset-0 z-[1000] bg-white p-12 overflow-auto" : ""}`}>
        {/* Advanced IDE Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b-[2px] border-black/5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-0 border-[3px] border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.value}
                  onClick={() => { setLanguage(lang.value); setCode(TEMPLATES[lang.value] || ""); setOutput(""); }}
                  className={`px-5 py-3 font-oswald text-[11px] font-black uppercase tracking-[0.2em] border-r-[3px] border-black last:border-r-0 transition-all duration-200 ${
                    language === lang.value ? "bg-[#F9FF00] text-black" : "hover:bg-black hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            {isFullscreen && (
               <div className="flex items-center gap-3 px-4 py-2 bg-black/5 border-[2px] border-black/10 rounded-sm">
                 <div className="w-2 h-2 bg-[#00FF87] rounded-full animate-pulse" />
                 <span className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-50">FULLSCREEN_MODE_ACTIVE</span>
               </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              className="group p-3 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all duration-300 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              {isFullscreen ? <Minimize2 size={20} className="group-hover:scale-90 transition-transform" /> : <Maximize2 size={20} className="group-hover:scale-110 transition-transform" />}
            </button>
          </div>
        </div>

        {/* Professional Workspace */}
        <div className="flex flex-col gap-4 animate-slide-up">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-[#F9FF00] rotate-45 border border-black shadow-[1px_1px_0px_black]" />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">IDE_WORKBENCH_ENVIRONMENT</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[9px] opacity-40 uppercase">ln: {code.split("\n").length}</span>
                <span className="font-mono text-[9px] opacity-40 uppercase">enc: UTF-8</span>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-focus-within:translate-x-3 group-focus-within:translate-y-3 transition-all duration-300" />
              <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 border-[4px] border-black bg-[#0d0d0d] overflow-hidden">
                {/* Editor Surface */}
                <div className="lg:col-span-8 border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black flex">
                  <div className="w-14 bg-[#1a1a1a] border-r-[2px] border-white/5 py-6 flex flex-col items-center gap-1.5 select-none shrink-0">
                    {Array.from({ length: Math.max(25, code.split("\n").length) }).map((_, i) => (
                      <span key={i} className="font-mono text-[10px] text-white/20 font-bold">{i + 1}</span>
                    ))}
                  </div>
                  <div className="flex-1 relative bg-black/40 backdrop-blur-sm">
                    <textarea
                      className="w-full min-h-[600px] p-6 font-mono text-sm text-[#e5e5e5] outline-none resize-none leading-relaxed caret-[#F9FF00] custom-scrollbar"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      spellCheck={false}
                    />
                    {/* Syntax highlight hint (future-proofing) */}
                    <div className="absolute bottom-4 right-6 pointer-events-none opacity-20">
                      <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-[#F9FF00]">ENGINE_V8_ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Integrated Console / Preview Output */}
                <div className="lg:col-span-4 flex flex-col bg-[#111]">
                  <div className="bg-[#1a1a1a] text-[#F9FF00] px-5 py-3 flex items-center justify-between border-b-[3px] border-black">
                    <div className="flex items-center gap-3">
                      <Terminal size={14} className="text-[#F9FF00]" />
                      <span className="font-oswald text-[11px] font-black uppercase tracking-[0.2em]">
                        {language === "html" ? "RENDER_ENGINE" : "SYSTEM_CONSOLE"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse" />
                       <span className="font-mono text-[8px] font-bold uppercase text-white/30 tracking-tighter">IO_PORT: 3000</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto bg-black relative">
                    {language === "html" ? (
                      <iframe
                        title="HTML Preview"
                        className="w-full h-full bg-white border-none"
                        srcDoc={code}
                      />
                    ) : (
                      <div className="p-8 font-mono text-[11px] leading-relaxed">
                        {output ? (
                          <pre className="text-[#F9FF00] whitespace-pre-wrap animate-fade-in">{output}</pre>
                        ) : (
                          <div className="flex flex-col gap-2 opacity-20">
                            <span className="animate-pulse">_ EXECUTION_PENDING</span>
                            <span className="text-[9px]">Awaiting system instructions from primary buffer...</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Console Scanline Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Global Action Terminal */}
        <div className="flex flex-wrap items-center gap-4 py-8 px-8 bg-black border-[4px] border-black shadow-[12px_12px_0px_rgba(0,0,0,1)]">
          <button 
            onClick={handleRun} 
            className="group flex-1 min-w-[200px] flex items-center justify-center gap-4 bg-[#F9FF00] text-black font-oswald font-black uppercase tracking-[0.2em] text-base py-5 border-[4px] border-black transition-all duration-300 hover:-translate-y-1 hover:bg-white active:translate-y-0 active:shadow-none"
          >
            <Play size={20} className="fill-current group-hover:scale-110 transition-transform" />
            EXECUTE_WORKBENCH_SEQUENCE
          </button>
          
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Copy, label: "COPY_RAW", action: handleCopy, color: "white" },
              { icon: Download, label: "SAVE_BUFFER", action: handleDownload, color: "white" },
              { icon: Trash2, label: "RESET_IDE", action: () => { setCode(""); setOutput(""); }, color: "#FF0004" },
            ].map((btn, i) => (
              <button 
                key={i} 
                onClick={btn.action} 
                className="group flex items-center gap-3 px-6 py-5 border-[3px] border-white/20 bg-[#1a1a1a] text-white font-oswald font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-black hover:border-black transition-all duration-300"
              >
                <btn.icon size={16} className="group-hover:scale-110 transition-transform" style={{ color: btn.color === "#FF0004" ? "#FF0004" : "inherit" }} />
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
