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

  const scrollToTools = () => navigate("/tools");

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
            snap: {
              snapTo: 1 / (totalSlides - 1),
              duration: { min: 0.4, max: 0.6 },
              delay: 0.1,
              ease: "power1.inOut"
            },
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
              snap: {
                snapTo: [0, 0.5, 1],
                duration: { min: 0.4, max: 0.6 },
                delay: 0.1,
                ease: "power2.inOut"
              }
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
      <div className="border-t-[3px] border-b-[3px] border-black bg-[#1a1a1a] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex items-center">
              {[
                { text: "28 FREE TOOLS", color: "#F9FF00" },
                { text: "ZERO ADS", color: "#FF0004" },
                { text: "PRIVACY FIRST", color: "#00E5FF" },
                { text: "OPEN SOURCE", color: "#00FF87" },
                { text: "WORKS OFFLINE", color: "#7C3AED" },
                { text: "AI POWERED", color: "#F9FF00" },
                { text: "NO SIGN-UP NEEDED", color: "#00E5FF" },
                { text: "BRUTALIST DESIGN", color: "#FF0004" },
                { text: "BUILT FOR CREATORS", color: "#00FF87" },
                { text: "ALWAYS FREE", color: "#7C3AED" },
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-4 mx-6">
                  <span className="font-oswald text-sm font-bold uppercase tracking-widest" style={{ color: item.color }}>{item.text}</span>
                  <span className="w-1.5 h-1.5 rotate-45 inline-block flex-shrink-0" style={{ background: item.color }} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── SECTION: Live Metrics — vibrant yellow bg ── */}
      <div className="bg-[#F9FF00] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-3">BY THE NUMBERS</span>
              <h2 className="font-oswald text-4xl md:text-6xl font-bold uppercase text-black leading-[0.88] tracking-[-0.03em]">
                BUILT TO LAST.<br /><span className="text-outline-black">NUMBERS PROVE IT.</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 border-[2px] border-black px-4 py-2 bg-black/5">
              <Activity size={12} className="text-black/60" />
              <span className="font-inter text-[10px] uppercase tracking-widest text-black/50">All metrics verified</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-[3px] border-black bg-white">
            {[
              { val: "28+",  label: "Tools Available",  sub: "& growing",         color: "#FF0004", Icon: Layers },
              { val: "100%", label: "Browser-side",     sub: "zero server calls", color: "#7C3AED", Icon: Cpu },
              { val: "0ms",  label: "Data Transmitted", sub: "to our servers",    color: "#00E5FF", Icon: Lock },
              { val: "∞",    label: "Free Usage",       sub: "no limits ever",    color: "#00FF87", Icon: Infinity },
            ].map(({ val, label, sub, color, Icon }, i) => (
              <div key={i}
                className="hero-metric border-b-[3px] md:border-b-0 border-r-[3px] border-black last:border-r-0 p-8 md:p-10 group hover:bg-[#fafafa] transition-colors duration-200 relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)` }} />
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <Icon size={18} style={{ color }} />
                  <span className="font-inter text-[9px] uppercase tracking-widest text-black/20">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="font-oswald text-5xl md:text-6xl font-bold leading-none mb-2 relative z-10" style={{ color }}>{val}</div>
                <div className="font-oswald text-xs font-bold uppercase tracking-wider text-black/70 mb-1 relative z-10">{label}</div>
                <div className="font-inter text-[9px] uppercase tracking-widest text-black/35 relative z-10">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION: How It Works — white bg, Apple-style large steps ── */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="text-center mb-16">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF87] block mb-4">WORKFLOW</span>
            <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase text-black leading-[0.88] tracking-[-0.04em]">
              THREE STEPS.<br /><span className="text-gradient-cyber">ZERO FRICTION.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[3px] border-black">
            {[
              { num: "01", color: "#F9FF00", bg: "#F9FF00", title: "PICK A TOOL", desc: "Browse 28 tools by category or search by name. Every tool is one click away from the homepage.", detail: "No account. No loading screen. Just click." },
              { num: "02", color: "#00E5FF", bg: "#00E5FF", title: "DO YOUR WORK", desc: "Paste, type, upload — whatever the tool needs. All processing happens locally in your browser.", detail: "Your data never leaves your device." },
              { num: "03", color: "#00FF87", bg: "#00FF87", title: "EXPORT & GO", desc: "Download your result as a file, copy to clipboard, or share a link. Done in seconds.", detail: "No cloud upload. No waiting. Instant." },
            ].map((step, i) => (
              <div key={i}
                className="hero-step border-b-[3px] md:border-b-0 md:border-r-[3px] border-black last:border-0 group relative overflow-hidden">
                {/* Color accent top bar */}
                <div className="h-2 w-full" style={{ background: step.bg }} />
                <div className="p-10 md:p-12">
                  <div className="font-oswald text-[80px] md:text-[100px] font-bold leading-none mb-6 opacity-[0.07]" style={{ color: step.color }}>{step.num}</div>
                  <div className="w-14 h-14 border-[3px] flex items-center justify-center font-oswald text-2xl font-bold mb-8 -mt-16 relative z-10 group-hover:scale-105 transition-transform duration-300"
                    style={{ color: "#1a1a1a", borderColor: step.color, background: step.bg }}>
                    {step.num}
                  </div>
                  <h3 className="font-oswald text-2xl font-bold uppercase tracking-tight mb-4">{step.title}</h3>
                  <p className="font-inter text-sm text-black/55 leading-relaxed mb-6">{step.desc}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rotate-45 flex-shrink-0" style={{ background: step.color }} />
                    <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/50">{step.detail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Link to="/tools"
              className="group inline-flex items-center gap-3 border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5">
              SEE FULL GUIDE <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── SECTION: Feature Cards — dark bg for contrast after white ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="mb-16">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-4">WHAT MAKES CLEF DIFFERENT</span>
            <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white">
              PREMIUM FEATURES.<br /><span className="text-gradient-fire">ZERO PRICE TAG.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-[3px] border-white/10">
            {[
              { Icon: Zap,      color: "#F9FF00", title: "INSTANT EVERYTHING",   desc: "Sub-100ms tool opens. Pre-compiled bundles. No lazy loading. No splash screens. Click and it's there.",                                    tag: "PERFORMANCE" },
              { Icon: Lock,     color: "#00E5FF", title: "ZERO-KNOWLEDGE ARCH",  desc: "Every computation runs in your browser's sandbox. We have no server that receives your data — by design.",                                  tag: "PRIVACY"     },
              { Icon: WifiOff,  color: "#00FF87", title: "OFFLINE FIRST PWA",    desc: "Install Clef as a PWA. After first load, every tool works without internet. Service worker cached.",                                        tag: "OFFLINE"     },
              { Icon: Sparkles, color: "#7C3AED", title: "AI BUILT IN",          desc: "Llama 3.1 via Groq. Ask it anything — debug code, explain concepts, generate content. No API key needed.",                                  tag: "AI"          },
              { Icon: Code,     color: "#FF0004", title: "OPEN SOURCE MIT",      desc: "Every line of code is public on GitHub. Fork it, audit it, contribute. Trust through radical transparency.",                                tag: "OPEN SOURCE" },
              { Icon: Crown,    color: "#F9FF00", title: "BRUTALIST DESIGN",     desc: "No rounded corners. No gradients. No shadows. Pure brutalist UI — fast, focused, and unapologetically bold.",                               tag: "DESIGN"      },
            ].map(({ Icon, color, title, desc, tag }, i) => (
              <div key={i}
                className="hero-feature-card border-b-[3px] border-r-[3px] border-white/10 last:border-r-0 p-8 md:p-10 group hover:bg-white/5 transition-all duration-300 relative overflow-hidden">
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${color}12 0%, transparent 60%)` }} />
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-12 h-12 flex items-center justify-center border-[2px] group-hover:scale-110 transition-transform duration-300"
                    style={{ borderColor: color + "40", background: color + "10" }}>
                    <Icon size={20} style={{ color }} />
                  </div>
                  <span className="font-oswald text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-white/10 text-white/25">{tag}</span>
                </div>
                <h3 className="font-oswald text-xl font-bold uppercase tracking-tight mb-4 text-white relative z-10">{title}</h3>
                <p className="font-inter text-sm text-white/45 leading-relaxed relative z-10">{desc}</p>
                <div className="mt-8 flex items-center gap-2 relative z-10">
                  <div className="w-6 h-[2px]" style={{ background: color }} />
                  <span className="font-oswald text-[9px] font-bold uppercase tracking-widest" style={{ color: color + "80" }}>{tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION: What's Inside — cyan bg ── */}
      <div className="bg-[#00E5FF] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="lg:border-r-[3px] lg:border-black lg:pr-16 pb-12 lg:pb-0 flex flex-col justify-center">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">THE TOOLSET</span>
              <h2 className="font-oswald text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em] mb-6 text-black">
                28 TOOLS.<br />3 CATEGORIES.<br /><span className="text-outline-black">INFINITE USES.</span>
              </h2>
              <p className="font-inter text-sm text-black/65 leading-relaxed max-w-sm mb-8">
                From JSON formatting to QR codes, from regex testing to color palettes — every tool is purpose-built, distraction-free, and permanently free.
              </p>
              <Link to="/tools"
                className="group inline-flex items-center gap-3 bg-black text-[#00E5FF] border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm px-7 py-3 hover:bg-white hover:text-black transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 w-fit">
                BROWSE ALL TOOLS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="lg:pl-16 flex flex-col gap-3">
              {[
                { label: "DEVELOPER",    count: 13, color: "#1a1a1a", bg: "#F9FF00", tools: ["JSON Formatter", "Regex Tester", "JWT Decoder", "CSS Minifier", "Diff Checker", "Base64", "+7 more"], desc: "Code, format, debug, convert." },
                { label: "PRODUCTIVITY", count: 7,  color: "#1a1a1a", bg: "#FF0004", tools: ["Text File Maker", "Markdown Editor", "Word Counter", "Lorem Ipsum", "Pomodoro", "Text Case", "+1 more"], desc: "Write, edit, focus, ship." },
                { label: "UTILITY",      count: 8,  color: "#1a1a1a", bg: "#7C3AED", tools: ["Password Gen", "QR Code", "Unit Converter", "Calculator", "Timestamp", "Aspect Ratio", "+2 more"], desc: "Convert, generate, measure." },
              ].map((cat, i) => (
                <div key={i}
                  className="hero-cat group border-[3px] border-black bg-white p-6 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-default">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center border-[2px] border-black" style={{ background: cat.bg }}>
                        <span className="font-oswald text-[10px] font-bold text-black">{cat.count}</span>
                      </div>
                      <span className="font-oswald text-lg font-bold uppercase tracking-wider text-black">{cat.label}</span>
                    </div>
                    <span className="font-inter text-[9px] uppercase tracking-widest text-black/40">{cat.desc}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tools.map((t, j) => (
                      <span key={j} className="font-inter text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 border border-black/15 text-black/60 group-hover:border-black/30 transition-colors">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: All Tools Pill Grid — dark bg ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF87] block mb-3">FULL ARSENAL</span>
              <h2 className="font-oswald text-4xl md:text-6xl font-bold uppercase text-white leading-[0.88] tracking-[-0.03em]">
                EVERY TOOL.<br /><span className="text-gradient-cyber">RIGHT HERE.</span>
              </h2>
            </div>
            <Link to="/tools"
              className="inline-flex items-center gap-2 bg-[#F9FF00] border-[3px] border-[#F9FF00] px-6 py-3 font-oswald text-[10px] font-bold uppercase tracking-widest text-black hover:bg-white transition-all duration-200 w-fit shadow-[4px_4px_0px_rgba(249,255,0,0.3)]">
              OPEN WORKBENCH <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { name: "JSON Formatter",    color: "#00FF87" },
              { name: "Regex Tester",      color: "#FF0004" },
              { name: "JWT Decoder",       color: "#7C3AED" },
              { name: "CSS Minifier",      color: "#00E5FF" },
              { name: "Diff Checker",      color: "#F9FF00" },
              { name: "Base64 Encoder",    color: "#00E5FF" },
              { name: "Color Converter",   color: "#7C3AED" },
              { name: "Color Palette Gen", color: "#F9FF00" },
              { name: "Hash Generator",    color: "#00FF87" },
              { name: "UUID Generator",    color: "#7C3AED" },
              { name: "URL Encoder",       color: "#00E5FF" },
              { name: "Image to Base64",   color: "#00FF87" },
              { name: "Number Base Conv.", color: "#FF0004" },
              { name: "Text File Maker",   color: "#F9FF00" },
              { name: "Markdown Editor",   color: "#FF0004" },
              { name: "Word Counter",      color: "#7C3AED" },
              { name: "Lorem Ipsum",       color: "#00E5FF" },
              { name: "Pomodoro Timer",    color: "#FF0004" },
              { name: "Text Case Conv.",   color: "#00FF87" },
              { name: "Password Generator",color: "#FF0004" },
              { name: "QR Code Generator", color: "#F9FF00" },
              { name: "Unit Converter",    color: "#00E5FF" },
              { name: "Calculator",        color: "#00FF87" },
              { name: "Timestamp Conv.",   color: "#00E5FF" },
              { name: "Aspect Ratio Calc", color: "#F9FF00" },
              { name: "Cron Builder",      color: "#00FF87" },
              { name: "Code Editor",       color: "#7C3AED" },
              { name: "Clef AI",           color: "#7C3AED" },
            ].map(({ name, color }, i) => (
              <div key={i}
                className="hero-tool-pill flex items-center gap-2 border border-white/10 px-3 py-2 hover:border-current hover:bg-white/5 transition-all duration-150 cursor-default group"
                style={{ "--hover-color": color } as React.CSSProperties}>
                <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: color }} />
                <span className="font-oswald text-[10px] font-bold uppercase tracking-wider text-white/55 group-hover:text-white/90 transition-colors">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION: Privacy Architecture — green bg ── */}
      <div className="bg-[#00FF87] border-b-[3px] border-black relative overflow-hidden">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">PRIVACY ARCHITECTURE</span>
              <h2 className="font-oswald text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em] mb-6 text-black">
                YOUR DATA.<br />YOUR DEVICE.<br /><span className="text-outline-black">YOUR RULES.</span>
              </h2>
              <p className="font-inter text-sm text-black/65 leading-relaxed max-w-sm">
                We didn't add a privacy policy as an afterthought. We built the architecture so there's nothing to collect. No server, no database, no telemetry — just your browser doing the work.
              </p>
            </div>
            <div className="flex flex-col gap-0 border-[3px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              {[
                { label: "Data sent to servers",  val: "0 bytes",       color: "#00FF87" },
                { label: "Cookies set",           val: "None",          color: "#00E5FF" },
                { label: "Analytics trackers",    val: "Zero",          color: "#7C3AED" },
                { label: "Third-party scripts",   val: "Not loaded",    color: "#F9FF00" },
                { label: "Processing location",   val: "Your browser",  color: "#00FF87" },
                { label: "Account required",      val: "Never",         color: "#FF0004" },
              ].map((row, i) => (
                <div key={i} className="hero-compare-row grid grid-cols-2 border-b-[3px] border-black last:border-b-0">
                  <div className="px-4 py-3.5 border-r-[3px] border-black flex items-center gap-2">
                    <span className="font-inter text-xs text-black/50">{row.label}</span>
                  </div>
                  <div className="px-4 py-3.5 flex items-center gap-2">
                    <div className="w-2 h-2 rotate-45 flex-shrink-0" style={{ background: row.color }} />
                    <span className="font-inter text-xs font-bold text-black">{row.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 -right-4 font-oswald text-[160px] md:text-[220px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">SAFE</div>
      </div>

      {/* ── SECTION: AI Assistant spotlight — purple bg ── */}
      <div className="bg-[#7C3AED] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="hero-chat lg:border-r-[3px] lg:border-white/20 lg:pr-16 pb-12 lg:pb-0">
              <div className="border-[3px] border-white/30 bg-white/10 backdrop-blur-sm max-w-sm shadow-[8px_8px_0px_rgba(0,0,0,0.3)]">
                <div className="bg-black/30 px-4 py-3 flex items-center gap-3 border-b-[3px] border-white/20">
                  <div className="w-2 h-2 bg-[#F9FF00] rounded-full animate-pulse" />
                  <span className="font-oswald text-xs font-bold uppercase tracking-widest text-[#F9FF00]">CLEF AI</span>
                  <span className="ml-auto font-inter text-[9px] text-white/40 uppercase">LLAMA 3.1 • GROQ</span>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-end">
                    <div className="bg-[#F9FF00] border-[2px] border-black/20 px-3 py-2 max-w-[80%]">
                      <p className="font-inter text-[11px] font-medium text-black">Can you explain what a JWT token is?</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white/15 border-[2px] border-white/20 px-3 py-2 max-w-[85%]">
                      <p className="font-inter text-[11px] leading-relaxed text-white/90">
                        A JWT has three parts: <span className="font-bold text-[#F9FF00]">header</span>, <span className="font-bold text-[#00E5FF]">payload</span>, and <span className="font-bold text-[#00FF87]">signature</span> — separated by dots.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#F9FF00] border-[2px] border-black/20 px-3 py-2 max-w-[80%]">
                      <p className="font-inter text-[11px] font-medium text-black">Can you decode this one for me?</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white/15 border-[2px] border-white/20 px-3 py-2 max-w-[85%]">
                      <p className="font-inter text-[11px] leading-relaxed text-white/90">
                        Sure! Or use the <span className="font-bold text-[#FF0004]">JWT Decoder</span> tool — paste your token and see the header, payload, and expiry instantly.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white/10 border-[2px] border-white/15 px-4 py-3 flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="border-t-[3px] border-white/20 px-3 py-2 flex items-center gap-2 bg-black/20">
                  <span className="font-inter text-[10px] text-white/30 flex-1 uppercase tracking-wider">Ask anything...</span>
                  <div className="w-7 h-7 bg-[#F9FF00] border-[2px] border-black/20 flex items-center justify-center">
                    <ArrowRight size={12} className="text-black" />
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-ai-right lg:pl-16 flex flex-col justify-center">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 block mb-4">BUILT-IN AI</span>
              <h2 className="font-oswald text-5xl md:text-6xl font-bold uppercase leading-[0.88] tracking-[-0.04em] mb-6 text-white">
                CLEF AI.<br /><span className="text-outline-white">YOUR LOGIC ENGINE.</span>
              </h2>
              <p className="font-inter text-sm text-white/65 leading-relaxed mb-8 max-w-sm">
                Powered by Llama 3.1 via Groq. Ask it to debug code, explain concepts, generate content, or help with any task. No API key needed — it just works.
              </p>
              <div className="flex flex-col gap-0 border-[3px] border-white/20 mb-8 bg-black/20">
                {[
                  { label: "Model",      val: "Llama 3.1",            color: "#F9FF00" },
                  { label: "Provider",   val: "Groq (fast inference)", color: "#00E5FF" },
                  { label: "History",    val: "Local + cloud sync",    color: "#00FF87" },
                  { label: "Rate limit", val: "10–20 req/hr free",     color: "#F9FF00" },
                  { label: "API key",    val: "Not required",          color: "#00FF87" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2 border-b-[3px] border-white/10 last:border-b-0">
                    <div className="px-4 py-2.5 border-r-[3px] border-white/10">
                      <span className="font-oswald text-[10px] font-bold uppercase tracking-wider text-white/40">{row.label}</span>
                    </div>
                    <div className="px-4 py-2.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: row.color }} />
                      <span className="font-inter text-xs font-semibold text-white">{row.val}</span>
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
                className="group inline-flex items-center gap-3 bg-[#F9FF00] text-black border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm px-7 py-3 hover:bg-white transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,0.4)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 w-fit">
                TRY CLEF AI
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: Open Source — white bg ── */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="text-center mb-16">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF87] block mb-4">OPEN SOURCE</span>
            <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase text-black leading-[0.88] tracking-[-0.04em]">
              EVERY COMMIT.<br /><span className="text-gradient-cyber">EVERY LINE. PUBLIC.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "FORK IT",     desc: "Clone the entire codebase, spin up your own instance, or build something new on top. MIT license — no restrictions.",                                                                  tag: "MIT LICENSE",  color: "#00FF87", bg: "#00FF87", Icon: GitBranch, stat: "MIT"      },
              { title: "AUDIT IT",    desc: "Every function, every API call, every data flow is visible. No black boxes. If you're skeptical about our privacy claims, read the code.",                                            tag: "TRANSPARENCY", color: "#F9FF00", bg: "#F9FF00", Icon: Eye,       stat: "100%"     },
              { title: "CONTRIBUTE",  desc: "Found a bug? Have a tool idea? Submit a PR. Clef is built by the community, for the community. Your contribution ships to every user.",                                               tag: "COMMUNITY",    color: "#7C3AED", bg: "#7C3AED", Icon: Heart,     stat: "PRs open" },
            ].map((p, i) => (
              <div key={i}
                className="hero-testimonial border-[3px] border-black group hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Color header bar */}
                <div className="h-3 w-full" style={{ background: p.bg }} />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center" style={{ background: p.bg }}>
                      <p.Icon size={20} className="text-black" />
                    </div>
                    <span className="font-oswald text-3xl font-bold text-black/10">{p.stat}</span>
                  </div>
                  <span className="font-oswald text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border-[2px] border-black text-black/50 inline-block mb-4">{p.tag}</span>
                  <h3 className="font-oswald text-2xl font-bold uppercase text-black mb-4 tracking-tight">{p.title}</h3>
                  <p className="font-inter text-sm text-black/55 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION: Offline & PWA — dark bg ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            <div className="lg:border-r-[3px] lg:border-white/10 lg:pr-16 pb-12 lg:pb-0">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF87] block mb-4">OFFLINE FIRST</span>
              <h2 className="font-oswald text-5xl md:text-6xl font-bold uppercase text-white leading-[0.88] tracking-[-0.04em] mb-6">
                NO WIFI.<br /><span className="text-gradient-cyber">NO PROBLEM.</span>
              </h2>
              <p className="font-inter text-sm text-white/55 leading-relaxed max-w-sm mb-8">
                After your first visit, Clef is fully cached as a Progressive Web App. Lose your WiFi mid-project? Keep working. Every tool runs offline, no exceptions.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { step: "01", title: "First Visit",    desc: "Service worker caches all tool bundles, assets, and fonts.",  color: "#F9FF00" },
                  { step: "02", title: "Install as PWA", desc: "Add to home screen. Behaves like a native app.",              color: "#00E5FF" },
                  { step: "03", title: "Work Anywhere",  desc: "Plane, basement, dead zone — every tool runs locally.",       color: "#00FF87" },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-9 h-9 border-[2px] flex items-center justify-center font-oswald text-xs font-bold flex-shrink-0" style={{ borderColor: s.color, color: s.color }}>{s.step}</div>
                    <div>
                      <div className="font-oswald text-sm font-bold uppercase tracking-tight text-white mb-1">{s.title}</div>
                      <div className="font-inter text-xs text-white/40 leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:pl-16">
              <div className="border-[3px] border-white/10 bg-black/30 p-6 max-w-sm">
                <div className="flex items-center gap-3 border-[2px] border-[#00FF87]/30 px-4 py-3 bg-[#00FF87]/5 mb-4">
                  <WifiOff size={16} className="text-[#00FF87]" />
                  <span className="font-oswald text-xs font-bold uppercase tracking-widest text-[#00FF87]">OFFLINE MODE ACTIVE</span>
                </div>
                {[
                  { name: "JSON Formatter",  status: "Ready",              color: "#00FF87" },
                  { name: "Regex Tester",    status: "Ready",              color: "#00FF87" },
                  { name: "Color Converter", status: "Ready",              color: "#00FF87" },
                  { name: "Word Counter",    status: "Ready",              color: "#00FF87" },
                  { name: "Clef AI",         status: "Requires connection", color: "#F9FF00" },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-0">
                    <span className="font-inter text-xs text-white/55">{t.name}</span>
                    <span className="font-oswald text-[9px] font-bold uppercase tracking-wider" style={{ color: t.color }}>{t.status}</span>
                  </div>
                ))}
                <div className="mt-4 border-[2px] border-[#00E5FF]/20 px-3 py-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                  <span className="font-inter text-[10px] text-[#00E5FF]/70 uppercase tracking-wider">27 tools cached • PWA ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: Tech Stack — red/black bg ── */}
      <div className="bg-[#FF0004] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            <div className="lg:border-r-[3px] lg:border-black lg:pr-16 pb-12 lg:pb-0">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">UNDER THE HOOD</span>
              <h2 className="font-oswald text-5xl md:text-6xl font-bold uppercase text-black leading-[0.88] tracking-[-0.04em] mb-6">
                MODERN STACK.<br /><span className="text-outline-black">ZERO BLOAT.</span>
              </h2>
              <p className="font-inter text-sm text-black/65 leading-relaxed max-w-sm">
                Built with React 19, TypeScript, Vite, Tailwind, and GSAP. Deployed on the edge. Every dependency is justified — nothing is there for show.
              </p>
            </div>
            <div className="lg:pl-16 grid grid-cols-2 gap-3">
              {[
                { name: "React 19",     role: "UI Framework",   color: "#00E5FF", bg: "#1a1a1a" },
                { name: "TypeScript",   role: "Type Safety",    color: "#00E5FF", bg: "#1a1a1a" },
                { name: "Vite 7",       role: "Build Tool",     color: "#F9FF00", bg: "#1a1a1a" },
                { name: "Tailwind 3",   role: "Styling",        color: "#00E5FF", bg: "#1a1a1a" },
                { name: "GSAP 3",       role: "Animations",     color: "#00FF87", bg: "#1a1a1a" },
                { name: "Convex",       role: "Backend / DB",   color: "#F9FF00", bg: "#1a1a1a" },
                { name: "Groq / Llama", role: "AI Inference",   color: "#7C3AED", bg: "#1a1a1a" },
                { name: "Lenis",        role: "Smooth Scroll",  color: "#7C3AED", bg: "#1a1a1a" },
              ].map((tech, i) => (
                <div key={i}
                  className="border-[3px] border-black p-5 group hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: tech.bg }}>
                  <div className="w-2 h-2 rotate-45 mb-3" style={{ background: tech.color }} />
                  <div className="font-oswald text-sm font-bold uppercase tracking-tight text-white mb-1">{tech.name}</div>
                  <div className="font-inter text-[9px] uppercase tracking-widest text-white/30">{tech.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION: Pricing Manifesto — yellow bg ── */}
      <div className="bg-[#F9FF00] border-b-[3px] border-black relative overflow-hidden">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-12">
            <div className="max-w-xl">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">PRICING MODEL</span>
              <h2 className="font-oswald text-6xl md:text-7xl lg:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6">
                FREE.<br />NOT FREEMIUM.<br /><span className="text-outline-black">NOT A TRIAL.</span>
              </h2>
              <p className="font-inter text-sm text-black/65 leading-relaxed max-w-sm">
                No "Pro" tier. No feature gates. No "upgrade to unlock." Every tool, every feature, every update — free for everyone, forever. That's the whole model.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-0 border-[3px] border-black bg-black">
                {[
                  { label: "Monthly cost",   val: "$0",     color: "#F9FF00" },
                  { label: "Annual cost",    val: "$0",     color: "#F9FF00" },
                  { label: "Tools unlocked", val: "All 28", color: "#00FF87" },
                  { label: "Credit card",    val: "Never",  color: "#00E5FF" },
                ].map((item, i) => (
                  <div key={i} className="border-b-[2px] border-r-[2px] border-white/10 p-5 last:border-r-0">
                    <div className="font-oswald text-3xl font-bold mb-1" style={{ color: item.color }}>{item.val}</div>
                    <div className="font-inter text-[9px] uppercase tracking-widest text-white/40">{item.label}</div>
                  </div>
                ))}
              </div>
              <Link to="/pricing"
                className="group inline-flex items-center gap-3 bg-black text-[#F9FF00] border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm px-7 py-4 hover:bg-white hover:text-black transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 w-fit">
                SEE PRICING PAGE
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-8 -right-8 font-oswald text-[200px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">FREE</div>
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
          BEYOND<br /><span className="text-gradient-fire">LIMITS.</span>
        </h2>
      </div>

      {/* Front layer (final focus) */}
      <div className="zoom-layer absolute inset-0 flex flex-col items-center justify-center z-30 p-6 text-center">
        <div className="max-w-2xl bg-black/40 backdrop-blur-sm border-[3px] border-white/10 p-8 md:p-12">
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C3AED] block mb-6">NEXT GENERATION</span>
          <h3 className="font-oswald text-4xl md:text-6xl font-bold uppercase text-white mb-8">
            A NEW STANDARD FOR<br /><span className="text-gradient-purple">PRODUCTIVITY.</span>
          </h3>
          <p className="font-inter text-sm md:text-base text-white/50 leading-relaxed mb-10">
            Clef is evolving. More tools, deeper integrations, and uncompromising performance. 
            All while maintaining the privacy-first, local-only architecture you trust.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Fast",    icon: Zap,    color: "#F9FF00" },
              { label: "Private", icon: Shield, color: "#00E5FF" },
              { label: "Free",    icon: Star,   color: "#00FF87" },
              { label: "Open",    icon: Code,   color: "#FF0004" },
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
    <div className="relative py-28 md:py-36 bg-[#1a1a1a] border-t-[3px] border-black overflow-hidden">
      <div className="px-6 md:px-12 lg:px-16 flex flex-col items-center text-center relative z-10">
        {/* Animated color accent */}
        <div className="flex gap-2 mb-10">
          {["#F9FF00","#FF0004","#00E5FF","#00FF87","#7C3AED"].map((c, i) => (
            <div key={i} className="w-3 h-3 rotate-45" style={{ background: c }} />
          ))}
        </div>
        <h2 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] mb-8 text-white max-w-4xl">
          OPEN YOUR<br />FIRST TOOL.<br /><span className="text-gradient-fire">RIGHT NOW.</span>
        </h2>
        <p className="font-inter text-base md:text-lg text-white/50 leading-relaxed mb-12 max-w-2xl font-medium">
          No signups, no credit cards, no barriers. 28 tools ready to go — just click and start.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/tools" className="group bg-[#F9FF00] border-[4px] border-[#F9FF00] font-oswald font-bold uppercase tracking-widest text-lg px-10 py-5 hover:bg-white hover:border-white transition-all duration-200 shadow-[0_0_40px_rgba(249,255,0,0.3)] hover:shadow-[0_0_60px_rgba(249,255,0,0.5)] hover:-translate-y-1 flex items-center gap-3 text-black">
            OPEN THE WORKBENCH
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="https://github.com/sah-rohit/Clef" target="_blank" rel="noopener noreferrer"
            className="group border-[4px] border-white/20 font-oswald font-bold uppercase tracking-widest text-lg px-10 py-5 hover:bg-white hover:text-black hover:border-white transition-all duration-200 flex items-center gap-3 text-white">
            STAR ON GITHUB
            <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse, #F9FF00 0%, transparent 70%)" }} />
      </div>
      <div className="absolute -bottom-20 -left-20 font-oswald text-[250px] font-bold text-white/[0.02] leading-none select-none pointer-events-none uppercase">CLEF</div>
    </div>
  );
}
