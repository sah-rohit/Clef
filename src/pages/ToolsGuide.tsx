import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Link } from "react-router";
import { TOOLS, CATEGORIES } from "@/data/tools";
import { ArrowUpRight, Code, Layers, Wrench } from "lucide-react";

const categoryMeta: Record<string, { color: string; textColor: string; icon: React.ElementType; desc: string }> = {
  developer: {
    color: "#00E5FF",
    textColor: "text-black",
    icon: Code,
    desc: "Tools built for writing, debugging, and transforming code. From JSON formatting to regex testing — everything a developer reaches for daily.",
  },
  productivity: {
    color: "#F9FF00",
    textColor: "text-black",
    icon: Layers,
    desc: "Writing, editing, and document tools. Distraction-free environments for getting words and ideas out fast.",
  },
  utility: {
    color: "#00FF87",
    textColor: "text-black",
    icon: Wrench,
    desc: "Converters, generators, and everyday helpers. The tools you need once in a while but really need when you need them.",
  },
};

const toolDetails: Record<string, { howTo: string[]; useCases: string[] }> = {
  "text-file-maker": {
    howTo: ["Type or paste your text into the editor", "Optionally set a filename", "Click Download to save as .txt"],
    useCases: ["Quick notes you want to save locally", "Generating plain-text config snippets", "Exporting AI output as a file"],
  },
  "code-editor": {
    howTo: ["Select your language from the dropdown", "Write or paste your code", "Click Run to execute (JS/HTML/CSS)", "Use Format to auto-indent"],
    useCases: ["Testing JavaScript logic before pasting into a project", "Previewing HTML/CSS snippets", "Formatting messy code quickly"],
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
    howTo: ["Set length and character options (uppercase, numbers, symbols)", "Click Generate", "Copy the result with one click"],
    useCases: ["Creating strong passwords for new accounts", "Generating API keys or tokens", "Bulk generating passwords for a team"],
  },
  "qr-code-generator": {
    howTo: ["Enter any text or URL", "The QR code generates instantly", "Download as PNG"],
    useCases: ["Sharing links at events", "Adding QR codes to print materials", "Encoding contact info or Wi-Fi credentials"],
  },
  "base64-tools": {
    howTo: ["Paste text or a file", "Choose Encode or Decode", "Copy the result"],
    useCases: ["Encoding images for CSS data URIs", "Decoding Base64 API responses", "Embedding small assets inline"],
  },
  "lorem-ipsum": {
    howTo: ["Set the number of paragraphs, sentences, or words", "Click Generate", "Copy the output"],
    useCases: ["Filling UI mockups with placeholder text", "Testing text rendering at different lengths", "Generating dummy content for demos"],
  },
  "word-counter": {
    howTo: ["Paste or type your text", "See word count, character count, and reading time update live"],
    useCases: ["Checking article length before publishing", "Staying within a character limit", "Estimating reading time for content"],
  },
  "unit-converter": {
    howTo: ["Select a category (length, weight, temperature, etc.)", "Enter a value and source unit", "See all conversions instantly"],
    useCases: ["Converting measurements for recipes", "Unit conversions for engineering calculations", "Quick temperature checks when traveling"],
  },
  "pomodoro-timer": {
    howTo: ["Set your work and break intervals", "Click Start", "The timer notifies you when to switch"],
    useCases: ["Focused work sessions", "Managing deep work blocks", "Tracking time spent on tasks"],
  },
  "calculator": {
    howTo: ["Click buttons or use your keyboard", "History is shown below the display", "Clear with C or backspace with ←"],
    useCases: ["Quick calculations without leaving the browser", "Checking math in a document", "Running a series of calculations with history"],
  },
  "url-encoder": {
    howTo: ["Paste a URL or string", "Choose Encode or Decode", "Copy the result"],
    useCases: ["Encoding query parameters for API calls", "Decoding encoded URLs from logs", "Preparing URLs for use in HTML attributes"],
  },
  "uuid-generator": {
    howTo: ["Select UUID version (v1, v4, v5)", "Set quantity for bulk generation", "Copy individual UUIDs or all at once"],
    useCases: ["Generating IDs for database records", "Creating unique keys for test data", "Bulk UUID generation for seeding"],
  },
  "regex-tester": {
    howTo: ["Enter your regex pattern", "Paste test text below", "Matches are highlighted in real time", "Set flags (g, i, m) as needed"],
    useCases: ["Testing regex before using in code", "Debugging complex patterns", "Learning regex by seeing matches live"],
  },
  "image-to-base64": {
    howTo: ["Upload an image file", "The Base64 string is generated instantly", "Copy the data URI for use in CSS or HTML"],
    useCases: ["Embedding small icons inline in CSS", "Avoiding extra HTTP requests for tiny images", "Encoding images for email templates"],
  },
  "hash-generator": {
    howTo: ["Enter text or upload a file", "Select hash algorithm (MD5, SHA-1, SHA-256, SHA-512)", "Copy the hash output"],
    useCases: ["Verifying file integrity", "Generating checksums", "Hashing passwords for comparison (not for production storage)"],
  },
};

