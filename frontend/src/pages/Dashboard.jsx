import { useState } from "react";
import Sidebar from "../components/Sidebar";

// ── SVG Icons ──────────────────────────────────────────────────────────────
const Icons = {
  Home: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Menu: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Orders: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/></svg>,
  Inventory: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  Reports: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Settings: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Kitchen: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  Logout: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Search: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Filter: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Cart: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>,
  ChevronLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Plus: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Truck: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  TakeAway: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  DineIn: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>,
  Users: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Rupee: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="3" x2="18" y2="3"/><line x1="6" y1="8" x2="18" y2="8"/><line x1="6" y1="13" x2="14" y2="21"/><path d="M6 8a6 6 0 000 0c0 3.31 2.69 5 6 5"/></svg>,
  Grid: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Cutlery: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><line x1="7" y1="2" x2="7" y2="22"/><path d="M21 15V2s-5 2-5 10v3"/><line x1="21" y1="22" x2="21" y2="15"/><line x1="16" y1="15" x2="21" y2="15"/></svg>,
  MapPin: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};

// ── Data ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all", label: "All", count: 225, emoji: "⊞" },
  { id: "Breakfast", label: "Breakfast", count: 18, emoji: "☕" },
  { id: "Soups", label: "Soups", count: 6, emoji: "🥣" },
  { id: "Pasta", label: "Pasta", count: 14, emoji: "🍝" },
  { id: "Burger", label: "Burger", count: 14, emoji: "🍔" },
  { id: "Main Course", label: "Main Course", count: 14, emoji: "🍽️" },
];

