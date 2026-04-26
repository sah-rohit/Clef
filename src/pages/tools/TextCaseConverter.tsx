import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const conversions = [
  {
    label: "UPPERCASE",
    color: "#F9FF00",
    fn: (s: string) => s.toUpperCase(),
  },
  {
    label: "lowercase",
    color: "#00E5FF",
    fn: (s: string) => s.toLowerCase(),
  },
  {
    label: "Title Case",
    color: "#00FF87",
    fn: (s: string) =>
      s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  },
  {
    label: "Sentence case",
    color: "#7C3AED",
    fn: (s: string) =>
      s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
  },
  {
    label: "camelCase",
    color: "#FF0004",
    fn: (s: string) =>
      s.toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
  },
  {
    label: "PascalCase",
    color: "#D97706",
    fn: (s: string) => {
      const camel = s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
      return camel.charAt(0).toUpperCase() + camel.slice(1);
    },
  },
  {
    label: "snake_case",
    color: "#059669",
    fn: (s: string) =>
      s.trim()
        .replace(/([A-Z])/g, "_$1")
        .replace(/[\s\-]+/g, "_")
        .replace(/^_/, "")
        .toLowerCase(),
  },
  {
    label: "kebab-case",
    color: "#0891B2",
    fn: (s: string) =>
      s.trim()
        .replace(/([A-Z])/g, "-$1")
        .replace(/[\s_]+/g, "-")
        .replace(/^-/, "")
        .toLowerCase(),
  },
  {
    label: "CONSTANT_CASE",
    color: "#9333EA",
    fn: (s: string) =>
      s.trim()
        .replace(/([A-Z])/g, "_$1")
        .replace(/[\s\-]+/g, "_")
        .replace(/^_/, "")
        .toUpperCase(),
  },
  {
    label: "dot.case",
    color: "#4F46E5",
    fn: (s: string) =>
      s.trim()
        .replace(/([A-Z])/g, ".$1")
        .replace(/[\s_\-]+/g, ".")
        .replace(/^\./, "")
        .toLowerCase(),
  },
  {
    label: "aLtErNaTiNg",
    color: "#E11D48",
    fn: (s: string) =>
      s.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(""),
  },
  {
    label: "ʇxǝʇ pǝddᴉlℲ",
    color: "#1a1a1a",
    fn: (s: string) => {
      const map: Record<string, string> = { a:"ɐ",b:"q",c:"ɔ",d:"p",e:"ǝ",f:"ɟ",g:"ƃ",h:"ɥ",i:"ᴉ",j:"ɾ",k:"ʞ",l:"l",m:"ɯ",n:"u",o:"o",p:"d",q:"b",r:"ɹ",s:"s",t:"ʇ",u:"n",v:"ʌ",w:"ʍ",x:"x",y:"ʎ",z:"z" };
      return s.toLowerCase().split("").map(c => map[c] || c).reverse().join("");
    },
  },
];

export default function TextCaseConverter() {
  const [input, setInput] = useState("");
  const { showToast } = useToast();

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied!", "success");
  };

  return (
    <ToolLayout toolId="text-case-converter">
      <div className="mb-6">
        <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">YOUR TEXT</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type or paste text here..."
          className="input-brutal w-full h-28 resize-none font-inter"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="font-inter text-[10px] text-black/40">{input.length} characters · {input.trim() ? input.trim().split(/\s+/).length : 0} words</span>
          <button onClick={() => setInput("")} className="font-oswald text-[10px] font-bold uppercase text-black/40 hover:text-[#FF0004] transition-colors">CLEAR</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-[3px] border-black">
        {conversions.map((conv, i) => {
          const result = input ? conv.fn(input) : "";
          return (
            <div
              key={i}
              className="border-b-[3px] border-r-[3px] border-black last:border-r-0 group"
            >
              <div
                className="px-3 py-1.5 border-b-[3px] border-black flex items-center justify-between"
                style={{ background: conv.color }}
              >
                <span className="font-oswald text-[10px] font-bold uppercase tracking-widest">
                  {conv.label}
                </span>
                <button
                  onClick={() => result && copy(result)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                >
                  <Copy size={12} />
                </button>
              </div>
              <div
                className="px-3 py-3 min-h-[56px] font-mono text-sm break-all cursor-pointer hover:bg-[#fafafa] transition-colors"
                onClick={() => result && copy(result)}
                title="Click to copy"
              >
                {result || <span className="text-black/20 italic text-xs">type something above</span>}
              </div>
            </div>
          );
        })}
      </div>
    </ToolLayout>
  );
}
