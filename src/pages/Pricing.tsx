import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Check, X, Shield, Clock, Infinity, Star } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        {/* Header Section */}
        <div className="px-6 md:px-12 lg:px-16 text-center mb-20 relative">
          <div className="absolute left-6 md:left-12 lg:left-16 top-0">
            <BackButton />
          </div>
          <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] inline-block px-3 py-1 border-[2px] border-black mb-6">
            Transparent Pricing
          </span>
          <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-[-0.03em] leading-tight mb-6">
            IT'S FREE.<br />
            NO CATCH.
          </h1>
          <p className="font-inter text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
            I don't believe in charging for simple utilities. Clef is my contribution to the 
            web ecosystem. $0 now, $0 forever.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
          <div className="border-[4px] border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
            <div className="bg-[#F9FF00] border-b-[4px] border-black p-8 flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <h2 className="font-oswald text-4xl font-bold uppercase mb-2">FREE FOREVER</h2>
                <p className="font-inter text-sm font-semibold text-black/60 uppercase tracking-widest">My commitment to the community</p>
              </div>
              <div className="text-center md:text-right">
                <div className="font-oswald text-6xl font-bold mb-0">$0</div>
                <div className="font-oswald text-sm font-bold uppercase">ALWAYS $0</div>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-6 border-b-[3px] border-black pb-2">WHAT YOU GET</h3>
                  <ul className="space-y-4">
                    {[
                      "All current & future tools",
                      "No usage limits or caps",
                      "Privacy-first processing",
                      "Personalized dashboard",
                      "My gratitude",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-black flex items-center justify-center flex-shrink-0">
                          <Check size={12} className="text-[#F9FF00]" />
                        </div>
                        <span className="font-inter text-sm font-medium uppercase tracking-wide">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-oswald text-xl font-bold uppercase mb-6 border-b-[3px] border-black pb-2">WHAT I HATE</h3>
                  <ul className="space-y-4">
                    {[
                      "Intrusive ads",
                      "Selling user data",
                      "Hidden fees",
                      "Marketing spam",
                    ].map((item, i) => (
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
                <a href="/login" className="btn-brutal btn-brutal-black w-full md:w-auto inline-flex items-center justify-center gap-3 text-lg py-4 px-12">
                  START FOR FREE
                  <Star size={20} className="text-[#F9FF00]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Style Values */}
        <div className="px-6 md:px-12 lg:px-16 mt-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 border-[3px] border-black hover:bg-[#00E5FF]/20 transition-colors">
            <Shield size={32} className="mx-auto mb-4" style={{ color: "#00E5FF" }} />
            <h4 className="font-oswald text-lg font-bold uppercase mb-2">MY GUARANTEE</h4>
            <p className="font-inter text-xs text-black/60">I will never sell your data or compromise your privacy. This is my reputation on the line.</p>
          </div>
          <div className="text-center p-8 border-[3px] border-black hover:bg-[#F9FF00]/20 transition-colors">
            <Clock size={32} className="mx-auto mb-4" style={{ color: "#F9FF00" }} />
            <h4 className="font-oswald text-lg font-bold uppercase mb-2">INSTANT START</h4>
            <p className="font-inter text-xs text-black/60">No onboarding, no verification, no friction. Just use the tools when you need them.</p>
          </div>
          <div className="text-center p-8 border-[3px] border-black hover:bg-[#00FF87]/20 transition-colors">
            <Infinity size={32} className="mx-auto mb-4" style={{ color: "#00FF87" }} />
            <h4 className="font-oswald text-lg font-bold uppercase mb-2">UNLIMITED</h4>
            <p className="font-inter text-xs text-black/60">Because the tools run on your device, there are no bandwidth costs for me to limit.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
