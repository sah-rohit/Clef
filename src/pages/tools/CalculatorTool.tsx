import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { 
  Trash2, RotateCcw, Calculator, Hash, 
  Settings2, Clock, History, ChevronRight,
  Sparkles, Terminal, Activity, Zap
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

export default function CalculatorTool() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const { showToast } = useToast();

  const calculate = useCallback(() => {
    try {
      const sanitized = expression.replace(/×/g, "*").replace(/÷/g, "/").replace(/sin/g, "Math.sin").replace(/cos/g, "Math.cos").replace(/tan/g, "Math.tan").replace(/log/g, "Math.log10").replace(/ln/g, "Math.log").replace(/√/g, "Math.sqrt").replace(/π/g, "Math.PI").replace(/e/g, "Math.E");
      
      // Use a safer evaluation method
      const result = new Function(`return ${sanitized}`)();
      if (isNaN(result) || !isFinite(result)) throw new Error();
      
      const resStr = String(parseFloat(result.toFixed(8)));
      setHistory(prev => [`${expression} = ${resStr}`, ...prev].slice(0, 20));
      setDisplay(resStr);
      setExpression(resStr);
    } catch {
      setDisplay("ERR_SYSTEM_OVERLOAD");
      showToast("Computation failed.", "error");
    }
  }, [expression, showToast]);

  const handleInput = (val: string) => {
    if (display === "ERR_SYSTEM_OVERLOAD") {
       setDisplay(val);
       setExpression(val);
       return;
    }
    setExpression(prev => prev === "0" ? val : prev + val);
    setDisplay(prev => prev === "0" ? val : prev + val);
  };

  const handleClear = () => { setDisplay("0"); setExpression(""); };
  const handleBackspace = () => {
    setExpression(prev => prev.length > 0 ? prev.slice(0, -1) : "");
    setDisplay(prev => prev.length > 0 ? prev.slice(0, -1) : "0");
  };

  const buttons = [
    { label: "sin", action: () => handleInput("sin("), style: "bg-black/5 text-[#7C3AED]" },
    { label: "cos", action: () => handleInput("cos("), style: "bg-black/5 text-[#7C3AED]" },
    { label: "tan", action: () => handleInput("tan("), style: "bg-black/5 text-[#7C3AED]" },
    { label: "C", action: handleClear, style: "bg-[#FF0004] text-white" },
    
    { label: "log", action: () => handleInput("log("), style: "bg-black/5 text-[#00E5FF]" },
    { label: "ln", action: () => handleInput("ln("), style: "bg-black/5 text-[#00E5FF]" },
    { label: "√", action: () => handleInput("√("), style: "bg-black/5 text-[#00E5FF]" },
    { label: "÷", action: () => handleInput("÷"), style: "bg-[#F9FF00]" },

    { label: "7", action: () => handleInput("7"), style: "bg-white" },
    { label: "8", action: () => handleInput("8"), style: "bg-white" },
    { label: "9", action: () => handleInput("9"), style: "bg-white" },
    { label: "×", action: () => handleInput("×"), style: "bg-[#F9FF00]" },

    { label: "4", action: () => handleInput("4"), style: "bg-white" },
    { label: "5", action: () => handleInput("5"), style: "bg-white" },
    { label: "6", action: () => handleInput("6"), style: "bg-white" },
    { label: "−", action: () => handleInput("-"), style: "bg-[#F9FF00]" },

    { label: "1", action: () => handleInput("1"), style: "bg-white" },
    { label: "2", action: () => handleInput("2"), style: "bg-white" },
    { label: "3", action: () => handleInput("3"), style: "bg-white" },
    { label: "+", action: () => handleInput("+"), style: "bg-[#F9FF00]" },

    { label: "π", action: () => handleInput("π"), style: "bg-black text-white" },
    { label: "0", action: () => handleInput("0"), style: "bg-white" },
    { label: ".", action: () => handleInput("."), style: "bg-white" },
    { label: "=", action: calculate, style: "bg-black text-[#F9FF00] scale-110 shadow-[4px_4px_0px_rgba(249,255,0,0.3)]" },
  ];

  // Keyboard support
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleInput(e.key);
      if (e.key === "+") handleInput("+");
      if (e.key === "-") handleInput("-");
      if (e.key === "*") handleInput("×");
      if (e.key === "/") handleInput("÷");
      if (e.key === "Enter") calculate();
      if (e.key === "Backspace") handleBackspace();
      if (e.key === "Escape") handleClear();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [calculate]);

  return (
    <ToolLayout toolId="calculator">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Calculator Pad */}
           <div className="lg:col-span-5">
              <div className="bg-white border-[4px] border-black shadow-[16px_16px_0px_black] overflow-hidden">
                 {/* Premium Display */}
                 <div className="bg-[#1a1a1a] p-8 border-b-[4px] border-black relative">
                    <div className="absolute top-4 left-6 flex items-center gap-2">
                       <div className="w-2 h-2 bg-[#00FF87] rounded-full animate-pulse" />
                       <span className="font-mono text-[8px] text-[#00FF87] font-bold tracking-widest">SYSTEM_CALC_IDLE</span>
                    </div>
                    <div className="text-right min-h-[40px] mb-4">
                       <span className="font-mono text-xs text-white/20 break-all uppercase tracking-tighter">{expression || "READY_"}</span>
                    </div>
                    <div className="text-right">
                       <span className="font-oswald text-5xl md:text-6xl font-black text-[#F9FF00] break-all leading-none">{display}</span>
                    </div>
                 </div>

                 {/* Grid Pad */}
                 <div className="grid grid-cols-4 gap-0 p-4 bg-[#fafafa]">
                    {buttons.map((btn, i) => (
                      <button
                        key={i}
                        onClick={btn.action}
                        className={`border-[2px] border-black m-1 px-4 py-6 font-oswald text-lg font-black transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none shadow-[4px_4px_0px_black] active:translate-x-1 active:translate-y-1 ${btn.style}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                 </div>

                 {/* System Info Bar */}
                 <div className="bg-black text-white/40 px-6 py-3 flex items-center justify-between font-mono text-[8px] font-bold uppercase tracking-widest">
                    <span>IEEE_754_PRECISION</span>
                    <span>CORE_V2.1.0</span>
                 </div>
              </div>
           </div>

           {/* History & Constants */}
           <div className="lg:col-span-7 space-y-8">
              
              {/* History Console */}
              <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden flex flex-col h-[400px]">
                 <div className="bg-[#1a1a1a] text-white px-6 py-4 flex items-center justify-between border-b-[4px] border-black shrink-0">
                    <div className="flex items-center gap-3">
                       <Terminal size={16} className="text-[#00E5FF]" />
                       <span className="font-oswald text-sm font-black uppercase tracking-widest">LOG_CONSOLE</span>
                    </div>
                    <button onClick={() => setHistory([])} className="p-2 border-[2px] border-white/10 hover:bg-[#FF0004] hover:border-[#FF0004] transition-all"><Trash2 size={14} /></button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#fafafa]">
                    {history.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full opacity-10 gap-4 grayscale">
                         <Activity size={48} />
                         <p className="font-oswald text-xl font-black uppercase tracking-[0.3em]">AWAITING_INPUT</p>
                      </div>
                    ) : (
                      history.map((h, i) => (
                        <div key={i} className="group border-[3px] border-black p-5 bg-white hover:bg-[#F9FF00]/10 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
                           <div className="flex items-center justify-between mb-2">
                              <span className="font-oswald text-[10px] font-black text-[#00E5FF] uppercase">OP_{String(history.length - i).padStart(3, '0')}</span>
                              <div className="flex items-center gap-2">
                                 <button onClick={() => { setExpression(h.split(" = ")[1]); setDisplay(h.split(" = ")[1]); }} className="font-oswald text-[9px] font-black hover:text-[#00FF87] transition-colors">REUSE_RESULT</button>
                              </div>
                           </div>
                           <p className="font-mono text-sm font-bold text-black/60">{h.split(" = ")[0]}</p>
                           <p className="font-mono text-xl font-black text-black mt-2"> = {h.split(" = ")[1]}</p>
                        </div>
                      ))
                    )}
                 </div>
              </div>

              {/* Constants & Modes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-[#7C3AED] text-white p-8 border-[4px] border-black shadow-[12px_12px_0px_black]">
                    <h3 className="font-oswald text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><Sparkles size={16} /> SYSTEM_CONSTANTS</h3>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between border-b border-white/20 pb-2">
                          <span className="font-mono text-xs font-black">PI (π)</span>
                          <span className="font-mono text-[10px] font-bold opacity-60">3.14159265</span>
                       </div>
                       <div className="flex items-center justify-between border-b border-white/20 pb-2">
                          <span className="font-mono text-xs font-black">EULER (e)</span>
                          <span className="font-mono text-[10px] font-bold opacity-60">2.71828182</span>
                       </div>
                    </div>
                 </div>
                 <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_black]">
                    <h3 className="font-oswald text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3 text-[#FF0004]"><Zap size={16} /> PERFORMANCE</h3>
                    <p className="font-inter text-[10px] font-bold text-black/40 uppercase leading-relaxed">
                       Hardware-accelerated mathematical precision powered by Chromium V8.
                    </p>
                 </div>
              </div>

           </div>

        </div>
      </div>
    </ToolLayout>
  );
}
