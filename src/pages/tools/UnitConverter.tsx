import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { 
  ArrowDownUp, Search, Scale, Ruler, Zap, Clock, 
  Activity, Globe, Copy, Info, LayoutGrid, RotateCcw,
  Wind, Gauge, Maximize2, MoveHorizontal
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const UNITS: Record<string, { label: string; icon: any; units: { value: string; label: string; factor: number }[] }> = {
  length: {
    label: "LENGTH",
    icon: Ruler,
    units: [
      { value: "mm", label: "Millimeter (mm)", factor: 1 },
      { value: "cm", label: "Centimeter (cm)", factor: 10 },
      { value: "m", label: "Meter (m)", factor: 1000 },
      { value: "km", label: "Kilometer (km)", factor: 1000000 },
      { value: "in", label: "Inch (in)", factor: 25.4 },
      { value: "ft", label: "Foot (ft)", factor: 304.8 },
      { value: "yd", label: "Yard (yd)", factor: 914.4 },
      { value: "mi", label: "Mile (mi)", factor: 1609344 },
    ],
  },
  weight: {
    label: "WEIGHT",
    icon: Scale,
    units: [
      { value: "mg", label: "Milligram (mg)", factor: 1 },
      { value: "g", label: "Gram (g)", factor: 1000 },
      { value: "kg", label: "Kilogram (kg)", factor: 1000000 },
      { value: "oz", label: "Ounce (oz)", factor: 28349.5 },
      { value: "lb", label: "Pound (lb)", factor: 453592 },
      { value: "t", label: "Metric Ton (t)", factor: 1000000000 },
    ],
  },
  area: {
    label: "AREA",
    icon: LayoutGrid,
    units: [
      { value: "sqm", label: "Sq Meter (m²)", factor: 1 },
      { value: "sqkm", label: "Sq Kilometer (km²)", factor: 1000000 },
      { value: "sqft", label: "Sq Foot (ft²)", factor: 0.092903 },
      { value: "sqmi", label: "Sq Mile (mi²)", factor: 2589988.11 },
      { value: "acre", label: "Acre (ac)", factor: 4046.86 },
      { value: "hectare", label: "Hectare (ha)", factor: 10000 },
    ],
  },
  data: {
    label: "DATA",
    icon: Zap,
    units: [
      { value: "b", label: "Byte (B)", factor: 1 },
      { value: "kb", label: "Kilobyte (KB)", factor: 1024 },
      { value: "mb", label: "Megabyte (MB)", factor: 1048576 },
      { value: "gb", label: "Gigabyte (GB)", factor: 1073741824 },
      { value: "tb", label: "Terabyte (TB)", factor: 1099511627776 },
      { value: "pb", label: "Petabyte (PB)", factor: 1125899906842624 },
    ],
  },
  time: {
    label: "TIME",
    icon: Clock,
    units: [
      { value: "ms", label: "Millisecond (ms)", factor: 1 },
      { value: "sec", label: "Second (s)", factor: 1000 },
      { value: "min", label: "Minute (m)", factor: 60000 },
      { value: "hr", label: "Hour (h)", factor: 3600000 },
      { value: "day", label: "Day (d)", factor: 86400000 },
      { value: "week", label: "Week (w)", factor: 604800000 },
      { value: "mo", label: "Month (mo)", factor: 2629800000 },
      { value: "yr", label: "Year (yr)", factor: 31557600000 },
    ],
  },
  speed: {
    label: "SPEED",
    icon: Wind,
    units: [
      { value: "mps", label: "Meter/sec (m/s)", factor: 1 },
      { value: "kph", label: "Km/hr (km/h)", factor: 0.277778 },
      { value: "mph", label: "Mile/hr (mph)", factor: 0.44704 },
      { value: "knot", label: "Knot (kn)", factor: 0.514444 },
      { value: "mach", label: "Mach (Ma)", factor: 340.3 },
    ],
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("in");
  const [value, setValue] = useState("100");
  const { showToast } = useToast();

  const catData = UNITS[category];
  const fromDef = useMemo(() => catData.units.find(u => u.value === fromUnit) || catData.units[0], [catData, fromUnit]);
  const toDef = useMemo(() => catData.units.find(u => u.value === toUnit) || catData.units[1], [catData, toUnit]);

  const result = useMemo(() => {
    const numVal = parseFloat(value) || 0;
    return (numVal * fromDef.factor) / toDef.factor;
  }, [value, fromDef, toDef]);

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };
  const copyResult = () => {
    navigator.clipboard.writeText(result.toString());
    showToast("Copied result.", "success");
  };

  return (
    <ToolLayout toolId="unit-converter">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Category Navigation */}
        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
           <div className="flex flex-wrap">
              {Object.entries(UNITS).map(([key, val]) => {
                const Icon = val.icon;
                const isActive = category === key;
                return (
                  <button
                    key={key}
                    onClick={() => { setCategory(key); setFromUnit(val.units[0].value); setToUnit(val.units[1].value); }}
                    className={`flex-1 min-w-[140px] px-6 py-6 border-r-[2px] border-b-[2px] border-black transition-all flex flex-col items-center gap-3 ${isActive ? "bg-black text-white" : "hover:bg-[#F9FF00]"}`}
                  >
                    <Icon size={20} className={isActive ? "text-[#F9FF00]" : "text-black/30"} />
                    <span className="font-oswald text-[10px] font-black uppercase tracking-[0.2em]">{val.label}</span>
                  </button>
                );
              })}
           </div>
        </div>

        {/* Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Converter Pad */}
           <div className="lg:col-span-7">
              <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
                 {/* From Panel */}
                 <div className="p-10 border-b-[4px] border-black">
                    <div className="flex items-center justify-between mb-6">
                       <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">SOURCE_UNIT</label>
                       <span className="font-mono text-[10px] font-bold opacity-20 uppercase">SYSTEM_READY</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                       <input 
                         type="number" 
                         className="flex-1 h-16 border-[3px] border-black px-6 font-mono text-xl font-bold bg-[#fafafa] focus:bg-white outline-none" 
                         value={value} 
                         onChange={(e) => setValue(e.target.value)} 
                       />
                       <select 
                         value={fromUnit} 
                         onChange={(e) => setFromUnit(e.target.value)} 
                         className="h-16 border-[3px] border-black px-6 font-oswald text-sm font-black bg-white outline-none appearance-none cursor-pointer"
                       >
                          {catData.units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                       </select>
                    </div>
                 </div>

                 {/* Swap Bar */}
                 <div className="h-0 relative flex justify-center items-center z-10">
                    <button onClick={swap} className="w-14 h-14 bg-[#F9FF00] border-[4px] border-black flex items-center justify-center hover:bg-black hover:text-[#F9FF00] transition-all shadow-[4px_4px_0px_black] active:shadow-none">
                       <ArrowDownUp size={24} />
                    </button>
                 </div>

                 {/* To Panel */}
                 <div className="p-10 bg-[#fafafa]">
                    <div className="flex items-center justify-between mb-6">
                       <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">TARGET_CONVERSION</label>
                       <button onClick={copyResult} className="flex items-center gap-2 font-oswald text-[10px] font-black uppercase hover:text-[#00FF87] transition-colors"><Copy size={12} /> COPY_RESULT</button>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                       <div className="flex-1 h-16 border-[3px] border-black px-6 font-mono text-xl font-bold bg-white flex items-center overflow-hidden">
                          {result.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                       </div>
                       <select 
                         value={toUnit} 
                         onChange={(e) => setToUnit(e.target.value)} 
                         className="h-16 border-[3px] border-black px-6 font-oswald text-sm font-black bg-white outline-none appearance-none cursor-pointer"
                       >
                          {catData.units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                       </select>
                    </div>
                 </div>
              </div>
           </div>

           {/* Information Dashboard */}
           <div className="lg:col-span-5 space-y-8">
              <div className="bg-[#1a1a1a] text-white p-8 border-[4px] border-black shadow-[12px_12px_0px_black]">
                 <h3 className="font-oswald text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-3"><Activity size={18} className="text-[#F9FF00]" /> CONVERSION_LOG</h3>
                 <div className="space-y-6">
                    <div className="p-5 border-[2px] border-white/10 bg-white/5 relative">
                       <div className="absolute -left-[2px] top-0 bottom-0 w-[4px] bg-[#F9FF00]" />
                       <p className="font-mono text-xs font-bold text-white/40 mb-2 uppercase">EQUATION_STRING</p>
                       <p className="font-mono text-sm font-black text-[#F9FF00] break-all">
                          {value} {fromDef.label.split('(')[0]} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toDef.label.split('(')[0]}
                       </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 border-[2px] border-white/5">
                          <p className="font-oswald text-[9px] font-black uppercase text-white/20 mb-1">FACTOR_RELATION</p>
                          <p className="font-mono text-[10px] font-bold">1:{((fromDef.factor / toDef.factor) || 1).toFixed(4)}</p>
                       </div>
                       <div className="p-4 border-[2px] border-white/5">
                          <p className="font-oswald text-[9px] font-black uppercase text-white/20 mb-1">DATA_STABILITY</p>
                          <p className="font-mono text-[10px] font-bold text-[#00FF87]">NOMINAL</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white border-[4px] border-black p-8">
                 <h3 className="font-oswald text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-3"><Info size={18} className="opacity-20" /> UNIT_QUICK_PRESETS</h3>
                 <div className="grid grid-cols-2 gap-3">
                    {catData.units.slice(0, 6).map(u => (
                      <button 
                        key={u.value}
                        onClick={() => setToUnit(u.value)}
                        className={`p-3 border-[2px] border-black font-oswald text-[10px] font-black uppercase transition-all ${toUnit === u.value ? "bg-black text-white" : "hover:bg-black/5"}`}
                      >
                         {u.label}
                      </button>
                    ))}
                 </div>
              </div>
           </div>

        </div>
      </div>
    </ToolLayout>
  );
}
