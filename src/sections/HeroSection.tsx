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
];

// ── Magnetic Component ──
function Magnetic({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 1,
        ease: "power3.out"
      });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="inline-block">{children}</div>;
}

export function HeroSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const magneticWrap = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Horizontal Scroll with Snapping ──
      const wrap = magneticWrap.current;
      if (wrap) {
        const slides = wrap.querySelectorAll(".horizontal-slide");
        gsap.to(slides, {
          xPercent: -100 * (slides.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            pin: true,
            scrub: 1,
            snap: 1 / (slides.length - 1),
            start: "top top",
            end: () => `+=${wrap.offsetWidth * (slides.length - 1)}`,
            onUpdate: (self) => {
              setActiveSlide(Math.round(self.progress * (slides.length - 1)));
            }
          }
        });
      }

      // ── Zoom Reveal Animations ──
      gsap.utils.toArray<HTMLElement>(".zoom-reveal").forEach((el) => {
        gsap.from(el, {
          scale: 0.8,
          opacity: 0,
          y: 50,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white overflow-x-hidden">
      {/* Hero Split */}
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-32 bg-white relative">
           <div className="max-w-xl relative z-10">
              <Magnetic>
                <div className="inline-block bg-[#F9FF00] px-4 py-1.5 border-[3px] border-black font-oswald text-[11px] font-black uppercase tracking-widest mb-10 shadow-[4px_4px_0px_black]">
                   SYSTEM_BOOT_COMPLETED
                </div>
              </Magnetic>
              <h1 className="font-oswald text-[12vw] md:text-[6vw] font-black uppercase leading-[0.85] tracking-tighter mb-10 text-black">
                 YOUR_DAILY<br /><span className="text-outline-black opacity-30">WORKBENCH.</span>
              </h1>
              <p className="font-inter text-lg text-black/60 max-w-md mb-12 font-medium leading-relaxed">
                 A premium suite of 28+ professional utilities. Built for high-fidelity document manipulation, code auditing, and color systems.
              </p>
              <div className="flex flex-wrap gap-4">
                 <Magnetic>
                    <button onClick={() => navigate("/tools")} className="px-10 py-5 bg-[#F9FF00] border-[4px] border-black font-oswald font-black uppercase tracking-widest text-sm shadow-[8px_8px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                       OPEN_WORKBENCH
                    </button>
                 </Magnetic>
                 <Magnetic>
                    <button onClick={() => navigate("/tools-guide")} className="px-10 py-5 bg-black text-white border-[4px] border-black font-oswald font-black uppercase tracking-widest text-sm shadow-[8px_8px_0px_#F9FF00] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                       SYSTEM_GUIDE
                    </button>
                 </Magnetic>
              </div>
           </div>
        </div>

        <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center p-12 relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(249,255,0,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(249,255,0,0.1) 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
           <div className="relative z-10 grid grid-cols-3 gap-8">
              {[Zap, Shield, Globe, Cpu, Lock, Rocket, Database, Wifi, Fingerprint].map((Icon, i) => (
                <Magnetic key={i}>
                   <div className="w-20 h-20 border-[3px] border-white/10 flex items-center justify-center text-white/20 hover:text-[#F9FF00] hover:border-[#F9FF00] hover:bg-[#F9FF00]/5 transition-all">
                      <Icon size={32} strokeWidth={1} />
                   </div>
                </Magnetic>
              ))}
           </div>
        </div>
      </div>

      {/* ── Magnetic GSAP Slides ── */}
      <div ref={magneticWrap} className="relative">
         <div className="flex w-[400%] h-screen">
            {SLIDES.map((slide, i) => (
               <div key={slide.id} className="horizontal-slide w-screen h-full shrink-0 flex items-center justify-center relative overflow-hidden" style={{ background: slide.bg }}>
                  <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
                  <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 px-12 gap-20">
                     <div className="flex flex-col justify-center">
                        <span className="font-oswald text-xs font-black uppercase tracking-[0.4em] mb-6" style={{ color: slide.accent }}>{slide.eyebrow}</span>
                        <h2 className="font-oswald text-[10vw] lg:text-[6vw] font-black uppercase leading-[0.85] text-white mb-10">
                           {slide.title[0]}<br />
                           <span style={{ color: slide.accent }}>{slide.title[1]}</span>
                        </h2>
                        <p className="font-inter text-xl text-white/50 leading-relaxed max-w-lg mb-12 font-medium">{slide.body}</p>
                        <div className="flex flex-wrap gap-3">
                           {slide.tags.map(tag => (
                             <span key={tag} className="px-4 py-2 border-[2px] border-white/10 text-white/40 font-oswald text-[10px] font-bold uppercase tracking-widest">{tag}</span>
                           ))}
                        </div>
                     </div>
                     <div className="flex items-center justify-center">
                        <Magnetic>
                           <div className="w-[400px] h-[400px] border-[8px] flex items-center justify-center relative group transition-all duration-500" style={{ borderColor: slide.accent, background: slide.accent + "05" }}>
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at center, ${slide.accent}20 0%, transparent 70%)` }} />
                              <div className="text-center relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                                 <span className="font-oswald text-8xl font-black block" style={{ color: slide.accent }}>{slide.stat.val}</span>
                                 <span className="font-inter text-xs font-bold uppercase tracking-[0.2em] text-white/40">{slide.stat.label}</span>
                              </div>
                           </div>
                        </Magnetic>
                     </div>
                  </div>
                  <div className="absolute bottom-12 left-12 font-oswald text-[200px] font-black text-white/[0.02] select-none pointer-events-none">{slide.num}</div>
               </div>
            ))}
         </div>
         {/* Progress Indicator */}
         <div className="fixed bottom-12 right-12 z-40 flex flex-col gap-4">
            {SLIDES.map((_, i) => (
               <div key={i} className={`w-1 h-8 transition-all duration-500 ${activeSlide === i ? "bg-[#F9FF00]" : "bg-white/10"}`} />
            ))}
         </div>
      </div>

      {/* ── Zoom Section ── */}
      <div className="zoom-section h-screen bg-black flex items-center justify-center relative overflow-hidden">
         <div className="zoom-reveal text-center">
            <h3 className="font-oswald text-8xl md:text-[12vw] font-black uppercase text-white leading-none">BEYOND<br /><span className="text-outline-white opacity-20">LIMITS.</span></h3>
            <p className="font-inter text-white/40 uppercase tracking-[0.4em] mt-10 font-black">Clef_Ecosystem // 2026</p>
         </div>
      </div>
    </section>
  );
}
