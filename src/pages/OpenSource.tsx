import { Navigation } from "@/components/Navigation";
import { BackButton } from "@/components/BackButton";
import { Footer } from "@/components/Footer";
import { ArrowUpRight, GitBranch, Eye, Heart } from "lucide-react";

export default function OpenSource() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero — green bg */}
      <div className="bg-[#00FF87] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div className="px-6 md:px-12 lg:px-16 pt-28 pb-24 md:pt-36 md:pb-32 relative z-10">
          <div className="mb-10"><BackButton /></div>
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">INITIATIVE</span>
          <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6">
            OPEN<br /><span className="text-outline-black">SOURCE.</span>
          </h1>
          <p className="font-inter text-base text-black/65 leading-relaxed max-w-xl">
            Clef is built on the principles of transparency and collective intelligence. We believe the best tools are built in the open.
          </p>
        </div>
        <div className="absolute -bottom-4 -right-4 font-oswald text-[180px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">MIT</div>
      </div>

      {/* Three pillars */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: GitBranch, color: "#00FF87", bg: "#00FF87", title: "FORK IT",    desc: "Clone the entire codebase, spin up your own instance, or build something new on top. MIT license — no restrictions.", stat: "MIT" },
              { Icon: Eye,       color: "#F9FF00", bg: "#F9FF00", title: "AUDIT IT",   desc: "Every function, every API call, every data flow is visible. No black boxes. If you're skeptical about our privacy claims, read the code.", stat: "100%" },
              { Icon: Heart,     color: "#7C3AED", bg: "#7C3AED", title: "CONTRIBUTE", desc: "Found a bug? Have a tool idea? Submit a PR. Clef is built by the community, for the community. Your contribution ships to every user.", stat: "PRs open" },
            ].map(({ Icon, bg, title, desc, stat }, i) => (
              <div key={i} className="border-[3px] border-black group hover:shadow-[8px_8px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-3 w-full" style={{ background: bg }} />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center" style={{ background: bg }}>
                      <Icon size={20} className="text-black" />
                    </div>
                    <span className="font-oswald text-3xl font-bold text-black/10">{stat}</span>
                  </div>
                  <h3 className="font-oswald text-2xl font-bold uppercase mb-4">{title}</h3>
                  <p className="font-inter text-sm text-black/60 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repository — dark bg */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            <div className="lg:border-r-[3px] lg:border-white/10 lg:pr-16 pb-12 lg:pb-0">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#00FF87] block mb-4">THE REPOSITORY</span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase text-white leading-[0.88] tracking-[-0.04em] mb-6">
                EVERY LINE.<br /><span className="text-gradient-cyber">PUBLIC.</span>
              </h2>
              <p className="font-inter text-sm text-white/55 leading-relaxed mb-8 max-w-sm">
                The entire source code is available on GitHub. This includes our custom Brutalist design system, the real-time Convex backend integrations, and our suite of creator utilities.
              </p>
              <div className="flex flex-col gap-3">
                <a href="https://github.com/sah-rohit/clef" target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-[#00FF87] border-[3px] border-[#00FF87] text-black font-oswald font-bold uppercase tracking-widest text-sm px-7 py-3 hover:bg-white transition-all duration-200 shadow-[4px_4px_0px_rgba(0,255,135,0.3)] hover:-translate-y-0.5 w-fit">
                  VISIT REPOSITORY <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
            <div className="lg:pl-16 grid grid-cols-2 gap-3">
              {[
                { label: "No Tracking",   color: "#F9FF00" },
                { label: "No Cookies",    color: "#00E5FF" },
                { label: "Real-time Data",color: "#00FF87" },
                { label: "Brutalist UX",  color: "#7C3AED" },
                { label: "MIT License",   color: "#FF0004" },
                { label: "Community PRs", color: "#F9FF00" },
              ].map((item, i) => (
                <div key={i} className="border-[3px] border-white/10 p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
                  <div className="w-2 h-2 rotate-45 shrink-0" style={{ background: item.color }} />
                  <span className="font-oswald text-xs font-bold uppercase tracking-wider text-white/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
