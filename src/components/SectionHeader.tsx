import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowColor?: string;
  title: string;
  accentLast?: boolean;
  accentStyle?: "gradient-fire" | "gradient-cyber" | "gradient-yellow" | "gradient-purple" | "outline";
  subtitle?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg" | "xl";
  mixWeights?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "text-3xl md:text-4xl",
  md: "text-4xl md:text-5xl lg:text-6xl",
  lg: "text-5xl md:text-6xl lg:text-7xl",
  xl: "text-5xl md:text-7xl lg:text-8xl",
};

export function SectionHeader({
  eyebrow,
  eyebrowColor = "#FF0004",
  title,
  accentLast = false,
  accentStyle = "gradient-fire",
  subtitle,
  align = "left",
  size = "lg",
  mixWeights = false,
  className = "",
}: SectionHeaderProps) {
  const rootRef    = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const wordsRef   = useRef<HTMLSpanElement[]>([]);
  const subRef     = useRef<HTMLParagraphElement>(null);

  const words = title.split(" ");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Pre-set will-change on word spans for GPU compositing
    wordsRef.current.filter(Boolean).forEach(el => {
      el.style.willChange = "transform, opacity";
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          toggleActions: "play none none none",
        },
        onComplete: () => {
          // Release GPU memory after animation
          wordsRef.current.filter(Boolean).forEach(el => {
            el.style.willChange = "auto";
          });
        },
      });

      // Eyebrow slides in from left — subtle, fast
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { x: -16, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.35, ease: "power2.out", force3D: true }
        );
      }

      // Words clip up — the kinetic type effect
      const wordEls = wordsRef.current.filter(Boolean);
      if (wordEls.length) {
        tl.fromTo(
          wordEls,
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.55,
            stagger: 0.05,   // tighter stagger = snappier
            ease: "power4.out",
            force3D: true,
          },
          eyebrowRef.current ? "-=0.15" : "0"
        );
      }

      // Subtitle fades in — no blur (blur causes jank)
      if (subRef.current) {
        tl.fromTo(
          subRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", force3D: true },
          "-=0.25"
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  const alignClass =
    align === "center" ? "text-center items-center" :
    align === "right"  ? "text-right items-end" :
    "text-left items-start";

  const accentClass = (() => {
    if (accentStyle === "gradient-fire")   return "text-gradient-fire";
    if (accentStyle === "gradient-cyber")  return "text-gradient-cyber";
    if (accentStyle === "gradient-yellow") return "text-gradient-yellow";
    if (accentStyle === "gradient-purple") return "text-gradient-purple";
    if (accentStyle === "outline")         return "text-outline-black";
    return "";
  })();

  return (
    <div ref={rootRef} className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow && (
        <span
          ref={eyebrowRef}
          className="text-label block opacity-0"
          style={{ color: eyebrowColor }}
        >
          {eyebrow}
        </span>
      )}

      <h2
        className={`font-oswald font-bold uppercase tracking-[-0.03em] ${sizeMap[size]}`}
        style={{ lineHeight: "0.92" }}
      >
        {words.map((word, i) => {
          const isAccented = accentLast && i === words.length - 1;
          const weightClass = mixWeights
            ? i % 2 === 0 ? "font-bold" : "font-[400] tracking-[0.04em]"
            : "font-bold";

          return (
            <span
              key={i}
              className="inline-block overflow-hidden align-bottom mr-[0.2em] last:mr-0"
            >
              <span
                ref={el => { if (el) wordsRef.current[i] = el; }}
                className={`inline-block opacity-0 ${weightClass} ${isAccented ? accentClass : ""}`}
              >
                {word}
              </span>
            </span>
          );
        })}
      </h2>

      {subtitle && (
        <p
          ref={subRef}
          className="font-inter text-sm leading-relaxed text-[#1a1a1a]/60 max-w-lg opacity-0"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
