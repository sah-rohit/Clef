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
  LayoutDashboard, Sliders, Activity, Star, Moon, Sun, Monitor
} from "lucide-react";
import { BackButton } from "@/components/BackButton";

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<Tab>("OVERVIEW");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    avatar: user?.avatar || ""
  });

  const [passData, setPassData] = useState({ old: "", new: "", confirm: "" });
  const [emailData, setEmailData] = useState({ newEmail: "", currentPassword: "" });
  const [themePreference, setThemePreference] = useState("SYSTEM");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  if (!isAuthenticated || !user) return null;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      username: formData.username,
      avatar: formData.avatar
    });
    setIsEditing(false);
    showToast("PROFILE SYNCHRONIZED.", "success");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, avatar: base64 });
        updateProfile({ avatar: base64 });
        showToast("AVATAR UPLOADED SUCCESSFULLY.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      showToast("NEW PASSWORDS DO NOT MATCH.", "error");
      return;
    }
    const ok = resetPassword(passData.old, passData.new);
    if (ok) {
      showToast("PASSWORD UPDATED.", "success");
      setPassData({ old: "", new: "", confirm: "" });
    } else {
      showToast("INCORRECT CURRENT PASSWORD.", "error");
    }
  };

  const handleEmailUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmail(emailData.newEmail);
    showToast("EMAIL RECORD UPDATED.", "success");
    setEmailData({ newEmail: "", currentPassword: "" });
  };

  const handleLogout = async () => {
    const ok = await confirm({
      title: "SYSTEM LOGOUT",
      message: "TERMINATING CURRENT SESSION. PROCEED?",
      confirmText: "CONFIRM LOGOUT",
      variant: "default"
    });
    if (ok) {
      logout();
      showToast("SESSION TERMINATED.", "info");
      navigate("/");
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "PURGE ACCOUNT",
      message: "WARNING: THIS ACTION IRREVERSIBLY DESTROYS ALL ASSOCIATED USER DATA. CONTINUE?",
      confirmText: "INITIATE PURGE",
      variant: "danger",
      countdown: 5
    });
    if (ok) {
      deleteAccount();
      showToast("ACCOUNT PURGED.", "success");
      navigate("/");
    }
  };

  const handleExport = () => {
    downloadUserData();
    showToast("DATA EXPORT INITIATED.", "success");
  };

  const handleClearCache = () => {
    showToast("LOCAL CACHE CLEARED.", "success");
  };

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: "OVERVIEW", label: "DASHBOARD", icon: LayoutDashboard },
    { id: "PROFILE", label: "IDENTITY", icon: User },
    { id: "PREFERENCES", label: "PREFERENCES", icon: Sliders },
    { id: "SECURITY", label: "SECURITY", icon: Shield },
    { id: "ACTIVITY", label: "SESSION LOGS", icon: Activity },
    { id: "NOTIFICATIONS", label: "ALERTS", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-[#F9FF00] selection:text-black flex flex-col">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto flex-1 w-full">
        <BackButton />
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-[4px] border-black pb-6">
          <div>
            <span className="inline-block bg-black text-[#F9FF00] px-3 py-1 font-oswald text-[10px] font-bold uppercase tracking-widest mb-3">
              CONTROL PANEL v3.1
            </span>
            <h1 className="font-oswald text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-black">
              COMMAND CENTER
            </h1>
          </div>
          <div className="font-mono text-xs font-bold text-black/50">
            SYS.TIME: {currentTime.toLocaleTimeString()}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4 flex flex-col gap-8">
            
            {/* Quick Profile Card */}
            <div className="border-[4px] border-black p-6 bg-[#F9FF00] shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-black opacity-5 rounded-full -mr-10 -mt-10 pointer-events-none group-hover:scale-150 transition-transform duration-500" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 border-[3px] border-black bg-white overflow-hidden shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black text-white">
                      <User size={32} />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <h2 className="font-oswald text-xl font-black uppercase truncate">{user.name}</h2>
                  <p className="font-inter text-[10px] font-bold tracking-widest text-black/60 truncate uppercase">@{user.username}</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col border-[4px] border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              {TABS.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const notifCount = tab.id === "NOTIFICATIONS" ? notifications.filter(n => !n.read).length : 0;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-5 text-left transition-colors border-b-[4px] border-black last:border-b-0 ${
                      isActive ? "bg-black text-white" : "bg-white text-black hover:bg-[#F9FF00]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={20} className={isActive ? "text-[#F9FF00]" : ""} />
                      <span className="font-oswald text-lg font-bold uppercase tracking-wider">{tab.label}</span>
                    </div>
                    {notifCount > 0 && (
                      <span className={`px-2 py-0.5 text-xs font-black border-[2px] ${isActive ? 'bg-[#FF0004] border-[#FF0004] text-white' : 'bg-[#FF0004] border-black text-white'}`}>
                        {notifCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
              <button onClick={handleExport} className="w-full btn-brutal bg-white border-[3px] py-4 text-sm flex items-center justify-center gap-3">
                <Download size={18} /> EXPORT DATA
              </button>
              <button onClick={handleLogout} className="w-full btn-brutal btn-brutal-black py-4 text-sm flex items-center justify-center gap-3">
                <LogOut size={18} /> TERMINATE SESSION
              </button>
            </div>

          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="border-[4px] border-black p-6 md:p-10 bg-white min-h-[700px] shadow-[8px_8px_0px_rgba(0,0,0,1)] relative">
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-b-[4px] border-r-[4px] border-black pointer-events-none" />
              <div className="absolute top-0 right-0 w-4 h-4 border-b-[4px] border-l-[4px] border-black pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-t-[4px] border-r-[4px] border-black pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-t-[4px] border-l-[4px] border-black pointer-events-none" />

              {/* OVERVIEW TAB */}
              {activeTab === "OVERVIEW" && (
                <div className="animate-fade-in space-y-10">
                  <div className="border-b-[4px] border-black pb-4">
                    <h3 className="font-oswald text-3xl font-black uppercase tracking-tight">SYSTEM OVERVIEW</h3>
                    <p className="font-inter text-sm font-bold uppercase text-black/50 mt-1">Status Report & Quick Stats</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border-[4px] border-black p-6 bg-[#fafafa]">
                      <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">ACCESS LEVEL</span>
                      <p className="font-oswald text-3xl font-black uppercase">FULL ACCESS</p>
                      <div className="mt-4 flex items-center gap-2 text-sm font-bold text-[#059669]">
                        <CheckCircle2 size={16} /> SYSTEM NOMINAL
                      </div>
                    </div>
                    <div className="border-[4px] border-black p-6 bg-[#fafafa]">
                      <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">LICENSE TYPE</span>
                      <p className="font-oswald text-3xl font-black uppercase">FREE FOREVER</p>
                      <p className="font-inter text-[10px] font-bold uppercase text-black/40 mt-4 tracking-widest">
                        NO EXPIRATION
                      </p>
                    </div>
                    <div className="border-[4px] border-black p-6 bg-[#F9FF00]">
                      <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/50 block mb-2">RESIDENT SINCE</span>
                      <p className="font-oswald text-3xl font-black uppercase">{new Date(user.createdAt).getFullYear()}</p>
                      <p className="font-inter text-[10px] font-bold uppercase text-black/60 mt-4 tracking-widest">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-[4px] border-black">
                    <div className="border-b-[4px] border-black bg-black text-white px-6 py-3">
                      <h4 className="font-oswald text-lg font-bold uppercase tracking-widest">RECENT WORKBENCH ACTIVITY</h4>
                    </div>
                    <div className="p-0">
                      <div className="flex items-center justify-between p-4 border-b-[2px] border-black/10 hover:bg-[#F9FF00]/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border-[2px] border-black flex items-center justify-center bg-white"><Settings size={18} /></div>
                          <div>
                            <p className="font-oswald text-sm font-bold uppercase">ACCOUNT SETTINGS ACCESSED</p>
                            <p className="font-inter text-[10px] font-bold text-black/40">JUST NOW</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border-b-[2px] border-black/10 hover:bg-[#F9FF00]/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 border-[2px] border-black flex items-center justify-center bg-white"><History size={18} /></div>
                          <div>
                            <p className="font-oswald text-sm font-bold uppercase">SUCCESSFUL LOGIN</p>
                            <p className="font-inter text-[10px] font-bold text-black/40">TODAY</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <button onClick={() => setActiveTab('ACTIVITY')} className="font-oswald text-xs font-bold uppercase underline hover:text-[#FF0004]">VIEW ALL LOGS</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PROFILE TAB */}
              {activeTab === "PROFILE" && (
                <div className="animate-fade-in space-y-10">
                  <div className="border-b-[4px] border-black pb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-oswald text-3xl font-black uppercase tracking-tight">IDENTITY RECORDS</h3>
                      <p className="font-inter text-sm font-bold uppercase text-black/50 mt-1">Manage Personal Information</p>
                    </div>
                    {!isEditing && (
                      <button onClick={() => setIsEditing(true)} className="btn-brutal btn-brutal-yellow px-6 py-3 text-xs flex items-center gap-2">
                        <Settings size={16} /> MODIFY RECORDS
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-8 bg-[#fafafa] border-[4px] border-black p-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="font-oswald text-xs font-bold uppercase tracking-widest text-black">DISPLAY NAME</label>
                          <input 
                            type="text" 
                            className="input-brutal w-full text-lg bg-white"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-oswald text-xs font-bold uppercase tracking-widest text-black">USERNAME / ALIAS</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-oswald text-black/30 font-bold">@</span>
                            <input 
                              type="text" 
                              className="input-brutal w-full text-lg pl-10 bg-white"
                              value={formData.username}
                              onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '_')})}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="font-oswald text-xs font-bold uppercase tracking-widest text-black">AVATAR DATA URI (IMAGE LINK)</label>
                        <input 
                          type="url" 
                          className="input-brutal w-full bg-white"
                          placeholder="HTTPS://..."
                          value={formData.avatar}
                          onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                        />
                      </div>
                      
                      <div className="pt-6 flex flex-wrap gap-4 border-t-[2px] border-black/10">
                        <button type="submit" className="btn-brutal btn-brutal-black px-10 py-4 font-oswald text-sm font-bold uppercase flex items-center gap-2">
                          <Save size={18} /> CONFIRM CHANGES
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="btn-brutal bg-white px-10 py-4 font-oswald text-sm font-bold uppercase">
                          ABORT
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 border-[4px] border-black bg-white">
                        <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-3">REGISTERED NAME</span>
                        <p className="font-oswald text-3xl font-black uppercase">{user.name}</p>
                      </div>
                      <div className="p-8 border-[4px] border-black bg-white">
                        <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-3">SYSTEM ALIAS</span>
                        <p className="font-oswald text-3xl font-black uppercase text-[#FF0004]">@{user.username}</p>
                      </div>
                      <div className="p-8 border-[4px] border-black bg-white md:col-span-2 flex items-center justify-between">
                        <div>
                          <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-black/40 block mb-3">CONTACT VECTOR</span>
                          <p className="font-inter text-lg font-bold tracking-tight">{user.email || "UNREGISTERED GUEST"}</p>
                        </div>
                        <Mail size={32} className="text-black/10" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PREFERENCES TAB */}
              {activeTab === "PREFERENCES" && (
                <div className="animate-fade-in space-y-10">
                  <div className="border-b-[4px] border-black pb-4">
                    <h3 className="font-oswald text-3xl font-black uppercase tracking-tight">WORKBENCH PREFERENCES</h3>
                    <p className="font-inter text-sm font-bold uppercase text-black/50 mt-1">Configure UI and Tool Settings</p>
                  </div>

                  <div className="space-y-6">
                    {/* Theme Mock */}
                    <div className="border-[4px] border-black p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <h4 className="font-oswald text-xl font-bold uppercase">INTERFACE THEME</h4>
                        <p className="font-inter text-xs font-bold text-black/50 uppercase mt-1">Select visual style (Simulation)</p>
                      </div>
                      <div className="flex border-[3px] border-black overflow-hidden bg-black w-full md:w-auto">
                        <button 
                          onClick={() => setThemePreference("LIGHT")}
                          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 font-oswald text-sm font-bold uppercase transition-colors ${themePreference === "LIGHT" ? "bg-[#F9FF00] text-black" : "text-white hover:bg-white/10"}`}
                        >
                          <Sun size={16} /> LIGHT
                        </button>
                        <div className="w-[3px] bg-black" />
                        <button 
                          onClick={() => setThemePreference("DARK")}
                          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 font-oswald text-sm font-bold uppercase transition-colors ${themePreference === "DARK" ? "bg-[#F9FF00] text-black" : "text-white hover:bg-white/10"}`}
                        >
                          <Moon size={16} /> DARK
                        </button>
                        <div className="w-[3px] bg-black" />
                        <button 
                          onClick={() => setThemePreference("SYSTEM")}
                          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 font-oswald text-sm font-bold uppercase transition-colors ${themePreference === "SYSTEM" ? "bg-[#F9FF00] text-black" : "text-white hover:bg-white/10"}`}
                        >
                          <Monitor size={16} /> AUTO
                        </button>
                      </div>
                    </div>

                    {/* Cache Clearance */}
                    <div className="border-[4px] border-black p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                        <h4 className="font-oswald text-xl font-bold uppercase">LOCAL CACHE</h4>
                        <p className="font-inter text-xs font-bold text-black/50 uppercase mt-1">Clear temporary tool data to free space</p>
                      </div>
                      <button onClick={handleClearCache} className="btn-brutal bg-white px-8 py-3 text-sm flex items-center justify-center gap-2 w-full md:w-auto">
                        <Trash2 size={16} /> PURGE CACHE
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "SECURITY" && (
                <div className="animate-fade-in space-y-10">
                  <div className="border-b-[4px] border-black pb-4">
                    <h3 className="font-oswald text-3xl font-black uppercase tracking-tight">SECURITY CENTER</h3>
                    <p className="font-inter text-sm font-bold uppercase text-black/50 mt-1">Authentication and Access Control</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Password Reset */}
                    {!user.isGuest && (
                      <div className="border-[4px] border-black bg-white flex flex-col h-full">
                        <div className="bg-black text-white p-4 flex items-center gap-3">
                          <Key size={20} className="text-[#F9FF00]" />
                          <h4 className="font-oswald text-lg font-bold uppercase tracking-widest">CIPHER UPDATE</h4>
                        </div>
                        <form onSubmit={handlePasswordReset} className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                          <div className="space-y-4">
                            <input 
                              type="password" 
                              className="input-brutal w-full py-4 bg-[#fafafa]" 
                              placeholder="CURRENT CIPHER"
                              value={passData.old}
                              onChange={(e) => setPassData({...passData, old: e.target.value})}
                              required
                            />
                            <input 
                              type="password" 
                              className="input-brutal w-full py-4 bg-[#fafafa]" 
                              placeholder="NEW CIPHER"
                              value={passData.new}
                              onChange={(e) => setPassData({...passData, new: e.target.value})}
                              required
                            />
                            <input 
                              type="password" 
                              className="input-brutal w-full py-4 bg-[#fafafa]" 
                              placeholder="VERIFY NEW CIPHER"
                              value={passData.confirm}
                              onChange={(e) => setPassData({...passData, confirm: e.target.value})}
                              required
                            />
                          </div>
                          <button type="submit" className="btn-brutal btn-brutal-black w-full py-4 mt-6">UPDATE CIPHER</button>
                        </form>
                      </div>
                    )}

                    {/* Email Update */}
                    <div className="border-[4px] border-black bg-white flex flex-col h-full">
                      <div className="bg-black text-white p-4 flex items-center gap-3">
                        <Globe size={20} className="text-[#F9FF00]" />
                        <h4 className="font-oswald text-lg font-bold uppercase tracking-widest">COMM. VECTOR</h4>
                      </div>
                      <form onSubmit={handleEmailUpdate} className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          <input 
                            type="email" 
                            className="input-brutal w-full py-4 bg-[#fafafa]" 
                            placeholder="NEW EMAIL VECTOR"
                            value={emailData.newEmail}
                            onChange={(e) => setEmailData({...emailData, newEmail: e.target.value})}
                            required
                          />
                          {!user.isGuest && (
                            <input 
                              type="password" 
                              className="input-brutal w-full py-4 bg-[#fafafa]" 
                              placeholder="AUTHORIZATION CIPHER"
                              value={emailData.currentPassword}
                              onChange={(e) => setEmailData({...emailData, currentPassword: e.target.value})}
                              required
                            />
                          )}
                        </div>
                        <button type="submit" className="btn-brutal btn-brutal-yellow w-full py-4 mt-6">UPDATE VECTOR</button>
                      </form>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="border-[4px] border-[#FF0004] bg-[#FF0004]/5 p-8 mt-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <h4 className="font-oswald text-2xl font-black uppercase text-[#FF0004]">DANGER ZONE</h4>
                        <p className="font-inter text-sm font-bold uppercase text-[#FF0004]/70 mt-1">IRREVERSIBLE ACCOUNT TERMINATION</p>
                      </div>
                      <button 
                        onClick={handleDelete}
                        className="btn-brutal bg-[#FF0004] text-white border-black hover:bg-black w-full md:w-auto px-8 py-4 flex items-center justify-center gap-3"
                      >
                        <Trash2 size={20} /> INITIATE PURGE
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVITY TAB */}
              {activeTab === "ACTIVITY" && (
                <div className="animate-fade-in space-y-10">
                  <div className="border-b-[4px] border-black pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="font-oswald text-3xl font-black uppercase tracking-tight">SESSION LOGS</h3>
                      <p className="font-inter text-sm font-bold uppercase text-black/50 mt-1">Device Access History</p>
                    </div>
                    <button onClick={() => { showToast("LOGGED OUT OF ALL OTHER DEVICES.", "info"); }} className="btn-brutal bg-white px-6 py-3 text-xs">TERMINATE ALL OTHERS</button>
                  </div>

                  <div className="space-y-4">
                    {loginActivities.map((log) => (
                      <div key={log.id} className="border-[4px] border-black bg-white p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-[#fafafa] transition-colors">
                        <div className="flex items-start gap-6">
                          <div className={`p-4 border-[3px] border-black ${log.active ? 'bg-[#F9FF00]' : 'bg-white'}`}>
                            <Smartphone size={28} />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h4 className="font-oswald text-lg font-black uppercase">{log.device}</h4>
                              <span className="font-oswald text-lg font-bold text-black/30">/</span>
                              <h4 className="font-oswald text-lg font-black uppercase">{log.browser}</h4>
                              {log.active && <span className="text-[10px] bg-black text-[#F9FF00] px-3 py-1 font-bold uppercase tracking-widest ml-2">ACTIVE NODE</span>}
                            </div>
                            <p className="font-inter text-xs font-bold text-black/50 uppercase tracking-widest flex items-center gap-3">
                              <span>IP: {log.ip}</span>
                              <span className="w-1 h-1 bg-black rounded-full" />
                              <span>{new Date(log.timestamp).toLocaleString()}</span>
                            </p>
                          </div>
                        </div>
                        {!log.active ? (
                          <span className="font-oswald text-sm font-bold uppercase text-black/20 border-[2px] border-black/10 px-4 py-2">INACTIVE</span>
                        ) : (
                           <button onClick={() => logoutFromDevice(log.id)} className="btn-brutal bg-[#FF0004] text-white py-2 px-6 text-xs w-full md:w-auto">REVOKE ACCESS</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "NOTIFICATIONS" && (
                <div className="animate-fade-in space-y-10">
                  <div className="border-b-[4px] border-black pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="font-oswald text-3xl font-black uppercase tracking-tight">SYSTEM ALERTS</h3>
                      <p className="font-inter text-sm font-bold uppercase text-black/50 mt-1">Incoming Transmissions</p>
                    </div>
                    {notifications.length > 0 && (
                      <button onClick={() => clearNotifications()} className="btn-brutal bg-white px-6 py-3 text-xs">CLEAR LOG</button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="border-[4px] border-black bg-[#fafafa] py-32 text-center flex flex-col items-center justify-center">
                      <Bell size={64} className="text-black/10 mb-6" />
                      <h4 className="font-oswald text-2xl font-black uppercase text-black/30">NO ACTIVE TRANSMISSIONS</h4>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((n) => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationRead(n.id)}
                          className={`border-[4px] border-black p-6 cursor-pointer transition-all ${n.read ? 'bg-white opacity-50' : 'bg-[#F9FF00] hover:bg-[#e5eb00]'}`}
                        >
                          <div className="flex items-start gap-5">
                            <div className="mt-1 bg-black text-white p-2 border-[2px] border-black">
                              {n.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-4">
                                <h4 className="font-oswald text-xl font-black uppercase leading-tight">{n.title}</h4>
                                {!n.read && <div className="w-3 h-3 bg-[#FF0004] border-[2px] border-black shrink-0" />}
                              </div>
                              <p className={`font-inter text-sm font-bold mt-2 ${n.read ? 'text-black/60' : 'text-black/80'}`}>{n.message}</p>
                              <p className="font-inter text-[10px] font-bold text-black/40 mt-4 uppercase tracking-widest">{new Date(n.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
