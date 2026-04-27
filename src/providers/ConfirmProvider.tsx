import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { AlertTriangle, X, Trash2, AlertCircle, Info } from "lucide-react";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  countdown?: number;
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

const VARIANT_CONFIG = {
  danger:  { bg: "#FF0004", text: "#ffffff", icon: Trash2,        confirmBg: "#FF0004", confirmText: "#ffffff", confirmHover: "#1a1a1a" },
  warning: { bg: "#F9FF00", text: "#1a1a1a", icon: AlertTriangle,  confirmBg: "#F9FF00", confirmText: "#1a1a1a", confirmHover: "#1a1a1a" },
  default: { bg: "#1a1a1a", text: "#F9FF00", icon: Info,           confirmBg: "#F9FF00", confirmText: "#1a1a1a", confirmHover: "#1a1a1a" },
};

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolve, setResolve] = useState<((val: boolean) => void) | null>(null);
  const [countdown, setCountdown] = useState(0);

  const confirmFn = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise(res => {
      setOptions(opts);
      setResolve(() => res);
      if (opts.countdown) setCountdown(opts.countdown);
    });
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown > 0]); // eslint-disable-line

  const handleConfirm = () => { resolve?.(true);  setOptions(null); setResolve(null); setCountdown(0); };
  const handleCancel  = () => { resolve?.(false); setOptions(null); setResolve(null); setCountdown(0); };

  const cfg = VARIANT_CONFIG[options?.variant || "default"];
  const VIcon = cfg.icon;

  return (
    <ConfirmContext.Provider value={{ confirm: confirmFn }}>
      {children}
      {options && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) handleCancel(); }}>
          <div className="bg-white border-[4px] border-black w-full max-w-md shadow-[12px_12px_0px_rgba(0,0,0,1)] animate-scale-in overflow-hidden">

            {/* Vibrant header */}
            <div className="px-6 py-5 border-b-[4px] border-black flex items-center justify-between"
              style={{ background: cfg.bg }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 border-[2px] flex items-center justify-center shrink-0"
                  style={{ borderColor: options.variant === "warning" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.3)", background: options.variant === "warning" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.15)" }}>
                  <VIcon size={16} style={{ color: cfg.text }} />
                </div>
                <h3 className="font-oswald text-xl font-bold uppercase tracking-tight" style={{ color: cfg.text }}>
                  {options.title}
                </h3>
              </div>
              <button onClick={handleCancel}
                className="w-7 h-7 flex items-center justify-center border-[2px] hover:opacity-70 transition-opacity"
                style={{ borderColor: options.variant === "warning" ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.3)" }}>
                <X size={13} style={{ color: cfg.text }} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <p className="font-inter text-sm leading-relaxed text-black/70">{options.message}</p>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t-[3px] border-black flex flex-col sm:flex-row justify-end gap-3 bg-[#fafafa]">
              <button onClick={handleCancel}
                className="border-[3px] border-black bg-white font-oswald font-bold uppercase tracking-widest text-xs px-6 py-3 hover:bg-black hover:text-white transition-colors order-2 sm:order-1">
                {options.cancelText || "CANCEL"}
              </button>
              <button onClick={handleConfirm} disabled={countdown > 0}
                className="border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-xs px-6 py-3 transition-all order-1 sm:order-2 shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none"
                style={{
                  background: countdown > 0 ? "rgba(0,0,0,0.08)" : cfg.confirmBg,
                  color: countdown > 0 ? "rgba(0,0,0,0.3)" : cfg.confirmText,
                  cursor: countdown > 0 ? "not-allowed" : "pointer",
                  borderColor: countdown > 0 ? "rgba(0,0,0,0.15)" : "#1a1a1a",
                }}>
                {countdown > 0 ? `WAIT ${countdown}s...` : (options.confirmText || "CONFIRM")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
