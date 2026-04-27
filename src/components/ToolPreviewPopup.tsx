// ToolPreviewPopup — magazine-style tool preview with vibrant left panel + illustrated right panel
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { X, ArrowRight, ExternalLink, Zap, Shield, WifiOff } from "lucide-react";
import type { ToolDef } from "@/data/tools";
import gsap from "gsap";

// Per-tool metadata: how-to steps, tags, and illustration config
const TOOL_META: Record<string, {
  howTo: string[];
  tags: string[];
  illustrationBg: string;
  illustrationAccent: string;
  illustrationPattern: "grid" | "dots" | "diagonal" | "circuit" | "hex" | "noise";
  badge: string;
}> = {
  "json-formatter":        { howTo: ["Paste your JSON into the input area","Click Format to beautify or Minify to compress","Errors are highlighted in red with line numbers","Copy the output or download as .json"], tags: ["JSON","Formatter","Validator","Developer"], illustrationBg: "#059669", illustrationAccent: "#00FF87", illustrationPattern: "grid", badge: "DEVELOPER" },
  "regex-tester":          { howTo: ["Type your regex pattern in the top field","Paste test strings in the input area","Matches highlight in real time","Use flags (g, i, m) via the flag toggles"], tags: ["Regex","Pattern","Testing","Developer"], illustrationBg: "#E11D48", illustrationAccent: "#FF0004", illustrationPattern: "diagonal", badge: "DEVELOPER" },
  "jwt-decoder":           { howTo: ["Paste your JWT token into the input","Header, payload, and signature decode instantly","Expiry status shown with countdown","Copy individual sections as needed"], tags: ["JWT","Token","Auth","Security"], illustrationBg: "#9333EA", illustrationAccent: "#7C3AED", illustrationPattern: "circuit", badge: "SECURITY" },
  "css-minifier":          { howTo: ["Paste your CSS into the editor","Click Minify to compress or Beautify to expand","Size savings shown as percentage","Copy or download the result"], tags: ["CSS","Minifier","Optimizer","Developer"], illustrationBg: "#0891B2", illustrationAccent: "#00E5FF", illustrationPattern: "dots", badge: "DEVELOPER" },
  "diff-checker":          { howTo: ["Paste original text in the left panel","Paste modified text in the right panel","Differences highlight automatically","Green = added, Red = removed"], tags: ["Diff","Compare","Text","Developer"], illustrationBg: "#7C3AED", illustrationAccent: "#7C3AED", illustrationPattern: "grid", badge: "DEVELOPER" },
  "base64-tools":          { howTo: ["Choose Encode or Decode mode","Paste your text or Base64 string","Result appears instantly below","Copy to clipboard with one click"], tags: ["Base64","Encode","Decode","Developer"], illustrationBg: "#0284C7", illustrationAccent: "#00E5FF", illustrationPattern: "dots", badge: "DEVELOPER" },
  "color-converter":       { howTo: ["Enter a color in HEX, RGB, or HSL format","All three formats update simultaneously","Visual color preview shown in real time","Click any format to copy it"], tags: ["Color","HEX","RGB","HSL"], illustrationBg: "#8B5CF6", illustrationAccent: "#7C3AED", illustrationPattern: "hex", badge: "DEVELOPER" },
  "color-palette":         { howTo: ["Enter a seed color to start","Choose harmony type: complementary, triadic, etc.","Palette generates with 5 swatches","Export as CSS variables or copy HEX codes"], tags: ["Color","Palette","Design","Generator"], illustrationBg: "#F9FF00", illustrationAccent: "#F9FF00", illustrationPattern: "hex", badge: "DESIGN" },
  "hash-generator":        { howTo: ["Type or paste your input text","Select hash algorithm (SHA-256, MD5, etc.)","Hash generates instantly as you type","Copy the hash with one click"], tags: ["Hash","SHA","Crypto","Security"], illustrationBg: "#166534", illustrationAccent: "#00FF87", illustrationPattern: "circuit", badge: "SECURITY" },
  "uuid-generator":        { howTo: ["Click Generate to create a new UUID v4","Use Bulk mode to generate up to 100 at once","Copy individual or all UUIDs","Version selector for v1, v4, v5"], tags: ["UUID","Generator","Unique","Developer"], illustrationBg: "#9333EA", illustrationAccent: "#7C3AED", illustrationPattern: "dots", badge: "DEVELOPER" },
  "url-encoder":           { howTo: ["Paste your URL or string into the input","Click Encode to make it URL-safe","Click Decode to reverse the encoding","Full URL or component encoding supported"], tags: ["URL","Encode","Decode","Web"], illustrationBg: "#4F46E5", illustrationAccent: "#7C3AED", illustrationPattern: "grid", badge: "DEVELOPER" },
  "image-to-base64":       { howTo: ["Upload an image by clicking or dragging","Base64 string generates automatically","Choose output format: raw or data URI","Copy the string for use in HTML/CSS"], tags: ["Image","Base64","Converter","Developer"], illustrationBg: "#2563EB", illustrationAccent: "#00E5FF", illustrationPattern: "diagonal", badge: "DEVELOPER" },
  "number-base-converter": { howTo: ["Enter a number in any base field","Binary, octal, decimal, hex update live","Bit visualization shown for binary","Supports numbers up to 64-bit"], tags: ["Binary","Hex","Octal","Converter"], illustrationBg: "#FF0004", illustrationAccent: "#FF0004", illustrationPattern: "noise", badge: "DEVELOPER" },
  "text-file-maker":       { howTo: ["Type or paste your content into the editor","Set the filename in the name field","Click Download to save as .txt","Supports any plain text content"], tags: ["Text","File","Download","Productivity"], illustrationBg: "#F9FF00", illustrationAccent: "#F9FF00", illustrationPattern: "dots", badge: "PRODUCTIVITY" },
  "markdown-editor":       { howTo: ["Write Markdown in the left panel","Live preview renders on the right","Export to HTML or copy raw Markdown","Supports GFM: tables, code blocks, etc."], tags: ["Markdown","Editor","Preview","Productivity"], illustrationBg: "#FF0004", illustrationAccent: "#FF0004", illustrationPattern: "diagonal", badge: "PRODUCTIVITY" },
  "word-counter":          { howTo: ["Paste or type your text into the area","Word, character, sentence counts update live","Reading time estimate shown automatically","Paragraph count and unique word stats included"], tags: ["Words","Counter","Writing","Productivity"], illustrationBg: "#7C3AED", illustrationAccent: "#7C3AED", illustrationPattern: "grid", badge: "PRODUCTIVITY" },
  "lorem-ipsum":           { howTo: ["Choose output type: paragraphs, sentences, or words","Set the quantity using the number input","Click Generate to create placeholder text","Copy to clipboard instantly"], tags: ["Lorem","Placeholder","Text","Productivity"], illustrationBg: "#D97706", illustrationAccent: "#F9FF00", illustrationPattern: "dots", badge: "PRODUCTIVITY" },
  "pomodoro-timer":        { howTo: ["Set your work and break durations","Click Start to begin the first session","Timer alerts you when to switch","Session count tracked automatically"], tags: ["Pomodoro","Timer","Focus","Productivity"], illustrationBg: "#FF0004", illustrationAccent: "#FF0004", illustrationPattern: "circuit", badge: "PRODUCTIVITY" },
  "text-case-converter":   { howTo: ["Paste your text into the input area","Click any case format button to convert","12 formats: camelCase, snake_case, UPPER, etc.","Copy the converted result instantly"], tags: ["Text","Case","Convert","Productivity"], illustrationBg: "#00FF87", illustrationAccent: "#00FF87", illustrationPattern: "diagonal", badge: "PRODUCTIVITY" },
  "code-editor":           { howTo: ["Select your programming language from the dropdown","Write or paste code into the editor","Syntax highlighting applies automatically","Download your file with the correct extension"], tags: ["Code","Editor","IDE","Developer"], illustrationBg: "#1a1a1a", illustrationAccent: "#F9FF00", illustrationPattern: "circuit", badge: "DEVELOPER" },
  "password-generator":    { howTo: ["Set password length with the slider","Toggle character sets: upper, lower, numbers, symbols","Click Generate for a new password","Strength meter shows security level"], tags: ["Password","Security","Generator","Utility"], illustrationBg: "#DC2626", illustrationAccent: "#FF0004", illustrationPattern: "noise", badge: "SECURITY" },
  "qr-code-generator":     { howTo: ["Type or paste any text or URL","QR code generates in real time","Adjust size and error correction level","Download as PNG with one click"], tags: ["QR","Code","Generator","Utility"], illustrationBg: "#1a1a1a", illustrationAccent: "#F9FF00", illustrationPattern: "dots", badge: "UTILITY" },
  "unit-converter":        { howTo: ["Select a measurement category (length, weight, etc.)","Enter a value in any unit field","All other units update simultaneously","Supports 8 categories and 60+ units"], tags: ["Units","Convert","Measurement","Utility"], illustrationBg: "#0891B2", illustrationAccent: "#00E5FF", illustrationPattern: "grid", badge: "UTILITY" },
  "calculator":            { howTo: ["Click number and operator buttons or use keyboard","History panel shows previous calculations","Scientific mode available via toggle","Clear with C, delete last digit with ⌫"], tags: ["Calculator","Math","Scientific","Utility"], illustrationBg: "#1a1a1a", illustrationAccent: "#F9FF00", illustrationPattern: "dots", badge: "UTILITY" },
  "timestamp-converter":   { howTo: ["Enter a Unix timestamp to convert to date","Or pick a date to get its Unix timestamp","Live Unix clock shown at the top","7 output formats including ISO 8601"], tags: ["Timestamp","Unix","Date","Utility"], illustrationBg: "#00E5FF", illustrationAccent: "#00E5FF", illustrationPattern: "circuit", badge: "UTILITY" },
  "aspect-ratio":          { howTo: ["Enter width and height to calculate ratio","Or enter a ratio to calculate dimensions","Scale calculator for responsive design","Common ratios (16:9, 4:3) as quick presets"], tags: ["Aspect","Ratio","Design","Utility"], illustrationBg: "#D97706", illustrationAccent: "#F9FF00", illustrationPattern: "diagonal", badge: "UTILITY" },
  "cron-builder":          { howTo: ["Use the 5-field visual editor (min, hr, day, month, weekday)","Human-readable output updates as you type","Validate your expression with the checker","Common presets: every hour, daily, weekly"], tags: ["Cron","Schedule","Builder","Developer"], illustrationBg: "#059669", illustrationAccent: "#00FF87", illustrationPattern: "grid", badge: "DEVELOPER" },
};

