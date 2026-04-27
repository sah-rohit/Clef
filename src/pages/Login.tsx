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

      <div className="flex-1 flex flex-col md:flex-row" style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        {/* Left panel — vibrant yellow */}
        <div className="hidden md:flex md:w-[45%] bg-[#F9FF00] border-r-[3px] border-black flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-black border-[3px] border-black flex items-center justify-center mb-8">
              <ShieldCheck size={22} className="text-[#F9FF00]" />
            </div>
            <h2 className="font-oswald text-5xl font-bold uppercase leading-[0.88] tracking-[-0.04em] text-black mb-6">
              YOUR<br />WORKBENCH<br /><span className="text-outline-black">AWAITS.</span>
            </h2>
            <p className="font-inter text-sm text-black/65 leading-relaxed max-w-xs">
              Sign in to sync your AI chat history across devices. Or continue as a guest — all tools work without an account.
            </p>
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            {[
              { color: "#1a1a1a", text: "All 28 tools — no account needed" },
              { color: "#FF0004", text: "Zero data sent to servers" },
              { color: "#7C3AED", text: "AES-256 encrypted cloud sync" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 rotate-45 shrink-0" style={{ background: item.color }} />
                <span className="font-inter text-xs font-semibold uppercase tracking-wide text-black/70">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-8 -right-8 font-oswald text-[160px] font-bold text-black/[0.05] leading-none select-none pointer-events-none uppercase">IN</div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
          <div className="w-full max-w-[400px]">
            <div className="border-[4px] border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
              {/* Header */}
              <div className="bg-[#1a1a1a] text-white p-6 border-b-[4px] border-black text-center">
                <h1 className="font-oswald text-4xl font-bold uppercase tracking-tight">JOIN CLEF</h1>
                <p className="font-inter text-[10px] text-white/50 uppercase tracking-[0.3em] mt-2">Personal Workbench Access</p>
              </div>

              <div className="p-8">
                {/* Mode tabs */}
                <div className="flex gap-0 border-[3px] border-black mb-8 overflow-hidden">
                  {(["GUEST", "SIGNIN", "SIGNUP"] as const).map((m, i) => (
                    <button key={m} type="button" onClick={() => setMode(m)}
                      className={`flex-1 py-3.5 font-oswald text-[10px] sm:text-xs font-bold uppercase ${i < 2 ? "border-r-[3px] border-black" : ""} transition-all ${
                        mode === m ? "bg-[#F9FF00] text-black" : "bg-white text-black/60 hover:bg-[#F9FF00]/20"
                      }`}>
                      {m === "SIGNIN" ? "SIGN IN" : m === "SIGNUP" ? "SIGN UP" : "GUEST"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  {mode !== "GUEST" ? (
                    <>
                      {mode === "SIGNUP" && (
                        <div className="space-y-1.5 animate-fade-in">
                          <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40">Display Name (Optional)</label>
                          <div className="relative">
                            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                            <input type="text" className="input-brutal pl-11 bg-white w-full" placeholder="Your Name"
                              value={name} onChange={(e) => setName(e.target.value)} />
                          </div>
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                          <input type="email" className="input-brutal pl-11 bg-white w-full" placeholder="hello@example.com"
                            value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={16} />
                          <input type="password" className="input-brutal pl-11 bg-white w-full" placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 border-[3px] border-dashed border-black/15 bg-[#fafafa]">
                      <UserCircle size={40} className="mx-auto mb-3 text-black/10" />
                      <p className="font-inter text-xs text-black/55 px-8 leading-relaxed uppercase tracking-tight">
                        Continue as a Guest to use all tools without saving an email. Data stays local.
                      </p>
                    </div>
                  )}

                  {/* Agreement */}
                  <div className="flex items-start gap-3 p-4 border-[3px] border-black bg-[#fafafa]">
                    <button type="button" onClick={() => setAgreed(!agreed)}
                      className={`w-5 h-5 border-[3px] border-black flex-shrink-0 flex items-center justify-center transition-colors mt-0.5 ${agreed ? "bg-black" : "bg-white"}`}>
                      {agreed && <ShieldCheck size={11} className="text-[#F9FF00]" />}
                    </button>
                    <label className="font-inter text-[10px] leading-relaxed cursor-pointer select-none font-medium uppercase tracking-tight" onClick={() => setAgreed(!agreed)}>
                      I agree to the <a href="/terms" className="underline font-bold hover:text-[#FF0004]">Terms</a> and{" "}
                      <a href="/privacy" className="underline font-bold hover:text-[#FF0004]">Privacy Policy</a>.
                    </label>
                  </div>

                  <button type="submit" disabled={!agreed}
                    className={`w-full flex items-center justify-center gap-3 font-oswald font-bold uppercase tracking-widest text-sm py-4 border-[3px] border-black transition-all duration-150 ${
                      agreed
                        ? "bg-[#1a1a1a] text-white hover:bg-[#F9FF00] hover:text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
                        : "bg-black/10 text-black/30 cursor-not-allowed"
                    }`}>
                    {mode === "SIGNUP" ? "CREATE ACCOUNT" : mode === "SIGNIN" ? "ENTER WORKBENCH" : "PROCEED AS GUEST"}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
