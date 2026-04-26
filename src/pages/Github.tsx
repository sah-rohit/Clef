import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { Github as GithubIcon, ArrowUpRight } from "lucide-react";

export default function Github() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <main className="flex-1 page-top pb-20 px-6 md:px-12 max-w-3xl mx-auto w-full animate-fade-in">
        <BackButton />
        
        <div className="border-[4px] border-black p-8 md:p-12 shadow-[12px_12px_0px_rgba(0,0,0,1)] bg-white relative">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-b-[4px] border-r-[4px] border-black pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 border-b-[4px] border-l-[4px] border-black pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-t-[4px] border-r-[4px] border-black pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-t-[4px] border-l-[4px] border-black pointer-events-none" />

          <div className="mb-12 border-b-[4px] border-black pb-8">
            <h1 className="font-oswald text-5xl md:text-6xl font-black uppercase tracking-tighter">
              GITHUB REPOSITORY
            </h1>
            <p className="font-inter text-sm md:text-base font-bold uppercase tracking-widest text-black/50 mt-4 leading-relaxed">
              Explore the codebase, track commits, and review open-source architecture.
            </p>
          </div>

          <a 
            href="https://github.com/sah-rohit" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group border-[4px] border-black p-8 bg-[#fafafa] hover:bg-[#F9FF00] transition-colors relative block"
          >
            <div className="absolute top-4 right-4 text-black/20 group-hover:text-black transition-colors">
              <ArrowUpRight size={24} />
            </div>
            <div className="mb-6 w-16 h-16 border-[3px] border-black flex items-center justify-center bg-white group-hover:bg-black group-hover:text-white transition-colors shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <GithubIcon size={32} />
            </div>
            <h2 className="font-oswald text-3xl font-black uppercase tracking-tight mb-2">
              @SAH-ROHIT
            </h2>
            <p className="font-inter text-sm font-bold tracking-widest text-black/60 group-hover:text-black/80 transition-colors uppercase">
              PROCEED TO OFFICIAL GITHUB PROFILE
            </p>
            <div className="mt-8 pt-4 border-t-[3px] border-black/10 group-hover:border-black/30 transition-colors font-oswald text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              HTTPS://GITHUB.COM/SAH-ROHIT
            </div>
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
