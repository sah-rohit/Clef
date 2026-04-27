import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, X, Shield, Clock, Infinity, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function Pricing() {
  const heroRef = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.7 });
  const cardRef = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.7, delay: 0.1 });
  const valsRef = useScrollReveal<HTMLDivElement>({ y: 30, stagger: 0.12, selector: ".val-card", duration: 0.6 });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* ── HERO — red bg ── */}
      <div
        className="bg-[#FF0004] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}
      >
        <div ref={heroRef} className="px-6 md:px-12 lg:px-16 py-20 md:py-28 relative z-10">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 block mb-4">TRANSPARENT PRICING</span>
              <h1 className="font-oswald text-7xl md:text-9xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white">
                IT'S FREE.<br /><span className="text-outline-white">NO CATCH.</span>
              </h1>
            </div>
            <div className="text-right pb-2">
              <div className="font-oswald text-[120px] md:text-[160px] font-bold leading-none text-white/10 select-none">$0</div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 font-oswald text-[200px] font-bold text-white/[0.04] leading-none select-none pointer-events-none uppercase">FREE</div>
      </div>

      {/* ── Marquee ── */}
      <div className="border-b-[3px] border-black bg-[#1a1a1a] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex items-center">
              {[
                { text: "NO CREDIT CARD",   color: "#F9FF00" },
                { text: "NO TRIAL PERIOD",  color: "#00E5FF" },
                { text: "NO PREMIUM TIER",  color: "#00FF87" },
                { text: "NO FEATURE GATES", color: "#FF0004" },
                { text: "NO ADS EVER",      color: "#7C3AED" },
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

      {/* ── Pricing Card — white bg ── */}
      <div className="bg-white border-b-[3px] border-black">
        <div ref={cardRef} className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="max-w-4xl mx-auto">
            <div className="border-[4px] border-black overflow-hidden shadow-[12px_12px_0px_rgba(0,0,0,1)]">
              {/* Card header — yellow */}
              <div className="bg-[#F9FF00] border-b-[4px] border-black p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                  <h2 className="font-oswald font-bold uppercase tracking-[-0.04em] text-5xl leading-[0.9] text-black">FREE FOREVER</h2>
                  <p className="font-inter text-sm font-semibold text-black/60 uppercase tracking-widest mt-2">My commitment to the community</p>
                </div>
                <div className="text-center md:text-right">
                  <div className="font-oswald font-bold text-8xl leading-none text-black">$0</div>
                  <div className="font-oswald text-sm font-bold uppercase text-black/50 tracking-widest">ALWAYS $0</div>
                </div>
              </div>
              {/* Card body */}
              <div className="p-10 md:p-14">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="font-oswald text-xl font-bold uppercase mb-6 border-b-[3px] border-black pb-3">WHAT YOU GET</h3>
                    <ul className="space-y-4">
                      {["All current & future tools", "No usage limits or caps", "Privacy-first processing", "Personalized dashboard", "My gratitude"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 group">
                          <div className="w-6 h-6 bg-[#00FF87] border-[2px] border-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Check size={12} className="text-black" />
                          </div>
                          <span className="font-inter text-sm font-medium uppercase tracking-wide">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-oswald text-xl font-bold uppercase mb-6 border-b-[3px] border-black pb-3">WHAT I HATE</h3>
                    <ul className="space-y-4">
                      {["Intrusive ads", "Selling user data", "Hidden fees", "Marketing spam"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 border-[2px] border-black flex items-center justify-center flex-shrink-0">
                            <X size={12} className="text-[#FF0004]" />
                          </div>
                          <span className="font-inter text-sm font-medium uppercase tracking-wide text-black/40 line-through decoration-[2px] decoration-[#FF0004]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t-[3px] border-black flex flex-col sm:flex-row items-center gap-4">
                  <Link to="/login"
                    className="group bg-[#1a1a1a] text-white border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-10 py-4 hover:bg-[#F9FF00] hover:text-black transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5">
                    START FOR FREE <Star size={16} className="text-[#F9FF00] group-hover:text-black transition-colors" />
                  </Link>
                  <Link to="/tools"
                    className="group border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-10 py-4 hover:bg-[#1a1a1a] hover:text-white transition-all duration-200">
                    BROWSE TOOLS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Value cards — 3 vibrant bg sections ── */}
      <div ref={valsRef} className="grid grid-cols-1 md:grid-cols-3 border-b-[3px] border-black">
        {[
          { Icon: Shield,   color: "#00E5FF", bg: "#00E5FF", title: "MY GUARANTEE", desc: "I will never sell your data or compromise your privacy. This is my reputation on the line." },
          { Icon: Clock,    color: "#F9FF00", bg: "#F9FF00", title: "INSTANT START",  desc: "No onboarding, no verification, no friction. Just use the tools when you need them." },
          { Icon: Infinity, color: "#00FF87", bg: "#00FF87", title: "UNLIMITED",      desc: "Because the tools run on your device, there are no bandwidth costs for me to limit." },
        ].map(({ Icon, bg, title, desc }, i) => (
          <div key={i} className="val-card border-r-[3px] border-black last:border-r-0 p-12 md:p-16 group hover:brightness-95 transition-all duration-200" style={{ background: bg }}>
            <div className="w-14 h-14 border-[3px] border-black flex items-center justify-center mb-6 bg-black group-hover:scale-110 transition-transform duration-300">
              <Icon size={24} style={{ color: bg }} />
            </div>
            <h4 className="font-oswald text-2xl font-bold uppercase mb-4 text-black">{title}</h4>
            <p className="font-inter text-sm text-black/65 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* ── Comparison — dark bg ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-24">
          <div className="mb-14 text-center">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-4">VS THE REST</span>
            <h2 className="font-oswald text-5xl md:text-6xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white">
              CLEF VS<br /><span className="text-gradient-fire">EVERYONE ELSE.</span>
            </h2>
          </div>
          <div className="border-[3px] border-white/10 max-w-3xl mx-auto">
            {[
              { feature: "Price",           clef: "Free forever",     others: "Freemium / paid",   color: "#F9FF00" },
              { feature: "Data tracking",   clef: "Zero",             others: "Heavy analytics",   color: "#00E5FF" },
              { feature: "Ads",             clef: "None",             others: "Everywhere",         color: "#00FF87" },
              { feature: "Source code",     clef: "MIT open source",  others: "Proprietary",        color: "#7C3AED" },
              { feature: "Processing",      clef: "Your browser",     others: "Their servers",      color: "#FF0004" },
              { feature: "Account needed",  clef: "Never required",   others: "Usually required",   color: "#F9FF00" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 border-b-[3px] border-white/10 last:border-b-0">
                <div className="px-6 py-4 border-r-[3px] border-white/10 flex items-center">
                  <span className="font-oswald text-xs font-bold uppercase tracking-wider text-white/50">{row.feature}</span>
                </div>
                <div className="px-6 py-4 border-r-[3px] border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 rotate-45 flex-shrink-0" style={{ background: row.color }} />
                  <span className="font-inter text-xs font-bold text-white">{row.clef}</span>
                </div>
                <div className="px-6 py-4 flex items-center gap-2">
                  <X size={10} className="text-[#FF0004] flex-shrink-0" />
                  <span className="font-inter text-xs text-white/35">{row.others}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
