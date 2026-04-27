import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

export default function UserAgreement() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero — red bg */}
      <div className="bg-[#FF0004] border-b-[3px] border-black relative overflow-hidden"
        style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28 relative z-10">
          <div className="mb-6"><BackButton /></div>
          <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 block mb-4">LEGAL</span>
          <h1 className="font-oswald text-6xl md:text-8xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-white mb-6">
            USER<br /><span className="text-outline-white">AGREEMENT.</span>
          </h1>
          <p className="font-inter text-base text-white/65 leading-relaxed italic max-w-xl">
            "By using these tools, you agree to these simple terms."
          </p>
        </div>
        <div className="absolute -bottom-4 -right-4 font-oswald text-[180px] font-bold text-white/[0.04] leading-none select-none pointer-events-none uppercase">AGREE</div>
      </div>

      {/* Content — white bg */}
      <div className="bg-white border-b-[3px] border-black">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-20 max-w-4xl">
          <div className="space-y-0 border-[3px] border-black">
            {[
              { num: "1", color: "#F9FF00", title: "ACCEPTANCE OF TERMS",          text: "By accessing and using the tools provided by Clef (Sonata Interactive), you agree to abide by this User Agreement. If you do not agree with any part of these terms, you must not use our services." },
              { num: "2", color: "#00E5FF", title: "USE OF SERVICES",              text: "Our tools are provided \"as is\" and \"as available\". You agree to use the services only for lawful purposes and in a way that does not infringe the rights of others. We reserve the right to modify or discontinue any tool at any time." },
              { num: "3", color: "#00FF87", title: "DATA PRIVACY & LOCAL STORAGE", text: "We prioritize your privacy by keeping most of your data processing entirely within your browser (local storage). You are responsible for safeguarding your own data, as clearing your browser cache may result in the loss of unsaved preferences." },
              { num: "4", color: "#7C3AED", title: "COMMUNITY GUIDELINES",         text: "When interacting with our community boards or public feedback systems, you agree to treat others with respect. Harassment, spam, or abusive behavior will result in a ban. We reserve the right to remove any content that violates these guidelines." },
              { num: "5", color: "#FF0004", title: "LIMITATION OF LIABILITY",      text: "In no event shall Sonata Interactive be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our tools or services." },
            ].map((s, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 border-b-[3px] border-black last:border-b-0">
                <div className="md:col-span-3 px-6 py-6 border-b-[3px] md:border-b-0 md:border-r-[3px] border-black flex items-center gap-3"
                  style={{ background: s.color }}>
                  <div className="w-8 h-8 flex items-center justify-center font-oswald text-sm font-bold border-[2px] border-black bg-black"
                    style={{ color: s.color }}>{s.num}</div>
                  <span className="font-oswald text-sm font-bold uppercase text-black">{s.title}</span>
                </div>
                <div className="md:col-span-9 px-6 py-6">
                  <p className="font-inter text-sm text-black/65 leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
