import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "POS",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: "Menu",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    label: "Orders",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  {
    label: "Inventory",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <line x1="12" y1="12" x2="12" y2="16"/>
        <line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
  {
    label: "Reports",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
  {
    label: "Kitchen",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v6a6 6 0 0 0 12 0V2"/>
        <path d="M6 8h12"/>
        <path d="M12 14v8"/>
        <path d="M9 22h6"/>
      </svg>
    ),
  },
];

/**
 * Sidebar Component
 *
 * Props:
 *  - activePage : string       — highlighted nav item (e.g. "POS")
 *  - onNavigate : fn(label)    — called when a nav item is clicked
 *  - onLogout   : fn()         — clears token + redirects to /login
 *
 *  - user       : object       — comes from your auth flow:
 *      After POST /auth/login your backend returns { token, user }
 *      Save user in Context / Zustand / localStorage and pass it here.
 *      Shape: { name: "Divya Goswami", email: "...", role: "admin" }
 *      The name and initials in the sidebar footer render from user.name.
 */
export default function Sidebar({ activePage = "POS", onNavigate, user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(activePage);

  const handleNav = (label) => {
    setActive(label);
    if (onNavigate) onNavigate(label);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "DG";

  const displayName = user?.name || "Divya Goswami";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .sidebar {
          font-family: 'DM Sans', sans-serif;
          width: ${collapsed ? "72px" : "240px"};
          min-height: 100vh;
          background: #ffffff;
          border-right: 1px solid #f0eaf8;
          display: flex;
          flex-direction: column;
          padding: 20px 12px;
          transition: width 0.25s ease;
          overflow: hidden;
          position: relative;
          box-sizing: border-box;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 8px 24px 8px;
          cursor: pointer;
          white-space: nowrap;
        }

        /* Place your logo file at /public/logo.png */
        .logo-img {
          width: ${collapsed ? "36px" : "140px"};
          height: 40px;
          object-fit: contain;
          object-position: left center;
          transition: width 0.25s ease;
          display: block;
        }

        .nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          color: #6b7280;
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          position: relative;
        }

        .nav-item:hover {
          background: #faf5ff;
          color: #9333ea;
        }

        .nav-item.active {
          background: #f3e8ff;
          color: #9333ea;
          font-weight: 600;
        }

        .nav-item svg {
          flex-shrink: 0;
        }

        .nav-label {
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
          pointer-events: none;
        }

        .sidebar-footer {
          border-top: 1px solid #f3f4f6;
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }

        .user-row:hover {
          background: #faf5ff;
        }

        .avatar {
          width: 34px;
          height: 34px;
          background: #f3e8ff;
          color: #9333ea;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          border-radius: 12px;
          cursor: pointer;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
        }

        .logout-btn:hover {
          background: #fff1f2;
          color: #ef4444;
        }

        .logout-label {
          opacity: ${collapsed ? 0 : 1};
          transition: opacity 0.2s;
        }

        .collapse-btn {
          position: absolute;
          top: 22px;
          right: -12px;
          width: 24px;
          height: 24px;
          background: #fff;
          border: 1.5px solid #e9d5ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #9333ea;
          z-index: 10;
          transition: background 0.15s;
          box-shadow: 0 1px 4px rgba(147,51,234,0.1);
        }

        .collapse-btn:hover {
          background: #f3e8ff;
        }

        /* Tooltip for collapsed state */
        .nav-item .tooltip {
          display: none;
          position: absolute;
          left: 60px;
          background: #1a1a1a;
          color: #fff;
          font-size: 12px;
          padding: 5px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 100;
        }

        ${collapsed ? `
          .nav-item:hover .tooltip { display: block; }
          .user-row:hover .tooltip { display: block; }
        ` : ""}
      `}</style>

      <aside className="sidebar">
        {/* Collapse toggle */}
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {collapsed
              ? <polyline points="9 18 15 12 9 6"/>
              : <polyline points="15 18 9 12 15 6"/>
            }
          </svg>
        </button>

        {/* Logo */}
        <div className="sidebar-logo" onClick={() => handleNav("POS")}>
          <img
            src="/logo.png"
            alt="BillBite Logo"
            className="logo-img"
          />
        </div>

        {/* Nav Items */}
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li
              key={item.label}
              className={`nav-item ${active === item.label ? "active" : ""}`}
              onClick={() => handleNav(item.label)}
            >
              {item.icon}
              <span className="nav-label">{item.label}</span>
              {collapsed && <span className="tooltip">{item.label}</span>}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-row">
            <div className="avatar">{initials}</div>
            <span className="user-name">{displayName}</span>
            {collapsed && <span className="tooltip">{displayName}</span>}
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="logout-label">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}