const DEFAULT_META = {
  howTo: ["Open the tool","Use the input area","Process your data","Copy or download the result"],
  tags: ["Tool","Utility","Free"],
  illustrationBg: "#1a1a1a",
  illustrationAccent: "#F9FF00",
  illustrationPattern: "dots" as const,
  badge: "TOOL",
};

// Geometric illustration component — unique per tool
function ToolIllustration({ tool, meta }: { tool: ToolDef; meta: typeof DEFAULT_META }) {
  const Icon = tool.icon;
  const accent = meta.illustrationAccent;
  const bg = meta.illustrationBg;

  // Pattern color: always contrasting against the bg, not the accent
  // Dark bg → light pattern; light bg → dark pattern
  const isDarkBg = bg === "#1a1a1a" || bg.startsWith("#0") || bg === "#166534" || bg === "#059669" || bg === "#DC2626" || bg === "#E11D48" || bg === "#9333EA" || bg === "#7C3AED" || bg === "#4F46E5" || bg === "#2563EB" || bg === "#0284C7" || bg === "#0891B2" || bg === "#8B5CF6";
  const patternColor = isDarkBg ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)";

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      style={{ background: bg }}>
      {/* Background pattern — contrasting color, clearly visible */}
      <div className="absolute inset-0 pointer-events-none">
        {meta.illustrationPattern === "grid" && (
          <div style={{ backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`, backgroundSize: "48px 48px", width: "100%", height: "100%" }} />
        )}
        {meta.illustrationPattern === "dots" && (
          <div style={{ backgroundImage: `radial-gradient(${patternColor} 1.5px, transparent 0)`, backgroundSize: "32px 32px", width: "100%", height: "100%" }} />
        )}
        {meta.illustrationPattern === "diagonal" && (
          <div style={{ backgroundImage: `repeating-linear-gradient(45deg, ${patternColor} 0, ${patternColor} 1px, transparent 0, transparent 50%)`, backgroundSize: "20px 20px", width: "100%", height: "100%" }} />
        )}
        {meta.illustrationPattern === "circuit" && (
          <div style={{ backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`, backgroundSize: "64px 64px", width: "100%", height: "100%" }} />
        )}
        {meta.illustrationPattern === "hex" && (
          <div style={{ backgroundImage: `radial-gradient(${patternColor} 2px, transparent 0)`, backgroundSize: "28px 28px", width: "100%", height: "100%" }} />
        )}
        {meta.illustrationPattern === "noise" && (
          <div style={{ backgroundImage: `repeating-linear-gradient(0deg, ${patternColor} 0, ${patternColor} 1px, transparent 0, transparent 6px), repeating-linear-gradient(90deg, ${patternColor} 0, ${patternColor} 1px, transparent 0, transparent 6px)`, width: "100%", height: "100%" }} />
        )}
      </div>

      {/* Ghost tool name — large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-oswald font-bold uppercase leading-none text-center px-4"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)", color: accent + "08", letterSpacing: "-0.04em", lineHeight: 0.85 }}>
          {tool.name.split(" ").map((w, i) => <span key={i} className="block">{w}</span>)}
        </span>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-8 h-8 border-l-[3px] border-t-[3px]" style={{ borderColor: accent + "40" }} />
      <div className="absolute top-6 right-6 w-8 h-8 border-r-[3px] border-t-[3px]" style={{ borderColor: accent + "40" }} />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-l-[3px] border-b-[3px]" style={{ borderColor: accent + "40" }} />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-r-[3px] border-b-[3px]" style={{ borderColor: accent + "40" }} />

      {/* Central composition */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Outer ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-40 h-40 border-[2px] rounded-full opacity-20 animate-spin" style={{ borderColor: accent, animationDuration: "12s" }} />
          <div className="absolute w-28 h-28 border-[2px] rounded-full opacity-30 animate-spin" style={{ borderColor: accent, animationDuration: "8s", animationDirection: "reverse" }} />
          {/* Icon box — solid bg so it reads clearly */}
          <div className="relative w-20 h-20 flex items-center justify-center border-[3px] bg-[#1a1a1a]"
            style={{ borderColor: accent }}>
            <Icon size={36} style={{ color: accent }} />
            {/* Scan line */}
            <div className="absolute inset-x-0 h-[2px] opacity-40 animate-pulse" style={{ background: accent, top: "50%" }} />
          </div>
        </div>

        {/* Geometric accent shapes */}
        <div className="flex items-center gap-3">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="w-2 h-2 rotate-45 opacity-60" style={{ background: accent, opacity: 0.3 + i * 0.14 }} />
          ))}
        </div>

        {/* Badge */}
        <div className="border-[2px] px-4 py-1.5" style={{ borderColor: accent + "50" }}>
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: accent }}>{meta.badge}</span>
        </div>
      </div>

      {/* Bottom data strip */}
      <div className="absolute bottom-0 left-0 right-0 border-t-[2px] px-6 py-3 flex items-center justify-between"
        style={{ borderColor: accent + "20", background: accent + "08" }}>
        <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: accent + "60" }}>CLEF / {tool.category.toUpperCase()}</span>
        <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: accent + "60" }}>FREE</span>
      </div>
    </div>
  );
}

