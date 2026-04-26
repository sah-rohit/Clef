import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Link } from "react-router";
import { ArrowUpRight, Zap, Shield, Wrench, Plus, Bug, Sparkles } from "lucide-react";

type ChangeType = "new" | "improved" | "fixed" | "security" | "removed";

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  label: string;
  labelColor: string;
  labelText: string;
  summary: string;
  changes: Change[];
}

const typeConfig: Record<ChangeType, { label: string; color: string; icon: React.ElementType }> = {
  new:      { label: "NEW",      color: "#00FF87", icon: Plus },
  improved: { label: "IMPROVED", color: "#00E5FF", icon: Zap },
  fixed:    { label: "FIXED",    color: "#F9FF00", icon: Bug },
  security: { label: "SECURITY", color: "#7C3AED", icon: Shield },
  removed:  { label: "REMOVED",  color: "#FF0004", icon: Wrench },
};

const releases: Release[] = [
  {
    version: "v1.5.0",
    date: "April 26, 2026",
    label: "LATEST",
    labelColor: "#00FF87",
    labelText: "text-black",
    summary: "GSAP kinetic typography, Lenis smooth scroll, gradient shadow system, hide-on-scroll GitHub ribbon, page load bar, and 10 new tools.",
    changes: [
      { type: "new",      text: "GSAP-powered kinetic typography entrance animation on Hero section" },
      { type: "new",      text: "Lenis smooth scroll — butter-smooth 144fps-feeling scroll across all pages" },
      { type: "new",      text: "Page load bar — gradient loading indicator on every route change" },
      { type: "new",      text: "CSS Minifier / Beautifier tool with size savings indicator" },
      { type: "new",      text: "Diff Checker — side-by-side text comparison with LCS algorithm" },
      { type: "new",      text: "Timestamp Converter with live Unix clock and 7 output formats" },
      { type: "new",      text: "Color Palette Generator — monochromatic, complementary, triadic, analogous" },
      { type: "new",      text: "Text Case Converter — 12 formats including camelCase, snake_case, flipped text" },
      { type: "new",      text: "Number Base Converter — binary/octal/decimal/hex with bit visualization" },
      { type: "new",      text: "Aspect Ratio Calculator with visual preview and scale calculator" },
      { type: "new",      text: "JWT Decoder — header/payload/signature with expiry status" },
      { type: "new",      text: "Cron Builder — visual 5-field editor with human-readable output" },
      { type: "new",      text: "useScrollReveal hook — reusable GSAP ScrollTrigger for all sections" },
      { type: "improved", text: "GitHub ribbon now hides on scroll-down and reappears on scroll-up" },
      { type: "improved", text: "Nav slides with ribbon — no layout jump when ribbon hides" },
      { type: "improved", text: "Gradient shadow system — Apple-style soft shadows on cards and buttons" },
      { type: "improved", text: "Typography system — display, thin, italic, outline, gradient text utilities" },
      { type: "improved", text: "Input focus ring — yellow glow on focus instead of plain outline" },
      { type: "improved", text: "Button hover — lift + shadow deepens on hover, compresses on click" },
      { type: "improved", text: "Hero stats updated to reflect 28 tools" },
      { type: "improved", text: "Bottom banner updated to '28 FREE TOOLS'" },
      { type: "fixed",    text: "Changelog dates corrected — all releases now show April 2026 accurately" },
    ],
  },
  {
    version: "v1.4.0",
    date: "April 24, 2026",
    label: "STABLE",
    labelColor: "#F9FF00",
    labelText: "text-black",
    summary: "Major UI overhaul with vibrant color system, responsive mobile fixes, custom cursor redesign, and 3 new pages.",
    changes: [
      { type: "new",      text: "Vibrant color palette: cyan (#00E5FF), green (#00FF87), purple (#7C3AED) added site-wide" },
      { type: "new",      text: "How To Use page — step-by-step guide, FAQ, keyboard shortcuts, PWA install guide" },
      { type: "new",      text: "Changelog page" },
      { type: "new",      text: "Tools Guide page — every tool documented with how-to and use cases" },
      { type: "new",      text: "GitHub Top Ribbon with Star Repo and View Source buttons" },
      { type: "improved", text: "Tool cards now use each tool's accent color as a subtle background tint" },
      { type: "improved", text: "Custom cursor redesigned — mix-blend-mode: difference for universal visibility" },
      { type: "improved", text: "Custom cursor no longer breaks after returning from DevTools" },
      { type: "improved", text: "Filter tabs on mobile now scroll horizontally instead of wrapping" },
      { type: "improved", text: "Tool card aspect ratio on mobile changed to landscape for better fit" },
      { type: "improved", text: "OurPromise section now has 4 features (added Open Source)" },
      { type: "improved", text: "Roster status badges are now color-coded per row" },
      { type: "improved", text: "Footer section headers use different colors per column" },
      { type: "improved", text: "ToolLayout info bars get cyan/yellow/green left-border accents" },
      { type: "fixed",    text: "Dark gradient overlay on mobile tool cards was too heavy — lightened" },
      { type: "fixed",    text: "README privacy section clarified: guest mode is local-only, signed-in uses Convex" },
    ],
  },
  {
    version: "v1.3.0",
    date: "April 20, 2026",
    label: "STABLE",
    labelColor: "#F9FF00",
    labelText: "text-black",
    summary: "Convex cloud sync, AES-256 encrypted storage, and user authentication shipped.",
    changes: [
      { type: "new",      text: "User authentication via Convex Auth (email + password)" },
      { type: "new",      text: "AES-256 encrypted cloud sync for AI chat history (signed-in users)" },
      { type: "new",      text: "Account Center page with profile management" },
      { type: "new",      text: "Notification system for account events" },
      { type: "new",      text: "Cross-device AI conversation sync" },
      { type: "improved", text: "AI rate limits increased for signed-in users (20/hr, 80/day vs 10/hr, 50/day)" },
      { type: "security", text: "All cloud data encrypted at rest with AES-256 via Convex" },
      { type: "security", text: "Auth tokens stored securely, never in localStorage" },
      { type: "fixed",    text: "AI chat history occasionally lost on page refresh — now persisted correctly" },
    ],
  },
  {
    version: "v1.2.0",
    date: "April 15, 2026",
    label: "STABLE",
    labelColor: "#F9FF00",
    labelText: "text-black",
    summary: "Clef AI integration with Llama 3.1, conversation history, and pinned messages.",
    changes: [
      { type: "new",      text: "Clef AI powered by Llama 3.1 via Groq — integrated into every page" },
      { type: "new",      text: "AI conversation history with local storage persistence" },
      { type: "new",      text: "Pin important AI messages for quick reference" },
      { type: "new",      text: "One-click retry for AI responses" },
      { type: "new",      text: "Stop generation mid-stream" },
      { type: "new",      text: "Thumbs up / down feedback on AI responses" },
      { type: "improved", text: "AI panel redesigned with conversation list sidebar" },
      { type: "fixed",    text: "AI panel z-index conflict with tool modals" },
    ],
  },
  {
    version: "v1.1.0",
    date: "April 10, 2026",
    label: "STABLE",
    labelColor: "#F9FF00",
    labelText: "text-black",
    summary: "PWA support, offline mode, and 6 new tools added.",
    changes: [
      { type: "new",      text: "Progressive Web App (PWA) — install to home screen, works offline" },
      { type: "new",      text: "Hash Generator tool (MD5, SHA-1, SHA-256, SHA-512)" },
      { type: "new",      text: "Image to Base64 converter" },
      { type: "new",      text: "Regex Tester with live match highlighting" },
      { type: "new",      text: "UUID Generator (v1, v4, v5, bulk generation)" },
      { type: "new",      text: "URL Encoder / Decoder" },
      { type: "new",      text: "Pomodoro Timer with custom intervals" },
      { type: "improved", text: "Tool layout redesigned with magazine-style header" },
      { type: "improved", text: "Navigation updated with active page highlighting" },
      { type: "fixed",    text: "Color Converter HEX input not accepting shorthand values (#fff)" },
      { type: "fixed",    text: "JSON Formatter crashing on deeply nested objects" },
    ],
  },
  {
    version: "v1.0.0",
    date: "April 1, 2026",
    label: "LAUNCH",
    labelColor: "#FF0004",
    labelText: "text-white",
    summary: "Initial public launch of Clef Workbench with 18 core tools.",
    changes: [
      { type: "new", text: "Text File Maker — write and download .txt files" },
      { type: "new", text: "Code Editor / IDE with syntax highlighting" },
      { type: "new", text: "Markdown Editor with live preview" },
      { type: "new", text: "Color Converter (HEX ↔ RGB ↔ HSL)" },
      { type: "new", text: "JSON Formatter, minifier, and validator" },
      { type: "new", text: "Password Generator with strength meter" },
      { type: "new", text: "QR Code Generator" },
      { type: "new", text: "Base64 Encoder / Decoder" },
      { type: "new", text: "Lorem Ipsum Generator" },
      { type: "new", text: "Word Counter with reading time estimate" },
      { type: "new", text: "Unit Converter (length, weight, temperature, area)" },
      { type: "new", text: "Calculator with history" },
      { type: "new", text: "Brutalist design system with Oswald + Inter typography" },
      { type: "new", text: "Custom cursor for desktop browsers" },
      { type: "new", text: "Community Inquiry board powered by Convex" },
      { type: "new", text: "Pricing page, About page, Contact page" },
      { type: "new", text: "Open Source page with GitHub repository link" },
    ],
  },
];

