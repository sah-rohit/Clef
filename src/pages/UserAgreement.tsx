import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

export default function UserAgreement() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="page-top pb-20">
        <div className="px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
          <div className="mb-12">
            <BackButton />
            <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-4">
              Legal
            </span>
            <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-[-0.03em] leading-tight mb-6">
              USER AGREEMENT
            </h1>
            <p className="font-inter text-lg text-black/70 leading-relaxed italic">
              "By using these tools, you agree to these simple terms."
            </p>
          </div>

          <div className="space-y-8">
            <section className="border-l-[6px] border-black pl-8 py-4">
              <h2 className="font-oswald text-2xl font-bold uppercase mb-4">1. Acceptance of Terms</h2>
              <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                By accessing and using the tools provided by Clef (Sonata Interactive), you agree to abide by this User Agreement. If you do not agree with any part of these terms, you must not use our services.
              </p>
            </section>
            
            <section className="border-l-[6px] border-[#F9FF00] pl-8 py-4">
              <h2 className="font-oswald text-2xl font-bold uppercase mb-4">2. Use of Services</h2>
              <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                Our tools are provided "as is" and "as available". You agree to use the services only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the tools. We reserve the right to modify or discontinue any tool at any time.
              </p>
            </section>

            <section className="border-l-[6px] border-[#FF0004] pl-8 py-4">
              <h2 className="font-oswald text-2xl font-bold uppercase mb-4">3. Data Privacy and Local Storage</h2>
              <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                We prioritize your privacy by keeping most of your data processing entirely within your browser (local storage). You are responsible for safeguarding your own data, as clearing your browser cache may result in the loss of unsaved preferences and local content.
              </p>
            </section>

            <section className="border-l-[6px] border-black pl-8 py-4">
              <h2 className="font-oswald text-2xl font-bold uppercase mb-4">4. Community Guidelines</h2>
              <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                When interacting with our community boards or public feedback systems, you agree to treat others with respect. Harassment, spam, or abusive behavior will result in a ban from the platform. We reserve the right to remove any content that violates these guidelines.
              </p>
            </section>

            <section className="border-l-[6px] border-[#F9FF00] pl-8 py-4">
              <h2 className="font-oswald text-2xl font-bold uppercase mb-4">5. Limitation of Liability</h2>
              <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                In no event shall Sonata Interactive be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our tools or services.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
