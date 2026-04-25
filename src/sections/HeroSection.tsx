import { ArrowRight, Zap, Globe, Shield, FileText, Type, Palette, Key, QrCode, Menu } from "lucide-react";
import { Link } from "react-router";

export function HeroSection() {
  const scrollToTools = () => {
    const el = document.getElementById("tools");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Left Column - Text */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 pt-32 pb-20 md:pt-40 md:pb-24 bg-white">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="mb-10">
            <span className="inline-block bg-[#F9FF00] px-4 py-1.5 font-oswald text-[11px] font-bold uppercase tracking-widest border-2 border-black">
              FREE FOREVER — NO CATCH
            </span>
          </div>
          
          {/* Heading */}
          <h1 className="font-oswald text-5xl md:text-7xl lg:text-[5.5rem] font-bold uppercase leading-[0.9] tracking-tight mb-8 text-[#1a1a1a]">
            YOUR DAILY<br />
            WORKBENCH FOR<br />
            CODE, TEXT, AND<br />
            COLOR.
          </h1>
          
          {/* Paragraph */}
          <p className="font-inter text-[15px] md:text-[17px] leading-relaxed text-[#1a1a1a]/70 mb-12 max-w-[28rem] font-medium">
            Clef is my personal suite of essential utilities for developers and everyday users. Text editors, code tools, converters, generators — all built to work right in your browser. Private, fast, and no strings attached.
          </p>
          
          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-16">
            <button
              onClick={scrollToTools}
              className="bg-[#F9FF00] border-2 border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-3.5 hover:bg-black hover:text-[#F9FF00] transition-colors"
            >
              EXPLORE TOOLS <ArrowRight size={18} />
            </button>
            <Link
              to="/about"
              className="bg-[#1a1a1a] border-2 border-[#1a1a1a] text-white font-oswald font-bold uppercase tracking-widest text-sm flex items-center px-8 py-3.5 hover:bg-white hover:text-[#1a1a1a] transition-colors"
            >
              LEARN MORE
            </Link>
          </div>

          {/* Stats Row */}
          <div className="flex border-2 border-black max-w-md">
            <div className="flex-1 border-r-2 border-black py-4 flex flex-col items-center justify-center">
              <span className="font-oswald text-2xl font-bold text-black mb-1">18+</span>
              <span className="font-inter text-[9px] font-bold uppercase tracking-widest text-black/60">TOOLS</span>
            </div>
            <div className="flex-1 border-r-2 border-black py-4 flex flex-col items-center justify-center">
              <span className="font-oswald text-2xl font-bold text-black mb-1">$0</span>
              <span className="font-inter text-[9px] font-bold uppercase tracking-widest text-black/60">ALWAYS FREE</span>
            </div>
            <div className="flex-1 py-4 flex flex-col items-center justify-center">
              <span className="font-oswald text-2xl font-bold text-black mb-1">0</span>
              <span className="font-inter text-[9px] font-bold uppercase tracking-widest text-black/60">ADS EVER</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Visual */}
      <div className="flex-1 bg-[#1a1a1a] flex flex-col items-center justify-center p-8 md:p-20 relative">
        <div className="w-full max-w-sm flex flex-col items-center mb-10">
          {/* Grid */}
          <div className="grid grid-cols-3 w-fit mx-auto border-t border-l border-white/20 mb-16">
            {[
              <FileText size={22} strokeWidth={1} />,
              <span className="font-mono font-light text-xl">{'<>'}</span>,
              <Type size={22} strokeWidth={1} />,
              <Palette size={22} strokeWidth={1} />,
              <span className="font-mono font-light text-xl">{'{ }'}</span>,
              <Key size={22} strokeWidth={1} />,
              <QrCode size={22} strokeWidth={1} />,
              <div className="flex flex-col items-center text-[10px] font-mono font-light leading-tight"><span>01</span><span>10</span></div>,
              <Menu size={22} strokeWidth={1} />
            ].map((icon, i) => (
              <div key={i} className="w-24 h-24 border-b border-r border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                {icon}
              </div>
            ))}
          </div>

          {/* Features List */}
          <div className="flex flex-col gap-5 w-full pl-6">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-[#F9FF00] flex items-center justify-center flex-shrink-0">
                <Zap size={12} className="text-black" />
              </div>
              <p className="font-inter text-xs text-white/80 leading-snug font-medium">
                Runs entirely in your browser — no data sent to servers
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-[#FF0004] flex items-center justify-center flex-shrink-0">
                <Globe size={12} className="text-white" />
              </div>
              <p className="font-inter text-xs text-white/80 leading-snug font-medium">
                Works offline after first load — no internet needed
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-white flex items-center justify-center flex-shrink-0">
                <Shield size={12} className="text-black" />
              </div>
              <p className="font-inter text-xs text-white/80 leading-snug font-medium">
                No tracking, no cookies, no analytics — your privacy matters
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="absolute bottom-10 left-10">
          <div className="bg-[#F9FF00] px-4 py-2 font-oswald text-[11px] font-bold uppercase tracking-widest text-black">
            18 FREE TOOLS — USE THEM ALL, RIGHT NOW
          </div>
        </div>
      </div>
    </section>
  );
}
