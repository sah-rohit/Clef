import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Trash2 } from "lucide-react";

export default function CalculatorTool() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === "0" || prev === "Error" ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    setExpression(display + " " + op + " ");
    setDisplay("0");
  };

  const handleEquals = () => {
    try {
      const fullExpr = expression + display;
      // Safe eval using Function
      const sanitized = fullExpr.replace(/[^0-9+\-*/().% ]/g, "");
      const result = new Function("return " + sanitized)();
      const resultStr = String(parseFloat(result.toFixed(10)));
      setHistory(prev => [`${fullExpr} = ${resultStr}`, ...prev].slice(0, 15));
      setDisplay(resultStr);
      setExpression("");
    } catch {
      setDisplay("Error");
      setExpression("");
    }
  };

  const handleClear = () => { setDisplay("0"); setExpression(""); };
  const handleBackspace = () => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
  const handleDecimal = () => { if (!display.includes(".")) setDisplay(prev => prev + "."); };
  const handlePercent = () => setDisplay(String(parseFloat(display) / 100));
  const handleNegate = () => setDisplay(prev => prev.startsWith("-") ? prev.slice(1) : "-" + prev);

  const buttons = [
    { label: "C", action: handleClear, style: "bg-[#FF0004] text-white" },
    { label: "±", action: handleNegate, style: "bg-[#fafafa]" },
    { label: "%", action: handlePercent, style: "bg-[#fafafa]" },
    { label: "÷", action: () => handleOperator("/"), style: "bg-[#F9FF00]" },
    { label: "7", action: () => handleNumber("7"), style: "bg-white" },
    { label: "8", action: () => handleNumber("8"), style: "bg-white" },
    { label: "9", action: () => handleNumber("9"), style: "bg-white" },
    { label: "×", action: () => handleOperator("*"), style: "bg-[#F9FF00]" },
    { label: "4", action: () => handleNumber("4"), style: "bg-white" },
    { label: "5", action: () => handleNumber("5"), style: "bg-white" },
    { label: "6", action: () => handleNumber("6"), style: "bg-white" },
    { label: "−", action: () => handleOperator("-"), style: "bg-[#F9FF00]" },
    { label: "1", action: () => handleNumber("1"), style: "bg-white" },
    { label: "2", action: () => handleNumber("2"), style: "bg-white" },
    { label: "3", action: () => handleNumber("3"), style: "bg-white" },
    { label: "+", action: () => handleOperator("+"), style: "bg-[#F9FF00]" },
    { label: "⌫", action: handleBackspace, style: "bg-[#fafafa]" },
    { label: "0", action: () => handleNumber("0"), style: "bg-white" },
    { label: ".", action: handleDecimal, style: "bg-white" },
    { label: "=", action: handleEquals, style: "bg-[#1a1a1a] text-white" },
  ];

  return (
    <ToolLayout toolId="calculator">
      <div className="max-w-sm mx-auto">
        {/* Display */}
        <div className="border-[3px] border-black mb-0">
          <div className="bg-[#1a1a1a] text-white px-6 py-2 min-h-[24px]">
            <span className="font-inter text-xs text-white/50">{expression || "\u00A0"}</span>
          </div>
          <div className="bg-[#1a1a1a] text-white px-6 py-6 text-right">
            <span className="font-oswald text-4xl md:text-5xl font-bold">{display}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-0">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`border-[3px] border-black m-[-1.5px] px-4 py-5 font-oswald text-xl font-bold transition-all hover:opacity-80 active:scale-95 ${btn.style}`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="border-[3px] border-black mt-6">
            <div className="bg-[#1a1a1a] text-white px-4 py-2 flex items-center justify-between">
              <span className="font-oswald text-xs font-bold uppercase tracking-wider">History</span>
              <button onClick={() => setHistory([])} className="text-white/50 hover:text-[#FF0004]"><Trash2 size={14} /></button>
            </div>
            {history.map((h, i) => (
              <div key={i} className="px-4 py-2 border-b-[3px] border-black last:border-b-0 font-mono text-sm">
                {h}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
