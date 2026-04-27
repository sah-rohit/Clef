import { useState } from "react";
import { TOOLS, CATEGORIES, type ToolCategory } from "@/data/tools";
import type { ToolDef } from "@/data/tools";
import { ArrowUpRight, Search } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ToolPreviewPopup } from "@/components/ToolPreviewPopup";

export function ToolsGrid() {
  const [filter, setFilter] = useState<ToolCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [previewTool, setPreviewTool] = useState<ToolDef | null>(null);
  const headerRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });
  const gridRef   = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.7, delay: 0.1 });

  const filteredTools = TOOLS.filter((tool) => {
    const matchesFilter = filter === "all" || tool.category === filter;
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="tools" className="scroll-mt-20">
      {/* Hero header — dark bg */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div ref={headerRef} className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-4">CLEF WORKBENCH</span>
              <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white">
                MY DAILY<br /><span className="text-gradient-fire">TOOLS.</span>
              </h1>
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="text"
                  placeholder="Search tools..."
                  className="border-[3px] border-white/20 bg-white/5 text-white pl-12 pr-4 py-3 font-inter text-sm outline-none focus:border-[#F9FF00] placeholder:text-white/30 w-full md:w-72 transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Filter Tabs */}
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <div className="flex gap-0 border-[3px] border-white/20 w-max md:w-fit">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilter(cat.value)}
                  className={`px-6 py-3 font-oswald text-xs font-bold uppercase tracking-wider border-r-[3px] border-white/20 last:border-r-0 transition-all whitespace-nowrap ${
                    filter === cat.value
                      ? "bg-[#F9FF00] text-black border-[#F9FF00]"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div ref={gridRef} className="px-6 md:px-12 lg:px-16 py-12 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-[3px] border-black">
          {filteredTools.map((tool, i) => {
            const Icon = tool.icon;
            const isWide = i % 5 === 0;
            return (
              <button
                key={tool.id}
                onClick={() => setPreviewTool(tool)}
                className={`relative border-[3px] border-black cursor-pointer overflow-hidden group text-left ${
                  isWide ? "lg:col-span-2" : ""
                }`}
                onMouseEnter={() => setHoveredId(tool.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className={`relative overflow-hidden ${
                    isWide ? "aspect-[2/1] sm:aspect-auto sm:h-[400px]" : "aspect-[4/3] sm:aspect-[3/4]"
                  }`}
                  style={{ backgroundColor: `${tool.color}18` }}
                >
                  {/* Tool Visual Representation */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-110">
                    <div className="relative w-full h-full border-[3px] flex items-center justify-center overflow-hidden" style={{ borderColor: `${tool.color}40` }}>
                       <Icon size={isWide ? 140 : 100} strokeWidth={1} className="transition-colors duration-300 z-10" style={{ color: `${tool.color}60` }} />
                       
                       {/* Background decoration */}
                       <div className="absolute top-0 left-0 p-4 font-oswald text-[100px] font-black leading-none select-none" style={{ color: `${tool.color}08` }}>
                         {tool.name.substring(0, 2).toUpperCase()}
                       </div>
                    </div>
                  </div>

                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      hoveredId === tool.id 
                        ? "bg-[#FF0004]/90" 
                        : "bg-gradient-to-t from-black/60 via-black/10 to-transparent md:from-transparent md:via-transparent md:to-transparent"
                    }`}
                  />
                  
                  {/* Border indicator on hover */}
                  {hoveredId === tool.id && (
                    <div className="absolute inset-0 border-[6px] border-black pointer-events-none z-20" />
                  )}

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                    <div
                      className={`transition-all duration-300 ${
                        hoveredId === tool.id
                          ? "opacity-100 translate-y-0"
                          : "opacity-100 md:opacity-0 translate-y-0 md:translate-y-4"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-oswald text-xl md:text-2xl font-bold uppercase text-white leading-tight">
                            {tool.name}
                          </h3>
                          <p className="font-inter text-xs text-white/80 mt-1 uppercase tracking-wider line-clamp-2">
                            {tool.shortDesc}
                          </p>
                        </div>
                        <ArrowUpRight
                          className="text-white flex-shrink-0"
                          size={24}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Label bar */}
                <div className="border-t-[3px] border-black bg-white px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: tool.color }} />
                    <span className="font-oswald text-xs font-bold uppercase tracking-wider">
                      {tool.category.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-inter text-[10px] uppercase text-[#1a1a1a]/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {filteredTools.length === 0 && (
          <div className="py-20 text-center border-[3px] border-dashed border-black/20">
            <p className="font-oswald text-2xl font-bold uppercase text-black/30">
              No tools found matching your search
            </p>
          </div>
        )}
      </div>

      {/* Tool Preview Popup */}
      {previewTool && (
        <ToolPreviewPopup
          tool={previewTool}
          onClose={() => setPreviewTool(null)}
          onOpen={() => setPreviewTool(null)}
        />
      )}
    </section>
  );
}
