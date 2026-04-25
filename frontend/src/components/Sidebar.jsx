import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useEffect, useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  Home: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Menu: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Orders: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg>,
  Inventory: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  Reports: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Settings: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Kitchen: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  Logout: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ChevronLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
};

// ── Nav config — add route path for each item ──────────────────────────────
const NAV_ITEMS = [
  { id: "pos",       label: "POS",       Icon: Icons.Home,      path: "/pos" },
  { id: "menu",      label: "Menu",      Icon: Icons.Menu,      path: "/menu" },
  { id: "orders",    label: "Orders",    Icon: Icons.Orders,    path: "/orders" },
  { id: "inventory", label: "Inventory", Icon: Icons.Inventory, path: "/inventory" },
  { id: "reports",   label: "Reports",   Icon: Icons.Reports,   path: "/reports" },
  { id: "settings",  label: "Settings",  Icon: Icons.Settings,  path: "/settings" },
  { id: "kitchen",   label: "Kitchen",   Icon: Icons.Kitchen,   path: "/kitchen" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: "Divya Goswami", initials: "DG" });

  // ── Read user from localStorage ──────────────────────────────────────────
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const name = stored.name || stored.username || stored.email || "User";
      const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      setUser({ name, initials });
    } catch { }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Active item = whichever path matches current URL
  const activeId = NAV_ITEMS.find(n => location.pathname.startsWith(n.path))?.id ?? "pos";

  return (
    <aside
      className="flex flex-col justify-between py-5 px-3 flex-shrink-0"
      style={{ width: 220, backgroundColor: "#FFFFFF", borderRight: "1px solid #F0E9FF", height: "100vh" }}
    >
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-2 mb-7">
          <img src={logo} alt="BILLBITE logo" className="h-8 w-auto object-contain" />
          <span className="text-base font-bold tracking-tight" style={{ color: "#1A1A1A" }}>BILLBITE</span>
          <button className="ml-auto opacity-40 hover:opacity-70 transition-opacity">
            <Icons.ChevronLeft />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ id, label, Icon, path }) => {
            const active = activeId === id;
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all"
                style={{
                  backgroundColor: active ? "#F3E8FF" : "transparent",
                  color: active ? "#9333EA" : "#4B5563",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "#FAF5FF"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = active ? "#F3E8FF" : "transparent"; }}
              >
                <Icon />
                {label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User + Logout */}
      <div>
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: "#9333EA" }}
          >
            {user.initials}
          </div>
          <span className="text-sm font-semibold truncate" style={{ color: "#1A1A1A" }}>{user.name}</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all"
          style={{ color: "#EF4444" }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          <Icons.Logout /> Log Out
        </button>
      </div>
    </aside>
  );
}