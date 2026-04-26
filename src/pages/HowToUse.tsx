import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { SectionHeader } from "@/components/SectionHeader";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router";
import {
  MousePointer, Search, Zap, Shield, Bot, Download,
  ArrowRight, CheckCircle, Keyboard, Moon, Wifi, Lock,
  User, RefreshCw, Star, ChevronRight
} from "lucide-react";

const steps = [
  {
    num: "01",
    color: "#F9FF00",
    textColor: "text-black",
    title: "PICK YOUR TOOL",
    desc: "From the homepage, scroll to the Tools section or use the search bar to find what you need. Tools are grouped by category: Developer, Productivity, and Utility.",
    tips: [
      "Use the search bar to filter by name or description",
      "Filter by category using the tab bar",
      "Each card shows the tool name and a short description",
      "Click any card to open the tool instantly",
    ],
  },
  {
    num: "02",
    color: "#00E5FF",
    textColor: "text-black",
    title: "USE IT — NO SETUP",
    desc: "Every tool opens immediately. No account required, no loading screens, no configuration. Just start working. All processing happens in your browser.",
    tips: [
      "No sign-up needed for any tool",
      "Your work is never sent to a server",
      "Tools work offline after first load (PWA)",
      "Use keyboard shortcuts where available",
    ],
  },
  {
    num: "03",
    color: "#00FF87",
    textColor: "text-black",
    title: "EXPORT YOUR RESULTS",
    desc: "When you're done, download your output directly to your device. Files are generated locally — no cloud upload, no waiting.",
    tips: [
      "Download buttons are always visible",
      "Copy-to-clipboard is available on most tools",
      "Files are saved directly to your Downloads folder",
      "No file size limits",
    ],
  },
  {
    num: "04",
    color: "#7C3AED",
    textColor: "text-white",
    title: "OPTIONALLY SIGN IN",
    desc: "Create a free account to unlock cross-device sync for your AI chat history and profile. Guest mode is fully functional — signing in is purely optional.",
    tips: [
      "Guest mode: everything stored locally",
      "Signed-in mode: AES-256 encrypted cloud sync",
      "Your tool usage is never tracked either way",
      "Sign out anytime — your local data stays",
    ],
  },
];

const features = [
  {
    icon: Bot,
    color: "#F9FF00",
    title: "CLEF AI",
    desc: "An integrated AI assistant powered by Llama 3.1. Ask it to debug code, explain concepts, or help with writing. Click the robot icon in the bottom-right corner.",
  },
  {
    icon: Search,
    color: "#00E5FF",
    title: "TOOL SEARCH",
    desc: "The search bar on the homepage filters tools in real time. Type any keyword — tool name, category, or what you want to do.",
  },
  {
    icon: Wifi,
    color: "#00FF87",
    title: "OFFLINE MODE",
    desc: "Clef is a Progressive Web App. After your first visit, all tools work without an internet connection. Install it to your home screen for app-like access.",
  },
  {
    icon: Lock,
    color: "#FF0004",
    title: "PRIVACY GUARANTEE",
    desc: "Zero analytics, zero tracking, zero cookies. Guest data lives only in your browser's localStorage. We literally cannot see what you're doing.",
  },
  {
    icon: RefreshCw,
    color: "#7C3AED",
    title: "AI CHAT HISTORY",
    desc: "Your AI conversations are saved locally and accessible via the History button. Sign in to sync them across devices with AES-256 encryption.",
  },
  {
    icon: Star,
    color: "#F9FF00",
    title: "ALWAYS FREE",
    desc: "Every tool, every feature, forever free. No premium tier, no trial period, no credit card. This is a personal project built for the community.",
  },
];

