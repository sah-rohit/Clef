import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router";
import {
  MousePointer, Search, Zap, Shield, Bot, Download,
  ArrowRight, CheckCircle, Keyboard, Wifi, Lock,
  RefreshCw, Star, ChevronRight, ArrowUpRight,
} from "lucide-react";

const steps = [
  {
    num: "01", color: "#F9FF00", bg: "#F9FF00", textColor: "text-black",
    title: "PICK YOUR TOOL",
    desc: "From the homepage, scroll to the Tools section or use the search bar to find what you need. Tools are grouped by category: Developer, Productivity, and Utility.",
    tips: ["Use the search bar to filter by name", "Filter by category using the tab bar", "Each card shows the tool name and description", "Click any card to open the tool instantly"],
  },
  {
    num: "02", color: "#00E5FF", bg: "#00E5FF", textColor: "text-black",
    title: "USE IT — NO SETUP",
    desc: "Every tool opens immediately. No account required, no loading screens, no configuration. Just start working. All processing happens in your browser.",
    tips: ["No sign-up needed for any tool", "Your work is never sent to a server", "Tools work offline after first load (PWA)", "Use keyboard shortcuts where available"],
  },
  {
    num: "03", color: "#00FF87", bg: "#00FF87", textColor: "text-black",
    title: "EXPORT YOUR RESULTS",
    desc: "When you're done, download your output directly to your device. Files are generated locally — no cloud upload, no waiting.",
    tips: ["Download buttons are always visible", "Copy-to-clipboard on most tools", "Files saved directly to Downloads", "No file size limits"],
  },
  {
    num: "04", color: "#7C3AED", bg: "#7C3AED", textColor: "text-white",
    title: "OPTIONALLY SIGN IN",
    desc: "Create a free account to unlock cross-device sync for your AI chat history and profile. Guest mode is fully functional — signing in is purely optional.",
    tips: ["Guest mode: everything stored locally", "Signed-in: AES-256 encrypted cloud sync", "Your tool usage is never tracked", "Sign out anytime — local data stays"],
  },
];

const features = [
  { icon: Bot,        color: "#7C3AED", bg: "#7C3AED", title: "CLEF AI",          desc: "An integrated AI assistant powered by Llama 3.1. Ask it to debug code, explain concepts, or help with writing. Click the robot icon in the bottom-right corner." },
  { icon: Search,     color: "#00E5FF", bg: "#00E5FF", title: "TOOL SEARCH",       desc: "The search bar on the homepage filters tools in real time. Type any keyword — tool name, category, or what you want to do." },
  { icon: Wifi,       color: "#00FF87", bg: "#00FF87", title: "OFFLINE MODE",      desc: "Clef is a Progressive Web App. After your first visit, all tools work without an internet connection. Install it to your home screen for app-like access." },
  { icon: Lock,       color: "#FF0004", bg: "#FF0004", title: "PRIVACY GUARANTEE", desc: "Zero analytics, zero tracking, zero cookies. Guest data lives only in your browser's localStorage. We literally cannot see what you're doing." },
  { icon: RefreshCw,  color: "#F9FF00", bg: "#F9FF00", title: "AI CHAT HISTORY",   desc: "Your AI conversations are saved locally and accessible via the History button. Sign in to sync them across devices with AES-256 encryption." },
  { icon: Star,       color: "#F9FF00", bg: "#F9FF00", title: "ALWAYS FREE",        desc: "Every tool, every feature, forever free. No premium tier, no trial period, no credit card. This is a personal project built for the community." },
];

const faqs = [
  { q: "Do I need to create an account?",    a: "No. Every tool works without an account. Signing in only adds optional cloud sync for AI chat history.",                                                                                    color: "#F9FF00" },
  { q: "Is my data safe?",                   a: "Yes. All tool processing happens in your browser. Nothing is sent to our servers. Guest data stays in localStorage on your device.",                                                        color: "#00E5FF" },
  { q: "Does it work offline?",              a: "Yes. Clef is a PWA. After your first visit, all tools work without internet. You can also install it to your home screen.",                                                                 color: "#00FF87" },
  { q: "How do I use Clef AI?",              a: "Click the robot icon in the bottom-right corner of any page. Type your question and press Enter. No API key needed — it's powered by our secure backend.",                                  color: "#7C3AED" },
  { q: "Can I use Clef on mobile?",          a: "Yes. The interface is fully responsive. For the best experience, install it as a PWA from your browser's 'Add to Home Screen' option.",                                                    color: "#FF0004" },
  { q: "How do I report a bug or suggest?",  a: "Use the Inquiry section on the homepage, or reach out directly via the Contact page. All feedback is read personally.",                                                                    color: "#F9FF00" },
];

