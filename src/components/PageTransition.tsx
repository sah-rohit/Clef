import { useEffect, useRef, ReactNode } from "react";
import { useLocation } from "react-router";
import gsap from "gsap";

interface Props { children: ReactNode }

/**
 * Wraps every page in a GSAP enter + exit animation.
 * Enter: content slides up + fades in from below.
 * Exit: content slides up + fades out (triggered before navigation).
 *
 * We use a key on the wrapper so React remounts on route change,
 * which triggers the enter animation automatically.
 * The exit overlay is a fixed full-screen curtain that sweeps in/out.
 */
export function PageTransition({ children }: Props) {
  const location = useLocation();
  const wrapRef   = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  // Enter animation — runs on every mount (route change remounts this)
  useEffect(() => {
    const wrap    = wrapRef.current;
    const curtain = curtainRef.current;
    if (!wrap || !curtain) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Curtain sweeps down then up (reveal)
      tl.set(curtain, { scaleY: 1, transformOrigin: "top center" })
        .to(curtain, {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.55,
          ease: "power3.inOut",
        })
        // Content fades + rises while curtain is leaving
        .fromTo(
          wrap,
          { opacity: 0, y: 28, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out" },
          "-=0.25"
        );
    });

    return () => ctx.revert();
  // location.key changes on every navigation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Determine curtain color based on route for variety
  const curtainColor = (() => {
    const p = location.pathname;
    if (p.startsWith("/tools/")) return "#1a1a1a";
    if (p === "/about")          return "#F9FF00";
    if (p === "/pricing")        return "#00FF87";
    if (p === "/how-to-use")     return "#00E5FF";
    if (p === "/changelog")      return "#7C3AED";
    if (p === "/tools-guide")    return "#FF0004";
    return "#1a1a1a";
  })();

  return (
    <>
      {/* Curtain overlay */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[9990] pointer-events-none"
        style={{ background: curtainColor, transformOrigin: "top center", scaleY: 1 }}
      />
      {/* Page content */}
      <div ref={wrapRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  );
}
