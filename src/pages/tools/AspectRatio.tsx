import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

const presets = [
  { label: "16:9",   w: 16,   h: 9   },
  { label: "4:3",    w: 4,    h: 3   },
  { label: "1:1",    w: 1,    h: 1   },
  { label: "21:9",   w: 21,   h: 9   },
  { label: "3:2",    w: 3,    h: 2   },
  { label: "9:16",   w: 9,    h: 16  },
  { label: "2:1",    w: 2,    h: 1   },
  { label: "5:4",    w: 5,    h: 4   },
];

export default function AspectRatio() {
  const [w, setW] = useState("1920");
  const [h, setH] = useState("1080");
  const [lockW, setLockW] = useState("");
  const [lockH, setLockH] = useState("");
  const { showToast } = useToast();

  const wNum = parseFloat(w) || 0;
  const hNum = parseFloat(h) || 0;
  const d = gcd(Math.round(wNum), Math.round(hNum));
  const ratioW = d ? Math.round(wNum) / d : 0;
  const ratioH = d ? Math.round(hNum) / d : 0;
  const decimal = hNum ? (wNum / hNum).toFixed(4) : "—";

  const applyPreset = (pw: number, ph: number) => {
    setW(String(pw));
    setH(String(ph));
    setLockW("");
    setLockH("");
  };

  const calcFromW = () => {
    const lw = parseFloat(lockW);
    if (!lw || !wNum || !hNum) return;
    setLockH(((lw * hNum) / wNum).toFixed(2));
  };

  const calcFromH = () => {
    const lh = parseFloat(lockH);
    if (!lh || !wNum || !hNum) return;
    setLockW(((lh * wNum) / hNum).toFixed(2));
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied!", "success");
  };

  return (
    <ToolLayout toolId="aspect-ratio">
      {/* Presets */}
      <div className="flex flex-wrap gap-0 border-[3px] border-black mb-8 w-fit">
        {presets.map(p => (
          <button
            key={p.label}
            onClick={() => applyPreset(p.w, p.h)}
            className={`px-4 py-2 font-oswald text-xs font-bold uppercase tracking-wider border-r-[3px] border-black last:border-r-0 transition-colors hover:bg-[#F9FF00] ${
              ratioW === p.w && ratioH === p.h ? "bg-[#F9FF00]" : ""
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[3px] border-black mb-8">
        <div className="border-r-[3px] border-black p-6">
          <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">WIDTH</label>
          <input
            type="number"
            value={w}
            onChange={e => setW(e.target.value)}
            className="input-brutal font-mono text-2xl font-bold"
          />
        </div>
        <div className="p-6">
          <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">HEIGHT</label>
          <input
            type="number"
            value={h}
            onChange={e => setH(e.target.value)}
            className="input-brutal font-mono text-2xl font-bold"
          />
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-[3px] border-black mb-8">
        {[
          { label: "RATIO",    value: `${ratioW}:${ratioH}`, color: "#F9FF00" },
          { label: "DECIMAL",  value: decimal,                color: "#00E5FF" },
          { label: "PERCENT",  value: hNum ? `${((wNum / hNum) * 100).toFixed(1)}%` : "—", color: "#00FF87" },
        ].map((r, i) => (
          <div key={i} className={`p-6 ${i < 2 ? "border-r-[3px] border-black" : ""}`}>
            <div className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/50 mb-2">{r.label}</div>
            <div className="flex items-center gap-3">
              <span className="font-oswald text-3xl font-bold">{r.value}</span>
              <button onClick={() => copy(r.value)} className="hover:scale-110 transition-transform">
                <Copy size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Visual preview */}
      {wNum > 0 && hNum > 0 && (
        <div className="mb-8">
          <div className="font-oswald text-xs font-bold uppercase tracking-widest mb-3 text-black/60">VISUAL PREVIEW</div>
          <div className="border-[3px] border-black bg-[#fafafa] p-6 flex items-center justify-center" style={{ minHeight: 160 }}>
            <div
              className="border-[3px] border-black bg-[#00E5FF]/20 flex items-center justify-center"
              style={{
                width: Math.min(wNum / hNum * 120, 400),
                height: Math.min(120, hNum / wNum * 400),
                maxWidth: "100%",
              }}
            >
              <span className="font-oswald text-xs font-bold text-black/40">{ratioW}:{ratioH}</span>
            </div>
          </div>
        </div>
      )}

      {/* Scale calculator */}
      <div className="border-[3px] border-black">
        <div className="px-4 py-2 border-b-[3px] border-black bg-[#D97706]">
          <span className="font-oswald text-xs font-bold uppercase tracking-widest">SCALE CALCULATOR</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-6 border-r-[3px] border-black">
            <label className="font-oswald text-[10px] font-bold uppercase tracking-widest block mb-2 text-black/60">LOCK WIDTH → FIND HEIGHT</label>
            <div className="flex gap-2">
              <input type="number" value={lockW} onChange={e => setLockW(e.target.value)} placeholder="Width" className="input-brutal flex-1 font-mono" />
              <button onClick={calcFromW} className="bg-[#D97706] border-[3px] border-black px-4 font-oswald text-xs font-bold uppercase hover:bg-black hover:text-[#D97706] transition-colors">CALC</button>
            </div>
            {lockH && lockW && <p className="font-mono text-sm mt-2">→ Height: <strong>{lockH}</strong></p>}
          </div>
          <div className="p-6">
            <label className="font-oswald text-[10px] font-bold uppercase tracking-widest block mb-2 text-black/60">LOCK HEIGHT → FIND WIDTH</label>
            <div className="flex gap-2">
              <input type="number" value={lockH} onChange={e => setLockH(e.target.value)} placeholder="Height" className="input-brutal flex-1 font-mono" />
              <button onClick={calcFromH} className="bg-[#D97706] border-[3px] border-black px-4 font-oswald text-xs font-bold uppercase hover:bg-black hover:text-[#D97706] transition-colors">CALC</button>
            </div>
            {lockW && lockH && <p className="font-mono text-sm mt-2">→ Width: <strong>{lockW}</strong></p>}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
