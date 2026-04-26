import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const bases = [
  { label: "BINARY",      base: 2,  prefix: "0b", color: "#FF0004" },
  { label: "OCTAL",       base: 8,  prefix: "0o", color: "#D97706" },
  { label: "DECIMAL",     base: 10, prefix: "",   color: "#00FF87" },
  { label: "HEX",         base: 16, prefix: "0x", color: "#00E5FF" },
];

export default function NumberBaseConverter() {
  const [values, setValues] = useState<Record<number, string>>({ 2: "", 8: "", 10: "", 16: "" });
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const handleChange = (base: number, raw: string) => {
    setError("");
    const val = raw.trim().replace(/^0[box]/i, "");
    if (!val) { setValues({ 2: "", 8: "", 10: "", 16: "" }); return; }
    const decimal = parseInt(val, base);
    if (isNaN(decimal) || decimal < 0) {
      setError(`"${raw}" is not a valid base-${base} number`);
      setValues(prev => ({ ...prev, [base]: raw }));
      return;
    }
    setValues({
      2:  decimal.toString(2),
      8:  decimal.toString(8),
      10: decimal.toString(10),
      16: decimal.toString(16).toUpperCase(),
    });
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied!", "success");
  };

  return (
    <ToolLayout toolId="number-base-converter">
      <p className="font-inter text-sm text-black/60 mb-8">
        Enter a number in any base — all others update instantly.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-[3px] border-black mb-6">
        {bases.map((b, i) => (
          <div key={b.base} className={`${i % 2 === 0 ? "border-r-[3px]" : ""} ${i < 2 ? "border-b-[3px]" : ""} border-black`}>
            <div
              className="px-4 py-2 border-b-[3px] border-black flex items-center justify-between"
              style={{ background: b.color }}
            >
              <span className="font-oswald text-xs font-bold uppercase tracking-widest">
                {b.label} <span className="opacity-50">(base {b.base})</span>
              </span>
              <button onClick={() => copy(values[b.base] || "")} className="hover:scale-110 transition-transform">
                <Copy size={12} />
              </button>
            </div>
            <div className="flex items-center">
              {b.prefix && (
                <span className="px-3 font-mono text-sm text-black/40 border-r-[3px] border-black py-3 bg-[#fafafa]">
                  {b.prefix}
                </span>
              )}
              <input
                type="text"
                value={values[b.base]}
                onChange={e => handleChange(b.base, e.target.value)}
                placeholder={`Enter ${b.label.toLowerCase()}...`}
                className="flex-1 px-4 py-3 font-mono text-sm outline-none bg-white"
              />
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="border-[3px] border-[#FF0004] bg-[#FF0004]/10 px-4 py-3">
          <p className="font-inter text-xs text-[#FF0004] font-bold">{error}</p>
        </div>
      )}

      {/* Bit visualization */}
      {values[2] && (
        <div className="mt-8">
          <div className="font-oswald text-xs font-bold uppercase tracking-widest mb-3 text-black/60">BIT VISUALIZATION</div>
          <div className="flex flex-wrap gap-1">
            {values[2].padStart(Math.ceil(values[2].length / 8) * 8, "0").split("").map((bit, i) => (
              <div
                key={i}
                className={`w-8 h-8 border-[2px] border-black flex items-center justify-center font-mono text-sm font-bold ${
                  bit === "1" ? "bg-[#FF0004] text-white" : "bg-white text-black/30"
                } ${i % 8 === 0 && i > 0 ? "ml-2" : ""}`}
              >
                {bit}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {values[2].padStart(Math.ceil(values[2].length / 8) * 8, "0").split("").map((_, i) => (
              <div key={i} className={`w-8 text-center font-mono text-[8px] text-black/30 ${i % 8 === 0 && i > 0 ? "ml-2" : ""}`}>
                {Math.ceil(values[2].length / 8) * 8 - 1 - i}
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
