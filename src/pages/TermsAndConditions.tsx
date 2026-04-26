import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Scale, AlertTriangle, CheckCircle, Handshake } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="page-top pb-20">
        <div className="px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
          <div className="mb-12">
            <BackButton />
            <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-4">
              Legal Basics
            </span>
            <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-[-0.03em] leading-tight mb-6">
              THE RULES OF<br />
              MY PROJECT.
            </h1>
            <p className="font-inter text-lg text-black/70 leading-relaxed italic">
              "I like things simple. Here are the ground rules for using my work."
            </p>
          </div>

          <div className="space-y-10">
            {/* Quick Summary */}
            <div className="bg-[#F9FF00] p-8 border-[3px] border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-4">
                <Handshake size={24} />
                <h3 className="font-oswald text-xl font-bold uppercase">TL;DR SUMMARY</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle size={16} className="mt-1 flex-shrink-0" />
                  <span className="font-inter text-sm font-semibold uppercase">EVERYTHING IS FREE TO USE FOR ANY PURPOSE.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={16} className="mt-1 flex-shrink-0" />
                  <span className="font-inter text-sm font-semibold uppercase">WE DON'T GUARANTEE THE TOOLS ARE 100% BUG-FREE.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={16} className="mt-1 flex-shrink-0" />
                  <span className="font-inter text-sm font-semibold uppercase">YOU ARE RESPONSIBLE FOR WHAT YOU DO WITH THE TOOLS.</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-oswald text-lg font-bold">01</div>
                  <h2 className="font-oswald text-2xl font-bold uppercase">LICENSE</h2>
                </div>
                <p className="font-inter text-sm text-black/60 leading-relaxed">
                  I grant you a free license to use my tools for any purpose. 
                  Don't repackage my site as your own, but feel free to use the 
                  output however you want.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-oswald text-lg font-bold">02</div>
                  <h2 className="font-oswald text-2xl font-bold uppercase">NO WARRANTY</h2>
                </div>
                <p className="font-inter text-sm text-black/60 leading-relaxed">
                  These tools are provided "AS IS". I strive for accuracy, but I 
                  don't guarantee results. Use at your own risk.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-oswald text-lg font-bold">03</div>
                  <h2 className="font-oswald text-2xl font-bold uppercase">FAIR USE</h2>
                </div>
                <p className="font-inter text-sm text-black/60 leading-relaxed">
                  Please don't try to crash my project or scrape it with bots. 
                  Clef is built for humans.
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-oswald text-lg font-bold">04</div>
                  <h2 className="font-oswald text-2xl font-bold uppercase">UPDATES</h2>
                </div>
                <p className="font-inter text-sm text-black/60 leading-relaxed">
                  I might add or remove tools. I might also update these terms. 
                  Check back here occasionally.
                </p>
              </section>
            </div>

            <div className="mt-16 p-8 border-[3px] border-black bg-[#fafafa]">
              <div className="flex items-center gap-4 mb-4">
                <AlertTriangle size={32} className="text-[#FF0004]" />
                <h2 className="font-oswald text-2xl font-bold uppercase">LIABILITY</h2>
              </div>
              <p className="font-inter text-xs text-black/60 leading-relaxed uppercase tracking-wider font-semibold">
                IN NO EVENT SHALL I OR SONATA INTERACTIVE BE LIABLE FOR ANY DAMAGES ARISING OUT OF 
                THE USE OF OR INABILITY TO USE THE TOOLS.
              </p>
            </div>

            <div className="flex items-center justify-between pt-12 border-t-[3px] border-black">
              <span className="font-inter text-[10px] text-black/40 font-bold uppercase tracking-widest">Last Updated: April 24, 2026</span>
              <div className="flex items-center gap-2">
                <Scale size={16} />
                <span className="font-oswald text-xs font-bold uppercase">Standard Web Law Applies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
