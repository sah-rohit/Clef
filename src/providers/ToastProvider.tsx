import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const TOAST_ICONS = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
};

// Full vibrant backgrounds per type
const TOAST_STYLES: Record<ToastType, {
  bg: string; border: string; text: string; subText: string;
  iconBg: string; iconColor: string; label: string;
}> = {
  success: { bg: "#00FF87", border: "#1a1a1a", text: "#1a1a1a", subText: "rgba(26,26,26,0.6)", iconBg: "#1a1a1a", iconColor: "#00FF87", label: "SUCCESS" },
  error:   { bg: "#FF0004", border: "#1a1a1a", text: "#ffffff", subText: "rgba(255,255,255,0.7)", iconBg: "#1a1a1a", iconColor: "#FF0004", label: "ERROR"   },
  warning: { bg: "#F9FF00", border: "#1a1a1a", text: "#1a1a1a", subText: "rgba(26,26,26,0.6)", iconBg: "#1a1a1a", iconColor: "#F9FF00", label: "WARNING" },
  info:    { bg: "#00E5FF", border: "#1a1a1a", text: "#1a1a1a", subText: "rgba(26,26,26,0.6)", iconBg: "#1a1a1a", iconColor: "#00E5FF", label: "INFO"    },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = TOAST_ICONS[toast.type];
  const s = TOAST_STYLES[toast.type];
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / toast.duration!) * 100);
      setProgress(pct);
      if (pct > 0) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [toast.duration]);

  return (
    <div className="pointer-events-auto overflow-hidden border-[3px] animate-slide-left shadow-[6px_6px_0px_rgba(0,0,0,1)]"
      style={{ borderColor: s.border, background: s.bg }}>
      <div className="flex items-stretch">
        {/* Icon column */}
        <div className="flex items-center justify-center px-4 py-4 shrink-0" style={{ background: s.iconBg }}>
          <Icon size={18} style={{ color: s.iconColor }} />
        </div>
        {/* Content */}
        <div className="flex-1 px-4 py-3 min-w-0">
          <div className="font-oswald text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: s.subText }}>
            {s.label}
          </div>
          <p className="font-inter text-sm font-semibold leading-snug" style={{ color: s.text }}>
            {toast.message}
          </p>
        </div>
        {/* Close */}
        <button onClick={() => onRemove(toast.id)}
          className="flex items-center justify-center px-3 shrink-0 border-l-[2px] hover:opacity-70 transition-opacity"
          style={{ borderColor: s.border + "40" }}>
          <X size={14} style={{ color: s.text }} />
        </button>
      </div>
      {/* Progress bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="h-[3px]" style={{ background: s.border + "20" }}>
          <div className="h-full transition-none" style={{ width: `${progress}%`, background: s.iconBg, opacity: 0.4 }} />
        </div>
      )}
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2);
    setToasts(prev => [...prev, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 w-[340px] max-w-[calc(100vw-2rem)] pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
