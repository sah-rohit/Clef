import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Link } from "react-router";
import { TOOLS, CATEGORIES } from "@/data/tools";
import { ArrowUpRight, Code, Layers, Wrench, ChevronRight, FileText, type LucideIcon } from "lucide-react";

/* ─── Category metadata ─── */
const CATEGORY_META: Record<string, { color: string; icon: LucideIcon; desc: string }> = {
  developer: {
    color: "#00E5FF",
    icon: Code,
    desc: "Tools built for writing, debugging, and transforming code. From JSON formatting to regex testing — everything a developer reaches for daily.",
  },
  productivity: {
    color: "#F9FF00",
    icon: Layers,
    desc: "Writing, editing, and document tools. Distraction-free environments for getting words and ideas out fast.",
  },
  utility: {
    color: "#00FF87",
    icon: Wrench,
    desc: "Converters, generators, and everyday helpers. The tools you need once in a while but really need when you need them.",
  },
  pdf: {
    color: "#FF0004",
    icon: FileText,
    desc: "System-level PDF manipulation. Merge, split, compress, and convert documents with professional-grade precision and total privacy.",
  },
};

/* ─── Tool how-to details ─── */
const TOOL_DETAILS: Record<string, { howTo: string[]; useCases: string[] }> = {
  "text-file-maker": {
    howTo: ["Type or paste your text into the editor", "Optionally set a filename", "Click Download to save as .txt"],
    useCases: ["Quick notes you want to save locally", "Generating plain-text config snippets", "Exporting AI output as a file"],
  },
  "code-editor": {
    howTo: ["Select your language from the dropdown", "Write or paste your code", "Click Run to execute (JS/HTML/CSS)", "Use Format to auto-indent"],
    useCases: ["Testing JavaScript logic", "Previewing HTML/CSS snippets", "Formatting messy code quickly"],
  },
  "markdown-editor": {
    howTo: ["Write Markdown in the left panel", "See the live preview on the right", "Click Export to download as HTML or copy the output"],
    useCases: ["Drafting README files", "Writing documentation", "Previewing Markdown before pasting into GitHub"],
  },
  "color-converter": {
    howTo: ["Enter a color in HEX, RGB, or HSL format", "See instant conversion to all other formats", "Click the swatch to use the color picker"],
    useCases: ["Converting design tokens between formats", "Checking color values from a screenshot", "Finding the HSL equivalent of a brand hex"],
  },
  "json-formatter": {
    howTo: ["Paste your JSON into the input", "Click Format to pretty-print or Minify to compress", "Errors are highlighted inline"],
    useCases: ["Debugging API responses", "Minifying JSON for production", "Validating JSON structure before use"],
  },
  "password-generator": {
    howTo: ["Set length and character options", "Click Generate", "Copy the result with one click"],
    useCases: ["Creating strong passwords", "Generating API keys or tokens", "Bulk generating passwords"],
  },
  "qr-code-generator": {
    howTo: ["Enter any text or URL", "The QR code generates instantly", "Download as PNG"],
    useCases: ["Sharing links at events", "Adding QR codes to print materials", "Encoding contact info"],
  },
  "base64-tools": {
    howTo: ["Paste text or a file", "Choose Encode or Decode", "Copy the result"],
    useCases: ["Encoding images for CSS data URIs", "Decoding Base64 API responses", "Embedding small assets inline"],
  },
  "lorem-ipsum": {
    howTo: ["Set the number of paragraphs, sentences, or words", "Click Generate", "Copy the output"],
    useCases: ["Filling UI mockups with placeholder text", "Testing text rendering at different lengths"],
  },
  "word-counter": {
    howTo: ["Paste or type your text", "See word count, character count, and reading time update live"],
    useCases: ["Checking article length", "Staying within a character limit", "Estimating reading time"],
  },
  "unit-converter": {
    howTo: ["Select a category (length, weight, temperature, etc.)", "Enter a value and source unit", "See all conversions instantly"],
    useCases: ["Converting measurements for recipes", "Unit conversions for engineering", "Quick temperature checks"],
  },
  "pomodoro-timer": {
    howTo: ["Set your work and break intervals", "Click Start", "The timer notifies you when to switch"],
    useCases: ["Focused work sessions", "Managing deep work blocks", "Tracking time spent on tasks"],
  },
  "calculator": {
    howTo: ["Click buttons or use your keyboard", "History is shown below the display", "Clear with C or backspace with ←"],
    useCases: ["Quick calculations without leaving the browser", "Checking math in a document"],
  },
  "url-encoder": {
    howTo: ["Paste a URL or string", "Choose Encode or Decode", "Copy the result"],
    useCases: ["Encoding query parameters for API calls", "Decoding encoded URLs from logs"],
  },
  "uuid-generator": {
    howTo: ["Set quantity for bulk generation", "Copy individual UUIDs or all at once"],
    useCases: ["Generating IDs for database records", "Creating unique keys for test data"],
  },
  "regex-tester": {
    howTo: ["Enter your regex pattern", "Paste test text below", "Matches are highlighted in real time"],
    useCases: ["Testing regex before using in code", "Debugging complex patterns"],
  },
  "image-to-base64": {
    howTo: ["Upload an image file", "The Base64 string is generated instantly", "Copy the data URI"],
    useCases: ["Embedding small icons inline in CSS", "Avoiding extra HTTP requests for tiny images"],
  },
  "hash-generator": {
    howTo: ["Enter text or upload a file", "Select hash algorithm (SHA-256, SHA-512, etc.)", "Copy the hash output"],
    useCases: ["Verifying file integrity", "Generating checksums"],
  },
  "pdf-merge": {
    howTo: ["Upload two or more PDF files", "Reorder them in the document queue", "Click Initialize Merge to combine them"],
    useCases: ["Combining reports", "Merging scanned documents", "Creating portfolios"],
  },
  "pdf-split": {
    howTo: ["Upload a PDF file", "Specify page ranges (e.g., 1-5, 10)", "Click Execute Split to extract pages"],
    useCases: ["Extracting specific chapters", "Removing unwanted pages", "Splitting large documents"],
  },
  "image-to-pdf": {
    howTo: ["Upload images (JPG/PNG)", "Choose page layout (A4 or Fit)", "Click Generate PDF to convert"],
    useCases: ["Converting photos to documents", "Creating PDF galleries", "Scanned document generation"],
  },
};

