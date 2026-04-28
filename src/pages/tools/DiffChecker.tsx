import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { 
  GitCompare, Search, LayoutGrid, LayoutList, 
  Trash2, Copy, FileText, ChevronRight, 
  CheckCircle2, AlertCircle, Sparkles, Filter
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

type DiffLine = { type: "same" | "added" | "removed"; text: string; lineA?: number; lineB?: number };

function computeDiff(a: string, b: string, ignoreWhitespace: boolean): DiffLine[] {
  const linesA = a.split("\n").map(l => ignoreWhitespace ? l.trimEnd() : l);
  const linesB = b.split("\n").map(l => ignoreWhitespace ? l.trimEnd() : l);
  const result: DiffLine[] = [];

  const m = linesA.length, n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = linesA[i] === linesB[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  let i = 0, j = 0, lineA = 1, lineB = 1;
  while (i < m || j < n) {
    if (i < m && j < n && linesA[i] === linesB[j]) {
      result.push({ type: "same", text: linesA[i], lineA: lineA++, lineB: lineB++ });
      i++; j++;
    } else if (j < n && (i >= m || dp[i][j + 1] >= dp[i + 1][j])) {
      result.push({ type: "added", text: linesB[j], lineB: lineB++ });
      j++;
    } else {
      result.push({ type: "removed", text: linesA[i], lineA: lineA++ });
      i++;
    }
  }
  return result;
}

export default function DiffChecker() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [viewMode, setViewMode] = useState<"SPLIT" | "UNIFIED">("SPLIT");
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(true);
  const [diff, setDiff] = useState<DiffLine[] | null>(null);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();

  const runCompare = () => {
    if (!textA && !textB) return;
    setDiff(computeDiff(textA, textB, ignoreWhitespace));
    showToast("Comparison computed.", "success");
  };

  const filteredDiff = useMemo(() => {
    if (!diff) return [];
    if (!search) return diff;
    return diff.filter(line => line.text.toLowerCase().includes(search.toLowerCase()));
  }, [diff, search]);

  const stats = useMemo(() => {
    if (!diff) return { added: 0, removed: 0, same: 0 };
    return {
      added: diff.filter(d => d.type === "added").length,
      removed: diff.filter(d => d.type === "removed").length,
      same: diff.filter(d => d.type === "same").length
    };
  }, [diff]);

  return (
    <ToolLayout toolId="diff-checker">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Input Interface */}
        {!diff ? (
          <div className="animate-slide-up">
             <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                   <div className="border-r-[4px] border-black">
                      <div className="px-6 py-4 border-b-[4px] border-black bg-[#FF0004]/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#FF0004]" />
                            <span className="font-oswald text-xs font-black uppercase tracking-widest">SOURCE_A (ORIGINAL)</span>
                         </div>
                         <button onClick={() => setTextA("")} className="font-oswald text-[10px] font-black opacity-30 hover:opacity-100 uppercase">CLEAR</button>
                      </div>
                      <textarea
                        value={textA}
                        onChange={e => setTextA(e.target.value)}
                        placeholder="Paste original source code or text..."
                        className="w-full h-96 p-8 font-mono text-xs font-bold bg-[#fafafa] outline-none resize-none focus:bg-white transition-all custom-scrollbar"
                      />
                   </div>
                   <div>
                      <div className="px-6 py-4 border-b-[4px] border-black bg-[#00FF87]/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-[#00FF87]" />
                            <span className="font-oswald text-xs font-black uppercase tracking-widest">SOURCE_B (MODIFIED)</span>
                         </div>
                         <button onClick={() => setTextB("")} className="font-oswald text-[10px] font-black opacity-30 hover:opacity-100 uppercase">CLEAR</button>
                      </div>
                      <textarea
                        value={textB}
                        onChange={e => setTextB(e.target.value)}
                        placeholder="Paste modified source code or text..."
                        className="w-full h-96 p-8 font-mono text-xs font-bold bg-[#fafafa] outline-none resize-none focus:bg-white transition-all custom-scrollbar"
                      />
                   </div>
                </div>
             </div>
             
             <div className="flex flex-col md:flex-row items-center gap-6">
                <button
                  onClick={runCompare}
                  className="w-full md:w-auto px-12 h-16 bg-black text-white border-[3px] border-black font-oswald font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4 hover:bg-[#7C3AED] transition-all shadow-[8px_8px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
                >
                  <GitCompare size={20} /> INITIATE_COMPARISON
                </button>
                <div className="flex items-center gap-4">
                   <button onClick={() => setIgnoreWhitespace(!ignoreWhitespace)} className="flex items-center gap-3 group">
                      <div className={`w-10 h-10 border-[3px] border-black flex items-center justify-center transition-all ${ignoreWhitespace ? "bg-black text-white" : "bg-white text-black"}`}>
                         {ignoreWhitespace ? <CheckCircle2 size={16} /> : <Filter size={16} className="opacity-20" />}
                      </div>
                      <span className="font-oswald text-[10px] font-black uppercase tracking-widest">IGNORE_WHITESPACE</span>
                   </button>
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-slide-up">
             
             {/* Header Toolbar */}
             <div className="bg-white border-[4px] border-black p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[12px_12px_0px_black]">
                <div className="flex flex-wrap gap-4">
                   <div className="flex items-center gap-0 border-[3px] border-black">
                      <button onClick={() => setViewMode("SPLIT")} className={`px-4 py-2 font-oswald text-[10px] font-black flex items-center gap-2 ${viewMode === "SPLIT" ? "bg-black text-white" : "hover:bg-black/5"}`}>
                         <LayoutGrid size={14} /> SPLIT
                      </button>
                      <button onClick={() => setViewMode("UNIFIED")} className={`px-4 py-2 font-oswald text-[10px] font-black border-l-[3px] border-black flex items-center gap-2 ${viewMode === "UNIFIED" ? "bg-black text-white" : "hover:bg-black/5"}`}>
                         <LayoutList size={14} /> UNIFIED
                      </button>
                   </div>
                   <div className="flex h-10 border-[3px] border-black bg-[#fafafa]">
                      <div className="px-3 flex items-center border-r-[3px] border-black"><Search size={14} className="opacity-30" /></div>
                      <input 
                        className="px-4 font-mono text-[10px] font-bold outline-none bg-transparent" 
                        placeholder="FILTER_DIFF..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                   </div>
                </div>

                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-4 px-4 py-2 bg-black text-white border-[3px] border-black">
                      <div className="flex items-center gap-2">
                         <span className="font-oswald text-sm font-black text-[#00FF87]">+{stats.added}</span>
                         <span className="font-oswald text-[9px] font-black opacity-40 uppercase">ADD</span>
                      </div>
                      <div className="w-px h-3 bg-white/20" />
                      <div className="flex items-center gap-2">
                         <span className="font-oswald text-sm font-black text-[#FF0004]">-{stats.removed}</span>
                         <span className="font-oswald text-[9px] font-black opacity-40 uppercase">REM</span>
                      </div>
                   </div>
                   <button onClick={() => setDiff(null)} className="w-10 h-10 border-[3px] border-black bg-[#F9FF00] flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1"><Trash2 size={16} /></button>
                </div>
             </div>

             {/* Result Container */}
             <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
                <div className="max-h-[700px] overflow-auto custom-scrollbar">
                   {viewMode === "SPLIT" ? (
                     <div className="grid grid-cols-[50px_1fr_50px_1fr] font-mono text-xs border-collapse">
                        {filteredDiff.map((line, i) => (
                           <div key={i} className="contents group">
                              {line.type === "same" ? (
                                <>
                                   <div className="px-2 py-1 text-black/30 text-right border-r border-black/10 select-none bg-[#fafafa]">{line.lineA}</div>
                                   <div className="px-4 py-1 border-r-[4px] border-black/5 whitespace-pre-wrap break-all opacity-40 group-hover:opacity-100 transition-opacity">{line.text || " "}</div>
                                   <div className="px-2 py-1 text-black/30 text-right border-r border-black/10 select-none bg-[#fafafa]">{line.lineB}</div>
                                   <div className="px-4 py-1 whitespace-pre-wrap break-all opacity-40 group-hover:opacity-100 transition-opacity">{line.text || " "}</div>
                                </>
                              ) : line.type === "removed" ? (
                                <>
                                   <div className="px-2 py-1 text-[#FF0004]/60 text-right border-r border-black/10 bg-[#FF0004]/5 select-none">{line.lineA}</div>
                                   <div className="px-4 py-1 border-r-[4px] border-black/5 bg-[#FF0004]/10 whitespace-pre-wrap break-all text-[#FF0004] font-bold border-l-[3px] border-[#FF0004]">{line.text || " "}</div>
                                   <div className="px-2 py-1 bg-[#fafafa] border-r border-black/10" />
                                   <div className="px-4 py-1 bg-[#fafafa]" />
                                </>
                              ) : (
                                <>
                                   <div className="px-2 py-1 bg-[#fafafa] border-r border-black/10" />
                                   <div className="px-4 py-1 bg-[#fafafa] border-r-[4px] border-black/5" />
                                   <div className="px-2 py-1 text-[#059669]/60 text-right border-r border-black/10 bg-[#00FF87]/5 select-none">{line.lineB}</div>
                                   <div className="px-4 py-1 bg-[#00FF87]/10 whitespace-pre-wrap break-all text-[#059669] font-bold border-l-[3px] border-[#00FF87]">{line.text || " "}</div>
                                </>
                              )}
                           </div>
                        ))}
                     </div>
                   ) : (
                     <div className="grid grid-cols-[60px_1fr] font-mono text-xs border-collapse">
                        {filteredDiff.map((line, i) => (
                           <div key={i} className={`contents ${line.type === 'removed' ? 'bg-[#FF0004]/10' : line.type === 'added' ? 'bg-[#00FF87]/10' : ''}`}>
                              <div className={`px-3 py-1 text-right border-r border-black/10 select-none font-bold ${line.type === 'removed' ? 'text-[#FF0004]' : line.type === 'added' ? 'text-[#059669]' : 'text-black/30'}`}>
                                 {line.type === 'removed' ? '-' : line.type === 'added' ? '+' : ' '}
                              </div>
                              <div className={`px-6 py-1 whitespace-pre-wrap break-all ${line.type === 'removed' ? 'text-[#FF0004]' : line.type === 'added' ? 'text-[#059669]' : 'opacity-40'}`}>
                                 {line.text || " "}
                              </div>
                           </div>
                        ))}
                     </div>
                   )}
                </div>
             </div>

             <div className="flex items-center gap-4 p-8 bg-[#1a1a1a] border-[4px] border-black text-white">
                <Sparkles size={24} className="text-[#F9FF00] shrink-0" />
                <p className="font-inter text-[10px] font-bold uppercase tracking-widest opacity-60 leading-relaxed">
                   Analysis complete. {stats.same} Identical lines detected. Comparison utilizes standard Levenshtein-optimized LCS logic for highest accuracy.
                </p>
             </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
