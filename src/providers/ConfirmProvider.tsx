import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmOptions = {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  countdown?: number; // seconds before confirm is enabled
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

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolve, setResolve] = useState<((val: boolean) => void) | null>(null);
  const [countdown, setCountdown] = useState(0);

  const confirmFn = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise(res => {
      setOptions(opts);
      setResolve(() => res);
      if (opts.countdown) {
        setCountdown(opts.countdown);
      }
    });
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown > 0]); // eslint-disable-line

  const handleConfirm = () => {
    resolve?.(true);
    setOptions(null);
    setResolve(null);
    setCountdown(0);
  };

  const handleCancel = () => {
    resolve?.(false);
    setOptions(null);
    setResolve(null);
    setCountdown(0);
  };

  const variantHeader: Record<string, { bg: string; text: string; border: string }> = {
    danger:  { bg: "#FF0004", text: "white",   border: "#FF0004" },
    warning: { bg: "#F9FF00", text: "#1a1a1a", border: "#1a1a1a" },
    default: { bg: "#1a1a1a", text: "white",   border: "#1a1a1a" },
  };

  const hdr = variantHeader[options?.variant || "default"];

  return (
    <ConfirmContext.Provider value={{ confirm: confirmFn }}>
      {children}
      {options && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white border-[4px] border-black w-full max-w-sm mx-4 shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-scale-in overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b-[4px] border-black flex items-center gap-3"
              style={{ background: hdr.bg }}>
              <AlertTriangle size={18} style={{ color: hdr.text }} />
              <h3 className="font-oswald text-lg font-bold uppercase tracking-tight" style={{ color: hdr.text }}>
                {options.title}
              </h3>
            </div>
            {/* Body */}
            <div className="px-6 py-6">
              <p className="font-inter text-sm leading-relaxed text-black/75">{options.message}</p>
            </div>
            {/* Actions */}
            <div className="px-6 py-4 border-t-[3px] border-black flex justify-end gap-3 bg-[#fafafa]">
              <button onClick={handleCancel}
                className="border-[3px] border-black bg-white font-oswald font-bold uppercase tracking-widest text-xs px-5 py-2.5 hover:bg-black hover:text-white transition-colors">
                {options.cancelText || "CANCEL"}
              </button>
              <button onClick={handleConfirm} disabled={countdown > 0}
                className={`border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-xs px-5 py-2.5 transition-colors ${
                  countdown > 0
                    ? "bg-black/10 text-black/30 cursor-not-allowed border-black/20"
                    : options.variant === "danger"
                      ? "bg-[#FF0004] text-white border-[#FF0004] hover:bg-black hover:border-black"
                      : options.variant === "warning"
                        ? "bg-[#F9FF00] text-black hover:bg-black hover:text-[#F9FF00]"
                        : "bg-[#F9FF00] text-black hover:bg-black hover:text-[#F9FF00]"
                }`}>
                {countdown > 0 ? `WAIT ${countdown}s...` : (options.confirmText || "CONFIRM")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