/* ─── Component ─── */
export default function ToolsGuide() {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const grouped = CATEGORIES.filter(c => c.value !== "all").map(cat => ({
    ...cat,
    meta: CATEGORY_META[cat.value],
    tools: TOOLS.filter(t => t.category === cat.value),
  }));

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* ── Hero ── */}
      <div
        className="bg-[#1a1a1a] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}
      >
        <div className="px-6 md:px-12 lg:px-16 pt-28 pb-24 md:pt-36 md:pb-32 relative z-10">
          <div className="mb-10"><BackButton /></div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-4">
                TOOL REFERENCE
              </span>
              <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white">
                TOOLS<br /><span className="text-gradient-fire">GUIDE.</span>
              </h1>
            </div>
            <p className="font-inter text-sm text-white/50 max-w-sm leading-relaxed md:text-right pb-2">
              Every tool explained — what it does, how to use it, and when you'd reach for it.
            </p>
          </div>
        </div>
        {/* Watermark */}
        <div className="absolute -bottom-4 -right-4 font-oswald text-[180px] font-bold text-white/[0.03] leading-none select-none pointer-events-none uppercase">
          GUIDE
        </div>
      </div>

      {/* ── Category overview cards ── */}
      <div className="border-b-[3px] border-black">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {grouped.map((cat, i) => {
            if (!cat.meta) return null;
            const Icon = cat.meta.icon;
            return (
              <div
                key={cat.value}
                className={`p-10 md:p-12 border-b-[3px] md:border-b-0 ${i < grouped.length - 1 ? "md:border-r-[3px]" : ""} border-black group hover:brightness-95 transition-all`}
                style={{ background: cat.meta.color }}
              >
                <div className="w-12 h-12 border-[3px] border-black bg-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={20} style={{ color: cat.meta.color }} />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-oswald text-2xl font-bold uppercase text-black">{cat.label}</h3>
                  <span className="font-oswald text-[10px] font-bold px-2 py-0.5 border-[2px] border-black bg-black text-white">
                    {cat.tools.length} TOOLS
                  </span>
                </div>
                <p className="font-inter text-sm text-black/65 leading-relaxed">{cat.meta.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Tool listings per category ── */}
      <div className="pb-20">
        {grouped.map((cat) => {
          if (!cat.meta) return null;
          const CatIcon = cat.meta.icon;
          return (
            <div key={cat.value} className="border-b-[3px] border-black last:border-b-0">
              {/* Category header */}
              <div
                className="flex items-center gap-4 px-6 md:px-12 lg:px-16 py-6 border-b-[3px] border-black"
                style={{ background: cat.meta.color }}
              >
                <div className="w-10 h-10 bg-black border-[2px] border-black flex items-center justify-center shrink-0">
                  <CatIcon size={18} style={{ color: cat.meta.color }} />
                </div>
                <h2 className="font-oswald text-2xl md:text-3xl font-bold uppercase tracking-tight text-black">
                  {cat.label} TOOLS
                </h2>
                <span className="ml-auto font-oswald text-xs font-bold uppercase tracking-widest text-black/50 shrink-0">
                  {cat.tools.length} TOOLS
                </span>
              </div>

              {/* Tool rows */}
              <div className="bg-white">
                {cat.tools.map((tool, ti) => {
                  const ToolIcon = tool.icon || Wrench;
                  const details = TOOL_DETAILS[tool.id] || {
                    howTo: ["Open the tool and follow the on-screen instructions."],
                    useCases: ["General purpose utility."],
                  };
                  const isExpanded = expandedTool === tool.id;

                  return (
                    <div
                      key={tool.id}
                      className={`${ti < cat.tools.length - 1 ? "border-b-[3px] border-black" : ""}`}
                    >
                      {/* Summary row — always visible */}
                      <button
                        onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
                        className="w-full flex items-center gap-4 px-6 md:px-12 lg:px-16 py-5 text-left hover:bg-black/[0.03] transition-colors group"
                      >
                        <div
                          className="w-10 h-10 border-[3px] border-black flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                          style={{ background: cat.meta!.color + "33" }}
                        >
                          <ToolIcon size={18} className="text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-oswald text-base font-bold uppercase leading-tight truncate">
                            {tool.name}
                          </h3>
                          <p className="font-inter text-xs text-black/50 leading-relaxed truncate mt-0.5">
                            {tool.shortDesc}
                          </p>
                        </div>
                        <ChevronRight
                          size={18}
                          className={`shrink-0 text-black/30 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        />
                      </button>

                      {/* Expanded detail — slide down */}
                      {isExpanded && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 border-t-[2px] border-black/10 animate-slide-up">
                          {/* How to use */}
                          <div className="lg:col-span-5 px-6 md:px-12 lg:px-16 py-6 border-b-[2px] lg:border-b-0 lg:border-r-[2px] border-black/10">
                            <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest mb-4 text-black/40">
                              HOW TO USE
                            </h4>
                            <ol className="space-y-2">
                              {details.howTo.map((step, si) => (
                                <li key={si} className="flex gap-3">
                                  <span
                                    className="font-oswald text-[10px] font-bold w-4 flex-shrink-0 mt-0.5"
                                    style={{ color: cat.meta!.color === "#F9FF00" ? "#1a1a1a" : cat.meta!.color }}
                                  >
                                    {si + 1}.
                                  </span>
                                  <span className="font-inter text-xs text-black/70 leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Use cases */}
                          <div className="lg:col-span-4 px-6 md:px-12 lg:px-16 py-6 border-b-[2px] lg:border-b-0 lg:border-r-[2px] border-black/10">
                            <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest mb-4 text-black/40">
                              WHEN TO USE IT
                            </h4>
                            <ul className="space-y-2">
                              {details.useCases.map((uc, ui) => (
                                <li key={ui} className="flex gap-3">
                                  <div
                                    className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 rotate-45"
                                    style={{ background: cat.meta!.color === "#F9FF00" ? "#1a1a1a" : cat.meta!.color }}
                                  />
                                  <span className="font-inter text-xs text-black/70 leading-relaxed">{uc}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Open tool */}
                          <div className="lg:col-span-3 px-6 md:px-12 lg:px-16 py-6 flex items-center justify-center">
                            <Link
                              to={tool.path}
                              className="inline-flex items-center gap-2 font-oswald text-[10px] font-bold uppercase tracking-widest border-[3px] border-black px-5 py-3 hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                            >
                              OPEN TOOL <ArrowUpRight size={14} />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom navigation ── */}
      <div className="border-t-[3px] border-black">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Link
            to="/tools"
            className="p-10 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black flex items-center justify-between group hover:bg-[#F9FF00] transition-colors"
          >
            <div>
              <h3 className="font-oswald text-xl font-bold uppercase mb-1">BROWSE ALL TOOLS</h3>
              <p className="font-inter text-xs text-black/60">Jump straight to the tool grid</p>
            </div>
            <ArrowUpRight size={24} className="group-hover:scale-110 transition-transform" />
          </Link>
          <Link
            to="/how-to-use"
            className="p-10 flex items-center justify-between group hover:bg-[#00E5FF] transition-colors"
          >
            <div>
              <h3 className="font-oswald text-xl font-bold uppercase mb-1">HOW TO USE CLEF</h3>
              <p className="font-inter text-xs text-black/60">Getting started guide with FAQ</p>
            </div>
            <ArrowUpRight size={24} className="group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
