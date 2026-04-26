import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import Lenis from 'lenis';
import './index.css'
import { AuthProvider } from './providers/AuthProvider'
import { ToastProvider } from './providers/ToastProvider'
import { ConfirmProvider } from './providers/ConfirmProvider'
import App from './App.tsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://dummy.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

// ── Lenis smooth scroll ──────────────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.5,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Expose for GSAP ScrollTrigger integration
(window as unknown as Record<string, unknown>).__lenis__ = lenis;

createRoot(document.getElementById('root')!).render(
  <ConvexAuthProvider client={convex}>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <App />
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </ConvexAuthProvider>,
)
