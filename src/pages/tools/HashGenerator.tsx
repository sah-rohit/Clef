import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, Fingerprint, ShieldCheck } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

async function generateHash(text: string, algorithm: string) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState({
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
    "SHA-1": "",
  });
  const { showToast } = useToast();

  const handleGenerate = async () => {
    if (!input) {
      showToast("Please enter some text first.", "warning");
      return;
    }

    try {
      const sha256 = await generateHash(input, "SHA-256");
      const sha384 = await generateHash(input, "SHA-384");
      const sha512 = await generateHash(input, "SHA-512");
      const sha1 = await generateHash(input, "SHA-1");

      setHashes({
        "SHA-256": sha256,
        "SHA-384": sha384,
        "SHA-512": sha512,
        "SHA-1": sha1,
      });
      showToast("Hashes generated!", "success");
    } catch (err) {
      showToast("Error generating hashes.", "error");
    }
  };

  const handleCopy = (val: string, name: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    showToast(`${name} copied!`, "success");
  };

  return (
    <ToolLayout toolId="hash-generator">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">Input Text</label>
          <textarea
            className="input-brutal min-h-[150px] resize-y"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to generate cryptographic hashes..."
          />
        </div>

        <button
          onClick={handleGenerate}
          className="btn-brutal btn-brutal-yellow w-full flex items-center justify-center gap-2 mb-8"
        >
          <ShieldCheck size={20} />
          GENERATE HASHES
        </button>

        <div className="space-y-4">
          {Object.entries(hashes).map(([name, value]) => (
            <div key={name} className="border-[3px] border-black">
              <div className="bg-[#1a1a1a] text-white px-4 py-2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Fingerprint size={14} className="text-[#F9FF00]" />
                  <span className="font-oswald text-xs font-bold uppercase tracking-wider">{name}</span>
                </div>
                {value && (
                  <button
                    onClick={() => handleCopy(value, name)}
                    className="text-[#F9FF00] hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    <Copy size={12} />
                    COPY
                  </button>
                )}
              </div>
              <div className="p-4 bg-white">
                <code className="font-mono text-sm break-all text-black/80">
                  {value || "Hash will appear here..."}
                </code>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 border-[3px] border-black bg-[#fafafa]">
          <h4 className="font-oswald text-sm font-bold uppercase tracking-widest mb-3">About Cryptographic Hashes</h4>
          <p className="font-inter text-xs text-black/60 leading-relaxed mb-4">
            A cryptographic hash function is an algorithm that takes an arbitrary amount of data input—a credential, file,
            or text—and produces a fixed-size string of characters, which is usually a hexadecimal number.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-[#F9FF00] border-[2px] border-black flex items-center justify-center flex-shrink-0">
                <span className="font-oswald text-[10px] font-bold">!</span>
              </div>
              <p className="font-inter text-[11px] text-black/60">One-way function: You cannot derive the input from the hash.</p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-[#FF0004] border-[2px] border-black flex items-center justify-center flex-shrink-0">
                <span className="font-oswald text-[10px] font-bold text-white">!</span>
              </div>
              <p className="font-inter text-[11px] text-black/60">Deterministic: The same input always produces the same hash.</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
