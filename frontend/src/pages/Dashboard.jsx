import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

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

const PREDEFINED_CATEGORIES = [
  { id: "Breakfast", label: "Breakfast", emoji: "☕" },
  { id: "Soups", label: "Soups", emoji: "🥣" },
  { id: "Pasta", label: "Pasta", emoji: "🍝" },
  { id: "Burger", label: "Burger", emoji: "🍔" },
  { id: "Main Course", label: "Main Course", emoji: "🍽️" },
  { id: "Beverages", label: "Beverages", emoji: "🍹" },
  { id: "Desserts", label: "Desserts", emoji: "🍰" },
  { id: "Salads", label: "Salads", emoji: "🥗" }
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



const ORDER_STATUS = {
  pending: { label: "Pending", bg: "#FEF3C7", text: "#92400E" },
  preparing: { label: "Preparing", bg: "#EDE9FE", text: "#6D28D9" },
  ready: { label: "Ready", bg: "#D1FAE5", text: "#065F46" },
  delivered: { label: "Delivered", bg: "#E0F2FE", text: "#0369A1" },
};



// ── POS View (Menu & Cart) ──────────────────────────────────────────────────
function POSView({ activeOrder, setActiveOrder, activeTable, setActiveTable, setOrderMode }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("all");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      // Map _id to id
      setProducts(res.data.map(p => ({ ...p, id: p._id })));
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (item) => {
    if (!activeOrder) return alert("Select an order or table first!");
    try {
      const res = await api.post("/orders/add-item", { orderId: activeOrder._id, product: item });
      setActiveOrder(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQty = async (id, delta) => {
    if (!activeOrder) return;
    try {
      if (delta > 0) {
        // Find product object to pass to add-item
        const item = activeOrder.items.find(i => i.product.toString() === id || i._id === id);
        // If not already in cart, the product passed is needed. For + button, it's already in cart so we just need its ID.
        const product = products.find(p => p.id === id || p._id === id) || { _id: id };
        const res = await api.post("/orders/add-item", { orderId: activeOrder._id, product });
        setActiveOrder(res.data);
      } else if (delta < 0) {
        const res = await api.post("/orders/remove-item", { orderId: activeOrder._id, productId: id });
        setActiveOrder(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!activeOrder) return;
    try {
      if (activeOrder.mode === "Take Away" || activeOrder.mode === "Delivery") {
        // Change from "new" to "pending" to send to Kitchen
        if (activeOrder.status === "new") {
          await api.post("/orders/update-status", { orderId: activeOrder._id, status: "pending" });
        }
      } else {
        // Dine In completes payment
        await api.post("/orders/complete", { orderId: activeOrder._id });
      }
      setActiveOrder(null);
      setActiveTable(null);
      setOrderMode(
        activeOrder.mode === "Take Away" ? "takeaway" : 
        activeOrder.mode === "Delivery" ? "delivery" : "dinein"
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrintKOT = async () => {
    if (!activeOrder) return;
    try {
      const res = await api.get(`/orders/kot/${activeOrder._id}`);
      const kot = res.data;
      let text = `--- KOT ---\nTable: ${kot.table}\n`;
      kot.items.forEach(i => text += `${i.qty}x ${i.name}\n`);
      alert(text);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSplitBill = async () => {
    if (!activeOrder || activeOrder.items.length < 2) return alert("Need at least 2 items to split!");
    // Basic split implementation: split the first item into a new bill
    const splitItemIds = [activeOrder.items[0]._id];
    try {
      const res = await api.post("/orders/split", { orderId: activeOrder._id, items: splitItemIds });
      setActiveOrder(res.data.original);
      alert("Bill split successfully! One item moved to a new order.");
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter(i =>
    (category === "all" || i.category === category) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const cart = activeOrder?.items || [];
  const subtotal = activeOrder?.subtotal || 0;
  const sgst = (activeOrder?.gst || 0) / 2;
  const cgst = (activeOrder?.gst || 0) / 2;
  const total = activeOrder?.total || 0;

  return (
    <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
      {/* Center */}
      <div className="flex-1 flex flex-col overflow-visible lg:overflow-hidden" style={{ backgroundColor: "#FAF5FF" }}>
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
          {(() => {
            const existingCategoryIds = new Set(PREDEFINED_CATEGORIES.map(c => c.id));
            const dynamicCategories = [
              { id: "all", label: "All", emoji: "⊞" },
              ...PREDEFINED_CATEGORIES
            ];
            
            try {
              const savedCategories = JSON.parse(localStorage.getItem("custom_categories") || "[]");
              savedCategories.forEach(cat => {
                if (!existingCategoryIds.has(cat)) {
                  existingCategoryIds.add(cat);
                  dynamicCategories.push({
                    id: cat,
                    label: cat,
                    emoji: "🍲"
                  });
                }
              });
            } catch (e) {}
            
            // Add any missing categories from products dynamically
            products.forEach(p => {
              if (p.category && !existingCategoryIds.has(p.category)) {
                existingCategoryIds.add(p.category);
                dynamicCategories.push({
                  id: p.category,
                  label: p.category,
                  emoji: "🍲" // Generic food emoji for custom categories
                });
              }
            });

            return dynamicCategories.map(cat => {
              const active = category === cat.id;
              const realCount = cat.id === "all" ? products.length : products.filter(p => p.category === cat.id).length;
              
              return (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl flex-shrink-0 transition-all"
                  style={{ backgroundColor: active ? "#F3E8FF" : "#FFFFFF", border: `1.5px solid ${active ? "#DDD6FE" : "#EDE9FE"}`, minWidth: 80 }}>
                  <span style={{ fontSize: 18 }}>{cat.emoji}</span>
                  <span className="text-xs font-semibold" style={{ color: active ? "#9333EA" : "#1A1A1A" }}>{cat.label}</span>
                  <span className="text-xs" style={{ color: "#9CA3AF" }}>{realCount} Items</span>
                </button>
              );
            });
          })()}
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-visible lg:overflow-y-auto px-5 pb-5" style={{ scrollbarWidth: "thin" }}>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
      <div className="flex flex-col flex-shrink-0 py-5 px-4 w-full lg:w-[260px]"
        style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid #F0E9FF", borderTop: "1px solid #F0E9FF" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>
              {activeOrder?.mode === "Take Away" ? `Take Away - ${activeOrder.customer_name}` : activeTable ? `Table ${activeTable.number}` : "Menu"}
            </span>
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
              {cart.map(item => {
                const productMatch = products.find(p => p.id === item.product || p._id === item.product);
                const itemImg = item.img || productMatch?.img;
                return (
                <div key={item._id || item.id} className="flex items-center gap-2 p-2 rounded-xl" style={{ backgroundColor: "#FAF5FF" }}>
                  {itemImg ? (
                    <img src={itemImg} alt={item.name} className="rounded-lg object-cover flex-shrink-0" style={{ width: 40, height: 40 }} />
                  ) : (
                    <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, backgroundColor: "#F3E8FF", fontSize: "20px" }}>
                      🍽️
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: "#1A1A1A" }}>{item.name}</p>
                    <p className="text-xs font-bold" style={{ color: "#9333EA" }}>₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => updateQty(item.product || item._id, -1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#EDE9FE", color: "#9333EA" }}><Icons.Minus /></button>
                    <span className="text-xs font-bold w-4 text-center" style={{ color: "#1A1A1A" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.product || item._id, 1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#9333EA", color: "#FFF" }}><Icons.Plus /></button>
                  </div>
                </div>
              );
              })}
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
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button 
                  onClick={handlePrintKOT}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: "#F3E8FF", color: "#9333EA", border: "1px solid #E9D5FF" }}>
                  Print KOT
                </button>
                <button 
                  onClick={handleSplitBill}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: "#FFFBEB", color: "#D97706", border: "1px solid #FEF3C7" }}>
                  Split Bill
                </button>
              </div>
              <button 
                onClick={handlePlaceOrder}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ backgroundColor: "#9333EA", boxShadow: "0 4px 12px rgba(147,51,234,0.3)" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#7E22CE"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#9333EA"; }}>
                {activeOrder?.mode === "Take Away" ? "Send to Kitchen" : "Complete Payment"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Dine In View ───────────────────────────────────────────────────────────
function DineInView({ setActiveOrder, setActiveTable, setOrderMode }) {
  const [section, setSection] = useState("all");
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const [showAddTable, setShowAddTable] = useState(false);
  const [newTable, setNewTable] = useState({ name: "", seats: 4, section: "ac" });
  const [editingTable, setEditingTable] = useState(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await api.get("/tables");
      // format for frontend: Map _id to id
      const formatted = res.data.map(t => ({
        ...t,
        id: t._id,
        number: t.name ? t.name.replace("Table ", "") : "", // Safe parsing
        seats: t.seats || 4,
        section: t.section || "ac"
      }));
      setTables(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeatGuests = async (table) => {
    try {
      const res = await api.post("/orders/create", { tableId: table.id });
      setActiveOrder(res.data);
      setActiveTable(table);
      setOrderMode("pos"); // open POS
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveTable = async (newTable) => {
    try {
      // Create/Get the running order for the original table
      const orderRes = await api.post("/orders/create", { tableId: selectedTable.id });
      const orderId = orderRes.data._id;
      
      await api.post("/orders/move", { orderId, newTableId: newTable.id });
      alert(`Order moved to Table ${newTable.number}`);
      setIsMoving(false);
      setSelectedTable(null);
      fetchTables(); // Refresh table status
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTable = async () => {
    if (!newTable.name.trim()) return alert("Table name is required!");
    try {
      await api.post("/tables", {
        name: newTable.name.startsWith("Table") ? newTable.name : `Table ${newTable.name}`,
        seats: Number(newTable.seats),
        section: newTable.section
      });
      setShowAddTable(false);
      setNewTable({ name: "", seats: 4, section: "ac" });
      fetchTables();
    } catch (err) {
      console.error(err);
      alert("Failed to add table");
    }
  };

  const handleEditTable = async () => {
    if (!editingTable.name.trim()) return alert("Table name is required!");
    try {
      await api.put(`/tables/${editingTable.id}`, {
        name: editingTable.name,
        seats: Number(editingTable.seats),
        section: editingTable.section
      });
      setEditingTable(null);
      setSelectedTable(null);
      fetchTables();
    } catch (err) {
      console.error(err);
      alert("Failed to update table");
    }
  };

  const handleToggleReserve = async (table) => {
    try {
      const newStatus = table.status === "reserved" ? "available" : "reserved";
      await api.put(`/tables/${table.id}`, { status: newStatus });
      setSelectedTable(null);
      fetchTables();
    } catch (err) {
      console.error(err);
      alert("Failed to update reservation status");
    }
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm("Are you sure you want to delete this table?")) return;
    try {
      await api.delete(`/tables/${id}`);
      setSelectedTable(null);
      fetchTables();
    } catch (err) {
      console.error(err);
      alert("Failed to delete table");
    }
  };

  const available = tables.filter(t => t.status === "available").length;
  const occupied = tables.filter(t => t.status === "occupied").length;
  const reserved = tables.filter(t => t.status === "reserved").length;

  const filtered = tables.filter(t => {
    if (section === "all") return true;
    if (section === "ac") return t.section === "ac";
    if (section === "outdoor") return t.section === "outdoor";
    return true;
  });

  const sectionLabel = section === "all" ? "All sections" : section === "ac" ? "A/C Section" : "Outdoors";

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5" style={{ backgroundColor: "#FAF5FF" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-3">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#1A1A1A" }}>Table Layout</h2>
          <div className="flex flex-wrap items-center gap-4">
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
        <button onClick={() => setShowAddTable(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: "#9333EA", boxShadow: "0 4px 12px rgba(147,51,234,0.25)" }}>
          <Icons.Plus /> Add Table
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Available Tables", value: `${available} Of ${tables.length}`, sub: null, icon: <Icons.Cutlery />, progress: tables.length > 0 ? available / tables.length : 0 },
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
      <h3 className="text-xl font-bold mb-4" style={{ color: "#1A1A1A", marginLeft: "4px" }}>{sectionLabel}</h3>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
        {filtered.map(table => {
          return (
            <button key={table.id} onClick={() => setSelectedTable(table)}
              className="rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-0.5 relative"
              style={{ 
                backgroundColor: "#FFFFFF", 
                border: table.status === "reserved" ? "1px solid #FEF08A" : "1px solid #E5E7EB", 
                minHeight: 150 
              }}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-lg font-bold" style={{ color: "#1A1A1A" }}>Table {table.number}</span>
                {table.status === "reserved" && (
                  <span style={{ color: "#EAB308" }}><Icons.Clock /></span>
                )}
              </div>
              <p className="text-sm mb-3" style={{ color: "#6B7280" }}>{table.seats} Seats</p>
              
              {table.name && <p className="text-xs mb-0.5" style={{ color: "#6B7280" }}>{table.name}</p>}
              {table.time && (
                <p className="text-xs font-semibold mb-3" style={{ color: table.status === "reserved" ? "#EAB308" : "#3B82F6" }}>{table.time}</p>
              )}
              
              {/* Oval status sign */}
              <span className="mt-auto px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wide capitalize"
                style={{
                  backgroundColor: table.status === "available" ? "#DCFCE7" : table.status === "occupied" ? "#FEE2E2" : "#FEF3C7",
                  color: table.status === "available" ? "#16A34A" : table.status === "occupied" ? "#DC2626" : "#D97706",
                }}>
                {table.status}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table detail modal */}
      {selectedTable && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => { setSelectedTable(null); setIsMoving(false); }}>
          <div className="rounded-2xl p-6 w-80" style={{ backgroundColor: "#FFFFFF" }} onClick={e => e.stopPropagation()}>
            {isMoving ? (
              <>
                <h3 className="text-lg font-bold mb-4" style={{ color: "#1A1A1A" }}>Select New Table</h3>
                <div className="grid grid-cols-3 gap-2 mb-4 max-h-48 overflow-y-auto">
                  {tables.filter(t => t.status === "available").map(t => (
                    <button key={t.id} onClick={() => handleMoveTable(t)}
                      className="py-2 rounded-lg text-sm font-semibold border transition-all"
                      style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB", color: "#1A1A1A" }}>
                      T{t.number}
                    </button>
                  ))}
                </div>
                <button onClick={() => setIsMoving(false)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold"
                  style={{ backgroundColor: "#F3F4F6", color: "#4B5563" }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
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
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleSeatGuests(selectedTable)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ backgroundColor: "#9333EA" }}>
                    {selectedTable.status === "available" ? "Seat Guests" : selectedTable.status === "reserved" ? "Seat Reserved Guests" : "View Order"}
                  </button>
                  {selectedTable.status !== "occupied" && (
                    <button 
                      onClick={() => handleToggleReserve(selectedTable)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-purple-600 transition-colors hover:bg-purple-100"
                      style={{ backgroundColor: "#F3E8FF", border: "1px solid #E9D5FF" }}>
                      {selectedTable.status === "reserved" ? "Cancel Reservation" : "Reserve Table"}
                    </button>
                  )}
                  {selectedTable.status === "occupied" && (
                    <button 
                      onClick={() => setIsMoving(true)}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ backgroundColor: "#3B82F6" }}>
                      Move Table
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingTable({ ...selectedTable }); setSelectedTable(null); }}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ backgroundColor: "#F3F4F6", color: "#4B5563" }}>
                      Edit Table
                    </button>
                    <button onClick={() => handleDeleteTable(selectedTable.id)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ backgroundColor: "#EF4444" }}>
                      Delete
                    </button>
                  </div>
                  <button onClick={() => setSelectedTable(null)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold mt-1"
                    style={{ backgroundColor: "#F9FAFB", color: "#9CA3AF", border: "1px solid #E5E7EB" }}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTable && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowAddTable(false)}>
          <div className="rounded-2xl p-6 w-80" style={{ backgroundColor: "#FFFFFF" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: "#1A1A1A" }}>Add New Table</h3>
            </div>
            
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#4B5563" }}>Table Number/Name</label>
                <input value={newTable.name} onChange={e => setNewTable({...newTable, name: e.target.value})}
                  placeholder="e.g. 5 or Table 5"
                  className="w-full px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#4B5563" }}>Number of Seats</label>
                <input type="number" value={newTable.seats} onChange={e => setNewTable({...newTable, seats: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#4B5563" }}>Section</label>
                <select value={newTable.section} onChange={e => setNewTable({...newTable, section: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" }}>
                  <option value="ac">A/C Section</option>
                  <option value="outdoor">Outdoors</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={handleAddTable}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#9333EA" }}>
                Save Table
              </button>
              <button onClick={() => setShowAddTable(false)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#F3F4F6", color: "#4B5563" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {editingTable && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setEditingTable(null)}>
          <div className="rounded-2xl p-6 w-80" style={{ backgroundColor: "#FFFFFF" }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: "#1A1A1A" }}>Edit Table Details</h3>
            </div>
            
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#4B5563" }}>Table Number/Name</label>
                <input value={editingTable.name} onChange={e => setEditingTable({...editingTable, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#4B5563" }}>Number of Seats</label>
                <input type="number" value={editingTable.seats} onChange={e => setEditingTable({...editingTable, seats: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1" style={{ color: "#4B5563" }}>Section</label>
                <select value={editingTable.section} onChange={e => setEditingTable({...editingTable, section: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg outline-none text-sm"
                  style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" }}>
                  <option value="ac">A/C Section</option>
                  <option value="outdoor">Outdoors</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={handleEditTable}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#9333EA" }}>
                Update Table
              </button>
              <button onClick={() => setEditingTable(null)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold"
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

// ── Take Away View ─────────────────────────────────────────────────────────
function TakeAwayView({ setActiveOrder, setOrderMode }) {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      const allOrders = res.data.orders || [];
      const takeawayOrders = allOrders.filter(o => o.mode === "Take Away");
      setOrders(takeawayOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.post("/orders/update-status", { orderId: id, status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhoneChange = (val) => {
    setForm(prev => ({ ...prev, phone: val }));
    // Auto-fill suggestion based on past orders
    const pastOrder = orders.find(o => o.phone === val && o.customer_name);
    if (pastOrder) {
      setForm(prev => ({
        ...prev,
        phone: val,
        name: prev.name || pastOrder.customer_name,
        address: prev.address || pastOrder.address || ""
      }));
    }
  };

  const handleCreateOrder = async () => {
    if (!form.name) return alert("Name is required");
    try {
      await api.post("/orders/create", {
        mode: "Take Away",
        customer_name: form.name,
        phone: form.phone,
        address: form.address
      });
      setShowForm(false);
      setForm({ name: "", phone: "", address: "" });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectItems = (order) => {
    setActiveOrder(order);
    setOrderMode("pos");
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5" style={{ backgroundColor: "#FAF5FF" }}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Orders", value: orders.length, color: "#9333EA" },
          { label: "Preparing", value: orders.filter(o => o.status === "pending" || o.status === "cooking").length, color: "#6D28D9" },
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
          const st = ORDER_STATUS[order.status] || { label: order.status, bg: "#E5E7EB", text: "#4B5563" };
          return (
            <div key={order._id} className="rounded-2xl p-4"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE9FE" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>{order.customer_name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-lg font-medium capitalize"
                      style={{ backgroundColor: st.bg, color: st.text }}>{st.label || order.status}</span>
                  </div>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>{order.phone} · Order {order._id.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#9333EA" }}>₹{order.total || 0}</p>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs" style={{ color: "#6B7280" }}>{order.items?.length || 0} items</span>
                <div className="flex flex-wrap gap-2">
                  {order.status === "new" && (
                    <button onClick={() => handleSelectItems(order)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: "#9333EA" }}>Select Items</button>
                  )}
                  {order.status === "pending" && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>Waiting for Kitchen</span>
                  )}
                  {order.status === "cooking" && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: "#DBEAFE", color: "#1E3A8A" }}>Kitchen is Preparing</span>
                  )}
                  {order.status === "ready" && (
                    <button onClick={() => updateStatus(order._id, "completed")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: "#2563EB" }}>Mark Completed</button>
                  )}
                  {order.status === "completed" && (
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
          <div className="rounded-2xl p-6 w-full max-w-md m-4" style={{ backgroundColor: "#FFFFFF" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-5" style={{ color: "#1A1A1A" }}>New Take Away Order</h3>
            <div className="flex flex-col gap-4 mb-5">
              {[
                { label: "Customer Name", key: "name", placeholder: "Enter customer name", type: "text" },
                { label: "Phone Number", key: "phone", placeholder: "Enter phone number", type: "tel" },
                { label: "Address (optional)", key: "address", placeholder: "Pickup address if needed", type: "text" },
              ].map(field => (
                <div key={field.key} className="relative">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>{field.label}</label>
                  <input type={field.type} value={form[field.key]} placeholder={field.placeholder}
                    onChange={e => {
                      if (field.key === "phone") handlePhoneChange(e.target.value);
                      else setForm(prev => ({ ...prev, [field.key]: e.target.value }));
                    }}
                    list={field.key === "phone" ? "phone-suggestions" : undefined}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" }}
                    onFocus={e => { e.target.style.borderColor = "#9333EA"; e.target.style.boxShadow = "0 0 0 3px rgba(147,51,234,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }} />
                  
                  {field.key === "phone" && (
                    <datalist id="phone-suggestions">
                      {Array.from(new Set(orders.filter(o => o.phone).map(o => o.phone))).map(phone => (
                        <option key={phone} value={phone} />
                      ))}
                    </datalist>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateOrder}
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

// ── Delivery Orders View ───────────────────────────────────────────────────
function DeliveryOrdersView({ setActiveOrder, setOrderMode }) {
  const [orders, setOrders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      const allOrders = res.data.orders || [];
      const deliveryOrders = allOrders.filter(o => o.mode === "Delivery");
      setOrders(deliveryOrders);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.post("/orders/update-status", { orderId: id, status });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhoneChange = (val) => {
    setForm(prev => ({ ...prev, phone: val }));
    const pastOrder = orders.find(o => o.phone === val && o.customer_name);
    if (pastOrder) {
      setForm(prev => ({
        ...prev,
        phone: val,
        name: prev.name || pastOrder.customer_name,
        address: prev.address || pastOrder.address || ""
      }));
    }
  };

  const handleCreateOrder = async () => {
    if (!form.name) return alert("Name is required");
    if (!form.address) return alert("Delivery Address is required");
    try {
      await api.post("/orders/create", {
        mode: "Delivery",
        customer_name: form.name,
        phone: form.phone,
        address: form.address
      });
      setShowForm(false);
      setForm({ name: "", phone: "", address: "" });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectItems = (order) => {
    setActiveOrder(order);
    setOrderMode("pos");
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5" style={{ backgroundColor: "#FAF5FF" }}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>Delivery Orders</h2>
          <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>Manage home delivery orders</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: "#9333EA", boxShadow: "0 4px 12px rgba(147,51,234,0.25)" }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#7E22CE"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#9333EA"; }}>
          <Icons.Plus /> New Order
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Deliveries", value: orders.length, color: "#9333EA" },
          { label: "Preparing", value: orders.filter(o => o.status === "pending" || o.status === "cooking").length, color: "#6D28D9" },
          { label: "Out for Delivery", value: orders.filter(o => o.status === "ready").length, color: "#065F46" },
        ].map((stat, i) => (
          <div key={i} className="rounded-2xl p-4 text-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE9FE" }}>
            <p className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {orders.map(order => {
          const st = ORDER_STATUS[order.status] || { label: order.status, bg: "#E5E7EB", text: "#4B5563" };
          return (
            <div key={order._id} className="rounded-2xl p-4"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #EDE9FE" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold" style={{ color: "#1A1A1A" }}>{order.customer_name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-lg font-medium capitalize"
                      style={{ backgroundColor: st.bg, color: st.text }}>{st.label || order.status}</span>
                  </div>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>{order.phone} · {order.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#9333EA" }}>₹{order.total || 0}</p>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs" style={{ color: "#6B7280" }}>{order.items?.length || 0} items</span>
                <div className="flex flex-wrap gap-2">
                  {order.status === "new" && (
                    <button onClick={() => handleSelectItems(order)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: "#9333EA" }}>Select Items</button>
                  )}
                  {order.status === "pending" && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>Waiting for Kitchen</span>
                  )}
                  {order.status === "cooking" && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: "#DBEAFE", color: "#1E3A8A" }}>Kitchen is Preparing</span>
                  )}
                  {order.status === "ready" && (
                    <button onClick={() => updateStatus(order._id, "completed")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: "#2563EB" }}>Mark Delivered</button>
                  )}
                  {order.status === "completed" && (
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ backgroundColor: "#E0F2FE", color: "#0369A1" }}>Completed</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setShowForm(false)}>
          <div className="rounded-2xl p-6 w-full max-w-md m-4" style={{ backgroundColor: "#FFFFFF" }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-5" style={{ color: "#1A1A1A" }}>New Delivery Order</h3>
            <div className="flex flex-col gap-4 mb-5">
              {[
                { label: "Customer Name", key: "name", placeholder: "Enter customer name", type: "text" },
                { label: "Phone Number", key: "phone", placeholder: "Enter phone number", type: "tel" },
                { label: "Delivery Address", key: "address", placeholder: "Enter full delivery address", type: "text" },
              ].map(field => (
                <div key={field.key} className="relative">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>{field.label}</label>
                  <input type={field.type} value={form[field.key]} placeholder={field.placeholder}
                    onChange={e => {
                      if (field.key === "phone") handlePhoneChange(e.target.value);
                      else setForm(prev => ({ ...prev, [field.key]: e.target.value }));
                    }}
                    list={field.key === "phone" ? "phone-suggestions" : undefined}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" }}
                    onFocus={e => { e.target.style.borderColor = "#9333EA"; e.target.style.boxShadow = "0 0 0 3px rgba(147,51,234,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }} />
                  
                  {field.key === "phone" && (
                    <datalist id="phone-suggestions">
                      {Array.from(new Set(orders.filter(o => o.phone).map(o => o.phone))).map(phone => (
                        <option key={phone} value={phone} />
                      ))}
                    </datalist>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateOrder}
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
  const [orderMode, setOrderMode] = useState("dinein"); // "dinein" | "takeaway" | "delivery"
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeTable, setActiveTable] = useState(null);

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top mode switcher */}
        <div className="flex items-center justify-end gap-2 md:gap-3 px-4 md:px-6 py-3 flex-shrink-0 overflow-x-auto whitespace-nowrap scrollbar-hide"
          style={{ backgroundColor: "#FAF5FF", borderBottom: "1px solid #EDE9FE" }}>
          {/* Dine In */}
          <button onClick={() => setOrderMode("dinein")}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all"
            style={{ backgroundColor: orderMode === "dinein" ? "#9333EA" : "#FFFFFF", color: orderMode === "dinein" ? "#FFFFFF" : "#4B5563", border: "1px solid", borderColor: orderMode === "dinein" ? "#9333EA" : "#E5E7EB" }}>
            <Icons.DineIn /> Dine In
          </button>
          {/* Take Away */}
          <button onClick={() => setOrderMode("takeaway")}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all"
            style={{ backgroundColor: orderMode === "takeaway" ? "#9333EA" : "#FFFFFF", color: orderMode === "takeaway" ? "#FFFFFF" : "#4B5563", border: "1px solid", borderColor: orderMode === "takeaway" ? "#9333EA" : "#E5E7EB" }}>
            <Icons.TakeAway /> Take Away
          </button>
          {/* Delivery */}
          <button onClick={() => setOrderMode("delivery")}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all"
            style={{ backgroundColor: orderMode === "delivery" ? "#9333EA" : "#FFFFFF", color: orderMode === "delivery" ? "#FFFFFF" : "#4B5563", border: "1px solid", borderColor: orderMode === "delivery" ? "#9333EA" : "#E5E7EB" }}>
            <Icons.Truck /> Delivery
          </button>
        </div>

        {/* View content */}
        <div className="flex-1 flex overflow-hidden">
          {orderMode === "pos" && <POSView activeOrder={activeOrder} setActiveOrder={setActiveOrder} activeTable={activeTable} setActiveTable={setActiveTable} setOrderMode={setOrderMode} />}
          {orderMode === "dinein" && <DineInView setActiveOrder={setActiveOrder} setActiveTable={setActiveTable} setOrderMode={setOrderMode} />}
          {orderMode === "takeaway" && <TakeAwayView setActiveOrder={setActiveOrder} setOrderMode={setOrderMode} />}
          {orderMode === "delivery" && <DeliveryOrdersView setActiveOrder={setActiveOrder} setOrderMode={setOrderMode} />}
        </div>
      </div>
    </div>
  );
}