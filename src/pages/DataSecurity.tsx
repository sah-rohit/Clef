import { Shield, Lock, EyeOff, Server, HardDrive, Key } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

export default function DataSecurity() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero — cyan bg */}
      <div className="bg-[#00E5FF] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div className="px-6 md:px-12 lg:px-16 pt-28 pb-24 md:pt-36 md:pb-32 relative z-10">
          <div className="mb-10"><BackButton /></div>
          <div className="inline-flex items-center gap-3 bg-black text-[#00E5FF] px-4 py-2 border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] mb-8">
            <Shield size={24} />
            <span className="font-oswald text-xl font-bold uppercase tracking-widest">Security Protocol</span>
          </div>
          <h1 className="font-oswald text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter text-black mb-6">
            YOUR DATA, <br />YOUR TERMS.
          </h1>
          <p className="font-inter text-xl text-black/60 max-w-2xl leading-relaxed">
            Clef is built on the philosophy of absolute transparency. We believe your productivity data should never be a commodity.
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 font-oswald text-[200px] font-bold text-black/[0.04] leading-none select-none pointer-events-none uppercase">SHIELD</div>
      </div>

      <main className="pb-20 px-6 pt-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">

            <div className="grid md:grid-cols-2 gap-8">
              <section className="border-[4px] border-black p-8 space-y-4 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                  <Lock size={24} />
                </div>
                <h3 className="font-oswald text-2xl font-bold uppercase">End-to-End Privacy</h3>
                <p className="font-inter text-sm leading-relaxed text-black/70">
                  By default, Clef uses a secure serverless architecture (Convex) to handle your profile. When you use our default AI engine, your keys are never exposed to the browser.
                </p>
              </section>

              <section className="border-[4px] border-black p-8 space-y-4 shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-[#F9FF00]/10">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                  <Key size={24} />
                </div>
                <h3 className="font-oswald text-2xl font-bold uppercase">BYOK (Bring Your Own Key)</h3>
                <p className="font-inter text-sm leading-relaxed text-black/70">
                  When you provide a custom API key or Local Endpoint, Clef switches to "Client-Direct" mode. Your keys are stored strictly in your browser's LocalStorage and are never sent to our servers.
                </p>
              </section>

              <section className="border-[4px] border-black p-8 space-y-4 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                  <HardDrive size={24} />
                </div>
                <h3 className="font-oswald text-2xl font-bold uppercase">LocalStorage Sovereignty</h3>
                <p className="font-inter text-sm leading-relaxed text-black/70">
                  Guest mode data (chats, text drafts, code snippets) is stored entirely on your device. Clearing your browser data permanently removes this information.
                </p>
              </section>

              <section className="border-[4px] border-black p-8 space-y-4 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                  <EyeOff size={24} />
                </div>
                <h3 className="font-oswald text-2xl font-bold uppercase">No Tracking</h3>
                <p className="font-inter text-sm leading-relaxed text-black/70">
                  We use zero third-party analytics, zero tracking cookies, and zero invasive monitoring. Your workflow is your business.
                </p>
              </section>
            </div>

            <div className="bg-black text-white p-10 space-y-6">
              <div className="flex items-center gap-4">
                <Server className="text-[#F9FF00]" size={32} />
                <h3 className="font-oswald text-3xl font-bold uppercase">Self-Hosting Security</h3>
              </div>
              <p className="font-inter text-lg opacity-80 leading-relaxed">
                If you choose to host Clef locally or use local AI models (like Ollama), the security perimeter is entirely within your control. Clef functions as a pure interface, making no external calls unless explicitly configured.
              </p>
              <div className="pt-4 border-t border-white/20 flex gap-8">
                <div className="space-y-1">
                  <p className="font-oswald text-[10px] uppercase tracking-widest text-[#F9FF00]">Status</p>
                  <p className="font-inter text-sm font-bold">Hardened</p>
                </div>
                <div className="space-y-1">
                  <p className="font-oswald text-[10px] uppercase tracking-widest text-[#F9FF00]">Encryption</p>
                  <p className="font-inter text-sm font-bold">AES-256 (Cloud Only)</p>
                </div>
                <div className="space-y-1">
                  <p className="font-oswald text-[10px] uppercase tracking-widest text-[#F9FF00]">Audit</p>
                  <p className="font-inter text-sm font-bold">Open Source</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
