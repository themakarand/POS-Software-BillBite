import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Truck } from "lucide-react";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icon = {
  Hamburger: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Filter: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  Grid: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  SearchLg: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Cart: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Minus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

// ── Sample Data ────────────────────────────────────────────────────────────
const categories = [
  { id: "all",        label: "All",        count: 225, icon: "⊞" },
  { id: "breakfast",  label: "Breakfast",  count: 18,  icon: "☕" },
  { id: "soups",      label: "Soups",      count: 6,   icon: "🍵" },
  { id: "pasta",      label: "Pasta",      count: 14,  icon: "🍝" },
  { id: "burger",     label: "Burger",     count: 14,  icon: "🍔" },
  { id: "maincourse", label: "Main Course",count: 14,  icon: "🍽️" },
];

const menuItems = [
  { id: 1, name: "Tasty Vegetable Salad",  category: "Salads",      price: 399, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { id: 2, name: "Creamy Mushroom Soup",   category: "Salads",      price: 189, img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80" },
  { id: 3, name: "Veg Momos",              category: "Salads",      price: 149, img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
  { id: 4, name: "Original Cheeseburger", category: "Salads",      price: 189, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 5, name: "Taco Salvo With Cheese", category: "Salads",      price: 299, img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80" },
  { id: 6, name: "Grilled Chicken",        category: "Main Course", price: 349, img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80" },
];

// ── Dashboard ──────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [orderType, setOrderType]         = useState("Delivery");
  const [cart, setCart]                   = useState([]);
  const [search, setSearch]               = useState("");
  const [cartOpen, setCartOpen]           = useState(false); // mobile cart panel

  // ── Cart helpers ───────────────────────────────────────────────────────
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev.map((c) => c.id === id ? { ...c, qty: c.qty + delta } : c).filter((c) => c.qty > 0)
    );
  };

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const sgst     = subtotal * 0.025;
  const cgst     = subtotal * 0.025;
  const total    = subtotal + sgst + cgst;
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const filtered = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // ── Right Panel (cart) — shared between desktop sidebar and mobile sheet
  const CartPanel = () => (
    <div className="h-full flex flex-col py-5 px-4" style={{ backgroundColor: "#FFFFFF" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold" style={{ color: "#1A1A1A" }}>{orderType}</span>
          <Icon.Grid />
        </div>
        <button style={{ color: "#9CA3AF" }}><Icon.SearchLg /></button>
      </div>

      {/* Order type tabs */}
      <div className="flex rounded-xl p-1 mb-5 gap-1 flex-shrink-0" style={{ backgroundColor: "#F3F4F6" }}>
        {["Dine In", "Take Away", "Delivery"].map((type) => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: orderType === type ? "#9333EA" : "transparent",
              color: orderType === type ? "#FFFFFF" : "#6B7280",
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: "#9CA3AF" }}>
            <Icon.Cart />
            <p className="text-sm">Your cart is empty</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-xl"
                style={{ backgroundColor: "#FAF5FF" }}
              >
                <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: "#1A1A1A" }}>{item.name}</p>
                  <p className="text-xs font-bold" style={{ color: "#9333EA" }}>₹{item.price}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#EDE9FE", color: "#9333EA" }}
                  >
                    <Icon.Minus />
                  </button>
                  <span className="w-5 text-center text-xs font-bold" style={{ color: "#1A1A1A" }}>{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#9333EA", color: "#FFFFFF" }}
                  >
                    <Icon.Plus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bill summary */}
      <div className="mt-4 pt-4 flex-shrink-0" style={{ borderTop: "1px solid #EDE9FE" }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>Total</span>
          <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs" style={{ color: "#6B7280" }}>SGST (2.5%)</span>
          <span className="text-xs" style={{ color: "#6B7280" }}>₹ {sgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs" style={{ color: "#6B7280" }}>CGST (2.5%)</span>
          <span className="text-xs" style={{ color: "#6B7280" }}>₹ {cgst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-4 pt-3" style={{ borderTop: "1px solid #EDE9FE" }}>
          <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>Total Amount</span>
          <span className="text-sm font-extrabold" style={{ color: "#1A1A1A" }}>₹{total.toFixed(2)}</span>
        </div>
        {cart.length > 0 && (
          <button
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ backgroundColor: "#9333EA", boxShadow: "0 4px 12px rgba(147,51,234,0.3)" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#7E22CE"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#9333EA"; }}
          >
            Place Order
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", backgroundColor: "#F9F5FF" }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* ── MAIN CONTENT ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0" style={{ backgroundColor: "#FAF5FF" }}>

        {/* Top bar */}
        <div
          className="flex items-center gap-3 px-4 sm:px-6 py-4 flex-shrink-0"
          style={{ backgroundColor: "#FAF5FF" }}
        >
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-white transition-colors flex-shrink-0"
            style={{ color: "#4B5563" }}
          >
            <Icon.Hamburger />
          </button>

          {/* Search bar */}
          <div
            className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white min-w-0"
            style={{ border: "1.5px solid #EDE9FE" }}
          >
            <span className="flex-shrink-0 text-gray-400"><Icon.Search /></span>
            <input
              type="text"
              placeholder="Search Product Here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent min-w-0"
              style={{ color: "#1A1A1A" }}
            />
          </div>

          <button className="p-2 rounded-lg hover:bg-white transition-colors flex-shrink-0" style={{ color: "#4B5563" }}>
            <Icon.Filter />
          </button>

          {/* Cart badge — mobile only, opens cart sheet */}
          <button
            onClick={() => setCartOpen(true)}
            className="xl:hidden relative p-2 rounded-lg hover:bg-white transition-colors flex-shrink-0"
            style={{ color: "#4B5563" }}
          >
            <Icon.Cart />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: "#9333EA" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-3 px-4 sm:px-6 pb-4 flex-shrink-0 overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex flex-col items-center gap-1 px-4 sm:px-5 py-3 rounded-2xl flex-shrink-0 transition-all duration-150 min-w-[80px] sm:min-w-[90px]"
                style={{
                  backgroundColor: isActive ? "#F3E8FF" : "#FFFFFF",
                  border: isActive ? "1.5px solid #D8B4FE" : "1.5px solid #EDE9FE",
                  boxShadow: isActive ? "0 2px 8px rgba(147,51,234,0.1)" : "none",
                }}
              >
                <span className="text-base sm:text-lg">{cat.icon}</span>
                <span className="text-xs font-semibold" style={{ color: isActive ? "#9333EA" : "#1A1A1A" }}>{cat.label}</span>
                <span className="text-[10px] sm:text-xs" style={{ color: "#9CA3AF" }}>{cat.count} Items</span>
              </button>
            );
          })}
        </div>

        {/* ── DELIVERY SECTION ───────────────────────────── */}
<div className="px-4 sm:px-6 pb-4">
  <div
    className="bg-white p-4 rounded-2xl"
    style={{ border: "1px solid #F0E9FF" }}
  >
    {/* Header */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 flex items-center justify-center rounded-lg"
          style={{ backgroundColor: "#F3E8FF", color: "#9333EA" }}
        >
          <Truck size={18} />
        </div>
        <h2 className="text-sm font-bold" style={{ color: "#1A1A1A" }}>
          Delivery
        </h2>
      </div>

      <button className="text-xs font-semibold" style={{ color: "#9333EA" }}>
        View All
      </button>
    </div>

    {/* Delivery Items */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

      <div className="p-3 rounded-xl" style={{ backgroundColor: "#FAF5FF" }}>
        <p className="text-xs font-semibold">Order #123</p>
        <p className="text-[10px]" style={{ color: "#6B7280" }}>John Doe</p>
        <span className="text-[10px] font-bold text-green-600">Delivered</span>
      </div>

      <div className="p-3 rounded-xl" style={{ backgroundColor: "#FAF5FF" }}>
        <p className="text-xs font-semibold">Order #124</p>
        <p className="text-[10px]" style={{ color: "#6B7280" }}>Rahul Sharma</p>
        <span className="text-[10px] font-bold text-yellow-600">On the way</span>
      </div>

      <div className="p-3 rounded-xl" style={{ backgroundColor: "#FAF5FF" }}>
        <p className="text-xs font-semibold">Order #125</p>
        <p className="text-[10px]" style={{ color: "#6B7280" }}>Amit Patel</p>
        <span className="text-[10px] font-bold text-red-600">Pending</span>
      </div>

    </div>
  </div>
</div>

        

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="rounded-2xl overflow-hidden text-left transition-all duration-150 hover:shadow-md active:scale-95"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #F0E9FF" }}
              >
                <div className="h-32 sm:h-40 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-2.5 sm:p-3">
                  <p className="text-[10px] sm:text-xs mb-1" style={{ color: "#9CA3AF" }}>{item.category}</p>
                  <p className="text-xs sm:text-sm font-semibold mb-1 leading-tight" style={{ color: "#1A1A1A" }}>{item.name}</p>
                  <p className="text-xs sm:text-sm font-bold" style={{ color: "#9333EA" }}>₹{item.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ── RIGHT PANEL — Cart (desktop only) ───────────────────── */}
      <aside
        className="hidden xl:flex flex-col flex-shrink-0 w-72"
        style={{ borderLeft: "1px solid #F0E9FF" }}
      >
        <CartPanel />
      </aside>

      {/* ── MOBILE CART BOTTOM SHEET ─────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className={`xl:hidden fixed inset-0 z-40 transition-opacity duration-300
          ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)" }}
      />
      {/* Sheet */}
      <div
        className={`xl:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl
          transform transition-transform duration-300 ease-in-out max-h-[85vh] overflow-hidden flex flex-col
          ${cartOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{ backgroundColor: "#FFFFFF", boxShadow: "0 -8px 40px rgba(147,51,234,0.12)" }}
      >
        {/* Pull handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "#E5E7EB" }} />
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <CartPanel />
        </div>
      </div>
    </div>
  );
}