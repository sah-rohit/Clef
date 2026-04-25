import { type ReactNode, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ArrowLeft, Sparkles, Shield, Info } from "lucide-react";
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
      
      <div className="pt-16 md:pt-20 flex-1 flex flex-col">
        {/* Tool Header - Magazine Style */}
        <div className="border-b-[4px] border-black bg-white">
          <div className="px-6 md:px-12 lg:px-20 py-10 md:py-16">
            <div className="max-w-[1400px] mx-auto">
              <Link
                to="/#tools"
                className="inline-flex items-center gap-3 font-oswald text-[10px] font-bold uppercase tracking-[0.3em] hover:text-[#FF0004] transition-all mb-8 group"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                BACK TO HOME
              </Link>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="flex-1">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 border-[4px] border-black flex items-center justify-center bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                      <Icon size={32} style={{ color: tool.color }} strokeWidth={2.5} />
                    </div>
                    <div>
                      <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.4em] text-[#FF0004] block mb-1">
                        MODULE — {tool.category.toUpperCase()}
                      </span>
                      <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase leading-none tracking-tighter">
                        {tool.name}
                      </h1>
                    </div>
                  </div>
                  <p className="font-inter text-sm md:text-lg font-medium text-[#1a1a1a]/60 max-w-2xl leading-relaxed">
                    {tool.shortDesc}
                  </p>
                </div>
                
                <div className="flex flex-col md:items-end gap-4 shrink-0">
                  <div className="flex items-center gap-3 bg-[#fafafa] border-[3px] border-black px-4 py-2">
                    <Shield size={16} className="text-[#059669]" />
                    <span className="font-oswald text-[10px] font-bold uppercase tracking-widest">PRIVATE MODULE</span>
                  </div>
                  <div className="flex items-center gap-3 bg-[#F9FF00] border-[4px] border-black px-4 py-2 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <Sparkles size={16} />
                    <span className="font-oswald text-[10px] font-bold uppercase tracking-widest">SYSTEM STATUS: OPTIMAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 bg-[#fafafa] relative">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '30px 30px' }} />
          
          <div className="px-6 md:px-12 lg:px-20 py-12 md:py-20 relative z-10">
            <div className="max-w-[1400px] mx-auto">
               <div className="bg-white border-[4px] border-black p-6 md:p-12 shadow-[16px_16px_0px_rgba(0,0,0,1)] min-h-[500px]">
                  {children}
               </div>
               
               {/* Quick Tips / Info Bar */}
               <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="flex gap-4 p-6 border-[3px] border-black bg-white">
                   <Info size={20} className="shrink-0 text-black/30" />
                   <div>
                     <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest mb-1">LOCAL EXECUTION</h4>
                     <p className="font-inter text-[9px] font-bold text-black/40 uppercase leading-tight">All processing happens locally on your device for maximum security.</p>
                   </div>
                 </div>
                 <div className="flex gap-4 p-6 border-[3px] border-black bg-white">
                   <Sparkles size={20} className="shrink-0 text-black/30" />
                   <div>
                     <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest mb-1">PRO FEATURES</h4>
                     <p className="font-inter text-[9px] font-bold text-black/40 uppercase leading-tight">This module is unlocked for all users. Free forever with no limits.</p>
                   </div>
                 </div>
                 <div className="flex gap-4 p-6 border-[3px] border-black bg-white">
                   <Shield size={20} className="shrink-0 text-black/30" />
                   <div>
                     <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest mb-1">SECURE EXPORT</h4>
                     <p className="font-inter text-[9px] font-bold text-black/40 uppercase leading-tight">Download your results directly as local files. No cloud sync required.</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
