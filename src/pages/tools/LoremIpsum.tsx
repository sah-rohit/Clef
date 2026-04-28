import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { 
  Type, RefreshCw, Copy, Code, List, 
  Layout, Image as ImageIcon, Settings2,
  Sparkles, Terminal, FileCode, CheckCircle2
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function generateWords(count: number): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) result.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
  return result.join(" ");
}

function generateSentences(count: number): string {
  return Array.from({ length: count }, () => {
    const wordCount = 8 + Math.floor(Math.random() * 12);
    const sentence = generateWords(wordCount);
    return sentence + ".";
  }).join(" ");
}

function generateParagraphs(count: number): string {
  return Array.from({ length: count }, () => generateSentences(3 + Math.floor(Math.random() * 4))).join("\n\n");
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words" | "list" | "headings">("paragraphs");
  const [useHtml, setUseHtml] = useState(false);
  const [output, setOutput] = useState("");
  const { showToast } = useToast();

  const generate = () => {
    let result = "";
    if (type === "paragraphs") {
      result = useHtml 
        ? Array.from({ length: count }, () => `<p>${generateSentences(3 + Math.floor(Math.random() * 4))}</p>`).join("\n")
        : generateParagraphs(count);
    } else if (type === "sentences") {
      result = generateSentences(count);
    } else if (type === "words") {
      result = generateWords(count);
    } else if (type === "list") {
      const items = Array.from({ length: count }, () => generateWords(3 + Math.floor(Math.random() * 5)));
      result = useHtml 
        ? `<ul>\n${items.map(i => `  <li>${i}</li>`).join("\n")}\n</ul>`
        : items.map(i => `• ${i}`).join("\n");
    } else if (type === "headings") {
      result = useHtml
        ? Array.from({ length: count }, (_, i) => `<h${(i % 3) + 1}>${generateWords(3 + Math.floor(Math.random() * 3))}</h${(i % 3) + 1}>`).join("\n")
        : Array.from({ length: count }, () => generateWords(3 + Math.floor(Math.random() * 3)).toUpperCase()).join("\n");
    }
    setOutput(result);
    showToast("Segments generated.", "success");
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    showToast("Copied to clipboard.", "success");
  };

  return (
    <ToolLayout toolId="lorem-ipsum">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Output Console */}
        <div className="bg-white border-[4px] border-black shadow-[16px_16px_0px_black] overflow-hidden">
           <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b-[4px] border-black">
              <div className="flex items-center gap-3">
                 <Terminal size={18} className="text-[#F9FF00]" />
                 <span className="font-oswald text-sm font-black uppercase tracking-widest">TYPOGRAPHY_OUTPUT</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00FF87] rounded-full animate-pulse" />
                    <span className="font-mono text-[8px] text-[#00FF87] font-bold">BUFFER_READY</span>
                 </div>
                 <div className="w-px h-4 bg-white/20" />
                 <span className="font-mono text-[10px] font-bold text-white/40 uppercase">{output.length} CHARS</span>
              </div>
           </div>

           <div className="p-8 bg-[#fafafa]">
              <div className="w-full h-96 border-[3px] border-black p-8 font-inter text-sm leading-relaxed bg-white overflow-y-auto whitespace-pre-wrap custom-scrollbar selection:bg-[#F9FF00] selection:text-black">
                 {output || <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale gap-4"><Type size={64} /><p className="font-oswald text-2xl font-black uppercase tracking-[0.3em]">AWAITING_GEN</p></div>}
              </div>
           </div>

           <div className="p-6 bg-black flex flex-col md:flex-row gap-4">
              <button onClick={generate} className="flex-1 py-4 bg-[#F9FF00] text-black font-oswald font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[6px_6px_0px_rgba(249,255,0,0.2)] active:shadow-none active:translate-y-1">
                 <RefreshCw size={16} /> GENERATE_NEW_STREAM
              </button>
              <button onClick={copy} disabled={!output} className="px-10 py-4 border-[3px] border-white/20 text-white font-oswald font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:border-white transition-all disabled:opacity-20 disabled:cursor-not-allowed">
                 <Copy size={16} /> EXPORT_TO_CLIPBOARD
              </button>
           </div>
        </div>

        {/* Workbench Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Segment Controls */}
           <div className="lg:col-span-8 bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_black] space-y-10">
              <div className="flex items-center gap-3 mb-2">
                 <Settings2 size={20} className="text-[#FF0004]" />
                 <h2 className="font-oswald text-2xl font-black uppercase">WORKBENCH_CONFIG</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {(["paragraphs", "sentences", "words", "list", "headings"] as const).map(t => (
                   <button 
                     key={t} 
                     onClick={() => setType(t)} 
                     className={`p-4 border-[3px] border-black transition-all flex flex-col items-center gap-3 ${type === t ? "bg-[#F9FF00] shadow-[4px_4px_0px_black] -translate-x-1 -translate-y-1" : "bg-white hover:bg-[#F9FF00]/10"}`}
                   >
                      {t === "paragraphs" && <Layout size={16} />}
                      {t === "sentences" && <Type size={16} />}
                      {t === "words" && <Sparkles size={16} />}
                      {t === "list" && <List size={16} />}
                      {t === "headings" && <FileCode size={16} />}
                      <span className="font-oswald text-[10px] font-black uppercase">{t}</span>
                   </button>
                 ))}
              </div>

              <div className="flex flex-col md:flex-row gap-10">
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                       <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">SEGMENT_COUNT</label>
                       <span className="font-mono text-xl font-black">{count}</span>
                    </div>
                    <input type="range" min={1} max={50} value={count} onChange={e => setCount(+e.target.value)} className="w-full h-8 bg-black/5 rounded-none appearance-none cursor-pointer border-[2px] border-black" />
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <button onClick={() => setUseHtml(!useHtml)} className="flex items-center gap-4 group">
                       <div className={`w-12 h-12 border-[3px] border-black flex items-center justify-center transition-all ${useHtml ? "bg-black text-white" : "bg-white text-black"}`}>
                          <Code size={20} />
                       </div>
                       <div>
                          <h4 className="font-oswald text-[10px] font-black uppercase">SEMANTIC_HTML</h4>
                          <p className="font-inter text-[8px] font-bold opacity-30 uppercase">WRAP_IN_TAGS</p>
                       </div>
                    </button>
                 </div>
              </div>
           </div>

           {/* Asset Placeholders */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#1a1a1a] text-white p-8 border-[4px] border-black shadow-[12px_12px_0px_black]">
                 <h3 className="font-oswald text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3 text-[#00FF87]"><ImageIcon size={18} /> ASSET_PLACEHOLDERS</h3>
                 <div className="space-y-4">
                    <button 
                      onClick={() => { setOutput(`https://picsum.photos/800/600`); showToast("Placeholder URL generated.", "info"); }}
                      className="w-full p-4 border-[2px] border-white/10 hover:bg-white/5 transition-all text-left flex items-center justify-between group"
                    >
                       <span className="font-mono text-[10px] font-bold uppercase">Generic_800x600</span>
                       <ImageIcon size={12} className="opacity-20 group-hover:opacity-100" />
                    </button>
                    <button 
                      onClick={() => { setOutput(`https://placehold.co/1200x800?text=UI_MOCKUP`); showToast("Placeholder URL generated.", "info"); }}
                      className="w-full p-4 border-[2px] border-white/10 hover:bg-white/5 transition-all text-left flex items-center justify-between group"
                    >
                       <span className="font-mono text-[10px] font-bold uppercase">Mockup_1200x800</span>
                       <ImageIcon size={12} className="opacity-20 group-hover:opacity-100" />
                    </button>
                 </div>
              </div>
              
              <div className="bg-white border-[4px] border-black p-8">
                 <div className="flex items-center gap-3 mb-6">
                    <CheckCircle2 size={18} className="text-[#00FF87]" />
                    <h4 className="font-oswald text-[10px] font-black uppercase">DEVELOPER_READY</h4>
                 </div>
                 <p className="font-inter text-[9px] font-bold text-black/40 uppercase leading-relaxed">
                    Optimized for rapid UI prototyping. Use Semantic HTML mode for direct integration into JSX or HTML templates.
                 </p>
              </div>
           </div>

        </div>
      </div>
    </ToolLayout>
  );
}
