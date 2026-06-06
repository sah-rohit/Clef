import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Mail, UserCircle, ArrowRight, ShieldCheck, Lock, Zap, Globe, Shield } from "lucide-react";
import gsap from "gsap";

type Mode = "GUEST" | "SIGNIN" | "SIGNUP";

const PANEL_CONFIG: Record<Mode, {
  bg: string; accent: string; isLight: boolean;
  pattern: "dots" | "grid" | "diagonal" | "circuit";
  heading: [string, string]; sub: string;
  bullets: { color: string; text: string; Icon: React.ElementType }[];
  ghost: string;
}> = {
  GUEST: {
    bg: "#00FF87", accent: "#1a1a1a", isLight: true, pattern: "dots",
    heading: ["NO ACCOUNT", "NEEDED."],
    sub: "All 28 tools work without signing up. Your data stays local — nothing leaves your browser.",
    bullets: [
      { color: "#1a1a1a", text: "All tools fully functional", Icon: Zap },
      { color: "#FF0004", text: "Zero data sent to servers",  Icon: Shield },
      { color: "#7C3AED", text: "Works offline after first visit", Icon: Globe },
    ],
    ghost: "GO",
  },
  SIGNIN: {
    bg: "#F9FF00", accent: "#1a1a1a", isLight: true, pattern: "grid",
    heading: ["WELCOME", "BACK."],
    sub: "Sign in to sync your AI chat history across devices and access your personalized dashboard.",
    bullets: [
      { color: "#1a1a1a", text: "AES-256 encrypted cloud sync", Icon: Shield },
      { color: "#FF0004", text: "AI chat history preserved",   Icon: Zap },
      { color: "#7C3AED", text: "Cross-device access",         Icon: Globe },
    ],
    ghost: "IN",
  },
  SIGNUP: {
    bg: "#7C3AED", accent: "#ffffff", isLight: false, pattern: "diagonal",
    heading: ["JOIN THE", "WORKBENCH."],
    sub: "Create a free account to unlock cloud sync for your AI conversations. No credit card, no trial.",
    bullets: [
      { color: "#F9FF00", text: "Free forever — no catch",       Icon: Zap },
      { color: "#00FF87", text: "Encrypted cloud sync",          Icon: Shield },
      { color: "#00E5FF", text: "Cancel anytime, data stays yours", Icon: Globe },
    ],
    ghost: "UP",
  },
};