const faqs = [
  {
    q: "Do I need to create an account?",
    a: "No. Every tool works without an account. Signing in only adds optional cloud sync for AI chat history.",
    color: "#F9FF00",
  },
  {
    q: "Is my data safe?",
    a: "Yes. All tool processing happens in your browser. Nothing is sent to our servers. Guest data stays in localStorage on your device.",
    color: "#00E5FF",
  },
  {
    q: "Does it work offline?",
    a: "Yes. Clef is a PWA. After your first visit, all tools work without internet. You can also install it to your home screen.",
    color: "#00FF87",
  },
  {
    q: "How do I use Clef AI?",
    a: "Click the robot icon in the bottom-right corner of any page. Type your question and press Enter. No API key needed — it's powered by our secure backend.",
    color: "#7C3AED",
  },
  {
    q: "Can I use Clef on mobile?",
    a: "Yes. The interface is fully responsive. For the best experience, install it as a PWA from your browser's 'Add to Home Screen' option.",
    color: "#FF0004",
  },
  {
    q: "How do I report a bug or suggest a tool?",
    a: "Use the Inquiry section on the homepage, or reach out directly via the Contact page. All feedback is read personally.",
    color: "#F9FF00",
  },
];

export default function HowToUse() {
  const heroRef    = useScrollReveal<HTMLDivElement>({ y: 40, duration: 0.7 });
  const stepsRef   = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6, delay: 0.1 });
  const featRef    = useScrollReveal<HTMLDivElement>({ y: 30, stagger: 0.08, selector: ".feat-card", duration: 0.55 });
  const kbRef      = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });
  const faqRef     = useScrollReveal<HTMLDivElement>({ y: 30, duration: 0.6 });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="page-top pb-20">
        {/* Header */}
        <div ref={heroRef} className="px-6 md:px-12 lg:px-16 mb-16">
          <BackButton />
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
            <SectionHeader
              eyebrow="Getting Started"
              eyebrowColor="#00E5FF"
              title="HOW TO USE CLEF."
              accentLast
              accentStyle="gradient-cyber"
              size="xl"
              mixWeights
            />
            <p className="font-inter text-sm text-black/60 max-w-sm leading-relaxed md:text-right">
              Everything you need to know to get the most out of your daily workbench. No fluff, just the facts.
            </p>
          </div>
        </div>

        {/* Color bar */}
        <div className="flex h-2 mb-16">
          {["#F9FF00", "#00E5FF", "#00FF87", "#7C3AED", "#FF0004", "#1a1a1a"].map((c) => (
            <div key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="px-6 md:px-12 lg:px-16 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-[3px] border-black">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`p-8 md:p-12 border-b-[3px] border-black last:border-b-0 lg:border-b-[3px] lg:last:border-b-0 ${
                  i % 2 === 0 ? "lg:border-r-[3px]" : ""
                } ${i >= 2 ? "lg:border-b-0" : ""}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-14 h-14 border-[3px] border-black flex items-center justify-center font-oswald text-2xl font-bold flex-shrink-0"
                    style={{ background: step.color }}
                  >
                    <span className={step.textColor}>{step.num}</span>
                  </div>
                  <h3 className="font-oswald text-2xl md:text-3xl font-bold uppercase leading-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="font-inter text-sm text-black/70 leading-relaxed mb-6">
                  {step.desc}
                </p>
                <div className="border-[3px] border-black">
                  {step.tips.map((tip, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3 px-4 py-3 border-b-[3px] border-black last:border-b-0"
                    >
                      <CheckCircle size={14} className="flex-shrink-0" style={{ color: step.color === "#7C3AED" ? "#7C3AED" : step.color }} />
                      <span className="font-inter text-xs uppercase tracking-wide font-medium">
                        {tip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features deep-dive */}
        <div className="px-6 md:px-12 lg:px-16 mb-24">
          <div className="mb-10">
            <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-2">
              Feature Guide
            </span>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-[-0.03em]">
              EVERYTHING CLEF CAN DO.
            </h2>
          </div>
          <div ref={featRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-[3px] border-black">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="feat-card p-8 border-b-[3px] border-r-[3px] border-black last:border-r-0 group hover:bg-[#fafafa] transition-colors hover-lift"
                >
                  <div
                    className="w-10 h-10 border-[3px] border-black flex items-center justify-center mb-5"
                    style={{ background: f.color }}
                  >
                    <Icon size={18} className="text-black" />
                  </div>
                  <h4 className="font-oswald text-lg font-bold uppercase mb-3">{f.title}</h4>
                  <p className="font-inter text-xs text-black/60 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Keyboard shortcuts */}
        <div ref={kbRef} className="px-6 md:px-12 lg:px-16 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-[3px] border-black">
            <div className="p-10 border-r-[3px] border-black bg-[#1a1a1a] text-white">
              <Keyboard size={32} className="mb-6" style={{ color: "#F9FF00" }} />
              <h2 className="font-oswald text-3xl font-bold uppercase mb-4">KEYBOARD SHORTCUTS</h2>
              <p className="font-inter text-sm text-white/60 leading-relaxed mb-8">
                Most tools support standard browser shortcuts. A few Clef-specific ones to know:
              </p>
              <div className="space-y-3">
                {[
                  { keys: "Ctrl + /", action: "Open Clef AI" },
                  { keys: "Ctrl + K", action: "Focus search bar (homepage)" },
                  { keys: "Ctrl + S", action: "Download / save output (in tools)" },
                  { keys: "Ctrl + Shift + C", action: "Copy output to clipboard" },
                  { keys: "Escape", action: "Close modals and panels" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                    <span className="font-inter text-xs text-white/60 uppercase tracking-wide">{s.action}</span>
                    <kbd className="font-mono text-[10px] font-bold bg-white/10 border border-white/20 px-2 py-1">
                      {s.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-10">
              <MousePointer size={32} className="mb-6" style={{ color: "#00E5FF" }} />
              <h2 className="font-oswald text-3xl font-bold uppercase mb-4">INSTALL AS AN APP</h2>
              <p className="font-inter text-sm text-black/60 leading-relaxed mb-8">
                Clef is a Progressive Web App. Install it for instant access without opening a browser tab.
              </p>
              <div className="space-y-4">
                {[
                  { platform: "CHROME / EDGE", step: "Click the install icon (⊕) in the address bar, then 'Install'" },
                  { platform: "SAFARI (iOS)", step: "Tap the Share button → 'Add to Home Screen'" },
                  { platform: "FIREFOX", step: "Tap the three-dot menu → 'Install'" },
                  { platform: "ANDROID", step: "Tap the three-dot menu → 'Add to Home Screen'" },
                ].map((p, i) => (
                  <div key={i} className="flex gap-4 border-b-[3px] border-black pb-4 last:border-b-0 last:pb-0">
                    <div className="w-2 h-2 mt-1.5 flex-shrink-0 rotate-45" style={{ background: "#00E5FF" }} />
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

        {/* FAQ */}
        <div ref={faqRef} className="px-6 md:px-12 lg:px-16 mb-24">
          <div className="mb-10">
            <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#00FF87] block mb-2">
              FAQ
            </span>
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-[-0.03em]">
              COMMON QUESTIONS.
            </h2>
          </div>
          <div className="border-[3px] border-black">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b-[3px] border-black last:border-b-0 grid grid-cols-1 md:grid-cols-2">
                <div
                  className="px-8 py-6 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black flex items-center gap-4"
                >
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

        {/* CTA */}
        <div className="px-6 md:px-12 lg:px-16">
          <div className="border-[3px] border-black bg-[#1a1a1a] text-white p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase leading-tight mb-4">
                READY TO<br />
                <span style={{ color: "#F9FF00" }}>START BUILDING?</span>
              </h2>
              <p className="font-inter text-sm text-white/60 max-w-md leading-relaxed">
                18 tools, zero cost, no account required. Your workbench is waiting.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                to="/#tools"
                className="bg-[#F9FF00] border-[3px] border-[#F9FF00] text-black font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-4 hover:bg-black hover:text-[#F9FF00] transition-colors shadow-[4px_4px_0px_rgba(249,255,0,0.4)]"
              >
                EXPLORE ALL TOOLS <ArrowRight size={18} />
              </Link>
              <Link
                to="/changelog"
                className="border-[3px] border-white/30 text-white font-oswald font-bold uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-4 hover:border-white hover:bg-white/10 transition-colors"
              >
                SEE WHAT'S NEW <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
