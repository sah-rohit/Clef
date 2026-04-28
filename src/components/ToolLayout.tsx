import { type ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Sparkles, Shield, Info } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { TOOLS } from "@/data/tools";

type ToolLayoutProps = {
  toolId: string;
  children: ReactNode;
};

export function ToolLayout({ toolId, children }: ToolLayoutProps) {
  const tool = TOOLS.find(t => t.id === toolId);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!tool) return null;
  const Icon = tool.icon;

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-[#F9FF00] selection:text-black">
      <Navigation />
      
      <div className="pt-16 md:pt-20 flex-1 flex flex-col relative overflow-hidden">
        {/* Dynamic Background Element */}
        <div 
          className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-[0.08]"
          style={{ 
            background: `radial-gradient(circle at 50% 0%, ${tool.color} 0%, transparent 70%)` 
          }} 
        />
        
        {/* Tool Header - Premium Magazine Style */}
        <div className="relative z-10 border-b-[4px] border-black bg-white/80 backdrop-blur-md">
          <div className="px-6 md:px-12 lg:px-20 py-12 md:py-20">
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-10 animate-fade-in">
                <BackButton />
              </div>
              
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                <div className="flex-1 animate-slide-up">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-8 mb-8">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-300" />
                      <div 
                        className="relative w-20 h-20 border-[4px] border-black flex items-center justify-center bg-white transition-colors duration-300"
                        style={{ borderColor: 'black' }}
                      >
                        <Icon size={40} style={{ color: tool.color }} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-1.5 h-1.5 rotate-45" style={{ background: tool.color }} />
                        <span className="font-oswald text-[11px] font-bold uppercase tracking-[0.4em] text-black/40">
                          SYSTEM_CORE // {tool.category.toUpperCase()}
                        </span>
                      </div>
                      <h1 className="font-oswald text-6xl md:text-8xl font-black uppercase leading-[0.85] tracking-tight">
                        {tool.name.split(' ').map((word, i) => (
                          <span key={i} className={i === 0 ? "block" : "text-outline-black opacity-30 block"}>{word}</span>
                        ))}
                      </h1>
                    </div>
                  </div>
                  <p className="font-inter text-base md:text-xl font-medium text-[#1a1a1a]/70 max-w-2xl leading-relaxed">
                    {tool.shortDesc}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-4 shrink-0 animate-slide-left">
                  <div className="flex items-center gap-3 bg-black text-white px-5 py-3 border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                    <Shield size={18} className="text-[#00FF87]" />
                    <span className="font-oswald text-[11px] font-bold uppercase tracking-widest">ENCRYPTED_LOCAL_MODULE</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#F9FF00] border-[4px] border-black px-5 py-3 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all duration-200">
                    <Sparkles size={18} />
                    <span className="font-oswald text-[11px] font-bold uppercase tracking-widest">STATUS: OPTIMAL_0x4F</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Area - Immersive */}
        <div className="flex-1 bg-[#fafafa] relative overflow-hidden">
          {/* Enhanced Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', backgroundSize: '60px 60px' }} />
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
          
          <div className="px-6 md:px-12 lg:px-20 py-16 md:py-28 relative z-10">
            <div className="max-w-[1400px] mx-auto">
               <div className="bg-white border-[4px] border-black shadow-apple animate-scale-in overflow-hidden">
                  {/* Workspace Header Strip */}
                  <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF0004]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#F9FF00]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00FF87]" />
                      </div>
                      <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">WORKSPACE_v3.1.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#00FF87] rounded-full animate-pulse" />
                      <span className="font-oswald text-[10px] font-bold uppercase tracking-widest">LIVE_SESSION</span>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-12 min-h-[500px]">
                    {children}
                  </div>
               </div>
               
               {/* Quick Tips / Info Bar - Modern Brutalist Cards */}
               <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { icon: Info, label: "LOCAL EXECUTION", color: "#00E5FF", desc: "All processing happens locally on your device for maximum security. Zero data transfer." },
                   { icon: Sparkles, label: "PRO FEATURES", color: "#F9FF00", desc: "This module is unlocked for all users. Free forever with no limits or feature gates." },
                   { icon: Shield, label: "SECURE EXPORT", color: "#00FF87", desc: "Download your results directly as local files. No cloud sync or third-party storage." }
                 ].map((tip, i) => (
                   <div key={i} className="group flex flex-col gap-6 p-8 border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all duration-300 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 animate-slide-up" style={{ animationDelay: `${0.1 * i}s` }}>
                     <div className="w-14 h-14 border-[3px] border-black flex items-center justify-center transition-colors group-hover:bg-white" style={{ background: tip.color }}>
                       <tip.icon size={24} className="text-black" />
                     </div>
                     <div>
                       <h4 className="font-oswald text-xs font-bold uppercase tracking-[0.2em] mb-3">{tip.label}</h4>
                       <p className="font-inter text-xs font-medium opacity-60 leading-relaxed">{tip.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
