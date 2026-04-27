import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/Orderspage";
import InventoryPage from "./pages/Inventorypage";
import ReportsPage from "./pages/Reportspage";
import KitchenPage from "./pages/Kitchenpage";
import SettingsPage from "./pages/Settingspage";

/* ── Applies saved appearance to the DOM on every page load ── */
function applyAppearance(prefs) {
  if (!prefs) return;
  const root = document.documentElement;
  const theme = prefs.theme || "light";
  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : theme;

  root.setAttribute("data-theme",   resolvedTheme);
  root.setAttribute("data-density", prefs.density || "standard");
  root.setAttribute("data-accent",  prefs.accent  || "purple");

  /* Inject the same live style tag as AppearanceSettings uses */
  let el = document.getElementById("bb-live-appearance");
  if (!el) { el = document.createElement("style"); el.id = "bb-live-appearance"; document.head.appendChild(el); }

  const ACCENTS = {
    green:"#16a34a", blue:"#2563eb", purple:"#9333ea", orange:"#f59e0b", red:"#ef4444"
  };
  const ACCENTS_LIGHT = {
    green:"#dcfce7", blue:"#dbeafe", purple:"#f3e8ff", orange:"#fef3c7", red:"#fee2e2"
  };
  const main  = ACCENTS[prefs.accent]       || "#9333ea";
  const light = ACCENTS_LIGHT[prefs.accent] || "#f3e8ff";
  const dark    = resolvedTheme === "dark";
  const compact = prefs.density === "compact";

  el.textContent = `
    /* ── Theme-based Inversion (High Fidelity) ── */
    [data-theme="dark"] #root {
      filter: invert(1) hue-rotate(180deg);
      transition: filter 0.25s ease;
    }
    [data-theme="dark"] #root img, [data-theme="dark"] #root video, [data-theme="dark"] #root canvas {
      filter: invert(1) hue-rotate(180deg);
    }

    /* ── Solid accent backgrounds ── */
    [style*="background:#9333ea"],[style*="background: #9333ea"],
    [style*="background-color:#9333ea"],[style*="background-color: #9333ea"]
      { background-color:${main} !important; background:${main} !important; }

    /* ── Light accent backgrounds ── */
    [style*="background:#f3e8ff"],[style*="background: #f3e8ff"],
    [style*="background-color:#f3e8ff"],[style*="background-color: #f3e8ff"],
    [style*="background:#FAF5FF"] { background-color:${light} !important; background:${light} !important; }

    /* ── Accent text & SVG ── */
    [style*="color:#9333ea"],[style*="color: #9333ea"] { color:${main} !important; }
    aside nav button[style*="color: #9333ea"] { color: ${main} !important; }
    [stroke="#9333ea"] { stroke:${main} !important; }
    [fill="#9333ea"]   { fill:${main} !important; }

    /* ── Settings sidebar active ── */
    .sp-nav-btn.active { background:${light} !important; color:${main} !important; }

    /* ── Density ── */
    ${compact
      ? ".sp-nav-btn{padding:7px 10px !important;font-size:13px !important;} .sp-settings-nav{padding:18px 10px !important;} aside nav button { padding: 8px 12px !important; gap: 10px !important; } aside { padding: 16px 12px !important; width: 200px !important; min-width: 200px !important; }"
      : ""
    }
  `;




}


export default function App() {
  /* Bootstrap appearance from localStorage on first render */
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("billbite_appearance"));
      if (saved) applyAppearance(saved);
    } catch { /* no saved prefs, use defaults */ }
  }, []);


  return (
    <BrowserRouter>
      <Routes>

        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Optional */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/menu" element={<MenuPage />} />

        {/* You can add more pages like this */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}