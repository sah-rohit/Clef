import { BackButton } from "@/components/BackButton";
import { Footer } from "@/components/Footer";

export default function OpenSource() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <BackButton />
          
          <div className="mb-16">
            <span className="font-oswald text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF0004] block mb-2">INITIATIVE</span>
            <h1 className="font-oswald text-7xl font-bold uppercase tracking-tighter leading-none mb-6">OPEN SOURCE</h1>
            <p className="font-inter text-sm text-black/60 max-w-xl uppercase tracking-tight">
              Clef is built on the principles of transparency and collective intelligence. We believe the best tools are built in the open.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-[4px] border-black p-10 bg-[#fafafa] shadow-[12px_12px_0px_rgba(0,0,0,1)]">
            <div className="md:col-span-8 space-y-12">
              <section>
                <h2 className="font-oswald text-2xl font-bold uppercase mb-4">THE REPOSITORY</h2>
                <p className="font-inter text-sm leading-relaxed mb-6">
                  The entire source code of this productivity suite is available on GitHub. This includes our custom Brutalist design system, the real-time Convex backend integrations, and our suite of creator utilities.
                </p>
                <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                  <p className="font-mono text-xs font-bold mb-4">GITHUB_REPO: sah-rohit/clef</p>
                  <a 
                    href="https://github.com/sah-rohit/clef" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-brutal btn-brutal-yellow inline-block px-6 py-2 text-[10px]"
                  >
                    VISIT REPOSITORY
                  </a>
                </div>
              </section>

              <section>
                <h2 className="font-oswald text-2xl font-bold uppercase mb-4">CONTRIBUTING</h2>
                <p className="font-inter text-sm leading-relaxed">
                  Found a bug in the JSON formatter? Want to add a new logic engine to Clef AI? We welcome all contributions. Simply fork the repo, create a feature branch, and submit a pull request.
                </p>
              </section>

              <section>
                <h2 className="font-oswald text-2xl font-bold uppercase mb-4">LICENSE</h2>
                <p className="font-inter text-sm leading-relaxed">
                  Clef is released under the MIT License. This means you are free to use, copy, modify, and distribute the software as long as the original copyright notice and license are included.
                </p>
              </section>
            </div>

            <div className="md:col-span-4 space-y-8">
              <div className="border-[3px] border-black p-6 bg-white">
                <h3 className="font-oswald text-xs font-bold uppercase mb-4 text-[#FF0004]">PROTOCOL</h3>
                <ul className="space-y-3 font-inter text-[10px] font-bold uppercase tracking-tighter">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rotate-45" /> No Tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rotate-45" /> No Cookies
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rotate-45" /> Real-time Data
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-black rotate-45" /> Brutalist UX
                  </li>
                </ul>
              </div>

              <div className="border-[3px] border-black p-6 bg-black text-white">
                <h3 className="font-oswald text-xs font-bold uppercase mb-2 text-[#F9FF00]">TRANSPARENCY</h3>
                <p className="font-inter text-[9px] uppercase leading-relaxed opacity-60">
                  All community interactions and feedback are stored in the open on our Convex database.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
