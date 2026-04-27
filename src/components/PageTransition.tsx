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
      gsap.set(curtain, { scaleY: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });

      if (isFirstLoad) {
        gsap.set(curtain, { scaleY: 0 });
        tl.fromTo(
          wrap,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        ).set(wrap, { clearProps: "transform" });
      } else {
        // Sweep up + fade content
        tl.set(curtain, { scaleY: 1, transformOrigin: "top center" })
          .fromTo(text, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 })
          .to(curtain, {
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
          .add(() => {
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
    if (p === "/tools")          return "#F9FF00";
    if (p === "/promise")        return "#00FF87";
    if (p === "/roster")         return "#00E5FF";
    if (p === "/inquiry")        return "#7C3AED";
    if (p === "/about")          return "#F9FF00";
    if (p === "/pricing")        return "#FF0004"; // Red for pricing
    if (p === "/how-to-use")     return "#00E5FF";
    if (p === "/changelog")      return "#7C3AED";
    if (p === "/tools-guide")    return "#FF0004";
    return "#1a1a1a";
  })();

  const pageTitle = (() => {
    const p = location.pathname;
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
    if (p === "/security")      return "HARDENING...";
    return "CLEF...";
  })();

  return (
    <>
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[9990] flex items-center justify-center pointer-events-none"
        style={{ background: curtainColor, transformOrigin: "top center", scaleY: 1 }}
      >
        <div ref={textRef} className="opacity-0">
          <span className={`font-oswald text-4xl md:text-6xl font-black uppercase tracking-tighter ${curtainColor === "#1a1a1a" || curtainColor === "#7C3AED" || curtainColor === "#FF0004" ? "text-white" : "text-black"}`}>
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
