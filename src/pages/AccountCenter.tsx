import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { useConfirm } from "@/providers/ConfirmProvider";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { 
  User, Mail, Shield, LogOut, Trash2, Download, 
  Settings, History, Camera, Save, X, Bell,
  Key, Smartphone, Globe, CheckCircle2, AlertCircle,
  LayoutDashboard, Sliders, Activity, Star, Moon, Sun, Monitor,
  ChevronRight, Command, Terminal, Fingerprint
} from "lucide-react";
import { BackButton } from "@/components/BackButton";
import gsap from "gsap";

type Tab = "OVERVIEW" | "PROFILE" | "PREFERENCES" | "SECURITY" | "ACTIVITY" | "NOTIFICATIONS";

export default function AccountCenter() {
  const { 
    user, logout, deleteAccount, updateProfile, 
    loginActivities, downloadUserData, isAuthenticated,
    notifications, markNotificationRead, clearNotifications,
    logoutFromDevice, updateEmail, resetPassword
  } = useAuth();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("OVERVIEW");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || ""
  });

  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });
  const [emailData, setEmailData] = useState({ newEmail: "", currentPassword: "" });

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    gsap.fromTo(
      ".tab-content",
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }
    );
  }, [activeTab]);

  if (!isAuthenticated || !user) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    showToast("PROFILE SYNCHRONIZED.", "success");
  };

  const SIDEBAR_COLORS: Record<Tab, { color: string; text: string }> = {
    OVERVIEW:      { color: "#F9FF00", text: "#000000" },
    PROFILE:       { color: "#00E5FF", text: "#000000" },
    PREFERENCES:   { color: "#00FF87", text: "#000000" },
    SECURITY:      { color: "#FF0004", text: "#ffffff" },
    ACTIVITY:      { color: "#7C3AED", text: "#ffffff" },
    NOTIFICATIONS: { color: "#1a1a1a", text: "#ffffff" },
  };

  const theme = SIDEBAR_COLORS[activeTab];

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-black selection:text-white">
      <Navigation />

      <main className="flex-1 flex flex-col lg:flex-row relative" style={{ paddingTop: "calc(var(--ribbon-h) + var(--nav-h))" }}>
        
        {/* ── Fixed Sidebar ── */}
        <aside 
          className="lg:w-80 border-b-[4px] lg:border-b-0 lg:border-r-[4px] border-black flex flex-col shrink-0 transition-colors duration-500 relative z-20"
          style={{ background: theme.color, minHeight: "calc(100vh - var(--ribbon-h) - var(--nav-h))" }}
        >
          {/* Background Text Overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-[0.03]">
             <span className="font-oswald text-[200px] font-black absolute -left-10 top-20 rotate-90 uppercase leading-none">{activeTab}</span>
          </div>

          {/* Profile Header */}
          <div className="p-8 border-b-[4px] border-black flex flex-col gap-8 relative z-10">
             <BackButton />
             <div className="flex items-center gap-5">
                <div className="w-16 h-16 border-[4px] border-black bg-white shadow-[4px_4px_0px_black] overflow-hidden shrink-0">
                   {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={32} className="m-auto mt-3" />}
                </div>
                <div className="min-w-0">
                   <h2 className="font-oswald text-xl font-black uppercase truncate leading-none mb-1" style={{ color: theme.text }}>{user.name}</h2>
                   <p className="font-mono text-[10px] font-bold tracking-widest opacity-60 truncate" style={{ color: theme.text }}>@{user.username}</p>
                </div>
             </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 flex flex-col py-4 relative z-10 overflow-y-auto">
             {(Object.keys(SIDEBAR_COLORS) as Tab[]).map((tab) => {
               const isActive = activeTab === tab;
               return (
                 <button 
                   key={tab} 
                   onClick={() => setActiveTab(tab)}
                   className={`w-full px-8 py-5 flex items-center justify-between group transition-all ${isActive ? "bg-black" : "hover:bg-black/5"}`}
                 >
                   <span className={`font-oswald text-sm font-black uppercase tracking-widest transition-all ${isActive ? "text-white translate-x-2" : ""}`} style={{ color: isActive ? "" : theme.text }}>
                     {tab}
                   </span>
                   {isActive && <ChevronRight className="text-white" size={16} />}
                 </button>
               );
             })}
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t-[4px] border-black flex flex-col gap-3 relative z-10 bg-black/5">
             <button onClick={logout} className="w-full py-4 border-[3px] border-black bg-black text-white font-oswald font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all">
                <LogOut size={14} /> TERMINATE_SESSION
             </button>
          </div>
        </aside>

        {/* ── Content Area ── */}
        <div className="flex-1 min-w-0 bg-[#fafafa] relative overflow-y-auto" style={{ maxHeight: "calc(100vh - var(--ribbon-h) - var(--nav-h))" }}>
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
           
           <div className="tab-content p-8 lg:p-16 max-w-6xl mx-auto relative z-10">
              {/* Tab Hero */}
              <div className="mb-16">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-[4px]" style={{ background: theme.color }} />
                    <span className="font-oswald text-xs font-black uppercase tracking-[0.3em] opacity-30">SYSTEM_RECORD // {activeTab}</span>
                 </div>
                 <h1 className="font-oswald text-7xl md:text-8xl font-black uppercase leading-[0.85] tracking-tighter text-black">
                    {activeTab === "OVERVIEW" && <>DASHBOARD<br /><span className="text-outline-black opacity-20">NOMINAL.</span></>}
                    {activeTab === "PROFILE" && <>IDENTITY<br /><span className="text-outline-black opacity-20">PROTOCOL.</span></>}
                    {activeTab === "SECURITY" && <>ACCESS<br /><span className="text-outline-black opacity-20">CONTROL.</span></>}
                    {activeTab === "PREFERENCES" && <>SYSTEM<br /><span className="text-outline-black opacity-20">TUNING.</span></>}
                    {activeTab === "ACTIVITY" && <>SESSION<br /><span className="text-outline-black opacity-20">HISTORY.</span></>}
                    {activeTab === "NOTIFICATIONS" && <>ACTIVE<br /><span className="text-outline-black opacity-20">ALERTS.</span></>}
                 </h1>
              </div>

              {/* Dynamic Grids */}
              {activeTab === "OVERVIEW" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
                   <div className="bg-white border-[4px] border-black p-10 shadow-[12px_12px_0px_black] group hover:-translate-y-2 transition-all">
                      <LayoutDashboard className="mb-6 opacity-20 group-hover:opacity-100 transition-opacity" size={32} />
                      <h3 className="font-oswald text-2xl font-black uppercase mb-2">ACCOUNT_STATUS</h3>
                      <p className="font-inter text-sm font-medium text-black/50 mb-8">Verification complete. All premium modules active.</p>
                      <div className="flex items-center gap-3 text-[#00FF87] font-bold text-xs uppercase tracking-widest">
                         <CheckCircle2 size={16} /> ENCRYPTED_LINK_STABLE
                      </div>
                   </div>
                   <div className="bg-white border-[4px] border-black p-10 shadow-[12px_12px_0px_black] group hover:-translate-y-2 transition-all">
                      <Fingerprint className="mb-6 opacity-20 group-hover:opacity-100 transition-opacity" size={32} />
                      <h3 className="font-oswald text-2xl font-black uppercase mb-2">MEMBER_SINCE</h3>
                      <p className="font-inter text-sm font-medium text-black/50 mb-8">Joined the ecosystem on {new Date(user.createdAt).getFullYear()}</p>
                      <div className="font-oswald text-2xl font-black text-[#7C3AED]">{new Date(user.createdAt).toLocaleDateString()}</div>
                   </div>
                </div>
              )}

              {activeTab === "PROFILE" && (
                <div className="bg-white border-[4px] border-black p-10 shadow-[12px_12px_0px_black] max-w-2xl">
                   <form onSubmit={handleUpdate} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="flex flex-col gap-3">
                            <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">DISPLAY_NAME</label>
                            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="border-[3px] border-black p-4 font-inter text-sm font-bold bg-[#fafafa] focus:bg-white transition-colors" />
                         </div>
                         <div className="flex flex-col gap-3">
                            <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">ALIAS_HANDLE</label>
                            <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="border-[3px] border-black p-4 font-inter text-sm font-bold bg-[#fafafa] focus:bg-white transition-colors" />
                         </div>
                      </div>
                      <div className="flex flex-col gap-3">
                         <label className="font-oswald text-[10px] font-black uppercase tracking-widest opacity-40">AVATAR_URI</label>
                         <input type="text" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} className="border-[3px] border-black p-4 font-inter text-sm font-bold bg-[#fafafa] focus:bg-white transition-colors" />
                      </div>
                      <button type="submit" className="px-10 py-5 bg-[#1a1a1a] text-white font-oswald font-black uppercase tracking-widest text-xs hover:bg-[#F9FF00] hover:text-black transition-all">SYNC_RECORDS</button>
                   </form>
                </div>
              )}

              {activeTab === "SECURITY" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-white border-[4px] border-black p-10 shadow-[12px_12px_0px_black]">
                      <h3 className="font-oswald text-2xl font-black uppercase mb-6 flex items-center gap-3"><Key size={24} /> CIPHER_UPDATE</h3>
                      <div className="space-y-4">
                         <input type="password" placeholder="CURRENT_KEY" className="w-full border-[3px] border-black p-4 font-mono text-xs font-bold bg-[#fafafa]" />
                         <input type="password" placeholder="NEW_KEY" className="w-full border-[3px] border-black p-4 font-mono text-xs font-bold bg-[#fafafa]" />
                         <button className="w-full py-4 bg-black text-white font-oswald font-black uppercase tracking-widest text-[10px] mt-4 hover:bg-[#FF0004] transition-colors">INITIATE_ROTATION</button>
                      </div>
                   </div>
                   <div className="bg-[#FF0004]/5 border-[4px] border-[#FF0004] p-10 shadow-[12px_12px_0px_rgba(255,0,4,0.1)]">
                      <h3 className="font-oswald text-2xl font-black uppercase text-[#FF0004] mb-4">DANGER_ZONE</h3>
                      <p className="font-inter text-xs font-bold text-[#FF0004]/60 uppercase mb-8">ACCOUNT_PURGE_PROTOCOL</p>
                      <button onClick={handleDelete} className="px-8 py-4 bg-[#FF0004] text-white font-oswald font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all">INITIATE_PURGE</button>
                   </div>
                </div>
              )}

              {activeTab === "ACTIVITY" && (
                <div className="space-y-4">
                   {loginActivities.map(log => (
                     <div key={log.id} className="bg-white border-[4px] border-black p-8 flex items-center justify-between group hover:bg-black hover:text-white transition-all shadow-[8px_8px_0px_black]">
                        <div className="flex items-center gap-8">
                           <div className={`w-14 h-14 border-[3px] border-black flex items-center justify-center shrink-0 ${log.active ? "bg-[#00E5FF] text-black" : "bg-black text-white group-hover:bg-white group-hover:text-black"}`}>
                              <Smartphone size={24} />
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className="font-oswald text-lg font-black uppercase">{log.device} // {log.browser}</h4>
                                 {log.active && <span className="bg-[#00FF87] text-black px-2 py-0.5 font-mono text-[8px] font-black uppercase">ACTIVE</span>}
                              </div>
                              <p className="font-mono text-[9px] opacity-40 uppercase tracking-widest">IP: {log.ip} // {new Date(log.timestamp).toLocaleString()}</p>
                           </div>
                        </div>
                        {log.active ? <Activity className="text-[#00FF87] animate-pulse" size={20} /> : <X className="opacity-10" size={20} />}
                     </div>
                   ))}
                </div>
              )}
              
              {activeTab === "NOTIFICATIONS" && (
                <div className="space-y-6">
                   {notifications.length === 0 ? (
                     <div className="py-40 text-center border-[4px] border-black border-dashed opacity-20">
                        <Bell className="m-auto mb-4" size={48} />
                        <p className="font-oswald text-2xl font-black uppercase tracking-[0.3em]">NO_ALERTS</p>
                     </div>
                   ) : (
                     notifications.map(n => (
                       <div key={n.id} onClick={() => markNotificationRead(n.id)} className={`bg-white border-[4px] border-black p-8 flex items-start gap-8 cursor-pointer hover:translate-x-2 transition-all shadow-[8px_8px_0px_black] ${n.read ? "opacity-40" : ""}`}>
                          <div className={`p-4 border-[3px] border-black ${n.type === 'success' ? 'bg-[#00FF87]' : 'bg-[#FF0004] text-white'}`}>
                             {n.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center justify-between mb-2">
                                <h4 className="font-oswald text-xl font-black uppercase">{n.title}</h4>
                                <span className="font-mono text-[9px] opacity-40 uppercase">{new Date(n.timestamp).toLocaleTimeString()}</span>
                             </div>
                             <p className="font-inter text-sm font-medium text-black/70 leading-relaxed">{n.message}</p>
                          </div>
                       </div>
                     ))
                   )}
                </div>
              )}
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
