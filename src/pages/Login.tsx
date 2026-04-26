import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Mail, UserCircle, ArrowRight, ShieldCheck, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"GUEST" | "SIGNIN" | "SIGNUP">("SIGNIN");
  const [agreed, setAgreed] = useState(false);
  
  const { loginAsGuest, signInWithEmail, signUpWithEmail, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/account");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreed) {
      showToast("Please agree to the Terms and Privacy Policy.", "warning");
      return;
    }

    if (mode === "SIGNUP") {
      if (!email || !password) {
        showToast("Please enter both email and password.", "warning");
        return;
      }
      if (password.length < 8) {
        showToast("Password must be at least 8 characters long.", "warning");
        return;
      }
      try {
        await signUpWithEmail(email, password, name || email.split("@")[0]);
        showToast(`Account Created successfully!`, "success");
        navigate("/account");
      } catch (e: any) {
        let msg = e.message || "Sign up failed.";
        if (msg.includes("Invalid password")) msg = "Incorrect password or email already exists.";
        showToast(msg, "error");
      }
    } else if (mode === "SIGNIN") {
      if (!email || !password) {
        showToast("Please enter both email and password.", "warning");
        return;
      }
      try {
        await signInWithEmail(email, password);
        showToast(`Welcome back!`, "success");
        navigate("/account");
      } catch (e: any) {
        let msg = e.message || "Login failed. Check your credentials.";
        if (msg.includes("Invalid password")) msg = "Incorrect password.";
        showToast(msg, "error");
      }
    } else {
      loginAsGuest();
      showToast("Logged in as Guest!", "success");
      navigate("/account");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />
      
      <div className="flex-1 page-top pb-20 flex items-center justify-center px-6">
        <div className="w-full max-w-[400px]">
          <div className="border-[4px] border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
            <div className="bg-[#1a1a1a] text-white p-6 border-b-[4px] border-black text-center">
              <h1 className="font-oswald text-4xl font-bold uppercase tracking-tight">JOIN CLEF</h1>
              <p className="font-inter text-[10px] text-white/50 uppercase tracking-[0.3em] mt-2">Personal Workbench Access</p>
            </div>

            <div className="p-8">
              <div className="flex gap-0 border-[3px] border-black mb-8 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMode("GUEST")}
                  className={`flex-1 py-4 font-oswald text-[10px] sm:text-xs font-bold uppercase border-r-[3px] border-black transition-all ${mode === "GUEST" ? "bg-[#F9FF00]" : "bg-white hover:bg-[#F9FF00]/20"}`}
                >
                  GUEST
                </button>
                <button
                  type="button"
                  onClick={() => setMode("SIGNIN")}
                  className={`flex-1 py-4 font-oswald text-[10px] sm:text-xs font-bold uppercase border-r-[3px] border-black transition-all ${mode === "SIGNIN" ? "bg-[#F9FF00]" : "bg-white hover:bg-[#F9FF00]/20"}`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => setMode("SIGNUP")}
                  className={`flex-1 py-4 font-oswald text-[10px] sm:text-xs font-bold uppercase transition-all ${mode === "SIGNUP" ? "bg-[#F9FF00]" : "bg-white hover:bg-[#F9FF00]/20"}`}
                >
                  SIGN UP
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {mode !== "GUEST" ? (
                  <>
                    {mode === "SIGNUP" && (
                      <div className="space-y-2 animate-fade-in">
                        <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40 px-1">Display Name (Optional)</label>
                        <div className="relative">
                          <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                          <input
                            type="text"
                            className="input-brutal pl-12 bg-white"
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40 px-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                        <input
                          type="email"
                          className="input-brutal pl-12 bg-white"
                          placeholder="hello@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40 px-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                        <input
                          type="password"
                          className="input-brutal pl-12 bg-white"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10 border-[3px] border-dashed border-black/20 bg-[#fafafa]">
                    <UserCircle size={48} className="mx-auto mb-4 text-black/10" />
                    <p className="font-inter text-xs text-black/60 px-10 leading-relaxed uppercase tracking-tight">
                      Continue as a Guest to use all tools without saving an email. Data stays local.
                    </p>
                  </div>
                )}

                <div className="flex items-start gap-4 p-4 bg-[#fafafa] border-[3px] border-black">
                  <button
                    type="button"
                    onClick={() => setAgreed(!agreed)}
                    className={`w-6 h-6 border-[3px] border-black flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${agreed ? "bg-black" : "bg-white"}`}
                  >
                    {agreed && <ShieldCheck size={14} className="text-[#F9FF00]" />}
                  </button>
                  <label className="font-inter text-[10px] leading-relaxed cursor-pointer select-none font-medium uppercase tracking-tight" onClick={() => setAgreed(!agreed)}>
                    I agree to the <a href="/terms" className="underline font-bold hover:text-[#FF0004]">Terms</a> and 
                    acknowledge the <a href="/privacy" className="underline font-bold hover:text-[#FF0004]">Privacy Policy</a>.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!agreed}
                  className={`btn-brutal btn-brutal-black w-full flex items-center justify-center gap-3 group py-5 text-lg ${!agreed ? "opacity-30 grayscale cursor-not-allowed" : "hover:bg-[#F9FF00] hover:text-black"}`}
                >
                  {mode === "SIGNUP" ? "CREATE ACCOUNT" : mode === "SIGNIN" ? "ENTER WORKBENCH" : "PROCEED AS GUEST"}
                  <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
