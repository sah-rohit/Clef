import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

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

function generatePalette(hex: string, type: string): { name: string; color: string }[] {
  const [h, s, l] = hexToHsl(hex);
  switch (type) {
    case "complementary":
      return [
        { name: "Base", color: hex },
        { name: "Complement", color: hslToHex((h + 180) % 360, s, l) },
        { name: "Light Base", color: hslToHex(h, s, Math.min(l + 20, 95)) },
        { name: "Dark Base", color: hslToHex(h, s, Math.max(l - 20, 5)) },
        { name: "Light Comp", color: hslToHex((h + 180) % 360, s, Math.min(l + 20, 95)) },
      ];
    case "triadic":
      return [
        { name: "Base", color: hex },
        { name: "Triad 1", color: hslToHex((h + 120) % 360, s, l) },
        { name: "Triad 2", color: hslToHex((h + 240) % 360, s, l) },
        { name: "Light", color: hslToHex(h, s, Math.min(l + 25, 95)) },
        { name: "Dark", color: hslToHex(h, s, Math.max(l - 25, 5)) },
      ];
    case "analogous":
      return [
        { name: "-30°", color: hslToHex((h - 30 + 360) % 360, s, l) },
        { name: "-15°", color: hslToHex((h - 15 + 360) % 360, s, l) },
        { name: "Base", color: hex },
        { name: "+15°", color: hslToHex((h + 15) % 360, s, l) },
        { name: "+30°", color: hslToHex((h + 30) % 360, s, l) },
      ];
    case "monochromatic":
    default:
      return [
        { name: "Lightest", color: hslToHex(h, s, 90) },
        { name: "Light", color: hslToHex(h, s, 70) },
        { name: "Base", color: hex },
        { name: "Dark", color: hslToHex(h, s, 30) },
        { name: "Darkest", color: hslToHex(h, s, 10) },
      ];
  }
}

function isLight(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

const TYPES = ["monochromatic", "complementary", "triadic", "analogous"];

export default function ColorPalette() {
  const [seed, setSeed] = useState("#7C3AED");
  const [type, setType] = useState("monochromatic");
  const { showToast } = useToast();

  const palette = generatePalette(seed, type);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${text}`, "success");
  };

  const randomSeed = () => {
    const hex = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
    setSeed(hex);
  };

  return (
    <ToolLayout toolId="color-palette">
      <div className="flex flex-col gap-10">
        {/* Dynamic Control Terminal */}
        <div className="flex flex-wrap items-end justify-between gap-8 pb-8 border-b-[2px] border-black/5 animate-fade-in">
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-black rotate-45" />
                <label className="font-oswald text-[10px] font-black uppercase tracking-[0.2em] opacity-40">SEED_COLOR_BUFFER</label>
              </div>
              <div className="flex gap-0 border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] group focus-within:shadow-none focus-within:translate-x-1 focus-within:translate-y-1 transition-all duration-200">
                <div className="relative w-14 h-12 border-r-[3px] border-black overflow-hidden">
                  <input
                    type="color"
                    value={seed}
                    onChange={e => setSeed(e.target.value)}
                    className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={seed.toUpperCase()}
                  onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setSeed(e.target.value); }}
                  className="px-4 font-mono text-sm font-bold outline-none w-32 bg-white"
                />
                <button 
                  onClick={randomSeed} 
                  className="group px-4 border-l-[3px] border-black hover:bg-black hover:text-[#F9FF00] transition-all duration-300"
                >
                  <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#FF0004] rotate-45" />
                <label className="font-oswald text-[10px] font-black uppercase tracking-[0.2em] opacity-40">HARMONY_ALGORITHM</label>
              </div>
              <div className="flex flex-wrap gap-0 border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] overflow-hidden">
                {TYPES.map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-5 py-3 font-oswald text-[11px] font-black uppercase tracking-widest border-r-[3px] border-black last:border-r-0 transition-all duration-200 ${
                      type === t ? "bg-[#F9FF00] text-black" : "bg-white hover:bg-black hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Immersive Palette Display */}
        <div className="flex flex-col gap-4 animate-slide-up">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#7C3AED] rotate-45 border border-black shadow-[1px_1px_0px_black]" />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">VISUAL_PALETTE_RENDER</span>
              </div>
              <span className="font-mono text-[9px] opacity-40 uppercase">harmony: {type}</span>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300" />
              <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-0 border-[4px] border-black h-[280px] overflow-hidden shadow-apple">
                {palette.map((swatch, i) => (
                  <button
                    key={i}
                    onClick={() => copy(swatch.color)}
                    className="relative flex flex-col items-center justify-end pb-8 gap-2 border-r-[4px] border-black last:border-r-0 group/swatch transition-all duration-500 hover:flex-[1.4] origin-bottom overflow-hidden"
                    style={{ background: swatch.color }}
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover/swatch:opacity-20 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at center, white 0%, transparent 70%)' }} />
                    
                    <div className={`flex flex-col items-center gap-1 transition-all duration-300 transform group-hover/swatch:scale-110 ${isLight(swatch.color) ? "text-black" : "text-white"}`}>
                      <span className="font-oswald text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                        {swatch.name}
                      </span>
                      <span className="font-mono text-[11px] font-bold">
                        {swatch.color.toUpperCase()}
                      </span>
                    </div>

                    <div className={`absolute top-6 opacity-0 group-hover/swatch:opacity-100 group-hover/swatch:-translate-y-2 transition-all duration-300 ${isLight(swatch.color) ? "text-black" : "text-white"}`}>
                      <Copy size={20} className="opacity-40" />
                    </div>
                    
                    {/* Swatch Index */}
                    <div className={`absolute top-4 left-4 font-mono text-[8px] font-bold opacity-20 ${isLight(swatch.color) ? "text-black" : "text-white"}`}>
                      0{i + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
        </div>

        {/* Detailed Swatch Manifest */}
        <div className="flex flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
           <div className="flex items-center gap-3 px-2">
              <div className="w-2 h-2 bg-[#00FF87] rotate-45 border border-black shadow-[1px_1px_0px_black]" />
              <span className="font-oswald text-xs font-black uppercase tracking-widest">DETAILED_MANIFEST</span>
            </div>

            <div className="border-[4px] border-black bg-white shadow-[12px_12px_0px_rgba(0,0,0,1)]">
              {palette.map((swatch, i) => (
                <div 
                  key={i} 
                  className="group grid grid-cols-[80px_1fr_auto] border-b-[3px] border-black last:border-b-0 transition-all duration-300 hover:bg-black/5"
                >
                  <div className="border-r-[3px] border-black relative overflow-hidden">
                    <div className="absolute inset-0" style={{ background: swatch.color }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20" />
                  </div>
                  <div className="px-8 py-5 flex flex-wrap items-center gap-x-12 gap-y-4">
                    <div className="flex flex-col">
                      <span className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">SWATCH_ID</span>
                      <span className="font-oswald text-sm font-bold uppercase tracking-wider">{swatch.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">HEX_VALUE</span>
                      <span className="font-mono text-sm font-bold text-[#FF0004]">{swatch.color.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-col hidden sm:flex">
                      <span className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">HSL_BUFFER</span>
                      <span className="font-mono text-[11px] opacity-60">
                        {hexToHsl(swatch.color).join(", ")}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => copy(swatch.color)} 
                    className="px-10 border-l-[3px] border-black bg-white hover:bg-[#F9FF00] transition-all duration-300 flex items-center justify-center group/btn"
                  >
                    <Copy size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
        </div>
      </div>
    </ToolLayout>
  );
}
