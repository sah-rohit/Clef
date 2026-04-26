import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealOptions = {
  y?: number;
  x?: number;
  scale?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  selector?: string; // child selector to animate instead of root
};

/**
 * Attach a GSAP ScrollTrigger reveal to a container ref.
 * Elements with class `gsap-reveal` inside the container are animated.
 * If `selector` is provided, those children are staggered.
 */
export function useScrollReveal<T extends HTMLElement>(opts: RevealOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 40,
      x = 0,
      scale = 1,
      opacity = 0,
      duration = 0.7,
      stagger = 0,
      delay = 0,
      ease = "power3.out",
      selector,
    } = opts;

    const targets = selector ? el.querySelectorAll(selector) : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, x, scale, opacity, filter: "blur(4px)" },
        {
          y: 0, x: 0, scale: 1, opacity: 1, filter: "blur(0px)",
          duration,
          stagger,
          delay,
          ease,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
