import { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

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
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ChevronLeft: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Plus: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Grid: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  DotsV: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Rename: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Filter: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
};

// ── Nav items ──────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "pos", label: "POS", Icon: Icons.Home },
  { id: "menu", label: "Menu", Icon: Icons.Menu },
  { id: "orders", label: "Orders", Icon: Icons.Orders },
  { id: "inventory", label: "Inventory", Icon: Icons.Inventory },
  { id: "reports", label: "Reports", Icon: Icons.Reports },
  { id: "settings", label: "Settings", Icon: Icons.Settings },
  { id: "kitchen", label: "Kitchen", Icon: Icons.Kitchen },
];

const CATEGORY_OPTIONS = ["Breakfast", "Soups", "Pasta", "Burger", "Main Course", "Beverages", "Desserts", "Salads"];
const STATUS_OPTIONS = ["In Stock", "Out of Stock", "Coming Soon"];

// ── Initial menu data ──────────────────────────────────────────────────────
const INITIAL_ITEMS = [
  { id: 1, name: "Tasty Vegetable Salad", category: "Salads", price: 399, prepTime: 10, status: "In Stock", description: "Fresh seasonal vegetables tossed with herbs.", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80" },
  { id: 2, name: "Original Cheeseburger", category: "Burger", price: 189, prepTime: 15, status: "In Stock", description: "Juicy beef patty with melted cheese.", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
  { id: 3, name: "Taco Salvo With Cheese", category: "Main Course", price: 299, prepTime: 12, status: "In Stock", description: "Crispy tacos loaded with seasoned meat and cheese.", img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80" },
  { id: 4, name: "Creamy Mushroom Soup", category: "Soups", price: 179, prepTime: 8, status: "In Stock", description: "Rich and creamy soup with fresh mushrooms.", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80" },
  { id: 5, name: "Veg Momos", category: "Breakfast", price: 139, prepTime: 20, status: "In Stock", description: "Steamed dumplings filled with spiced vegetables.", img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&q=80" },
  { id: 6, name: "Spicy Beef Burger", category: "Burger", price: 199, prepTime: 15, status: "In Stock", description: "Bold and spicy beef burger with jalapeños.", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80" },
  { id: 7, name: "Fresh Orange Juice", category: "Beverages", price: 129, prepTime: 5, status: "In Stock", description: "Freshly squeezed orange juice.", img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80" },
  { id: 8, name: "Creamy Pasta", category: "Pasta", price: 169, prepTime: 18, status: "In Stock", description: "Al dente pasta in a rich cream sauce.", img: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=500&q=80" },
];

// ── Input style helper ────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
const inputStyle = { border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" };
const focusInput = e => { e.target.style.borderColor = "#9333EA"; e.target.style.boxShadow = "0 0 0 3px rgba(147,51,234,0.1)"; };
const blurInput = e => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; };

// ── Categories Modal ───────────────────────────────────────────────────────
function CategoriesModal({ onClose }) {
  const [cats, setCats] = useState(CATEGORY_OPTIONS.map((c, i) => ({ id: i + 1, name: c, count: INITIAL_ITEMS.filter(it => it.category === c).length })));
  const [newCat, setNewCat] = useState("");
  const [renaming, setRenaming] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  const addCat = () => {
    if (!newCat.trim()) return;
    setCats(prev => [...prev, { id: Date.now(), name: newCat.trim(), count: 0 }]);
    setNewCat("");
  };

  const deleteCat = id => setCats(prev => prev.filter(c => c.id !== id));
  const startRename = c => { setRenaming(c.id); setRenameVal(c.name); };
  const confirmRename = id => {
    if (renameVal.trim()) setCats(prev => prev.map(c => c.id === id ? { ...c, name: renameVal.trim() } : c));
    setRenaming(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#1A1A1A" }}>Categories</h2>
            <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>Manage your menu categories</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#6B7280" }}><Icons.Close /></button>
        </div>

        {/* Add new category */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
            <input value={newCat} onChange={e => setNewCat(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addCat()}
              placeholder="New category name..."
              className={inputCls + " flex-1"} style={inputStyle}
              onFocus={focusInput} onBlur={blurInput} />
            <button onClick={addCat}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-all"
              style={{ backgroundColor: "#9333EA" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#7E22CE"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#9333EA"; }}>
              <Icons.Plus /> Add
            </button>
          </div>
        </div>

        {/* List */}
        <div className="px-6 pb-6 max-h-72 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          <div className="flex flex-col gap-2">
            {cats.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ backgroundColor: "#FAF5FF", border: "1px solid #EDE9FE" }}>
                {renaming === cat.id ? (
                  <input autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") confirmRename(cat.id); if (e.key === "Escape") setRenaming(null); }}
                    onBlur={() => confirmRename(cat.id)}
                    className="flex-1 text-sm outline-none bg-transparent font-medium" style={{ color: "#1A1A1A" }} />
                ) : (
                  <span className="flex-1 text-sm font-medium" style={{ color: "#1A1A1A" }}>{cat.name}</span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-lg" style={{ backgroundColor: "#EDE9FE", color: "#7E22CE" }}>{cat.count} items</span>
                <button onClick={() => startRename(cat)} className="p-1 rounded-lg hover:bg-purple-100 transition-colors" style={{ color: "#9333EA" }} title="Rename"><Icons.Rename /></button>
                <button onClick={() => deleteCat(cat.id)} className="p-1 rounded-lg hover:bg-red-50 transition-colors" style={{ color: "#EF4444" }} title="Delete"><Icons.Trash /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Add / Edit Item Modal ──────────────────────────────────────────────────
function ItemModal({ item, onClose, onSave }) {
  const isEdit = !!item;
  const [form, setForm] = useState({
    name: item?.name || "",
    category: item?.category || "",
    price: item?.price || "",
    prepTime: item?.prepTime || "",
    status: item?.status || "In Stock",
    description: item?.description || "",
    img: item?.img || "",
  });

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return;
    onSave({ ...form, price: Number(form.price), prepTime: Number(form.prepTime) });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#1A1A1A" }}>{isEdit ? "Edit Item" : "Add New item"}</h2>
            <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>Fill in the details for your {isEdit ? "" : "new "}menu items</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: "#6B7280" }}><Icons.Close /></button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>Item Name</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="e.g. Truffle Mushroom Burger"
              className={inputCls} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>
              Item Image <span className="font-normal" style={{ color: "#9CA3AF" }}>(Optional — paste URL or leave for placeholder)</span>
            </label>
            <input value={form.img} onChange={e => set("img", e.target.value)}
              placeholder="https://... or leave blank"
              className={inputCls} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            {/* Preview */}
            <div className="mt-2 w-full h-28 rounded-xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#F3F4F6", border: "1.5px dashed #E5E7EB" }}>
              {form.img ? (
                <img src={form.img} alt={form.name || "Item preview"} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1" style={{ color: "#9CA3AF" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span className="text-xs">Image preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Category + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>Category</label>
              <div className="relative">
                <select value={form.category} onChange={e => set("category", e.target.value)}
                  className={inputCls + " appearance-none pr-8"} style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}>
                  <option value="">Select...</option>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }}><Icons.ChevronDown /></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "#6B7280" }}>₹</span>
                <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                  placeholder="0.00" className={inputCls + " pl-7"} style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput} />
              </div>
            </div>
          </div>

          {/* Prep Time + Available Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>Preparation Time</label>
              <div className="flex gap-2 items-center">
                <input type="number" value={form.prepTime} onChange={e => set("prepTime", e.target.value)}
                  placeholder="e.g. 15" className={inputCls + " flex-1"} style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput} />
                <span className="text-sm font-medium flex-shrink-0" style={{ color: "#6B7280" }}>Min</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>Available Status</label>
              <div className="relative">
                <select value={form.status} onChange={e => set("status", e.target.value)}
                  className={inputCls + " appearance-none pr-8"} style={inputStyle}
                  onFocus={focusInput} onBlur={blurInput}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9CA3AF" }}><Icons.ChevronDown /></div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "#1A1A1A" }}>
              Short Description <span className="font-normal" style={{ color: "#9CA3AF" }}>(Optional)</span>
            </label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={3} placeholder="Brief description of the item..."
              className={inputCls + " resize-none"} style={inputStyle}
              onFocus={focusInput} onBlur={blurInput} />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-1">
            <button onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ color: "#4B5563", backgroundColor: "#F3F4F6" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E5E7EB"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#F3F4F6"; }}>
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: "#9333EA", boxShadow: "0 4px 14px rgba(147,51,234,0.3)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#7E22CE"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#9333EA"; }}>
              <Icons.Plus /> {isEdit ? "Save Changes" : "Create Item"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────
function DeleteModal({ item, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#FEE2E2" }}>
          <Icons.Trash />
        </div>
        <h2 className="text-lg font-bold text-center mb-1" style={{ color: "#1A1A1A" }}>Delete Item</h2>
        <p className="text-sm text-center mb-6" style={{ color: "#6B7280" }}>
          Are you sure you want to delete <strong>"{item.name}"</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ backgroundColor: "#F3F4F6", color: "#4B5563" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#E5E7EB"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#F3F4F6"; }}>
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ backgroundColor: "#EF4444" }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#DC2626"; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#EF4444"; }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Rename Modal ───────────────────────────────────────────────────────────
function RenameModal({ item, onClose, onSave }) {
  const [name, setName] = useState(item.name);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4" style={{ color: "#1A1A1A" }}>Rename Item</h2>
        <input autoFocus value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && name.trim()) { onSave(name.trim()); onClose(); } }}
          placeholder="Item name" className={inputCls + " mb-4"} style={inputStyle}
          onFocus={focusInput} onBlur={blurInput} />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ backgroundColor: "#F3F4F6", color: "#4B5563" }}>Cancel</button>
          <button onClick={() => { if (name.trim()) { onSave(name.trim()); onClose(); } }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: "#9333EA" }}>Rename</button>
        </div>
      </div>
    </div>
  );
}

// ── Dot Menu ───────────────────────────────────────────────────────────────
function DotMenu({ item, onEdit, onRename, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        style={{ backgroundColor: "#FFFFFF", color: "#1A1A1A", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}>
        <Icons.DotsV />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 rounded-xl overflow-hidden"
          style={{ backgroundColor: "#FFFFFF", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", border: "1px solid #F0E9FF", minWidth: 140 }}>
          {[
            { label: "Edit", Icon: Icons.Edit, action: onEdit, color: "#1A1A1A" },
            { label: "Rename", Icon: Icons.Rename, action: onRename, color: "#1A1A1A" },
            { label: "Delete", Icon: Icons.Trash, action: onDelete, color: "#EF4444" },
          ].map(({ label, Icon, action, color }) => (
            <button key={label} onClick={e => { e.stopPropagation(); setOpen(false); action(); }}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium w-full text-left transition-colors"
              style={{ color }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = label === "Delete" ? "#FEF2F2" : "#FAF5FF"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
              <Icon /> {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ activeNav, setActiveNav, user, onLogout }) {
  return (
    <aside className="flex flex-col justify-between py-5 px-3 flex-shrink-0"
      style={{ width: 220, backgroundColor: "#FFFFFF", borderRight: "1px solid #F0E9FF" }}>
      <div>
        <div className="flex items-center gap-2 px-2 mb-7">
          <img src={logo} alt="BILLBITE" className="h-8 w-auto object-contain" />
          <span className="text-base font-bold tracking-tight" style={{ color: "#1A1A1A" }}>BILLBITE</span>
          <button className="ml-auto opacity-40 hover:opacity-70"><Icons.ChevronLeft /></button>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const active = activeNav === id;
            return (
              <button key={id} onClick={() => setActiveNav(id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-left transition-all"
                style={{ backgroundColor: active ? "#F3E8FF" : "transparent", color: active ? "#9333EA" : "#4B5563" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "#FAF5FF"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = active ? "#F3E8FF" : "transparent"; }}>
                <Icon />{label}
              </button>
            );
          })}
        </nav>
      </div>
      <div>
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: "#9333EA" }}>{user.initials}</div>
          <span className="text-sm font-semibold truncate" style={{ color: "#1A1A1A" }}>{user.name}</span>
        </div>
        <button onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all"
          style={{ color: "#EF4444" }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FEF2F2"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
          <Icons.Logout /> Log Out
        </button>
      </div>
    </aside>
  );
}

// ── Main Menu Page ─────────────────────────────────────────────────────────
export default function MenuPage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("menu");
  const [user] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      const name = u.name || u.username || "Divya Goswami";
      const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      return { name, initials };
    } catch { return { name: "Divya Goswami", initials: "DG" }; }
  });

  const [items, setItems] = useState(INITIAL_ITEMS);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showCatModal, setShowCatModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [renameItem, setRenameItem] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handler = e => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSaveItem = (form) => {
    if (editItem) {
      setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...form } : i));
      setEditItem(null);
    } else {
      setItems(prev => [...prev, { ...form, id: Date.now() }]);
    }
  };

  const handleDelete = () => {
    setItems(prev => prev.filter(i => i.id !== deleteItem.id));
    setDeleteItem(null);
  };

  const handleRename = (name) => {
    setItems(prev => prev.map(i => i.id === renameItem.id ? { ...i, name } : i));
    setRenameItem(null);
  };

  const allCats = ["All", ...Array.from(new Set(items.map(i => i.category)))];

  const filtered = items.filter(i => {
    const matchCat = filterCat === "All" || i.category === filterCat;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} user={user} onLogout={handleLogout} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: "#FAF5FF" }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1A1A1A" }}>Menu Management</h1>
            <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>Manage your categories and items</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowCatModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ backgroundColor: "#FFFFFF", color: "#4B5563", border: "1px solid #E5E7EB" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FAF5FF"; e.currentTarget.style.borderColor = "#DDD6FE"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#FFFFFF"; e.currentTarget.style.borderColor = "#E5E7EB"; }}>
              <Icons.Grid /> Categories
            </button>
            <button onClick={() => { setEditItem(null); setShowAddModal(true); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: "#9333EA", boxShadow: "0 4px 14px rgba(147,51,234,0.3)" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#7E22CE"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#9333EA"; }}>
              <Icons.Plus /> Add New Items
            </button>
          </div>
        </div>

        {/* Search + Filter bar */}
        <div className="flex items-center gap-3 px-6 pb-5 flex-shrink-0">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ backgroundColor: "#FFFFFF", border: "1.5px solid #EDE9FE" }}>
            <Icons.Search />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search menu items"
              className="flex-1 text-sm outline-none bg-transparent" style={{ color: "#1A1A1A" }} />
          </div>

          {/* Category filter dropdown */}
          <div ref={filterRef} className="relative flex items-center gap-2">
            <Icons.Filter />
            <button onClick={() => setFilterOpen(o => !o)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", color: "#4B5563", minWidth: 100 }}>
              {filterCat}
              <Icons.ChevronDown />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1 z-20 rounded-xl overflow-hidden"
                style={{ backgroundColor: "#FFFFFF", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #F0E9FF", minWidth: 160 }}>
                {allCats.map(c => (
                  <button key={c} onClick={() => { setFilterCat(c); setFilterOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-left transition-colors"
                    style={{ color: filterCat === c ? "#9333EA" : "#4B5563", fontWeight: filterCat === c ? 600 : 400 }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#FAF5FF"; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}>
                    {c}
                    {filterCat === c && <span className="ml-auto text-purple-500">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ scrollbarWidth: "thin" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3" style={{ color: "#9CA3AF" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <p className="text-base font-medium">No items found</p>
              <p className="text-sm">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              {filtered.map(item => (
                <div key={item.id} className="rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: "#FFFFFF", border: "1px solid #F0E9FF", boxShadow: "0 1px 4px rgba(147,51,234,0.06)" }}>
                  {/* Image area */}
                  <div className="relative" style={{ height: 180 }}>
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Status badge */}
                    {item.status !== "In Stock" && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg text-xs font-semibold"
                        style={{ backgroundColor: item.status === "Out of Stock" ? "#FEE2E2" : "#FEF3C7", color: item.status === "Out of Stock" ? "#991B1B" : "#92400E" }}>
                        {item.status}
                      </div>
                    )}
                    {/* 3-dot menu */}
                    <div className="absolute top-2 right-2">
                      <DotMenu
                        item={item}
                        onEdit={() => { setEditItem(item); setShowAddModal(true); }}
                        onRename={() => setRenameItem(item)}
                        onDelete={() => setDeleteItem(item)}
                      />
                    </div>
                  </div>
                  {/* Card body */}
                  <div className="p-3">
                    <p className="text-xs mb-1" style={{ color: "#9CA3AF" }}>{item.category}</p>
                    <p className="text-sm font-semibold leading-tight mb-1" style={{ color: "#1A1A1A" }}>{item.name}</p>
                    <p className="text-sm font-bold" style={{ color: "#9333EA" }}>₹{item.price}</p>
                    {item.description && (
                      <p className="text-xs mt-1 line-clamp-1" style={{ color: "#9CA3AF" }}>{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCatModal && <CategoriesModal onClose={() => setShowCatModal(false)} />}
      {showAddModal && (
        <ItemModal
          item={editItem}
          onClose={() => { setShowAddModal(false); setEditItem(null); }}
          onSave={handleSaveItem}
        />
      )}
      {deleteItem && <DeleteModal item={deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} />}
      {renameItem && <RenameModal item={renameItem} onClose={() => setRenameItem(null)} onSave={handleRename} />}
    </div>
  );
}