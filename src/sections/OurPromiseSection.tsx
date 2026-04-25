import { useEffect, useRef, useState } from "react";

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
    color: "yellow",
    details: [
      "Developer tools & utilities",
      "Productivity essentials",
      "Everyday converters",
      "Simple, clean interfaces",
    ],
  },
];

export function OurPromiseSection() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

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
        {/* Sticky Left Column */}
        <div className="md:col-span-4 lg:col-span-3 border-r-[3px] border-black md:sticky md:top-0 md:h-screen flex flex-col justify-center px-6 md:px-10 py-12 md:py-0 bg-white">
          <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-4">
            Why Clef
          </span>
          <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-[-0.03em] leading-[0.95] mb-6">
            OUR
            <br />
            PROMISE
          </h2>
          <p className="font-inter text-sm leading-relaxed text-[#1a1a1a]/70 mb-8">
            Three core principles that drive everything we build.
            No compromises, no exceptions.
          </p>
          <div className="flex gap-2">
            {features.map((_, i) => (
              <div
                key={i}
                className={`h-3 flex-1 border-[3px] border-black transition-colors ${
                  i === activeStep ? "bg-[#F9FF00]" : "bg-white"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column - Features */}
        <div className="md:col-span-8 lg:col-span-9">
          {features.map((feature, i) => (
            <div
              key={i}
              data-step={i}
              className="border-b-[3px] border-black px-6 md:px-12 py-12 md:py-16 min-h-[60vh] flex flex-col justify-center hover:bg-[#F9FF00]/20 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-oswald text-6xl md:text-8xl font-bold text-[#1a1a1a]/10 leading-none">
                      {feature.num}
                    </span>
                    <span
                      className={`font-oswald text-xs font-bold uppercase tracking-widest px-3 py-1 border-[3px] border-black ${
                        feature.color === "yellow"
                          ? "bg-[#F9FF00]"
                          : "bg-[#FF0004] text-white"
                      }`}
                    >
                      {feature.status}
                    </span>
                  </div>
                  <h3 className="font-oswald text-3xl md:text-4xl font-bold uppercase tracking-[-0.02em] mb-4">
                    {feature.title}
                  </h3>
                  <p className="font-inter text-sm leading-relaxed text-[#1a1a1a]/70 max-w-md">
                    {feature.desc}
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  <div className="border-[3px] border-black">
                    {feature.details.map((detail, j) => (
                      <div
                        key={j}
                        className="flex items-center gap-4 px-4 py-3 border-b-[3px] border-black last:border-b-0 hover:bg-[#F9FF00] transition-colors"
                      >
                        <span className="font-oswald text-xs font-bold text-[#FF0004]">
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
          ))}
        </div>
      </div>
    </section>
  );
}
