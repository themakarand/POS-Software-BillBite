import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const BASE = "http://localhost:5000/api";
const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const STOCK_KEY = "inv_stock";
const loadStock = () => { try { return JSON.parse(localStorage.getItem(STOCK_KEY) || "{}"); } catch { return {}; } };
const saveStock = (s) => localStorage.setItem(STOCK_KEY, JSON.stringify(s));



function stockStatus(qty) {
  if (qty <= 0) return "Out of Stock";
  if (qty <= 15) return "Low Stock";
  return "In Stock";
}
function statusColor(s) {
  if (s === "In Stock") return "#16a34a";
  if (s === "Low Stock") return "#f97316";
  return "#ef4444";
}

function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#fff",borderRadius:16,padding:28,width:420,maxWidth:"92vw",boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
          <span style={{ fontWeight:700,fontSize:17,color:"#111" }}>{title}</span>
          <button onClick={onClose} style={{ background:"#f3f4f6",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:16,color:"#6b7280" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState(loadStock());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [adjustItem, setAdjustItem] = useState(null);
  const [adjustQty, setAdjustQty] = useState("");
  const [form, setForm] = useState({ name:"", price:"", category:"", qty:"" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/products`, authH());
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
      const st = loadStock();
      const updated = { ...st };
      data.forEach(p => { if (updated[p._id] === undefined) updated[p._id] = 30; });
      setStock(updated);
      saveStock(updated);
    } catch {
      setProducts([]);
    } finally { setLoading(false); }
  };

  const withStock = useMemo(() =>
    products.map(p => ({ ...p, qty: stock[p._id] ?? 30, status: stockStatus(stock[p._id] ?? 30) }))
  , [products, stock]);

  const filtered = useMemo(() => {
    let list = withStock;
    if (filter !== "All") list = list.filter(p => p.status === filter);
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)); }
    return list;
  }, [withStock, filter, search]);

  const stats = useMemo(() => ({
    total: withStock.length,
    low: withStock.filter(p => p.status === "Low Stock").length,
    out: withStock.filter(p => p.status === "Out of Stock").length,
  }), [withStock]);

  const updateStock = (id, qty) => {
    const updated = { ...stock, [id]: qty };
    setStock(updated);
    saveStock(updated);
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try { await axios.delete(`${BASE}/products/${p._id}`, authH()); } catch {}
    setProducts(prev => prev.filter(x => x._id !== p._id));
    const st = { ...stock };
    delete st[p._id];
    setStock(st);
    saveStock(st);
  };

  const handleSaveAdd = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      const res = await axios.post(`${BASE}/products`, { name:form.name, price:Number(form.price), category:form.category }, authH());
      const newP = res.data;
      setProducts(prev => [...prev, newP]);
      const updated = { ...stock, [newP._id]: Number(form.qty) || 30 };
      setStock(updated);
      saveStock(updated);
    } catch {
      const fake = { _id:"l"+Date.now(), name:form.name, price:Number(form.price), category:form.category };
      setProducts(prev => [...prev, fake]);
      const updated = { ...stock, [fake._id]: Number(form.qty) || 30 };
      setStock(updated);
      saveStock(updated);
    }
    setSaving(false);
    setAddModal(false);
    setForm({ name:"", price:"", category:"", qty:"" });
  };

  const handleSaveEdit = async () => {
    if (!editItem || !form.name || !form.price) return;
    setSaving(true);
    try { await axios.put(`${BASE}/products/${editItem._id}`, { name:form.name, price:Number(form.price), category:form.category }, authH()); } catch {}
    setProducts(prev => prev.map(p => p._id === editItem._id ? { ...p, name:form.name, price:Number(form.price), category:form.category } : p));
    if (form.qty !== "") updateStock(editItem._id, Number(form.qty));
    setSaving(false);
    setEditItem(null);
  };

  const handleAdjust = () => {
    if (!adjustItem || adjustQty === "") return;
    updateStock(adjustItem._id, Math.max(0, Number(adjustQty)));
    setAdjustItem(null);
    setAdjustQty("");
  };

  const exportCSV = () => {
    const rows = [["Product","Price","Stock","Status","Category"], ...filtered.map(p=>[p.name,p.price,p.qty,p.status,p.category||""])];
    const csv = rows.map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"),{ href:URL.createObjectURL(new Blob([csv],{type:"text/csv"})), download:`inventory_${Date.now()}.csv` });
    a.click();
  };

  const FILTERS = ["All","In Stock","Low Stock","Out of Stock"];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'DM Sans',sans-serif" }}>
      <Sidebar />
      <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .inv{flex:1;overflow-y:auto;background:#fdf4ff;padding:32px 36px;min-height:100vh;font-family:'DM Sans',sans-serif;box-sizing:border-box;}
        .inv *{box-sizing:border-box;font-family:'DM Sans',sans-serif;}
        .inv-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap;gap:12px;}
        .inv-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:28px;}
        @media(max-width:700px){.inv-stats{grid-template-columns:1fr 1fr;}.inv{padding:16px;}}
        @media(max-width:480px){.inv-stats{grid-template-columns:1fr;}}
        .inv-card{background:#fff;border:1px solid #ede9f6;border-radius:14px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;}
        .inv-card-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
        .inv-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:20px;flex-wrap:wrap;}
        .inv-search{flex:1;min-width:180px;display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:10px 16px;}
        .inv-search input{flex:1;border:none;outline:none;font-size:14px;color:#374151;background:none;}
        .inv-filter-btns{display:flex;gap:6px;flex-wrap:wrap;}
        .inv-fb{padding:8px 18px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;font-size:13.5px;font-weight:500;color:#374151;cursor:pointer;transition:all .15s;}
        .inv-fb:hover{border-color:#9333ea;color:#9333ea;}
        .inv-fb.act{background:#9333ea;color:#fff;border-color:#9333ea;}
        .inv-btn-purple{display:flex;align-items:center;gap:7px;padding:10px 20px;border-radius:10px;background:#9333ea;color:#fff;border:none;cursor:pointer;font-size:14px;font-weight:600;white-space:nowrap;transition:background .12s;}
        .inv-btn-purple:hover{background:#7c3aed;}
        .inv-btn-outline{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:10px;background:#fff;color:#374151;border:1px solid #e5e7eb;cursor:pointer;font-size:14px;font-weight:500;white-space:nowrap;transition:all .12s;}
        .inv-btn-outline:hover{border-color:#9333ea;color:#9333ea;}
        .inv-table-wrap{background:#fff;border-radius:14px;overflow-x:auto;border:1px solid #ede9f6;}
        .inv-tbl{width:100%;border-collapse:collapse;min-width:600px;}
        .inv-tbl thead tr{background:#f9fafb;}
        .inv-tbl thead th{padding:14px 20px;text-align:left;font-size:13px;font-weight:600;color:#6b7280;white-space:nowrap;border-bottom:1px solid #f0edf8;}
        .inv-tbl tbody tr{border-bottom:1px solid #faf5ff;transition:background .1s;}
        .inv-tbl tbody tr:hover{background:#fdf9ff;}
        .inv-tbl tbody tr:last-child{border-bottom:none;}
        .inv-tbl td{padding:16px 20px;font-size:14px;color:#374151;vertical-align:middle;}
        .inv-action-btn{width:34px;height:34px;border-radius:8px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:opacity .15s;}
        .inv-action-btn:hover{opacity:.8;}
        .inv-adj-link{color:#6b7280;font-size:13px;font-weight:500;cursor:pointer;text-decoration:underline;text-decoration-color:transparent;transition:all .15s;}
        .inv-adj-link:hover{color:#9333ea;text-decoration-color:#9333ea;}
        .inv-input{width:100%;padding:10px 14px;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;color:#374151;outline:none;margin-bottom:12px;transition:border-color .15s;}
        .inv-input:focus{border-color:#9333ea;}
        .inv-empty{padding:60px;text-align:center;color:#9ca3af;font-size:14px;}
        @media(max-width:800px){/* .inv-tbl th:nth-child(4),.inv-tbl td:nth-child(4){display:none;} */}
        @media(max-width:600px){/* .inv-tbl th:nth-child(2),.inv-tbl td:nth-child(2){display:none;} */}
      `}</style>

      <div className="inv">
        {/* Header */}
        <div className="inv-header pl-12 md:pl-0">
          <div>
            <h1 style={{ fontSize:26,fontWeight:700,color:"#111",margin:0,marginBottom:4 }}>Inventory Management</h1>
            <p style={{ fontSize:14,color:"#9ca3af",margin:0 }}>Track and update product stock levels</p>
          </div>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            <button className="inv-btn-outline" onClick={exportCSV}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Export Report
            </button>
            <button className="inv-btn-purple" onClick={() => { setForm({ name:"",price:"",category:"",qty:"" }); setAddModal(true); }}>
              + Add New Item
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="inv-stats">
          <div className="inv-card">
            <div>
              <div style={{ fontSize:13,color:"#9ca3af",marginBottom:6 }}>Total Products</div>
              <div style={{ fontSize:30,fontWeight:700,color:"#111" }}>{stats.total}</div>
              <div style={{ fontSize:12,color:"#9ca3af",marginTop:6 }}>12% from last month</div>
            </div>
            <div className="inv-card-icon" style={{ background:"#e0f2fe" }}>📦</div>
          </div>
          <div className="inv-card">
            <div>
              <div style={{ fontSize:13,color:"#9ca3af",marginBottom:6 }}>Low Stock</div>
              <div style={{ fontSize:30,fontWeight:700,color:"#111" }}>{stats.low}</div>
              <div style={{ fontSize:12,color:"#9ca3af",marginTop:6 }}>Needs more attention</div>
            </div>
            <div className="inv-card-icon" style={{ background:"#fff7ed" }}>⚠️</div>
          </div>
          <div className="inv-card">
            <div>
              <div style={{ fontSize:13,color:"#9ca3af",marginBottom:6 }}>Out Of Stock</div>
              <div style={{ fontSize:30,fontWeight:700,color:"#111" }}>{stats.out}</div>
              <div style={{ fontSize:12,color:"#9ca3af",marginTop:6 }}>{stats.out === 0 ? "No items currently" : "Needs restocking"}</div>
            </div>
            <div className="inv-card-icon" style={{ background:"#fef2f2" }}>❌</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="inv-toolbar">
          <div className="inv-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search transactions..." value={search} onChange={e=>setSearch(e.target.value)} />
            {search && <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",cursor:"pointer",color:"#aaa",padding:0,fontSize:16 }}>✕</button>}
          </div>
          <div className="inv-filter-btns">
            {FILTERS.map(f => (
              <button key={f} className={`inv-fb ${filter===f?"act":""}`} onClick={()=>setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="inv-table-wrap">
          {loading ? (
            <div className="inv-empty">Loading inventory…</div>
          ) : filtered.length === 0 ? (
            <div className="inv-empty">No products found.</div>
          ) : (
            <table className="inv-tbl">
              <thead>
                <tr>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Updated Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight:500,color:"#111" }}>{p.name}</div>
                      {p.category && <div style={{ fontSize:12,color:"#9ca3af",marginTop:2 }}>{p.category}</div>}
                    </td>
                    <td style={{ color:"#9333ea",fontWeight:600 }}>₹{p.price?.toLocaleString()}</td>
                    <td>
                      <span style={{ fontWeight:500 }}>{p.qty}</span>
                      <span style={{ fontSize:11,color:"#9ca3af",marginLeft:4 }}>pcs</span>
                    </td>
                    <td>
                      <span style={{ color:statusColor(p.status),fontWeight:500 }}>{p.status}</span>
                    </td>
                    <td>
                      <span className="inv-adj-link" onClick={()=>{ setAdjustItem(p); setAdjustQty(String(p.qty)); }}>
                        Adjust Stock
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex",gap:6 }}>
                        <button className="inv-action-btn" style={{ background:"#f3e8ff",color:"#9333ea" }}
                          onClick={()=>{ setEditItem(p); setForm({ name:p.name,price:String(p.price),category:p.category||"",qty:String(p.qty) }); }}>
                          ✏️
                        </button>
                        <button className="inv-action-btn" style={{ background:"#fef2f2",color:"#ef4444" }}
                          onClick={()=>handleDelete(p)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {addModal && (
        <Modal title="Add New Item" onClose={()=>setAddModal(false)}>
          <input className="inv-input" placeholder="Product name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          <input className="inv-input" type="number" placeholder="Price (₹) *" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
          <input className="inv-input" placeholder="Category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} />
          <input className="inv-input" type="number" placeholder="Initial stock quantity" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))} />
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:4 }}>
            <button className="inv-btn-outline" onClick={()=>setAddModal(false)}>Cancel</button>
            <button className="inv-btn-purple" onClick={handleSaveAdd} disabled={saving}>{saving?"Saving…":"Add Item"}</button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editItem && (
        <Modal title="Edit Item" onClose={()=>setEditItem(null)}>
          <input className="inv-input" placeholder="Product name *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          <input className="inv-input" type="number" placeholder="Price (₹) *" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
          <input className="inv-input" placeholder="Category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} />
          <input className="inv-input" type="number" placeholder="Stock quantity" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))} />
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:4 }}>
            <button className="inv-btn-outline" onClick={()=>setEditItem(null)}>Cancel</button>
            <button className="inv-btn-purple" onClick={handleSaveEdit} disabled={saving}>{saving?"Saving…":"Save Changes"}</button>
          </div>
        </Modal>
      )}

      {/* Adjust Stock Modal */}
      {adjustItem && (
        <Modal title={`Adjust Stock — ${adjustItem.name}`} onClose={()=>setAdjustItem(null)}>
          <div style={{ fontSize:13,color:"#9ca3af",marginBottom:12 }}>Current stock: <strong style={{ color:"#111" }}>{adjustItem.qty} pcs</strong></div>
          <input className="inv-input" type="number" min="0" placeholder="New quantity" value={adjustQty} onChange={e=>setAdjustQty(e.target.value)} />
          <div style={{ display:"flex",gap:10,justifyContent:"flex-end",marginTop:4 }}>
            <button className="inv-btn-outline" onClick={()=>setAdjustItem(null)}>Cancel</button>
            <button className="inv-btn-purple" onClick={handleAdjust}>Update Stock</button>
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
}