const MENU_ITEMS = [
  { id: 1, name: "Tasty Vegetable Salad", category: "Soups", price: 399, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
  { id: 2, name: "Creamy Mushroom Soup", category: "Soups", price: 189, img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80" },
  { id: 3, name: "Veg Momos", category: "Breakfast", price: 149, img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80" },
  { id: 4, name: "Original Cheeseburger", category: "Burger", price: 189, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: 5, name: "Taco Salvo With Cheese", category: "Main Course", price: 299, img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80" },
  { id: 6, name: "Grilled Chicken", category: "Main Course", price: 349, img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80" },
  { id: 7, name: "Spaghetti Bolognese", category: "Pasta", price: 279, img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80" },
  { id: 8, name: "Paneer Butter Masala", category: "Main Course", price: 319, img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80" },
];

// Dine-in tables data
const ALL_TABLES = [
  { id: 1, number: 1, seats: 4, section: "ac", status: "available", name: null, time: null, amount: null },
  { id: 2, number: 2, seats: 4, section: "ac", status: "occupied", name: "Floyd Miles", time: "10:30 AM", amount: 1350 },
  { id: 3, number: 3, seats: 4, section: "ac", status: "available", name: null, time: null, amount: null },
  { id: 4, number: 4, seats: 6, section: "ac", status: "available", name: null, time: null, amount: null },
  { id: 5, number: 2, seats: 4, section: "ac", status: "occupied", name: "Bessie Cooper", time: "11:15 AM", amount: 1200 },
  { id: 6, number: 6, seats: 2, section: "ac", status: "available", name: null, time: null, amount: null },
  { id: 7, number: 7, seats: 4, section: "ac", status: "available", name: null, time: null, amount: null },
  { id: 8, number: 8, seats: 4, section: "ac", status: "occupied", name: "Maya Sinha", time: "11:30 AM", amount: 1200 },
  { id: 9, number: 9, seats: 6, section: "ac", status: "reserved", name: "Robert Fox", time: "2:00 PM", amount: null },
  { id: 10, number: 10, seats: 4, section: "ac", status: "available", name: null, time: null, amount: null },
  { id: 11, number: 11, seats: 4, section: "ac", status: "available", name: null, time: null, amount: null },
  { id: 12, number: 12, seats: 2, section: "ac", status: "occupied", name: "Abhi Mehta", time: "12:45 PM", amount: 650 },
  { id: 13, number: 22, seats: 4, section: "outdoor", status: "available", name: null, time: null, amount: null },
  { id: 14, number: 23, seats: 6, section: "outdoor", status: "reserved", name: "Davon Lane", time: "3:00 PM", amount: null },
  { id: 15, number: 24, seats: 4, section: "outdoor", status: "available", name: null, time: null, amount: null },
];

const STATUS_COLORS = {
  available: { dot: "#22C55E", bg: "#FFFFFF", border: "#E5E7EB", text: "#1A1A1A" },
  occupied: { dot: "#3B82F6", bg: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF" },
  reserved: { dot: "#F59E0B", bg: "#FFFBEB", border: "#FDE68A", text: "#92400E" },
  cleaning: { dot: "#22C55E", bg: "#F0FDF4", border: "#BBF7D0", text: "#166534" },
};

// Take Away orders
const TAKEAWAY_ORDERS = [
  { id: "TA-001", name: "Rahul Sharma", phone: "98765 43210", items: 3, amount: 720, status: "preparing", time: "12:10 PM" },
  { id: "TA-002", name: "Priya Mehta", phone: "91234 56789", items: 2, amount: 389, status: "ready", time: "12:25 PM" },
  { id: "TA-003", name: "Amit Kumar", phone: "99887 76655", items: 5, amount: 1340, status: "pending", time: "12:40 PM" },
];

const ORDER_STATUS = {
  pending: { label: "Pending", bg: "#FEF3C7", text: "#92400E" },
  preparing: { label: "Preparing", bg: "#EDE9FE", text: "#6D28D9" },
  ready: { label: "Ready", bg: "#D1FAE5", text: "#065F46" },
  delivered: { label: "Delivered", bg: "#E0F2FE", text: "#0369A1" },
};



// ── Delivery View ──────────────────────────────────────────────────────────
function DeliveryView() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [section, setSection] = useState("all");

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  };

  const filtered = MENU_ITEMS.filter(i =>
    (category === "all" || i.category === category) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const sgst = subtotal * 0.025;
  const cgst = subtotal * 0.025;
  const total = subtotal + sgst + cgst;

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Center */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#FAF5FF" }}>
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1"
            style={{ backgroundColor: "#FFFFFF", border: "1.5px solid #EDE9FE" }}>
            <Icons.Search />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search Product Here..."
              className="flex-1 text-sm outline-none bg-transparent" style={{ color: "#1A1A1A" }} />
          </div>
          <button className="p-2 rounded-lg" style={{ color: "#6B7280" }}><Icons.Filter /></button>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2 px-5 pb-3 flex-shrink-0">
          {[{ id: "all", label: "All Sections" }, { id: "ac", label: "A/C Section" }, { id: "outdoor", label: "Outdoors" }].map(s => (
            <button key={s.id} onClick={() => setSection(s.id)}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: section === s.id ? "#9333EA" : "#FFFFFF", color: section === s.id ? "#FFFFFF" : "#4B5563", border: "1px solid", borderColor: section === s.id ? "#9333EA" : "#E5E7EB" }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="flex gap-3 px-5 pb-4 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
          {CATEGORIES.map(cat => {
            const active = category === cat.id;
            return (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl flex-shrink-0 transition-all"
                style={{ backgroundColor: active ? "#F3E8FF" : "#FFFFFF", border: `1.5px solid ${active ? "#DDD6FE" : "#EDE9FE"}`, minWidth: 80 }}>
                <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                <span className="text-xs font-semibold" style={{ color: active ? "#9333EA" : "#1A1A1A" }}>{cat.label}</span>
                <span className="text-xs" style={{ color: "#9CA3AF" }}>{cat.count} Items</span>
              </button>
            );
          })}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-5" style={{ scrollbarWidth: "thin" }}>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            {filtered.map(item => (
              <button key={item.id} onClick={() => addToCart(item)}
                className="rounded-2xl overflow-hidden text-left transition-all hover:-translate-y-0.5 active:scale-95"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #F0E9FF", boxShadow: "0 1px 4px rgba(147,51,234,0.06)" }}>
                <div style={{ height: 150, overflow: "hidden" }}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>{item.category}</p>
                  <p className="text-sm font-semibold leading-tight mb-1" style={{ color: "#1A1A1A" }}>{item.name}</p>
                  <p className="text-sm font-bold" style={{ color: "#9333EA" }}>₹{item.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Cart */}
      <div className="flex flex-col flex-shrink-0 py-5 px-4"
        style={{ width: 260, backgroundColor: "#FFFFFF", borderLeft: "1px solid #F0E9FF" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>Delivery</span>
            <Icons.Grid />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: "#9CA3AF" }}>
              <Icons.Cart />
              <p className="text-sm">Your cart is empty</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ backgroundColor: "#FAF5FF" }}>
                  <img src={item.img} alt={item.name} className="rounded-lg object-cover flex-shrink-0" style={{ width: 40, height: 40 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "#1A1A1A" }}>{item.name}</p>
                    <p className="text-xs font-bold" style={{ color: "#9333EA" }}>₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => updateQty(item.id, -1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#EDE9FE", color: "#9333EA" }}><Icons.Minus /></button>
                    <span className="text-xs font-bold w-4 text-center" style={{ color: "#1A1A1A" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#9333EA", color: "#FFF" }}><Icons.Plus /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bill */}
        <div className="pt-3 mt-3" style={{ borderTop: "1px solid #EDE9FE" }}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>Total</span>
            <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-xs" style={{ color: "#6B7280" }}>SGST (2.5%)</span>
            <span className="text-xs" style={{ color: "#6B7280" }}>₹ {sgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-xs" style={{ color: "#6B7280" }}>CGST (2.5%)</span>
            <span className="text-xs" style={{ color: "#6B7280" }}>₹ {cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 mb-4" style={{ borderTop: "1px solid #EDE9FE" }}>
            <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>Total Amount</span>
            <span className="text-sm font-extrabold" style={{ color: "#1A1A1A" }}>₹{total.toFixed(2)}</span>
          </div>
          {cart.length > 0 && (
            <button className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: "#9333EA", boxShadow: "0 4px 12px rgba(147,51,234,0.3)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#7E22CE"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#9333EA"; }}>
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Dine In View ───────────────────────────────────────────────────────────
function DineInView() {
  const [section, setSection] = useState("all");
  const [selectedTable, setSelectedTable] = useState(null);

  const available = ALL_TABLES.filter(t => t.status === "available").length;
  const occupied = ALL_TABLES.filter(t => t.status === "occupied").length;
  const reserved = ALL_TABLES.filter(t => t.status === "reserved").length;

  const filtered = ALL_TABLES.filter(t => {
    if (section === "all") return true;
    if (section === "ac") return t.section === "ac";
    if (section === "outdoor") return t.section === "outdoor";
    return true;
  });

  const sectionLabel = section === "all" ? "All sections" : section === "ac" ? "A/C Section" : "Outdoors";

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5" style={{ backgroundColor: "#FAF5FF" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1A1A1A" }}>Selected Table</h2>
          <div className="flex items-center gap-4">
            {[
              { color: "#E5E7EB", label: "Available" },
              { color: "#3B82F6", label: "Occupied" },
              { color: "#EF4444", label: "Reserved" },
              { color: "#22C55E", label: "Cleaning" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color, border: s.color === "#E5E7EB" ? "1.5px solid #9CA3AF" : "none" }} />
                <span className="text-sm" style={{ color: "#6B7280" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Available Tables", value: `${available} Of ${ALL_TABLES.length}`, sub: null, icon: <Icons.Cutlery />, progress: available / ALL_TABLES.length },
          { label: "Occupied Tables", value: `${occupied} Tables`, sub: "Active orders in process", icon: <Icons.Users />, progress: null },
          { label: "Reserved Tables", value: `${reserved} Tables`, sub: "Upcoming Reservations", icon: <Icons.Clock />, progress: null },
        ].map((card, i) => (
          <div key={i} className="rounded-2xl p-5 flex items-start justify-between"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE9FE" }}>
            <div>
              <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>{card.label}</p>
              <p className="text-xl font-bold mb-1" style={{ color: "#1A1A1A" }}>{card.value}</p>
              {card.sub && <p className="text-xs" style={{ color: "#9CA3AF" }}>{card.sub}</p>}
              {card.progress !== null && (
                <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E5E7EB", width: 140 }}>
                  <div className="h-full rounded-full" style={{ width: `${card.progress * 100}%`, backgroundColor: "#22C55E" }} />
                </div>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#F3E8FF", color: "#9333EA" }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Section tabs */}
      <div className="flex gap-3 mb-5">
        {[{ id: "all", label: "All Sections" }, { id: "ac", label: "A/C Section" }, { id: "outdoor", label: "Outdoors" }].map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: section === s.id ? "#9333EA" : "#FFFFFF", color: section === s.id ? "#FFFFFF" : "#4B5563", border: "1px solid", borderColor: section === s.id ? "#9333EA" : "#E5E7EB" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Section heading + Table grid */}
      <h3 className="text-lg font-bold mb-4" style={{ color: "#1A1A1A" }}>{sectionLabel}</h3>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}>
        {filtered.map(table => {
          const sc = STATUS_COLORS[table.status];
          return (
            <button key={table.id} onClick={() => setSelectedTable(table)}
              className="rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: sc.bg, border: `1.5px solid ${sc.border}`, minHeight: 110 }}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-base font-bold" style={{ color: "#1A1A1A" }}>Table {table.number}</span>
                {table.status === "occupied" && (
                  <div style={{ color: "#3B82F6" }}><Icons.Users /></div>
                )}
                {table.status === "reserved" && (
                  <div style={{ color: "#F59E0B" }}><Icons.Clock /></div>
                )}
              </div>
              <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>{table.seats} Seats</p>
              {table.name && <p className="text-xs font-medium" style={{ color: "#4B5563" }}>{table.name}</p>}
              {table.time && (
                <p className="text-xs font-semibold" style={{ color: table.status === "reserved" ? "#F59E0B" : "#3B82F6" }}>{table.time}</p>
              )}
              {table.amount && (
                <p className="text-xs font-bold mt-1" style={{ color: "#9333EA" }}>₹{table.amount.toLocaleString()}</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Table detail modal */}
      {selectedTable && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setSelectedTable(null)}>
          <div className="rounded-2xl p-6 w-80" style={{ backgroundColor: "#FFFFFF" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: "#1A1A1A" }}>Table {selectedTable.number}</h3>
              <span className="text-xs px-2 py-1 rounded-lg font-medium capitalize"
                style={{ backgroundColor: STATUS_COLORS[selectedTable.status].bg, color: selectedTable.status === "available" ? "#065F46" : selectedTable.status === "occupied" ? "#1E40AF" : "#92400E", border: `1px solid ${STATUS_COLORS[selectedTable.status].border}` }}>
                {selectedTable.status}
              </span>
            </div>
            <div className="space-y-2 text-sm mb-5" style={{ color: "#4B5563" }}>
              <p><span className="font-medium">Seats:</span> {selectedTable.seats}</p>
              <p><span className="font-medium">Section:</span> {selectedTable.section === "ac" ? "A/C Section" : "Outdoors"}</p>
              {selectedTable.name && <p><span className="font-medium">Guest:</span> {selectedTable.name}</p>}
              {selectedTable.time && <p><span className="font-medium">Time:</span> {selectedTable.time}</p>}
              {selectedTable.amount && <p><span className="font-medium">Amount:</span> ₹{selectedTable.amount.toLocaleString()}</p>}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#9333EA" }}>
                {selectedTable.status === "available" ? "Seat Guests" : "View Order"}
              </button>
              <button onClick={() => setSelectedTable(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#F3F4F6", color: "#4B5563" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Take Away View ─────────────────────────────────────────────────────────
function TakeAwayView() {
  const [orders, setOrders] = useState(TAKEAWAY_ORDERS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5" style={{ backgroundColor: "#FAF5FF" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>Take Away Orders</h2>
          <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>Manage customer pickup orders</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: "#9333EA", boxShadow: "0 4px 12px rgba(147,51,234,0.25)" }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#7E22CE"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#9333EA"; }}>
          <Icons.Plus /> New Order
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Orders", value: orders.length, color: "#9333EA" },
          { label: "Preparing", value: orders.filter(o => o.status === "preparing").length, color: "#6D28D9" },
          { label: "Ready", value: orders.filter(o => o.status === "ready").length, color: "#065F46" },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl p-4 text-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE9FE" }}>
            <p className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Orders list */}
      <div className="flex flex-col gap-3">
        {orders.map(order => {
          const st = ORDER_STATUS[order.status];
          return (
            <div key={order.id} className="rounded-2xl p-4"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE9FE" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>{order.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-lg font-medium"
                      style={{ backgroundColor: st.bg, color: st.text }}>{st.label}</span>
                  </div>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>{order.phone} · Order {order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#9333EA" }}>₹{order.amount}</p>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>{order.time}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#6B7280" }}>{order.items} items</span>
                <div className="flex gap-2">
                  {order.status === "pending" && (
                    <button onClick={() => updateStatus(order.id, "preparing")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: "#9333EA" }}>Start Preparing</button>
                  )}
                  {order.status === "preparing" && (
                    <button onClick={() => updateStatus(order.id, "ready")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: "#059669" }}>Mark Ready</button>
                  )}
                  {order.status === "ready" && (
                    <button onClick={() => updateStatus(order.id, "delivered")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: "#2563EB" }}>Mark Delivered</button>
                  )}
                  {order.status === "delivered" && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>Completed</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New order modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowForm(false)}>
          <div className="rounded-2xl p-6 w-96" style={{ backgroundColor: "#FFFFFF" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-5" style={{ color: "#1A1A1A" }}>New Take Away Order</h3>
            <div className="flex flex-col gap-4 mb-5">
              {[
                { label: "Customer Name", key: "name", placeholder: "Enter customer name", type: "text" },
                { label: "Phone Number", key: "phone", placeholder: "Enter phone number", type: "tel" },
                { label: "Address (optional)", key: "address", placeholder: "Pickup address if needed", type: "text" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>{field.label}</label>
                  <input type={field.type} value={form[field.key]} placeholder={field.placeholder}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" }}
                    onFocus={e => { e.target.style.borderColor = "#9333EA"; e.target.style.boxShadow = "0 0 0 3px rgba(147,51,234,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (form.name) {
                    setOrders(prev => [...prev, { id: `TA-00${prev.length + 1}`, name: form.name, phone: form.phone || "—", items: 0, amount: 0, status: "pending", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
                    setForm({ name: "", phone: "", address: "" });
                    setShowForm(false);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#9333EA" }}>
                Create Order
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#F3F4F6", color: "#4B5563" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [orderMode, setOrderMode] = useState("delivery"); // "dinein" | "takeaway" | "delivery"

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top mode switcher */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 flex-shrink-0"
          style={{ backgroundColor: "#FAF5FF", borderBottom: "1px solid #EDE9FE" }}>
          {/* Dine In */}
          <button onClick={() => setOrderMode("dinein")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: orderMode === "dinein" ? "#9333EA" : "#FFFFFF", color: orderMode === "dinein" ? "#FFFFFF" : "#4B5563", border: "1px solid", borderColor: orderMode === "dinein" ? "#9333EA" : "#E5E7EB" }}>
            <Icons.DineIn /> Dine In
          </button>
          {/* Take Away */}
          <button onClick={() => setOrderMode("takeaway")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: orderMode === "takeaway" ? "#9333EA" : "#FFFFFF", color: orderMode === "takeaway" ? "#FFFFFF" : "#4B5563", border: "1px solid", borderColor: orderMode === "takeaway" ? "#9333EA" : "#E5E7EB" }}>
            <Icons.TakeAway /> Take Away
          </button>
          {/* Delivery */}
          <button onClick={() => setOrderMode("delivery")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: orderMode === "delivery" ? "#9333EA" : "#FFFFFF", color: orderMode === "delivery" ? "#FFFFFF" : "#4B5563", border: "1px solid", borderColor: orderMode === "delivery" ? "#9333EA" : "#E5E7EB" }}>
            <Icons.Truck /> Delivery
          </button>
        </div>

        {/* View content */}
        <div className="flex-1 flex overflow-hidden">
          {orderMode === "delivery" && <DeliveryView />}
          {orderMode === "dinein" && <DineInView />}
          {orderMode === "takeaway" && <TakeAwayView />}
        </div>
      </div>
    </div>
  );
}