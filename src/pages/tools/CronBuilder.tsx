import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const presets = [
  { label: "Every minute",       cron: "* * * * *" },
  { label: "Every hour",         cron: "0 * * * *" },
  { label: "Every day at noon",  cron: "0 12 * * *" },
  { label: "Every Monday 9am",   cron: "0 9 * * 1" },
  { label: "Every weekday 8am",  cron: "0 8 * * 1-5" },
  { label: "1st of month",       cron: "0 0 1 * *" },
  { label: "Every 15 minutes",   cron: "*/15 * * * *" },
  { label: "Twice daily",        cron: "0 8,20 * * *" },
];

function describe(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return "Invalid cron expression (need 5 fields)";
  const [min, hour, dom, month, dow] = parts;

  const fmtMin   = min   === "*" ? "every minute"   : min.startsWith("*/")   ? `every ${min.slice(2)} minutes`   : `at minute ${min}`;
  const fmtHour  = hour  === "*" ? "every hour"     : hour.startsWith("*/")  ? `every ${hour.slice(2)} hours`    : `at ${hour}:00`;
  const fmtDom   = dom   === "*" ? ""               : `on day ${dom} of the month`;
  const fmtMonth = month === "*" ? ""               : `in ${month.split(",").map(m => MONTHS[parseInt(m) - 1] || m).join(", ")}`;
  const fmtDow   = dow   === "*" ? ""               : `on ${dow.split(",").map(d => DAYS[parseInt(d)] || d).join(", ")}`;

  const parts2 = [fmtMin, fmtHour, fmtDom, fmtMonth, fmtDow].filter(Boolean);
  return parts2.join(", ");
}

function validate(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return "Must have exactly 5 fields: minute hour day month weekday";
  const ranges = [[0,59],[0,23],[1,31],[1,12],[0,7]];
  const names = ["minute","hour","day","month","weekday"];
  for (let i = 0; i < 5; i++) {
    const p = parts[i];
    if (p === "*") continue;
    if (/^\*\/\d+$/.test(p)) continue;
    if (/^\d+$/.test(p)) {
      const n = parseInt(p);
      if (n < ranges[i][0] || n > ranges[i][1])
        return `${names[i]} must be ${ranges[i][0]}-${ranges[i][1]}`;
      continue;
    }
    if (/^\d+-\d+$/.test(p)) continue;
    if (/^[\d,]+$/.test(p)) continue;
    return `Invalid value "${p}" for ${names[i]}`;
  }
  return "";
}

export default function CronBuilder() {
  const [cron, setCron] = useState("0 9 * * 1-5");
  const { showToast } = useToast();

  const parts = cron.trim().split(/\s+/);
  const [min, hour, dom, month, dow] = parts.length === 5 ? parts : ["*","*","*","*","*"];

  const update = (idx: number, val: string) => {
    const p = [...parts];
    while (p.length < 5) p.push("*");
    p[idx] = val || "*";
    setCron(p.join(" "));
  };

  const err = validate(cron);
  const desc = err ? err : describe(cron);

  const copy = () => {
    navigator.clipboard.writeText(cron);
    showToast("Copied!", "success");
  };

  const fields = [
    { label: "MINUTE",  value: min,   idx: 0, hint: "0-59" },
    { label: "HOUR",    value: hour,  idx: 1, hint: "0-23" },
    { label: "DAY",     value: dom,   idx: 2, hint: "1-31" },
    { label: "MONTH",   value: month, idx: 3, hint: "1-12" },
    { label: "WEEKDAY", value: dow,   idx: 4, hint: "0-7 (0=Sun)" },
  ];

  return (
    <ToolLayout toolId="cron-builder">
      {/* Presets */}
      <div className="mb-8">
        <div className="font-oswald text-xs font-bold uppercase tracking-widest mb-3 text-black/60">QUICK PRESETS</div>
        <div className="flex flex-wrap gap-0 border-[3px] border-black w-fit">
          {presets.map(p => (
            <button
              key={p.cron}
              onClick={() => setCron(p.cron)}
              className={`px-4 py-2 font-oswald text-[10px] font-bold uppercase tracking-wider border-r-[3px] border-black last:border-r-0 transition-colors hover:bg-[#F9FF00] ${
                cron === p.cron ? "bg-[#F9FF00]" : ""
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual fields */}
      <div className="grid grid-cols-5 gap-0 border-[3px] border-black mb-6">
        {fields.map((f, i) => (
          <div key={f.idx} className={`${i < 4 ? "border-r-[3px]" : ""} border-black`}>
            <div className="px-3 py-1.5 border-b-[3px] border-black bg-[#059669] text-white">
              <span className="font-oswald text-[9px] font-bold uppercase tracking-widest">{f.label}</span>
            </div>
            <input
              type="text"
              value={f.value}
              onChange={e => update(f.idx, e.target.value)}
              className="w-full px-3 py-3 font-mono text-lg font-bold text-center outline-none bg-white"
            />
            <div className="px-3 py-1 border-t-[3px] border-black bg-[#fafafa]">
              <span className="font-inter text-[9px] text-black/40">{f.hint}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Full expression */}
      <div className="flex items-center gap-0 border-[3px] border-black mb-6">
        <div className="px-4 py-3 bg-[#1a1a1a] border-r-[3px] border-black">
          <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-white/60">EXPRESSION</span>
        </div>
        <input
          type="text"
          value={cron}
          onChange={e => setCron(e.target.value)}
          className="flex-1 px-4 py-3 font-mono text-lg font-bold outline-none bg-white"
        />
        <button onClick={copy} className="px-4 py-3 border-l-[3px] border-black hover:bg-[#F9FF00] transition-colors">
          <Copy size={16} />
        </button>
      </div>

      {/* Human readable */}
      <div className={`border-[3px] border-black p-4 ${err ? "bg-[#FF0004]/10 border-[#FF0004]" : "bg-[#059669]/10"}`}>
        <div className="font-oswald text-[10px] font-bold uppercase tracking-widest mb-1 text-black/50">HUMAN READABLE</div>
        <p className={`font-inter text-sm font-medium ${err ? "text-[#FF0004]" : "text-[#059669]"}`}>
          {desc}
        </p>
      </div>

      {/* Reference table */}
      <div className="mt-8 border-[3px] border-black">
        <div className="px-4 py-2 border-b-[3px] border-black bg-[#fafafa]">
          <span className="font-oswald text-xs font-bold uppercase tracking-widest">SYNTAX REFERENCE</span>
        </div>
        {[
          { sym: "*",    desc: "Any value" },
          { sym: "*/n",  desc: "Every n units (e.g. */5 = every 5)" },
          { sym: "n",    desc: "Specific value (e.g. 3)" },
          { sym: "n-m",  desc: "Range (e.g. 1-5 = Mon–Fri)" },
          { sym: "n,m",  desc: "List (e.g. 8,20 = 8am and 8pm)" },
        ].map((r, i) => (
          <div key={i} className="grid grid-cols-[80px_1fr] border-b-[3px] border-black last:border-b-0 hover:bg-[#fafafa] transition-colors">
            <div className="px-4 py-2 border-r-[3px] border-black">
              <code className="font-mono text-sm font-bold text-[#059669]">{r.sym}</code>
            </div>
            <div className="px-4 py-2">
              <span className="font-inter text-xs text-black/70">{r.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}
