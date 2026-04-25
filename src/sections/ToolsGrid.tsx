import { useState } from "react";
import { Link } from "react-router";
import { TOOLS, CATEGORIES, type ToolCategory } from "@/data/tools";
import { ArrowUpRight, Search } from "lucide-react";

export function ToolsGrid() {
  const [filter, setFilter] = useState<ToolCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredTools = TOOLS.filter((tool) => {
    const matchesFilter = filter === "all" || tool.category === filter;
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="tools" className="py-16 md:py-24 scroll-mt-20">
      <div className="px-6 md:px-12 lg:px-16 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-2">
              Clef Workbench
            </span>
            <h2 className="font-oswald text-4xl md:text-6xl font-bold uppercase tracking-[-0.03em]">
              MY DAILY TOOLS.
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30"
                size={16}
              />
              <input
                type="text"
                placeholder="Search tools..."
                className="input-brutal pl-12 bg-white w-full md:w-64 py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-0 border-[3px] border-black mt-12 bg-white w-fit">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-6 py-3 font-oswald text-xs font-bold uppercase tracking-wider border-r-[3px] border-black last:border-r-0 transition-colors ${
                filter === cat.value ? "bg-[#F9FF00]" : "hover:bg-[#F9FF00]/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-[3px] border-black">
          {filteredTools.map((tool, i) => {
            const Icon = tool.icon;
            const isWide = i % 5 === 0;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className={`relative border-[3px] border-black cursor-pointer overflow-hidden group ${
                  isWide ? "lg:col-span-2" : ""
                }`}
                onMouseEnter={() => setHoveredId(tool.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className={`relative overflow-hidden bg-white ${
                    isWide ? "aspect-[2/1] sm:aspect-auto sm:h-[400px]" : "aspect-[3/4]"
                  }`}
                >
                  {/* Tool Visual Representation */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-110">
                    <div className="relative w-full h-full border-[3px] border-black/10 flex items-center justify-center overflow-hidden">
                       <Icon size={isWide ? 140 : 100} strokeWidth={1} className="text-black/20 group-hover:text-black transition-colors duration-300 z-10" />
                       
                       {/* Background decoration to match portfolio aesthetic */}
                       <div className="absolute top-0 left-0 p-4 font-oswald text-[100px] font-black text-black/[0.03] leading-none select-none">
                         {tool.name.substring(0, 2).toUpperCase()}
                       </div>
                    </div>
                  </div>

                  {/* Overlay */}
                  <div
                    className={`absolute inset-0 transition-all duration-300 ${
                      hoveredId === tool.id ? "bg-[#FF0004]/90" : "bg-transparent"
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
                          : "opacity-0 translate-y-4"
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
                  <span className="font-oswald text-xs font-bold uppercase tracking-wider">
                    {tool.category.toUpperCase()}
                  </span>
                  <span className="font-inter text-[10px] uppercase text-[#1a1a1a]/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </Link>
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
    </section>
  );
}
