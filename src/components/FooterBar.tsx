import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { ChevronUp, ChevronDown } from "lucide-react";
import gsap from "gsap";

const RIBBON_H = 40; // px — height of the copyright bar

export function FooterBar() {
  const [expanded, setExpanded]         = useState(false);
  const [atBottom, setAtBottom]         = useState(false);
  const [ribbonVisible, setRibbonVisible] = useState(true);
  // Track whether we've done the initial mount (skip first GSAP run)
  const mounted   = useRef(false);
  const lastScrollY = useRef(0);
  const panelRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => {
      const y            = window.scrollY;
      const scrollBottom = y + window.innerHeight;
      const docHeight    = document.documentElement.scrollHeight;

      // Hide the bar entirely when the real footer is visible
      setAtBottom(scrollBottom >= docHeight - 80);

      // Bottom ribbon: show when scrolling DOWN (approaching footer),
      // hide when scrolling UP (moving away from footer).
      // This mirrors the top ribbon but inverted — top hides on down,
      // bottom hides on up.
      if (y < 120) {
        // Near top — hide the bottom bar (footer is far away)
        setRibbonVisible(false);
      } else if (y > lastScrollY.current + 4) {
        // Scrolling down → show (getting closer to footer)
        setRibbonVisible(true);
      } else if (y < lastScrollY.current - 4) {
        // Scrolling up → hide (moving away from footer)
        setRibbonVisible(false);
      }
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", check, { passive: true });
    // Run once on mount to set initial state
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Animate panel open/close — skip on first mount
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (!mounted.current) {
      // First render: set collapsed state without animation
      gsap.set(panel, { height: 0, opacity: 0 });
      mounted.current = true;
      return;
    }

    if (expanded) {
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.45, ease: "power3.out" }
      );
    } else {
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => {
          // Ensure collapsed after animation
          if (panel) gsap.set(panel, { height: 0, opacity: 0 });
        },
      });
    }
  }, [expanded]);

  // When bar hides (atBottom or ribbonVisible=false), collapse the panel
  useEffect(() => {
    if (!ribbonVisible || atBottom) {
      setExpanded(false);
    }
  }, [ribbonVisible, atBottom]);

  // Don't render when user is already at the real footer
  if (atBottom) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[55]"
      style={{
        bottom: 0,
        transform: ribbonVisible ? "translateY(0)" : `translateY(${RIBBON_H}px)`,
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Expanded panel — full footer content, grows upward */}
      <div
        ref={panelRef}
        className="overflow-hidden border-t-[3px] border-black"
        style={{ height: 0, opacity: 0, background: "#1a1a1a" }}
      >
        {/* Color accent strip at top of panel */}
        <div className="flex h-1.5">
          {["#F9FF00","#FF0004","#00E5FF","#00FF87","#7C3AED"].map(c => (
            <div key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 max-h-[65vh] overflow-y-auto">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-4 border-b-[3px] sm:border-b-0 md:border-r-[3px] border-white/10 px-5 md:px-8 py-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#F9FF00] border-[2px] border-[#F9FF00] flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-black">
                  <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
                  <rect x="9" y="9" width="6" height="6" fill="currentColor" />
                </svg>
              </div>
              <span className="font-oswald text-xl font-bold uppercase text-white tracking-tight">CLEF</span>
            </div>
            <p className="font-inter text-xs text-white/50 leading-relaxed mb-4">
              A personal suite of productivity tools, developer utilities, and daily essentials.
              Private, fast, and always free.
            </p>
            <div className="flex gap-1.5">
              {[
                { color: "#F9FF00", label: "FREE" },
                { color: "#00FF87", label: "PRIVATE" },
                { color: "#00E5FF", label: "OPEN" },
              ].map(({ color, label }) => (
                <span key={label} className="font-oswald text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border"
                  style={{ borderColor: color + "40", color }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div className="md:col-span-3 border-b-[3px] md:border-b-0 md:border-r-[3px] border-white/10 px-5 md:px-8 py-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-[#00E5FF]" />
              <h4 className="font-oswald text-[10px] font-bold uppercase tracking-[0.2em] text-[#00E5FF]">Navigate</h4>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {[
                { label: "Features",    path: "/features" },
                { label: "Tools",       path: "/features#tools" },
                { label: "Our Promise", path: "/features#promise" },
                { label: "Roster",      path: "/features#roster" },
                { label: "Pricing",     path: "/pricing" },
                { label: "How To Use",  path: "/how-to-use" },
                { label: "Changelog",   path: "/changelog" },
                { label: "About",       path: "/about" },
                { label: "Account",     path: "/account" },
              ].map(item => (
                <Link key={item.label} to={item.path} onClick={() => setExpanded(false)}
                  className="font-inter text-xs text-white/55 hover:text-[#00E5FF] transition-colors py-0.5">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="md:col-span-3 border-b-[3px] md:border-b-0 md:border-r-[3px] border-white/10 px-5 md:px-8 py-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-4 bg-[#00FF87]" />
              <h4 className="font-oswald text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FF87]">Legal & More</h4>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {[
                { label: "Privacy",     path: "/privacy" },
                { label: "Terms",       path: "/terms" },
                { label: "Cookies",     path: "/cookies" },
                { label: "Agreement",   path: "/agreement" },
                { label: "Open Source", path: "/open-source" },
                { label: "Tools Guide", path: "/tools-guide" },
                { label: "GitHub",      path: "/github" },
                { label: "Contact",     path: "/contact" },
              ].map(item => (
                <Link key={item.label} to={item.path} onClick={() => setExpanded(false)}
                  className="font-inter text-xs text-white/55 hover:text-[#00FF87] transition-colors py-0.5">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="md:col-span-2 px-5 md:px-8 py-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-4 bg-[#7C3AED]" />
              <h4 className="font-oswald text-[10px] font-bold uppercase tracking-[0.2em] text-[#7C3AED]">Status</h4>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF0004] animate-pulse" />
              <p className="font-inter text-[10px] text-[#FF0004]/80 uppercase tracking-wide">Early access</p>
            </div>
            <a href="https://github.com/sah-rohit/Clef" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-[2px] border-[#00FF87]/30 px-3 py-1.5 font-oswald text-[9px] font-bold uppercase tracking-widest text-[#00FF87] hover:bg-[#00FF87] hover:text-black hover:border-[#00FF87] transition-all w-fit">
              VIEW ON GITHUB
            </a>
          </div>
        </div>
      </div>

      {/* Copyright ribbon — vibrant bottom bar */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full border-t-[3px] border-black flex items-center justify-between px-4 md:px-8 group transition-colors"
        style={{ height: RIBBON_H, background: expanded ? "#F9FF00" : "#1a1a1a" }}
        aria-label={expanded ? "Collapse footer" : "Expand footer"}
      >
        <div className="flex items-center gap-3">
          {/* Vibrant color dots */}
          <div className="flex items-center gap-1.5 shrink-0">
            {["#F9FF00","#FF0004","#00E5FF","#00FF87","#7C3AED"].map(c => (
              <div key={c} className="w-1.5 h-1.5 rotate-45 transition-transform group-hover:scale-125"
                style={{ background: c }} />
            ))}
          </div>
          <span className={`font-inter text-[10px] uppercase tracking-widest font-bold truncate transition-colors ${expanded ? "text-black/60" : "text-white/40"}`}>
            &copy; 2026 CLEF BY SONATA INTERACTIVE
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`font-oswald text-[10px] font-bold uppercase tracking-widest hidden lg:block transition-colors ${expanded ? "text-black/50" : "text-white/25"}`}>
            BUILT FOR CREATORS
          </span>
          <div className={`w-6 h-6 border-[2px] flex items-center justify-center transition-all ${expanded ? "border-black/30 text-black/60 bg-black/10" : "border-white/20 text-white/40 group-hover:border-[#F9FF00] group-hover:text-[#F9FF00]"}`}>
            {expanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </div>
        </div>
      </button>
    </div>
  );
}
