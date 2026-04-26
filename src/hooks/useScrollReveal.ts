import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Register expo easing — smoother deceleration than power3
gsap.registerEase("expo.out", (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

type RevealOptions = {
  y?: number;
  x?: number;
  scale?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  selector?: string;
};

export function useScrollReveal<T extends HTMLElement>(opts: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y       = 24,          // reduced from 40 — less travel = snappier
      x       = 0,
      scale   = 1,
      opacity = 0,
      duration = 0.65,
      stagger  = 0,
      delay    = 0,
      ease     = "expo.out", // smoother than power3
      selector,
    } = opts;

    const targets = selector
      ? Array.from(el.querySelectorAll<HTMLElement>(selector))
      : [el];

    // Set will-change before animation for GPU compositing
    (targets as HTMLElement[]).forEach(t => {
      t.style.willChange = "transform, opacity";
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, x, scale, opacity },
        {
          y: 0, x: 0, scale: 1, opacity: 1,
          duration,
          stagger,
          delay,
          ease,
          force3D: true,   // always use GPU layer
          scrollTrigger: {
            trigger: el,
            start: "top 90%",  // trigger a bit earlier for smoother feel
            toggleActions: "play none none none",
          },
          onComplete: () => {
            // Release will-change after animation to free GPU memory
            (targets as HTMLElement[]).forEach(t => {
              t.style.willChange = "auto";
            });
          },
        }
      );
    }, el);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
