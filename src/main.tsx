import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css'
import { AuthProvider } from './providers/AuthProvider'
import { ToastProvider } from './providers/ToastProvider'
import { ConfirmProvider } from './providers/ConfirmProvider'
import App from './App.tsx'

gsap.registerPlugin(ScrollTrigger);

const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://dummy.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

// ── Lenis smooth scroll ──────────────────────────────────────────────────────
const lenis = new Lenis({
  duration: 0.9,
  easing: (t: number) => 1 - Math.pow(1 - t, 4),
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.2,
  infinite: false,
});

// ── Bridge Lenis → GSAP ScrollTrigger ────────────────────────────────────────
// Without this, ScrollTrigger reads native scrollY which Lenis overrides,
// causing pinned sections and scrub animations to break.
lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Expose for components that need direct Lenis access
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
