import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const formats = [
  { label: "ISO 8601",       fn: (d: Date) => d.toISOString() },
  { label: "UTC String",     fn: (d: Date) => d.toUTCString() },
  { label: "Local String",   fn: (d: Date) => d.toLocaleString() },
  { label: "Date Only",      fn: (d: Date) => d.toLocaleDateString() },
  { label: "Time Only",      fn: (d: Date) => d.toLocaleTimeString() },
  { label: "Unix (seconds)", fn: (d: Date) => String(Math.floor(d.getTime() / 1000)) },
  { label: "Unix (ms)",      fn: (d: Date) => String(d.getTime()) },
];

export default function TimestampConverter() {
  const [input, setInput] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const { showToast } = useToast();

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const parse = (val: string) => {
    setError("");
    const trimmed = val.trim();
    if (!trimmed) { setDate(null); return; }
    // Try unix seconds or ms
    const num = Number(trimmed);
    if (!isNaN(num)) {
      const d = new Date(num < 1e12 ? num * 1000 : num);
      if (isNaN(d.getTime())) { setError("Invalid timestamp"); setDate(null); }
      else setDate(d);
      return;
    }
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) { setError("Cannot parse — try a Unix timestamp or ISO date string"); setDate(null); }
    else setDate(d);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied!", "success");
  };

  const useNow = () => {
    const ts = String(Math.floor(Date.now() / 1000));
    setInput(ts);
    parse(ts);
  };

  return (
    <ToolLayout toolId="timestamp-converter">
      {/* Live clock */}
      <div className="flex items-center gap-4 mb-8 p-4 border-[3px] border-black bg-[#1a1a1a] text-white">
        <div className="w-2 h-2 bg-[#00FF87] animate-pulse" />
        <div>
          <span className="font-oswald text-xs font-bold uppercase tracking-widest text-white/50 block">CURRENT UNIX TIMESTAMP</span>
          <span className="font-mono text-2xl font-bold">{Math.floor(now / 1000)}</span>
        </div>
        <button
          onClick={useNow}
          className="ml-auto flex items-center gap-2 bg-[#00E5FF] text-black border-[2px] border-[#00E5FF] px-4 py-2 font-oswald text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors"
        >
          <RefreshCw size={12} /> USE NOW
        </button>
      </div>

      {/* Input */}
      <div className="mb-6">
        <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">
          ENTER TIMESTAMP OR DATE STRING
        </label>
        <input
          type="text"
          value={input}
          onChange={e => { setInput(e.target.value); parse(e.target.value); }}
          placeholder="e.g. 1714000000  or  2024-04-25T12:00:00Z"
          className="input-brutal w-full font-mono"
        />
        {error && <p className="font-inter text-xs text-[#FF0004] mt-2">{error}</p>}
      </div>

      {/* Conversions */}
      {date && (
        <div className="border-[3px] border-black">
          <div className="px-4 py-2 border-b-[3px] border-black bg-[#00E5FF]">
            <span className="font-oswald text-xs font-bold uppercase tracking-widest">CONVERSIONS</span>
          </div>
          {formats.map((f, i) => {
            const val = f.fn(date);
            return (
              <div key={i} className="grid grid-cols-[160px_1fr_auto] border-b-[3px] border-black last:border-b-0 hover:bg-[#fafafa] transition-colors">
                <div className="px-4 py-3 border-r-[3px] border-black flex items-center">
                  <span className="font-oswald text-[10px] font-bold uppercase tracking-wider text-black/60">{f.label}</span>
                </div>
                <div className="px-4 py-3 flex items-center">
                  <span className="font-mono text-sm break-all">{val}</span>
                </div>
                <button
                  onClick={() => copy(val)}
                  className="px-4 py-3 border-l-[3px] border-black hover:bg-[#F9FF00] transition-colors"
                >
                  <Copy size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!date && !error && (
        <div className="border-[3px] border-dashed border-black/20 py-16 text-center">
          <p className="font-oswald text-xl font-bold uppercase text-black/20">ENTER A TIMESTAMP ABOVE</p>
        </div>
      )}
    </ToolLayout>
  );
}
