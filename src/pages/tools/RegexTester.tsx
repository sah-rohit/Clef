import { useState, useMemo, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { 
  Library, Info, ChevronRight, Copy, RotateCcw, 
  Settings2, Hash, FileText, CheckCircle2, AlertCircle,
  Scissors, Search, BookOpen, Sparkles
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import gsap from "gsap";

const REGEX_LIBRARY = [
  { name: "Email Address", pattern: "\\b[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}\\b", desc: "Standard email validation" },
  { name: "URL (HTTP/S)", pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)", desc: "Web URL with optional protocol" },
  { name: "IPv4 Address", pattern: "\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b", desc: "Validate dotted-decimal IPv4" },
  { name: "Date (YYYY-MM-DD)", pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", desc: "ISO 8601 date format" },
  { name: "Credit Card", pattern: "\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})\\b", desc: "Luhn-compatible CC numbers" },
  { name: "Password (Strong)", pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", desc: "Min 8 chars, 1 upper, 1 lower, 1 number, 1 special" },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [testString, setTestString] = useState("Contact us at hello@clef.pages.dev or support@example.com.\nYou can also reach admin@test.org for security inquiries.");
  const [substitution, setSubstitution] = useState("");
  const [activeTab, setActiveTab] = useState<"TEST" | "SUBSTITUTE" | "LIBRARY">("TEST");
  const { showToast } = useToast();

  const matches = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const results: { match: string; index: number; groups?: Record<string, string> }[] = [];
      let m;
      const limit = 500;
      let count = 0;
      
      // We need to use a fresh regex for exec to reset lastIndex
      const execRegex = new RegExp(pattern, flags);
      
      if (flags.includes("g")) {
        while ((m = execRegex.exec(testString)) !== null && count < limit) {
          results.push({ match: m[0], index: m.index, groups: m.groups });
          count++;
          if (m[0].length === 0) execRegex.lastIndex++; // Avoid infinite loop on zero-length matches
        }
      } else {
        m = execRegex.exec(testString);
        if (m) results.push({ match: m[0], index: m.index, groups: m.groups });
      }
      return { results, error: null };
    } catch (err) {
      return { results: [], error: (err instanceof Error ? err.message : "Invalid regex") };
    }
  }, [pattern, flags, testString]);

  const highlightedText = useMemo(() => {
    if (matches.error || matches.results.length === 0) return testString;
    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, (match) => 
        `<mark class="bg-[#F9FF00] border-b-[3px] border-[#FF0004] px-0.5 rounded-sm font-bold text-black">${match}</mark>`
      );
    } catch {
      return testString;
    }
  }, [testString, pattern, flags, matches]);

  const replacedText = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, substitution);
    } catch {
      return testString;
    }
  }, [testString, pattern, flags, substitution]);

  const flagOptions = [
    { flag: "g", label: "Global", desc: "Don't return after first match" },
    { flag: "i", label: "Insensitive", desc: "Case-insensitive matching" },
    { flag: "m", label: "Multiline", desc: "^ and $ match start/end of lines" },
    { flag: "s", label: "Single Line", desc: "Dot (.) matches newlines" },
  ];

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  const copyResults = () => {
    const text = matches.results.map(m => m.match).join("\n");
    navigator.clipboard.writeText(text);
    showToast("Copied matches.", "success");
  };

  return (
    <ToolLayout toolId="regex-tester">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Pattern Input Workbench */}
        <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_black]">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F9FF00] border-[3px] border-black flex items-center justify-center shrink-0">
                 <Search size={20} />
              </div>
              <div>
                 <h2 className="font-oswald text-2xl font-black uppercase">PATTERN_BUILDER</h2>
                 <p className="font-inter text-[10px] font-bold opacity-30 tracking-widest uppercase">REAL_TIME_COMPILATION</p>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-0 group">
                 <div className="h-14 px-5 bg-black text-white flex items-center font-mono text-xl border-[3px] border-black">/</div>
                 <input 
                   className="flex-1 h-14 border-y-[3px] border-black px-6 font-mono text-lg font-bold bg-[#fafafa] focus:bg-white outline-none transition-all placeholder:opacity-20" 
                   value={pattern} 
                   onChange={(e) => setPattern(e.target.value)}
                   placeholder="Enter regex pattern..."
                 />
                 <div className="h-14 px-5 bg-black text-white flex items-center font-mono text-xl border-[3px] border-black">/{flags}</div>
              </div>
              <div className="flex gap-2">
                 {flagOptions.map(f => (
                   <button 
                     key={f.flag} 
                     onClick={() => toggleFlag(f.flag)} 
                     title={f.desc}
                     className={`w-12 h-14 border-[3px] border-black font-mono font-black text-lg flex items-center justify-center transition-all ${flags.includes(f.flag) ? "bg-[#F9FF00] shadow-[4px_4px_0px_black] -translate-x-1 -translate-y-1" : "bg-white hover:bg-[#F9FF00]/20"}`}
                   >
                     {f.flag}
                   </button>
                 ))}
              </div>
           </div>

           {matches.error && (
             <div className="mt-4 p-4 bg-[#FF0004]/10 border-[3px] border-[#FF0004] flex items-center gap-3 animate-shake">
                <AlertCircle className="text-[#FF0004]" size={18} />
                <span className="font-mono text-xs font-bold text-[#FF0004]">{matches.error}</span>
             </div>
           )}
        </div>

        {/* Workspace Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left Column: Test & Replace */}
           <div className="lg:col-span-8 space-y-8">
              <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
                 <div className="flex border-b-[4px] border-black">
                    {(["TEST", "SUBSTITUTE", "LIBRARY"] as const).map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-8 py-4 font-oswald text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === tab ? "bg-black text-white" : "hover:bg-black/5"}`}
                      >
                        {tab}
                      </button>
                    ))}
                 </div>

                 <div className="p-8">
                    {activeTab === "TEST" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                               <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2"><FileText size={12} /> TEST_STRING</label>
                               <button onClick={() => setTestString("")} className="font-oswald text-[10px] font-black uppercase hover:text-[#FF0004] transition-colors">CLEAR</button>
                            </div>
                            <textarea 
                              className="w-full h-80 border-[3px] border-black p-6 font-mono text-sm font-bold bg-[#fafafa] outline-none resize-none focus:bg-white transition-all custom-scrollbar"
                              value={testString}
                              onChange={(e) => setTestString(e.target.value)}
                            />
                         </div>
                         <div className="space-y-4">
                            <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2"><Sparkles size={12} /> HIGHLIGHTED_VIEW</label>
                            <div 
                              className="w-full h-80 border-[3px] border-black p-6 font-mono text-sm font-bold bg-white overflow-y-auto whitespace-pre-wrap custom-scrollbar"
                              dangerouslySetInnerHTML={{ __html: highlightedText }}
                            />
                         </div>
                      </div>
                    )}

                    {activeTab === "SUBSTITUTE" && (
                      <div className="space-y-8 animate-slide-up">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">REPLACEMENT_VALUE</label>
                               <input 
                                 className="w-full border-[3px] border-black p-4 font-mono text-sm font-bold bg-[#fafafa]"
                                 value={substitution}
                                 onChange={(e) => setSubstitution(e.target.value)}
                                 placeholder="Enter replacement string (e.g. $1, $2)..."
                               />
                            </div>
                            <div className="flex items-end">
                               <div className="p-4 bg-[#00FF87]/10 border-[3px] border-[#00FF87] flex-1">
                                  <p className="font-inter text-[10px] font-black text-[#00FF87] uppercase">TIP: Use $1, $2 for capture groups.</p>
                               </div>
                            </div>
                         </div>
                         <div className="space-y-4">
                            <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">RESULTING_OUTPUT</label>
                            <div className="w-full h-60 border-[3px] border-black p-6 font-mono text-sm font-bold bg-white overflow-y-auto whitespace-pre-wrap custom-scrollbar">
                               {replacedText}
                            </div>
                         </div>
                      </div>
                    )}

                    {activeTab === "LIBRARY" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                         {REGEX_LIBRARY.map(item => (
                           <button 
                             key={item.name}
                             onClick={() => { setPattern(item.pattern); setActiveTab("TEST"); showToast(`Loaded ${item.name}`, "info"); }}
                             className="text-left p-6 border-[3px] border-black bg-white hover:bg-[#F9FF00]/10 transition-all group"
                           >
                              <div className="flex items-center justify-between mb-2">
                                 <h4 className="font-oswald text-sm font-black uppercase group-hover:text-[#FF0004] transition-colors">{item.name}</h4>
                                 <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="font-inter text-[10px] text-black/50 font-bold uppercase mb-4">{item.desc}</p>
                              <code className="block bg-black/5 p-2 font-mono text-[9px] font-bold break-all opacity-40 group-hover:opacity-100">{item.pattern}</code>
                           </button>
                         ))}
                      </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Right Column: Results & Info */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-black text-white border-[4px] border-black shadow-[12px_12px_0px_rgba(0,0,0,0.2)]">
                 <div className="p-6 border-b-[2px] border-white/10 flex items-center justify-between">
                    <h3 className="font-oswald text-lg font-black uppercase tracking-widest flex items-center gap-3"><Hash size={20} /> MATCH_DATA</h3>
                    <div className="px-3 py-1 bg-[#F9FF00] text-black font-oswald text-[10px] font-black">{matches.results.length} UNITS</div>
                 </div>
                 <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    {matches.results.length === 0 ? (
                      <div className="p-12 text-center opacity-20">
                         <Search className="m-auto mb-4" size={32} />
                         <p className="font-oswald text-xs font-black uppercase tracking-widest">NO_MATCHES_FOUND</p>
                      </div>
                    ) : (
                      matches.results.map((m, i) => (
                        <div key={i} className="p-5 border-b-[1px] border-white/10 hover:bg-white/5 transition-colors group">
                           <div className="flex items-center justify-between mb-3">
                              <span className="font-oswald text-[10px] font-black text-[#F9FF00] uppercase">BLOCK_{String(i+1).padStart(3, '0')}</span>
                              <span className="font-mono text-[9px] opacity-30 uppercase tracking-tighter">POS: {m.index}</span>
                           </div>
                           <p className="font-mono text-sm font-bold bg-white/10 p-3 break-all border-l-[3px] border-[#F9FF00] group-hover:bg-[#F9FF00] group-hover:text-black transition-all">{m.match}</p>
                        </div>
                      ))
                    )}
                 </div>
                 {matches.results.length > 0 && (
                   <div className="p-6 border-t-[2px] border-white/10">
                      <button onClick={copyResults} className="w-full py-4 bg-[#F9FF00] text-black font-oswald font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all">
                         <Copy size={14} /> EXPORT_MATCHES
                      </button>
                   </div>
                 )}
              </div>

              <div className="bg-white border-[4px] border-black p-8">
                 <h3 className="font-oswald text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-3"><BookOpen size={20} /> CHEAT_SHEET</h3>
                 <div className="space-y-4">
                    {[
                      { k: ".", v: "Any character" },
                      { k: "\\d", v: "Digit (0-9)" },
                      { k: "\\w", v: "Word char (a-z, 0-9, _)" },
                      { k: "\\s", v: "Whitespace" },
                      { k: "+", v: "1 or more" },
                      { k: "*", v: "0 or more" },
                      { k: "?", v: "0 or 1" },
                      { k: "{n}", v: "Exactly n" },
                      { k: "(...)", v: "Capture group" },
                      { k: "[...]", v: "Character set" },
                    ].map(item => (
                      <div key={item.k} className="flex items-center justify-between border-b border-black/5 pb-2">
                         <code className="font-mono text-xs font-black text-[#FF0004]">{item.k}</code>
                         <span className="font-inter text-[10px] font-bold text-black/50 uppercase">{item.v}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

        </div>
      </div>
    </ToolLayout>
  );
}
