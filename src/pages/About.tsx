import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Zap, Shield, Heart, Code, Globe, Coffee, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

export default function About() {
  const heroRef  = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.7 });
  const gridRef  = useScrollReveal<HTMLDivElement>({ y: 30, stagger: 0.1, selector: ".vision-card", duration: 0.6 });
  const stepsRef = useScrollReveal<HTMLDivElement>({ y: 30, stagger: 0.12, selector: ".step-item", duration: 0.6 });
  const darkRef  = useScrollReveal<HTMLDivElement>({ x: 40, duration: 0.7 });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* ── HERO — yellow bg ── */}
      <div
        className="bg-[#F9FF00] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}
      >
        <div ref={heroRef} className="px-6 md:px-12 lg:px-16 py-20 md:py-28 relative z-10">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="max-w-4xl">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">MY STORY</span>
            <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black mb-8">
              TOOLS I BUILT<br />FOR MYSELF,<br /><span className="text-outline-black">NOW FOR YOU.</span>
            </h1>
            <p className="font-inter text-base md:text-lg text-black/65 leading-relaxed max-w-2xl">
              I built Clef because I was tired of utility tools being bloated with ads and tracking. This is my personal collection of workbenches, shared with the world — free, private, and always open.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 font-oswald text-[200px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">CLEF</div>
      </div>

      {/* ── Marquee ── */}
      <div className="border-b-[3px] border-black bg-[#1a1a1a] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex items-center">
              {[
                { text: "PERSONAL PROJECT", color: "#F9FF00" },
                { text: "PRIVACY FIRST",    color: "#00E5FF" },
                { text: "OPEN SOURCE",      color: "#00FF87" },
                { text: "ZERO ADS",         color: "#FF0004" },
                { text: "BUILT WITH LOVE",  color: "#7C3AED" },
                { text: "FREE FOREVER",     color: "#F9FF00" },
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

      {/* ── Vision Grid — white bg ── */}
      <div className="bg-white border-b-[3px] border-black">
        <div ref={gridRef} className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="mb-16 text-center">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-4">CORE PRINCIPLES</span>
            <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em]">
              WHAT DRIVES<br /><span className="text-gradient-fire">EVERY DECISION.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: Zap,    color: "#F9FF00", bg: "#F9FF00", title: "SPEED & SIMPLICITY", desc: "No splash screens, no complex configurations. Every tool is designed to do exactly what it says on the label, as fast as possible." },
              { Icon: Shield, color: "#00E5FF", bg: "#00E5FF", title: "PRIVACY FIRST",      desc: "Your data never leaves your machine. All processing happens locally in your browser. We don't even use analytics scripts." },
              { Icon: Heart,  color: "#00FF87", bg: "#00FF87", title: "PERSONAL PROJECT",   desc: "Clef is a labor of love. It's free to use and always will be. No ads, no tracking, no selling your data. Just my tools for your work." },
            ].map(({ Icon, color, bg, title, desc }, i) => (
              <div key={i} className="vision-card border-[3px] border-black group hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-3 w-full" style={{ background: bg }} />
                <div className="p-10">
                  <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center mb-6" style={{ background: bg }}>
                    <Icon size={22} className="text-black" />
                  </div>
                  <h3 className="font-oswald text-2xl font-bold uppercase mb-4">{title}</h3>
                  <p className="font-inter text-sm text-black/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How I Operate — cyan bg ── */}
      <div className="bg-[#00E5FF] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            <div className="lg:border-r-[3px] lg:border-black lg:pr-16 pb-12 lg:pb-0">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">PROCESS</span>
              <h2 className="font-oswald text-5xl md:text-6xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6">
                HOW I<br /><span className="text-outline-black">OPERATE.</span>
              </h2>
              <p className="font-inter text-sm text-black/65 leading-relaxed max-w-sm">
                Three principles that guide every line of code I write for Clef. No compromises, no exceptions.
              </p>
            </div>
            <div ref={stepsRef} className="lg:pl-16 flex flex-col gap-4">
              {[
                { num: "01", color: "#F9FF00", bg: "#F9FF00",  title: "PURE CLIENT-SIDE",  desc: "I don't want your data. All processing happens locally in your browser. This is safer, faster, and more private." },
                { num: "02", color: "#FF0004", bg: "#FF0004",  title: "OPEN STANDARDS",    desc: "I believe in the open web. My code is built on standard technologies like React, Tailwind, and WebCrypto APIs." },
                { num: "03", color: "#7C3AED", bg: "#7C3AED",  title: "BRUTALIST DESIGN",  desc: "The aesthetic reflects my philosophy: honest, raw, and functional. No unnecessary shadows — just clear information." },
              ].map(({ num, bg, title, desc }) => (
                <div key={num} className="step-item flex gap-5 border-[3px] border-black bg-white p-6 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-200">
                  <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center font-oswald text-xl font-bold flex-shrink-0" style={{ background: bg }}>
                    <span className="text-black">{num}</span>
                  </div>
                  <div>
                    <h4 className="font-oswald text-xl font-bold uppercase mb-2">{title}</h4>
                    <p className="font-inter text-sm text-black/60 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Built By One — dark bg ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div ref={darkRef} className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            <div className="lg:border-r-[3px] lg:border-white/10 lg:pr-16 pb-12 lg:pb-0">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C3AED] block mb-4">THE MAKER</span>
              <h2 className="font-oswald text-5xl md:text-6xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white mb-6">
                BUILT BY ONE,<br /><span className="text-gradient-yellow">FOR EVERYONE.</span>
              </h2>
              <p className="font-inter text-sm text-white/55 leading-relaxed mb-8 max-w-sm">
                Whether you're debugging code or just need to count words, Clef provides the utility you need without the overhead. I'm constantly adding new tools to my personal suite.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 border-[2px] border-white/20 hover:border-[#F9FF00] hover:bg-[#F9FF00]/10 transition-all text-white">
                  <Globe size={14} />
                  <span className="font-oswald text-xs font-bold uppercase tracking-wider">SONATA INTERACTIVE</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 border-[2px] border-white/20 hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all text-white">
                  <Coffee size={14} />
                  <span className="font-oswald text-xs font-bold uppercase tracking-wider">POWERED BY CAFFEINE</span>
                </div>
              </div>
            </div>
            <div className="lg:pl-16 grid grid-cols-2 gap-3">
              {[
                { val: "28+",  label: "Tools Built",    color: "#F9FF00" },
                { val: "$0",   label: "Cost to You",    color: "#00FF87" },
                { val: "MIT",  label: "License",        color: "#00E5FF" },
                { val: "100%", label: "Browser-side",   color: "#7C3AED" },
              ].map((s, i) => (
                <div key={i} className="border-[3px] border-white/10 p-8 group hover:bg-white/5 transition-colors">
                  <div className="font-oswald text-5xl font-bold mb-2" style={{ color: s.color }}>{s.val}</div>
                  <div className="font-inter text-[10px] uppercase tracking-widest text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA — green bg ── */}
      <div className="bg-[#00FF87] border-b-[3px] border-black relative overflow-hidden">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">GET STARTED</span>
              <h2 className="font-oswald text-5xl md:text-6xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black">
                READY TO<br /><span className="text-outline-black">EXPLORE?</span>
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/tools"
                className="group bg-black text-[#00FF87] border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-4 hover:bg-white hover:text-black transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:-translate-y-0.5">
                EXPLORE ALL TOOLS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="https://github.com/sah-rohit/Clef" target="_blank" rel="noopener noreferrer"
                className="group border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-4 hover:bg-black hover:text-[#00FF87] transition-all duration-200">
                VIEW SOURCE CODE <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -left-6 font-oswald text-[180px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">GO</div>
      </div>

      <Footer />
    </div>
  );
}
