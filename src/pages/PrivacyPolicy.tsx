import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { ShieldCheck, EyeOff, Lock, ServerOff } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
          <div className="mb-12">
            <BackButton />
            <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-4">
              Privacy First
            </span>
            <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-[-0.03em] leading-tight mb-6">
              I DON'T WANT<br />
              YOUR DATA.
            </h1>
            <p className="font-inter text-lg text-black/70 leading-relaxed italic">
              "I believe privacy is a human right. Here is my policy in plain English."
            </p>
          </div>

          <div className="space-y-12">
            {/* Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-[3px] border-black">
              <div className="p-8 border-r-[3px] border-b-[3px] md:border-b-0 border-black">
                <ServerOff size={32} className="text-[#FF0004] mb-4" />
                <h3 className="font-oswald text-xl font-bold uppercase mb-2">LOCAL ONLY</h3>
                <p className="font-inter text-sm text-black/60 leading-relaxed">
                  I don't have a backend database for your tools. Everything you type or generate
                  stays within your browser.
                </p>
              </div>
              <div className="p-8">
                <EyeOff size={32} className="text-[#F9FF00] mb-4" />
                <h3 className="font-oswald text-xl font-bold uppercase mb-2">NO TRACKING</h3>
                <p className="font-inter text-sm text-black/60 leading-relaxed">
                  I don't use Google Analytics or any third-party tracking. I have
                  no interest in who you are or what you're doing.
                </p>
              </div>
            </div>

            {/* Detailed points */}
            <div className="space-y-8">
              <section className="border-l-[6px] border-black pl-8 py-4">
                <h2 className="font-oswald text-2xl font-bold uppercase mb-4">1. WHAT I COLLECT</h2>
                <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                  Virtually nothing. If you "Log In" with an email, it's stored locally in your browser's 
                  <code className="bg-[#fafafa] px-1 border border-black/10">localStorage</code>. 
                  This is never sent to a server.
                </p>
              </section>

              <section className="border-l-[6px] border-[#F9FF00] pl-8 py-4">
                <h2 className="font-oswald text-2xl font-bold uppercase mb-4">2. HOW I USE INFO</h2>
                <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                  Any personalization is strictly for your local experience. It stays on your device.
                </p>
              </section>

              <section className="border-l-[6px] border-[#FF0004] pl-8 py-4">
                <h2 className="font-oswald text-2xl font-bold uppercase mb-4">3. COOKIES</h2>
                <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                  I don't use tracking cookies. I only use local storage to remember your tool preferences.
                </p>
              </section>

              <section className="border-l-[6px] border-black pl-8 py-4">
                <h2 className="font-oswald text-2xl font-bold uppercase mb-4">4. YOUR RIGHTS</h2>
                <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                  You have total control. Clear your browser cache or use the "Delete Account" button
                  to wipe everything instantly.
                </p>
              </section>
            </div>

            <div className="bg-[#1a1a1a] text-white p-10 border-[3px] border-black">
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheck size={40} className="text-[#F9FF00]" />
                <h2 className="font-oswald text-3xl font-bold uppercase">MY PROMISE</h2>
              </div>
              <p className="font-inter text-sm text-white/60 leading-relaxed mb-6">
                Clef will never sell your data or compromise your privacy. 
                This project is built for utility, not surveillance.
              </p>
              <div className="inline-block px-4 py-2 border-[2px] border-[#F9FF00] text-[#F9FF00] font-oswald text-xs font-bold uppercase tracking-widest">
                VERIFIED PRIVATE & SECURE
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
