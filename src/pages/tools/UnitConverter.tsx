import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { ArrowDownUp } from "lucide-react";

const UNITS: Record<string, { label: string; units: { value: string; label: string; factor: number }[] }> = {
  length: {
    label: "LENGTH",
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
    units: [
      { value: "mg", label: "Milligram (mg)", factor: 1 },
      { value: "g", label: "Gram (g)", factor: 1000 },
      { value: "kg", label: "Kilogram (kg)", factor: 1000000 },
      { value: "oz", label: "Ounce (oz)", factor: 28349.5 },
      { value: "lb", label: "Pound (lb)", factor: 453592 },
      { value: "t", label: "Metric Ton (t)", factor: 1000000000 },
    ],
  },
  temperature: {
    label: "TEMPERATURE",
    units: [
      { value: "c", label: "Celsius (°C)", factor: 0 },
      { value: "f", label: "Fahrenheit (°F)", factor: 0 },
      { value: "k", label: "Kelvin (K)", factor: 0 },
    ],
  },
  data: {
    label: "DATA",
    units: [
      { value: "b", label: "Byte (B)", factor: 1 },
      { value: "kb", label: "Kilobyte (KB)", factor: 1024 },
      { value: "mb", label: "Megabyte (MB)", factor: 1048576 },
      { value: "gb", label: "Gigabyte (GB)", factor: 1073741824 },
      { value: "tb", label: "Terabyte (TB)", factor: 1099511627776 },
    ],
  },
};

function convertTemp(value: number, from: string, to: string): number {
  let celsius = value;
  if (from === "f") celsius = (value - 32) * 5 / 9;
  if (from === "k") celsius = value - 273.15;
  if (to === "c") return celsius;
  if (to === "f") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [fromUnit, setFromUnit] = useState("cm");
  const [toUnit, setToUnit] = useState("in");
  const [value, setValue] = useState("100");

  const catData = UNITS[category];
  const fromDef = catData.units.find(u => u.value === fromUnit)!;
  const toDef = catData.units.find(u => u.value === toUnit)!;

  let result = 0;
  const numVal = parseFloat(value) || 0;
  if (category === "temperature") {
    result = convertTemp(numVal, fromUnit, toUnit);
  } else {
    result = (numVal * fromDef.factor) / toDef.factor;
  }

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  return (
    <ToolLayout toolId="unit-converter">
      <div className="max-w-2xl mx-auto">
        {/* Category */}
        <div className="flex flex-wrap gap-0 border-[3px] border-black mb-6">
          {Object.entries(UNITS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => { setCategory(key); setFromUnit(val.units[0].value); setToUnit(val.units[1].value); }}
              className={`flex-1 px-4 py-2 font-oswald text-xs font-bold uppercase border-r-[3px] border-black last:border-r-0 ${category === key ? "bg-[#1a1a1a] text-white" : "bg-white hover:bg-[#F9FF00]"}`}
            >
              {val.label}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="border-[3px] border-black mb-6">
          <div className="p-6 border-b-[3px] border-black">
            <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">From</label>
            <div className="flex gap-2">
              <input type="number" className="input-brutal flex-1 font-mono text-lg" value={value} onChange={(e) => setValue(e.target.value)} />
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="input-brutal w-48 font-inter text-sm">
                {catData.units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div className="px-6 py-2 flex justify-center">
            <button onClick={swap} className="p-2 border-[3px] border-black hover:bg-[#F9FF00] transition-colors">
              <ArrowDownUp size={18} />
            </button>
          </div>
          <div className="p-6 border-t-[3px] border-black bg-[#F9FF00]/10">
            <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">To</label>
            <div className="flex gap-2">
              <div className="input-brutal flex-1 font-mono text-lg bg-white flex items-center">
                {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="input-brutal w-48 font-inter text-sm">
                {catData.units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Formula */}
        <div className="border-[3px] border-black px-4 py-3 bg-[#fafafa]">
          <span className="font-inter text-xs text-[#1a1a1a]/60">
            {numVal} {fromDef.label} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toDef.label}
          </span>
        </div>
      </div>
    </ToolLayout>
  );
}
