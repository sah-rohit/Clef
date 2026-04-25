import { useState } from "react";
import { MessageSquare, X, Maximize2 } from "lucide-react";
import { ClefAI } from "./ClefAI";

export function ClefAIChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (isFullScreen && isOpen) {
    return <ClefAI isFullScreen={true} onClose={() => setIsFullScreen(false)} />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="flex flex-col items-end gap-4">
          <div className="w-[380px] h-[550px] shadow-[12px_12px_0px_rgba(0,0,0,1)] relative">
            <button 
              onClick={() => setIsFullScreen(true)}
              className="absolute top-3 right-12 z-10 p-1 bg-white/10 text-white hover:bg-[#F9FF00] hover:text-black transition-colors"
              title="Full Screen"
            >
              <Maximize2 size={16} />
            </button>
            <ClefAI />
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-14 h-14 bg-black text-[#F9FF00] border-[3px] border-black flex items-center justify-center hover:scale-110 transition-transform shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          >
            <X size={24} />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#F9FF00] text-black border-[3px] border-black flex items-center justify-center hover:scale-110 transition-transform shadow-[6px_6px_0px_rgba(0,0,0,1)] group"
        >
          <MessageSquare size={32} className="group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-2 -right-2 bg-[#FF0004] text-white text-[10px] font-bold px-2 py-0.5 border-[2px] border-black uppercase tracking-tighter animate-bounce">
            AI READY
          </div>
        </button>
      )}
    </div>
  );
}
