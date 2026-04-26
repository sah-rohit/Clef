import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { SectionHeader } from "@/components/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Zap, Shield, Heart, Code, Globe, Coffee } from "lucide-react";

export default function About() {
  const heroRef  = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.7 });
  const gridRef  = useScrollReveal<HTMLDivElement>({ y: 30, stagger: 0.1, selector: ".vision-card", duration: 0.6 });
  const stepsRef = useScrollReveal<HTMLDivElement>({ y: 30, stagger: 0.12, selector: ".step-item", duration: 0.6 });
  const darkRef  = useScrollReveal<HTMLDivElement>({ x: 40, duration: 0.7 });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="page-top pb-20">
        {/* Header */}
        <div ref={heroRef} className="px-6 md:px-12 lg:px-16 mb-16">
          <BackButton />
          <div className="mt-6">
            <SectionHeader
              eyebrow="My Story"
              eyebrowColor="#FF0004"
              title="TOOLS I BUILT FOR MYSELF, NOW FOR YOU."
              accentLast
              accentStyle="gradient-fire"
              size="xl"
              mixWeights
              subtitle="I built Clef (formerly ToolVerse) because I was tired of utility tools being bloated with ads and tracking. This is my personal collection of workbenches, shared with the world."
            />
          </div>
        </div>

        {/* Vision Grid */}
        <div ref={gridRef} className="px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-[3px] border-black">
          {[
            { Icon: Zap,    color: "#F9FF00", title: "SPEED & SIMPLICITY", desc: "No splash screens, no complex configurations. Every tool is designed to do exactly what it says on the label, as fast as possible.", glow: "shadow-glow-yellow" },
            { Icon: Shield, color: "#00E5FF", title: "PRIVACY FIRST",      desc: "Your data never leaves your machine. All processing happens locally in your browser. We don't even use analytics scripts.", glow: "shadow-glow-cyan" },
            { Icon: Heart,  color: "#00FF87", title: "PERSONAL PROJECT",   desc: "Clef is a labor of love. It's free to use and always will be. No ads, no tracking, no selling your data. Just my tools for your work.", glow: "shadow-glow-green" },
          ].map(({ Icon, color, title, desc, glow }, i) => (
            <div
              key={i}
              className={`vision-card p-10 border-r-[3px] border-b-[3px] border-black last:border-r-0 md:border-b-0 hover-lift group transition-all duration-300`}
            >
              <div className={`w-12 h-12 border-[3px] border-black flex items-center justify-center mb-6 ${glow}`} style={{ background: color + "22" }}>
                <Icon size={24} style={{ color }} />
              </div>
              <h3 className="font-oswald text-2xl font-bold uppercase mb-4 group-hover:text-gradient-cyber transition-all">{title}</h3>
              <p className="font-inter text-sm text-black/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="px-6 md:px-12 lg:px-16 mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div ref={stepsRef}>
              <SectionHeader
                eyebrow="Process"
                eyebrowColor="#7C3AED"
                title="HOW I OPERATE"
                accentLast
                accentStyle="gradient-purple"
                size="sm"
                className="mb-10"
              />
              <div className="space-y-8">
                {[
                  { num: "01", color: "#F9FF00", glow: "shadow-glow-yellow", title: "PURE CLIENT-SIDE", desc: "I don't want your data. All processing happens locally in your browser. This is safer, faster, and more private." },
                  { num: "02", color: "#00E5FF", glow: "shadow-glow-cyan",   title: "OPEN STANDARDS",  desc: "I believe in the open web. My code is built on standard technologies like React, Tailwind, and WebCrypto APIs." },
                  { num: "03", color: "#00FF87", glow: "shadow-glow-green",  title: "BRUTALIST DESIGN", desc: "The aesthetic reflects my philosophy: honest, raw, and functional. No unnecessary shadows — just clear information." },
                ].map(({ num, color, glow, title, desc }) => (
                  <div key={num} className="step-item flex gap-6">
                    <div className={`w-12 h-12 border-[3px] border-black text-black flex items-center justify-center font-oswald text-xl font-bold flex-shrink-0 ${glow}`} style={{ background: color }}>
                      {num}
                    </div>
                    <div>
                      <h4 className="font-oswald text-xl font-bold uppercase mb-2">{title}</h4>
                      <p className="font-inter text-sm text-black/60 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div ref={darkRef} className="bg-[#1a1a1a] text-white p-12 border-[3px] border-black flex flex-col justify-center shadow-apple">
              <div className="w-12 h-12 bg-[#F9FF00] flex items-center justify-center mb-8 shadow-glow-yellow">
                <Code size={24} className="text-black" />
              </div>
              <h2 className="font-oswald font-bold uppercase tracking-[-0.04em] text-4xl leading-[0.9] mb-2">
                BUILT BY <span className="text-outline-white">ONE,</span>
              </h2>
              <h2 className="font-oswald font-bold uppercase tracking-[-0.04em] text-4xl leading-[0.9] mb-6 text-gradient-yellow">
                FOR EVERYONE.
              </h2>
              <p className="font-inter text-sm text-white/60 leading-relaxed mb-8">
                Whether you're debugging code or just need to count words,
                Clef provides the utility you need without the overhead. I'm
                constantly adding new tools to my personal suite.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 border-[2px] border-white/20 hover:border-[#F9FF00] hover:bg-[#F9FF00]/10 transition-all">
                  <Globe size={16} />
                  <span className="font-oswald text-xs font-bold">SONATA INTERACTIVE</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border-[2px] border-white/20 hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 transition-all">
                  <Coffee size={16} />
                  <span className="font-oswald text-xs font-bold">POWERED BY CAFFEINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
