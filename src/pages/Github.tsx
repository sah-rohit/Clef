import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Github as GithubIcon, ArrowUpRight, Star, GitBranch, Code, Eye } from "lucide-react";

export default function Github() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero — dark bg */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-24 relative z-10">
          <div className="mb-6"><BackButton /></div>
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF87] block mb-4">OPEN SOURCE</span>
          <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white mb-6">
            GITHUB<br /><span className="text-gradient-cyber">REPOSITORY.</span>
          </h1>
          <p className="font-inter text-base text-white/55 leading-relaxed max-w-xl">
            Explore the codebase, track commits, and review the open-source architecture behind Clef.
          </p>
        </div>
        <div className="absolute -bottom-4 -right-4 font-oswald text-[180px] font-bold text-white/[0.03] leading-none select-none pointer-events-none uppercase">MIT</div>
      </div>

      {/* Main repo card — green bg */}
      <div className="bg-[#00FF87] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <a href="https://github.com/sah-rohit/Clef" target="_blank" rel="noopener noreferrer"
            className="group block border-[4px] border-black bg-white hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:-translate-y-1 max-w-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-[#1a1a1a]" />
            <div className="p-8 md:p-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-[#1a1a1a] border-[3px] border-black flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GithubIcon size={28} className="text-[#00FF87]" />
                </div>
                <ArrowUpRight size={24} className="text-black/20 group-hover:text-black transition-colors" />
              </div>
              <h2 className="font-oswald text-4xl font-bold uppercase mb-2">SAH-ROHIT / CLEF</h2>
              <p className="font-inter text-sm text-black/60 uppercase tracking-widest mb-6">PROCEED TO OFFICIAL GITHUB REPOSITORY</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#F9FF00]" />
                  <span className="font-oswald text-xs font-bold uppercase tracking-wider text-black/50">TypeScript</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={12} className="text-black/40" />
                  <span className="font-oswald text-xs font-bold uppercase tracking-wider text-black/50">MIT License</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t-[2px] border-black/10 font-mono text-xs font-bold uppercase tracking-widest text-black/40">
                HTTPS://GITHUB.COM/SAH-ROHIT/CLEF
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Quick links — 3 cards */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            { Icon: Star,      color: "#F9FF00", bg: "#F9FF00", label: "STAR THE REPO",   desc: "Show support by starring the repository on GitHub.",                href: "https://github.com/sah-rohit/Clef/stargazers" },
            { Icon: GitBranch, color: "#00E5FF", bg: "#00E5FF", label: "FORK IT",         desc: "Clone the codebase and build your own version. MIT licensed.",       href: "https://github.com/sah-rohit/Clef/fork" },
            { Icon: Code,      color: "#7C3AED", bg: "#7C3AED", label: "CONTRIBUTE",      desc: "Submit a PR, report a bug, or suggest a new tool.",                  href: "https://github.com/sah-rohit/Clef/issues" },
          ].map(({ Icon, bg, label, desc, href }, i) => (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer"
              className={`group p-10 border-b-[3px] md:border-b-0 ${i < 2 ? "md:border-r-[3px]" : ""} border-black flex flex-col gap-4 hover:brightness-95 transition-all`}
              style={{ background: bg }}>
              <div className="w-12 h-12 bg-black border-[3px] border-black flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon size={20} style={{ color: bg }} />
              </div>
              <h3 className="font-oswald text-xl font-bold uppercase text-black">{label}</h3>
              <p className="font-inter text-sm text-black/65 leading-relaxed">{desc}</p>
              <div className="flex items-center gap-2 mt-auto">
                <ArrowUpRight size={14} className="text-black/40 group-hover:text-black transition-colors" />
                <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">OPEN GITHUB</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Profile link — dark bg */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white border-[3px] border-white flex items-center justify-center shrink-0">
                <GithubIcon size={22} className="text-black" />
              </div>
              <div>
                <h3 className="font-oswald text-xl font-bold uppercase text-white mb-1">DEVELOPER PROFILE</h3>
                <p className="font-inter text-sm text-white/50 leading-relaxed">View all projects by @sah-rohit on GitHub.</p>
              </div>
            </div>
            <a href="https://github.com/sah-rohit" target="_blank" rel="noopener noreferrer"
              className="group bg-white border-[3px] border-white text-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-7 py-3 hover:bg-[#F9FF00] transition-all duration-200 whitespace-nowrap">
              @SAH-ROHIT <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
