import { useState, useEffect } from "react";
import { X, Sparkles, Zap } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [type, setType] = useState<"FIRST" | "RETURN">("FIRST");
  const { user } = useAuth();

  useEffect(() => {
    const lastVisit = localStorage.getItem("clef_last_visit");
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (!lastVisit) {
      setType("FIRST");
      setShow(true);
    } else if (now - parseInt(lastVisit) > sevenDays) {
      setType("RETURN");
      setShow(true);
    }

    localStorage.setItem("clef_last_visit", now.toString());
  }, [user]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border-[4px] border-black p-8 md:p-12 max-w-xl w-full shadow-[16px_16px_0px_rgba(0,0,0,1)] animate-slide-up relative">
        <button 
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 p-2 hover:bg-[#FF0004] hover:text-white transition-colors border-[2px] border-transparent hover:border-black"
        >
          <X size={24} />
        </button>

        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#F9FF00] border-[4px] border-black flex items-center justify-center -rotate-6 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
            {type === "FIRST" ? <Sparkles size={32} /> : <Zap size={32} />}
          </div>
        </div>

        {type === "FIRST" ? (
          <div className="text-center space-y-4">
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-tight">System Initialized</h2>
            <p className="font-inter text-sm text-black/70 leading-relaxed uppercase tracking-wider font-bold">
              Welcome to Clef — Your new Brutalist Productivity Suite.
            </p>
            <p className="font-inter text-sm text-black/60 leading-relaxed mt-4">
              All tools run entirely in your browser. No tracking, no forced accounts, completely free forever.
            </p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h2 className="font-oswald text-4xl md:text-5xl font-bold uppercase tracking-tight">Welcome Back</h2>
            <p className="font-inter text-sm text-black/70 leading-relaxed uppercase tracking-wider font-bold">
              It's been a while, {user?.name ? user.name.split(" ")[0] : "Commander"}.
            </p>
            <p className="font-inter text-sm text-black/60 leading-relaxed mt-4">
              The workbench is ready. Let's get back to building.
            </p>
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <button 
            onClick={() => setShow(false)}
            className="btn-brutal btn-brutal-black w-full md:w-auto text-sm py-4 px-12 hover:bg-[#F9FF00] hover:text-black hover:border-black"
          >
            ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
}
