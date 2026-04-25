import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const LOREM_WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function generateWords(count: number): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) result.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
  return result.join(" ");
}

function generateSentences(count: number): string {
  return Array.from({ length: count }, () => {
    const wordCount = 8 + Math.floor(Math.random() * 12);
    const sentence = generateWords(wordCount);
    return sentence + ".";
  }).join(" ");
}

function generateParagraphs(count: number): string {
  return Array.from({ length: count }, () => generateSentences(3 + Math.floor(Math.random() * 4))).join("\n\n");
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");
  const { showToast } = useToast();

  const generate = () => {
    let result = "";
    if (type === "paragraphs") result = generateParagraphs(count);
    else if (type === "sentences") result = generateSentences(count);
    else result = generateWords(count);
    setOutput(result);
    showToast("Text generated!", "success");
  };

  return (
    <ToolLayout toolId="lorem-ipsum">
      <div className="max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[3px] border-black mb-4">
          {(["paragraphs", "sentences", "words"] as const).map(t => (
            <button key={t} onClick={() => setType(t)} className={`px-4 py-3 font-oswald text-xs font-bold uppercase border-r-[3px] border-black last:border-r-0 ${type === t ? "bg-[#1a1a1a] text-white" : "bg-white hover:bg-[#F9FF00]"}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <label className="font-oswald text-xs font-bold uppercase tracking-widest">Count:</label>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(+e.target.value)} className="w-20 border-[3px] border-black px-3 py-2 font-mono text-center" />
          <button onClick={generate} className="btn-brutal btn-brutal-yellow flex items-center gap-2">
            <RefreshCw size={16} />
            GENERATE
          </button>
          {output && (
            <button onClick={() => { navigator.clipboard.writeText(output); showToast("Copied!", "success"); }} className="btn-brutal bg-white flex items-center gap-2">
              <Copy size={16} />
              COPY
            </button>
          )}
        </div>
        {output && (
          <div className="border-[3px] border-black">
            <div className="bg-[#F9FF00] px-4 py-2">
              <span className="font-oswald text-xs font-bold uppercase tracking-wider">Generated Text</span>
            </div>
            <div className="px-6 py-4 font-inter text-sm leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">{output}</div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
