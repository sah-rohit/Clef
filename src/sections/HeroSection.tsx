import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Zap, Globe, Shield, FileText, Type, Palette, Key, QrCode, Menu,
  ArrowUpRight, Braces, Hash, Timer, Fingerprint, Code, Layers, Cpu, Lock,
  Sparkles, Terminal, GitBranch, Database, Wifi, WifiOff, Star, Users, TrendingUp,
  CheckCircle, Play, ChevronRight, Award, Rocket, Eye, Heart, Coffee, Bolt,
  BarChart3, PieChart, Activity, Gauge, Flame, Crown, Diamond, Infinity,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Magnetic slide data ──────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 1,
    bg: "#0a0a0a",
    accent: "#F9FF00",
    pattern: "dots",
    eyebrow: "PERFORMANCE",
    title: ["SUB-100MS", "EVERY TIME."],
    titleAccent: 1,
    accentClass: "text-gradient-yellow",
    body: "We obsessed over every millisecond. No lazy-loading, no splash screens, no spinners. Every tool is pre-compiled and cached — it opens before your finger lifts off the mouse.",
    stat: { val: "<100ms", label: "Average tool open time" },
    tags: ["Instant Load", "Pre-compiled", "Edge Cached", "No Spinners"],
    visual: "perf",
    num: "01",
  },
  {
    id: 2,
    bg: "#050510",
    accent: "#00E5FF",
    pattern: "grid",
    eyebrow: "PRIVACY ARCHITECTURE",
    title: ["ZERO-KNOWLEDGE", "BY DESIGN."],
    titleAccent: 1,
    accentClass: "text-gradient-cyber",
    body: "Every computation runs inside your browser's sandbox. We have no server that receives your data — because we never built one. Your secrets stay secret.",
    stat: { val: "0 bytes", label: "Data sent to our servers" },
    tags: ["Local Processing", "No Telemetry", "No Cookies", "Sandboxed"],
    visual: "privacy",
    num: "02",
  },
  {
    id: 3,
    bg: "#0a0005",
    accent: "#7C3AED",
    pattern: "diagonal",
    eyebrow: "AI INTELLIGENCE",
    title: ["LLAMA 3.1", "BUILT IN."],
    titleAccent: 1,
    accentClass: "text-gradient-purple",
    body: "Clef AI runs on Llama 3.1 via Groq's ultra-fast inference. Ask it to debug code, explain concepts, or generate content. No API key, no setup — just ask.",
    stat: { val: "Groq", label: "Ultra-fast inference engine" },
    tags: ["Llama 3.1", "No API Key", "Chat History", "Code Aware"],
    visual: "ai",
    num: "03",
  },
  {
    id: 4,
    bg: "#001a0a",
    accent: "#00FF87",
    pattern: "hex",
    eyebrow: "OPEN SOURCE",
    title: ["EVERY LINE", "IS PUBLIC."],
    titleAccent: 1,
    accentClass: "text-gradient-cyber",
    body: "MIT licensed. Every function, every component, every commit — visible on GitHub. Fork it, audit it, contribute to it. Trust is built through radical transparency.",
    stat: { val: "MIT", label: "Open source license" },
    tags: ["GitHub Public", "MIT License", "Forkable", "Auditable"],
    visual: "open",
    num: "04",
  },
  {
    id: 5,
    bg: "#1a0000",
    accent: "#FF0004",
    pattern: "noise",
    eyebrow: "PRICING MODEL",
    title: ["FREE.", "FOREVER."],
    titleAccent: 0,
    accentClass: "text-outline-white",
    body: "Not a freemium trap. Not a trial. Not 'free with limits.' All 28 tools, all features, all the time — permanently free. No credit card. No expiry. No catch.",
    stat: { val: "$0", label: "Cost. Now and always." },
    tags: ["No Paywall", "No Trial", "No Credit Card", "28 Tools Free"],
    visual: "free",
    num: "05",
  },
  {
    id: 6,
    bg: "#0a0a1a",
    accent: "#F9FF00",
    pattern: "circuit",
    eyebrow: "OFFLINE CAPABLE",
    title: ["WORKS WITHOUT", "THE INTERNET."],
    titleAccent: 1,
    accentClass: "text-gradient-yellow",
    body: "After your first visit, Clef is fully cached as a Progressive Web App. Lose your WiFi mid-project? Keep working. Every tool runs offline, no exceptions.",
    stat: { val: "PWA", label: "Progressive Web App — works offline" },
    tags: ["Service Worker", "Offline First", "Installable", "No CDN Deps"],
    visual: "offline",
    num: "06",
  },
];

