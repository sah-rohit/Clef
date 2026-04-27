import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    num: "01",
    title: "100% FREE",
    desc: "Every tool on Clef is completely free. No premium tiers, no paywalls, no hidden charges. What you see is what you get.",
    status: "ALWAYS",
    color: "yellow",
    details: [
      "No credit card required",
      "No usage limits",
      "No premium upsells",
      "Free forever — we mean it",
    ],
  },
  {
    num: "02",
    title: "PRIVACY FIRST",
    desc: "Everything runs in your browser. We don't collect, store, or transmit your data. Your files, your code, your work — stays with you.",
    status: "SECURE",
    color: "red",
    details: [
      "Client-side processing only",
      "No data sent to servers",
      "No analytics or tracking",
      "Your privacy is respected",
    ],
  },
  {
    num: "03",
    title: "BUILT FOR EVERYONE",
    desc: "Whether you're a developer debugging code, a writer formatting text, or someone who just needs a QR code — we've got you covered.",
    status: "UNIVERSAL",
    color: "cyan",
    details: [
      "Developer tools & utilities",
      "Productivity essentials",
      "Everyday converters",
      "Simple, clean interfaces",
    ],
  },
  {
    num: "04",
    title: "OPEN SOURCE",
    desc: "Every line of code is public. Fork it, audit it, contribute to it. Clef is built in the open because trust is earned, not claimed.",
    status: "PUBLIC",
    color: "green",
    details: [
      "MIT licensed — fully open",
      "Community contributions welcome",
      "No black-box algorithms",
      "Audit the code yourself",
    ],
  },
];

export function OurPromiseSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useScrollReveal<HTMLDivElement>({ x: -30, y: 0, duration: 0.7 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute("data-step") || "0");
            setActiveStep(idx);
          }
        });
      },
      { threshold: 0.5 }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-step]");
    cards?.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="promise"
      ref={sectionRef}
      className="border-b-[3px] border-black bg-white"
    >
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Sticky Left Column — yellow bg */}
        <div ref={leftColRef} className="md:col-span-4 lg:col-span-3 border-r-[3px] border-black md:sticky md:top-0 md:h-screen flex flex-col justify-center px-6 md:px-10 py-12 md:py-0 bg-[#F9FF00]">
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">WHY CLEF</span>
          <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6">
            OUR<br /><span className="text-outline-black">PROMISE.</span>
          </h2>
          <p className="font-inter text-sm leading-relaxed text-black/65 mb-8">
            Four core principles that drive everything we build. No compromises, no exceptions.
          </p>
          <div className="flex gap-2">
            {features.map((f, i) => (
              <div
                key={i}
                className={`h-3 flex-1 border-[3px] border-black transition-all duration-300 ${
                  i === activeStep
                    ? f.color === "yellow" ? "bg-[#1a1a1a]"
                      : f.color === "red"  ? "bg-[#FF0004]"
                      : f.color === "cyan" ? "bg-[#00E5FF]"
                      : f.color === "green"? "bg-[#00FF87]"
                      : "bg-[#7C3AED]"
                    : "bg-black/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Features */}
        <div className="md:col-span-8 lg:col-span-9">
          {features.map((feature, i) => {
            const sectionBg =
              feature.color === "yellow" ? "#F9FF00"
              : feature.color === "red"  ? "#FF0004"
              : feature.color === "cyan" ? "#00E5FF"
              : feature.color === "green"? "#00FF87"
              : "#7C3AED";
            const isLight = ["yellow","cyan","green"].includes(feature.color);
            return (
              <div
                key={i}
                data-step={i}
                className="border-b-[3px] border-black px-6 md:px-12 py-16 md:py-20 min-h-[60vh] flex flex-col justify-center transition-colors duration-500"
                style={{ background: i % 2 === 0 ? "white" : "#fafafa" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-oswald text-7xl md:text-9xl font-bold text-black/[0.06] leading-none select-none">
                        {feature.num}
                      </span>
                      <span
                        className={`font-oswald text-xs font-bold uppercase tracking-widest px-3 py-1.5 border-[3px] border-black ${
                          isLight ? "text-black" : "text-white"
                        }`}
                        style={{ background: sectionBg }}
                      >
                        {feature.status}
                      </span>
                    </div>
                    <h3 className="font-oswald text-3xl md:text-4xl font-bold uppercase tracking-[-0.02em] mb-4">
                      {feature.title}
                    </h3>
                    <p className="font-inter text-sm leading-relaxed text-black/65 max-w-md">
                      {feature.desc}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="border-[3px] border-black">
                      {feature.details.map((detail, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-4 px-4 py-3.5 border-b-[3px] border-black last:border-b-0 group hover:text-black transition-colors"
                          style={{ ["--hover-bg" as string]: sectionBg }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = sectionBg; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                        >
                          <span className="font-oswald text-xs font-bold" style={{ color: sectionBg === "#F9FF00" ? "#1a1a1a" : sectionBg }}>
                            {feature.num}.{j + 1}
                          </span>
                          <span className="font-inter text-sm font-medium uppercase tracking-wide">
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
