import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="px-6 md:px-12 lg:px-16 max-w-4xl mx-auto">
          <div className="mb-12">
            <BackButton />
            <span className="font-oswald text-xs font-bold uppercase tracking-[0.2em] text-[#FF0004] block mb-4">
              Legal
            </span>
            <h1 className="font-oswald text-5xl md:text-7xl font-bold uppercase tracking-[-0.03em] leading-tight mb-6">
              COOKIE POLICY
            </h1>
            <p className="font-inter text-lg text-black/70 leading-relaxed italic">
              "Everything local. No tracking."
            </p>
          </div>

          <div className="space-y-8">
            <section className="border-l-[6px] border-black pl-8 py-4">
              <h2 className="font-oswald text-2xl font-bold uppercase mb-4">1. What Are Cookies</h2>
              <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used in order to make websites work, or work more efficiently, as well as to provide reporting information.
              </p>
            </section>
            
            <section className="border-l-[6px] border-[#F9FF00] pl-8 py-4">
              <h2 className="font-oswald text-2xl font-bold uppercase mb-4">2. How We Use Cookies</h2>
              <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                We use cookies to understand how you interact with our tools and to save your preferences. Specifically, we use local storage to save your generated data and tool preferences so that your data remains private and local to your device.
              </p>
            </section>

            <section className="border-l-[6px] border-[#FF0004] pl-8 py-4">
              <h2 className="font-oswald text-2xl font-bold uppercase mb-4">3. Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 space-y-2 font-inter text-sm text-black/70 leading-relaxed">
                <li><strong>Essential Cookies:</strong> Required for the operation of our tools and account system.</li>
                <li><strong>Preference Cookies:</strong> Used to remember your settings and preferences.</li>
                <li><strong>Local Storage:</strong> We heavily utilize browser local storage instead of traditional cookies to keep your data private and completely offline where possible.</li>
              </ul>
            </section>

            <section className="border-l-[6px] border-black pl-8 py-4">
              <h2 className="font-oswald text-2xl font-bold uppercase mb-4">4. Managing Cookies</h2>
              <p className="font-inter text-sm text-black/70 leading-relaxed mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
