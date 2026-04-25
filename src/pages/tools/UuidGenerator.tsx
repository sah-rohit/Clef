import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([generateUUID()]);
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<"lowercase" | "uppercase">("lowercase");
  const { showToast } = useToast();

  const generate = () => {
    const newUuids = Array.from({ length: count }, () => {
      const u = generateUUID();
      return format === "uppercase" ? u.toUpperCase() : u;
    });
    setUuids(newUuids);
    showToast(`${count} UUID(s) generated!`, "success");
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    showToast("All UUIDs copied!", "success");
  };

  return (
    <ToolLayout toolId="uuid-generator">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="font-oswald text-xs font-bold uppercase tracking-widest">Count:</label>
            <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(+e.target.value)} className="w-20 border-[3px] border-black px-3 py-2 font-mono text-center" />
          </div>
          <div className="flex gap-0 border-[3px] border-black">
            <button onClick={() => setFormat("lowercase")} className={`px-3 py-1 font-oswald text-xs border-r-[3px] border-black ${format === "lowercase" ? "bg-[#1a1a1a] text-white" : "bg-white"}`}>lowercase</button>
            <button onClick={() => setFormat("uppercase")} className={`px-3 py-1 font-oswald text-xs ${format === "uppercase" ? "bg-[#1a1a1a] text-white" : "bg-white"}`}>UPPERCASE</button>
          </div>
          <button onClick={generate} className="btn-brutal btn-brutal-yellow flex items-center gap-2">
            <RefreshCw size={16} />
            GENERATE
          </button>
          <button onClick={copyAll} className="btn-brutal bg-white flex items-center gap-2">
            <Copy size={16} />
            COPY ALL
          </button>
        </div>

        <div className="border-[3px] border-black">
          <div className="bg-[#1a1a1a] text-white px-4 py-2">
            <span className="font-oswald text-xs font-bold uppercase tracking-wider">Generated UUIDs</span>
          </div>
          {uuids.map((uuid, i) => (
            <div key={i} className="px-4 py-3 border-b-[3px] border-black last:border-b-0 flex items-center justify-between hover:bg-[#F9FF00]/20 transition-colors">
              <span className="font-mono text-sm">{uuid}</span>
              <button onClick={() => { navigator.clipboard.writeText(uuid); showToast("Copied!", "success"); }} className="p-1 hover:bg-[#F9FF00] transition-colors"><Copy size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
