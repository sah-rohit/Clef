import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/providers/AuthProvider";
import { Menu, X, Bell, User } from "lucide-react";

export function Navigation() {
  const { user, isAuthenticated, notifications, markNotificationRead } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: "TOOLS", path: "/#tools" },
    { label: "OUR PROMISE", path: "/#promise" },
    { label: "ROSTER", path: "/#roster" },
    { label: "INQUIRY", path: "/#inquiry" },
    { label: "PRICING", path: "/pricing" },
    { label: "ABOUT", path: "/about" },
  ];

  const ClefLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
      <rect x="9" y="9" width="6" height="6" fill="currentColor" />
    </svg>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white border-b-[4px] border-black"
          : "bg-transparent"
      }`}
    >
      <div className="w-full">
        {/* Desktop Nav */}
        <div className="hidden md:grid grid-cols-12">
          <div className="col-span-2 border-r-[3px] border-black px-6 py-4 flex items-center gap-3">
            <ClefLogo />
            <Link
              to="/"
              className="font-oswald text-xl font-bold tracking-[0.1em] uppercase"
            >
              CLEF
            </Link>
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
                      <span className="font-oswald text-xs font-bold uppercase tracking-wider">
                        Notifications
                      </span>
                      <span className="font-inter text-[10px]">
                        {unreadCount} unread
                      </span>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="font-inter text-xs text-[#1a1a1a]/50">
                          No notifications yet
                        </p>
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
                          <p className="font-inter text-[11px] text-[#1a1a1a]/60 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
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
              <Link
                to="/login"
                className="btn-brutal btn-brutal-yellow text-xs py-2 px-4"
              >
                LOG IN
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="font-oswald text-lg font-bold tracking-tight-oswald uppercase"
          >
            CLEF
          </Link>
          <div className="flex items-center gap-2">
            {isAuthenticated && unreadCount > 0 && (
              <Link to="/account" className="relative p-1">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF0004] text-white text-[8px] font-bold flex items-center justify-center border border-black">
                  {unreadCount}
                </span>
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
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
                <div className="flex flex-col gap-3">
                  <Link
                    to="/account"
                    className="font-oswald text-lg font-semibold uppercase"
                  >
                    MY ACCOUNT
                  </Link>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn-brutal btn-brutal-yellow text-sm py-3 block text-center"
                >
                  LOG IN
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
