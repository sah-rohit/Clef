import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Mail, ArrowUpRight, MessageSquare, Github } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero — purple bg */}
      <div className="bg-[#7C3AED] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div className="px-6 md:px-12 lg:px-16 pt-24 pb-20 md:pt-32 md:pb-28 relative z-10">
          <div className="mb-8"><BackButton /></div>
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 block mb-4">GET IN TOUCH</span>
          <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white mb-6">
            DIRECT<br /><span className="text-outline-white">INQUIRY.</span>
          </h1>
          <p className="font-inter text-base text-white/65 leading-relaxed max-w-xl">
            Initiate a direct comm-link for opportunities, feedback, or general support.
          </p>
        </div>
        <div className="absolute -bottom-4 -right-4 font-oswald text-[180px] font-bold text-white/[0.04] leading-none select-none pointer-events-none uppercase">HI</div>
      </div>

      {/* Contact options */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {/* Email */}
            <a href="mailto:sah.rohit.dev@gmail.com"
              className="group border-[3px] border-black p-8 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#F9FF00]" />
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-60 transition-opacity">
                <ArrowUpRight size={20} />
              </div>
              <div className="w-12 h-12 bg-[#F9FF00] border-[3px] border-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mail size={20} className="text-black" />
              </div>
              <h2 className="font-oswald text-2xl font-bold uppercase mb-2">EMAIL</h2>
              <p className="font-inter text-xs text-black/50 uppercase tracking-widest mb-4">Direct message to operations</p>
              <div className="font-oswald text-sm font-bold uppercase tracking-wider text-[#7C3AED]">SAH.ROHIT.DEV@GMAIL.COM</div>
            </a>

            {/* GitHub */}
            <a href="https://github.com/sah-rohit/Clef" target="_blank" rel="noopener noreferrer"
              className="group border-[3px] border-black p-8 hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-[#00FF87]" />
              <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-60 transition-opacity">
                <ArrowUpRight size={20} />
              </div>
              <div className="w-12 h-12 bg-[#00FF87] border-[3px] border-black flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Github size={20} className="text-black" />
              </div>
              <h2 className="font-oswald text-2xl font-bold uppercase mb-2">GITHUB</h2>
              <p className="font-inter text-xs text-black/50 uppercase tracking-widest mb-4">Open source repository</p>
              <div className="font-oswald text-sm font-bold uppercase tracking-wider text-[#7C3AED]">GITHUB.COM/SAH-ROHIT/CLEF</div>
            </a>
          </div>
        </div>
      </div>

      {/* Community board CTA — dark bg */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#7C3AED] border-[3px] border-[#7C3AED] flex items-center justify-center shrink-0">
                <MessageSquare size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-oswald text-xl font-bold uppercase text-white mb-2">COMMUNITY BOARD</h3>
                <p className="font-inter text-sm text-white/50 leading-relaxed">Post feedback, share experiences, or ask questions publicly.</p>
              </div>
            </div>
            <a href="/inquiry"
              className="group bg-[#7C3AED] border-[3px] border-[#7C3AED] text-white font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-7 py-3 hover:bg-white hover:text-black hover:border-white transition-all duration-200 whitespace-nowrap">
              OPEN BOARD <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
