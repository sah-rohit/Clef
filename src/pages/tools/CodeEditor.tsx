import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Play, Copy, Trash2, Download, Terminal, Maximize2, Minimize2, Share2, Save, History } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const LANGUAGES = [
  { value: "javascript", label: "JAVASCRIPT", ext: "js" },
  { value: "html", label: "HTML", ext: "html" },
  { value: "css", label: "CSS", ext: "css" },
  { value: "json", label: "JSON", ext: "json" },
  { value: "sql", label: "SQL", ext: "sql" },
];

const TEMPLATES: Record<string, string> = {
  javascript: `// Clef JS Workbench\nconst greeting = "Hello from Clef AI!";\nconsole.log(greeting);\n\nconst numbers = [1, 2, 3, 4, 5];\nconst squares = numbers.map(n => n * n);\nconsole.log("Squares:", squares);`,
  html: `<!DOCTYPE html>\n<html>\n<head>\n  <style>\n    body { background: #F9FF00; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }\n    .card { border: 4px solid black; padding: 2rem; background: white; box-shadow: 10px 10px 0 black; }\n  </style>\n</head>\n<body>\n  <div class="card">\n    <h1>Welcome to Clef</h1>\n    <p>Your daily workbench for code, text, and color.</p>\n  </div>\n</body>\n</html>`,
  css: `.clef-workbench {\n  border: 4px solid black;\n  background: #F9FF00;\n  padding: 32px;\n  font-weight: 900;\n  text-transform: uppercase;\n  box-shadow: 12px 12px 0 black;\n}`,
  json: `{\n  "project": "Clef",\n  "author": "Sonata Interactive",\n  "status": "Active",\n  "version": "1.5.0"\n}`,
  sql: `CREATE TABLE users (id INT, name TEXT);\nINSERT INTO users VALUES (1, 'Clef User');\nSELECT * FROM users;`,
};

