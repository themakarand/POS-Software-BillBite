import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

// ── Icons (20px, matching Figma weight) ────────────────────────────────────
const Icons = {
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Orders: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    </svg>
  ),
  Inventory: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  ),
  Reports: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  Kitchen: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { id: "pos", label: "POS", Icon: Icons.Home, path: "/dashboard" },
  { id: "menu", label: "Menu", Icon: Icons.Menu, path: "/menu" },
  { id: "orders", label: "Orders", Icon: Icons.Orders, path: "/orders" },
  { id: "inventory", label: "Inventory", Icon: Icons.Inventory, path: "/inventory" },
  { id: "reports", label: "Reports", Icon: Icons.Reports, path: "/reports" },
  { id: "settings", label: "Settings", Icon: Icons.Settings, path: "/settings" },
  { id: "kitchen", label: "Kitchen", Icon: Icons.Kitchen, path: "/kitchen" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ name: "Divya Goswami", initials: "DG" });

  const [isOpen, setIsOpen] = useState(false);

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
  const path = location.pathname;
  const activeId = NAV_ITEMS.find(n => path.startsWith(n.path))?.id
    ?? (path === "/" || path === "/pos" ? "pos" : "pos");


  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 p-4 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center"
        style={{ width: 56, height: 56 }}
      >
        <Icons.Menu />
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
        style={{
          width: 240,
          minWidth: 240,
          height: "100vh",
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #F0E9FF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "24px 16px",
          boxSizing: "border-box",
          flexShrink: 0,
          fontFamily: "'DM Sans', sans-serif",
        }}>

        {/* ── Top section ── */}
        <div>
          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingLeft: 4 }}>
            <img
              src={logo}
              alt="Pangat Logo"
              style={{
                height: "75px",    // Fixed height keeps it consistent
                width: "auto",      // Let the width expand naturally
                maxWidth: "240px",  // Prevents it from bumping into the button
                objectFit: "left"   // Aligns the logo to the left of its container
              }}
            />

            {/* Collapse chevron - closes sidebar on mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden ml-auto bg-transparent border-none cursor-pointer text-gray-400 flex items-center p-1"
            >
              <Icons.ChevronLeft />
            </button>
          </div>
          {/* Nav items */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_ITEMS.map(({ id, label, Icon, path }) => {
              const active = activeId === id;
              return (
                <button
                  key={id}
                  onClick={() => navigate(path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "11px 14px",
                    borderRadius: 12,
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "left",
                    backgroundColor: active ? "#F3E8FF" : "transparent",
                    color: active ? "#9333EA" : "#374151",
                    fontWeight: active ? 600 : 500,
                    fontSize: 15,
                    transition: "background-color 0.15s, color 0.15s",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "#FAF5FF"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                >
                  <span style={{ color: active ? "#9333EA" : "#6B7280", display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <Icon />
                  </span>
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Bottom section ── */}
        <div>
          {/* User row */}
          <div 
            onClick={() => navigate("/settings", { state: { section: "account" } })}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", marginBottom: 4, cursor: "pointer", borderRadius: 12 }}
            className="hover:bg-gray-50 transition-colors"
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "#F3E8FF",
              color: "#9333EA",
              fontWeight: 700,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {user.initials}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name}
            </span>
          </div>

          {/* Log Out */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              backgroundColor: "transparent",
              color: "#EF4444",
              fontWeight: 500,
              fontSize: 15,
              transition: "background-color 0.15s",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            <Icons.Logout />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}