export default function Login() {
  const [email, setEmail] = useState(() => sessionStorage.getItem("clef_signup_email") || "");
  const [name, setName] = useState(() => sessionStorage.getItem("clef_signup_name") || "");
  const [password, setPassword] = useState(() => sessionStorage.getItem("clef_signup_password") || "");
  const [mode, setMode] = useState<Mode>(() => (sessionStorage.getItem("clef_login_mode") as Mode) || "SIGNIN");
  const [agreed, setAgreed] = useState(false);
  const [readTerms, setReadTerms] = useState(() => sessionStorage.getItem("clef_signup_read_terms") === "true");
  const [readPrivacy, setReadPrivacy] = useState(() => sessionStorage.getItem("clef_signup_read_privacy") === "true");
  const [prevMode, setPrevMode] = useState<Mode>("SIGNIN");

  useEffect(() => {
    sessionStorage.setItem("clef_signup_email", email);
  }, [email]);

  useEffect(() => {
    sessionStorage.setItem("clef_signup_name", name);
  }, [name]);

  useEffect(() => {
    sessionStorage.setItem("clef_signup_password", password);
  }, [password]);

  useEffect(() => {
    sessionStorage.setItem("clef_login_mode", mode);
  }, [mode]);

  useEffect(() => {
    sessionStorage.setItem("clef_signup_read_terms", String(readTerms));
  }, [readTerms]);

  useEffect(() => {
    sessionStorage.setItem("clef_signup_read_privacy", String(readPrivacy));
  }, [readPrivacy]);

  const clearSessionStorage = () => {
    sessionStorage.removeItem("clef_signup_email");
    sessionStorage.removeItem("clef_signup_name");
    sessionStorage.removeItem("clef_signup_password");
    sessionStorage.removeItem("clef_signup_read_terms");
    sessionStorage.removeItem("clef_signup_read_privacy");
    sessionStorage.removeItem("clef_login_mode");
  };

  const { loginAsGuest, signInWithEmail, signUpWithEmail, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const panelRef    = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isAuthenticated) navigate("/account");
  }, [isAuthenticated, navigate]);

  // Animate panel content out → swap → in on mode change
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const el = contentRef.current;
    if (!el) return;

    // Determine direction: GUEST→SIGNIN→SIGNUP = left-to-right
    const order: Mode[] = ["GUEST", "SIGNIN", "SIGNUP"];
    const dir = order.indexOf(mode) > order.indexOf(prevMode) ? 1 : -1;

    gsap.fromTo(el,
      { x: dir * 40, opacity: 0, scale: 0.96 },
      { x: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }
    );
  }, [mode]);

  const handleModeChange = (m: Mode) => {
    if (m === mode) return;
    const el = contentRef.current;
    const order: Mode[] = ["GUEST", "SIGNIN", "SIGNUP"];
    const dir = order.indexOf(m) > order.indexOf(mode) ? 1 : -1;

    if (el) {
      gsap.to(el, {
        x: -dir * 30, opacity: 0, scale: 0.97, duration: 0.2, ease: "power2.in",
        onComplete: () => { setPrevMode(mode); setMode(m); },
      });
    } else {
      setPrevMode(mode); setMode(m);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "SIGNUP" && !agreed) { showToast("Please agree to the Terms and Privacy Policy.", "warning"); return; }
    if (mode === "SIGNUP") {
      if (!email || !password) { showToast("Please enter both email and password.", "warning"); return; }
      if (password.length < 8) { showToast("Password must be at least 8 characters long.", "warning"); return; }
      try {
        await signUpWithEmail(email, password, name || email.split("@")[0]);
        clearSessionStorage();
        showToast("Account created successfully!", "success");
        navigate("/account");
      } catch (e: any) {
        let msg = e.message || "Sign up failed.";
        if (msg.includes("Invalid password")) msg = "Incorrect password or email already exists.";
        showToast(msg, "error");
      }
    } else if (mode === "SIGNIN") {
      if (!email || !password) { showToast("Please enter both email and password.", "warning"); return; }
      try {
        await signInWithEmail(email, password);
        clearSessionStorage();
        showToast("Welcome back!", "success");
        navigate("/account");
      } catch (e: any) {
        let msg = e.message || "Login failed. Check your credentials.";
        if (msg.includes("Invalid password")) msg = "Incorrect password.";
        showToast(msg, "error");
      }
    } else {
      loginAsGuest();
      clearSessionStorage();
      showToast("Logged in as Guest!", "success");
      navigate("/account");
    }
  };

  const panel = PANEL_CONFIG[mode];

  // Pattern color: use a contrasting dark/light color, not the accent itself
  const patternColor = panel.isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <div className="flex-1 flex flex-col md:flex-row" style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>

        {/* ── Left panel — animated per mode ── */}
        <div
          ref={panelRef}
          className="hidden md:flex md:w-[45%] flex-col justify-between border-r-[3px] border-black relative overflow-hidden"
          style={{ background: panel.bg, transition: "background 0.5s cubic-bezier(0.4,0,0.2,1)" }}
        >
          {/* Background pattern — contrasting, not accent */}
          <div className="absolute inset-0 pointer-events-none" style={{ opacity: 1 }}>
            {panel.pattern === "dots" && (
              <div style={{ backgroundImage: `radial-gradient(${patternColor} 1.5px, transparent 0)`, backgroundSize: "28px 28px", width: "100%", height: "100%" }} />
            )}
            {panel.pattern === "grid" && (
              <div style={{ backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`, backgroundSize: "40px 40px", width: "100%", height: "100%" }} />
            )}
            {panel.pattern === "diagonal" && (
              <div style={{ backgroundImage: `repeating-linear-gradient(45deg, ${patternColor} 0, ${patternColor} 1px, transparent 0, transparent 24px)`, width: "100%", height: "100%" }} />
            )}
            {panel.pattern === "circuit" && (
              <div style={{ backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`, backgroundSize: "60px 60px", width: "100%", height: "100%" }} />
            )}
          </div>

          {/* Ghost text */}
          <div className="absolute -bottom-4 -right-2 font-oswald text-[160px] font-bold leading-none select-none pointer-events-none uppercase"
            style={{ color: panel.isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)", transition: "color 0.5s" }}>
            {panel.ghost}
          </div>

          {/* Animated content */}
          <div ref={contentRef} className="relative z-10 flex flex-col justify-between h-full p-10 lg:p-14">
            {/* Top */}
            <div>
              <div className="w-12 h-12 border-[3px] flex items-center justify-center mb-8"
                style={{ borderColor: panel.isLight ? "#1a1a1a" : "rgba(255,255,255,0.4)", background: panel.isLight ? "#1a1a1a" : "rgba(255,255,255,0.15)" }}>
                <ShieldCheck size={20} style={{ color: panel.isLight ? panel.bg : "#ffffff" }} />
              </div>
              <h2 className="font-oswald font-bold uppercase leading-[0.88] tracking-[-0.04em] mb-6"
                style={{ fontSize: "clamp(2.4rem, 4vw, 3.5rem)", color: panel.accent }}>
                {panel.heading[0]}<br />
                <span style={{ WebkitTextStroke: `2px ${panel.accent}`, color: "transparent" }}>
                  {panel.heading[1]}
                </span>
              </h2>
              <p className="font-inter text-sm leading-relaxed max-w-xs"
                style={{ color: panel.isLight ? "rgba(26,26,26,0.65)" : "rgba(255,255,255,0.7)" }}>
                {panel.sub}
              </p>
            </div>

            {/* Bottom bullets */}
            <div className="flex flex-col gap-3">
              {panel.bullets.map((item, i) => {
                const BIcon = item.Icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center border-[2px] shrink-0"
                      style={{ borderColor: panel.isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)", background: panel.isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)" }}>
                      <BIcon size={13} style={{ color: panel.isLight ? "#1a1a1a" : "#ffffff" }} />
                    </div>
                    <span className="font-inter text-xs font-semibold uppercase tracking-wide"
                      style={{ color: panel.isLight ? "rgba(26,26,26,0.7)" : "rgba(255,255,255,0.8)" }}>
                      {item.text}
                    </span>
                    <div className="w-1.5 h-1.5 rotate-45 shrink-0 ml-auto" style={{ background: item.color }} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right panel — form ── */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 bg-white">
          <div className="w-full max-w-[420px]">
            <h1 className="font-oswald text-3xl font-bold uppercase tracking-tight text-black mb-6">JOIN CLEF</h1>

            {/* Mode selector — underline tabs */}
            <div className="flex gap-0 border-b-[3px] border-black mb-8">
              {(["GUEST", "SIGNIN", "SIGNUP"] as const).map((m) => (
                <button key={m} type="button" onClick={() => handleModeChange(m)}
                  className={`flex-1 py-3 font-oswald text-xs font-bold uppercase tracking-wider transition-all duration-150 border-b-[3px] -mb-[3px] ${
                    mode === m
                      ? "border-black bg-[#F9FF00] text-black"
                      : "border-transparent text-black/40 hover:text-black hover:border-black/20"
                  }`}>
                  {m === "SIGNIN" ? "SIGN IN" : m === "SIGNUP" ? "SIGN UP" : "GUEST"}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {mode !== "GUEST" ? (
                <>
                  {mode === "SIGNUP" && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40">Display Name (Optional)</label>
                      <div className="relative">
                        <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                        <input type="text" className="input-brutal pl-11 bg-white w-full" placeholder="Your Name"
                          value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                      <input type="email" className="input-brutal pl-11 bg-white w-full" placeholder="hello@example.com"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                      <input type="password" className="input-brutal pl-11 bg-white w-full" placeholder="••••••••"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 border-[3px] border-dashed border-black/15 bg-[#fafafa] text-center">
                  <UserCircle size={36} className="mx-auto mb-3 text-black/15" />
                  <p className="font-inter text-xs text-black/50 px-8 leading-relaxed uppercase tracking-tight">
                    No email needed. All tools work instantly. Data stays on your device.
                  </p>
                </div>
              )}

              {mode === "SIGNUP" && (
                <div className={`flex items-start gap-3 p-4 border-[3px] border-black/10 bg-[#fafafa] ${(!readTerms || !readPrivacy) ? "opacity-65" : ""}`}>
                  <button 
                    type="button" 
                    disabled={!readTerms || !readPrivacy}
                    onClick={() => setAgreed(!agreed)}
                    className={`w-5 h-5 border-[3px] border-black flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${
                      (!readTerms || !readPrivacy) ? "bg-black/5 border-black/15 cursor-not-allowed text-black/25" : agreed ? "bg-black" : "bg-white"
                    }`}
                  >
                    {agreed && <ShieldCheck size={11} className="text-[#F9FF00]" />}
                  </button>
                  <label 
                    className={`font-inter text-[10px] leading-relaxed cursor-pointer select-none font-medium uppercase tracking-tight ${
                      (!readTerms || !readPrivacy) ? "text-black/40" : "text-black"
                    }`}
                    onClick={() => {
                      if (readTerms && readPrivacy) {
                        setAgreed(!agreed);
                      } else {
                        showToast("Please open and read both the Terms and Privacy Policy pages first.", "warning");
                      }
                    }}
                  >
                    I agree to the{" "}
                    <a 
                      href="/terms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReadTerms(true);
                      }}
                      className="underline font-bold hover:text-[#FF0004]"
                    >
                      Terms
                    </a>{" "}
                    and{" "}
                    <a 
                      href="/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReadPrivacy(true);
                      }}
                      className="underline font-bold hover:text-[#FF0004]"
                    >
                      Privacy Policy
                    </a>.
                    {(!readTerms || !readPrivacy) && (
                      <span className="block text-[8px] text-[#FF0004] mt-1 font-bold">
                        (You must click and view both pages to agree)
                      </span>
                    )}
                  </label>
                </div>
              )}

              <button type="submit" disabled={mode === "SIGNUP" && !agreed}
                className={`w-full flex items-center justify-center gap-3 font-oswald font-bold uppercase tracking-widest text-sm py-4 border-[3px] border-black transition-all duration-150 ${
                  mode !== "SIGNUP" || agreed
                    ? "bg-[#1a1a1a] text-white hover:bg-[#F9FF00] hover:text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                    : "bg-black/5 text-black/25 cursor-not-allowed border-black/15"
                }`}>
                {mode === "SIGNUP" ? "CREATE ACCOUNT" : mode === "SIGNIN" ? "ENTER WORKBENCH" : "PROCEED AS GUEST"}
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
