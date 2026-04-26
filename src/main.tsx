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
  duration: 0.9,                                    // was 1.2 — shorter = more responsive
  easing: (t: number) => 1 - Math.pow(1 - t, 4),  // quartic ease-out: fast start, gentle stop
  smoothWheel: true,
  wheelMultiplier: 0.9,                             // slightly reduce wheel sensitivity
  touchMultiplier: 1.2,                             // was 1.5 — less over-scroll on touch
  infinite: false,
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
