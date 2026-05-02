import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";

// ── Icons ──────────────────────────────────────────────────────────────────
const Icons = {
  Grid: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>,
  Plus: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
  DotsV: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Rename: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>,
  Trash: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>,
  Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Filter: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>,
  Image: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>,
};

const CATEGORY_OPTIONS = ["Breakfast", "Soups", "Pasta", "Burger", "Main Course", "Beverages", "Desserts", "Salads"];
const STATUS_OPTIONS = ["In Stock", "Out of Stock", "Coming Soon"];



const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all";
const inputStyle = { border: "1.5px solid #E5E7EB", backgroundColor: "#FAFAFA", color: "#1A1A1A" };
const focusInput = e => { e.target.style.borderColor = "#9333EA"; e.target.style.boxShadow = "0 0 0 3px rgba(147,51,234,0.1)"; };
const blurInput = e => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; };

// ── Item Modal (Add/Edit) ──────────────────────────────────────────────────
function ItemModal({ item, onClose, onSave, categories }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b flex-shrink-0" style={{ borderColor: "#F3F4F6" }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#1A1A1A" }}>{isEdit ? "Edit Item" : "Add New Item"}</h2>
            <p className="text-sm mt-0.5" style={{ color: "#9CA3AF" }}>Fill in the details for your menu item</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
            <Icons.Close />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="px-6 py-4 flex-1 overflow-y-auto flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Item Name</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="e.g. Truffle Mushroom Burger"
              className={inputCls} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Image URL <span className="font-normal text-gray-400">(Optional)</span></label>
            <input value={form.img} onChange={e => set("img", e.target.value)}
              placeholder="https://..."
              className={inputCls} style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
            <div className="mt-2 w-full h-32 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50">
              {form.img ? (
                <img src={form.img} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-gray-400">
                  <Icons.Image />
                  <span className="text-[10px]">Preview Area</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Category</label>
              <div className="relative">
                <select value={form.category} onChange={e => set("category", e.target.value)}
                  className={inputCls + " appearance-none"} style={inputStyle}>
                  <option value="">Select...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"><Icons.ChevronDown /></div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input type="number" value={form.price} onChange={e => set("price", e.target.value)}
                  className={inputCls + " pl-7"} style={inputStyle} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Prep Time (Min)</label>
              <input type="number" value={form.prepTime} onChange={e => set("prepTime", e.target.value)}
                className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className={inputCls} style={inputStyle}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              rows={3} className={inputCls + " resize-none"} style={inputStyle} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3 flex-shrink-0 bg-white">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600">
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-purple-600 shadow-lg shadow-purple-200">
            <Icons.Plus /> {isEdit ? "Save Changes" : "Create Item"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryModal({ categories, onClose, onAdd, onDelete }) {
  const [newCat, setNewCat] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: "#F3F4F6" }}>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Manage Categories</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <Icons.Close />
          </button>
        </div>

        <div className="p-5 border-b flex gap-2 bg-gray-50 flex-shrink-0">
          <input
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            placeholder="New Category Name..."
            className="flex-1 px-3 py-2 text-sm rounded-xl outline-none"
            style={{ border: "1.5px solid #E5E7EB" }}
            onKeyDown={e => {
              if (e.key === "Enter" && newCat.trim()) {
                onAdd(newCat.trim());
                setNewCat("");
              }
            }}
          />
          <button
            onClick={() => {
              if (newCat.trim()) {
                onAdd(newCat.trim());
                setNewCat("");
              }
            }}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-200"
          >
            Add
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2">
          {categories.map(c => {
            const isPredefined = CATEGORY_OPTIONS.includes(c);
            return (
              <div key={c} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-white">
                <span className="text-sm font-semibold text-gray-700">{c}</span>
                {isPredefined ? (
                  <span className="text-xs text-gray-400 px-2 font-medium">Default</span>
                ) : (
                  <button onClick={() => onDelete(c)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors">
                    <Icons.Trash />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function MenuPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [categories, setCategories] = useState(CATEGORY_OPTIONS);

  const handleAddCategory = (name) => {
    const cleanName = name.trim();
    if (categories.includes(cleanName)) return alert("Category already exists!");
    const updated = [...categories, cleanName];
    setCategories(updated);
    
    const saved = JSON.parse(localStorage.getItem("custom_categories") || "[]");
    if (!saved.includes(cleanName)) {
      localStorage.setItem("custom_categories", JSON.stringify([...saved, cleanName]));
    }
  };

  const handleDeleteCategory = (name) => {
    const cleanName = name.trim();
    if (CATEGORY_OPTIONS.includes(cleanName)) return alert("Cannot delete predefined categories!");
    if (!window.confirm(`Are you sure you want to delete the "${cleanName}" category?`)) return;
    
    const updated = categories.filter(c => c !== cleanName);
    setCategories(updated);
    
    const saved = JSON.parse(localStorage.getItem("custom_categories") || "[]");
    localStorage.setItem("custom_categories", JSON.stringify(saved.filter(c => c !== cleanName)));
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setItems(data.map(p => ({
        ...p,
        id: p._id
      })));
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("custom_categories") || "[]");
      if (saved && saved.length > 0) {
        const merged = Array.from(new Set([...CATEGORY_OPTIONS, ...saved]));
        setCategories(merged);
      }
    } catch (e) {}
    fetchProducts();
  }, []);

  const handleSaveItem = async (form) => {
    try {
      if (editItem) {
        const res = await api.put(`/products/${editItem._id || editItem.id}`, form);
        const updated = res.data.data || res.data;
        setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...updated, id: updated._id } : i));
      } else {
        const res = await api.post("/products", form);
        const created = res.data.data || res.data;
        setItems(prev => [...prev, { ...created, id: created._id }]);
      }
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await api.delete(`/products/${id}`);
        setItems(prev => prev.filter(i => i.id !== id));
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Failed to delete product.");
      }
    }
  };

  const filtered = items.filter(i => {
    const matchCat = filterCat === "All" || i.category === filterCat;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex h-screen bg-[#FAF5FF] overflow-hidden font-inter">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header Section */}
        <header className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-sm text-gray-400">Total {items.length} items found</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="px-4 py-2.5 bg-white text-purple-600 rounded-xl text-sm font-semibold border border-purple-100 shadow-sm"
            >
              Manage Categories
            </button>
            <button
              onClick={() => { setEditItem(null); setShowAddModal(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold"
            >
              <Icons.Plus /> Add New Item
            </button>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="px-6 pb-4 flex gap-3 flex-shrink-0">
          <div className="flex-1 flex items-center gap-2 bg-white border border-purple-100 px-4 py-2 rounded-xl">
            <Icons.Search />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
          <select
            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm outline-none"
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Items Grid */}
        <main className="flex-1 overflow-y-auto px-6 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(item => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-purple-50 group hover:shadow-xl transition-all">
                <div className="h-40 relative">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => { setEditItem(item); setShowAddModal(true); }}
                      className="p-2 bg-white/90 rounded-lg shadow-sm text-purple-600 hover:bg-white"
                      title="Edit Item"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 bg-white/90 rounded-lg shadow-sm text-red-500 hover:bg-white"
                      title="Delete Item"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[10px] uppercase tracking-wider text-purple-500 font-bold">{item.category}</span>
                  <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-purple-700">₹{item.price}</span>
                    <span className="text-xs text-gray-400">{item.prepTime} mins</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <Icons.Search />
              <p className="mt-2">No items found matching your search.</p>
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <ItemModal
          item={editItem}
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveItem}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          categories={categories}
          onClose={() => setShowCategoryModal(false)}
          onAdd={handleAddCategory}
          onDelete={handleDeleteCategory}
        />
      )}
    </div>
  );
}