export default function Changelog() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-24 pb-20">
        {/* Header */}
        <div className="px-6 md:px-12 lg:px-16 mb-16">
          <BackButton />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
            <div>
              <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#7C3AED] block mb-4">
                Version History
              </span>
              <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-[-0.03em] leading-[0.9]">
                CHANGELOG.
              </h1>
            </div>
            <p className="font-inter text-sm text-black/60 max-w-sm leading-relaxed md:text-right">
              Every update, fix, and new feature — documented in full. No marketing speak, just what changed.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 md:px-12 lg:px-16 mb-12">
          <div className="flex flex-wrap gap-0 border-[3px] border-black w-fit">
            {Object.entries(typeConfig).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div key={key} className="flex items-center gap-2 px-4 py-2 border-r-[3px] border-black last:border-r-0">
                  <div className="w-5 h-5 flex items-center justify-center" style={{ background: cfg.color }}>
                    <Icon size={11} className="text-black" />
                  </div>
                  <span className="font-oswald text-[10px] font-bold uppercase tracking-wider">{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Releases */}
        <div className="px-6 md:px-12 lg:px-16">
          <div className="space-y-0 border-[3px] border-black">
            {releases.map((release, ri) => (
              <div key={ri} className="border-b-[3px] border-black last:border-b-0">
                {/* Release header */}
                <div className="grid grid-cols-1 md:grid-cols-12 border-b-[3px] border-black">
                  <div className="md:col-span-3 lg:col-span-2 px-6 py-6 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black flex flex-col justify-center gap-3 bg-[#fafafa]">
                    <div className="flex items-center gap-3">
                      <span className="font-oswald text-3xl font-bold">{release.version}</span>
                      <span
                        className={`px-2 py-0.5 font-oswald text-[9px] font-bold uppercase tracking-widest border-[2px] border-black ${release.labelText}`}
                        style={{ background: release.labelColor }}
                      >
                        {release.label}
                      </span>
                    </div>
                    <span className="font-inter text-xs text-black/50 uppercase tracking-widest">{release.date}</span>
                  </div>
                  <div className="md:col-span-9 lg:col-span-10 px-6 py-6 flex items-center">
                    <p className="font-inter text-sm text-black/70 leading-relaxed">{release.summary}</p>
                  </div>
                </div>

                {/* Changes list */}
                <div className="divide-y-[3px] divide-black">
                  {release.changes.map((change, ci) => {
                    const cfg = typeConfig[change.type];
                    const Icon = cfg.icon;
                    return (
                      <div key={ci} className="grid grid-cols-1 md:grid-cols-12 hover:bg-[#fafafa] transition-colors">
                        <div className="md:col-span-3 lg:col-span-2 px-6 py-3 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black flex items-center">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                              style={{ background: cfg.color }}
                            >
                              <Icon size={11} className="text-black" />
                            </div>
                            <span className="font-oswald text-[10px] font-bold uppercase tracking-wider">
                              {cfg.label}
                            </span>
                          </div>
                        </div>
                        <div className="md:col-span-9 lg:col-span-10 px-6 py-3 flex items-center">
                          <span className="font-inter text-sm text-black/80">{change.text}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 md:px-12 lg:px-16 mt-16">
          <div className="border-[3px] border-black p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Sparkles size={24} style={{ color: "#F9FF00" }} />
              <div>
                <h3 className="font-oswald text-xl font-bold uppercase">WANT TO CONTRIBUTE?</h3>
                <p className="font-inter text-xs text-black/60 mt-1">Clef is open source. Fork it, fix it, improve it.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com/sah-rohit/clef"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1a1a1a] border-[3px] border-black text-white font-oswald font-bold uppercase tracking-widest text-xs flex items-center gap-2 px-6 py-3 hover:bg-[#F9FF00] hover:text-black transition-colors"
              >
                GITHUB <ArrowUpRight size={14} />
              </a>
              <Link
                to="/how-to-use"
                className="bg-[#00E5FF] border-[3px] border-black text-black font-oswald font-bold uppercase tracking-widest text-xs flex items-center gap-2 px-6 py-3 hover:bg-black hover:text-[#00E5FF] transition-colors"
              >
                HOW TO USE
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
