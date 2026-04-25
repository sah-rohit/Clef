import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!match) return null;
  return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) { r = g = b = l; } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#F9FF00");
  const [rgb, setRgb] = useState({ r: 249, g: 255, b: 0 });
  const [hsl, setHsl] = useState({ h: 61, s: 100, l: 50 });
  const { showToast } = useToast();

  const updateFromHex = (h: string) => {
    setHex(h);
    const rgbVal = hexToRgb(h);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b });
    setHex(rgbToHex(r, g, b));
    setHsl(rgbToHsl(r, g, b));
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    setHsl({ h, s, l });
    const rgbVal = hslToRgb(h, s, l);
    setRgb(rgbVal);
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    showToast(`Copied: ${val}`, "success");
  };

  const randomColor = () => {
    const h = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    updateFromHex(h);
  };

  const presets = ["#F9FF00", "#FF0004", "#1a1a1a", "#FFFFFF", "#2563EB", "#8B5CF6", "#059669", "#D97706", "#EC4899", "#06B6D4"];

  return (
    <ToolLayout toolId="color-converter">
      <div className="max-w-4xl mx-auto">
        {/* Color Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-6">
          <div
            className="min-h-[200px] border-[3px] border-black flex items-center justify-center"
            style={{ backgroundColor: hex }}
          >
            <span className="font-oswald text-4xl font-bold uppercase" style={{ color: hsl.l > 50 ? "#1a1a1a" : "#ffffff" }}>
              {hex.toUpperCase()}
            </span>
          </div>
          <div className="border-[3px] border-black md:border-l-0 p-6 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-oswald text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">HEX</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold">{hex.toUpperCase()}</span>
                  <button onClick={() => copyValue(hex.toUpperCase())} className="p-1 hover:bg-[#F9FF00] transition-colors border border-black">
                    <Copy size={12} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-oswald text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">RGB</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold">rgb({rgb.r}, {rgb.g}, {rgb.b})</span>
                  <button onClick={() => copyValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="p-1 hover:bg-[#F9FF00] transition-colors border border-black">
                    <Copy size={12} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-oswald text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/50">HSL</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</span>
                  <button onClick={() => copyValue(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="p-1 hover:bg-[#F9FF00] transition-colors border border-black">
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-6">
          {/* HEX Input */}
          <div className="border-[3px] border-black p-4">
            <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">HEX</label>
            <input
              type="text"
              className="input-brutal font-mono"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
            />
            <input
              type="color"
              className="w-full h-10 mt-2 cursor-pointer border-[3px] border-black"
              value={hex}
              onChange={(e) => updateFromHex(e.target.value)}
            />
          </div>
          {/* RGB Inputs */}
          <div className="border-[3px] border-black md:border-l-0 p-4">
            <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">RGB</label>
            <div className="space-y-2">
              {(["r", "g", "b"] as const).map(ch => (
                <div key={ch} className="flex items-center gap-2">
                  <span className="font-oswald text-xs font-bold w-4 uppercase">{ch}</span>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={rgb[ch]}
                    onChange={(e) => updateFromRgb(
                      ch === "r" ? +e.target.value : rgb.r,
                      ch === "g" ? +e.target.value : rgb.g,
                      ch === "b" ? +e.target.value : rgb.b
                    )}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[ch]}
                    onChange={(e) => updateFromRgb(
                      ch === "r" ? +e.target.value : rgb.r,
                      ch === "g" ? +e.target.value : rgb.g,
                      ch === "b" ? +e.target.value : rgb.b
                    )}
                    className="w-14 border-[3px] border-black px-2 py-1 font-mono text-xs text-center"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* HSL Inputs */}
          <div className="border-[3px] border-black md:border-l-0 p-4">
            <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">HSL</label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-oswald text-xs font-bold w-4">H</span>
                <input type="range" min={0} max={360} value={hsl.h} onChange={(e) => updateFromHsl(+e.target.value, hsl.s, hsl.l)} className="flex-1" />
                <input type="number" min={0} max={360} value={hsl.h} onChange={(e) => updateFromHsl(+e.target.value, hsl.s, hsl.l)} className="w-14 border-[3px] border-black px-2 py-1 font-mono text-xs text-center" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-oswald text-xs font-bold w-4">S</span>
                <input type="range" min={0} max={100} value={hsl.s} onChange={(e) => updateFromHsl(hsl.h, +e.target.value, hsl.l)} className="flex-1" />
                <input type="number" min={0} max={100} value={hsl.s} onChange={(e) => updateFromHsl(hsl.h, +e.target.value, hsl.l)} className="w-14 border-[3px] border-black px-2 py-1 font-mono text-xs text-center" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-oswald text-xs font-bold w-4">L</span>
                <input type="range" min={0} max={100} value={hsl.l} onChange={(e) => updateFromHsl(hsl.h, hsl.s, +e.target.value)} className="flex-1" />
                <input type="number" min={0} max={100} value={hsl.l} onChange={(e) => updateFromHsl(hsl.h, hsl.s, +e.target.value)} className="w-14 border-[3px] border-black px-2 py-1 font-mono text-xs text-center" />
              </div>
            </div>
          </div>
        </div>

        {/* Presets & Random */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={randomColor} className="btn-brutal btn-brutal-yellow flex items-center gap-2 text-sm py-2 px-4">
            <RefreshCw size={14} />
            RANDOM COLOR
          </button>
          <div className="flex gap-0 border-[3px] border-black">
            {presets.map(p => (
              <button
                key={p}
                onClick={() => updateFromHex(p)}
                className="w-8 h-8 border-r-[3px] border-black last:border-r-0 hover:scale-110 transition-transform"
                style={{ backgroundColor: p }}
                title={p}
              />
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
