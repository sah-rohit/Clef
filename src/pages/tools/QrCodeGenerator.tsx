import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Copy, Download, RefreshCw, Smartphone } from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import QRCode from "qrcode";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://clef.dev");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(4);
  const [color, setColor] = useState({ dark: "#1a1a1a", light: "#ffffff" });
  const { showToast } = useToast();

  useEffect(() => {
    generateQR();
  }, [size, margin, color]);

  const generateQR = async () => {
    if (!text.trim()) return;
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: margin,
        color: {
          dark: color.dark,
          light: color.light
        },
        errorCorrectionLevel: 'H'
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
      showToast("Generation failed.", "error");
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "clef_qrcode.png";
    a.click();
    showToast("QR Code downloaded!", "success");
  };

  const handleCopy = () => {
    if (!qrUrl) return;
    navigator.clipboard.writeText(qrUrl);
    showToast("Data URL copied!", "success");
  };

  return (
    <ToolLayout toolId="qr-code-generator">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-black/40 block">INPUT DATA</label>
            <textarea 
              className="input-brutal min-h-[120px] resize-none bg-[#fafafa] font-mono text-sm p-5" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Enter text or URL..." 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-black/40 block">SIZE (PX)</label>
              <select 
                className="input-brutal bg-white py-3 text-xs font-bold uppercase"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              >
                {[128, 256, 512, 1024].map(s => <option key={s} value={s}>{s} PX</option>)}
              </select>
            </div>
            <div className="space-y-4">
              <label className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-black/40 block">MARGIN</label>
              <input 
                type="range" 
                min="0" max="10" 
                className="w-full accent-black" 
                value={margin} 
                onChange={(e) => setMargin(Number(e.target.value))} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-black/40 block">DARK COLOR</label>
              <div className="flex gap-2">
                <input type="color" className="w-10 h-10 border-[3px] border-black cursor-pointer" value={color.dark} onChange={(e) => setColor({...color, dark: e.target.value})} />
                <input type="text" className="input-brutal py-2 text-[10px] flex-1 font-mono uppercase" value={color.dark} readOnly />
              </div>
            </div>
            <div className="space-y-4">
              <label className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-black/40 block">LIGHT COLOR</label>
              <div className="flex gap-2">
                <input type="color" className="w-10 h-10 border-[3px] border-black cursor-pointer" value={color.light} onChange={(e) => setColor({...color, light: e.target.value})} />
                <input type="text" className="input-brutal py-2 text-[10px] flex-1 font-mono uppercase" value={color.light} readOnly />
              </div>
            </div>
          </div>

          <button onClick={generateQR} className="btn-brutal btn-brutal-yellow w-full flex items-center justify-center gap-3">
            <RefreshCw size={20} />
            REFRESH QR CODE
          </button>
        </div>

        <div className="flex flex-col">
          <div className="flex-1 border-[4px] border-black bg-[#1a1a1a] p-1 shadow-[8px_8px_0px_rgba(0,0,0,1)] relative flex flex-col min-h-[400px]">
            <div className="bg-[#1a1a1a] text-white px-4 py-2 border-b-[2px] border-white/10 flex justify-between items-center">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <Smartphone size={14} /> LIVE PREVIEW
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-hidden relative">
               {/* Patterned Background */}
               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '20px 20px' }} />
               
               {qrUrl ? (
                 <div className="relative group">
                   <img 
                     src={qrUrl} 
                     alt="QR Code" 
                     className="border-[6px] border-black shadow-[12px_12px_0px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-300" 
                     style={{ width: '100%', maxWidth: '300px', imageRendering: 'pixelated' }} 
                   />
                 </div>
               ) : (
                 <div className="animate-pulse flex flex-col items-center">
                   <RefreshCw size={48} className="text-black/10" />
                 </div>
               )}
            </div>
            <div className="p-4 bg-white border-t-[4px] border-black grid grid-cols-2 gap-4">
              <button onClick={handleDownload} className="btn-brutal btn-brutal-yellow flex items-center justify-center gap-2 text-xs py-3">
                <Download size={16} /> DOWNLOAD
              </button>
              <button onClick={handleCopy} className="btn-brutal bg-white flex items-center justify-center gap-2 text-xs py-3">
                <Copy size={16} /> DATA URL
              </button>
            </div>
          </div>
          <p className="mt-6 font-inter text-[10px] text-black/40 uppercase font-bold tracking-tighter text-center">
            Standard High-Correction (Level H) QR Generation • Scan with any smartphone
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
