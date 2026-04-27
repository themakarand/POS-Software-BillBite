import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const BASE = "http://localhost:5000/api";
const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

/* ── Dummy KDS orders ─────────────────────────────────────────────────────── */
const DUMMY = [
  { _id:"KDS-001", table:"Table T2", customer:"Floyd Miles",   type:"Dine In",  status:"pending",   items:[{name:"Veg Salad",qty:1},{name:"Orange Juice",qty:2}], createdAt: new Date(Date.now()-7*60000).toISOString() },
  { _id:"KDS-002", table:"Counter",  customer:"Walk-in",       type:"Pickup",   status:"pending",   items:[{name:"Cheese Burger",qty:2},{name:"Fries",qty:1}],    createdAt: new Date(Date.now()-4*60000).toISOString() },
  { _id:"KDS-003", table:"Table T5", customer:"Maya Sinha",    type:"Dine In",  status:"cooking",   items:[{name:"Pasta",qty:1},{name:"Soup",qty:1}],             createdAt: new Date(Date.now()-12*60000).toISOString() },
  { _id:"KDS-004", table:"—",        customer:"Rahul Kumar",   type:"Delivery", status:"pending",   items:[{name:"Taco",qty:3}],                                  createdAt: new Date(Date.now()-2*60000).toISOString() },
  { _id:"KDS-005", table:"Table T1", customer:"Priya Sharma",  type:"Dine In",  status:"cooking",   items:[{name:"Grilled Chicken",qty:1},{name:"Naan",qty:2}],   createdAt: new Date(Date.now()-9*60000).toISOString() },
  { _id:"KDS-006", table:"Counter",  customer:"Walk-in",       type:"Pickup",   status:"pending",   items:[{name:"Cold Coffee",qty:2}],                           createdAt: new Date(Date.now()-1*60000).toISOString() },
  { _id:"KDS-007", table:"Table T3", customer:"Abhi Mehta",    type:"Dine In",  status:"completed", items:[{name:"Biryani",qty:2},{name:"Raita",qty:1}],          createdAt: new Date(Date.now()-22*60000).toISOString() },
  { _id:"KDS-008", table:"—",        customer:"Sona Patel",    type:"Delivery", status:"completed", items:[{name:"Pizza",qty:1},{name:"Garlic Bread",qty:1}],     createdAt: new Date(Date.now()-30*60000).toISOString() },
];

const STATUS_META = {
  pending:   { label:"Pending",   bg:"#fff7ed", border:"#fed7aa", badge:"#f97316", dot:"#f97316" },
  cooking:   { label:"Cooking",   bg:"#eff6ff", border:"#bfdbfe", badge:"#3b82f6", dot:"#3b82f6" },
  completed: { label:"Completed", bg:"#f0fdf4", border:"#bbf7d0", badge:"#16a34a", dot:"#16a34a" },
};

function elapsed(iso) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1)  return "Just now";
  if (mins === 1) return "1 min ago";
  return `${mins} mins ago`;
}

function urgency(iso, status) {
  if (status === "completed") return "ok";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins > 15) return "late";
  if (mins > 8)  return "warn";
  return "ok";
}

