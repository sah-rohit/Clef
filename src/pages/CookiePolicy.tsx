import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero — green bg */}
      <div className="bg-[#00FF87] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-24 relative z-10">
          <div className="mb-6"><BackButton /></div>
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">LEGAL</span>
          <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6">
            COOKIE<br /><span className="text-outline-black">POLICY.</span>
          </h1>
          <p className="font-inter text-base text-black/65 leading-relaxed italic max-w-xl">
            "Everything local. No tracking."
          </p>
        </div>
        <div className="absolute -bottom-4 -right-4 font-oswald text-[180px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">LOCAL</div>
      </div>

      {/* Content — dark bg */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20 max-w-4xl">
          <div className="space-y-0 border-[3px] border-white/10">
            {[
              { num: "1", color: "#F9FF00", title: "WHAT ARE COOKIES",    text: "Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide reporting information." },
              { num: "2", color: "#00E5FF", title: "HOW WE USE COOKIES",  text: "We use cookies to understand how you interact with our tools and to save your preferences. Specifically, we use local storage to save your generated data and tool preferences so that your data remains private and local to your device." },
              { num: "3", color: "#00FF87", title: "TYPES WE USE",        text: "Essential Cookies: Required for the operation of our tools. Preference Cookies: Used to remember your settings. Local Storage: We heavily utilize browser local storage instead of traditional cookies to keep your data private and completely offline where possible." },
              { num: "4", color: "#7C3AED", title: "MANAGING COOKIES",    text: "You can control and delete cookies as you wish. You can delete all cookies already on your computer and set most browsers to prevent them from being placed. If you do this, you may have to manually adjust some preferences every time you visit." },
            ].map((s, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 border-b-[3px] border-white/10 last:border-b-0">
                <div className="md:col-span-3 px-6 py-6 border-b-[3px] md:border-b-0 md:border-r-[3px] border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center font-oswald text-sm font-bold border-[2px]"
                    style={{ borderColor: s.color, color: s.color }}>{s.num}</div>
                  <span className="font-oswald text-sm font-bold uppercase text-white">{s.title}</span>
                </div>
                <div className="md:col-span-9 px-6 py-6">
                  <p className="font-inter text-sm text-white/60 leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
