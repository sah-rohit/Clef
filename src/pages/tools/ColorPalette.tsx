import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, RefreshCw, Download, FileJson, Palette, Sparkles, Hash } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

// ── Color Utilities ──
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

const TYPES = ["monochromatic", "complementary", "triadic", "analogous", "shades"];

export default function ColorPalette() {
  const [seed, setSeed] = useState("#7C3AED");
  const [type, setType] = useState("monochromatic");
  const { showToast } = useToast();

  const palette = useMemo(() => {
    const [h, s, l] = hexToHsl(seed);
    switch (type) {
      case "complementary":
        return [
          { name: "Primary", color: seed },
          { name: "Complement", color: hslToHex((h + 180) % 360, s, l) },
          { name: "P-Light", color: hslToHex(h, s, Math.min(l + 20, 95)) },
          { name: "P-Dark", color: hslToHex(h, s, Math.max(l - 20, 5)) },
          { name: "C-Accent", color: hslToHex((h + 180) % 360, Math.min(s + 20, 100), Math.min(l + 10, 95)) },
        ];
      case "triadic":
        return [
          { name: "Primary", color: seed },
          { name: "Triad-1", color: hslToHex((h + 120) % 360, s, l) },
          { name: "Triad-2", color: hslToHex((h + 240) % 360, s, l) },
          { name: "T1-Light", color: hslToHex((h + 120) % 360, s, Math.min(l + 25, 95)) },
          { name: "T2-Dark", color: hslToHex((h + 240) % 360, s, Math.max(l - 25, 5)) },
        ];
      case "shades":
        return [100, 300, 500, 700, 900].map(weight => ({
           name: `Shade-${weight}`,
           color: hslToHex(h, s, 100 - (weight / 10))
        }));
      case "analogous":
        return [-30, -15, 0, 15, 30].map(offset => ({
           name: offset === 0 ? "Base" : `${offset}°`,
           color: hslToHex((h + offset + 360) % 360, s, l)
        }));
      case "monochromatic":
      default:
        return [15, 35, 55, 75, 95].map((lum, i) => ({
           name: ["Deep", "Dark", "Base", "Light", "Ghost"][i],
           color: hslToHex(h, s, 110 - lum)
        }));
    }
  }, [seed, type]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${text}`, "success");
  };

  const exportPalette = (format: "css" | "json" | "tailwind") => {
    let content = "";
    if (format === "css") {
      content = `:root {\n${palette.map(s => `  --color-${s.name.toLowerCase()}: ${s.color};`).join("\n")}\n}`;
    } else if (format === "tailwind") {
      content = `colors: {\n  brand: {\n${palette.map((s, i) => `    ${(i+1)*100}: "${s.color}",`).join("\n")}\n  }\n}`;
    } else {
      content = JSON.stringify(palette, null, 2);
    }
    copy(content);
    showToast(`Exported as ${format.toUpperCase()}`, "success");
  };

  return (
    <ToolLayout toolId="color-palette">
      <div className="flex flex-col gap-10">
        {/* Dynamic Input Terminal */}
        <div className="flex flex-wrap items-center justify-between gap-8 pb-8 border-b-[3px] border-black/10 animate-fade-in">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-3">
              <label className="font-oswald text-[10px] font-black uppercase tracking-[0.2em] opacity-40">SEED_BUFFER</label>
              <div className="flex border-[3px] border-black bg-white shadow-[6px_6px_0px_black] group transition-all">
                 <div className="w-16 h-14 border-r-[3px] border-black relative overflow-hidden">
                    <input type="color" value={seed} onChange={e => setSeed(e.target.value)} className="absolute inset-[-10px] w-[150%] h-[150%] cursor-pointer" />
                 </div>
                 <input type="text" value={seed.toUpperCase()} onChange={e => setSeed(e.target.value)} className="px-6 font-mono text-sm font-bold outline-none w-36 uppercase" />
                 <button onClick={() => setSeed("#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'))} className="px-5 border-l-[3px] border-black hover:bg-black hover:text-[#F9FF00] transition-all">
                    <RefreshCw size={18} />
                 </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="font-oswald text-[10px] font-black uppercase tracking-[0.2em] opacity-40">ALGORITHM_SELECT</label>
              <div className="flex flex-wrap border-[3px] border-black bg-black shadow-[6px_6px_0px_black]">
                {TYPES.map(t => (
                  <button 
                    key={t} 
                    onClick={() => setType(t)} 
                    className={`px-6 py-4 font-oswald text-[10px] font-black uppercase tracking-widest border-r-[3px] border-black last:border-r-0 transition-all ${type === t ? "bg-[#F9FF00] text-black" : "text-white/40 hover:text-white"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visual Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 flex flex-col gap-4">
             <div className="flex items-center gap-3 px-2">
                <Palette size={16} />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">VISUAL_ENGINE</span>
             </div>
             <div className="relative group">
                <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-all" />
                <div className="relative border-[4px] border-black h-[400px] flex overflow-hidden">
                  {palette.map((swatch, i) => (
                    <div 
                      key={i} 
                      onClick={() => copy(swatch.color)}
                      className="group/swatch relative flex-1 hover:flex-[1.8] transition-all duration-500 cursor-pointer flex flex-col items-center justify-end pb-12 gap-4"
                      style={{ background: swatch.color }}
                    >
                       <div className={`flex flex-col items-center gap-1 transition-all ${isLight(swatch.color) ? "text-black" : "text-white"}`}>
                          <span className="font-oswald text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{swatch.name}</span>
                          <span className="font-mono text-xs font-black">{swatch.color.toUpperCase()}</span>
                       </div>
                       <div className={`absolute top-10 opacity-0 group-hover/swatch:opacity-100 group-hover/swatch:-translate-y-2 transition-all ${isLight(swatch.color) ? "text-black" : "text-white"}`}>
                          <Copy size={24} className="opacity-20" />
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
             <div className="flex items-center gap-3 px-2">
                <Sparkles size={16} />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">EXPORT_TERMINAL</span>
             </div>
             <div className="flex flex-col gap-8 p-8 border-[4px] border-black bg-black text-white shadow-[12px_12px_0px_black]">
                <div className="flex flex-col gap-4">
                   <button onClick={() => exportPalette("css")} className="w-full py-4 border-[2px] border-white/20 font-oswald text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                      <Hash size={14} /> EXPORT_AS_CSS_VARS
                   </button>
                   <button onClick={() => exportPalette("tailwind")} className="w-full py-4 border-[2px] border-white/20 font-oswald text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#38BDF8] hover:text-white hover:border-[#38BDF8] transition-all flex items-center justify-center gap-3">
                      <Download size={14} /> TAILWIND_CONFIG
                   </button>
                   <button onClick={() => exportPalette("json")} className="w-full py-4 border-[2px] border-white/20 font-oswald text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#F9FF00] hover:text-black transition-all flex items-center justify-center gap-3">
                      <FileJson size={14} /> JSON_MANIFEST
                   </button>
                </div>
                <div className="flex flex-col gap-2">
                   <p className="font-inter text-[9px] uppercase font-bold opacity-30 leading-relaxed">
                      Generated palettes are compatible with major design systems and frameworks. All processing occurs in the local buffer.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
