import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const { showToast } = useToast();

  const generate = useCallback(() => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) { showToast("Select at least one character type.", "warning"); return; }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    const pw = Array.from(arr, v => chars[v % chars.length]).join("");
    setPassword(pw);
    setHistory(prev => [pw, ...prev].slice(0, 10));
    showToast("Password generated!", "success");
  }, [length, uppercase, lowercase, numbers, symbols, showToast]);

  const copyPw = (pw: string) => { navigator.clipboard.writeText(pw); showToast("Copied to clipboard!", "success"); };

  const getStrength = () => {
    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (uppercase && lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;
    if (score <= 2) return { label: "WEAK", color: "#FF0004" };
    if (score <= 3) return { label: "MEDIUM", color: "#D97706" };
    return { label: "STRONG", color: "#059669" };
  };
  const strength = getStrength();

  return (
    <ToolLayout toolId="password-generator">
      <div className="max-w-2xl mx-auto">
        {/* Password Display */}
        <div className="border-[3px] border-black mb-6">
          <div className="bg-[#1a1a1a] text-white px-4 py-2 flex items-center justify-between">
            <span className="font-oswald text-xs font-bold uppercase tracking-wider">Generated Password</span>
            <span className="font-oswald text-xs font-bold" style={{ color: strength.color }}>{strength.label}</span>
          </div>
          <div className="px-6 py-6 flex items-center gap-4">
            <span className="font-mono text-lg font-bold flex-1 break-all">{password || "Click GENERATE to create a password"}</span>
            {password && (
              <button onClick={() => copyPw(password)} className="p-2 border-[3px] border-black hover:bg-[#F9FF00] transition-colors flex-shrink-0">
                <Copy size={18} />
              </button>
            )}
          </div>
          <div className="h-2 bg-[#fafafa] border-t-[3px] border-black">
            <div className="h-full transition-all" style={{ width: `${Math.min(100, (length / 32) * 100)}%`, backgroundColor: strength.color }} />
          </div>
        </div>

        {/* Options */}
        <div className="border-[3px] border-black mb-6">
          <div className="px-4 py-3 border-b-[3px] border-black flex items-center justify-between">
            <span className="font-oswald text-xs font-bold uppercase tracking-widest">Length</span>
            <span className="font-oswald text-lg font-bold">{length}</span>
          </div>
          <div className="px-4 py-3 border-b-[3px] border-black">
            <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(+e.target.value)} className="w-full" />
          </div>
          {[
            { label: "Uppercase (A-Z)", val: uppercase, set: setUppercase },
            { label: "Lowercase (a-z)", val: lowercase, set: setLowercase },
            { label: "Numbers (0-9)", val: numbers, set: setNumbers },
            { label: "Symbols (!@#$%)", val: symbols, set: setSymbols },
          ].map(opt => (
            <button key={opt.label} onClick={() => opt.set(!opt.val)} className={`w-full text-left px-4 py-3 border-b-[3px] border-black last:border-b-0 flex items-center justify-between transition-colors ${opt.val ? "bg-[#F9FF00]" : "bg-white hover:bg-[#F9FF00]/20"}`}>
              <span className="font-inter text-sm font-medium">{opt.label}</span>
              <div className={`w-5 h-5 border-[3px] border-black flex items-center justify-center ${opt.val ? "bg-[#1a1a1a]" : "bg-white"}`}>
                {opt.val && <span className="text-white text-xs">✓</span>}
              </div>
            </button>
          ))}
        </div>

        <button onClick={generate} className="btn-brutal btn-brutal-yellow w-full flex items-center justify-center gap-2 text-lg py-4">
          <RefreshCw size={18} />
          GENERATE PASSWORD
        </button>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-6 border-[3px] border-black">
            <div className="bg-[#1a1a1a] text-white px-4 py-2">
              <span className="font-oswald text-xs font-bold uppercase tracking-wider">Recent Passwords</span>
            </div>
            {history.map((pw, i) => (
              <div key={i} className="px-4 py-2 border-b-[3px] border-black last:border-b-0 flex items-center justify-between hover:bg-[#F9FF00]/20 transition-colors">
                <span className="font-mono text-xs truncate flex-1 mr-2">{pw}</span>
                <button onClick={() => copyPw(pw)} className="p-1 hover:bg-[#F9FF00] transition-colors">
                  <Copy size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
