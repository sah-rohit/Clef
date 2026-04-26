import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { Menu, X, Bell, User, Github, Star } from "lucide-react";
import type Lenis from "lenis";

// Heights in px — must match CSS variables in index.css
const RIBBON_H = 36;
const NAV_H    = 56; // approximate nav bar height

export function Navigation() {
  const { user, isAuthenticated, notifications, markNotificationRead } = useAuth();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  // DOM refs — we move these directly without React state for 60fps
  const ribbonRef  = useRef<HTMLDivElement>(null);
  const navRef     = useRef<HTMLElement>(null);
  const lastY      = useRef(0);
  const hidden     = useRef(false); // current hide state

  const unreadCount = notifications.filter(n => !n.read).length;

  // ── Scroll-driven hide/show via Lenis ──────────────────────────────────────
  useEffect(() => {
    const applyHide = (hide: boolean) => {
      if (hide === hidden.current) return; // no change
      hidden.current = hide;

      const ribbon = ribbonRef.current;
      const nav    = navRef.current;
      if (!ribbon || !nav) return;

      if (hide) {
        // Slide both up together: ribbon goes -RIBBON_H, nav goes -(RIBBON_H + NAV_H)
        ribbon.style.transform = `translateY(-${RIBBON_H}px)`;
        nav.style.transform    = `translateY(-${RIBBON_H + NAV_H}px)`;
      } else {
        ribbon.style.transform = "translateY(0)";
        nav.style.transform    = "translateY(0)";
      }
    };

    const onScroll = ({ scroll }: { scroll: number }) => {
      const y = scroll;

      // Update scrolled state for nav background (throttled via state is fine)
      setScrolled(y > 50);

      if (y < 60) {
        applyHide(false);
      } else if (y > lastY.current + 4) {
        applyHide(true);   // scrolling down → hide
      } else if (y < lastY.current - 4) {
        applyHide(false);  // scrolling up → show
      }
      lastY.current = y;
    };

    // Subscribe to Lenis scroll events
    const lenis = (window as unknown as Record<string, unknown>).__lenis__ as Lenis | undefined;
    if (lenis) {
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }

    // Fallback: native scroll (if Lenis not ready yet)
    const native = () => {
      onScroll({ scroll: window.scrollY });
    };
    window.addEventListener("scroll", native, { passive: true });
    return () => window.removeEventListener("scroll", native);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: "TOOLS",       path: "/#tools" },
    { label: "OUR PROMISE", path: "/#promise" },
    { label: "ROSTER",      path: "/#roster" },
    { label: "HOW TO USE",  path: "/how-to-use" },
    { label: "PRICING",     path: "/pricing" },
    { label: "ABOUT",       path: "/about" },
  ];

  const ClefLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
      <rect x="9" y="9" width="6" height="6" fill="currentColor" />
    </svg>
  );

  return (
    <>
      {/* ── GitHub Top Ribbon ── */}
      <div
        ref={ribbonRef}
        className="fixed left-0 right-0 z-[60] bg-[#1a1a1a] border-b-[3px] border-black flex items-center justify-between px-4 md:px-8"
        style={{
          top: 0,
          height: RIBBON_H,
          transform: "translateY(0)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
          willChange: "transform",
        }}
      >
        <div className="flex items-center gap-3">
          <Github size={13} className="text-white/60" />
          <span className="font-oswald text-[10px] font-bold uppercase tracking-widest text-white/60 hidden sm:block">
            OPEN SOURCE
          </span>
          <div className="w-px h-3 bg-white/20 hidden sm:block" />
          <a
            href="https://github.com/sah-rohit/Clef"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] text-white/80 hover:text-[#F9FF00] transition-colors"
          >
            sah-rohit/Clef
          </a>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/sah-rohit/Clef"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-[#F9FF00] hover:text-black text-white border border-white/20 hover:border-[#F9FF00] px-3 py-0.5 font-oswald text-[9px] font-bold uppercase tracking-widest transition-all"
          >
            <Star size={10} />
            STAR REPO
          </a>
          <a
            href="https://github.com/sah-rohit/Clef"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#F9FF00] text-black border border-[#F9FF00] px-3 py-0.5 font-oswald text-[9px] font-bold uppercase tracking-widest hover:bg-white transition-all"
          >
            <Github size={10} />
            VIEW SOURCE
          </a>
        </div>
      </div>

      {/* ── Main Nav ── */}
      <nav
        ref={navRef}
        className={`fixed left-0 right-0 z-50 ${
          scrolled ? "bg-white border-b-[4px] border-black" : "bg-transparent"
        }`}
        style={{
          top: RIBBON_H,
          transform: "translateY(0)",
          transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1), background-color 0.25s, border-color 0.25s",
          willChange: "transform",
        }}
      >
        <div className="w-full">
          {/* Desktop Nav */}
          <div className="hidden md:grid grid-cols-12">
            <div className="col-span-2 border-r-[3px] border-black px-6 py-4 flex items-center gap-3">
              <ClefLogo />
              <Link to="/" className="font-oswald text-xl font-bold tracking-[0.1em] uppercase">
                CLEF
              </Link>
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 border-[2px] border-black bg-[#F9FF00] font-oswald text-[8px] font-bold uppercase tracking-widest shadow-[2px_2px_0px_rgba(0,0,0,1)] ml-auto">
                <div className="w-1 h-1 bg-black rounded-full animate-pulse" />
                OSS
              </div>
            </div>
            <div className="col-span-8 flex">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className="flex-1 border-r-[3px] border-black px-1 py-4 font-oswald text-[10px] font-bold uppercase tracking-wider hover:bg-[#F9FF00] transition-colors text-center flex items-center justify-center whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="col-span-2 flex items-center justify-end px-6 gap-3">
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 hover:bg-[#F9FF00] transition-colors border-[3px] border-black"
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF0004] text-white text-[10px] font-bold flex items-center justify-center border border-black">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border-[3px] border-black shadow-lg max-h-96 overflow-y-auto z-50 animate-scale-in">
                      <div className="bg-[#1a1a1a] text-white px-4 py-2 flex items-center justify-between">
                        <span className="font-oswald text-xs font-bold uppercase tracking-wider">Notifications</span>
                        <span className="font-inter text-[10px]">{unreadCount} unread</span>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                          <p className="font-inter text-xs text-[#1a1a1a]/50">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map(notif => (
                          <button
                            key={notif.id}
                            onClick={() => markNotificationRead(notif.id)}
                            className={`w-full text-left px-4 py-3 border-b-[3px] border-black last:border-b-0 hover:bg-[#F9FF00]/20 transition-colors ${
                              !notif.read ? "bg-[#F9FF00]/10" : ""
                            }`}
                          >
                            <p className="font-oswald text-xs font-bold uppercase">{notif.title}</p>
                            <p className="font-inter text-[11px] text-[#1a1a1a]/60 mt-1 leading-relaxed">{notif.message}</p>
                            <span className="font-inter text-[9px] text-[#1a1a1a]/30 mt-1 block">
                              {new Date(notif.timestamp).toLocaleString()}
                            </span>
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
                  className="flex items-center gap-2 border-[3px] border-black px-3 py-2 hover:bg-[#F9FF00] transition-colors"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                  <span className="font-oswald text-sm font-semibold uppercase">
                    {user?.name?.split(" ")[0] || "ACCOUNT"}
                  </span>
                </Link>
              ) : (
                <Link to="/login" className="btn-brutal btn-brutal-yellow text-xs py-2 px-4">
                  LOG IN
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 relative z-[60]">
            <Link
              to="/"
              className={`font-oswald text-lg font-bold uppercase ${
                !scrolled && location.pathname === "/" ? "text-white" : "text-black"
              }`}
            >
              CLEF
            </Link>
            <div className="flex items-center gap-2">
              {isAuthenticated && unreadCount > 0 && (
                <Link
                  to="/account"
                  className={`relative p-1 ${!scrolled && location.pathname === "/" ? "text-white" : "text-black"}`}
                >
                  <Bell size={18} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF0004] text-white text-[8px] font-bold flex items-center justify-center border border-black">
                    {unreadCount}
                  </span>
                </Link>
              )}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`p-2 border-[2px] border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] ${
                  menuOpen ? "bg-[#FF0004] text-white" : "bg-[#F9FF00] text-black"
                }`}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden bg-white border-t-[3px] border-black">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className="w-full block text-left px-6 py-4 border-b-[3px] border-black font-oswald text-lg font-semibold uppercase hover:bg-[#F9FF00] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-6 py-4">
                {isAuthenticated ? (
                  <Link to="/account" className="font-oswald text-lg font-semibold uppercase">
                    MY ACCOUNT
                  </Link>
                ) : (
                  <Link to="/login" className="btn-brutal btn-brutal-yellow text-sm py-3 block text-center">
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
}
