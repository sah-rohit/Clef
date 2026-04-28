import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [testString, setTestString] = useState("Contact us at hello@clef.dev or support@example.com for help.\nYou can also reach admin@test.org anytime.");

  const matches = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const results: { match: string; index: number; groups?: Record<string, string> }[] = [];
      let m;
      const limit = 100;
      let count = 0;
      if (flags.includes("g")) {
        while ((m = regex.exec(testString)) !== null && count < limit) {
          results.push({ match: m[0], index: m.index, groups: m.groups });
          count++;
          if (!flags.includes("g")) break;
        }
      } else {
        m = regex.exec(testString);
        if (m) results.push({ match: m[0], index: m.index, groups: m.groups });
      }
      return { results, error: null };
    } catch (err) {
      return { results: [], error: (err instanceof Error ? err.message : "Invalid regex") };
    }
  }, [pattern, flags, testString]);

  const highlightedText = useMemo(() => {
    if (matches.error || matches.results.length === 0) return testString;
    try {
      const regex = new RegExp(pattern, flags);
      return testString.replace(regex, (match) => `<mark style="background:#F9FF00;border-bottom:3px solid #FF0004;padding:0 2px;">${match}</mark>`);
    } catch {
      return testString;
    }
  }, [testString, pattern, flags, matches]);

  const flagOptions = [
    { flag: "g", label: "Global" },
    { flag: "i", label: "Case Insensitive" },
    { flag: "m", label: "Multiline" },
    { flag: "s", label: "Dotall" },
  ];

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  return (
    <ToolLayout toolId="regex-tester">
      <div className="max-w-4xl mx-auto">
        {/* Pattern */}
        <div className="mb-4">
          <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">Pattern</label>
          <div className="flex items-center gap-0">
            <span className="border-[3px] border-black border-r-0 px-3 py-3 bg-[#fafafa] font-mono text-sm">/</span>
            <input className="input-brutal flex-1 font-mono" value={pattern} onChange={(e) => setPattern(e.target.value)} />
            <span className="border-[3px] border-black border-l-0 px-3 py-3 bg-[#fafafa] font-mono text-sm">/{flags}</span>
          </div>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {flagOptions.map(f => (
            <button key={f.flag} onClick={() => toggleFlag(f.flag)} className={`px-3 py-1 border-[3px] border-black font-inter text-xs ${flags.includes(f.flag) ? "bg-[#F9FF00]" : "bg-white hover:bg-[#F9FF00]/30"}`}>
              <span className="font-mono font-bold">{f.flag}</span> — {f.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {matches.error && (
          <div className="mb-4 px-4 py-2 border-[3px] border-[#FF0004] bg-red-50 font-inter text-sm text-[#FF0004]">
            {matches.error}
          </div>
        )}

        {/* Test String & Highlighted Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-4">
          <div className="border-[3px] border-black">
            <div className="bg-[#1a1a1a] text-white px-4 py-2">
              <span className="font-oswald text-xs font-bold uppercase">Test String</span>
            </div>
            <textarea className="w-full min-h-[250px] px-4 py-3 font-mono text-sm outline-none resize-y" value={testString} onChange={(e) => setTestString(e.target.value)} />
          </div>
          <div className="border-[3px] border-black lg:border-l-0">
            <div className="bg-[#F9FF00] px-4 py-2">
              <span className="font-oswald text-xs font-bold uppercase">Highlighted Matches</span>
            </div>
            <div className="min-h-[250px] px-4 py-3 font-mono text-sm whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: highlightedText }} />
          </div>
        </div>

        {/* Match Results */}
        <div className="border-[3px] border-black">
          <div className="bg-[#1a1a1a] text-white px-4 py-2 flex items-center justify-between">
            <span className="font-oswald text-xs font-bold uppercase">Matches</span>
            <span className="font-inter text-[10px]">{matches.results.length} found</span>
          </div>
          {matches.results.length === 0 ? (
            <div className="px-4 py-4 font-inter text-sm text-[#1a1a1a]/50">No matches found.</div>
          ) : (
            matches.results.map((m, i) => (
              <div key={i} className="px-4 py-2 border-b-[3px] border-black last:border-b-0 flex items-center gap-4 hover:bg-[#F9FF00]/20">
                <span className="font-oswald text-xs font-bold text-[#FF0004] w-8">#{i + 1}</span>
                <span className="font-mono text-sm font-bold bg-[#F9FF00] px-2">{m.match}</span>
                <span className="font-inter text-[10px] text-[#1a1a1a]/50">index: {m.index}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
