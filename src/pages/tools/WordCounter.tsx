import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";

export default function WordCounter() {
  const [text, setText] = useState("");

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
  const lines = text.split("\n").length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return (
    <ToolLayout toolId="word-counter">
      <div className="max-w-4xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-[3px] border-black mb-6">
          {[
            { label: "Words", value: words },
            { label: "Characters", value: chars },
            { label: "No Spaces", value: charsNoSpaces },
            { label: "Sentences", value: sentences },
            { label: "Paragraphs", value: paragraphs },
            { label: "Lines", value: lines },
            { label: "Read Time", value: `${readingTime} min` },
            { label: "Avg Word", value: words ? (charsNoSpaces / words).toFixed(1) : "0" },
          ].map((stat, i) => (
            <div key={i} className="border-[3px] border-black m-[-1.5px] px-4 py-3 text-center">
              <div className="font-oswald text-2xl font-bold">{stat.value}</div>
              <div className="font-inter text-[10px] uppercase tracking-widest text-[#1a1a1a]/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
        <textarea
          className="input-brutal min-h-[400px] resize-y font-inter text-sm leading-relaxed"
          placeholder="Start typing or paste your text here to see real-time statistics..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </ToolLayout>
  );
}
