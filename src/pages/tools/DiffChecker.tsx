import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { GitCompare } from "lucide-react";

type DiffLine = { type: "same" | "added" | "removed"; text: string; lineA?: number; lineB?: number };

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const result: DiffLine[] = [];

  // Simple LCS-based diff
  const m = linesA.length, n = linesB.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = linesA[i] === linesB[j]
        ? dp[i + 1][j + 1] + 1
        : Math.max(dp[i + 1][j], dp[i][j + 1]);

  let i = 0, j = 0, lineA = 1, lineB = 1;
  while (i < m || j < n) {
    if (i < m && j < n && linesA[i] === linesB[j]) {
      result.push({ type: "same", text: linesA[i], lineA: lineA++, lineB: lineB++ });
      i++; j++;
    } else if (j < n && (i >= m || dp[i][j + 1] >= dp[i + 1][j])) {
      result.push({ type: "added", text: linesB[j], lineB: lineB++ });
      j++;
    } else {
      result.push({ type: "removed", text: linesA[i], lineA: lineA++ });
      i++;
    }
  }
  return result;
}

export default function DiffChecker() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<DiffLine[] | null>(null);

  const run = () => setDiff(computeDiff(textA, textB));

  const added   = diff?.filter(d => d.type === "added").length ?? 0;
  const removed = diff?.filter(d => d.type === "removed").length ?? 0;

  return (
    <ToolLayout toolId="diff-checker">
      {!diff ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-[3px] border-black mb-6">
            <div className="border-r-[3px] border-black">
              <div className="px-4 py-2 border-b-[3px] border-black bg-[#fafafa] flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF0004]" />
                <span className="font-oswald text-xs font-bold uppercase tracking-widest">ORIGINAL (A)</span>
              </div>
              <textarea
                value={textA}
                onChange={e => setTextA(e.target.value)}
                placeholder="Paste original text here..."
                className="w-full h-72 p-4 font-mono text-xs resize-none outline-none"
              />
            </div>
            <div>
              <div className="px-4 py-2 border-b-[3px] border-black bg-[#fafafa] flex items-center gap-2">
                <div className="w-3 h-3 bg-[#00FF87]" />
                <span className="font-oswald text-xs font-bold uppercase tracking-widest">MODIFIED (B)</span>
              </div>
              <textarea
                value={textB}
                onChange={e => setTextB(e.target.value)}
                placeholder="Paste modified text here..."
                className="w-full h-72 p-4 font-mono text-xs resize-none outline-none"
              />
            </div>
          </div>
          <button
            onClick={run}
            className="bg-[#7C3AED] text-white border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-xs px-8 py-3 hover:bg-black transition-colors flex items-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          >
            <GitCompare size={14} /> COMPARE
          </button>
        </>
      ) : (
        <>
          {/* Stats */}
          <div className="flex flex-wrap gap-0 border-[3px] border-black mb-6 w-fit">
            <div className="px-5 py-2 border-r-[3px] border-black bg-[#00FF87]">
              <span className="font-oswald text-sm font-bold">+{added}</span>
              <span className="font-oswald text-[10px] font-bold uppercase ml-2">Added</span>
            </div>
            <div className="px-5 py-2 border-r-[3px] border-black bg-[#FF0004] text-white">
              <span className="font-oswald text-sm font-bold">-{removed}</span>
              <span className="font-oswald text-[10px] font-bold uppercase ml-2">Removed</span>
            </div>
            <button
              onClick={() => setDiff(null)}
              className="px-5 py-2 font-oswald text-[10px] font-bold uppercase tracking-widest hover:bg-[#F9FF00] transition-colors"
            >
              EDIT
            </button>
          </div>

          {/* Diff output */}
          <div className="border-[3px] border-black overflow-auto max-h-[600px]">
            <div className="grid grid-cols-[40px_1fr_40px_1fr] font-mono text-xs">
              <div className="col-span-2 px-3 py-1 border-b-[3px] border-r-[3px] border-black bg-[#fafafa] font-oswald text-[10px] font-bold uppercase">ORIGINAL</div>
              <div className="col-span-2 px-3 py-1 border-b-[3px] border-black bg-[#fafafa] font-oswald text-[10px] font-bold uppercase">MODIFIED</div>
              {diff.map((line, i) => {
                if (line.type === "same") return (
                  <>
                    <div key={`la-${i}`} className="px-2 py-0.5 text-black/30 text-right border-r border-black/10 select-none">{line.lineA}</div>
                    <div key={`ta-${i}`} className="px-3 py-0.5 border-r-[3px] border-black/10 whitespace-pre-wrap break-all">{line.text || " "}</div>
                    <div key={`lb-${i}`} className="px-2 py-0.5 text-black/30 text-right border-r border-black/10 select-none">{line.lineB}</div>
                    <div key={`tb-${i}`} className="px-3 py-0.5 whitespace-pre-wrap break-all">{line.text || " "}</div>
                  </>
                );
                if (line.type === "removed") return (
                  <>
                    <div key={`la-${i}`} className="px-2 py-0.5 text-black/30 text-right border-r border-black/10 bg-[#FF0004]/10 select-none">{line.lineA}</div>
                    <div key={`ta-${i}`} className="px-3 py-0.5 border-r-[3px] border-black/10 bg-[#FF0004]/10 whitespace-pre-wrap break-all text-[#FF0004]">{line.text || " "}</div>
                    <div key={`lb-${i}`} className="px-2 py-0.5 border-r border-black/10 bg-[#fafafa] select-none" />
                    <div key={`tb-${i}`} className="px-3 py-0.5 bg-[#fafafa]" />
                  </>
                );
                return (
                  <>
                    <div key={`la-${i}`} className="px-2 py-0.5 border-r border-black/10 bg-[#fafafa] select-none" />
                    <div key={`ta-${i}`} className="px-3 py-0.5 border-r-[3px] border-black/10 bg-[#fafafa]" />
                    <div key={`lb-${i}`} className="px-2 py-0.5 text-black/30 text-right border-r border-black/10 bg-[#00FF87]/20 select-none">{line.lineB}</div>
                    <div key={`tb-${i}`} className="px-3 py-0.5 bg-[#00FF87]/20 whitespace-pre-wrap break-all text-[#166534]">{line.text || " "}</div>
                  </>
                );
              })}
            </div>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