// ── Slide visual components ──────────────────────────────────────────────────
function SlideVisual({ type, accent }: { type: string; accent: string }) {
  if (type === "perf") return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative">
        {[80, 60, 40].map((size, i) => (
          <div key={i} className="absolute inset-0 rounded-full border opacity-20 animate-ping"
            style={{ width: size * 2, height: size * 2, margin: `${-size}px`, borderColor: accent, animationDelay: `${i * 0.4}s`, animationDuration: "2s" }} />
        ))}
        <div className="w-24 h-24 flex items-center justify-center border-4 relative z-10" style={{ borderColor: accent, background: accent + "15" }}>
          <Gauge size={40} style={{ color: accent }} />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-1">
        {[95, 88, 100, 92, 97, 85, 99, 91].map((h, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-full rounded-sm" style={{ height: `${h * 0.4}px`, background: accent + "60", opacity: 0.6 + i * 0.05 }} />
          </div>
        ))}
      </div>
    </div>
  );

  if (type === "privacy") return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-3">
        <div className="w-20 h-20 flex items-center justify-center border-4" style={{ borderColor: accent, background: accent + "10" }}>
          <Lock size={36} style={{ color: accent }} />
        </div>
        <div className="flex flex-col gap-1.5 w-48">
          {["Your data", "Your device", "Your control"].map((t, i) => (
            <div key={i} className="flex items-center gap-2 border px-3 py-1.5" style={{ borderColor: accent + "30" }}>
              <CheckCircle size={10} style={{ color: accent }} />
              <span className="font-inter text-[10px] uppercase tracking-wider" style={{ color: accent + "cc" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (type === "ai") return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-[200px] border-2 bg-black/40" style={{ borderColor: accent + "40" }}>
        <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: accent + "30", background: accent + "10" }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
          <span className="font-oswald text-[9px] font-bold uppercase tracking-widest" style={{ color: accent }}>CLEF AI</span>
        </div>
        <div className="p-3 space-y-2">
          {[
            { side: "right", text: "Debug this function" },
            { side: "left", text: "Found 2 issues — here's the fix..." },
            { side: "right", text: "Explain async/await" },
          ].map((m, i) => (
            <div key={i} className={`flex ${m.side === "right" ? "justify-end" : "justify-start"}`}>
              <div className="px-2 py-1 border text-[9px] font-inter max-w-[80%]"
                style={{ borderColor: m.side === "right" ? accent + "60" : "#ffffff20", background: m.side === "right" ? accent + "20" : "#ffffff08", color: m.side === "right" ? accent : "#ffffff80" }}>
                {m.text}
              </div>
            </div>
          ))}
          <div className="flex gap-1 pl-1">
            {[0,1,2].map(i => <div key={i} className="w-1 h-1 rounded-full animate-bounce" style={{ background: accent + "60", animationDelay: `${i*0.15}s` }} />)}
          </div>
        </div>
      </div>
    </div>
  );

  if (type === "open") return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        {["src/tools/json.tsx", "src/tools/regex.tsx", "convex/schema.ts", "src/sections/Hero.tsx"].map((f, i) => (
          <div key={i} className="flex items-center gap-2 border px-3 py-2" style={{ borderColor: accent + "25", background: accent + "08" }}>
            <GitBranch size={10} style={{ color: accent }} />
            <span className="font-mono text-[9px]" style={{ color: accent + "99" }}>{f}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ background: accent }} />
          <span className="font-inter text-[9px] uppercase tracking-wider" style={{ color: accent + "80" }}>MIT Licensed</span>
        </div>
      </div>
    </div>
  );

  if (type === "free") return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="font-oswald text-[80px] font-bold leading-none" style={{ color: accent, textShadow: `0 0 60px ${accent}40` }}>$0</div>
        <div className="font-inter text-[11px] uppercase tracking-widest mt-2" style={{ color: accent + "60" }}>Forever. No catch.</div>
        <div className="mt-4 grid grid-cols-2 gap-1 max-w-[160px] mx-auto">
          {["No ads", "No paywall", "No trial", "No card"].map((t, i) => (
            <div key={i} className="border px-2 py-1 text-center" style={{ borderColor: accent + "30" }}>
              <span className="font-inter text-[9px] uppercase tracking-wide" style={{ color: accent + "80" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (type === "offline") return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <WifiOff size={48} style={{ color: accent }} />
          <div className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center" style={{ background: accent }}>
            <CheckCircle size={10} className="text-black" />
          </div>
        </div>
        <div className="font-inter text-[11px] uppercase tracking-widest text-center" style={{ color: accent + "80" }}>
          Still works.<br />Always.
        </div>
        <div className="flex items-center gap-2 border px-4 py-2" style={{ borderColor: accent + "30" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <span className="font-inter text-[9px] uppercase tracking-wider" style={{ color: accent + "99" }}>PWA Installed</span>
        </div>
      </div>
    </div>
  );

  return null;
}

export function HeroSection() {
  const navigate = useNavigate();
  const sectionRef   = useRef<HTMLElement>(null);
  const badgeRef     = useRef<HTMLDivElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const paraRef      = useRef<HTMLParagraphElement>(null);
  const btnsRef      = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);
  const featRef      = useRef<HTMLDivElement>(null);
  const magneticWrap = useRef<HTMLDivElement>(null);

  const [activeSlide, setActiveSlide] = useState(0);

  const scrollToTools = () => navigate("/features#tools");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", force3D: true },
        delay: 0.05,
      });

      tl.fromTo(badgeRef.current,
        { y: -16, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45 }
      );

      const lines = headingRef.current?.querySelectorAll(".hero-line");
      if (lines?.length) {
        tl.fromTo(lines,
          { y: "105%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.6, stagger: 0.07, ease: "power4.out" },
          "-=0.2"
        );
      }

      tl.fromTo(paraRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.25"
      );

      tl.fromTo(btnsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        "-=0.25"
      );

      tl.fromTo(statsRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.2"
      );

      tl.fromTo(rightRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.75"
      );

      const cells = gridRef.current?.querySelectorAll(".grid-cell");
      if (cells?.length) {
        tl.fromTo(cells,
          { scale: 0.75, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, stagger: 0.03, ease: "back.out(1.2)" },
          "-=0.5"
        );
      }

      const feats = featRef.current?.querySelectorAll(".feat-item");
      if (feats?.length) {
        tl.fromTo(feats,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
          "-=0.3"
        );
      }

      // Scroll reveals
      gsap.fromTo(".hero-step",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-step", start: "top 88%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".hero-cat",
        { x: 24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-cat", start: "top 88%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".hero-compare-row",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power2.out", force3D: true,
          scrollTrigger: { trigger: ".hero-compare-row", start: "top 88%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".hero-chat",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-chat", start: "top 88%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".hero-ai-right",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.65, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-ai-right", start: "top 88%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".hero-metric",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-metric", start: "top 88%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".hero-feature-card",
        { y: 30, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.07, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-feature-card", start: "top 88%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".hero-testimonial",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-testimonial", start: "top 88%", toggleActions: "play none none none" } }
      );
      gsap.fromTo(".hero-tool-pill",
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, stagger: 0.04, ease: "back.out(1.4)", force3D: true,
          scrollTrigger: { trigger: ".hero-tool-pill", start: "top 90%", toggleActions: "play none none none" } }
      );

      // ── Horizontal Scroll for SLIDES ──
      const wrap = magneticWrap.current;
      if (wrap) {
        const slides = wrap.querySelectorAll(".horizontal-slide");
        const totalSlides = slides.length;
        
        gsap.to(slides, {
          xPercent: -100 * (totalSlides - 1),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            pin: true,
            scrub: 1,
            snap: 1 / (totalSlides - 1),
            start: "top top",
            end: () => `+=${wrap.offsetWidth * (totalSlides - 1)}`,
          }
        });

        // Active index update for progress dots
        ScrollTrigger.create({
          trigger: wrap,
          start: "top top",
          end: () => `+=${wrap.offsetWidth * (totalSlides - 1)}`,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (totalSlides - 1));
            setActiveSlide(idx);
          }
        });
      }

        // ── Zoom Section Animation ──
        const zoomSection = document.querySelector(".zoom-section");
        if (zoomSection) {
          const zoomLayers = zoomSection.querySelectorAll(".zoom-layer");
          const zoomTl = gsap.timeline({
            scrollTrigger: {
              trigger: zoomSection,
              start: "top top",
              end: "+=400%",
              pin: true,
              scrub: 1,
            }
          });

          // Layer 0: CLEF background - zooms past
          zoomTl.fromTo(zoomLayers[0], 
            { scale: 1, opacity: 1 },
            { scale: 8, opacity: 0, duration: 1.5, ease: "power2.in" }
          );

          // Layer 1: BEYOND LIMITS - zooms in, then past
          zoomTl.fromTo(zoomLayers[1],
            { scale: 0.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.8"
          ).to(zoomLayers[1],
            { scale: 6, opacity: 0, duration: 1.5, ease: "power2.in" },
            "+=0.2"
          );

          // Layer 2: FRONT CONTENT - final focus
          zoomTl.fromTo(zoomLayers[2],
            { scale: 0.05, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1, ease: "power2.out" },
            "-=0.8"
          );
        }

        // Robust refresh strategy:
        // 1. Immediate refresh
        ScrollTrigger.refresh();
        
        // 2. Delayed refreshes to catch layout shifts after transition & images load
        [100, 500, 1000, 2000].forEach(ms => {
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, ms);
        });
      }, sectionRef);

    return () => ctx.revert();
  }, []);

  const slide = SLIDES[activeSlide];

  return (
    <section ref={sectionRef} className="relative bg-white">

      {/* ── Main hero split ── */}
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Column */}
        <div
          className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 pb-16 bg-white relative"
          style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h) + 2.5rem)" }}
        >
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 0)", backgroundSize: "28px 28px" }} />
          <div className="max-w-xl relative z-10">
            <div ref={badgeRef} className="mb-8 opacity-0">
              <span className="inline-flex items-center gap-2 bg-[#F9FF00] px-4 py-1.5 font-oswald text-[11px] font-bold uppercase tracking-widest border-2 border-black shadow-glow-yellow">
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                FREE FOREVER — NO CATCH
              </span>
            </div>
            <h1 ref={headingRef} className="font-oswald font-bold uppercase leading-[0.88] tracking-[-0.03em] mb-6 text-[#1a1a1a]"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 5.2rem)" }}>
              {["YOUR DAILY", "WORKBENCH FOR", "CODE, TEXT, AND", "COLOR."].map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <span className="hero-line block opacity-0">
                    {i === 3
                      ? <><span className="text-outline-black">{line.slice(0, -1)}</span><span className="text-gradient-fire">.</span></>
                      : line}
                  </span>
                </span>
              ))}
            </h1>
            <p ref={paraRef} className="font-inter text-[15px] md:text-[16px] leading-relaxed text-[#1a1a1a]/60 mb-10 max-w-[30rem] font-medium opacity-0">
              Clef is my personal suite of essential utilities for developers and everyday users.{" "}
              <em className="not-italic font-semibold text-[#1a1a1a]">Text editors, code tools, converters, generators</em>{" "}
              — all built to work right in your browser. Private, fast, and no strings attached.
            </p>
            <div ref={btnsRef} className="flex flex-wrap gap-3 mb-12 opacity-0">
              <button onClick={scrollToTools}
                className="group bg-[#F9FF00] border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-7 py-3 hover:bg-black hover:text-[#F9FF00] transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                EXPLORE TOOLS
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <Link to="/how-to-use"
                className="border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-2 px-7 py-3 hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 hover:-translate-y-0.5">
                HOW IT WORKS
              </Link>
              <Link to="/about"
                className="bg-[#1a1a1a] border-[3px] border-[#1a1a1a] text-white font-oswald font-bold uppercase tracking-widest text-sm flex items-center px-7 py-3 hover:bg-white hover:text-[#1a1a1a] transition-all duration-200 hover:-translate-y-0.5">
                ABOUT
              </Link>
            </div>
            <div ref={statsRef} className="flex border-[3px] border-black max-w-sm opacity-0 shadow-apple">
              {[
                { val: "28+", label: "TOOLS",       color: "#FF0004" },
                { val: "$0",  label: "ALWAYS FREE", bg: "#00FF87", color: "#1a1a1a" },
                { val: "0",   label: "ADS EVER",    color: "#7C3AED" },
              ].map((s, i) => (
                <div key={i}
                  className={`flex-1 ${i < 2 ? "border-r-[3px] border-black" : ""} py-3 flex flex-col items-center justify-center transition-colors hover:bg-[#fafafa]`}
                  style={s.bg ? { background: s.bg + "18" } : {}}>
                  <span className="font-oswald text-xl font-bold mb-0.5" style={{ color: s.color }}>{s.val}</span>
                  <span className="font-inter text-[8px] font-bold uppercase tracking-widest text-black/40">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div ref={rightRef}
          className="flex-1 bg-[#1a1a1a] flex flex-col items-center justify-center p-8 md:p-16 lg:p-20 relative overflow-hidden opacity-0"
          style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h) + 2.5rem)" }}>
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
          <div className="w-full max-w-xs flex flex-col items-center relative z-10">
            <div ref={gridRef} className="grid grid-cols-3 w-fit mx-auto border-t border-l border-white/20 mb-12">
              {[
                <FileText size={20} strokeWidth={1} />,
                <span className="font-mono font-light text-lg">{"<>"}</span>,
                <Type size={20} strokeWidth={1} />,
                <Palette size={20} strokeWidth={1} />,
                <span className="font-mono font-light text-lg">{"{ }"}</span>,
                <Key size={20} strokeWidth={1} />,
                <QrCode size={20} strokeWidth={1} />,
                <div className="flex flex-col items-center text-[9px] font-mono font-light leading-tight"><span>01</span><span>10</span></div>,
                <Menu size={20} strokeWidth={1} />,
              ].map((icon, i) => (
                <div key={i}
                  className="grid-cell w-20 h-20 md:w-24 md:h-24 border-b border-r border-white/20 flex items-center justify-center text-white/35 hover:text-white hover:bg-white/5 transition-all duration-200 opacity-0">
                  {icon}
                </div>
              ))}
            </div>
            <div ref={featRef} className="flex flex-col gap-4 w-full">
              {[
                { bg: "#F9FF00", Icon: Zap,    text: "Runs entirely in your browser — no data sent to servers",    iconClass: "text-black" },
                { bg: "#FF0004", Icon: Globe,  text: "Works offline after first load — no internet needed",        iconClass: "text-white" },
                { bg: "#00E5FF", Icon: Shield, text: "No tracking, no cookies, no analytics — privacy guaranteed", iconClass: "text-black" },
              ].map(({ bg, Icon, text, iconClass }, i) => (
                <div key={i} className="feat-item flex items-center gap-3 opacity-0">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                    style={{ background: bg, boxShadow: `0 3px 10px ${bg}50` }}>
                    <Icon size={12} className={iconClass} />
                  </div>
                  <p className="font-inter text-xs text-white/75 leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-6 right-6 font-oswald text-[100px] md:text-[130px] font-bold text-white/[0.025] leading-none select-none pointer-events-none">
            CLEF
          </div>
        </div>
      </div>

      {/* ── Marquee ticker strip ── */}
      <div className="border-t-[3px] border-b-[3px] border-black bg-[#F9FF00] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex items-center">
              {["28 FREE TOOLS","ZERO ADS","PRIVACY FIRST","OPEN SOURCE","WORKS OFFLINE","AI POWERED","NO SIGN-UP NEEDED","BRUTALIST DESIGN","BUILT FOR CREATORS","ALWAYS FREE"].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-4 mx-6">
                  <span className="font-oswald text-sm font-bold uppercase tracking-widest text-black">{item}</span>
                  <span className="w-1.5 h-1.5 bg-black rotate-45 inline-block flex-shrink-0" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured tools strip ── */}
      <div className="border-b-[3px] border-black bg-white">
        <div className="px-6 md:px-12 lg:px-16 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-oswald text-xs font-bold uppercase tracking-[0.25em] text-black/40">POPULAR TOOLS</span>
          <div className="flex flex-wrap gap-0 border-[3px] border-black">
            {[
              { Icon: Braces,      label: "JSON",       path: "/tools/json-formatter",    color: "#059669" },
              { Icon: Palette,     label: "COLORS",     path: "/tools/color-converter",   color: "#8B5CF6" },
              { Icon: Hash,        label: "WORD COUNT", path: "/tools/word-counter",      color: "#7C3AED" },
              { Icon: Timer,       label: "POMODORO",   path: "/tools/pomodoro-timer",    color: "#FF0004" },
              { Icon: Fingerprint, label: "UUID",       path: "/tools/uuid-generator",    color: "#9333EA" },
              { Icon: QrCode,      label: "QR CODE",    path: "/tools/qr-code-generator", color: "#1a1a1a" },
            ].map(({ Icon, label, path, color }, i) => (
              <Link key={i} to={path}
                className="group flex items-center gap-2 px-4 py-2.5 border-r-[3px] border-black last:border-r-0 hover:bg-[#1a1a1a] transition-colors duration-150">
                <Icon size={14} className="group-hover:text-white transition-colors" style={{ color }} />
                <span className="font-oswald text-[10px] font-bold uppercase tracking-wider group-hover:text-white transition-colors">{label}</span>
                <ArrowUpRight size={10} className="text-black/20 group-hover:text-white/60 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION: Live Metrics ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#F9FF00] block mb-2">BY THE NUMBERS</span>
              <h2 className="font-oswald text-3xl md:text-4xl font-bold uppercase text-white leading-[0.9]">
                BUILT TO LAST.<br /><span className="text-outline-white">NUMBERS PROVE IT.</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 border border-white/10 px-4 py-2">
              <Activity size={12} className="text-[#00FF87]" />
              <span className="font-inter text-[10px] uppercase tracking-widest text-white/40">All metrics real-time</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-[3px] border-white/10">
            {[
              { val: "28+",    label: "Tools Available",    sub: "& growing",       color: "#F9FF00", Icon: Layers },
              { val: "100%",   label: "Browser-side",       sub: "zero server calls", color: "#00E5FF", Icon: Cpu },
              { val: "0ms",    label: "Data Transmitted",   sub: "to our servers",  color: "#00FF87", Icon: Lock },
              { val: "∞",      label: "Free Usage",         sub: "no limits ever",  color: "#7C3AED", Icon: Infinity },
            ].map(({ val, label, sub, color, Icon }, i) => (
              <div key={i}
                className="hero-metric border-b-[3px] md:border-b-0 border-r-[3px] border-white/10 last:border-r-0 p-6 md:p-8 group hover:bg-white/5 transition-colors duration-200">
                <div className="flex items-start justify-between mb-4">
                  <Icon size={16} style={{ color: color + "80" }} />
                  <span className="font-inter text-[9px] uppercase tracking-widest text-white/20">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="font-oswald text-4xl md:text-5xl font-bold leading-none mb-2" style={{ color }}>{val}</div>
                <div className="font-oswald text-xs font-bold uppercase tracking-wider text-white/70 mb-1">{label}</div>
                <div className="font-inter text-[9px] uppercase tracking-widest text-white/30">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION: How It Works ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#F9FF00] block mb-3">WORKFLOW</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase text-white leading-[0.9] tracking-[-0.02em]">
                THREE STEPS.<br /><span className="text-outline-white">ZERO FRICTION.</span>
              </h2>
            </div>
            <Link to="/features"
              className="inline-flex items-center gap-2 border-[2px] border-white/20 px-5 py-2.5 font-oswald text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#F9FF00] hover:text-black hover:border-[#F9FF00] transition-all duration-200 w-fit">
              FULL GUIDE <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[3px] border-white/10">
            {[
              { num: "01", color: "#F9FF00", title: "PICK A TOOL", desc: "Browse 28 tools by category or search by name. Every tool is one click away from the homepage.", detail: "No account. No loading screen. Just click." },
              { num: "02", color: "#00E5FF", title: "DO YOUR WORK", desc: "Paste, type, upload — whatever the tool needs. All processing happens locally in your browser.", detail: "Your data never leaves your device." },
              { num: "03", color: "#00FF87", title: "EXPORT & GO", desc: "Download your result as a file, copy to clipboard, or share a link. Done in seconds.", detail: "No cloud upload. No waiting. Instant." },
            ].map((step, i) => (
              <div key={i}
                className="hero-step p-8 md:p-10 border-b-[3px] md:border-b-0 md:border-r-[3px] border-white/10 last:border-0 group hover:bg-white/5 transition-colors duration-200">
                <div className="w-12 h-12 border-[3px] border-current flex items-center justify-center font-oswald text-xl font-bold mb-6 group-hover:scale-105 transition-transform duration-200"
                  style={{ color: step.color, borderColor: step.color }}>
                  {step.num}
                </div>
                <h3 className="font-oswald text-xl font-bold uppercase text-white mb-3 tracking-tight">{step.title}</h3>
                <p className="font-inter text-sm text-white/55 leading-relaxed mb-4">{step.desc}</p>
                <span className="font-oswald text-[10px] font-bold uppercase tracking-widest" style={{ color: step.color }}>{step.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION: Feature Cards Grid (Premium UI) ── */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-24">
          <div className="mb-14">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-4">WHAT MAKES CLEF DIFFERENT</span>
            <h2 className="font-oswald text-4xl md:text-6xl font-bold uppercase leading-[0.9] tracking-[-0.03em]">
              PREMIUM FEATURES.<br /><span className="text-gradient-fire">ZERO PRICE TAG.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-[3px] border-black">
            {[
              {
                Icon: Zap, color: "#F9FF00", bg: "#F9FF00",
                title: "INSTANT EVERYTHING",
                desc: "Sub-100ms tool opens. Pre-compiled bundles. No lazy loading. No splash screens. Click and it's there.",
                tag: "PERFORMANCE",
              },
              {
                Icon: Lock, color: "#00E5FF", bg: "#00E5FF",
                title: "ZERO-KNOWLEDGE ARCH",
                desc: "Every computation runs in your browser's sandbox. We have no server that receives your data — by design.",
                tag: "PRIVACY",
              },
              {
                Icon: WifiOff, color: "#00FF87", bg: "#00FF87",
                title: "OFFLINE FIRST PWA",
                desc: "Install Clef as a PWA. After first load, every tool works without internet. Service worker cached.",
                tag: "OFFLINE",
              },
              {
                Icon: Sparkles, color: "#7C3AED", bg: "#7C3AED",
                title: "AI BUILT IN",
                desc: "Llama 3.1 via Groq. Ask it anything — debug code, explain concepts, generate content. No API key needed.",
                tag: "AI",
              },
              {
                Icon: Code, color: "#FF0004", bg: "#FF0004",
                title: "OPEN SOURCE MIT",
                desc: "Every line of code is public on GitHub. Fork it, audit it, contribute. Trust through radical transparency.",
                tag: "OPEN SOURCE",
              },
              {
                Icon: Crown, color: "#F9FF00", bg: "#1a1a1a",
                title: "BRUTALIST DESIGN",
                desc: "No rounded corners. No gradients. No shadows. Pure brutalist UI — fast, focused, and unapologetically bold.",
                tag: "DESIGN",
              },
            ].map(({ Icon, color, bg, title, desc, tag }, i) => (
              <div key={i}
                className="hero-feature-card border-b-[3px] border-r-[3px] border-black last:border-r-0 p-8 group hover:bg-[#fafafa] transition-all duration-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.06]"
                  style={{ background: `radial-gradient(circle at top right, ${color}, transparent)` }} />
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 flex items-center justify-center border-[3px] border-black group-hover:scale-110 transition-transform duration-200"
                    style={{ background: bg === "#1a1a1a" ? "#1a1a1a" : bg + "20", borderColor: bg === "#1a1a1a" ? "#1a1a1a" : color }}>
                    <Icon size={18} style={{ color: bg === "#1a1a1a" ? "#F9FF00" : color }} />
                  </div>
                  <span className="font-oswald text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-black/10 text-black/40">{tag}</span>
                </div>
                <h3 className="font-oswald text-lg font-bold uppercase tracking-tight mb-3">{title}</h3>
                <p className="font-inter text-xs text-black/55 leading-relaxed">{desc}</p>
                <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronRight size={12} className="text-black/40" />
                  <span className="font-oswald text-[9px] font-bold uppercase tracking-widest text-black/40">LEARN MORE</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION: What's Inside ── */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="lg:border-r-[3px] lg:border-black lg:pr-16 pb-12 lg:pb-0 flex flex-col justify-center">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-4">THE TOOLSET</span>
              <h2 className="font-oswald text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[0.9] tracking-[-0.03em] mb-6">
                28 TOOLS.<br /><span className="text-gradient-cyber">3 CATEGORIES.</span><br />
                <span className="font-[400] tracking-[0.04em] text-3xl md:text-4xl">INFINITE USES.</span>
              </h2>
              <p className="font-inter text-sm text-black/55 leading-relaxed max-w-sm">
                From JSON formatting to QR codes, from regex testing to color palettes — every tool is purpose-built, distraction-free, and permanently free.
              </p>
            </div>
            <div className="lg:pl-16 flex flex-col gap-0 border-[3px] border-black lg:border-0">
              {[
                { label: "DEVELOPER", count: 13, color: "#00E5FF", tools: ["JSON Formatter", "Regex Tester", "JWT Decoder", "CSS Minifier", "Diff Checker", "Base64", "+7 more"], desc: "Code, format, debug, convert." },
                { label: "PRODUCTIVITY", count: 7, color: "#F9FF00", tools: ["Text File Maker", "Markdown Editor", "Word Counter", "Lorem Ipsum", "Pomodoro", "Text Case", "+1 more"], desc: "Write, edit, focus, ship." },
                { label: "UTILITY", count: 8, color: "#00FF87", tools: ["Password Gen", "QR Code", "Unit Converter", "Calculator", "Timestamp", "Aspect Ratio", "+2 more"], desc: "Convert, generate, measure." },
              ].map((cat, i) => (
                <div key={i}
                  className="hero-cat group border-b-[3px] border-black last:border-b-0 lg:border-[3px] lg:border-black lg:mb-3 last:mb-0 p-6 hover:bg-[#fafafa] transition-colors duration-200 cursor-default">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rotate-45" style={{ background: cat.color }} />
                      <span className="font-oswald text-base font-bold uppercase tracking-wider">{cat.label}</span>
                    </div>
                    <span className="font-oswald text-2xl font-bold" style={{ color: cat.color }}>{cat.count}</span>
                  </div>
                  <p className="font-inter text-xs text-black/40 uppercase tracking-wider mb-3">{cat.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tools.map((t, j) => (
                      <span key={j} className="font-inter text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 border border-black/10 text-black/50 group-hover:border-black/20 transition-colors">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: All Tools Pill Grid ── */}
      <div className="bg-[#0a0a0a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF87] block mb-3">FULL ARSENAL</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase text-white leading-[0.9]">
                EVERY TOOL.<br /><span className="text-gradient-cyber">RIGHT HERE.</span>
              </h2>
            </div>
            <Link to="/features"
              className="inline-flex items-center gap-2 bg-[#F9FF00] border-[3px] border-[#F9FF00] px-6 py-3 font-oswald text-[10px] font-bold uppercase tracking-widest text-black hover:bg-white transition-all duration-200 w-fit">
              OPEN WORKBENCH <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "JSON Formatter", color: "#059669" },
              { name: "Regex Tester", color: "#E11D48" },
              { name: "JWT Decoder", color: "#9333EA" },
              { name: "CSS Minifier", color: "#0891B2" },
              { name: "Diff Checker", color: "#7C3AED" },
              { name: "Base64 Encoder", color: "#0284C7" },
              { name: "Color Converter", color: "#8B5CF6" },
              { name: "Color Palette Gen", color: "#F9FF00" },
              { name: "Hash Generator", color: "#166534" },
              { name: "UUID Generator", color: "#9333EA" },
              { name: "URL Encoder", color: "#4F46E5" },
              { name: "Image to Base64", color: "#2563EB" },
              { name: "Number Base Conv.", color: "#FF0004" },
              { name: "Text File Maker", color: "#F9FF00" },
              { name: "Markdown Editor", color: "#FF0004" },
              { name: "Word Counter", color: "#7C3AED" },
              { name: "Lorem Ipsum", color: "#D97706" },
              { name: "Pomodoro Timer", color: "#FF0004" },
              { name: "Text Case Conv.", color: "#00FF87" },
              { name: "Password Generator", color: "#DC2626" },
              { name: "QR Code Generator", color: "#1a1a1a" },
              { name: "Unit Converter", color: "#0891B2" },
              { name: "Calculator", color: "#1a1a1a" },
              { name: "Timestamp Conv.", color: "#00E5FF" },
              { name: "Aspect Ratio Calc", color: "#D97706" },
              { name: "Cron Builder", color: "#059669" },
              { name: "Code Editor", color: "#1a1a1a" },
              { name: "Clef AI", color: "#7C3AED" },
            ].map(({ name, color }, i) => (
              <div key={i}
                className="hero-tool-pill flex items-center gap-2 border border-white/10 px-3 py-2 hover:border-white/30 hover:bg-white/5 transition-all duration-150 cursor-default group">
                <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: color }} />
                <span className="font-oswald text-[10px] font-bold uppercase tracking-wider text-white/60 group-hover:text-white/90 transition-colors">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION: Built Different ── */}
      <div className="bg-[#F9FF00] border-b-[3px] border-black overflow-hidden relative">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">WHY CLEF</span>
              <h2 className="font-oswald text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em] mb-6 text-black">
                NO ADS.<br />NO TRACKING.<br /><span className="text-outline-black">NO BS.</span>
              </h2>
              <p className="font-inter text-sm text-black/65 leading-relaxed max-w-sm">
                Most utility sites are ad farms in disguise. Clef is different — it's a personal project built for real use, not for monetization. The code is open, the tools are free, and your data stays yours.
              </p>
            </div>
            <div className="flex flex-col gap-0 border-[3px] border-black bg-white">
              {[
                { them: "Ads everywhere",     us: "Zero ads, ever",           color: "#00FF87" },
                { them: "Paywalled features", us: "Everything free, always",  color: "#00E5FF" },
                { them: "Data harvesting",    us: "Local-only processing",    color: "#7C3AED" },
                { them: "Bloated interfaces", us: "Brutalist, fast, focused", color: "#F9FF00" },
                { them: "Closed source",      us: "MIT licensed on GitHub",   color: "#FF0004" },
              ].map((row, i) => (
                <div key={i} className="hero-compare-row grid grid-cols-2 border-b-[3px] border-black last:border-b-0">
                  <div className="px-4 py-3 border-r-[3px] border-black flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#FF0004] rounded-full flex-shrink-0" />
                    <span className="font-inter text-xs text-black/40 line-through decoration-[#FF0004]">{row.them}</span>
                  </div>
                  <div className="px-4 py-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: row.color }} />
                    <span className="font-inter text-xs font-semibold text-black">{row.us}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 font-oswald text-[160px] md:text-[220px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">FREE</div>
      </div>

      {/* ── SECTION: AI Assistant spotlight ── */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="hero-chat lg:border-r-[3px] lg:border-black lg:pr-16 pb-12 lg:pb-0">
              <div className="border-[3px] border-black bg-white shadow-apple max-w-sm">
                <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b-[3px] border-black">
                  <div className="w-2 h-2 bg-[#F9FF00] rounded-full animate-pulse" />
                  <span className="font-oswald text-xs font-bold uppercase tracking-widest text-[#F9FF00]">CLEF AI</span>
                  <span className="ml-auto font-inter text-[9px] text-white/30 uppercase">LLAMA 3.1 • GROQ</span>
                </div>
                <div className="p-4 space-y-3 bg-[#fafafa]">
                  <div className="flex justify-end">
                    <div className="bg-[#F9FF00] border-[2px] border-black px-3 py-2 max-w-[80%]">
                      <p className="font-inter text-[11px] font-medium">Can you explain what a JWT token is?</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border-[2px] border-black px-3 py-2 max-w-[85%]">
                      <p className="font-inter text-[11px] leading-relaxed text-black/80">
                        A JWT (JSON Web Token) is a compact, URL-safe token with three parts: <span className="font-semibold text-[#7C3AED]">header</span>, <span className="font-semibold text-[#00E5FF]">payload</span>, and <span className="font-semibold text-[#00FF87]">signature</span> — separated by dots.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#F9FF00] border-[2px] border-black px-3 py-2 max-w-[80%]">
                      <p className="font-inter text-[11px] font-medium">Can you decode this one for me?</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border-[2px] border-black px-3 py-2 max-w-[85%]">
                      <p className="font-inter text-[11px] leading-relaxed text-black/80">
                        Sure! Or even better — use the <span className="font-semibold text-[#FF0004]">JWT Decoder</span> tool in Clef. Paste your token and see the header, payload, and expiry instantly.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border-[2px] border-black px-4 py-3 flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-black/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t-[3px] border-black px-3 py-2 flex items-center gap-2 bg-white">
                  <span className="font-inter text-[10px] text-black/25 flex-1 uppercase tracking-wider">Ask anything...</span>
                  <div className="w-7 h-7 bg-[#F9FF00] border-[2px] border-black flex items-center justify-center">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-ai-right lg:pl-16 flex flex-col justify-center">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C3AED] block mb-4">BUILT-IN AI</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase leading-[0.9] tracking-[-0.03em] mb-6">
                CLEF AI.<br /><span className="text-gradient-purple">YOUR LOGIC ENGINE.</span>
              </h2>
              <p className="font-inter text-sm text-black/55 leading-relaxed mb-8 max-w-sm">
                Powered by Llama 3.1 via Groq. Ask it to debug code, explain concepts, generate content, or help with any task. No API key needed — it just works.
              </p>
              <div className="flex flex-col gap-0 border-[3px] border-black mb-8">
                {[
                  { label: "Model",      val: "Llama 3.1",           color: "#7C3AED" },
                  { label: "Provider",   val: "Groq (fast inference)", color: "#00E5FF" },
                  { label: "History",    val: "Local + cloud sync",   color: "#00FF87" },
                  { label: "Rate limit", val: "10–20 req/hr free",    color: "#F9FF00" },
                  { label: "API key",    val: "Not required",         color: "#00FF87" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2 border-b-[3px] border-black last:border-b-0">
                    <div className="px-4 py-2.5 border-r-[3px] border-black">
                      <span className="font-oswald text-[10px] font-bold uppercase tracking-wider text-black/40">{row.label}</span>
                    </div>
                    <div className="px-4 py-2.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: row.color }} />
                      <span className="font-inter text-xs font-semibold text-black">{row.val}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const btn = document.querySelector<HTMLButtonElement>("[aria-label='Clef AI']") ||
                    document.querySelector<HTMLButtonElement>(".fixed.right-4");
                  btn?.click();
                }}
                className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-white border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm px-7 py-3 hover:bg-[#7C3AED] transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-glow-purple hover:-translate-y-0.5 w-fit">
                TRY CLEF AI
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: Testimonials / Community ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="mb-12">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#F9FF00] block mb-3">COMMUNITY</span>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase text-white leading-[0.9]">
              ENGINEERED FOR UTILITY.<br /><span className="text-outline-white">BUILT FOR PRECISION.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[3px] border-white/10">
            {[
              {
                title: "RADICAL PRIVACY",
                desc: "We don't just 'value' privacy; we architect for it. No data ever leaves your device because there are no servers to receive it.",
                tag: "SECURITY",
                color: "#F9FF00",
                Icon: Shield,
              },
              {
                title: "BLISTERING SPEED",
                desc: "Tools should be extensions of your mind. We optimize for sub-100ms load times, ensuring your workflow remains uninterrupted.",
                tag: "PERFORMANCE",
                color: "#00E5FF",
                Icon: Zap,
              },
              {
                title: "RADICAL OPENNESS",
                desc: "Transparency is the bedrock of trust. Every line of Clef's source code is public, auditable, and open for contribution.",
                tag: "TRANSPARENCY",
                color: "#00FF87",
                Icon: Globe,
              },
            ].map((p, i) => (
              <div key={i}
                className="hero-testimonial p-8 border-b-[3px] md:border-b-0 md:border-r-[3px] border-white/10 last:border-0 group hover:bg-white/5 transition-colors duration-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 border-[2px] flex items-center justify-center" style={{ borderColor: p.color + "40" }}>
                    <p.Icon size={18} style={{ color: p.color }} />
                  </div>
                  <span className="font-oswald text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-white/10 text-white/30">{p.tag}</span>
                </div>
                <h3 className="font-oswald text-xl font-bold uppercase text-white mb-4 tracking-tight">{p.title}</h3>
                <p className="font-inter text-sm text-white/50 leading-relaxed mb-6">{p.desc}</p>
                <div className="w-8 h-1" style={{ background: p.color }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION: Design System Showcase ── */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="mb-12">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C3AED] block mb-4">DESIGN LANGUAGE</span>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase leading-[0.9] tracking-[-0.03em]">
              BRUTALIST.<br /><span className="text-gradient-purple">INTENTIONAL.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[3px] border-black">
            {/* Color palette */}
            <div className="border-b-[3px] md:border-b-0 md:border-r-[3px] border-black p-8">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.25em] text-black/40 block mb-6">COLOR SYSTEM</span>
              <div className="flex flex-col gap-0 border-[3px] border-black">
                {[
                  { name: "YELLOW", hex: "#F9FF00", role: "Primary / CTA" },
                  { name: "RED",    hex: "#FF0004", role: "Danger / Accent" },
                  { name: "CYAN",   hex: "#00E5FF", role: "Info / Tech" },
                  { name: "GREEN",  hex: "#00FF87", role: "Success / Open" },
                  { name: "PURPLE", hex: "#7C3AED", role: "AI / Premium" },
                  { name: "BLACK",  hex: "#1a1a1a", role: "Base / Structure" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center border-b-[3px] border-black last:border-b-0">
                    <div className="w-12 h-12 border-r-[3px] border-black flex-shrink-0" style={{ background: c.hex }} />
                    <div className="px-4 flex-1 flex items-center justify-between">
                      <span className="font-oswald text-xs font-bold uppercase tracking-wider">{c.name}</span>
                      <span className="font-mono text-[10px] text-black/40">{c.hex}</span>
                      <span className="font-inter text-[9px] uppercase tracking-wider text-black/30 hidden sm:block">{c.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Typography */}
            <div className="p-8">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.25em] text-black/40 block mb-6">TYPOGRAPHY</span>
              <div className="flex flex-col gap-6">
                <div>
                  <span className="font-inter text-[9px] uppercase tracking-widest text-black/30 block mb-2">DISPLAY — OSWALD 700</span>
                  <div className="font-oswald text-5xl font-bold uppercase leading-none tracking-[-0.04em]">CLEF</div>
                </div>
                <div>
                  <span className="font-inter text-[9px] uppercase tracking-widest text-black/30 block mb-2">HEADING — OSWALD 400</span>
                  <div className="font-oswald text-2xl font-normal uppercase tracking-[0.08em]">WORKBENCH TOOLS</div>
                </div>
                <div>
                  <span className="font-inter text-[9px] uppercase tracking-widest text-black/30 block mb-2">BODY — INTER 400</span>
                  <div className="font-inter text-sm text-black/70 leading-relaxed">Purpose-built utilities for developers and creators. Fast, private, and permanently free.</div>
                </div>
                <div>
                  <span className="font-inter text-[9px] uppercase tracking-widest text-black/30 block mb-2">LABEL — OSWALD 700 TRACKED</span>
                  <div className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">SECTION LABEL STYLE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: Tech Stack ── */}
      <div className="bg-[#0a0a0a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            <div className="lg:border-r-[3px] lg:border-white/10 lg:pr-16 pb-12 lg:pb-0">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF] block mb-4">UNDER THE HOOD</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase text-white leading-[0.9] tracking-[-0.03em] mb-6">
                MODERN STACK.<br /><span className="text-gradient-cyber">ZERO BLOAT.</span>
              </h2>
              <p className="font-inter text-sm text-white/55 leading-relaxed max-w-sm">
                Built with React 19, TypeScript, Vite, Tailwind, and GSAP. Deployed on the edge. Every dependency is justified — nothing is there for show.
              </p>
            </div>
            <div className="lg:pl-16 grid grid-cols-2 gap-0 border-[3px] border-white/10">
              {[
                { name: "React 19",    role: "UI Framework",     color: "#00E5FF" },
                { name: "TypeScript",  role: "Type Safety",      color: "#0284C7" },
                { name: "Vite 7",      role: "Build Tool",       color: "#F9FF00" },
                { name: "Tailwind 3",  role: "Styling",          color: "#00E5FF" },
                { name: "GSAP 3",      role: "Animations",       color: "#00FF87" },
                { name: "Convex",      role: "Backend / DB",     color: "#FF0004" },
                { name: "Groq / Llama","role": "AI Inference",   color: "#7C3AED" },
                { name: "Lenis",       role: "Smooth Scroll",    color: "#F9FF00" },
              ].map((tech, i) => (
                <div key={i}
                  className="border-b-[3px] border-r-[3px] border-white/10 last:border-r-0 p-5 group hover:bg-white/5 transition-colors duration-150">
                  <div className="w-1.5 h-1.5 rotate-45 mb-3" style={{ background: tech.color }} />
                  <div className="font-oswald text-sm font-bold uppercase tracking-tight text-white mb-1">{tech.name}</div>
                  <div className="font-inter text-[9px] uppercase tracking-widest text-white/30">{tech.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: CTA Banner ── */}
      <div className="bg-[#F9FF00] border-b-[3px] border-black relative overflow-hidden">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-3">GET STARTED</span>
              <h2 className="font-oswald text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black">
                OPEN YOUR<br />FIRST TOOL.<br /><span className="text-outline-black">RIGHT NOW.</span>
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={scrollToTools}
                className="group bg-[#1a1a1a] text-[#F9FF00] border-[3px] border-[#1a1a1a] font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-4 hover:bg-white hover:text-black transition-all duration-200 shadow-[6px_6px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1">
                EXPLORE ALL TOOLS
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="https://github.com/sah-rohit/Clef" target="_blank" rel="noopener noreferrer"
                className="group border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-4 hover:bg-black hover:text-[#F9FF00] transition-all duration-200">
                VIEW ON GITHUB
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-8 -left-8 font-oswald text-[200px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">GO</div>
      </div>

      <HorizontalSlides magneticWrap={magneticWrap} activeSlide={activeSlide} slide={slide} />
      
      <ZoomSection />
      
      <FinalSection />

    </section>
  );
}

// ── NEW COMPONENT: Horizontal Slides Container ──
function HorizontalSlides({ 
  magneticWrap, 
  activeSlide, 
  slide 
}: { 
  magneticWrap: React.RefObject<HTMLDivElement | null>; 
  activeSlide: number;
  slide: typeof SLIDES[0];
}) {
  return (
    <div
      ref={magneticWrap}
      className="relative overflow-hidden flex"
      style={{ height: "100vh", width: "100%", background: "#0a0a0a" }}
    >
      {SLIDES.map((s, idx) => (
        <div
          key={s.id}
          className="horizontal-slide relative flex-shrink-0 w-full h-full flex items-center px-8 md:px-16 lg:px-24"
          style={{ background: s.bg }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05 }}>
            {s.pattern === "dots" && (
              <div style={{ backgroundImage: `radial-gradient(${s.accent} 1px, transparent 0)`, backgroundSize: "40px 40px", width: "100%", height: "100%" }} />
            )}
            {s.pattern === "grid" && (
              <div style={{ backgroundImage: `linear-gradient(${s.accent} 1px, transparent 1px), linear-gradient(90deg, ${s.accent} 1px, transparent 1px)`, backgroundSize: "60px 60px", width: "100%", height: "100%" }} />
            )}
            {s.pattern === "diagonal" && (
              <div style={{ backgroundImage: `repeating-linear-gradient(45deg, ${s.accent} 0, ${s.accent} 1px, transparent 0, transparent 50%)`, backgroundSize: "24px 24px", width: "100%", height: "100%" }} />
            )}
            {s.pattern === "hex" && (
              <div style={{ backgroundImage: `radial-gradient(${s.accent} 1.5px, transparent 0)`, backgroundSize: "32px 32px", width: "100%", height: "100%" }} />
            )}
            {s.pattern === "noise" && (
              <div style={{ backgroundImage: `repeating-linear-gradient(0deg, ${s.accent} 0, ${s.accent} 1px, transparent 0, transparent 8px), repeating-linear-gradient(90deg, ${s.accent} 0, ${s.accent} 1px, transparent 0, transparent 8px)`, width: "100%", height: "100%" }} />
            )}
            {s.pattern === "circuit" && (
              <div style={{ backgroundImage: `linear-gradient(${s.accent} 1px, transparent 1px), linear-gradient(90deg, ${s.accent} 1px, transparent 1px)`, backgroundSize: "80px 80px", width: "100%", height: "100%" }} />
            )}
          </div>

          {/* Slide counter */}
          <div className="absolute top-8 right-8 z-20 pointer-events-none flex items-center gap-3">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-widest" style={{ color: s.accent + "80" }}>
              {String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] block mb-6" style={{ color: s.accent + "80" }}>
                {s.eyebrow}
              </span>
              <h2 className="font-oswald font-bold uppercase leading-[0.88] tracking-[-0.04em] mb-8 text-white" style={{ fontSize: "clamp(2.4rem, 6vw, 6rem)" }}>
                {s.title.map((line, i) => (
                  <span key={i} className="block">
                    {i === s.titleAccent ? <span className={s.accentClass}>{line}</span> : line}
                  </span>
                ))}
              </h2>
              <p className="font-inter text-sm md:text-base leading-relaxed mb-10 max-w-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
                {s.body}
              </p>
              <div className="inline-flex items-center gap-4 border-[2px] px-5 py-3" style={{ borderColor: s.accent + "40" }}>
                <span className="font-oswald text-2xl font-bold" style={{ color: s.accent }}>{s.stat.val}</span>
                <div className="w-px h-6" style={{ background: s.accent + "30" }} />
                <span className="font-oswald text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>{s.stat.label}</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center border-[3px] relative overflow-hidden" style={{ borderColor: s.accent + "20", background: s.accent + "05", height: "360px" }}>
              <SlideVisual type={s.visual} accent={s.accent} />
              <div className="absolute top-0 left-0 w-8 h-8 border-r-[3px] border-b-[3px]" style={{ borderColor: s.accent + "40" }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-l-[3px] border-t-[3px]" style={{ borderColor: s.accent + "40" }} />
            </div>
          </div>
          
          <div className="absolute bottom-6 right-8 font-oswald font-bold leading-none select-none pointer-events-none" style={{ fontSize: "clamp(80px, 15vw, 160px)", color: "rgba(255,255,255,0.025)" }}>
            {s.num}
          </div>
        </div>
      ))}

      {/* Persistent UI overlays */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.3)" }}>
          SCROLL TO EXPLORE
        </span>
        <div className="mt-1 w-8 h-px" style={{ background: "rgba(255,255,255,0.2)" }} />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, i) => (
          <div key={i} className="transition-all duration-400"
            style={{
              width: i === activeSlide ? "24px" : "6px",
              height: "6px",
              background: i === activeSlide ? slide.accent : "rgba(255,255,255,0.25)",
              transform: i === activeSlide ? "none" : "rotate(45deg)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── NEW COMPONENT: Zoom & Future Sections ──
function ZoomSection() {
  return (
    <div className="zoom-section relative h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center border-t-[3px] border-black">
      {/* Background layer (deep zoom) */}
      <div className="zoom-layer absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center">
        <h2 className="font-oswald text-[12vw] md:text-[18vw] font-bold uppercase text-white/10 leading-none tracking-tighter select-none">
          CLEF
        </h2>
      </div>

      {/* Middle layer (moving through) */}
      <div className="zoom-layer absolute inset-0 flex flex-col items-center justify-center z-20 p-6 text-center">
        <h2 className="font-oswald text-6xl md:text-[10rem] font-bold uppercase text-white leading-none tracking-tighter">
          BEYOND<br /><span className="text-outline-white">LIMITS.</span>
        </h2>
      </div>

      {/* Front layer (final focus) */}
      <div className="zoom-layer absolute inset-0 flex flex-col items-center justify-center z-30 p-6 text-center">
        <div className="max-w-2xl bg-black/40 backdrop-blur-sm border-[3px] border-white/10 p-8 md:p-12">
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#F9FF00] block mb-6">NEXT GENERATION</span>
          <h3 className="font-oswald text-4xl md:text-6xl font-bold uppercase text-white mb-8">
            A NEW STANDARD FOR<br /><span className="text-gradient-yellow">PRODUCTIVITY.</span>
          </h3>
          <p className="font-inter text-sm md:text-base text-white/50 leading-relaxed mb-10">
            Clef is evolving. More tools, deeper integrations, and uncompromising performance. 
            All while maintaining the privacy-first, local-only architecture you trust.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Fast", icon: Zap, color: "#F9FF00" },
              { label: "Private", icon: Shield, color: "#00E5FF" },
              { label: "Free", icon: Star, color: "#00FF87" },
              { label: "Open", icon: Code, color: "#FF0004" },
            ].map((t, i) => (
              <div key={i} className="border border-white/10 p-4 flex flex-col items-center gap-3 group hover:bg-white/5 transition-colors">
                <t.icon size={16} style={{ color: t.color }} />
                <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "60px 60px", width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

function FinalSection() {
  return (
    <div className="relative py-24 bg-white border-t-[3px] border-black overflow-hidden">
      <div className="px-6 md:px-12 lg:px-16 flex flex-col items-center text-center">
        <div className="w-16 h-16 border-[4px] border-black flex items-center justify-center mb-8 bg-[#F9FF00] rotate-45">
          <Rocket className="-rotate-45" size={32} />
        </div>
        <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em] mb-8 text-black max-w-4xl">
          START BUILDING YOUR<br /><span className="text-gradient-fire">PERFECT WORKFLOW.</span>
        </h2>
        <p className="font-inter text-base md:text-lg text-black/60 leading-relaxed mb-12 max-w-2xl font-medium">
          No signups, no credit cards, no barriers. Just open a tool and start creating. 
          Your productivity shouldn't be locked behind a paywall.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/features" className="group bg-[#F9FF00] border-[4px] border-black font-oswald font-bold uppercase tracking-widest text-lg px-10 py-5 hover:bg-black hover:text-[#F9FF00] transition-all duration-200 shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
            OPEN THE WORKBENCH
          </Link>
        </div>
      </div>
      <div className="absolute -bottom-20 -left-20 font-oswald text-[250px] font-bold text-black/[0.02] leading-none select-none pointer-events-none uppercase">CLEF</div>
    </div>
  );
}
