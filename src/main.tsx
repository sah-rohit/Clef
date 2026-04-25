import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import './index.css'
import { AuthProvider } from './providers/AuthProvider'
import { ToastProvider } from './providers/ToastProvider'
import { ConfirmProvider } from './providers/ConfirmProvider'
import App from './App.tsx'

const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://dummy.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

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