export default function ToolsGuide() {
  const grouped = CATEGORIES.filter(c => c.value !== "all").map(cat => ({
    ...cat,
    tools: TOOLS.filter(t => t.category === cat.value),
  }));

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="page-top pb-20">
        {/* Header */}
        <div className="px-6 md:px-12 lg:px-16 mb-16">
          <BackButton />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
            <div>
              <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-4">
                Tool Reference
              </span>
              <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-[-0.03em] leading-[0.9]">
                TOOLS GUIDE.
              </h1>
            </div>
            <p className="font-inter text-sm text-black/60 max-w-sm leading-relaxed md:text-right">
              Every tool explained — what it does, how to use it, and when you'd reach for it.
            </p>
          </div>
        </div>

        {/* Category overview */}
        <div className="px-6 md:px-12 lg:px-16 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[3px] border-black">
            {grouped.map((cat, i) => {
              const meta = categoryMeta[cat.value];
              const Icon = meta.icon;
              return (
                <div
                  key={cat.value}
                  className={`p-8 ${i < grouped.length - 1 ? "border-b-[3px] md:border-b-0 md:border-r-[3px]" : ""} border-black`}
                >
                  <div
                    className="w-10 h-10 border-[3px] border-black flex items-center justify-center mb-5"
                    style={{ background: meta.color }}
                  >
                    <Icon size={18} className="text-black" />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-oswald text-2xl font-bold uppercase">{cat.label}</h3>
                    <span
                      className="font-oswald text-[10px] font-bold px-2 py-0.5 border-[2px] border-black"
                      style={{ background: meta.color }}
                    >
                      {meta.tools.length} TOOLS
                    </span>
                  </div>
                  <p className="font-inter text-xs text-black/60 leading-relaxed">{meta.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per-category tool listings */}
        {grouped.map((cat) => {
          const meta = categoryMeta[cat.value];
          const Icon = meta.icon;
          return (
            <div key={cat.value} className="mb-20">
              {/* Category header */}
              <div className="px-6 md:px-12 lg:px-16 mb-0">
                <div
                  className="flex items-center gap-4 px-8 py-5 border-[3px] border-black border-b-0"
                  style={{ background: meta.color }}
                >
                  <Icon size={20} className="text-black" />
                  <h2 className="font-oswald text-2xl font-bold uppercase tracking-tight">{cat.label} TOOLS</h2>
                  <span className="ml-auto font-oswald text-xs font-bold uppercase tracking-widest opacity-60">
                    {meta.tools.length} MODULES
                  </span>
                </div>
              </div>

              {/* Tools */}
              <div className="px-6 md:px-12 lg:px-16">
                <div className="border-[3px] border-black">
                  {cat.tools.map((tool, ti) => {
                    const ToolIcon = tool.icon;
                    const details = toolDetails[tool.id];
                    return (
                      <div
                        key={tool.id}
                        className="border-b-[3px] border-black last:border-b-0 grid grid-cols-1 lg:grid-cols-12"
                      >
                        {/* Tool identity */}
                        <div className="lg:col-span-3 px-6 py-6 border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black flex flex-col justify-between gap-4 bg-[#fafafa]">
                          <div>
                            <div
                              className="w-10 h-10 border-[3px] border-black flex items-center justify-center mb-4"
                              style={{ background: `${tool.color}30` }}
                            >
                              <ToolIcon size={18} style={{ color: tool.color }} />
                            </div>
                            <h3 className="font-oswald text-lg font-bold uppercase leading-tight mb-2">
                              {tool.name}
                            </h3>
                            <p className="font-inter text-xs text-black/60 leading-relaxed">
                              {tool.shortDesc}
                            </p>
                          </div>
                          <Link
                            to={tool.path}
                            className="inline-flex items-center gap-2 font-oswald text-[10px] font-bold uppercase tracking-widest border-[2px] border-black px-3 py-2 hover:bg-black hover:text-white transition-colors w-fit"
                          >
                            OPEN TOOL <ArrowUpRight size={12} />
                          </Link>
                        </div>

                        {/* How to use */}
                        <div className="lg:col-span-4 px-6 py-6 border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black">
                          <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: meta.color === "#F9FF00" ? "#1a1a1a" : meta.color }}>
                            HOW TO USE
                          </h4>
                          <ol className="space-y-2">
                            {(details?.howTo ?? ["Open the tool and follow the on-screen instructions."]).map((step, si) => (
                              <li key={si} className="flex gap-3">
                                <span
                                  className="font-oswald text-[10px] font-bold w-4 flex-shrink-0 mt-0.5"
                                  style={{ color: meta.color === "#F9FF00" ? "#1a1a1a" : meta.color }}
                                >
                                  {si + 1}.
                                </span>
                                <span className="font-inter text-xs text-black/70 leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Use cases */}
                        <div className="lg:col-span-5 px-6 py-6">
                          <h4 className="font-oswald text-[10px] font-bold uppercase tracking-widest mb-4 text-black/40">
                            WHEN TO USE IT
                          </h4>
                          <ul className="space-y-2">
                            {(details?.useCases ?? ["General purpose utility."]).map((uc, ui) => (
                              <li key={ui} className="flex gap-3">
                                <div
                                  className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 rotate-45"
                                  style={{ background: tool.color }}
                                />
                                <span className="font-inter text-xs text-black/70 leading-relaxed">{uc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom nav */}
        <div className="px-6 md:px-12 lg:px-16 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[3px] border-black">
            <Link
              to="/#tools"
              className="p-8 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black flex items-center justify-between group hover:bg-[#F9FF00] transition-colors"
            >
              <div>
                <h3 className="font-oswald text-xl font-bold uppercase mb-1">BROWSE ALL TOOLS</h3>
                <p className="font-inter text-xs text-black/60">Jump straight to the tool grid</p>
              </div>
              <ArrowUpRight size={24} className="group-hover:scale-110 transition-transform" />
            </Link>
            <Link
              to="/how-to-use"
              className="p-8 flex items-center justify-between group hover:bg-[#00E5FF] transition-colors"
            >
              <div>
                <h3 className="font-oswald text-xl font-bold uppercase mb-1">HOW TO USE CLEF</h3>
                <p className="font-inter text-xs text-black/60">Getting started guide with FAQ</p>
              </div>
              <ArrowUpRight size={24} className="group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
