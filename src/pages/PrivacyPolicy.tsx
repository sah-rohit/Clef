import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { ShieldCheck, EyeOff, Lock, ServerOff } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero — cyan bg */}
      <div className="bg-[#00E5FF] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28 relative z-10">
          <div className="mb-6"><BackButton /></div>
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">PRIVACY FIRST</span>
          <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6">
            I DON'T WANT<br /><span className="text-outline-black">YOUR DATA.</span>
          </h1>
          <p className="font-inter text-base text-black/65 leading-relaxed italic max-w-xl">
            "I believe privacy is a human right. Here is my policy in plain English."
          </p>
        </div>
        <div className="absolute -bottom-4 -right-4 font-oswald text-[180px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">SAFE</div>
      </div>

      {/* Core Pillars */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[3px] border-black">
            {[
              { Icon: ServerOff, color: "#FF0004", bg: "#FF0004", title: "LOCAL ONLY",   desc: "I don't have a backend database for your tools. Everything you type or generate stays within your browser." },
              { Icon: EyeOff,    color: "#F9FF00", bg: "#F9FF00", title: "NO TRACKING",  desc: "I don't use Google Analytics or any third-party tracking. I have no interest in who you are or what you're doing." },
              { Icon: Lock,      color: "#00FF87", bg: "#00FF87", title: "NO COOKIES",   desc: "I don't use tracking cookies. I only use local storage to remember your tool preferences." },
              { Icon: ShieldCheck, color: "#7C3AED", bg: "#7C3AED", title: "YOUR RIGHTS", desc: "You have total control. Clear your browser cache or use the Delete Account button to wipe everything instantly." },
            ].map(({ Icon, bg, title, desc }, i) => (
              <div key={i} className={`p-8 md:p-10 border-b-[3px] border-r-[3px] border-black ${i % 2 === 1 ? "border-r-0" : ""} ${i >= 2 ? "border-b-0" : ""} group hover:brightness-95 transition-all`}
                style={{ background: bg }}>
                <div className="w-12 h-12 border-[3px] border-black bg-black flex items-center justify-center mb-6">
                  <Icon size={22} style={{ color: bg }} />
                </div>
                <h3 className="font-oswald text-2xl font-bold uppercase mb-3 text-black">{title}</h3>
                <p className="font-inter text-sm text-black/65 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed sections */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20 max-w-4xl">
          <div className="space-y-0 border-[3px] border-white/10">
            {[
              { num: "1", title: "WHAT I COLLECT",  color: "#F9FF00", text: "Virtually nothing. If you Log In with an email, it's stored locally in your browser's localStorage. This is never sent to a server." },
              { num: "2", title: "HOW I USE INFO",  color: "#00E5FF", text: "Any personalization is strictly for your local experience. It stays on your device." },
              { num: "3", title: "COOKIES",         color: "#00FF87", text: "I don't use tracking cookies. I only use local storage to remember your tool preferences." },
              { num: "4", title: "YOUR RIGHTS",     color: "#7C3AED", text: "You have total control. Clear your browser cache or use the Delete Account button to wipe everything instantly." },
            ].map((s, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 border-b-[3px] border-white/10 last:border-b-0">
                <div className="md:col-span-3 px-6 py-6 border-b-[3px] md:border-b-0 md:border-r-[3px] border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center font-oswald text-sm font-bold border-[2px]"
                    style={{ borderColor: s.color, color: s.color }}>{s.num}</div>
                  <span className="font-oswald text-sm font-bold uppercase text-white">{s.title}</span>
                </div>
                <div className="md:col-span-9 px-6 py-6">
                  <p className="font-inter text-sm text-white/60 leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promise — green bg */}
      <div className="bg-[#00FF87] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="flex items-start gap-6 max-w-2xl">
            <div className="w-16 h-16 bg-black flex items-center justify-center shrink-0 border-[3px] border-black">
              <ShieldCheck size={28} className="text-[#00FF87]" />
            </div>
            <div>
              <h2 className="font-oswald text-4xl font-bold uppercase text-black mb-4">MY PROMISE</h2>
              <p className="font-inter text-sm text-black/65 leading-relaxed mb-6">
                Clef will never sell your data or compromise your privacy. This project is built for utility, not surveillance.
              </p>
              <div className="inline-block px-4 py-2 border-[3px] border-black bg-black text-[#00FF87] font-oswald text-xs font-bold uppercase tracking-widest">
                VERIFIED PRIVATE & SECURE
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
