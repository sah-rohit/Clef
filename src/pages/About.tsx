import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Zap, Shield, Heart, Code, Globe, Coffee } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        {/* Header Section */}
        <div className="px-6 md:px-12 lg:px-16 mb-16">
          <BackButton />
          <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-4">
            My Story
          </span>
          <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-[-0.03em] leading-[0.9] mb-8">
            TOOLS I BUILT FOR MYSELF,<br />
            NOW FOR YOU.
          </h1>
          <p className="font-inter text-lg text-black/70 max-w-2xl leading-relaxed">
            I built Clef (formerly ToolVerse) because I was tired of utility tools being bloated with ads
            and tracking. This is my personal collection of workbenches, shared with the world.
          </p>
        </div>

        {/* Vision Grid */}
        <div className="px-6 md:px-12 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-[3px] border-black">
          <div className="p-10 border-r-[3px] border-b-[3px] border-black md:border-b-0 lg:border-b-0">
            <Zap size={32} className="mb-6" style={{ color: "#F9FF00" }} />
            <h3 className="font-oswald text-2xl font-bold uppercase mb-4">SPEED & SIMPLICITY</h3>
            <p className="font-inter text-sm text-black/60 leading-relaxed">
              No splash screens, no complex configurations. Every tool is designed to do exactly what it says
              on the label, as fast as possible.
            </p>
          </div>
          <div className="p-10 border-r-[3px] border-b-[3px] border-black lg:border-r-[3px] lg:border-b-0">
            <Shield size={32} className="mb-6" style={{ color: "#00E5FF" }} />
            <h3 className="font-oswald text-2xl font-bold uppercase mb-4">PRIVACY FIRST</h3>
            <p className="font-inter text-sm text-black/60 leading-relaxed">
              Your data never leaves your machine. All processing happens locally in your browser. We don't
              even use analytics scripts.
            </p>
          </div>
          <div className="p-10">
            <Heart size={32} className="mb-6" style={{ color: "#00FF87" }} />
            <h3 className="font-oswald text-2xl font-bold uppercase mb-4">PERSONAL PROJECT</h3>
            <p className="font-inter text-sm text-black/60 leading-relaxed">
              Clef is a labor of love. It's free to use and always will be. No ads, no tracking,
              no selling your data. Just my tools for your work.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-6 md:px-12 lg:px-16 mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="font-oswald text-3xl font-bold uppercase mb-8 border-b-[3px] border-black pb-4 inline-block">
                HOW I OPERATE
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-[#F9FF00] border-[3px] border-black text-black flex items-center justify-center font-oswald text-xl font-bold flex-shrink-0">
                    01
                  </div>
                  <div>
                    <h4 className="font-oswald text-xl font-bold uppercase mb-2">PURE CLIENT-SIDE</h4>
                    <p className="font-inter text-sm text-black/60 leading-relaxed">
                      I don't want your data. All processing happens locally in your browser. This is safer, 
                      faster, and more private.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-[#00E5FF] border-[3px] border-black text-black flex items-center justify-center font-oswald text-xl font-bold flex-shrink-0">
                    02
                  </div>
                  <div>
                    <h4 className="font-oswald text-xl font-bold uppercase mb-2">OPEN STANDARDS</h4>
                    <p className="font-inter text-sm text-black/60 leading-relaxed">
                      I believe in the open web. My code is built on standard technologies like React, Tailwind,
                      and WebCrypto APIs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 bg-[#00FF87] border-[3px] border-black text-black flex items-center justify-center font-oswald text-xl font-bold flex-shrink-0">
                    03
                  </div>
                  <div>
                    <h4 className="font-oswald text-xl font-bold uppercase mb-2">BRUTALIST DESIGN</h4>
                    <p className="font-inter text-sm text-black/60 leading-relaxed">
                      The aesthetic reflects my philosophy: honest, raw, and functional. No unnecessary
                      shadows — just clear information.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] text-white p-12 border-[3px] border-black flex flex-col justify-center">
              <Code size={48} className="text-[#F9FF00] mb-8" />
              <h2 className="font-oswald text-4xl font-bold uppercase mb-6 leading-tight">
                BUILT BY ONE,<br />
                FOR EVERYONE.
              </h2>
              <p className="font-inter text-sm text-white/60 leading-relaxed mb-8">
                Whether you're debugging code or just need to count words,
                Clef provides the utility you need without the overhead. I'm 
                constantly adding new tools to my personal suite.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 border-[2px] border-white/20">
                  <Globe size={16} />
                  <span className="font-oswald text-xs font-bold">SONATA INTERACTIVE</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border-[2px] border-white/20">
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
