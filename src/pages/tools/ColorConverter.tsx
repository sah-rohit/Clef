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
      <div className="flex flex-col gap-10">
        {/* Large Immersive Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          <div className="relative group">
            <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-all duration-300" />
            <div
              className="relative h-[300px] border-[4px] border-black flex flex-col items-center justify-center overflow-hidden transition-all duration-500"
              style={{ backgroundColor: hex }}
            >
              <div className="absolute top-4 left-4 font-oswald text-[10px] font-black uppercase tracking-[0.3em] opacity-30">COLOR_VIEWPORT</div>
              <h2 className="font-oswald text-6xl md:text-8xl font-black uppercase transition-all duration-500 transform group-hover:scale-110" style={{ color: hsl.l > 50 ? "#1a1a1a" : "#ffffff" }}>
                {hex.toUpperCase()}
              </h2>
              <div className="absolute bottom-4 right-4 flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rotate-45" style={{ background: hsl.l > 50 ? "#1a1a1a" : "#ffffff", opacity: 0.2 + (i * 0.2) }} />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 justify-center animate-slide-left">
            <div className="flex flex-col gap-4">
               {[
                 { label: "HEX_BUFFER", value: hex.toUpperCase(), copy: hex.toUpperCase() },
                 { label: "RGB_DATA", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, copy: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
                 { label: "HSL_COORD", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, copy: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` }
               ].map((item, i) => (
                 <div key={i} className="group flex items-center justify-between p-4 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all duration-300 shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                   <div className="flex flex-col">
                     <span className="font-oswald text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">{item.label}</span>
                     <span className="font-mono text-sm font-bold">{item.value}</span>
                   </div>
                   <button onClick={() => copyValue(item.copy)} className="p-3 border-[2px] border-black group-hover:border-white transition-colors">
                     <Copy size={16} />
                   </button>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Control Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
          {/* HEX ENGINE */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-2 bg-black rotate-45" />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">HEX_ENGINE</span>
              </div>
              <div className="flex flex-col gap-3 p-6 border-[3px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                <div className="relative h-24 border-[3px] border-black overflow-hidden group">
                  <input
                    type="color"
                    value={hex}
                    onChange={(e) => updateFromHex(e.target.value)}
                    className="absolute inset-[-10px] w-[calc(100%+20px)] h-[calc(100%+20px)] cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  className="w-full border-[3px] border-black p-3 font-mono text-sm font-bold text-center outline-none focus:bg-[#F9FF00]/10 transition-colors"
                  value={hex.toUpperCase()}
                  onChange={(e) => updateFromHex(e.target.value)}
                />
              </div>
          </div>

          {/* RGB MATRIX */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-2 bg-[#FF0004] rotate-45 border border-black shadow-[1px_1px_0px_black]" />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">RGB_MATRIX</span>
              </div>
              <div className="flex flex-col gap-6 p-6 border-[3px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                {(["r", "g", "b"] as const).map(ch => (
                  <div key={ch} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-oswald text-[10px] font-black uppercase opacity-40">{ch === 'r' ? 'RED' : ch === 'g' ? 'GREEN' : 'BLUE'}</span>
                      <span className="font-mono text-[10px] font-bold">{rgb[ch]}</span>
                    </div>
                    <div className="flex items-center gap-4">
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
                        className="flex-1 accent-black"
                      />
                    </div>
                  </div>
                ))}
              </div>
          </div>

          {/* HSL COORDINATES */}
          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-2 bg-[#F9FF00] rotate-45 border border-black shadow-[1px_1px_0px_black]" />
                <span className="font-oswald text-xs font-black uppercase tracking-widest">HSL_COORD_ARRAY</span>
              </div>
              <div className="flex flex-col gap-6 p-6 border-[3px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                {[
                  { ch: "h", label: "HUE", max: 360, unit: "°" },
                  { ch: "s", label: "SAT", max: 100, unit: "%" },
                  { ch: "l", label: "LUM", max: 100, unit: "%" }
                ].map(item => (
                  <div key={item.ch} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-oswald text-[10px] font-black uppercase opacity-40">{item.label}</span>
                      <span className="font-mono text-[10px] font-bold">{hsl[item.ch as keyof typeof hsl]}{item.unit}</span>
                    </div>
                    <input 
                      type="range" 
                      min={0} 
                      max={item.max} 
                      value={hsl[item.ch as keyof typeof hsl]} 
                      onChange={(e) => updateFromHsl(
                        item.ch === "h" ? +e.target.value : hsl.h,
                        item.ch === "s" ? +e.target.value : hsl.s,
                        item.ch === "l" ? +e.target.value : hsl.l
                      )} 
                      className="flex-1 accent-[#FF0004]" 
                    />
                  </div>
                ))}
              </div>
          </div>
        </div>

        {/* Utility Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-8 py-8 px-8 bg-black border-[4px] border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] animate-slide-up">
          <button 
            onClick={randomColor} 
            className="group flex items-center gap-4 bg-[#F9FF00] text-black font-oswald font-black uppercase tracking-[0.2em] text-sm py-4 px-8 border-[4px] border-black transition-all duration-300 hover:-translate-y-1 hover:bg-white"
          >
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
            REGENERATE_RANDOM_SEED
          </button>
          
          <div className="flex flex-col gap-3">
             <span className="font-oswald text-[9px] font-black uppercase tracking-[0.3em] text-white/30 text-right">SYSTEM_PRESETS</span>
             <div className="flex gap-0 border-[3px] border-white/20">
                {presets.map(p => (
                  <button
                    key={p}
                    onClick={() => updateFromHex(p)}
                    className="w-10 h-10 border-r-[3px] border-white/20 last:border-r-0 hover:scale-110 hover:z-10 transition-all duration-200"
                    style={{ backgroundColor: p }}
                  />
                ))}
              </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
