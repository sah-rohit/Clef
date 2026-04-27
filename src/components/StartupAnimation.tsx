import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export function StartupAnimation() {
  const [active, setActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

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

    // Reset initial states
    gsap.set(textRef.current, { y: 100, opacity: 0, scale: 0.9 });
    
    tl.to(textRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power4.out",
      delay: 0.2
    })
    .to(textRef.current, {
      scale: 1.1,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      delay: 0.6
    })
    .to(containerRef.current, {
      y: "-100%",
      duration: 0.8,
      ease: "power4.inOut"
    }, "-=0.2");

  }, []);

  if (!active) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[#1a1a1a] flex items-center justify-center flex-col"
    >
      <div className="overflow-hidden">
        <h1 
          ref={textRef}
          className="font-oswald text-7xl md:text-9xl font-black uppercase tracking-tighter text-[#F9FF00]"
        >
          CLEF.
        </h1>
      </div>
      
      {/* Decorative scanning line */}
      <div 
        className="absolute left-0 right-0 h-[2px] bg-[#F9FF00]/50"
        style={{
          top: "-10%",
          animation: "scanline 2s linear infinite"
        }}
      />
      <style>{`
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>
    </div>
  );
}
