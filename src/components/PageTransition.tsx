import { useEffect, useRef, ReactNode } from "react";
import { useLocation } from "react-router";
import gsap from "gsap";

interface Props { children: ReactNode }

export function PageTransition({ children }: Props) {
  const location   = useLocation();
  const wrapRef    = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const prevPath   = useRef<string | null>(null);

  useEffect(() => {
    const wrap    = wrapRef.current;
    const curtain = curtainRef.current;
    const text    = textRef.current;
    if (!wrap || !curtain || !text) return;

    const currentPath = location.pathname;
    const isFirstLoad = prevPath.current === null;
    const isSamePage  = prevPath.current === currentPath;

    prevPath.current = currentPath;

    if (isSamePage) {
      gsap.set(wrap, { opacity: 1, y: 0 });
      gsap.set(curtain, { scaleY: 0, opacity: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      if (isFirstLoad) {
        gsap.set(curtain, { scaleY: 0, opacity: 0 });
        tl.fromTo(
          wrap,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        ).set(wrap, { clearProps: "transform" });
      } else {
        // Sweep up + fade content
        tl.set(curtain, { scaleY: 1, opacity: 1, transformOrigin: "top center" })
          .fromTo(text, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 });

        // Special kinetic animation for Home
        if (currentPath === "/") {
          // Brutalist Kinetic Portal Animation
          tl.to(curtain, { background: "#F9FF00", duration: 0.1 })
            .to(text, { scale: 1.2, duration: 0.1, repeat: 3, yoyo: true })
            .to(text, { 
              duration: 0.8, 
              scale: 8, 
              opacity: 0, 
              letterSpacing: "8em", 
              fontWeight: "900", 
              ease: "expo.in" 
            })
            .set(curtain, { background: "#1a1a1a" })
            .fromTo(".kinetic-line", { scaleX: 0 }, { scaleX: 1, duration: 0.4, stagger: 0.05, ease: "power3.inOut" })
            .set(text, { scale: 1, opacity: 0, letterSpacing: "0.1em" })
            .to(text, { 
              duration: 0.4, 
              opacity: 1, 
              ease: "power2.out" 
            })
            .to(".kinetic-line", { scaleX: 0, duration: 0.3, stagger: 0.02 }, "-=0.2");
        }

        tl.to(curtain, {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 0.8,
            ease: "expo.inOut",
          }, "+=0.1")
          .to(text, { opacity: 0, y: -20, duration: 0.3 }, "-=0.7")
          .fromTo(
            wrap,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.4"
          )
          .set(wrap, { clearProps: "all" })
          .set(curtain, { opacity: 0 }) // Failsafe
          .add(() => {
            window.scrollTo(0, 0); // Reset scroll on route change
            import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
              ScrollTrigger.refresh(true);
              setTimeout(() => ScrollTrigger.refresh(true), 250);
            });
          });
      }
    });

    return () => ctx.revert();
  }, [location.pathname, location.key]);

  const curtainColor = (() => {
    const p = location.pathname;
    if (p.startsWith("/tools/")) return "#1a1a1a";
    if (p === "/")               return "#1a1a1a"; // Special Home color
    if (p === "/tools")          return "#F9FF00";
    if (p === "/promise")        return "#00FF87";
    if (p === "/roster")         return "#00E5FF";
    if (p === "/inquiry")        return "#7C3AED";
    if (p === "/about")          return "#F9FF00";
    if (p === "/pricing")        return "#FF0004";
    if (p === "/how-to-use")     return "#00E5FF";
    if (p === "/changelog")      return "#7C3AED";
    if (p === "/tools-guide")    return "#FF0004";
    if (p === "/account")        return "#F9FF00";
    if (p === "/login")          return "#7C3AED";
    if (p === "/dashboard")      return "#00E5FF";
    if (p === "/contact")        return "#7C3AED";
    if (p === "/privacy")        return "#00E5FF";
    if (p === "/terms")          return "#F9FF00";
    if (p === "/cookies")        return "#00FF87";
    if (p === "/agreement")      return "#FF0004";
    if (p === "/security")       return "#00E5FF";
    if (p === "/open-source")    return "#00FF87";
    if (p === "/github")         return "#1a1a1a";
    return "#1a1a1a";
  })();

  const pageTitle = (() => {
    const p = location.pathname;
    if (p === "/")               return "CLEF";
    if (p.startsWith("/tools/")) return "LOADING TOOL...";
    if (p === "/tools")          return "FETCHING WORKBENCH...";
    if (p === "/promise")        return "INITIALIZING VALUES...";
    if (p === "/roster")         return "INITIALIZING ROSTER...";
    if (p === "/inquiry")        return "LOADING BOARD...";
    if (p === "/about")          return "OUR STORY...";
    if (p === "/pricing")        return "ZERO COST...";
    if (p === "/how-to-use")     return "GUIDE...";
    if (p === "/changelog")      return "HISTORY...";
    if (p === "/tools-guide")    return "TOOL REF...";
    if (p === "/account")        return "ACCOUNT CENTER...";
    if (p === "/login")          return "AUTHORIZING...";
    if (p === "/dashboard")      return "DASHBOARD...";
    if (p === "/contact")        return "CONNECT...";
    if (p === "/privacy")        return "SAFEGUARD...";
    if (p === "/terms")          return "LEGAL...";
    if (p === "/cookies")        return "LOCAL DATA...";
    if (p === "/agreement")      return "AGREEMENT...";
    if (p === "/security")       return "HARDENING...";
    if (p === "/open-source")    return "COMMUNITY...";
    if (p === "/github")         return "REPOSITORY...";
    return "CLEF...";
  })();

  return (
    <>
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[9990] flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ background: curtainColor, transformOrigin: "top center", scaleY: 1 }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 opacity-20 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="kinetic-line w-full h-[2px] bg-white/30 scale-x-0" />
          ))}
        </div>
        <div ref={textRef} className="opacity-0 relative z-10">
          <span className={`font-oswald text-4xl md:text-8xl font-black uppercase tracking-tighter ${curtainColor === "#1a1a1a" || curtainColor === "#7C3AED" || curtainColor === "#FF0004" ? "text-white" : "text-black"}`}>
            {pageTitle}
          </span>
        </div>
      </div>
      <div ref={wrapRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  );
}
