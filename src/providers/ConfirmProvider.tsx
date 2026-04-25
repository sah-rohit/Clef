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

  const variantStyles = {
    danger: "bg-[#FF0004] text-white border-[#FF0004]",
    warning: "bg-[#F9FF00] text-[#1a1a1a] border-black",
    default: "bg-[#1a1a1a] text-white border-black",
  };

  return (
    <ConfirmContext.Provider value={{ confirm: confirmFn }}>
      {children}
      {options && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-[3px] border-black w-full max-w-md mx-4 shadow-2xl animate-scale-in">
            <div className={`px-6 py-4 border-b-[3px] border-black ${variantStyles[options.variant || "default"]}`}>
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} />
                <h3 className="font-oswald text-lg font-bold uppercase tracking-tight">
                  {options.title}
                </h3>
              </div>
            </div>
            <div className="px-6 py-5">
              <p className="font-inter text-sm leading-relaxed text-[#1a1a1a]/80">
                {options.message}
              </p>
            </div>
            <div className="px-6 py-4 border-t-[3px] border-black flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="btn-brutal bg-white border-[3px] border-black text-sm px-5 py-2"
              >
                {options.cancelText || "CANCEL"}
              </button>
              <button
                onClick={handleConfirm}
                disabled={countdown > 0}
                className={`btn-brutal text-sm px-5 py-2 ${
                  options.variant === "danger"
                    ? "btn-brutal-red"
                    : "btn-brutal-yellow"
                } ${countdown > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {countdown > 0
                  ? `WAIT ${countdown}s...`
                  : (options.confirmText || "CONFIRM")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}
