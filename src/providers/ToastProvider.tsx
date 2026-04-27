import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
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
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const TOAST_STYLES: Record<ToastType, { bar: string; bg: string; border: string; text: string; iconColor: string }> = {
  success: { bar: "#00FF87", bg: "#ffffff", border: "#1a1a1a", text: "#1a1a1a", iconColor: "#00FF87" },
  error:   { bar: "#FF0004", bg: "#ffffff", border: "#1a1a1a", text: "#1a1a1a", iconColor: "#FF0004" },
  warning: { bar: "#F9FF00", bg: "#F9FF00", border: "#1a1a1a", text: "#1a1a1a", iconColor: "#1a1a1a" },
  info:    { bar: "#00E5FF", bg: "#ffffff", border: "#1a1a1a", text: "#1a1a1a", iconColor: "#00E5FF" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info", duration = 4000) => {
    const id = Math.random().toString(36).substring(2);
    const toast: Toast = { id, message, type, duration };
    setToasts(prev => [...prev, toast]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => {
          const Icon = TOAST_ICONS[toast.type];
          const s = TOAST_STYLES[toast.type];
          return (
            <div key={toast.id}
              className="pointer-events-auto flex overflow-hidden border-[3px] animate-slide-left shadow-[4px_4px_0px_rgba(0,0,0,1)]"
              style={{ borderColor: s.border, background: s.bg }}>
              {/* Color bar */}
              <div className="w-1.5 shrink-0" style={{ background: s.bar }} />
              {/* Icon */}
              <div className="flex items-center justify-center px-3 py-3 shrink-0">
                <Icon size={16} style={{ color: s.iconColor }} />
              </div>
              {/* Message */}
              <div className="flex-1 px-2 py-3 flex items-center">
                <p className="font-inter text-xs font-semibold leading-snug" style={{ color: s.text }}>{toast.message}</p>
              </div>
              {/* Close */}
              <button onClick={() => removeToast(toast.id)}
                className="flex items-center justify-center px-3 py-3 shrink-0 hover:opacity-60 transition-opacity border-l-[2px]"
                style={{ borderColor: s.border + "30" }}>
                <X size={13} style={{ color: s.text }} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
