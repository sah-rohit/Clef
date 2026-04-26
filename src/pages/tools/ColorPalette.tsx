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
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-6 mb-8">
        <div>
          <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">SEED COLOR</label>
          <div className="flex gap-0 border-[3px] border-black">
            <input
              type="color"
              value={seed}
              onChange={e => setSeed(e.target.value)}
              className="w-12 h-10 border-0 cursor-pointer p-0.5 bg-white"
            />
            <input
              type="text"
              value={seed}
              onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setSeed(e.target.value); }}
              className="px-3 font-mono text-sm outline-none w-28"
            />
            <button onClick={randomSeed} className="px-3 border-l-[3px] border-black hover:bg-[#F9FF00] transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
        <div>
          <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">HARMONY TYPE</label>
          <div className="flex gap-0 border-[3px] border-black">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 font-oswald text-[10px] font-bold uppercase tracking-wider border-r-[3px] border-black last:border-r-0 transition-colors ${
                  type === t ? "bg-[#F9FF00]" : "hover:bg-[#F9FF00]/30"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Palette display */}
      <div className="grid grid-cols-5 gap-0 border-[3px] border-black mb-6 h-48">
        {palette.map((swatch, i) => (
          <button
            key={i}
            onClick={() => copy(swatch.color)}
            className="relative flex flex-col items-center justify-end pb-3 border-r-[3px] border-black last:border-r-0 group transition-all hover:scale-y-105 origin-bottom"
            style={{ background: swatch.color }}
            title={`Copy ${swatch.color}`}
          >
            <span className={`font-oswald text-[9px] font-bold uppercase ${isLight(swatch.color) ? "text-black/70" : "text-white/70"}`}>
              {swatch.name}
            </span>
            <span className={`font-mono text-[9px] ${isLight(swatch.color) ? "text-black/50" : "text-white/50"}`}>
              {swatch.color}
            </span>
            <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
              <Copy size={12} className={isLight(swatch.color) ? "text-black/60" : "text-white/60"} />
            </div>
          </button>
        ))}
      </div>

      {/* Swatch list */}
      <div className="border-[3px] border-black">
        {palette.map((swatch, i) => (
          <div key={i} className="grid grid-cols-[48px_1fr_auto] border-b-[3px] border-black last:border-b-0 hover:bg-[#fafafa] transition-colors">
            <div className="border-r-[3px] border-black" style={{ background: swatch.color }} />
            <div className="px-4 py-3 flex items-center gap-4">
              <span className="font-oswald text-xs font-bold uppercase tracking-wider w-24">{swatch.name}</span>
              <span className="font-mono text-sm">{swatch.color.toUpperCase()}</span>
              <span className="font-mono text-xs text-black/40">
                hsl({hexToHsl(swatch.color).join(", ")})
              </span>
            </div>
            <button onClick={() => copy(swatch.color)} className="px-4 border-l-[3px] border-black hover:bg-[#F9FF00] transition-colors">
              <Copy size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
