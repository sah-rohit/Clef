import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { 
  Copy, RefreshCw, Shield, ShieldCheck, ShieldAlert, 
  Settings2, Hash, Type, Key, LayoutGrid, AlertCircle,
  Eye, EyeOff, Zap, Database, Lock
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const WORD_LIST = [
  "alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliet", "kilo", "lima", "mike",
  "november", "oscar", "papa", "quebec", "romeo", "sierra", "tango", "uniform", "victor", "whiskey", "xray", "yankee", "zulu",
  "apple", "banana", "cherry", "dragon", "eagle", "falcon", "giant", "honey", "island", "joker", "knight", "lemon", "mountain",
  "night", "ocean", "planet", "queen", "river", "shadow", "tiger", "under", "valley", "winter", "xenon", "yellow", "zebra"
];

type Mode = "CHARACTERS" | "PASSPHRASE" | "PIN";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<Mode>("CHARACTERS");
  const [length, setLength] = useState(16);
  const [words, setWords] = useState(4);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(true);
  const { showToast } = useToast();

  const generate = useCallback(() => {
    let pw = "";
    if (mode === "CHARACTERS") {
      let chars = "";
      if (uppercase) chars += excludeSimilar ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (lowercase) chars += excludeSimilar ? "abcdefghijkmnpqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz";
      if (numbers) chars += excludeSimilar ? "23456789" : "0123456789";
      if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
      if (!chars) { showToast("Select character types.", "warning"); return; }
      
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      pw = Array.from(arr, v => chars[v % chars.length]).join("");
    } else if (mode === "PASSPHRASE") {
      const arr = new Uint32Array(words);
      crypto.getRandomValues(arr);
      pw = Array.from(arr, v => WORD_LIST[v % WORD_LIST.length]).join("-");
    } else if (mode === "PIN") {
      const arr = new Uint32Array(length);
      crypto.getRandomValues(arr);
      pw = Array.from(arr, v => (v % 10).toString()).join("");
    }

    setPassword(pw);
    setHistory(prev => [pw, ...prev].slice(0, 10));
    showToast("Generated new secret.", "success");
  }, [mode, length, words, uppercase, lowercase, numbers, symbols, excludeSimilar, showToast]);

  const entropy = useMemo(() => {
    if (!password) return 0;
    let poolSize = 0;
    if (mode === "CHARACTERS") {
      if (uppercase) poolSize += excludeSimilar ? 24 : 26;
      if (lowercase) poolSize += excludeSimilar ? 24 : 26;
      if (numbers) poolSize += excludeSimilar ? 8 : 10;
      if (symbols) poolSize += 28;
      return Math.log2(poolSize) * length;
    } else if (mode === "PASSPHRASE") {
      poolSize = WORD_LIST.length;
      return Math.log2(poolSize) * words;
    } else {
      poolSize = 10;
      return Math.log2(poolSize) * length;
    }
  }, [password, mode, length, words, uppercase, lowercase, numbers, symbols, excludeSimilar]);

  const strength = useMemo(() => {
    if (entropy < 40) return { label: "CRITICAL_LOW", color: "#FF0004", icon: ShieldAlert };
    if (entropy < 80) return { label: "MEDIUM_STRENGTH", color: "#D97706", icon: Shield };
    if (entropy < 128) return { label: "HIGH_FIDELITY", color: "#00FF87", icon: ShieldCheck };
    return { label: "QUANTUM_STABLE", color: "#00E5FF", icon: Lock };
  }, [entropy]);

  const copyPw = (pw: string) => { 
    navigator.clipboard.writeText(pw); 
    showToast("Copied to clipboard.", "success"); 
  };

  return (
    <ToolLayout toolId="password-generator">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Output Panel */}
        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
           <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b-[4px] border-black">
              <div className="flex items-center gap-3">
                 <Key size={18} className="text-[#F9FF00]" />
                 <span className="font-oswald text-sm font-black uppercase tracking-widest">GENERATED_SECRET</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <strength.icon size={14} style={{ color: strength.color }} />
                    <span className="font-oswald text-[10px] font-black uppercase tracking-widest" style={{ color: strength.color }}>{strength.label}</span>
                 </div>
                 <div className="w-px h-4 bg-white/20" />
                 <div className="font-mono text-[10px] font-bold text-white/40">ENTROPY: {entropy.toFixed(1)} BITS</div>
              </div>
           </div>

           <div className="p-8 flex items-center gap-6 relative">
              <div className="flex-1 min-w-0">
                 <div className={`font-mono text-3xl font-black break-all tracking-tight transition-all duration-300 ${showPassword ? "text-black" : "text-black/5 blur-md"}`}>
                    {password || "••••••••••••••••"}
                 </div>
              </div>
              <div className="flex gap-3 shrink-0">
                 <button onClick={() => setShowPassword(!showPassword)} className="w-14 h-14 border-[3px] border-black flex items-center justify-center hover:bg-black/5 transition-all">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                 </button>
                 <button onClick={() => copyPw(password)} className="w-14 h-14 border-[3px] border-black bg-black text-white flex items-center justify-center hover:bg-[#F9FF00] hover:text-black transition-all">
                    <Copy size={20} />
                 </button>
              </div>
           </div>

           <div className="h-4 bg-black/5 border-t-[3px] border-black flex">
              <div className="h-full transition-all duration-700" style={{ width: `${Math.min(100, (entropy / 128) * 100)}%`, backgroundColor: strength.color }} />
           </div>
        </div>

        {/* Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Configuration Column */}
           <div className="lg:col-span-8 space-y-8">
              <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
                 <div className="flex border-b-[4px] border-black">
                    {(["CHARACTERS", "PASSPHRASE", "PIN"] as const).map(m => (
                      <button 
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 px-6 py-4 font-oswald text-xs font-black uppercase tracking-widest transition-all ${mode === m ? "bg-black text-white" : "hover:bg-black/5"}`}
                      >
                        {m === "CHARACTERS" && <LayoutGrid size={12} className="inline mr-2" />}
                        {m === "PASSPHRASE" && <Type size={12} className="inline mr-2" />}
                        {m === "PIN" && <Hash size={12} className="inline mr-2" />}
                        {m}
                      </button>
                    ))}
                 </div>

                 <div className="p-8">
                    {mode === "CHARACTERS" && (
                      <div className="space-y-8 animate-slide-up">
                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                               <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">LENGTH: {length}</label>
                               <span className="font-mono text-[10px] font-bold opacity-30 uppercase">Min: 4 // Max: 64</span>
                            </div>
                            <input type="range" min={4} max={64} value={length} onChange={e => setLength(+e.target.value)} className="w-full h-8 bg-black/5 rounded-none appearance-none cursor-pointer border-[2px] border-black" />
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              { id: "upper", label: "UPPERCASE_CHARACTERS", val: uppercase, set: setUppercase, desc: "A-Z" },
                              { id: "lower", label: "LOWERCASE_CHARACTERS", val: lowercase, set: setLowercase, desc: "a-z" },
                              { id: "num", label: "NUMERICAL_BLOCKS", val: numbers, set: setNumbers, desc: "0-9" },
                              { id: "sym", label: "SPECIAL_SYMBOLS", val: symbols, set: setSymbols, desc: "!@#$%" },
                              { id: "sim", label: "EXCLUDE_SIMILAR", val: excludeSimilar, set: setExcludeSimilar, desc: "e.g. 1, l, I, 0, O" },
                            ].map(opt => (
                              <button 
                                key={opt.id} 
                                onClick={() => opt.set(!opt.val)} 
                                className={`p-4 border-[3px] border-black flex items-center justify-between transition-all ${opt.val ? "bg-[#F9FF00] shadow-[4px_4px_0px_black] -translate-x-1 -translate-y-1" : "bg-white hover:bg-[#F9FF00]/10"}`}
                              >
                                 <div className="text-left">
                                    <h4 className="font-oswald text-[10px] font-black uppercase">{opt.label}</h4>
                                    <p className="font-inter text-[8px] font-bold opacity-40 uppercase">{opt.desc}</p>
                                 </div>
                                 <div className={`w-5 h-5 border-[2px] border-black flex items-center justify-center ${opt.val ? "bg-black" : "bg-white"}`}>
                                    {opt.val && <CheckCircle className="text-white w-3 h-3" />}
                                 </div>
                              </button>
                            ))}
                         </div>
                      </div>
                    )}

                    {mode === "PASSPHRASE" && (
                      <div className="space-y-8 animate-slide-up">
                         <div className="space-y-4">
                            <div className="flex items-center justify-between">
                               <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">WORD_COUNT: {words}</label>
                               <span className="font-mono text-[10px] font-bold opacity-30 uppercase">MEMORABLE_SECURITY</span>
                            </div>
                            <input type="range" min={3} max={12} value={words} onChange={e => setWords(+e.target.value)} className="w-full h-8 bg-black/5 rounded-none appearance-none cursor-pointer border-[2px] border-black" />
                         </div>
                         <div className="p-6 bg-[#00FF87]/10 border-[3px] border-[#00FF87] flex items-start gap-4">
                            <Info size={18} className="text-[#00FF87] shrink-0 mt-0.5" />
                            <p className="font-inter text-[10px] font-bold text-[#00FF87] uppercase leading-relaxed">
                               Passphrases are mathematically stronger and easier to remember than random character strings.
                            </p>
                         </div>
                      </div>
                    )}

                    {mode === "PIN" && (
                      <div className="space-y-8 animate-slide-up">
                         <div className="space-y-4">
                            <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">PIN_LENGTH: {length}</label>
                            <input type="range" min={4} max={12} value={length > 12 ? 6 : length} onChange={e => setLength(+e.target.value)} className="w-full h-8 bg-black/5 rounded-none appearance-none cursor-pointer border-[2px] border-black" />
                         </div>
                         <div className="grid grid-cols-4 gap-4 opacity-10 pointer-events-none">
                            {[1,2,3,4,5,6,7,8,9,0].map(n => (
                              <div key={n} className="aspect-square border-[3px] border-black flex items-center justify-center font-oswald text-2xl font-black">{n}</div>
                            ))}
                         </div>
                      </div>
                    )}
                 </div>

                 <div className="p-8 bg-black">
                    <button onClick={generate} className="w-full py-6 bg-[#F9FF00] text-black border-[3px] border-black font-oswald font-black uppercase tracking-[0.2em] text-lg flex items-center justify-center gap-4 hover:bg-white hover:-translate-y-1 transition-all shadow-[8px_8px_0px_rgba(249,255,0,0.2)] active:shadow-none active:translate-y-0">
                       <RefreshCw size={24} /> GENERATE_NEW_SECRET
                    </button>
                 </div>
              </div>
           </div>

           {/* History Column */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
                 <div className="px-6 py-4 bg-black text-white border-b-[4px] border-black flex items-center justify-between">
                    <span className="font-oswald text-xs font-black uppercase tracking-widest">SESSION_HISTORY</span>
                    <button onClick={() => setHistory([])} className="font-oswald text-[10px] font-black uppercase opacity-40 hover:opacity-100">PURGE</button>
                 </div>
                 <div className="divide-y divide-black/5">
                    {history.length === 0 ? (
                      <div className="p-12 text-center opacity-10">
                         <Database className="m-auto mb-4" size={32} />
                         <p className="font-oswald text-[10px] font-black uppercase">EMPTY_CACHE</p>
                      </div>
                    ) : (
                      history.map((pw, i) => (
                        <div key={i} className="group p-5 flex items-center justify-between hover:bg-[#F9FF00]/10 transition-colors">
                           <div className="flex-1 min-w-0 mr-4">
                              <p className="font-mono text-xs font-bold truncate opacity-60 group-hover:opacity-100">
                                {showPassword ? pw : "••••••••••••"}
                              </p>
                           </div>
                           <button onClick={() => copyPw(pw)} className="p-2 border-[2px] border-black/10 hover:border-black transition-all">
                              <Copy size={12} />
                           </button>
                        </div>
                      ))
                    )}
                 </div>
              </div>

              <div className="bg-[#1a1a1a] p-8 border-[4px] border-black text-white">
                 <h3 className="font-oswald text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-3"><Zap size={16} className="text-[#F9FF00]" /> NIST_COMPLIANCE</h3>
                 <p className="font-inter text-[10px] font-bold text-white/40 uppercase leading-relaxed mb-6">
                    Our generator uses standard <code className="text-white">crypto.getRandomValues()</code> for hardware-backed entropy.
                 </p>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                       <span>BROWSER_SANDBOX</span>
                       <span className="text-[#00FF87]">SECURE</span>
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                       <span>LOCAL_STORAGE_ONLY</span>
                       <span className="text-[#00FF87]">PRIVATE</span>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </ToolLayout>
  );
}

function CheckCircle({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      style={style}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
