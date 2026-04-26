import { useEffect, useRef } from "react";
import { ArrowRight, Zap, Globe, Shield, FileText, Type, Palette, Key, QrCode, Menu } from "lucide-react";
import { Link } from "react-router";
import gsap from "gsap";

export function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const paraRef     = useRef<HTMLParagraphElement>(null);
  const btnsRef     = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const featRef     = useRef<HTMLDivElement>(null);

  const scrollToTools = () => {
    const el = document.getElementById("tools");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Badge pops in
      tl.fromTo(badgeRef.current,
        { y: -20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5 }
      );

      // Heading lines stagger up — split by <br> children
      const lines = headingRef.current?.querySelectorAll(".hero-line");
      if (lines?.length) {
        tl.fromTo(lines,
          { y: "110%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.7, stagger: 0.08, ease: "power4.out" },
          "-=0.2"
        );
      }

      // Paragraph fades in with slight blur
      tl.fromTo(paraRef.current,
        { opacity: 0, filter: "blur(6px)", y: 16 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.6 },
        "-=0.3"
      );

      // Buttons slide up
      tl.fromTo(btnsRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      );

      // Stats row
      tl.fromTo(statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        "-=0.2"
      );

      // Right column slides in from right
      tl.fromTo(rightRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.8"
      );

      // Grid cells stagger
      const cells = gridRef.current?.querySelectorAll(".grid-cell");
      if (cells?.length) {
        tl.fromTo(cells,
          { scale: 0.7, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: "back.out(1.4)" },
          "-=0.5"
        );
      }

      // Feature list items
      const feats = featRef.current?.querySelectorAll(".feat-item");
      if (feats?.length) {
        tl.fromTo(feats,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
          "-=0.3"
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col md:flex-row bg-white overflow-hidden"
    >
      {/* Left Column */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 pt-36 pb-20 md:pt-44 md:pb-24 bg-white relative">
        {/* Subtle background grid */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />

        <div className="max-w-xl relative z-10">
          {/* Badge */}
          <div ref={badgeRef} className="mb-10 opacity-0">
            <span className="inline-flex items-center gap-2 bg-[#F9FF00] px-4 py-1.5 font-oswald text-[11px] font-bold uppercase tracking-widest border-2 border-black shadow-glow-yellow">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
              FREE FOREVER — NO CATCH
            </span>
          </div>

          {/* Heading — each line wrapped for GSAP clip */}
          <h1
            ref={headingRef}
            className="font-oswald font-bold uppercase leading-[0.88] tracking-[-0.03em] mb-8 text-[#1a1a1a]"
            style={{ fontSize: "clamp(2.8rem, 6vw, 5.5rem)" }}
          >
            {["YOUR DAILY", "WORKBENCH FOR", "CODE, TEXT, AND", "COLOR."].map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <span className="hero-line block opacity-0">
                  {i === 3
                    ? <><span className="text-outline" style={{ WebkitTextStroke: "2px #1a1a1a" }}>{line.slice(0, -1)}</span><span className="text-gradient-fire">.</span></>
                    : line
                  }
                </span>
              </span>
            ))}
          </h1>

          {/* Paragraph */}
          <p
            ref={paraRef}
            className="font-inter text-[15px] md:text-[17px] leading-relaxed text-[#1a1a1a]/65 mb-12 max-w-[28rem] font-medium opacity-0"
          >
            Clef is my personal suite of essential utilities for developers and everyday users.{" "}
            <em className="not-italic font-semibold text-[#1a1a1a]">Text editors, code tools, converters, generators</em>{" "}
            — all built to work right in your browser. Private, fast, and no strings attached.
          </p>

          {/* Buttons */}
          <div ref={btnsRef} className="flex flex-wrap gap-4 mb-16 opacity-0">
            <button
              onClick={scrollToTools}
              className="group relative bg-[#F9FF00] border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-3.5 hover:bg-black hover:text-[#F9FF00] transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            >
              EXPLORE TOOLS
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <Link
              to="/about"
              className="bg-[#1a1a1a] border-[3px] border-[#1a1a1a] text-white font-oswald font-bold uppercase tracking-widest text-sm flex items-center px-8 py-3.5 hover:bg-white hover:text-[#1a1a1a] transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.2)] hover:-translate-y-0.5"
            >
              LEARN MORE
            </Link>
          </div>

          {/* Stats Row */}
          <div ref={statsRef} className="flex border-[3px] border-black max-w-md opacity-0 shadow-apple">
            {[
              { val: "28+", label: "TOOLS", color: "#FF0004" },
              { val: "$0",  label: "ALWAYS FREE", bg: "#00FF87", color: "#1a1a1a" },
              { val: "0",   label: "ADS EVER", color: "#7C3AED" },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex-1 ${i < 2 ? "border-r-[3px] border-black" : ""} py-4 flex flex-col items-center justify-center transition-colors hover:bg-[#fafafa]`}
                style={s.bg ? { background: s.bg + "22" } : {}}
              >
                <span className="font-oswald text-2xl font-bold mb-1" style={{ color: s.color }}>{s.val}</span>
                <span className="font-inter text-[9px] font-bold uppercase tracking-widest text-black/50">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div ref={rightRef} className="flex-1 bg-[#1a1a1a] flex flex-col items-center justify-center p-8 md:p-20 relative overflow-hidden opacity-0">
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
        />

        <div className="w-full max-w-sm flex flex-col items-center mb-10 relative z-10">
          {/* Icon Grid */}
          <div ref={gridRef} className="grid grid-cols-3 w-fit mx-auto border-t border-l border-white/20 mb-16">
            {[
              <FileText size={22} strokeWidth={1} />,
              <span className="font-mono font-light text-xl">{"<>"}</span>,
              <Type size={22} strokeWidth={1} />,
              <Palette size={22} strokeWidth={1} />,
              <span className="font-mono font-light text-xl">{"{ }"}</span>,
              <Key size={22} strokeWidth={1} />,
              <QrCode size={22} strokeWidth={1} />,
              <div className="flex flex-col items-center text-[10px] font-mono font-light leading-tight"><span>01</span><span>10</span></div>,
              <Menu size={22} strokeWidth={1} />,
            ].map((icon, i) => (
              <div
                key={i}
                className="grid-cell w-24 h-24 border-b border-r border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200 opacity-0"
              >
                {icon}
              </div>
            ))}
          </div>

          {/* Features List */}
          <div ref={featRef} className="flex flex-col gap-5 w-full pl-6">
            {[
              { bg: "#F9FF00", Icon: Zap, text: "Runs entirely in your browser — no data sent to servers", iconClass: "text-black" },
              { bg: "#FF0004", Icon: Globe, text: "Works offline after first load — no internet needed", iconClass: "text-white" },
              { bg: "#00E5FF", Icon: Shield, text: "No tracking, no cookies, no analytics — your privacy matters", iconClass: "text-black" },
            ].map(({ bg, Icon, text, iconClass }, i) => (
              <div key={i} className="feat-item flex items-center gap-4 opacity-0">
                <div
                  className="w-6 h-6 flex items-center justify-center flex-shrink-0 shadow-glow-yellow"
                  style={{ background: bg, boxShadow: `0 4px 12px ${bg}55` }}
                >
                  <Icon size={12} className={iconClass} />
                </div>
                <p className="font-inter text-xs text-white/80 leading-snug font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="absolute bottom-10 left-10 z-10">
          <div className="bg-[#F9FF00] px-4 py-2 font-oswald text-[11px] font-bold uppercase tracking-widest text-black shadow-glow-yellow animate-float">
            28 FREE TOOLS — USE THEM ALL, RIGHT NOW
          </div>
        </div>

        {/* Decorative large text */}
        <div className="absolute top-8 right-8 font-oswald text-[120px] font-bold text-white/[0.03] leading-none select-none pointer-events-none">
          CLEF
        </div>
      </div>
    </section>
  );
}
