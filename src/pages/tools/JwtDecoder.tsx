import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
  try {
    return decodeURIComponent(
      atob(padded).split("").map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
    );
  } catch {
    return atob(padded);
  }
}

function parseJWT(token: string) {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("JWT must have exactly 3 parts separated by dots");
  const header  = JSON.parse(base64UrlDecode(parts[0]));
  const payload = JSON.parse(base64UrlDecode(parts[1]));
  return { header, payload, signature: parts[2] };
}

function formatTime(unix: number) {
  return new Date(unix * 1000).toLocaleString();
}

export default function JwtDecoder() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ReturnType<typeof parseJWT> | null>(null);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const decode = () => {
    setError("");
    setResult(null);
    try {
      setResult(parseJWT(input));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JWT");
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied!", "success");
  };

  const now = Math.floor(Date.now() / 1000);
  const exp = result?.payload?.exp;
  const isExpired = exp && exp < now;
  const isValid = exp && exp >= now;

  return (
    <ToolLayout toolId="jwt-decoder">
      <div className="mb-6">
        <label className="font-oswald text-xs font-bold uppercase tracking-widest block mb-2">PASTE JWT TOKEN</label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature"
          className="input-brutal w-full h-28 resize-none font-mono text-xs"
        />
        {error && (
          <div className="flex items-center gap-2 mt-2 text-[#FF0004]">
            <AlertTriangle size={14} />
            <span className="font-inter text-xs font-bold">{error}</span>
          </div>
        )}
      </div>

      <button
        onClick={decode}
        className="bg-[#9333EA] text-white border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-xs px-8 py-3 hover:bg-black transition-colors flex items-center gap-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-8"
      >
        DECODE JWT
      </button>

      {result && (
        <div className="space-y-0 border-[3px] border-black">
          {/* Status bar */}
          <div className={`px-4 py-3 border-b-[3px] border-black flex items-center gap-3 ${isExpired ? "bg-[#FF0004]/20" : isValid ? "bg-[#00FF87]/20" : "bg-[#fafafa]"}`}>
            {isExpired ? <AlertTriangle size={16} className="text-[#FF0004]" /> : isValid ? <CheckCircle size={16} className="text-[#059669]" /> : null}
            <span className="font-oswald text-xs font-bold uppercase tracking-widest">
              {isExpired ? "TOKEN EXPIRED" : isValid ? "TOKEN VALID" : "NO EXPIRY CLAIM"}
            </span>
            {exp && <span className="font-inter text-xs text-black/50 ml-auto">{isExpired ? "Expired" : "Expires"}: {formatTime(exp)}</span>}
          </div>

          {/* Header */}
          <Section
            title="HEADER"
            color="#00E5FF"
            data={result.header}
            onCopy={() => copy(JSON.stringify(result.header, null, 2))}
          />

          {/* Payload */}
          <Section
            title="PAYLOAD"
            color="#F9FF00"
            data={result.payload}
            onCopy={() => copy(JSON.stringify(result.payload, null, 2))}
            renderExtra={() => (
              <div className="px-4 pb-4 space-y-1">
                {result.payload.iat && <p className="font-inter text-xs text-black/50">Issued at: {formatTime(result.payload.iat)}</p>}
                {result.payload.exp && <p className="font-inter text-xs text-black/50">Expires: {formatTime(result.payload.exp)}</p>}
                {result.payload.nbf && <p className="font-inter text-xs text-black/50">Not before: {formatTime(result.payload.nbf)}</p>}
              </div>
            )}
          />

          {/* Signature */}
          <div className="border-t-[3px] border-black">
            <div className="px-4 py-2 border-b-[3px] border-black bg-[#7C3AED] flex items-center justify-between">
              <span className="font-oswald text-xs font-bold uppercase tracking-widest text-white">SIGNATURE</span>
              <button onClick={() => copy(result.signature)} className="text-white hover:scale-110 transition-transform"><Copy size={12} /></button>
            </div>
            <div className="px-4 py-4 bg-[#7C3AED]/10">
              <p className="font-mono text-xs break-all text-[#7C3AED]">{result.signature}</p>
              <p className="font-inter text-[10px] text-black/40 mt-2">⚠ Signature verification requires the secret key and cannot be done client-side.</p>
            </div>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}

function Section({ title, color, data, onCopy, renderExtra }: {
  title: string;
  color: string;
  data: Record<string, unknown>;
  onCopy: () => void;
  renderExtra?: () => React.ReactNode;
}) {
  return (
    <div className="border-t-[3px] border-black first:border-t-0">
      <div className="px-4 py-2 border-b-[3px] border-black flex items-center justify-between" style={{ background: color }}>
        <span className="font-oswald text-xs font-bold uppercase tracking-widest">{title}</span>
        <button onClick={onCopy} className="hover:scale-110 transition-transform"><Copy size={12} /></button>
      </div>
      <div className="divide-y divide-black/10">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="grid grid-cols-[160px_1fr] hover:bg-[#fafafa] transition-colors">
            <div className="px-4 py-2 border-r border-black/10">
              <span className="font-mono text-xs font-bold text-black/60">{k}</span>
            </div>
            <div className="px-4 py-2">
              <span className="font-mono text-xs break-all">{JSON.stringify(v)}</span>
            </div>
          </div>
        ))}
      </div>
      {renderExtra?.()}
    </div>
  );
}
