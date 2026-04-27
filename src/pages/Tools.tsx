import { useEffect, useRef, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { TOOLS, CATEGORIES } from "@/data/tools";
import type { ToolDef } from "@/data/tools";
import { ArrowUpRight } from "lucide-react";
import { ToolPreviewPopup } from "@/components/ToolPreviewPopup";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function ToolsPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewTool, setPreviewTool] = useState<ToolDef | null>(null);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useScrollReveal<HTMLDivElement>({ x: -30, y: 0, duration: 0.7 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute("data-step") || "0");
            setActiveStep(idx);
          }
        });
      },
      { threshold: 0.1 }
    );

    const blocks = sectionRef.current?.querySelectorAll("[data-step]");
    blocks?.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  // Filter out "all" category
  const activeCategories = CATEGORIES.filter(c => c.value !== "all");

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <section
          ref={sectionRef}
          className="border-b-[3px] border-black bg-white relative"
        >
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Sticky Left Column */}
            <div 
              ref={leftColRef} 
              className="md:col-span-4 lg:col-span-3 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black md:sticky md:top-0 md:h-screen flex flex-col justify-center px-6 md:px-10 py-12 md:py-0 transition-colors duration-500 z-10"
              style={{ backgroundColor: 
                activeStep === 0 ? "#00E5FF" : 
                activeStep === 1 ? "#F9FF00" : 
                "#00FF87" 
              }}
            >
              <div className="absolute top-12 left-6 md:left-10">
                <BackButton />
              </div>

              <div className="relative z-10">
                <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">THE ARSENAL</span>
                <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6">
                  OUR<br /><span className="text-outline-black">WORKBENCH.</span>
                </h2>
                <p className="font-inter text-sm leading-relaxed text-black/65 mb-8">
                  {activeStep === 0 ? "28+ developer utilities for code formatting, regex testing, and data transformation." :
                   activeStep === 1 ? "Essential tools for text manipulation, markdown editing, and focus-driven productivity." :
                   "Everyday utilities like calculators, converters, and password generators for rapid daily tasks."}
                </p>
                <div className="flex flex-col gap-3">
                  {activeCategories.map((cat, i) => (
                    <div
                      key={i}
                      className={`px-4 py-3 border-[3px] border-black font-oswald text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                        i === activeStep
                          ? "bg-black text-white translate-x-2"
                          : "bg-white/50 text-black hover:bg-white"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")} — {cat.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Faded Background Text */}
              <div className="absolute bottom-10 right-4 font-oswald text-[120px] font-bold text-black/[0.05] leading-none select-none pointer-events-none uppercase">
                {activeCategories[activeStep]?.label.split(" ")[0]}
              </div>
            </div>

            {/* Right Column - Tool Categories */}
            <div className="md:col-span-8 lg:col-span-9 bg-[#fafafa]">
              {activeCategories.map((cat, i) => {
                const categoryTools = TOOLS.filter(t => t.category === cat.value);
                const sectionBg = 
                  i === 0 ? "white" 
                : i === 1 ? "#fafafa" 
                : "white";

                return (
                  <div
                    key={i}
                    data-step={i}
                    className="border-b-[3px] border-black last:border-b-0 px-6 md:px-12 py-16 md:py-24 min-h-screen"
                    style={{ background: sectionBg }}
                  >
                    <div className="mb-12">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="font-oswald text-6xl md:text-8xl font-bold text-black/[0.06] leading-none select-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-[-0.02em] text-black">
                          {cat.label}
                        </h3>
                      </div>
                      <p className="font-inter text-sm text-black/60 max-w-2xl">
                        {cat.value === "developer" ? "Code formatters, regex testers, JWT decoders, and everything else a developer needs to build faster." :
                         cat.value === "productivity" ? "Text manipulators, markdown editors, and focus tools to keep your writing and planning sharp." :
                         "Everyday utilities like password generators, unit converters, and calculators, instantly accessible."}
                      </p>
                    </div>

                    {/* Tools Grid for this category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-[3px] border-black bg-white">
                      {categoryTools.map((tool, j) => {
                        const Icon = tool.icon;
                        return (
                          <button
                            key={tool.id}
                            onClick={() => setPreviewTool(tool)}
                            className="relative border-b-[3px] border-r-[3px] border-black last:border-b-0 sm:nth-last-child(-n+2):border-b-0 sm:even:border-r-0 cursor-pointer overflow-hidden group text-left h-[280px] sm:h-[320px] flex flex-col"
                            onMouseEnter={() => setHoveredId(tool.id)}
                            onMouseLeave={() => setHoveredId(null)}
                          >
                            <div
                              className="relative flex-1 overflow-hidden flex flex-col"
                              style={{ backgroundColor: `${tool.color}10` }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-110 pointer-events-none">
                                <div className="relative w-full h-full border-[3px] flex items-center justify-center overflow-hidden" style={{ borderColor: `${tool.color}30` }}>
                                   <Icon size={80} strokeWidth={1} className="transition-colors duration-300 z-10" style={{ color: `${tool.color}80` }} />
                                   <div className="absolute top-0 left-0 p-4 font-oswald text-[80px] font-black leading-none" style={{ color: `${tool.color}15` }}>
                                     {tool.name.substring(0, 2).toUpperCase()}
                                   </div>
                                </div>
                              </div>

                              {/* Hover Overlay */}
                              <div
                                className={`absolute inset-0 transition-all duration-300 pointer-events-none ${
                                  hoveredId === tool.id 
                                    ? "bg-[#1a1a1a]" 
                                    : "bg-transparent"
                                }`}
                              />

                              {/* Info Overlay */}
                              <div className="absolute inset-x-0 bottom-0 p-5 z-10 flex flex-col justify-end pointer-events-none">
                                <div
                                  className={`transition-all duration-300 ${
                                    hoveredId === tool.id
                                      ? "opacity-100 translate-y-0"
                                      : "opacity-100 md:opacity-0 translate-y-0 md:translate-y-4"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <h4 className="font-oswald text-xl font-bold uppercase leading-tight mb-1"
                                        style={{ color: hoveredId === tool.id ? tool.color : "#1a1a1a" }}>
                                        {tool.name}
                                      </h4>
                                      <p className="font-inter text-xs uppercase tracking-wider line-clamp-2"
                                        style={{ color: hoveredId === tool.id ? "white" : "rgba(0,0,0,0.6)" }}>
                                        {tool.shortDesc}
                                      </p>
                                    </div>
                                    <ArrowUpRight
                                      className="flex-shrink-0"
                                      size={24}
                                      style={{ color: hoveredId === tool.id ? tool.color : "#1a1a1a" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Label bar */}
                            <div className="border-t-[3px] border-black bg-white px-4 py-3 flex items-center justify-between shrink-0">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 flex-shrink-0 border border-black" style={{ backgroundColor: tool.color }} />
                                <span className="font-oswald text-[11px] font-bold uppercase tracking-wider text-black">
                                  {tool.category.toUpperCase()}
                                </span>
                              </div>
                              <span className="font-inter text-[10px] uppercase text-black/40 font-bold">
                                {String(j + 1).padStart(2, "0")}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {previewTool && (
        <ToolPreviewPopup
          tool={previewTool}
          onClose={() => setPreviewTool(null)}
          onOpen={() => setPreviewTool(null)}
        />
      )}
    </div>
  );
}