export default function HowToUse() {
  const heroRef  = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.7 });
  const stepsRef = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6, delay: 0.1 });
  const featRef  = useScrollReveal<HTMLDivElement>({ y: 30, stagger: 0.08, selector: ".feat-card", duration: 0.55 });
  const kbRef    = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });
  const faqRef   = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* ── HERO — dark bg ── */}
      <div
        className="bg-[#1a1a1a] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}
      >
        <div ref={heroRef} className="px-6 md:px-12 lg:px-16 pt-28 pb-24 md:pt-36 md:pb-32 relative z-10">
          <div className="mb-10">
            <BackButton />
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#00E5FF] block mb-4">GETTING STARTED</span>
              <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white mb-6">
                HOW TO<br /><span className="text-gradient-cyber">USE CLEF.</span>
              </h1>
            </div>
            <p className="font-inter text-sm text-white/50 max-w-sm leading-relaxed md:text-right pb-2">
              Everything you need to know to get the most out of your daily workbench. No fluff, just the facts.
            </p>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 font-oswald text-[200px] font-bold text-white/[0.04] leading-none select-none pointer-events-none uppercase">GUIDE</div>
        {/* Color bar */}
        <div className="flex h-2">
          {["#F9FF00","#00E5FF","#00FF87","#7C3AED","#FF0004","#1a1a1a"].map((c) => (
            <div key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* ── Steps — alternating color backgrounds ── */}
      <div ref={stepsRef}>
        {steps.map((step, i) => (
          <div
            key={i}
            className="border-b-[3px] border-black"
            style={{ background: i % 2 === 0 ? step.bg : "#ffffff" }}
          >
            <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center gap-5 mb-6">
                    <div
                      className="w-16 h-16 border-[3px] border-black flex items-center justify-center font-oswald text-3xl font-bold flex-shrink-0"
                      style={{ background: i % 2 === 0 ? "#1a1a1a" : step.bg }}
                    >
                      <span style={{ color: i % 2 === 0 ? step.color : "#1a1a1a" }}>{step.num}</span>
                    </div>
                    <h2 className="font-oswald text-3xl md:text-4xl font-bold uppercase leading-tight"
                      style={{ color: i % 2 === 0 ? "#1a1a1a" : "#1a1a1a" }}>
                      {step.title}
                    </h2>
                  </div>
                  <p className="font-inter text-sm leading-relaxed mb-6"
                    style={{ color: i % 2 === 0 ? "rgba(26,26,26,0.7)" : "rgba(26,26,26,0.65)" }}>
                    {step.desc}
                  </p>
                </div>
                <div className="border-[3px] border-black" style={{ background: i % 2 === 0 ? "white" : step.bg }}>
                  {step.tips.map((tip, j) => (
                    <div key={j} className="flex items-center gap-3 px-5 py-4 border-b-[3px] border-black last:border-b-0">
                      <CheckCircle size={14} className="flex-shrink-0" style={{ color: i % 2 === 0 ? step.color === "#F9FF00" ? "#1a1a1a" : step.color : "#1a1a1a" }} />
                      <span className="font-inter text-xs uppercase tracking-wide font-medium">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Features deep-dive — dark bg ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="mb-16 text-center">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-4">FEATURE GUIDE</span>
            <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white">
              EVERYTHING<br /><span className="text-gradient-fire">CLEF CAN DO.</span>
            </h2>
          </div>
          <div ref={featRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-[3px] border-white/10">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="feat-card border-b-[3px] border-r-[3px] border-white/10 last:border-r-0 p-8 group hover:bg-white/5 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top left, ${f.color}12 0%, transparent 60%)` }} />
                  <div className="w-12 h-12 border-[3px] border-black flex items-center justify-center mb-6 relative z-10" style={{ background: f.bg }}>
                    <Icon size={20} className="text-black" />
                  </div>
                  <h4 className="font-oswald text-xl font-bold uppercase mb-3 text-white relative z-10">{f.title}</h4>
                  <p className="font-inter text-sm text-white/45 leading-relaxed relative z-10">{f.desc}</p>
                  <div className="mt-6 flex items-center gap-2 relative z-10">
                    <div className="w-6 h-[2px]" style={{ background: f.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Keyboard + PWA — white / purple split ── */}
      <div ref={kbRef} className="border-b-[3px] border-black">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Keyboard — purple bg */}
          <div className="bg-[#7C3AED] border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black p-10 md:p-14">
            <Keyboard size={36} className="mb-6 text-white" />
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 block mb-3">SHORTCUTS</span>
            <h2 className="font-oswald text-4xl font-bold uppercase text-white mb-6">KEYBOARD<br />SHORTCUTS</h2>
            <p className="font-inter text-sm text-white/60 leading-relaxed mb-8">
              Most tools support standard browser shortcuts. A few Clef-specific ones to know:
            </p>
            <div className="border-[3px] border-white/20 bg-black/20">
              {[
                { keys: "Ctrl + /",       action: "Open Clef AI" },
                { keys: "Ctrl + K",       action: "Focus search bar" },
                { keys: "Ctrl + S",       action: "Download / save output" },
                { keys: "Ctrl + Shift+C", action: "Copy output to clipboard" },
                { keys: "Escape",         action: "Close modals and panels" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b-[2px] border-white/10 last:border-b-0">
                  <span className="font-inter text-xs text-white/60 uppercase tracking-wide">{s.action}</span>
                  <kbd className="font-mono text-[10px] font-bold bg-white/10 border border-white/20 px-2 py-1 text-white">{s.keys}</kbd>
                </div>
              ))}
            </div>
          </div>
          {/* PWA — white bg */}
          <div className="bg-white p-10 md:p-14">
            <MousePointer size={36} className="mb-6" style={{ color: "#00E5FF" }} />
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/40 block mb-3">INSTALL</span>
            <h2 className="font-oswald text-4xl font-bold uppercase mb-6">INSTALL<br /><span className="text-gradient-cyber">AS AN APP</span></h2>
            <p className="font-inter text-sm text-black/60 leading-relaxed mb-8">
              Clef is a Progressive Web App. Install it for instant access without opening a browser tab.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { platform: "CHROME / EDGE", step: "Click the install icon (⊕) in the address bar, then 'Install'",  color: "#00E5FF" },
                { platform: "SAFARI (iOS)",  step: "Tap the Share button → 'Add to Home Screen'",                     color: "#00FF87" },
                { platform: "FIREFOX",       step: "Tap the three-dot menu → 'Install'",                              color: "#F9FF00" },
                { platform: "ANDROID",       step: "Tap the three-dot menu → 'Add to Home Screen'",                   color: "#FF0004" },
              ].map((p, i) => (
                <div key={i} className="flex gap-4 border-[3px] border-black p-4 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all duration-200">
                  <div className="w-2 h-2 mt-1.5 flex-shrink-0 rotate-45" style={{ background: p.color }} />
                  <div>
                    <span className="font-oswald text-xs font-bold uppercase block mb-1">{p.platform}</span>
                    <span className="font-inter text-xs text-black/60">{p.step}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── FAQ — yellow bg ── */}
      <div className="bg-[#F9FF00] border-b-[3px] border-black">
        <div ref={faqRef} className="px-6 md:px-12 lg:px-16 py-20 md:py-28">
          <div className="mb-14 text-center">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 block mb-4">FAQ</span>
            <h2 className="font-oswald text-5xl md:text-7xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black">
              COMMON<br /><span className="text-outline-black">QUESTIONS.</span>
            </h2>
          </div>
          <div className="border-[3px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b-[3px] border-black last:border-b-0 grid grid-cols-1 md:grid-cols-2">
                <div className="px-8 py-6 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black flex items-center gap-4">
                  <div className="w-3 h-3 flex-shrink-0 rotate-45" style={{ background: faq.color }} />
                  <h4 className="font-oswald text-base font-bold uppercase">{faq.q}</h4>
                </div>
                <div className="px-8 py-6">
                  <p className="font-inter text-sm text-black/70 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA — dark bg ── */}
      <div className="bg-[#1a1a1a] border-b-[3px] border-black relative overflow-hidden">
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-oswald text-5xl md:text-6xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white mb-4">
                READY TO<br /><span className="text-gradient-yellow">START BUILDING?</span>
              </h2>
              <p className="font-inter text-sm text-white/50 max-w-md leading-relaxed">
                28 tools, zero cost, no account required. Your workbench is waiting.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/tools"
                className="group bg-[#F9FF00] border-[3px] border-[#F9FF00] text-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-4 hover:bg-white transition-all duration-200 shadow-[0_0_30px_rgba(249,255,0,0.3)] hover:-translate-y-0.5">
                EXPLORE ALL TOOLS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/changelog"
                className="border-[3px] border-white/20 text-white font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-4 hover:border-white hover:bg-white/10 transition-all duration-200">
                SEE WHAT'S NEW <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] opacity-[0.05]"
            style={{ background: "radial-gradient(ellipse, #F9FF00 0%, transparent 70%)" }} />
        </div>
      </div>

      <Footer />
    </div>
  );
}