export default function CodeEditor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { showToast } = useToast();

  // ── Load Code (URL Share or Local Storage) ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedCode = params.get("code");
    const savedCode = localStorage.getItem(`clef_code_${language}`);
    
    if (sharedCode) {
      try {
        const decoded = atob(sharedCode);
        setCode(decoded);
        showToast("Shared code loaded.", "info");
        // Clear param to avoid re-loading on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        setCode(savedCode || TEMPLATES[language]);
      }
    } else {
      setCode(savedCode || TEMPLATES[language]);
    }
  }, [language]);

  // ── Auto-Save ──
  useEffect(() => {
    if (code) {
      localStorage.setItem(`clef_code_${language}`, code);
    }
  }, [code, language]);

  const handleRun = () => {
    if (language === "javascript") {
      try {
        const logs: string[] = [];
        const mockConsole = {
          log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(" ")),
          error: (...args: any[]) => logs.push("❌ " + args.join(" ")),
          warn: (...args: any[]) => logs.push("⚠️ " + args.join(" ")),
        };
        const fn = new Function("console", code);
        fn(mockConsole);
        setOutput(logs.join("\n") || "> System ready. No output buffers received.");
        showToast("Execution complete.", "success");
      } catch (err: any) {
        setOutput("❌ RUNTIME_ERROR: " + err.message);
        showToast("Execution failed.", "error");
      }
    } else {
      setOutput(`// ${language.toUpperCase()} preview mode.\n// Native runtime execution coming soon.`);
      showToast("Previewing buffer.", "info");
    }
  };

  const handleShare = () => {
    const encoded = btoa(code);
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    navigator.clipboard.writeText(url);
    showToast("Shareable URL copied!", "success");
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
    showToast("Buffer saved to disk.", "success");
  };

  return (
    <ToolLayout toolId="code-editor">
      <div className={`flex flex-col gap-8 transition-all ${isFullscreen ? "fixed inset-0 z-[1000] bg-white p-12 overflow-auto" : ""}`}>
        {/* Advanced IDE Header */}
        <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b-[2px] border-black/5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-0 border-[3px] border-black bg-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`px-5 py-3 font-oswald text-[10px] font-black uppercase tracking-[0.2em] border-r-[3px] border-black last:border-r-0 transition-all duration-200 ${
                    language === lang.value ? "bg-[#F9FF00] text-black" : "text-white/40 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="group p-3 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1" title="Share Project">
              <Share2 size={18} />
            </button>
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="group p-3 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        {/* IDE Environment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-[4px] border-black bg-[#0d0d0d] overflow-hidden shadow-[16px_16px_0px_black]">
           {/* Editor Surface */}
           <div className="lg:col-span-8 border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black flex flex-col">
              <div className="bg-[#1a1a1a] px-5 py-3 border-b-[2px] border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-[#F9FF00] rounded-full" />
                   <span className="font-oswald text-[10px] font-black uppercase tracking-[0.2em] text-white/60">PRIMARY_BUFFER</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5 opacity-30">
                     <Save size={10} className="text-white" />
                     <span className="font-mono text-[8px] text-white">AUTOSAVE_ACTIVE</span>
                   </div>
                 </div>
              </div>
              <div className="flex flex-1">
                <div className="w-12 bg-black border-r border-white/5 py-6 flex flex-col items-center gap-1.5 select-none shrink-0 opacity-20">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <span key={i} className="font-mono text-[9px] font-bold text-white">{i + 1}</span>
                  ))}
                </div>
                <textarea
                  className="w-full h-[600px] p-8 font-mono text-[14px] text-[#e5e5e5] bg-transparent outline-none resize-none leading-relaxed caret-[#F9FF00] custom-scrollbar"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                />
              </div>
           </div>

           {/* Console Surface */}
           <div className="lg:col-span-4 flex flex-col bg-[#111]">
              <div className="bg-[#1a1a1a] text-[#F9FF00] px-5 py-3 flex items-center justify-between border-b-[3px] border-black">
                <div className="flex items-center gap-3">
                  <Terminal size={14} />
                  <span className="font-oswald text-[10px] font-black uppercase tracking-[0.2em]">IO_CONSOLE</span>
                </div>
                <button onClick={() => setOutput("")} className="opacity-40 hover:opacity-100 transition-all"><History size={12} /></button>
              </div>
              <div className="flex-1 overflow-auto bg-black p-8 font-mono text-[11px] leading-relaxed relative">
                 {language === "html" ? (
                   <iframe title="HTML Preview" className="w-full h-full bg-white border-none" srcDoc={code} />
                 ) : (
                   <pre className="text-[#F9FF00] whitespace-pre-wrap">{output || "> Buffer ready for initialization."}</pre>
                 )}
                 <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
              </div>
           </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-wrap items-center gap-4 py-8 px-8 bg-black border-[4px] border-black shadow-[12px_12px_0px_black]">
           <button 
             onClick={handleRun} 
             className="flex-1 min-w-[200px] flex items-center justify-center gap-4 bg-[#F9FF00] text-black font-oswald font-black uppercase tracking-[0.2em] py-5 border-[4px] border-black transition-all hover:-translate-y-1 hover:bg-white active:translate-y-0"
           >
             <Play size={20} className="fill-current" />
             INITIALIZE_EXECUTION_SEQUENCE
           </button>
           <button onClick={handleDownload} className="px-8 py-5 bg-[#1a1a1a] text-white border-[3px] border-white/20 font-oswald font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black hover:border-black transition-all">
             SAVE_TO_DISK
           </button>
           <button onClick={() => { if(confirm("Erase current buffer?")) setCode(""); }} className="px-8 py-5 bg-[#1a1a1a] text-[#FF0004] border-[3px] border-[#FF0004]/20 font-oswald font-black uppercase tracking-widest text-[11px] hover:bg-[#FF0004] hover:text-white hover:border-black transition-all">
             WIPE_BUFFER
           </button>
        </div>
      </div>
    </ToolLayout>
  );
}
