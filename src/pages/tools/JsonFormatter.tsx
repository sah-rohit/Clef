import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, Minimize2, CheckCircle, AlertCircle, ListTree, FileText, Search, ChevronRight, ChevronDown } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

// ── Tree Node Component ──
function JsonTreeNode({ data, label, depth = 0, isLast = true, searchQuery = "" }: { data: any, label?: string, depth?: number, isLast?: boolean, searchQuery?: string }) {
  const [isOpen, setIsOpen] = useState(true);
  
  const isObject = data !== null && typeof data === "object";
  const isArray = Array.isArray(data);
  const type = isArray ? "array" : typeof data;
  
  const shouldHighlight = searchQuery && (
    (label?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (!isObject && String(data).toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isObject) {
    return (
      <div className={`flex items-start gap-2 py-0.5 font-mono text-[13px] ${shouldHighlight ? "bg-[#F9FF00]/20" : ""}`} style={{ paddingLeft: `${depth * 20}px` }}>
        {label && <span className="text-[#00E5FF]">{label}:</span>}
        <span className={type === "string" ? "text-[#00FF87]" : type === "number" ? "text-[#F9FF00]" : "text-white/60"}>
          {type === "string" ? `"${data}"` : String(data)}
          {!isLast && <span className="text-white/20">,</span>}
        </span>
      </div>
    );
  }

  const entries = Object.entries(data);
  const isEmpty = entries.length === 0;

  return (
    <div className="flex flex-col">
      <div 
        className={`flex items-center gap-2 py-0.5 cursor-pointer hover:bg-white/5 transition-colors font-mono text-[13px] ${shouldHighlight ? "bg-[#F9FF00]/20" : ""}`}
        style={{ paddingLeft: `${depth * 20}px` }}
        onClick={() => !isEmpty && setIsOpen(!isOpen)}
      >
        {!isEmpty ? (isOpen ? <ChevronDown size={14} className="opacity-40" /> : <ChevronRight size={14} className="opacity-40" />) : <div className="w-[14px]" />}
        {label && <span className="text-[#00E5FF]">{label}:</span>}
        <span className="text-white/40">{isArray ? "[" : "{"}</span>
        {!isOpen && <span className="text-white/20">...{isArray ? "]" : "}"}</span>}
        {isOpen && isEmpty && <span className="text-white/40">{isArray ? "]" : "}"}</span>}
      </div>
      
      {isOpen && !isEmpty && (
        <>
          {entries.map(([key, value], i) => (
            <JsonTreeNode 
              key={key} 
              data={value} 
              label={isArray ? undefined : key} 
              depth={depth + 1} 
              isLast={i === entries.length - 1} 
              searchQuery={searchQuery}
            />
          ))}
          <div className="font-mono text-[13px] text-white/40 py-0.5" style={{ paddingLeft: `${depth * 20}px` }}>
            {isArray ? "]" : "}"}
            {!isLast && <span className="text-white/20">,</span>}
          </div>
        </>
      )}
    </div>
  );
}

export default function JsonFormatter() {
  const [input, setInput] = useState('{\n  "project": "Clef",\n  "version": "1.2.0",\n  "status": "Production",\n  "features": [\n    "IDE-Grade Editor",\n    "PDF Workbench",\n    "Cyber Brutalist UI"\n  ],\n  "metadata": {\n    "author": "Sonata",\n    "license": "MIT"\n  }\n}');
  const [output, setOutput] = useState("");
  const [viewMode, setViewMode] = useState<"text" | "tree">("text");
  const [searchQuery, setSearchQuery] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const { showToast } = useToast();

  const parsedData = useMemo(() => {
    try {
      return JSON.parse(input);
    } catch (e) {
      return null;
    }
  }, [input]);

  const handleFormat = () => {
    if (parsedData) {
      setOutput(JSON.stringify(parsedData, null, indentSize));
      setIsValid(true);
      showToast("JSON formatted successfully!", "success");
    } else {
      setIsValid(false);
      showToast("Invalid JSON syntax.", "error");
    }
  };

  const handleMinify = () => {
    if (parsedData) {
      setOutput(JSON.stringify(parsedData));
      setIsValid(true);
      showToast("JSON minified!", "success");
    } else {
      setIsValid(false);
    }
  };

  return (
    <ToolLayout toolId="json-formatter">
      <div className="flex flex-col gap-8">
        {/* Advanced Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-8 pb-8 border-b-[3px] border-black/10">
          <div className="flex flex-wrap gap-4">
            <button onClick={handleFormat} className="group btn-brutal btn-brutal-yellow py-3.5 px-8 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
              <CheckCircle size={20} />
              <span className="font-oswald text-sm font-bold">FORMAT_BUFFER</span>
            </button>
            <button onClick={handleMinify} className="group btn-brutal btn-brutal-black py-3.5 px-8 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
              <Minimize2 size={20} />
              <span className="font-oswald text-sm font-bold">MINIFY_BUFFER</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 border-[3px] border-black bg-black">
             {[
               { id: "text", label: "TEXT_VIEW", icon: FileText },
               { id: "tree", label: "TREE_VIEW", icon: ListTree }
             ].map(mode => (
               <button 
                 key={mode.id}
                 onClick={() => setViewMode(mode.id as any)}
                 className={`px-5 py-2.5 flex items-center gap-3 font-oswald text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === mode.id ? "bg-[#F9FF00] text-black" : "text-white/40 hover:text-white"}`}
               >
                 <mode.icon size={14} />
                 {mode.label}
               </button>
             ))}
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 flex items-center gap-4 bg-black/5 p-4 border-[2px] border-black/10">
             <Search size={18} className="opacity-40" />
             <input 
               type="text" 
               placeholder="SEARCH_BUFFER..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent border-none outline-none font-mono text-xs w-full placeholder:opacity-20"
             />
          </div>
          <div className="md:col-span-4 flex items-center justify-between px-6 bg-black text-white border-[2px] border-black">
             <span className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">INDENT_SIZE</span>
             <div className="flex gap-4">
               {[2, 4].map(s => (
                 <button key={s} onClick={() => setIndentSize(s)} className={`font-mono text-xs font-bold ${indentSize === s ? "text-[#F9FF00]" : "text-white/40 hover:text-white"}`}>
                   {s}SP
                 </button>
               ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Input Panel */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <span className="font-oswald text-xs font-black uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FF0004]" /> RAW_INPUT
              </span>
              <span className="font-mono text-[9px] opacity-40 uppercase">{input.length} CHR</span>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-focus-within:translate-x-3 group-focus-within:translate-y-3 transition-all duration-300" />
              <div className="relative border-[4px] border-black bg-white overflow-hidden">
                <textarea 
                  className="w-full h-[600px] p-8 font-mono text-[13px] outline-none resize-none bg-[#fdfdfd] focus:bg-white transition-colors custom-scrollbar leading-relaxed" 
                  value={input} 
                  onChange={(e) => { setInput(e.target.value); setIsValid(null); }} 
                  spellCheck={false} 
                  placeholder="Paste your JSON string here..."
                />
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <span className="font-oswald text-xs font-black uppercase tracking-widest flex items-center gap-3">
                <div className="w-2 h-2 bg-[#00FF87]" /> PROCESSED_BUFFER
              </span>
              <button 
                onClick={() => { navigator.clipboard.writeText(output || JSON.stringify(parsedData, null, 2)); showToast("Copied to clipboard!", "success"); }}
                className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-[#00E5FF] transition-all"
              >
                COPY_BUFFER
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-[#F9FF00] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300 border-[2px] border-black" />
              <div className="relative border-[4px] border-black bg-[#1a1a1a] overflow-hidden flex flex-col">
                <div className="flex-1 h-[600px] overflow-auto custom-scrollbar p-8">
                  {viewMode === "text" ? (
                    <pre className="font-mono text-[13px] text-[#F9FF00] whitespace-pre leading-relaxed">
                      {output || "// Click FORMAT to visualize data..."}
                    </pre>
                  ) : (
                    <div className="animate-fade-in">
                      {parsedData ? (
                        <JsonTreeNode data={parsedData} searchQuery={searchQuery} />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-20">
                           <AlertCircle size={40} className="mb-4" />
                           <span className="font-oswald text-xs font-black uppercase tracking-widest">INVALID_JSON_FOR_TREE_VIEW</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
