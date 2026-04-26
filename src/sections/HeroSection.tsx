import { useEffect, useRef } from "react";
import { ArrowRight, Zap, Globe, Shield, FileText, Type, Palette, Key, QrCode, Menu, ArrowUpRight, Braces, Hash, Timer, Fingerprint } from "lucide-react";
import { Link, useNavigate } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const navigate = useNavigate();
  const sectionRef  = useRef<HTMLElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const paraRef     = useRef<HTMLParagraphElement>(null);
  const btnsRef     = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const featRef     = useRef<HTMLDivElement>(null);
  const hScrollWrap = useRef<HTMLDivElement>(null);
  const hScrollTrack = useRef<HTMLDivElement>(null);

  const scrollToTools = () => navigate("/features#tools");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", force3D: true },
        delay: 0.05,
      });

      // Badge pops in
      tl.fromTo(badgeRef.current,
        { y: -16, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45 }
      );

      // Heading lines clip up
      const lines = headingRef.current?.querySelectorAll(".hero-line");
      if (lines?.length) {
        tl.fromTo(lines,
          { y: "105%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.6, stagger: 0.07, ease: "power4.out" },
          "-=0.2"
        );
      }

      // Paragraph fades in — no blur
      tl.fromTo(paraRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.25"
      );

      // Buttons slide up
      tl.fromTo(btnsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 },
        "-=0.25"
      );

      // Stats row
      tl.fromTo(statsRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.2"
      );

      // Right column slides in from right — overlaps with left side
      tl.fromTo(rightRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.75"
      );

      // Grid cells stagger
      const cells = gridRef.current?.querySelectorAll(".grid-cell");
      if (cells?.length) {
        tl.fromTo(cells,
          { scale: 0.75, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, stagger: 0.03, ease: "back.out(1.2)" },
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

      // ── Mini-section scroll reveals ──────────────────────────────────────

      // How It Works steps
      gsap.fromTo(".hero-step",
        { y: 32, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-step", start: "top 88%", toggleActions: "play none none none" },
        }
      );

      // What's Inside category cards
      gsap.fromTo(".hero-cat",
        { x: 24, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-cat", start: "top 88%", toggleActions: "play none none none" },
        }
      );

      // Built Different comparison rows
      gsap.fromTo(".hero-compare-row",
        { x: -20, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power2.out", force3D: true,
          scrollTrigger: { trigger: ".hero-compare-row", start: "top 88%", toggleActions: "play none none none" },
        }
      );

      // AI section — chat mock slides up, right side fades in
      gsap.fromTo(".hero-chat",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-chat", start: "top 88%", toggleActions: "play none none none" },
        }
      );
      gsap.fromTo(".hero-ai-right",
        { x: 30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.65, ease: "power3.out", force3D: true,
          scrollTrigger: { trigger: ".hero-ai-right", start: "top 88%", toggleActions: "play none none none" },
        }
      );

      // ── Horizontal scroll section ─────────────────────────────────────────
      const track = hScrollTrack.current;
      const wrap  = hScrollWrap.current;
      if (track && wrap) {
        const panels     = Array.from(track.querySelectorAll<HTMLElement>(".h-panel"));
        const panelCount = panels.length;
        if (panelCount < 2) return;

        // Each panel is exactly 100vw; total travel = (n-1) panels
        const getTotal = () => (panelCount - 1) * wrap.offsetWidth;

        gsap.to(track, {
          x: () => -getTotal(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${getTotal()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Subtle scale-up on each panel as it scrolls into view
        panels.forEach((panel, i) => {
          if (i === 0) return; // first panel starts at full scale
          gsap.fromTo(panel,
            { scale: 0.92 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: wrap,
                start: () => `top top+=${i * wrap.offsetWidth * 0.8}`,
                end:   () => `top top+=${i * wrap.offsetWidth}`,
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-white">

      {/* ── Main hero split ── */}
      <div className="flex flex-col md:flex-row min-h-screen">

        {/* Left Column */}
        <div
          className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 pb-16 bg-white relative"
          style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h) + 2.5rem)" }}
        >
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="max-w-xl relative z-10">
            {/* Badge */}
            <div ref={badgeRef} className="mb-8 opacity-0">
              <span className="inline-flex items-center gap-2 bg-[#F9FF00] px-4 py-1.5 font-oswald text-[11px] font-bold uppercase tracking-widest border-2 border-black shadow-glow-yellow">
                <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" />
                FREE FOREVER — NO CATCH
              </span>
            </div>

            {/* Heading */}
            <h1
              ref={headingRef}
              className="font-oswald font-bold uppercase leading-[0.88] tracking-[-0.03em] mb-6 text-[#1a1a1a]"
              style={{ fontSize: "clamp(2.6rem, 5.5vw, 5.2rem)" }}
            >
              {["YOUR DAILY", "WORKBENCH FOR", "CODE, TEXT, AND", "COLOR."].map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <span className="hero-line block opacity-0">
                    {i === 3
                      ? <><span className="text-outline-black">{line.slice(0, -1)}</span><span className="text-gradient-fire">.</span></>
                      : line
                    }
                  </span>
                </span>
              ))}
            </h1>

            {/* Paragraph */}
            <p
              ref={paraRef}
              className="font-inter text-[15px] md:text-[16px] leading-relaxed text-[#1a1a1a]/60 mb-10 max-w-[30rem] font-medium opacity-0"
            >
              Clef is my personal suite of essential utilities for developers and everyday users.{" "}
              <em className="not-italic font-semibold text-[#1a1a1a]">Text editors, code tools, converters, generators</em>{" "}
              — all built to work right in your browser. Private, fast, and no strings attached.
            </p>

            {/* Buttons */}
            <div ref={btnsRef} className="flex flex-wrap gap-3 mb-12 opacity-0">
              <button
                onClick={scrollToTools}
                className="group bg-[#F9FF00] border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-7 py-3 hover:bg-black hover:text-[#F9FF00] transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_rgba(0,0,0,1)]"
              >
                EXPLORE TOOLS
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <Link
                to="/how-to-use"
                className="border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-2 px-7 py-3 hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 hover:-translate-y-0.5"
              >
                HOW IT WORKS
              </Link>
              <Link
                to="/about"
                className="bg-[#1a1a1a] border-[3px] border-[#1a1a1a] text-white font-oswald font-bold uppercase tracking-widest text-sm flex items-center px-7 py-3 hover:bg-white hover:text-[#1a1a1a] transition-all duration-200 hover:-translate-y-0.5"
              >
                ABOUT
              </Link>
            </div>

            {/* Stats Row */}
            <div ref={statsRef} className="flex border-[3px] border-black max-w-sm opacity-0 shadow-apple">
              {[
                { val: "28+", label: "TOOLS",       color: "#FF0004" },
                { val: "$0",  label: "ALWAYS FREE", bg: "#00FF87", color: "#1a1a1a" },
                { val: "0",   label: "ADS EVER",    color: "#7C3AED" },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`flex-1 ${i < 2 ? "border-r-[3px] border-black" : ""} py-3 flex flex-col items-center justify-center transition-colors hover:bg-[#fafafa]`}
                  style={s.bg ? { background: s.bg + "18" } : {}}
                >
                  <span className="font-oswald text-xl font-bold mb-0.5" style={{ color: s.color }}>{s.val}</span>
                  <span className="font-inter text-[8px] font-bold uppercase tracking-widest text-black/40">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div
          ref={rightRef}
          className="flex-1 bg-[#1a1a1a] flex flex-col items-center justify-center p-8 md:p-16 lg:p-20 relative overflow-hidden opacity-0"
          style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h) + 2.5rem)" }}
        >
          {/* Noise */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
          />

          <div className="w-full max-w-xs flex flex-col items-center relative z-10">
            {/* Icon Grid */}
            <div ref={gridRef} className="grid grid-cols-3 w-fit mx-auto border-t border-l border-white/20 mb-12">
              {[
                <FileText size={20} strokeWidth={1} />,
                <span className="font-mono font-light text-lg">{"<>"}</span>,
                <Type size={20} strokeWidth={1} />,
                <Palette size={20} strokeWidth={1} />,
                <span className="font-mono font-light text-lg">{"{ }"}</span>,
                <Key size={20} strokeWidth={1} />,
                <QrCode size={20} strokeWidth={1} />,
                <div className="flex flex-col items-center text-[9px] font-mono font-light leading-tight"><span>01</span><span>10</span></div>,
                <Menu size={20} strokeWidth={1} />,
              ].map((icon, i) => (
                <div
                  key={i}
                  className="grid-cell w-20 h-20 md:w-24 md:h-24 border-b border-r border-white/20 flex items-center justify-center text-white/35 hover:text-white hover:bg-white/5 transition-all duration-200 opacity-0"
                >
                  {icon}
                </div>
              ))}
            </div>

            {/* Features List */}
            <div ref={featRef} className="flex flex-col gap-4 w-full">
              {[
                { bg: "#F9FF00", Icon: Zap,    text: "Runs entirely in your browser — no data sent to servers",    iconClass: "text-black" },
                { bg: "#FF0004", Icon: Globe,  text: "Works offline after first load — no internet needed",        iconClass: "text-white" },
                { bg: "#00E5FF", Icon: Shield, text: "No tracking, no cookies, no analytics — privacy guaranteed", iconClass: "text-black" },
              ].map(({ bg, Icon, text, iconClass }, i) => (
                <div key={i} className="feat-item flex items-center gap-3 opacity-0">
                  <div
                    className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                    style={{ background: bg, boxShadow: `0 3px 10px ${bg}50` }}
                  >
                    <Icon size={12} className={iconClass} />
                  </div>
                  <p className="font-inter text-xs text-white/75 leading-snug">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative large text */}
          <div className="absolute bottom-6 right-6 font-oswald text-[100px] md:text-[130px] font-bold text-white/[0.025] leading-none select-none pointer-events-none">
            CLEF
          </div>
        </div>
      </div>

      {/* ── Marquee ticker strip ── */}
      <div className="border-t-[3px] border-b-[3px] border-black bg-[#F9FF00] py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex items-center">
              {[
                "28 FREE TOOLS",
                "ZERO ADS",
                "PRIVACY FIRST",
                "OPEN SOURCE",
                "WORKS OFFLINE",
                "AI POWERED",
                "NO SIGN-UP NEEDED",
                "BRUTALIST DESIGN",
                "BUILT FOR CREATORS",
                "ALWAYS FREE",
              ].map((item, i) => (
                <span key={i} className="inline-flex items-center gap-4 mx-6">
                  <span className="font-oswald text-sm font-bold uppercase tracking-widest text-black">{item}</span>
                  <span className="w-1.5 h-1.5 bg-black rotate-45 inline-block flex-shrink-0" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Featured tools strip ── */}
      <div className="border-b-[3px] border-black bg-white">
        <div className="px-6 md:px-12 lg:px-16 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-oswald text-xs font-bold uppercase tracking-[0.25em] text-black/40">
            POPULAR TOOLS
          </span>
          <div className="flex flex-wrap gap-0 border-[3px] border-black">
            {[
              { Icon: Braces,      label: "JSON",       path: "/tools/json-formatter",    color: "#059669" },
              { Icon: Palette,     label: "COLORS",     path: "/tools/color-converter",   color: "#8B5CF6" },
              { Icon: Hash,        label: "WORD COUNT", path: "/tools/word-counter",      color: "#7C3AED" },
              { Icon: Timer,       label: "POMODORO",   path: "/tools/pomodoro-timer",    color: "#FF0004" },
              { Icon: Fingerprint, label: "UUID",       path: "/tools/uuid-generator",    color: "#9333EA" },
              { Icon: QrCode,      label: "QR CODE",    path: "/tools/qr-code-generator", color: "#1a1a1a" },
            ].map(({ Icon, label, path, color }, i) => (
              <Link
                key={i}
                to={path}
                className="group flex items-center gap-2 px-4 py-2.5 border-r-[3px] border-black last:border-r-0 hover:bg-[#1a1a1a] transition-colors duration-150"
              >
                <Icon size={14} className="group-hover:text-white transition-colors" style={{ color }} />
                <span className="font-oswald text-[10px] font-bold uppercase tracking-wider group-hover:text-white transition-colors">
                  {label}
                </span>
                <ArrowUpRight size={10} className="text-black/20 group-hover:text-white/60 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── MINI SECTION 1: How It Works ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#F9FF00] block mb-3">
                WORKFLOW
              </span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase text-white leading-[0.9] tracking-[-0.02em]">
                THREE STEPS.<br />
                <span className="text-outline-white">ZERO FRICTION.</span>
              </h2>
            </div>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 border-[2px] border-white/20 px-5 py-2.5 font-oswald text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#F9FF00] hover:text-black hover:border-[#F9FF00] transition-all duration-200 w-fit"
              >
                FULL GUIDE <ArrowUpRight size={12} />
              </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-[3px] border-white/10">
            {[
              {
                num: "01",
                color: "#F9FF00",
                title: "PICK A TOOL",
                desc: "Browse 28 tools by category or search by name. Every tool is one click away from the homepage.",
                detail: "No account. No loading screen. Just click.",
              },
              {
                num: "02",
                color: "#00E5FF",
                title: "DO YOUR WORK",
                desc: "Paste, type, upload — whatever the tool needs. All processing happens locally in your browser.",
                detail: "Your data never leaves your device.",
              },
              {
                num: "03",
                color: "#00FF87",
                title: "EXPORT & GO",
                desc: "Download your result as a file, copy to clipboard, or share a link. Done in seconds.",
                detail: "No cloud upload. No waiting. Instant.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="hero-step p-8 md:p-10 border-b-[3px] md:border-b-0 md:border-r-[3px] border-white/10 last:border-0 group hover:bg-white/5 transition-colors duration-200"
              >
                <div
                  className="w-12 h-12 border-[3px] border-current flex items-center justify-center font-oswald text-xl font-bold mb-6 group-hover:scale-105 transition-transform duration-200"
                  style={{ color: step.color, borderColor: step.color }}
                >
                  {step.num}
                </div>
                <h3 className="font-oswald text-xl font-bold uppercase text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="font-inter text-sm text-white/55 leading-relaxed mb-4">
                  {step.desc}
                </p>
                <span
                  className="font-oswald text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: step.color }}
                >
                  {step.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MINI SECTION 2: What's Inside ── */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left — heading */}
            <div className="lg:border-r-[3px] lg:border-black lg:pr-16 pb-12 lg:pb-0 flex flex-col justify-center">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-4">
                THE TOOLSET
              </span>
              <h2 className="font-oswald text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-[0.9] tracking-[-0.03em] mb-6">
                28 TOOLS.<br />
                <span className="text-gradient-cyber">3 CATEGORIES.</span><br />
                <span className="font-[400] tracking-[0.04em] text-3xl md:text-4xl">INFINITE USES.</span>
              </h2>
              <p className="font-inter text-sm text-black/55 leading-relaxed max-w-sm">
                From JSON formatting to QR codes, from regex testing to color palettes — every tool is purpose-built, distraction-free, and permanently free.
              </p>
            </div>

            {/* Right — category cards */}
            <div className="lg:pl-16 flex flex-col gap-0 border-[3px] border-black lg:border-0">
              {[
                {
                  label: "DEVELOPER",
                  count: 13,
                  color: "#00E5FF",
                  tools: ["JSON Formatter", "Regex Tester", "JWT Decoder", "CSS Minifier", "Diff Checker", "Base64", "+7 more"],
                  desc: "Code, format, debug, convert.",
                },
                {
                  label: "PRODUCTIVITY",
                  count: 7,
                  color: "#F9FF00",
                  tools: ["Text File Maker", "Markdown Editor", "Word Counter", "Lorem Ipsum", "Pomodoro", "Text Case", "+1 more"],
                  desc: "Write, edit, focus, ship.",
                },
                {
                  label: "UTILITY",
                  count: 8,
                  color: "#00FF87",
                  tools: ["Password Gen", "QR Code", "Unit Converter", "Calculator", "Timestamp", "Aspect Ratio", "+2 more"],
                  desc: "Convert, generate, measure.",
                },
              ].map((cat, i) => (
                <div
                  key={i}
                  className="hero-cat group border-b-[3px] border-black last:border-b-0 lg:border-[3px] lg:border-black lg:mb-3 last:mb-0 p-6 hover:bg-[#fafafa] transition-colors duration-200 cursor-default"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rotate-45" style={{ background: cat.color }} />
                      <span className="font-oswald text-base font-bold uppercase tracking-wider">{cat.label}</span>
                    </div>
                    <span
                      className="font-oswald text-2xl font-bold"
                      style={{ color: cat.color }}
                    >
                      {cat.count}
                    </span>
                  </div>
                  <p className="font-inter text-xs text-black/40 uppercase tracking-wider mb-3">{cat.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.tools.map((t, j) => (
                      <span
                        key={j}
                        className="font-inter text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 border border-black/10 text-black/50 group-hover:border-black/20 transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MINI SECTION 3: Built Different ── */}
      <div className="bg-[#F9FF00] border-b-[3px] border-black overflow-hidden relative">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">
                WHY CLEF
              </span>
              <h2 className="font-oswald text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em] mb-6 text-black">
                NO ADS.<br />
                NO TRACKING.<br />
                <span className="text-outline-black">NO BS.</span>
              </h2>
              <p className="font-inter text-sm text-black/65 leading-relaxed max-w-sm">
                Most utility sites are ad farms in disguise. Clef is different — it's a personal project built for real use, not for monetization. The code is open, the tools are free, and your data stays yours.
              </p>
            </div>
            <div className="flex flex-col gap-0 border-[3px] border-black bg-white">
              {[
                { them: "Ads everywhere",          us: "Zero ads, ever",              color: "#00FF87" },
                { them: "Paywalled features",       us: "Everything free, always",     color: "#00E5FF" },
                { them: "Data harvesting",          us: "Local-only processing",       color: "#7C3AED" },
                { them: "Bloated interfaces",       us: "Brutalist, fast, focused",    color: "#F9FF00" },
                { them: "Closed source",            us: "MIT licensed on GitHub",      color: "#FF0004" },
              ].map((row, i) => (
                <div key={i} className="hero-compare-row grid grid-cols-2 border-b-[3px] border-black last:border-b-0">
                  <div className="px-4 py-3 border-r-[3px] border-black flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#FF0004] rounded-full flex-shrink-0" />
                    <span className="font-inter text-xs text-black/40 line-through decoration-[#FF0004]">{row.them}</span>
                  </div>
                  <div className="px-4 py-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: row.color }} />
                    <span className="font-inter text-xs font-semibold text-black">{row.us}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Decorative oversized text */}
        <div className="absolute -bottom-4 -right-4 font-oswald text-[160px] md:text-[220px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">
          FREE
        </div>
      </div>

      {/* ── MINI SECTION 4: AI Assistant spotlight ── */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left — mock chat */}
            <div className="hero-chat lg:border-r-[3px] lg:border-black lg:pr-16 pb-12 lg:pb-0">
              <div className="border-[3px] border-black bg-white shadow-apple max-w-sm">
                {/* Chat header */}
                <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b-[3px] border-black">
                  <div className="w-2 h-2 bg-[#F9FF00] rounded-full animate-pulse" />
                  <span className="font-oswald text-xs font-bold uppercase tracking-widest text-[#F9FF00]">CLEF AI</span>
                  <span className="ml-auto font-inter text-[9px] text-white/30 uppercase">LLAMA 3.1 • GROQ</span>
                </div>
                {/* Messages */}
                <div className="p-4 space-y-3 bg-[#fafafa]">
                  <div className="flex justify-end">
                    <div className="bg-[#F9FF00] border-[2px] border-black px-3 py-2 max-w-[80%]">
                      <p className="font-inter text-[11px] font-medium">Can you explain what a JWT token is?</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border-[2px] border-black px-3 py-2 max-w-[85%]">
                      <p className="font-inter text-[11px] leading-relaxed text-black/80">
                        A JWT (JSON Web Token) is a compact, URL-safe token with three parts: <span className="font-semibold text-[#7C3AED]">header</span>, <span className="font-semibold text-[#00E5FF]">payload</span>, and <span className="font-semibold text-[#00FF87]">signature</span> — separated by dots.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-[#F9FF00] border-[2px] border-black px-3 py-2 max-w-[80%]">
                      <p className="font-inter text-[11px] font-medium">Can you decode this one for me?</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white border-[2px] border-black px-3 py-2 max-w-[85%]">
                      <p className="font-inter text-[11px] leading-relaxed text-black/80">
                        Sure! Or even better — use the <span className="font-semibold text-[#FF0004]">JWT Decoder</span> tool in Clef. Paste your token and see the header, payload, and expiry instantly.
                      </p>
                    </div>
                  </div>
                  {/* Typing indicator */}
                  <div className="flex justify-start">
                    <div className="bg-white border-[2px] border-black px-4 py-3 flex items-center gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-black/30 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Input bar */}
                <div className="border-t-[3px] border-black px-3 py-2 flex items-center gap-2 bg-white">
                  <span className="font-inter text-[10px] text-black/25 flex-1 uppercase tracking-wider">Ask anything...</span>
                  <div className="w-7 h-7 bg-[#F9FF00] border-[2px] border-black flex items-center justify-center">
                    <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right — AI feature description */}
            <div className="hero-ai-right lg:pl-16 flex flex-col justify-center">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C3AED] block mb-4">
                BUILT-IN AI
              </span>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase leading-[0.9] tracking-[-0.03em] mb-6">
                CLEF AI.<br />
                <span className="text-gradient-purple">YOUR LOGIC ENGINE.</span>
              </h2>
              <p className="font-inter text-sm text-black/55 leading-relaxed mb-8 max-w-sm">
                Powered by Llama 3.1 via Groq. Ask it to debug code, explain concepts, generate content, or help with any task. No API key needed — it just works.
              </p>
              <div className="flex flex-col gap-0 border-[3px] border-black mb-8">
                {[
                  { label: "Model",       val: "Llama 3.1",          color: "#7C3AED" },
                  { label: "Provider",    val: "Groq (fast inference)", color: "#00E5FF" },
                  { label: "History",     val: "Local + cloud sync",  color: "#00FF87" },
                  { label: "Rate limit",  val: "10–20 req/hr free",   color: "#F9FF00" },
                  { label: "API key",     val: "Not required",        color: "#00FF87" },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2 border-b-[3px] border-black last:border-b-0">
                    <div className="px-4 py-2.5 border-r-[3px] border-black">
                      <span className="font-oswald text-[10px] font-bold uppercase tracking-wider text-black/40">{row.label}</span>
                    </div>
                    <div className="px-4 py-2.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: row.color }} />
                      <span className="font-inter text-xs font-semibold text-black">{row.val}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const btn = document.querySelector<HTMLButtonElement>("[aria-label='Clef AI']") ||
                    document.querySelector<HTMLButtonElement>(".fixed.right-4");
                  btn?.click();
                }}
                className="group inline-flex items-center gap-3 bg-[#1a1a1a] text-white border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm px-7 py-3 hover:bg-[#7C3AED] transition-all duration-200 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-glow-purple hover:-translate-y-0.5 w-fit"
              >
                TRY CLEF AI
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── HORIZONTAL SCROLL SHOWCASE ── */}
      {/* overflow-visible is critical — GSAP translates the track outside the wrapper bounds */}
      <div ref={hScrollWrap} className="relative bg-[#1a1a1a] overflow-clip" style={{ height: "100vh" }}>
        {/* Sticky label */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none">
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            SCROLL TO EXPLORE
          </span>
          <div className="mt-1 w-8 h-px bg-white/20" />
        </div>

        {/* Horizontal track — GSAP translates this left */}
        <div
          ref={hScrollTrack}
          className="flex"
          style={{ height: "100vh", willChange: "transform" }}
        >
          {/* Panel 1 — Speed */}
          <div className="h-panel flex items-center justify-center relative overflow-hidden shrink-0" style={{ width: "100vw", height: "100vh" }}>
            <div className="absolute inset-0 bg-[#1a1a1a]" />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: "radial-gradient(#F9FF00 1px, transparent 0)", backgroundSize: "40px 40px" }} />
            <div className="relative z-10 text-center px-8 max-w-2xl">
              <div className="w-16 h-16 bg-[#F9FF00] border-[4px] border-[#F9FF00] flex items-center justify-center mx-auto mb-8 shadow-glow-yellow">
                <Zap size={32} className="text-black" />
              </div>
              <h2 className="font-oswald text-6xl md:text-8xl font-bold uppercase text-white leading-[0.88] tracking-[-0.04em] mb-6">
                INSTANT.<br />
                <span className="text-gradient-yellow">ALWAYS.</span>
              </h2>
              <p className="font-inter text-sm text-white/55 leading-relaxed max-w-md mx-auto">
                Every tool opens in under 100ms. No loading screens, no splash pages, no waiting. Just click and work.
              </p>
              <div className="mt-8 inline-flex items-center gap-3 border-[2px] border-white/20 px-5 py-2">
                <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-white/60">AVERAGE LOAD TIME</span>
                <span className="font-oswald text-2xl font-bold text-[#F9FF00]">&lt;100ms</span>
              </div>
            </div>
            <div className="absolute bottom-8 right-8 font-oswald text-[120px] font-bold text-white/[0.03] leading-none select-none">01</div>
          </div>

          {/* Panel 2 — Privacy */}
          <div className="h-panel flex items-center justify-center relative overflow-hidden shrink-0" style={{ width: "100vw", height: "100vh" }}>
            <div className="absolute inset-0 bg-[#0a0a0a]" />
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "linear-gradient(#00E5FF 1px, transparent 1px), linear-gradient(90deg, #00E5FF 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            <div className="relative z-10 text-center px-8 max-w-2xl">
              <div className="w-16 h-16 bg-[#00E5FF] border-[4px] border-[#00E5FF] flex items-center justify-center mx-auto mb-8 shadow-glow-cyan">
                <Shield size={32} className="text-black" />
              </div>
              <h2 className="font-oswald text-6xl md:text-8xl font-bold uppercase text-white leading-[0.88] tracking-[-0.04em] mb-6">
                YOUR DATA.<br />
                <span className="text-gradient-cyber">YOUR DEVICE.</span>
              </h2>
              <p className="font-inter text-sm text-white/55 leading-relaxed max-w-md mx-auto">
                Zero telemetry. Zero tracking. Everything runs locally in your browser. We literally cannot see what you're doing.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-0 border-[2px] border-white/10 max-w-xs mx-auto">
                {["0 Cookies", "0 Analytics", "0 Ads"].map((s, i) => (
                  <div key={i} className={`py-3 text-center ${i < 2 ? "border-r-[2px] border-white/10" : ""}`}>
                    <span className="font-oswald text-xs font-bold uppercase text-[#00E5FF] block">{s.split(" ")[0]}</span>
                    <span className="font-inter text-[9px] text-white/40 uppercase">{s.split(" ")[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-8 right-8 font-oswald text-[120px] font-bold text-white/[0.03] leading-none select-none">02</div>
          </div>

          {/* Panel 3 — Free */}
          <div className="h-panel flex items-center justify-center relative overflow-hidden shrink-0" style={{ width: "100vw", height: "100vh" }}>
            <div className="absolute inset-0 bg-[#F9FF00]" />
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: "radial-gradient(#1a1a1a 1.5px, transparent 0)", backgroundSize: "32px 32px" }} />
            <div className="relative z-10 text-center px-8 max-w-2xl">
              <div className="w-16 h-16 bg-[#1a1a1a] border-[4px] border-[#1a1a1a] flex items-center justify-center mx-auto mb-8">
                <span className="font-oswald text-2xl font-bold text-[#F9FF00]">$0</span>
              </div>
              <h2 className="font-oswald text-6xl md:text-8xl font-bold uppercase text-black leading-[0.88] tracking-[-0.04em] mb-6">
                FREE.<br />
                <span className="text-outline-black">FOREVER.</span>
              </h2>
              <p className="font-inter text-sm text-black/65 leading-relaxed max-w-md mx-auto">
                Not "free with limits." Not "free trial." Not "free tier." Just free. 28 tools, no credit card, no expiry, no catch.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Link to="/features" className="bg-[#1a1a1a] text-[#F9FF00] border-[3px] border-[#1a1a1a] font-oswald font-bold uppercase tracking-widest text-sm px-8 py-3 hover:bg-white hover:text-black transition-all">
                  START NOW
                </Link>
              </div>
            </div>
            <div className="absolute bottom-8 right-8 font-oswald text-[120px] font-bold text-black/[0.04] leading-none select-none">03</div>
          </div>

          {/* Panel 4 — Open Source */}
          <div className="h-panel flex items-center justify-center relative overflow-hidden shrink-0" style={{ width: "100vw", height: "100vh" }}>
            <div className="absolute inset-0 bg-[#0d0d0d]" />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: "linear-gradient(45deg, #00FF87 25%, transparent 25%), linear-gradient(-45deg, #00FF87 25%, transparent 25%)", backgroundSize: "20px 20px" }} />
            <div className="relative z-10 text-center px-8 max-w-2xl">
              <div className="w-16 h-16 bg-[#00FF87] border-[4px] border-[#00FF87] flex items-center justify-center mx-auto mb-8 shadow-glow-green">
                <Globe size={32} className="text-black" />
              </div>
              <h2 className="font-oswald text-6xl md:text-8xl font-bold uppercase text-white leading-[0.88] tracking-[-0.04em] mb-6">
                OPEN.<br />
                <span className="text-gradient-cyber">TRANSPARENT.</span>
              </h2>
              <p className="font-inter text-sm text-white/55 leading-relaxed max-w-md mx-auto">
                Every line of code is public on GitHub. Fork it, audit it, contribute to it. Trust is earned through transparency.
              </p>
              <a href="https://github.com/sah-rohit/Clef" target="_blank" rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-3 border-[2px] border-[#00FF87]/40 px-6 py-3 font-oswald text-[10px] font-bold uppercase tracking-widest text-[#00FF87] hover:bg-[#00FF87] hover:text-black transition-all">
                VIEW ON GITHUB <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="absolute bottom-8 right-8 font-oswald text-[120px] font-bold text-white/[0.03] leading-none select-none">04</div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-none">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-1.5 h-1.5 bg-white/30 rotate-45" />
          ))}
        </div>
      </div>

    </section>
  );
}
