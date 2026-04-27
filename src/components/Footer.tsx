import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-black bg-[#1a1a1a] text-white">
      <div className="grid grid-cols-1 md:grid-cols-12 border-b-[3px] border-black">
        {/* CLEF Info Column */}
        <div className="md:col-span-4 border-r-[3px] border-black px-6 md:px-10 py-10 bg-[#F9FF00] text-black">
          <div className="flex items-center gap-3 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
              <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
              <rect x="9" y="9" width="6" height="6" fill="currentColor" />
            </svg>
            <h3 className="font-oswald text-2xl font-bold uppercase tracking-tight">
              CLEF
            </h3>
          </div>
          <p className="font-inter text-xs text-black/70 leading-relaxed max-w-sm font-semibold">
            A comprehensive webapp service by <strong>Sonata Interactive</strong>. 
            A personal suite of productivity tools, developer utilities, and daily essentials built for the community.
            Everything runs in your browser — private, fast, and always free.
          </p>
        </div>
        
        {/* Navigate Column */}
        <div className="md:col-span-3 border-r-[3px] border-black px-6 md:px-10 py-10 bg-[#00E5FF] text-black group transition-colors">
          <h4 className="font-oswald text-sm font-black uppercase tracking-[0.2em] text-black mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rotate-45" /> Navigate
          </h4>
          <div className="space-y-3">
            {[
              { label: "Features",    path: "/features" },
              { label: "Tools",       path: "/features#tools" },
              { label: "Our Promise", path: "/features#promise" },
              { label: "Roster",      path: "/features#roster" },
              { label: "Inquiry",     path: "/features#inquiry" },
              { label: "Pricing",     path: "/pricing" },
              { label: "Account",     path: "/account" },
              { label: "How To Use",  path: "/how-to-use" },
              { label: "Changelog",   path: "/changelog" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="block font-oswald text-sm font-bold uppercase tracking-wider text-black/60 hover:text-black hover:translate-x-1 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Legal Column */}
        <div className="md:col-span-3 border-r-[3px] border-black px-6 md:px-10 py-10 bg-[#00FF87] text-black transition-colors">
          <h4 className="font-oswald text-sm font-black uppercase tracking-[0.2em] text-black mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rotate-45" /> Legal
          </h4>
          <div className="space-y-3">
            {[
              { label: "Privacy Policy", path: "/privacy" },
              { label: "Terms & Conditions", path: "/terms" },
              { label: "Cookie Policy", path: "/cookies" },
              { label: "User Agreement", path: "/agreement" },
              { label: "Open Source", path: "/open-source" },
              { label: "Tools Guide", path: "/tools-guide" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="block font-oswald text-sm font-bold uppercase tracking-wider text-black/60 hover:text-black hover:translate-x-1 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Connect Column */}
        <div className="md:col-span-2 px-6 md:px-10 py-10 bg-[#7C3AED] text-white transition-colors">
          <h4 className="font-oswald text-sm font-black uppercase tracking-[0.2em] text-white mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-white rotate-45" /> Connect
          </h4>
          <div className="space-y-3">
            {[
              { label: "GitHub", path: "/github" },
              { label: "Contact", path: "/contact" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="block font-oswald text-sm font-bold uppercase tracking-wider text-white/70 hover:text-white hover:translate-x-1 transition-all cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 md:px-10 py-6 text-center bg-[#FF0004]/10">
         <span className="font-oswald text-xs md:text-sm text-[#FF0004] uppercase tracking-widest font-bold">
           DEVELOPMENT NOTICE: THIS PLATFORM IS IN EARLY ACCESS. FEATURES MAY BREAK UNEXPECTEDLY. NO GUARANTEE OF FUTURE MAINTENANCE.
         </span>
      </div>
      <div className="border-t border-white/10 px-6 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <span className="font-inter text-[10px] text-white/40 uppercase tracking-widest font-bold">
          &copy; 2026 CLEF BY SONATA INTERACTIVE — ALL RIGHTS RESERVED.
        </span>
        <span className="font-inter text-[10px] text-white/40 uppercase tracking-widest font-bold">
          BUILT FOR CREATORS • POWERED BY CLEF
        </span>
      </div>
    </footer>
  );
}
