import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export function StartupAnimation() {
  const [active, setActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only play once per session
    const played = sessionStorage.getItem("clef_startup_played");
    if (played) {
      setActive(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setActive(false);
        sessionStorage.setItem("clef_startup_played", "true");
      }
    });

    // ── INITIAL STATE ──
    gsap.set(logoRef.current, { scale: 0.8, opacity: 0 });
    gsap.set(".startup-letter", { y: 100, opacity: 0 });
    gsap.set(".startup-line", { scaleX: 0 });

    // ── ANIMATION SEQUENCE ──
    tl.to(logoRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "power3.out"
    })
    .to(".startup-letter", {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: "expo.out"
    }, "-=0.3")
    .to(".startup-line", {
      scaleX: 1,
      duration: 1,
      ease: "expo.inOut",
      stagger: 0.1
    }, "-=0.8")
    .to(logoRef.current, {
      scale: 1.2,
      opacity: 0,
      duration: 0.5,
      ease: "power4.in",
      delay: 0.5
    })
    // Split curtain reveal
    .to(curtainLeftRef.current, {
      x: "-100%",
      duration: 1,
      ease: "expo.inOut"
    }, "-=0.1")
    .to(curtainRightRef.current, {
      x: "100%",
      duration: 1,
      ease: "expo.inOut"
    }, "<");

  }, []);

  if (!active) return null;

  const letters = "CLEF".split("");

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none"
    >
      {/* Split Curtains */}
      <div 
        ref={curtainLeftRef}
        className="absolute inset-y-0 left-0 w-1/2 bg-[#1a1a1a] border-r border-white/5 pointer-events-auto"
      />
      <div 
        ref={curtainRightRef}
        className="absolute inset-y-0 right-0 w-1/2 bg-[#1a1a1a] border-l border-white/5 pointer-events-auto"
      />

      {/* Logo Content */}
      <div ref={logoRef} className="relative z-10 flex flex-col items-center">
        <div className="flex gap-1 overflow-hidden">
          {letters.map((l, i) => (
            <span 
              key={i} 
              className="startup-letter font-oswald text-8xl md:text-[12rem] font-black uppercase tracking-tighter text-[#F9FF00] inline-block"
            >
              {l}
            </span>
          ))}
          <span className="startup-letter font-oswald text-8xl md:text-[12rem] font-black uppercase tracking-tighter text-white inline-block">.</span>
        </div>
        
        {/* Animated geometric lines */}
        <div className="flex flex-col gap-1 w-full max-w-[200px] mt-4">
          <div className="startup-line h-1 bg-[#F9FF00]" />
          <div className="startup-line h-1 bg-[#00FF87]" />
          <div className="startup-line h-1 bg-[#00E5FF]" />
        </div>
      </div>
      
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-radial-gradient from-[#F9FF00]/5 to-transparent opacity-50" />
    </div>
  );
}
