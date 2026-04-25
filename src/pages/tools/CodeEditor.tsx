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
      <div className={`max-w-6xl mx-auto transition-all ${isFullscreen ? "fixed inset-0 z-[100] bg-white p-6 overflow-auto" : ""}`}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-0 border-[3px] border-black bg-white">
            {LANGUAGES.map(lang => (
              <button
                key={lang.value}
                onClick={() => { setLanguage(lang.value); setCode(TEMPLATES[lang.value] || ""); setOutput(""); }}
                className={`px-4 py-2 font-oswald text-[10px] font-bold uppercase tracking-[0.2em] border-r-[3px] border-black last:border-r-0 transition-colors ${
                  language === lang.value ? "bg-black text-white" : "hover:bg-[#F9FF00]"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 border-[3px] border-black hover:bg-[#F9FF00] transition-colors">
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-[4px] border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] bg-[#0d0d0d]">
          {/* Line Numbers + Editor */}
          <div className="lg:col-span-8 border-r-[4px] border-black flex">
            <div className="w-12 bg-[#1a1a1a] border-r-[2px] border-black/50 py-4 flex flex-col items-center gap-1.5 opacity-30 select-none">
              {Array.from({ length: Math.max(20, code.split("\n").length) }).map((_, i) => (
                <span key={i} className="font-mono text-[10px] text-white">{i + 1}</span>
              ))}
            </div>
            <div className="flex-1 relative">
              <textarea
                className="w-full min-h-[500px] p-4 bg-transparent text-white font-mono text-sm outline-none resize-none leading-relaxed caret-[#F9FF00]"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Console / Preview Output */}
          <div className="lg:col-span-4 flex flex-col bg-[#111]">
            <div className="bg-black text-[#F9FF00] px-4 py-2 flex items-center justify-between border-b-[2px] border-white/10">
              <div className="flex items-center gap-2">
                <Terminal size={12} />
                <span className="font-oswald text-[10px] font-bold uppercase tracking-widest">
                  {language === "html" ? "Live Render" : "Workbench Output"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[8px] font-bold uppercase text-white/40">Realtime</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto bg-black">
              {language === "html" ? (
                <iframe
                  title="HTML Preview"
                  className="w-full h-full bg-white border-none"
                  srcDoc={code}
                />
              ) : (
                <pre className="p-4 font-mono text-xs text-white/70 whitespace-pre-wrap">
                  {output || "// Output will appear here after execution..."}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button onClick={handleRun} className="btn-brutal btn-brutal-yellow flex items-center gap-2 px-8">
            <Play size={18} />
            RUN WORKBENCH
          </button>
          <button onClick={handleCopy} className="btn-brutal bg-white flex items-center gap-2">
            <Copy size={16} />
            COPY
          </button>
          <button onClick={handleDownload} className="btn-brutal bg-white flex items-center gap-2">
            <Download size={16} />
            SAVE
          </button>
          <button onClick={() => { setCode(""); setOutput(""); }} className="btn-brutal bg-white flex items-center gap-2 text-[#FF0004]">
            <Trash2 size={16} />
            RESET
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
