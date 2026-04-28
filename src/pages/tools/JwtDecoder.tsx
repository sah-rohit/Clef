import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { 
  Copy, AlertTriangle, CheckCircle, ShieldCheck, 
  Info, Cpu, Terminal, Key, Lock, Eye, AlertCircle,
  Zap, Database, Globe, Fingerprint
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";

const CLAIMS_INFO: Record<string, string> = {
  iss: "Issuer: Identifies the principal that issued the JWT.",
  sub: "Subject: Identifies the principal that is the subject of the JWT.",
  aud: "Audience: Identifies the recipients that the JWT is intended for.",
  exp: "Expiration Time: Identifies the expiration time on or after which the JWT must not be accepted.",
  nbf: "Not Before: Identifies the time before which the JWT must not be accepted.",
  iat: "Issued At: Identifies the time at which the JWT was issued.",
  jti: "JWT ID: Provides a unique identifier for the JWT.",
};

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
      if (!input.trim()) return;
      setResult(parseJWT(input));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid JWT structure");
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard.", "success");
  };

  const securityAudit = useMemo(() => {
    if (!result) return [];
    const findings: { type: "error" | "warning" | "success"; msg: string }[] = [];
    
    // Algorithm check
    const alg = result.header.alg?.toLowerCase();
    if (alg === "none") findings.push({ type: "error", msg: "DANGEROUS_ALGORITHM: 'none' detected. Token can be forged." });
    else if (alg === "hs256") findings.push({ type: "warning", msg: "HMAC_SHA256: Ensure a strong, high-entropy secret is used." });
    else findings.push({ type: "success", msg: `ALGORITHM_STABLE: ${result.header.alg} in use.` });

    // Expiry check
    const now = Math.floor(Date.now() / 1000);
    const exp = result.payload.exp;
    if (!exp) findings.push({ type: "warning", msg: "NO_EXPIRY: Token never expires. Highly risky if leaked." });
    else if (exp < now) findings.push({ type: "error", msg: `TOKEN_EXPIRED: Session ended on ${formatTime(exp)}.` });
    else findings.push({ type: "success", msg: "TEMPORAL_VALIDITY: Token is currently active." });

    // Issued At check
    if (result.payload.iat && result.payload.iat > now) findings.push({ type: "warning", msg: "TIME_DRIFT: 'iat' claim is in the future." });

    return findings;
  }, [result]);

  return (
    <ToolLayout toolId="jwt-decoder">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Token Input Workbench */}
        <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_black]">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#9333EA] border-[3px] border-black flex items-center justify-center shrink-0">
                 <Lock size={20} className="text-white" />
              </div>
              <div>
                 <h2 className="font-oswald text-2xl font-black uppercase">TOKEN_WORKBENCH</h2>
                 <p className="font-inter text-[10px] font-bold opacity-30 tracking-widest uppercase">RSA // HMAC // ECDSA DECODING</p>
              </div>
           </div>
           
           <div className="space-y-4">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Paste your JWT (Header.Payload.Signature) here..."
                className="w-full h-32 border-[3px] border-black p-6 font-mono text-xs font-bold bg-[#fafafa] focus:bg-white outline-none resize-none transition-all custom-scrollbar"
              />
              <div className="flex flex-col md:flex-row items-center gap-4">
                 <button
                   onClick={decode}
                   className="w-full md:w-auto px-10 h-14 bg-black text-white border-[3px] border-black font-oswald font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#9333EA] transition-all shadow-[6px_6px_0px_rgba(0,0,0,0.2)]"
                 >
                   <Zap size={16} /> DECODE_SEGMENTS
                 </button>
                 {error && (
                   <div className="flex-1 flex items-center gap-3 text-[#FF0004] font-mono text-xs font-bold p-4 bg-[#FF0004]/5 border-[2px] border-[#FF0004]/20 w-full md:w-auto">
                      <AlertCircle size={16} /> {error}
                   </div>
                 )}
              </div>
           </div>
        </div>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up">
             
             {/* Left Column: Data segments */}
             <div className="lg:col-span-8 space-y-8">
                
                {/* Header segment */}
                <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
                   <div className="px-6 py-4 bg-[#00E5FF] border-b-[4px] border-black flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Cpu size={16} />
                         <span className="font-oswald text-sm font-black uppercase tracking-widest">HEADER_SEGMENT</span>
                      </div>
                      <button onClick={() => copy(JSON.stringify(result.header, null, 2))} className="hover:scale-110 transition-transform"><Copy size={16} /></button>
                   </div>
                   <div className="p-0">
                      {Object.entries(result.header).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[180px_1fr] border-b border-black/5 hover:bg-black/[0.02] transition-colors last:border-b-0">
                           <div className="px-6 py-4 border-r border-black/5 bg-[#00E5FF]/5">
                              <span className="font-mono text-xs font-black text-black/60">{k}</span>
                           </div>
                           <div className="px-6 py-4">
                              <span className="font-mono text-xs font-bold break-all">{JSON.stringify(v)}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Payload segment */}
                <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_black] overflow-hidden">
                   <div className="px-6 py-4 bg-[#F9FF00] border-b-[4px] border-black flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Database size={16} />
                         <span className="font-oswald text-sm font-black uppercase tracking-widest">PAYLOAD_SEGMENT</span>
                      </div>
                      <button onClick={() => copy(JSON.stringify(result.payload, null, 2))} className="hover:scale-110 transition-transform"><Copy size={16} /></button>
                   </div>
                   <div className="p-0">
                      {Object.entries(result.payload).map(([k, v]) => (
                        <div key={k} className="group grid grid-cols-[180px_1fr] border-b border-black/5 hover:bg-black/[0.02] transition-colors last:border-b-0">
                           <div className="px-6 py-4 border-r border-black/5 bg-[#F9FF00]/5 relative">
                              <span className="font-mono text-xs font-black text-black/60">{k}</span>
                              {CLAIMS_INFO[k] && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Info size={12} className="text-black/20" title={CLAIMS_INFO[k]} />
                                </div>
                              )}
                           </div>
                           <div className="px-6 py-4 flex flex-col gap-2">
                              <span className="font-mono text-xs font-bold break-all">{JSON.stringify(v)}</span>
                              {(k === 'exp' || k === 'iat' || k === 'nbf') && typeof v === 'number' && (
                                <span className="font-oswald text-[9px] font-black uppercase text-black/40 tracking-widest">
                                   DECODED: {formatTime(v)}
                                </span>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Signature segment */}
                <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_rgba(0,0,0,0.1)]">
                   <div className="px-6 py-4 bg-[#7C3AED] text-white border-b-[4px] border-black flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <Fingerprint size={16} />
                         <span className="font-oswald text-sm font-black uppercase tracking-widest">SIGNATURE_VERIFICATION</span>
                      </div>
                      <button onClick={() => copy(result.signature)} className="hover:scale-110 transition-transform"><Copy size={16} /></button>
                   </div>
                   <div className="p-8 bg-[#7C3AED]/5">
                      <p className="font-mono text-xs font-bold text-[#7C3AED] break-all leading-relaxed">{result.signature}</p>
                      <div className="mt-8 pt-8 border-t border-[#7C3AED]/20 flex items-start gap-4">
                         <ShieldCheck className="text-[#7C3AED] shrink-0" size={24} />
                         <div>
                            <h4 className="font-oswald text-xs font-black uppercase mb-1">CLIENT_SIDE_LIMITATION</h4>
                            <p className="font-inter text-[10px] font-medium text-black/50 leading-relaxed uppercase">
                               Cryptographic verification of signatures requires access to the private key or secret. 
                               This tool performs structure and claim analysis only.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>

             </div>

             {/* Right Column: Security Audit & Claims */}
             <div className="lg:col-span-4 space-y-8">
                
                {/* Security Audit */}
                <div className="bg-black text-white border-[4px] border-black shadow-[12px_12px_0px_rgba(0,0,0,0.1)] overflow-hidden">
                   <div className="px-6 py-4 border-b-[2px] border-white/10 flex items-center gap-3 bg-[#1a1a1a]">
                      <ShieldCheck size={18} className="text-[#00FF87]" />
                      <span className="font-oswald text-sm font-black uppercase tracking-widest">SECURITY_AUDIT</span>
                   </div>
                   <div className="divide-y divide-white/10">
                      {securityAudit.map((finding, i) => (
                        <div key={i} className="px-6 py-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                           {finding.type === 'error' && <AlertCircle size={16} className="text-[#FF0004] shrink-0 mt-0.5" />}
                           {finding.type === 'warning' && <AlertTriangle size={16} className="text-[#F9FF00] shrink-0 mt-0.5" />}
                           {finding.type === 'success' && <CheckCircle size={16} className="text-[#00FF87] shrink-0 mt-0.5" />}
                           <p className={`font-mono text-[10px] font-bold uppercase tracking-tight ${
                             finding.type === 'error' ? 'text-[#FF0004]' : 
                             finding.type === 'warning' ? 'text-[#F9FF00]' : 'text-white'
                           }`}>
                              {finding.msg}
                           </p>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Claims Reference */}
                <div className="bg-white border-[4px] border-black p-8">
                   <div className="flex items-center gap-3 mb-8">
                      <Globe size={18} className="opacity-30" />
                      <h3 className="font-oswald text-lg font-black uppercase tracking-widest">STANDARD_CLAIMS</h3>
                   </div>
                   <div className="space-y-6">
                      {Object.entries(CLAIMS_INFO).map(([k, v]) => (
                        <div key={k} className="relative pl-6 border-l-[3px] border-black/10">
                           <div className="absolute -left-[3px] top-0 w-[3px] h-4 bg-black" />
                           <h4 className="font-mono text-[11px] font-black uppercase mb-1">{k}</h4>
                           <p className="font-inter text-[10px] font-bold text-black/40 uppercase leading-relaxed">{v.split(': ')[1]}</p>
                        </div>
                      ))}
                   </div>
                </div>

             </div>

          </div>
        )}
      </div>
    </ToolLayout>
  );
}
