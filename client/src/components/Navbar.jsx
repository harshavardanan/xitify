import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  { name: "New Xitpad", href: "/editor" },
  { name: "XitRoom", href: "/collab" },
  { name: "Upload & Edit", href: "/upload" },
];

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5 group select-none">
    <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors duration-300">
      <img src="/logo.png" alt="Xitify Logo" className="w-full h-full object-cover" />
    </div>
    <span className="text-white font-bold text-lg tracking-tight">Xitify</span>
  </Link>
);

const UserMenu = ({ user, onSignOut }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName =
    user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200 focus:outline-none"
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-7 h-7 rounded-full object-cover ring-2 ring-white/20"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black text-xs font-bold">
            {displayName[0].toUpperCase()}
          </div>
        )}
        <span className="text-white/80 text-sm font-medium hidden sm:block">{displayName}</span>
        <svg
          className={`w-4 h-4 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 glass-card py-1.5 shadow-xl shadow-black/60 z-50">
          <div className="px-4 py-2.5 border-b border-white/[0.06]">
            <p className="text-xs text-white/30 truncate">{user?.email}</p>
          </div>
          <button
            onClick={onSignOut}
            className="w-full text-left px-4 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};

const MobileMenu = ({ open, items, user, onSignOut, onClose }) => (
  <div
    className={`fixed inset-x-0 top-16 z-40 transition-all duration-300 ease-in-out ${
      open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
    }`}
  >
    <div className="mx-4 glass-card shadow-2xl shadow-black/60 overflow-hidden">
      <nav className="flex flex-col p-3 gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClose}
            className="px-4 py-3 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="px-3 pb-3">
        <div className="h-px bg-white/[0.06] mb-3" />
        {user ? (
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black text-xs font-bold">
                  {(user.displayName || "U")[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">{user.displayName?.split(" ")[0] || "User"}</p>
                <p className="text-xs text-white/30 truncate max-w-[160px]">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="text-xs text-white/40 hover:text-white/80 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link to="/signin" onClick={onClose} className="btn-primary w-full text-center text-sm py-2.5">
            Sign in
          </Link>
        )}
      </div>
    </div>
  </div>
);

export function NavBar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast.success("Signed out");
    } catch {
      toast.error("Sign-out failed");
    }
  };

  return (
    <>
      <header
        className={`w-full h-16 transition-all duration-300 ${
          scrolled
            ? "bg-black/90 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/40"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-6">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    active
                      ? "text-white bg-white/10"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">
            {user ? (
              <UserMenu user={user} onSignOut={handleSignOut} />
            ) : (
              <Link to="/signin" className="hidden md:flex btn-primary text-sm py-2 px-5">
                Sign in
              </Link>
            )}
            <button
              className="md:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setMobileOpen((p) => !p)}
            >
              <div className="w-5 flex flex-col gap-1.5">
                <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileOpen} items={NAV_ITEMS} user={user} onSignOut={handleSignOut} onClose={() => setMobileOpen(false)} />
    </>
  );
}