/* ── Order Card ───────────────────────────────────────────────────────────── */
function OrderCard({ order, onStatusChange }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (order.status === "completed") return;
    const id = setInterval(() => setTick(t => t+1), 30000);
    return () => clearInterval(id);
  }, [order.status]);

  const m = STATUS_META[order.status] || STATUS_META.pending;
  const urg = urgency(order.createdAt, order.status);

  return (
    <div style={{
      background: m.bg,
      border: `1.5px solid ${urg === "late" && order.status !== "completed" ? "#ef4444" : m.border}`,
      borderRadius: 14,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      transition: "box-shadow .2s",
      boxShadow: urg === "late" && order.status !== "completed" ? "0 0 0 2px #fecaca" : "none",
    }}>
      {/* Card Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ fontWeight:700, fontSize:15, color:"#111" }}>{order._id}</div>
          <div style={{ fontSize:12, color:"#6b7280", marginTop:3 }}>
            {order.table} · <span style={{ color: urg==="late" ? "#ef4444" : urg==="warn" ? "#f97316" : "#9ca3af" }}>{elapsed(order.createdAt)}</span>
          </div>
        </div>
        <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background: m.badge, color:"#fff", textTransform:"uppercase", letterSpacing:.5 }}>
          {m.label}
        </span>
      </div>

      {/* Type badge */}
      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20, background:"#f3e8ff", color:"#9333ea" }}>{order.type}</span>
        <span style={{ fontSize:12, color:"#6b7280" }}>{order.customer}</span>
      </div>

      {/* Items */}
      <div style={{ background:"rgba(255,255,255,0.7)", borderRadius:10, padding:"10px 14px" }}>
        {order.items.map((it, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:"#374151", padding:"3px 0", borderBottom: i < order.items.length-1 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <span>{it.name}</span>
            <span style={{ fontWeight:600, color:"#111" }}>×{it.qty}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      {order.status !== "completed" && (
        <div style={{ display:"flex", gap:8, marginTop:4 }}>
          {order.status === "pending" && (
            <button onClick={() => onStatusChange(order._id, "cooking")}
              style={{ flex:1, padding:"9px 0", borderRadius:10, border:"none", background:"#3b82f6", color:"#fff", fontWeight:600, fontSize:13, cursor:"pointer" }}>
              🔥 Start Cooking
            </button>
          )}
          {order.status === "cooking" && (
            <button onClick={() => onStatusChange(order._id, "completed")}
              style={{ flex:1, padding:"9px 0", borderRadius:10, border:"none", background:"#16a34a", color:"#fff", fontWeight:600, fontSize:13, cursor:"pointer" }}>
              ✓ Mark Ready
            </button>
          )}
          <button onClick={() => onStatusChange(order._id, "completed")}
            style={{ padding:"9px 14px", borderRadius:10, border:"1px solid #e5e7eb", background:"#fff", color:"#6b7280", fontSize:12, cursor:"pointer" }}>
            Skip
          </button>
        </div>
      )}
      {order.status === "completed" && (
        <div style={{ textAlign:"center", fontSize:13, color:"#16a34a", fontWeight:600 }}>✓ Order Ready</div>
      )}
    </div>
  );
}

/* ── Main Kitchen Page ────────────────────────────────────────────────────── */
export default function KitchenPage() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState("live");   // "live" | "history"
  const [statusF,  setStatusF]  = useState("all");
  const [typeF,    setTypeF]    = useState("all");
  const [search,   setSearch]   = useState("");
  const [, setTick] = useState(0);

  // Refresh timer display every 30s
  useEffect(() => {
    const id = setInterval(() => setTick(t => t+1), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/orders`, authH());
      const data = Array.isArray(res.data) ? res.data : (res.data.orders || []);
      if (data.length === 0) throw new Error("empty");
      setOrders(data.map(o => ({
        _id: String(o._id).slice(-6).toUpperCase(),
        _rawId: o._id,
        table: o.table?.name || o.table || "Counter",
        customer: o.customer_name || "Walk-in",
        type: o.mode || "Dine In",
        status: o.status?.toLowerCase() === "pending" ? "pending"
               : o.status?.toLowerCase() === "completed" ? "completed"
               : "cooking",
        items: o.items || [],
        createdAt: o.createdAt,
      })));
    } catch {
      setOrders(DUMMY);
    } finally { setLoading(false); }
  };

  const handleStatusChange = useCallback((id, newStatus) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
  }, []);

  const counts = useMemo(() => ({
    pending:   orders.filter(o => o.status === "pending").length,
    cooking:   orders.filter(o => o.status === "cooking").length,
    completed: orders.filter(o => o.status === "completed").length,
  }), [orders]);

  const filtered = useMemo(() => {
    let list = orders;
    // Live view: pending + cooking; History: completed
    if (view === "live")    list = list.filter(o => o.status !== "completed");
    if (view === "history") list = list.filter(o => o.status === "completed");
    // Status filter
    if (statusF !== "all")  list = list.filter(o => o.status === statusF);
    // Type filter
    if (typeF !== "all")    list = list.filter(o => o.type?.toLowerCase().includes(typeF));
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o => o._id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.table.toLowerCase().includes(q));
    }
    return list;
  }, [orders, view, statusF, typeF, search]);

  const TYPE_FILTERS = [
    { id:"all",      label:"All"      },
    { id:"pickup",   label:"Pickup"   },
    { id:"dine in",  label:"Dine In"  },
    { id:"delivery", label:"Delivery" },
  ];

  const STATUS_FILTERS = [
    { id:"all",       label:`All`                     },
    { id:"pending",   label:`Pending (${counts.pending})`   },
    { id:"cooking",   label:`Cooking (${counts.cooking})`   },
    { id:"completed", label:`Completed`                     },
  ];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .kp *{box-sizing:border-box;font-family:'DM Sans',sans-serif;}
        .kp-sfb{padding:7px 16px;border-radius:8px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#374151;cursor:pointer;transition:all .15s;}
        .kp-sfb:hover{border-color:#9333ea;color:#9333ea;}
        .kp-sfb.act{background:#9333ea;color:#fff;border-color:#9333ea;}
        .kp-tfb{padding:7px 18px;border-radius:8px;border:1px solid transparent;background:none;font-size:13.5px;font-weight:500;color:#374151;cursor:pointer;transition:all .15s;}
        .kp-tfb:hover{color:#9333ea;}
        .kp-tfb.act{color:#9333ea;border-bottom:2px solid #9333ea;border-radius:0;font-weight:700;}
        .kp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
        @media(max-width:1100px){.kp-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:680px) {.kp-grid{grid-template-columns:1fr;} .kp-toolbar{flex-direction:column;align-items:stretch!important;}}
        .kp-search{display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:10px 16px;min-width:200px;flex:1;}
        .kp-search input{flex:1;border:none;outline:none;font-size:14px;color:#374151;background:none;}
      `}</style>

      <Sidebar />

      <div className="kp" style={{ flex:1, overflowY:"auto", background:"#fdf4ff", display:"flex", flexDirection:"column" }}>

        {/* ── Header ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"24px 32px 16px", flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:"#111", margin:0, marginBottom:4 }}>Kitchen Display System</h1>
            <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>Manage incoming orders for Dine In, Pickup, and Delivery</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {/* Bell */}
            <button style={{ width:38, height:38, borderRadius:10, border:"1px solid #e5e7eb", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:"#374151", position:"relative" }}>
              🔔
              {counts.pending > 0 && (
                <span style={{ position:"absolute", top:6, right:6, width:8, height:8, borderRadius:"50%", background:"#ef4444", border:"1.5px solid #fff" }} />
              )}
            </button>
            {/* Live View / History */}
            <button onClick={() => { setView("live"); setStatusF("all"); }}
              style={{ padding:"9px 18px", borderRadius:10, border:"1px solid #e5e7eb", background: view==="live" ? "#fff" : "#fff", color: view==="live" ? "#374151" : "#9ca3af", fontWeight:600, fontSize:13.5, cursor:"pointer" }}>
              Live View
            </button>
            <button onClick={() => { setView("history"); setStatusF("all"); }}
              style={{ padding:"9px 18px", borderRadius:10, border:"none", background: view==="history" ? "#9333ea" : "#9333ea", color:"#fff", fontWeight:600, fontSize:13.5, cursor:"pointer" }}>
              History
            </button>
          </div>
        </div>

        {/* ── Toolbar: Search + Type filters ── */}
        <div className="kp-toolbar" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px 12px", gap:12, flexWrap:"wrap" }}>
          <div className="kp-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input placeholder="Search order here..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <button onClick={() => setSearch("")} style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa", fontSize:16, padding:0 }}>✕</button>}
          </div>
          <div style={{ display:"flex", gap:2, background:"#fff", borderRadius:10, border:"1px solid #e5e7eb", padding:"4px 8px", flexWrap:"wrap" }}>
            {TYPE_FILTERS.map(f => (
              <button key={f.id} className={`kp-tfb${typeF===f.id?" act":""}`} onClick={() => setTypeF(f.id)}>{f.label}</button>
            ))}
          </div>
        </div>

        {/* ── Status filters ── */}
        <div style={{ display:"flex", gap:8, padding:"0 32px 20px", flexWrap:"wrap" }}>
          {STATUS_FILTERS.map(f => (
            <button key={f.id} className={`kp-sfb${statusF===f.id?" act":""}`} onClick={() => setStatusF(f.id)}>{f.label}</button>
          ))}
        </div>

        {/* ── Content ── */}
        <div style={{ flex:1, padding:"0 32px 32px" }}>
          {loading ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:"#9ca3af" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
              <div style={{ fontSize:15, fontWeight:500 }}>Loading orders…</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:"#9ca3af" }}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:16 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <div style={{ fontSize:17, fontWeight:600, color:"#374151", marginBottom:6 }}>No order found</div>
              <div style={{ fontSize:13, color:"#9ca3af" }}>Try adjusting the filters</div>
            </div>
          ) : (
            <div className="kp-grid">
              {filtered.map(order => (
                <OrderCard key={order._id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </div>

        {/* ── Summary bar ── */}
        {!loading && orders.length > 0 && (
          <div style={{ display:"flex", gap:20, padding:"12px 32px", background:"#fff", borderTop:"1px solid #ede9f6", flexWrap:"wrap" }}>
            {[
              { label:"Pending",   count:counts.pending,   color:"#f97316" },
              { label:"Cooking",   count:counts.cooking,   color:"#3b82f6" },
              { label:"Completed", count:counts.completed, color:"#16a34a" },
            ].map(s => (
              <div key={s.label} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:s.color, display:"inline-block" }} />
                <span style={{ color:"#6b7280" }}>{s.label}:</span>
                <span style={{ fontWeight:700, color:"#111" }}>{s.count}</span>
              </div>
            ))}
            <div style={{ marginLeft:"auto", fontSize:13, color:"#9ca3af" }}>
              Total: <strong style={{ color:"#111" }}>{orders.length}</strong> orders
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
