import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Scale, AlertTriangle, CheckCircle, Handshake } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero — yellow bg */}
      <div className="bg-[#F9FF00] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28 relative z-10">
          <div className="mb-6"><BackButton /></div>
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">LEGAL BASICS</span>
          <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6">
            THE RULES OF<br /><span className="text-outline-black">MY PROJECT.</span>
          </h1>
          <p className="font-inter text-base text-black/65 leading-relaxed italic max-w-xl">
            "I like things simple. Here are the ground rules for using my work."
          </p>
        </div>
        <div className="absolute -bottom-4 -right-4 font-oswald text-[180px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">RULES</div>
      </div>

      {/* TL;DR — dark bg */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="flex items-start gap-5 max-w-3xl">
            <div className="w-12 h-12 bg-[#F9FF00] border-[3px] border-[#F9FF00] flex items-center justify-center shrink-0">
              <Handshake size={22} className="text-black" />
            </div>
            <div>
              <h3 className="font-oswald text-2xl font-bold uppercase text-white mb-4">TL;DR SUMMARY</h3>
              <div className="flex flex-col gap-3">
                {["Everything is free to use for any purpose.", "We don't guarantee the tools are 100% bug-free.", "You are responsible for what you do with the tools."].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={14} className="text-[#00FF87] shrink-0 mt-0.5" />
                    <span className="font-inter text-sm font-semibold uppercase text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections grid */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[3px] border-black">
            {[
              { num: "01", color: "#F9FF00", bg: "#F9FF00",  title: "LICENSE",    desc: "I grant you a free license to use my tools for any purpose. Don't repackage my site as your own, but feel free to use the output however you want." },
              { num: "02", color: "#00E5FF", bg: "#00E5FF",  title: "NO WARRANTY", desc: "These tools are provided \"AS IS\". I strive for accuracy, but I don't guarantee results. Use at your own risk." },
              { num: "03", color: "#00FF87", bg: "#00FF87",  title: "FAIR USE",    desc: "Please don't try to crash my project or scrape it with bots. Clef is built for humans." },
              { num: "04", color: "#7C3AED", bg: "#7C3AED",  title: "UPDATES",     desc: "I might add or remove tools. I might also update these terms. Check back here occasionally." },
            ].map(({ num, bg, title, desc }, i) => (
              <div key={i} className={`p-8 md:p-10 border-b-[3px] border-r-[3px] border-black ${i % 2 === 1 ? "border-r-0" : ""} ${i >= 2 ? "border-b-0" : ""}`}
                style={{ background: bg }}>
                <div className="font-oswald text-6xl font-bold text-black/10 leading-none mb-4">{num}</div>
                <h3 className="font-oswald text-2xl font-bold uppercase mb-3 text-black">{title}</h3>
                <p className="font-inter text-sm text-black/65 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Liability — red bg */}
      <div className="bg-[#FF0004] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="flex items-start gap-5 max-w-3xl">
            <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0 border-[3px] border-black">
              <AlertTriangle size={22} className="text-[#FF0004]" />
            </div>
            <div>
              <h2 className="font-oswald text-3xl font-bold uppercase text-white mb-4">LIABILITY</h2>
              <p className="font-inter text-xs text-white/70 leading-relaxed uppercase tracking-wider font-semibold">
                IN NO EVENT SHALL I OR SONATA INTERACTIVE BE LIABLE FOR ANY DAMAGES ARISING OUT OF THE USE OF OR INABILITY TO USE THE TOOLS.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Scale size={14} className="text-white/50" />
                <span className="font-oswald text-xs font-bold uppercase text-white/50 tracking-widest">Last Updated: April 24, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
