import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { TOOLS } from "@/data/tools";
import gsap from "gsap";

export function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [type, setType] = useState<"FIRST" | "RETURN">("FIRST");
  const { user } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastVisit = localStorage.getItem("clef_last_visit");
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (!lastVisit) {
      setType("FIRST");
      setShow(true);
    } else if (now - parseInt(lastVisit) > sevenDays) {
      setType("RETURN");
      setShow(true);
    }

    localStorage.setItem("clef_last_visit", now.toString());
  }, [user]);

  // Entrance animation
  useEffect(() => {
    if (!show || !panelRef.current || !overlayRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.fromTo(
        panelRef.current,
        { y: 60, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)", delay: 0.15 }
      );
      gsap.fromTo(
        ".welcome-stagger",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out", delay: 0.35 }
      );
    });
    return () => ctx.revert();
  }, [show]);

  const handleClose = () => {
    if (!panelRef.current || !overlayRef.current) { setShow(false); return; }
    gsap.to(panelRef.current, { y: 40, opacity: 0, scale: 0.96, duration: 0.3, ease: "power2.in" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: () => setShow(false) });
  };

  if (!show) return null;

  const userName = user?.name ? user.name.split(" ")[0] : "Commander";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100001] flex items-center justify-center p-4 md:p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-lg border-[4px] border-black shadow-[16px_16px_0px_rgba(0,0,0,1)] overflow-hidden"
      >
        {/* ── Top accent bar ── */}
        <div
          className="h-2"
          style={{
            background: type === "FIRST"
              ? "linear-gradient(90deg, #F9FF00, #00E5FF, #00FF87, #7C3AED, #FF0004)"
              : "linear-gradient(90deg, #00E5FF, #F9FF00)",
          }}
        />

        {/* ── Header section ── */}
        <div className={`relative overflow-hidden px-8 pt-10 pb-8 ${type === "FIRST" ? "bg-[#1a1a1a]" : "bg-[#00E5FF]"}`}>
          {/* Watermark */}
          <div className={`absolute -right-4 -top-2 font-oswald text-[120px] md:text-[160px] font-black uppercase leading-none select-none pointer-events-none ${type === "FIRST" ? "text-white/[0.04]" : "text-black/[0.06]"}`}>
            {type === "FIRST" ? "INIT" : "BACK"}
          </div>

          <button
            onClick={handleClose}
            className={`absolute top-4 right-4 p-2 border-[2px] transition-colors ${
              type === "FIRST"
                ? "border-white/20 text-white/60 hover:bg-[#FF0004] hover:text-white hover:border-[#FF0004]"
                : "border-black/20 text-black/60 hover:bg-black hover:text-white hover:border-black"
            }`}
          >
            <X size={16} />
          </button>

          <div className="welcome-stagger flex items-center gap-3 mb-5">
            <div className={`w-12 h-12 border-[3px] flex items-center justify-center -rotate-3 ${
              type === "FIRST"
                ? "bg-[#F9FF00] border-black shadow-[4px_4px_0px_rgba(249,255,0,0.3)]"
                : "bg-black border-black shadow-[4px_4px_0px_rgba(0,0,0,0.3)]"
            }`}>
              {type === "FIRST"
                ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="black" strokeWidth="3" strokeLinecap="square" /><rect x="9" y="9" width="6" height="6" fill="black" /></svg>
                : <Zap size={24} className="text-[#F9FF00]" />
              }
            </div>
            <div>
              <span className={`font-oswald text-[9px] font-bold uppercase tracking-[0.3em] block ${type === "FIRST" ? "text-[#F9FF00]" : "text-black/50"}`}>
                {type === "FIRST" ? "SYSTEM INITIALIZED" : "SESSION RESTORED"}
              </span>
            </div>
          </div>

          <h2 className={`welcome-stagger font-oswald text-4xl md:text-5xl font-black uppercase tracking-[-0.03em] leading-[0.9] ${type === "FIRST" ? "text-white" : "text-black"}`}>
            {type === "FIRST" ? (
              <>WELCOME<br />TO <span className="text-[#F9FF00]">CLEF.</span></>
            ) : (
              <>WELCOME<br />BACK, <span className="text-[#1a1a1a] bg-[#F9FF00] px-2">{userName.toUpperCase()}</span>.</>
            )}
          </h2>
        </div>

        {/* ── Body section ── */}
        <div className="bg-white px-8 py-8">
          <p className="welcome-stagger font-inter text-sm text-black/70 leading-relaxed">
            {type === "FIRST"
              ? "Your new brutalist productivity suite. All tools run in your browser — no tracking, no accounts required, completely free forever."
              : "It's been a while. The workbench is exactly where you left it — ready to go."
            }
          </p>

          {type === "FIRST" && (
            <div className="welcome-stagger grid grid-cols-3 gap-3 mt-6">
              {[
                { label: "TOOLS", count: TOOLS?.length || 27, color: "#00E5FF" },
                { label: "COST", count: "$0", color: "#00FF87" },
                { label: "TRACKING", count: "ZERO", color: "#FF0004" },
              ].map((item) => (
                <div key={item.label} className="border-[2px] border-black p-3 text-center">
                  <span className="font-oswald text-xl md:text-2xl font-black block" style={{ color: item.color }}>
                    {item.count}
                  </span>
                  <span className="font-oswald text-[8px] font-bold uppercase tracking-widest text-black/40">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="welcome-stagger mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleClose}
              className="flex-1 flex items-center justify-center gap-2 font-oswald text-sm font-bold uppercase tracking-widest bg-black text-white border-[3px] border-black py-4 px-6 hover:bg-[#F9FF00] hover:text-black transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              {type === "FIRST" ? "BEGIN" : "CONTINUE"}
              <ArrowRight size={16} />
            </button>
          </div>

          <p className="welcome-stagger text-center mt-5">
            <span className="font-inter text-[9px] font-bold uppercase tracking-widest text-black/30">
              CLEF BY SONATA INTERACTIVE • v1.0
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