interface ToolPreviewPopupProps {
  tool: ToolDef;
  onClose: () => void;
  onOpen: () => void;
}

// Vibrant accent colors cycling through the palette
const PANEL_COLORS = ["#F9FF00", "#00E5FF", "#00FF87", "#7C3AED", "#FF0004"];

export function ToolPreviewPopup({ tool, onClose, onOpen }: ToolPreviewPopupProps) {
  const meta = TOOL_META[tool.id] || DEFAULT_META;
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const navigate   = useNavigate();

  // Pick panel color based on tool index in palette
  const colorIndex = Object.keys(TOOL_META).indexOf(tool.id) % PANEL_COLORS.length;
  const panelColor = PANEL_COLORS[Math.max(0, colorIndex)];
  const isLightPanel = panelColor === "#F9FF00" || panelColor === "#00E5FF" || panelColor === "#00FF87";
  const textColor = isLightPanel ? "#1a1a1a" : "#ffffff";

  // Entrance animation
  useEffect(() => {
    const overlay = overlayRef.current;
    const panel   = panelRef.current;
    if (!overlay || !panel) return;

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" });
    gsap.fromTo(panel,
      { y: 40, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power3.out", delay: 0.05 }
    );

    // Lock body scroll
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = () => {
    const overlay = overlayRef.current;
    const panel   = panelRef.current;
    if (!overlay || !panel) { onClose(); return; }
    gsap.to(panel,   { y: 20, opacity: 0, scale: 0.97, duration: 0.2, ease: "power2.in" });
    gsap.to(overlay, { opacity: 0, duration: 0.25, delay: 0.05, onComplete: onClose });
  };

  const handleOpen = () => {
    handleClose();
    setTimeout(() => navigate(tool.path), 280);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-5xl max-h-[90vh] border-[4px] border-black flex flex-col md:flex-row shadow-[16px_16px_0px_rgba(0,0,0,0.8)] overflow-y-auto md:overflow-hidden"
        style={{ minHeight: "min(600px, 90vh)" }}
      >
        {/* ── LEFT PANEL — vibrant color ── */}
        <div className="relative flex-1 md:w-[55%] flex flex-col overflow-x-hidden md:overflow-hidden"
          style={{ background: panelColor, minHeight: "280px" }}>

          {/* Ghost background text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span className="font-oswald font-bold uppercase leading-none text-center"
              style={{ fontSize: "clamp(5rem, 14vw, 12rem)", color: isLightPanel ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", letterSpacing: "-0.04em", lineHeight: 0.85 }}>
              {tool.name.split(" ")[0]}
            </span>
          </div>

          {/* Marquee ticker */}
          <div className="border-b-[3px] border-black overflow-hidden py-2 shrink-0"
            style={{ background: isLightPanel ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
            <div className="flex animate-marquee whitespace-nowrap">
              {[...Array(3)].map((_, rep) => (
                <span key={rep} className="flex items-center">
                  {[tool.name, meta.badge, "FREE", "BROWSER-SIDE", "NO SETUP", ...meta.tags].map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-3 mx-4">
                      <span className="font-oswald text-[10px] font-bold uppercase tracking-widest" style={{ color: textColor, opacity: 0.7 }}>{item}</span>
                      <span className="w-1 h-1 rotate-45 inline-block flex-shrink-0" style={{ background: textColor, opacity: 0.4 }} />
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 flex flex-col flex-1 p-6 md:p-10 overflow-y-auto md:overflow-hidden">
            {/* Category badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1.5 border-[2px]"
                style={{ borderColor: isLightPanel ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)", color: textColor, opacity: 0.7 }}>
                {tool.category.toUpperCase()}
              </span>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ color: textColor, opacity: 0.5 }}>
                {meta.badge}
              </span>
            </div>

            {/* Tool name */}
            <h2 className="font-oswald font-bold uppercase leading-[0.88] tracking-[-0.04em] mb-4"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: textColor }}>
              {tool.name}
            </h2>

            {/* Description */}
            <p className="font-inter text-sm leading-relaxed mb-8"
              style={{ color: textColor, opacity: 0.75, maxWidth: "36ch" }}>
              {tool.shortDesc}
            </p>

            {/* How to use */}
            <div className="mb-8">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] block mb-4"
                style={{ color: textColor, opacity: 0.5 }}>HOW TO USE</span>
              <div className="flex flex-col gap-2">
                {meta.howTo.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="font-oswald text-[10px] font-bold w-5 shrink-0 mt-0.5"
                      style={{ color: textColor, opacity: 0.4 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-inter text-xs leading-relaxed"
                      style={{ color: textColor, opacity: 0.8 }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {meta.tags.map((tag, i) => (
                <span key={i} className="font-oswald text-[9px] font-bold uppercase tracking-wider px-2 py-1 border"
                  style={{ borderColor: isLightPanel ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)", color: textColor, opacity: 0.65 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="border-t-[3px] border-black p-4 flex items-center gap-3 shrink-0"
            style={{ background: isLightPanel ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.3)" }}>
            <button
              onClick={handleOpen}
              className="group flex-1 flex items-center justify-center gap-3 font-oswald font-bold uppercase tracking-widest text-sm py-3 border-[3px] border-black transition-all duration-150 hover:-translate-y-0.5"
              style={{ background: "#1a1a1a", color: panelColor }}
            >
              OPEN TOOL
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-12 h-12 border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm transition-all duration-150 hover:bg-black hover:text-white"
              style={{ background: "transparent", color: "#1a1a1a" }}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL — illustration ── */}
        <div className="relative md:w-[45%] border-t-[4px] md:border-t-0 md:border-l-[4px] border-black overflow-hidden shrink-0 hidden sm:block"
          style={{ minHeight: "200px", md: { minHeight: "300px" } } as any}>
          <ToolIllustration tool={tool} meta={meta} />

          {/* Close button overlay */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 bg-black/60 border-[2px] border-white/20 flex items-center justify-center hover:bg-black transition-colors"
            title="Close"
          >
            <X size={14} className="text-white" />
          </button>

          {/* Stats strip */}
          <div className="absolute bottom-0 left-0 right-0 border-t-[3px] border-black bg-black/80 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Zap size={10} className="text-[#F9FF00]" />
                <span className="font-oswald text-[9px] font-bold uppercase tracking-widest text-white/60">INSTANT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={10} className="text-[#00FF87]" />
                <span className="font-oswald text-[9px] font-bold uppercase tracking-widest text-white/60">PRIVATE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <WifiOff size={10} className="text-[#00E5FF]" />
                <span className="font-oswald text-[9px] font-bold uppercase tracking-widest text-white/60">OFFLINE</span>
              </div>
            </div>
            <span className="font-oswald text-[9px] font-bold uppercase tracking-widest text-[#F9FF00]">FREE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
