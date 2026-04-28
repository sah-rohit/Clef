import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { Menu, X, Bell, User, Github, Star } from "lucide-react";

const RIBBON_H = 36;

export function Navigation() {
  const { user, isAuthenticated, notifications, markNotificationRead } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [ribbonHidden, setRibbonHidden] = useState(false);
  const location = useLocation();

  const lastY = useRef(0);
  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Scroll handler: only hide/show the GitHub ribbon ──
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);

      if (y < 60) {
        setRibbonHidden(false);
      } else if (y > lastY.current + 4) {
        setRibbonHidden(true);
      } else if (y < lastY.current - 4) {
        setRibbonHidden(false);
      }
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: "HOME",        path: "/",                 color: "#FF0004" },
    { label: "TOOLS",       path: "/tools",            color: "#F9FF00" },
    { label: "OUR PROMISE", path: "/promise",          color: "#00FF87" },
    { label: "ROSTER",      path: "/roster",           color: "#00E5FF" },
    { label: "INQUIRY",     path: "/inquiry",          color: "#7C3AED" },
    { label: "ABOUT",       path: "/about",            color: "#FF0004" },
  ];

  const ClefLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
      <rect x="9" y="9" width="6" height="6" fill="currentColor" />
    </svg>
  );

  const navContent = (
    <>
      {/* ── GitHub Top Ribbon ── hides on scroll down, shows on scroll up */}
      <div
        className="fixed left-0 right-0 z-[60] border-b-[3px] border-black"
        style={{
          top: 0,
          height: RIBBON_H,
          background: "#1a1a1a",
          transform: ribbonHidden ? `translateY(-${RIBBON_H}px)` : "translateY(0)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          willChange: "transform",
        }}
      >
        {/* Color accent strip at bottom of ribbon */}
        <div className="absolute bottom-0 left-0 right-0 flex h-[3px]">
          {["#F9FF00","#FF0004","#00E5FF","#00FF87","#7C3AED"].map(c => (
            <div key={c} className="flex-1" style={{ background: c }} />
          ))}
        </div>
        <div className="flex items-center justify-between px-4 md:px-8 h-full">
          <div className="flex items-center gap-3">
            <Github size={13} className="text-[#00FF87]" />
            <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-white/60 hidden sm:block">
              OPEN SOURCE
            </span>
            <div className="w-px h-3 bg-white/20 hidden sm:block" />
            <a
              href="https://github.com/sah-rohit/Clef"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] text-[#00FF87]/80 hover:text-[#00FF87] transition-colors"
            >
              sah-rohit/Clef
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/sah-rohit/Clef"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/8 hover:bg-[#F9FF00] hover:text-black text-white/70 border border-white/15 hover:border-[#F9FF00] px-3 py-0.5 font-oswald text-[9px] font-bold uppercase tracking-widest transition-all"
            >
              <Star size={10} />
              <span className="hidden sm:inline">STAR REPO</span>
            </a>
            <a
              href="https://github.com/sah-rohit/Clef"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#00FF87] text-black border border-[#00FF87] px-3 py-0.5 font-oswald text-[9px] font-bold uppercase tracking-widest hover:bg-white transition-all"
            >
              <Github size={10} />
              <span className="hidden sm:inline">VIEW SOURCE</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Nav ── always visible, adjusts top when ribbon hides */}
      <nav
        className={`fixed left-0 right-0 z-50 ${
          scrolled ? "bg-white border-b-[3px] border-black shadow-[0_2px_0_rgba(0,0,0,0.08)]" : "bg-white/95 border-b-[3px] border-black"
        }`}
        style={{
          top: ribbonHidden ? 0 : RIBBON_H,
          transition: "top 0.32s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="w-full">
          {/* Desktop Nav */}
          <div className="hidden md:grid grid-cols-12">
            {/* Logo — yellow accent */}
            <div className="col-span-2 border-r-[3px] border-black px-5 py-0 flex items-center gap-3 bg-[#F9FF00]">
              <ClefLogo />
              <Link to="/" className="font-oswald text-xl font-bold tracking-[0.1em] uppercase text-black">
                CLEF
              </Link>
              <div className="hidden lg:flex items-center gap-1 px-1.5 py-0.5 border-[2px] border-black bg-black font-oswald text-[8px] font-bold uppercase tracking-widest ml-auto">
                <div className="w-1 h-1 bg-[#00FF87] rounded-full animate-pulse" />
                <span className="text-[#F9FF00]">OSS</span>
              </div>
            </div>
            <div className="col-span-8 flex">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className="flex-1 border-r-[3px] border-black px-1 py-0 font-oswald text-[10px] font-bold uppercase tracking-wider transition-all duration-300 text-center flex items-center justify-center whitespace-nowrap h-[56px] hover:text-black hover:shadow-inner group relative overflow-hidden"
                >
                  <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out -z-10" style={{ background: item.color }} />
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="col-span-2 flex items-center justify-end px-5 gap-2 border-l-[3px] border-black">
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 hover:bg-[#F9FF00] transition-colors border-[2px] border-black"
                  >
                    <Bell size={15} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF0004] text-white text-[9px] font-bold flex items-center justify-center border border-black">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border-[3px] border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] max-h-96 overflow-y-auto z-50 animate-scale-in">
                      {/* Notification header — vibrant */}
                      <div className="border-b-[3px] border-black">
                        <div className="flex h-1">
                          {["#F9FF00","#FF0004","#00E5FF","#00FF87","#7C3AED"].map(c => (
                            <div key={c} className="flex-1" style={{ background: c }} />
                          ))}
                        </div>
                        <div className="bg-[#1a1a1a] px-4 py-2.5 flex items-center justify-between">
                          <span className="font-oswald text-xs font-bold uppercase tracking-wider text-white">Notifications</span>
                          <span className="font-oswald text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-[#FF0004]/40 text-[#FF0004]">{unreadCount} UNREAD</span>
                        </div>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <div className="w-8 h-8 bg-[#F9FF00] border-[2px] border-black flex items-center justify-center mx-auto mb-3">
                            <Bell size={14} className="text-black" />
                          </div>
                          <p className="font-oswald text-xs font-bold uppercase text-black/40">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map(notif => (
                          <button key={notif.id} onClick={() => markNotificationRead(notif.id)}
                            className={`w-full text-left px-4 py-3 border-b-[2px] border-black/10 last:border-b-0 hover:bg-[#F9FF00]/15 transition-colors ${!notif.read ? "bg-[#F9FF00]/8" : ""}`}>
                            <div className="flex items-start gap-2">
                              {!notif.read && <div className="w-1.5 h-1.5 bg-[#FF0004] rounded-full shrink-0 mt-1.5" />}
                              <div className="flex-1 min-w-0">
                                <p className="font-oswald text-xs font-bold uppercase">{notif.title}</p>
                                <p className="font-inter text-[11px] text-black/60 mt-0.5 leading-relaxed">{notif.message}</p>
                                <span className="font-inter text-[9px] text-black/30 mt-1 block">{new Date(notif.timestamp).toLocaleString()}</span>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
              {isAuthenticated ? (
                <Link
                  to="/account"
                  className="flex items-center gap-2 border-[2px] border-black px-3 py-1.5 hover:bg-[#F9FF00] transition-colors text-sm"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-5 h-5 object-cover" />
                  ) : (
                    <User size={14} />
                  )}
                  <span className="font-oswald text-xs font-bold uppercase">
                    {user?.name?.split(" ")[0] || "ACCOUNT"}
                  </span>
                </Link>
              ) : (
                <Link to="/login" className="bg-[#F9FF00] border-[2px] border-black font-oswald font-bold uppercase tracking-widest text-xs py-2 px-4 hover:bg-black hover:text-[#F9FF00] transition-colors">
                  LOG IN
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white">
            <Link to="/" className="flex items-center gap-2">
              <ClefLogo />
              <span className="font-oswald text-lg font-bold uppercase">CLEF</span>
            </Link>
            <div className="flex items-center gap-2">
              {isAuthenticated && unreadCount > 0 && (
                <Link to="/account" className="relative p-1.5 border-[2px] border-black">
                  <Bell size={16} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF0004] text-white text-[8px] font-bold flex items-center justify-center border border-black">
                    {unreadCount}
                  </span>
                </Link>
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 border-[2px] border-black ${menuOpen ? "bg-[#FF0004] text-white" : "bg-[#F9FF00] text-black"}`}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden bg-white border-t-[3px] border-black">
              {/* Color strip at top of mobile menu */}
              <div className="flex h-1">
                {["#F9FF00","#FF0004","#00E5FF","#00FF87","#7C3AED"].map(c => (
                  <div key={c} className="flex-1" style={{ background: c }} />
                ))}
              </div>
              {navItems.map((item, i) => (
                <Link key={i} to={item.path}
                  className="w-full block text-left px-6 py-4 border-b-[2px] border-black/10 font-oswald text-base font-bold uppercase hover:bg-[#F9FF00] transition-colors">
                  {item.label}
                </Link>
              ))}
              <div className="px-6 py-4 border-t-[3px] border-black bg-[#fafafa]">
                {isAuthenticated ? (
                  <Link to="/account" className="font-oswald text-base font-bold uppercase flex items-center gap-2 hover:text-[#FF0004] transition-colors">
                    <User size={16} /> MY ACCOUNT
                  </Link>
                ) : (
                  <Link to="/login" className="bg-[#F9FF00] border-[3px] border-black font-oswald font-bold uppercase tracking-widest text-sm py-3 block text-center hover:bg-black hover:text-[#F9FF00] transition-colors shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                    LOG IN
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );

  // Portal into document.body so that parent transforms (Lenis, GSAP PageTransition)
  // cannot break position:fixed
  return createPortal(navContent, document.body);
}
