import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { SectionHeader } from "@/components/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, X, Shield, Clock, Infinity, Star } from "lucide-react";

export default function Pricing() {
  const heroRef  = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.7 });
  const cardRef  = useScrollReveal<HTMLDivElement>({ y: 50, duration: 0.7, delay: 0.1 });
  const valsRef  = useScrollReveal<HTMLDivElement>({ y: 30, stagger: 0.12, selector: ".val-card", duration: 0.6 });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="page-top pb-20">
        {/* Header */}
        <div ref={heroRef} className="px-6 md:px-12 lg:px-16 text-center mb-20 relative">
          <div className="absolute left-6 md:left-12 lg:left-16 top-0">
            <BackButton />
          </div>
          <SectionHeader
            eyebrow="Transparent Pricing"
            eyebrowColor="#FF0004"
            title="IT'S FREE. NO CATCH."
            accentLast
            accentStyle="gradient-cyber"
            size="xl"
            align="center"
            subtitle="I don't believe in charging for simple utilities. Clef is my contribution to the web ecosystem. $0 now, $0 forever."
          />
        </div>

        {/* Pricing Card */}
        <div ref={cardRef} className="px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
          <div className="border-[4px] border-black bg-white overflow-hidden shadow-apple">
            <div className="bg-[#F9FF00] border-b-[4px] border-black p-8 flex flex-col md:flex-row justify-between items-center gap-8 shadow-glow-yellow">
              <div>
                <h2 className="font-oswald font-bold uppercase tracking-[-0.04em] text-4xl leading-[0.9]">FREE FOREVER</h2>
                <p className="font-inter text-sm font-semibold text-black/60 uppercase tracking-widest mt-2">My commitment to the community</p>
              </div>
              <div className="text-center md:text-right">
                <div className="font-oswald font-bold text-6xl leading-none text-gradient-fire">$0</div>
                <div className="font-oswald text-sm font-bold uppercase text-black/60">ALWAYS $0</div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-6 border-b-[3px] border-black pb-2">WHAT YOU GET</h3>
                  <ul className="space-y-4">
                    {["All current & future tools", "No usage limits or caps", "Privacy-first processing", "Personalized dashboard", "My gratitude"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 group">
                        <div className="w-5 h-5 bg-black flex items-center justify-center flex-shrink-0 group-hover:bg-[#00FF87] transition-colors shadow-glow-green">
                          <Check size={12} className="text-[#F9FF00] group-hover:text-black transition-colors" />
                        </div>
                        <span className="font-inter text-sm font-medium uppercase tracking-wide">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-6 border-b-[3px] border-black pb-2">WHAT I HATE</h3>
                  <ul className="space-y-4">
                    {["Intrusive ads", "Selling user data", "Hidden fees", "Marketing spam"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 border-[2px] border-black flex items-center justify-center flex-shrink-0">
                          <X size={12} className="text-[#FF0004]" />
                        </div>
                        <span className="font-inter text-sm font-medium uppercase tracking-wide text-black/40 line-through decoration-[2px] decoration-[#FF0004]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t-[3px] border-black text-center">
                <a
                  href="/login"
                  className="btn-brutal btn-brutal-black w-full md:w-auto inline-flex items-center justify-center gap-3 text-lg py-4 px-12 hover-lift"
                >
                  START FOR FREE
                  <Star size={20} className="text-[#F9FF00]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Value cards */}
        <div ref={valsRef} className="px-6 md:px-12 lg:px-16 mt-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 border-[3px] border-black">
          {[
            { Icon: Shield,   color: "#00E5FF", glow: "shadow-glow-cyan",   bg: "hover:bg-[#00E5FF]/20", title: "MY GUARANTEE", desc: "I will never sell your data or compromise your privacy. This is my reputation on the line." },
            { Icon: Clock,    color: "#F9FF00", glow: "shadow-glow-yellow", bg: "hover:bg-[#F9FF00]/20", title: "INSTANT START",  desc: "No onboarding, no verification, no friction. Just use the tools when you need them." },
            { Icon: Infinity, color: "#00FF87", glow: "shadow-glow-green",  bg: "hover:bg-[#00FF87]/20", title: "UNLIMITED",      desc: "Because the tools run on your device, there are no bandwidth costs for me to limit." },
          ].map(({ Icon, color, glow, bg, title, desc }, i) => (
            <div key={i} className={`val-card text-center p-8 border-r-[3px] border-black last:border-r-0 ${bg} transition-all duration-300 hover-lift`}>
              <div className={`w-12 h-12 border-[3px] border-black flex items-center justify-center mx-auto mb-4 ${glow}`} style={{ background: color + "22" }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h4 className="font-oswald text-lg font-bold uppercase mb-2">{title}</h4>
              <p className="font-inter text-xs text-black/60">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
