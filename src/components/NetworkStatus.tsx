import { useState, useEffect, useRef } from "react";
import { Wifi, WifiOff, X } from "lucide-react";
import gsap from "gsap";

/**
 * Detects online/offline status and shows a non-intrusive toast-style banner.
 * - Goes offline → red banner slides in from bottom-left
 * - Comes back online → green banner slides in, auto-dismisses after 4s
 * - Features that require internet are listed so users know what's affected
 */

const OFFLINE_FEATURES = ["Clef AI", "Cloud sync", "Community board"];

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(false);
  const [showOnline, setShowOnline]   = useState(false);
  const offlineRef = useRef<HTMLDivElement>(null);
  const onlineRef  = useRef<HTMLDivElement>(null);
  const onlineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
      setShowOnline(true);
      // Auto-dismiss online notice after 4s
      if (onlineTimer.current) clearTimeout(onlineTimer.current);
      onlineTimer.current = setTimeout(() => setShowOnline(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOnline(false);
      setShowOffline(true);
    };

    window.addEventListener("online",  handleOnline);
    window.addEventListener("offline", handleOffline);

    // Show offline banner immediately if already offline on mount
    if (!navigator.onLine) setShowOffline(true);

    return () => {
      window.removeEventListener("online",  handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (onlineTimer.current) clearTimeout(onlineTimer.current);
    };
  }, []);

  // Animate offline banner in/out
  useEffect(() => {
    const el = offlineRef.current;
    if (!el) return;
    if (showOffline) {
      gsap.fromTo(el,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
      );
    } else {
      gsap.to(el, { y: 80, opacity: 0, duration: 0.3, ease: "power3.in" });
    }
  }, [showOffline]);

  // Animate online banner in/out
  useEffect(() => {
    const el = onlineRef.current;
    if (!el) return;
    if (showOnline) {
      gsap.fromTo(el,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
      );
    } else {
      gsap.to(el, { y: 80, opacity: 0, duration: 0.3, ease: "power3.in" });
    }
  }, [showOnline]);

  return (
    <>
      {/* ── Offline banner ── */}
      <div
        ref={offlineRef}
        className="fixed left-4 md:left-6 z-[9980] pointer-events-auto"
        style={{
          bottom: "calc(40px + 16px)", // above FooterBar
          opacity: 0,
          transform: "translateY(80px)",
        }}
      >
        <div className="bg-[#FF0004] border-[3px] border-black text-white shadow-[6px_6px_0px_rgba(0,0,0,1)] max-w-xs">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b-[2px] border-black/20">
            <div className="flex items-center gap-2">
              <WifiOff size={14} className="shrink-0" />
              <span className="font-oswald text-xs font-bold uppercase tracking-widest">YOU'RE OFFLINE</span>
            </div>
            <button
              onClick={() => setShowOffline(false)}
              className="hover:bg-black/20 p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
          {/* Body */}
          <div className="px-4 py-3">
            <p className="font-inter text-[10px] text-white/80 leading-relaxed mb-2">
              No internet connection. These features are unavailable:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {OFFLINE_FEATURES.map(f => (
                <span
                  key={f}
                  className="font-oswald text-[9px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 border border-white/20"
                >
                  {f}
                </span>
              ))}
            </div>
            <p className="font-inter text-[9px] text-white/60 mt-2">
              All local tools still work normally.
            </p>
          </div>
        </div>
      </div>

      {/* ── Back online banner ── */}
      <div
        ref={onlineRef}
        className="fixed left-4 md:left-6 z-[9980] pointer-events-auto"
        style={{
          bottom: "calc(40px + 16px)",
          opacity: 0,
          transform: "translateY(80px)",
        }}
      >
        <div className="bg-[#00FF87] border-[3px] border-black text-black shadow-[6px_6px_0px_rgba(0,0,0,1)] max-w-xs">
          <div className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Wifi size={14} className="shrink-0" />
              <span className="font-oswald text-xs font-bold uppercase tracking-widest">BACK ONLINE</span>
            </div>
            <button
              onClick={() => setShowOnline(false)}
              className="hover:bg-black/10 p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
          <div className="px-4 pb-3">
            <p className="font-inter text-[10px] text-black/70">
              Connection restored. All features are available again.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
