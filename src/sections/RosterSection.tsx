import { useState } from "react";
import { Check, X } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BackButton } from "@/components/BackButton";

export function RosterSection({ showBackButton = false }: { showBackButton?: boolean }) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });
  const tableRef  = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.7, delay: 0.1 });

  const statusBg = (color: string) => {
    if (color === "yellow") return "bg-[#F9FF00] text-black";
    if (color === "cyan")   return "bg-[#00E5FF] text-black";
    if (color === "green")  return "bg-[#00FF87] text-black";
    if (color === "purple") return "bg-[#7C3AED] text-white";
    if (color === "red")    return "bg-[#FF0004] text-white";
    return "bg-white text-black";
  };
  const comparison = [
    { 
      feature: "AI CHATBOT (LLAMA 3.1)", 
      status: "ACTIVE",
      statusColor: "yellow",
      availability: "PUBLIC",
      specialties: "ADVANCED LOGIC / MEMORY",
      clef: true, 
      others: "LIMITED/PAID" 
    },
    { 
      feature: "UNLIMITED TOOL ACCESS", 
      status: "OPEN",
      statusColor: "cyan",
      availability: "GLOBAL",
      specialties: "ZERO GATEKEEPING",
      clef: true, 
      others: "SUBSCRIPTION" 
    },
    { 
      feature: "NO DATA TRACKING", 
      status: "LOCKED",
      statusColor: "green",
      availability: "LOCAL",
      specialties: "TOTAL PRIVACY",
      clef: true, 
      others: "HEAVY TRACKING" 
    },
    { 
      feature: "PRIVATE STORAGE", 
      status: "SECURE",
      statusColor: "purple",
      availability: "OFFLINE",
      specialties: "BROWSER-BASED ENCRYPTION",
      clef: true, 
      others: "CLOUD ONLY" 
    },
    { 
      feature: "BRUTALIST FAST UI", 
      status: "STABLE",
      statusColor: "yellow",
      availability: "INSTANT",
      specialties: "PERFORMANCE DRIVEN",
      clef: true, 
      others: "BLOATED" 
    },
    { 
      feature: "MIT OPEN SOURCE", 
      status: "PUBLIC",
      statusColor: "green",
      availability: "GITHUB",
      specialties: "FULL CODE ACCESS",
      clef: true, 
      others: "PROPRIETARY" 
    },
  ];

  return (
    <section id="roster" className="border-b-[3px] border-black">
      {/* Header — cyan bg */}
      <div className="bg-[#00E5FF] border-b-[3px] border-black relative overflow-hidden">
        <div ref={headerRef} className="px-6 md:px-12 lg:px-16 pt-28 pb-24 md:pt-36 md:pb-32 relative z-10">
          {showBackButton && (
            <div className="mb-10">
              <BackButton />
            </div>
          )}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">HOW WE STACK UP</span>
              <h2 className="font-oswald text-5xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black">
                THE CLEF<br /><span className="text-outline-black">ROSTER.</span>
              </h2>
            </div>
            <div className="text-right">
              <span className="font-oswald text-[120px] md:text-[160px] font-bold leading-none text-black/10 select-none pointer-events-none uppercase">ROSTER</span>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-oswald text-[240px] font-bold text-black/[0.02] leading-none select-none pointer-events-none uppercase">CLEF</div>
        <div className="absolute -bottom-6 -right-6 font-oswald text-[200px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">ROSTER</div>
      </div>

      <div ref={tableRef} className="px-6 md:px-12 lg:px-16 py-12 overflow-x-auto md:overflow-visible bg-white">
        {/* Mobile View - Cards */}
        <div className="md:hidden space-y-6">
          {comparison.map((item, i) => (
            <div key={i} className="border-[3px] border-black p-6 bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-4 pb-4 border-b-[1px] border-black/10">
                <span className="font-oswald text-lg font-bold uppercase">{item.feature}</span>
                <span className={`px-3 py-1 font-oswald text-[10px] font-bold border-[2px] border-black ${statusBg(item.statusColor)}`}>{item.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-oswald text-[10px] font-bold text-black/30 uppercase block">Availability</span>
                  <span className="font-inter text-xs font-bold uppercase">{item.availability}</span>
                </div>
                <div>
                  <span className="font-oswald text-[10px] font-bold text-black/30 uppercase block">Vs Others</span>
                  <span className="font-inter text-xs font-bold uppercase">{item.others}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t-[1px] border-black/10">
                <span className="font-oswald text-[10px] font-bold text-black/30 uppercase block mb-1">Clef Specialty</span>
                <p className="font-oswald text-sm font-bold uppercase text-[#FF0004]">{item.specialties}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block border-[3px] border-black min-w-[1000px]">
          {/* Table Header */}
          <div className="grid grid-cols-12 border-b-[3px] border-black bg-[#1a1a1a] text-white">
            <div className="col-span-3 px-6 py-4 font-oswald text-xs font-bold uppercase tracking-widest">
              FEATURE / ATTRIBUTE
            </div>
            <div className="col-span-2 px-6 py-4 font-oswald text-xs font-bold uppercase tracking-widest border-l-[3px] border-white/10 text-center">
              STATUS
            </div>
            <div className="col-span-2 px-6 py-4 font-oswald text-xs font-bold uppercase tracking-widest border-l-[3px] border-white/10 text-center">
              AVAILABILITY
            </div>
            <div className="col-span-3 px-6 py-4 font-oswald text-xs font-bold uppercase tracking-widest border-l-[3px] border-white/10 text-center">
              SPECIALTIES (IN CLEF)
            </div>
            <div className="col-span-2 px-6 py-4 font-oswald text-xs font-bold uppercase tracking-widest border-l-[3px] border-white/10 bg-[#F9FF00] text-black text-center">
              VS OTHERS
            </div>
          </div>

          {/* Table Rows */}
          {comparison.map((item, i) => (
            <div
              key={i}
              className={`grid grid-cols-12 border-b-[3px] border-black last:border-b-0 transition-colors cursor-pointer ${
                hoveredRow === i
                  ? "bg-[#F9FF00]"
                  : i % 2 === 0
                  ? "bg-white"
                  : "bg-[#fafafa]"
              }`}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <div className="col-span-3 px-6 py-5 flex items-center">
                <span className="font-oswald text-base font-bold uppercase tracking-tight">
                  {item.feature}
                </span>
              </div>
              <div className="col-span-2 px-6 py-5 border-l-[3px] border-black flex items-center justify-center">
                <span className={`px-3 py-1 font-oswald text-[10px] font-bold border-[2px] border-black ${statusBg(item.statusColor)}`}>
                  {item.status}
                </span>
              </div>
              <div className="col-span-2 px-6 py-5 border-l-[3px] border-black flex items-center justify-center">
                <span className="font-inter text-[11px] font-bold uppercase text-black/60">
                  {item.availability}
                </span>
              </div>
              <div className="col-span-3 px-6 py-5 border-l-[3px] border-black flex items-center justify-center">
                <span className="font-oswald text-[11px] font-bold uppercase tracking-wider text-center px-4">
                  {item.specialties}
                </span>
              </div>
              <div className="col-span-2 px-6 py-5 border-l-[3px] border-black flex flex-col items-center justify-center gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-black text-[#F9FF00] flex items-center justify-center border-[2px] border-black">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="font-oswald text-[10px] font-bold">VS</span>
                  <X size={16} className="text-[#FF0004]" />
                </div>
                <span className="font-inter text-[8px] font-bold uppercase text-black/40 mt-1">
                  {item.others}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 mt-12">
        <div className="p-8 border-[3px] border-black bg-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-apple hover-lift">
          <p className="font-inter text-xs font-bold uppercase tracking-wider text-black/60 max-w-lg">
            Unlike other platforms that sell your data or gatekeep simple tools
            behind paywalls, Clef is a personal manifest for productivity.
            Built to be fast, free, and completely yours.
          </p>
          <div className="font-oswald text-4xl font-bold uppercase tracking-tighter text-gradient-fire">
            FREE FOREVER.
          </div>
        </div>
      </div>
    </section>
  );
}
