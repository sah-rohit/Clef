import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { 
  Copy, Download, RefreshCw, Smartphone, Palette, 
  Settings2, LayoutGrid, Info, CheckCircle2,
  Maximize2, Eye, Share2, Printer, QrCode as QrIcon
} from "lucide-react";
import { useToast } from "@/providers/ToastProvider";
import QRCode from "qrcode";

type ECLevel = 'L' | 'M' | 'Q' | 'H';

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://clef.pages.dev/");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [size, setSize] = useState(1024); // High res for internal gen
  const [margin, setMargin] = useState(4);
  const [ecLevel, setEcLevel] = useState<ECLevel>('H');
  const [color, setColor] = useState({ dark: "#000000", light: "#ffffff" });
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const { showToast } = useToast();

  const PRESETS = [
    { name: "CLASSIC", dark: "#000000", light: "#ffffff" },
    { name: "CYBER", dark: "#F9FF00", light: "#1a1a1a" },
    { name: "RETRO", dark: "#FF0004", light: "#ffffff" },
    { name: "MINT", dark: "#00FF87", light: "#051505" },
    { name: "COBALT", dark: "#00E5FF", light: "#050510" },
  ];

  useEffect(() => {
    generateQR();
  }, [text, size, margin, ecLevel, color]);

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
        errorCorrectionLevel: ecLevel
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
    a.download = `clef_qr_${Date.now()}.png`;
    a.click();
    showToast("Exported high-res PNG.", "success");
  };

  const handleCopy = () => {
    if (!qrUrl) return;
    navigator.clipboard.writeText(qrUrl);
    showToast("Data URL copied.", "success");
  };

  return (
    <ToolLayout toolId="qr-code-generator">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Main Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Controls Column */}
           <div className="lg:col-span-7 space-y-8">
              
              {/* Input Area */}
              <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_black]">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-black text-[#F9FF00] border-[3px] border-black flex items-center justify-center shrink-0">
                       <QrIcon size={20} />
                    </div>
                    <div>
                       <h2 className="font-oswald text-2xl font-black uppercase">ENCODE_ENGINE</h2>
                       <p className="font-inter text-[10px] font-bold opacity-30 tracking-widest uppercase">TEXT // URL // V_CARD SUPPORT</p>
                    </div>
                 </div>
                 <textarea 
                   className="w-full h-32 border-[3px] border-black p-6 font-mono text-sm font-bold bg-[#fafafa] focus:bg-white outline-none resize-none transition-all custom-scrollbar" 
                   value={text} 
                   onChange={(e) => setText(e.target.value)} 
                   placeholder="Enter payload data..." 
                 />
              </div>

              {/* Customization Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 
                 {/* Color Systems */}
                 <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_black]">
                    <h3 className="font-oswald text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3"><Palette size={16} /> COLOR_SYSTEM</h3>
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">FOREGROUND</label>
                          <div className="flex items-center gap-3">
                             <input type="text" className="font-mono text-[10px] font-bold uppercase w-20 text-right outline-none" value={color.dark} onChange={(e) => setColor({...color, dark: e.target.value})} />
                             <input type="color" className="w-8 h-8 border-[2px] border-black cursor-pointer" value={color.dark} onChange={(e) => setColor({...color, dark: e.target.value})} />
                          </div>
                       </div>
                       <div className="flex items-center justify-between">
                          <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">BACKGROUND</label>
                          <div className="flex items-center gap-3">
                             <input type="text" className="font-mono text-[10px] font-bold uppercase w-20 text-right outline-none" value={color.light} onChange={(e) => setColor({...color, light: e.target.value})} />
                             <input type="color" className="w-8 h-8 border-[2px] border-black cursor-pointer" value={color.light} onChange={(e) => setColor({...color, light: e.target.value})} />
                          </div>
                       </div>
                       <div className="pt-4 border-t border-black/5 grid grid-cols-5 gap-2">
                          {PRESETS.map(p => (
                            <button 
                              key={p.name} 
                              onClick={() => { setColor({dark: p.dark, light: p.light}); setActivePreset(p.name); }}
                              className={`aspect-square border-[2px] border-black group relative overflow-hidden transition-all ${activePreset === p.name ? "scale-110 shadow-[2px_2px_0px_black]" : "hover:scale-105"}`}
                              title={p.name}
                            >
                               <div className="absolute inset-0 flex">
                                  <div className="flex-1" style={{ background: p.dark }} />
                                  <div className="flex-1" style={{ background: p.light }} />
                               </div>
                            </button>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Precision Tuning */}
                 <div className="bg-white border-[4px] border-black p-8 shadow-[12px_12px_0px_black]">
                    <h3 className="font-oswald text-sm font-black uppercase tracking-widest mb-8 flex items-center gap-3"><Settings2 size={16} /> PRECISION_TUNING</h3>
                    <div className="space-y-8">
                       <div className="space-y-3">
                          <div className="flex justify-between items-center">
                             <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">MARGIN_DENSITY</label>
                             <span className="font-mono text-[10px] font-bold">{margin} UNITS</span>
                          </div>
                          <input type="range" min="0" max="12" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full h-8 bg-black/5 rounded-none appearance-none cursor-pointer border-[2px] border-black" />
                       </div>
                       <div className="space-y-3">
                          <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40 block">ERROR_CORRECTION</label>
                          <div className="grid grid-cols-4 gap-2">
                             {(['L', 'M', 'Q', 'H'] as const).map(level => (
                               <button 
                                 key={level}
                                 onClick={() => setEcLevel(level)}
                                 className={`py-2 border-[2px] border-black font-oswald text-xs font-black transition-all ${ecLevel === level ? "bg-black text-white" : "hover:bg-black/5"}`}
                               >
                                 {level}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>

           {/* Preview Column */}
           <div className="lg:col-span-5 flex flex-col">
              <div className="bg-[#1a1a1a] border-[4px] border-black shadow-[16px_16px_0px_black] overflow-hidden flex-1 flex flex-col">
                 <div className="px-6 py-4 border-b-[2px] border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Eye size={16} className="text-[#00FF87]" />
                       <span className="font-oswald text-[10px] font-black uppercase tracking-[0.2em] text-white">LIVE_CONSOLE_PREVIEW</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-[#00FF87] rounded-full animate-pulse" />
                       <span className="font-mono text-[8px] text-[#00FF87] font-bold">READY</span>
                    </div>
                 </div>

                 <div className="flex-1 flex items-center justify-center p-12 bg-white relative">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
                    {qrUrl ? (
                      <div className="relative group p-4 border-[2px] border-black bg-white shadow-[12px_12px_0px_rgba(0,0,0,0.05)]">
                         <img 
                           src={qrUrl} 
                           alt="QR Code" 
                           className="w-full max-w-[320px] h-auto block transition-transform duration-500 group-hover:scale-[1.02]" 
                           style={{ imageRendering: 'pixelated' }}
                         />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 opacity-10">
                         <RefreshCw size={48} className="animate-spin-slow" />
                         <span className="font-oswald text-xl font-black uppercase tracking-widest">ENCODING...</span>
                      </div>
                    )}
                 </div>

                 <div className="p-6 bg-black grid grid-cols-2 gap-4">
                    <button onClick={handleDownload} className="py-4 bg-[#F9FF00] text-black font-oswald font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white transition-all">
                       <Download size={14} /> EXPORT_PNG
                    </button>
                    <button onClick={handleCopy} className="py-4 border-[3px] border-white/20 text-white font-oswald font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:border-white transition-all">
                       <Copy size={14} /> COPY_DATA_URL
                    </button>
                 </div>
              </div>

              <div className="mt-8 p-6 border-[3px] border-black bg-white flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Info size={20} className="opacity-20" />
                    <div>
                       <h4 className="font-oswald text-[10px] font-black uppercase">SCALABLE_VECTOR</h4>
                       <p className="font-inter text-[9px] font-bold opacity-40 uppercase">Optimized for 1024px print fidelity</p>
                    </div>
                 </div>
                 <CheckCircle2 size={20} className="text-[#00FF87]" />
              </div>
           </div>

        </div>

      </div>
    </ToolLayout>
  );
}
