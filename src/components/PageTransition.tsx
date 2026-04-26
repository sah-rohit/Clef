import { useEffect, useRef, ReactNode } from "react";
import { useLocation } from "react-router";
import gsap from "gsap";

interface Props { children: ReactNode }

export function PageTransition({ children }: Props) {
  const location   = useLocation();
  const wrapRef    = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  // Track the previous pathname so we only animate on real page changes
  const prevPath   = useRef<string | null>(null);

  useEffect(() => {
    const wrap    = wrapRef.current;
    const curtain = curtainRef.current;
    if (!wrap || !curtain) return;

    const currentPath = location.pathname;
    const isFirstLoad = prevPath.current === null;
    const isSamePage  = prevPath.current === currentPath;

    prevPath.current = currentPath;

    // Skip transition for:
    // 1. Hash-only navigation on the same page (/#tools → /#roster)
    // 2. First load gets a lighter entrance (no curtain)
    if (isSamePage) {
      // Same pathname, just a hash change — no transition at all
      gsap.set(wrap, { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(curtain, { scaleY: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (isFirstLoad) {
        // First load: simple fade-in, no curtain sweep
        gsap.set(curtain, { scaleY: 0 });
        tl.fromTo(
          wrap,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", force3D: true }
        );
      } else {
        // Real page change: curtain sweeps in from top, then retracts
        tl.set(curtain, { scaleY: 1, transformOrigin: "top center" })
          .to(curtain, {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 0.6,        // was 0.45 — slightly slower
            ease: "power2.inOut", // was power3 — gentler curve
            force3D: true,
          })
          .fromTo(
            wrap,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", force3D: true },
            "-=0.2"
          );
      }
    });

    return () => ctx.revert();
  // Re-run when pathname OR key changes — but the isSamePage guard
  // prevents the animation when only the hash changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.key]);

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
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[9990] pointer-events-none"
        style={{ background: curtainColor, transformOrigin: "top center", scaleY: 1 }}
      />
      <div ref={wrapRef} style={{ opacity: 0 }}>
        {children}
      </div>
    </>
  );
}
