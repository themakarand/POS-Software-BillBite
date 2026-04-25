import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";
const token = () => localStorage.getItem("token");
const authHeaders = () => ({ headers: { Authorization: `Bearer ${token()}` } });

const DUMMY_ORDERS = [
  { _id:"#1001", customer_name:"Floyd Miles",   table:"Table T4", mode:"Dine in",   createdAt:"2023-10-12T10:30:00", status:"Completed", total:850  },
  { _id:"#1002", customer_name:"Maya Sinha",    table:"Table T2", mode:"Dine in",   createdAt:"2023-10-12T11:30:00", status:"Completed", total:1200 },
  { _id:"#1003", customer_name:"Robert Fox",    table:"Table T3", mode:"Take Away", createdAt:"2023-10-12T11:45:00", status:"Pending",   total:850  },
  { _id:"#1004", customer_name:"Abhi Mehta",    table:"Table T6", mode:"Dine in",   createdAt:"2023-10-12T12:45:00", status:"Completed", total:650  },
  { _id:"#1005", customer_name:"Bessie Cooper", table:"Table T5", mode:"Dine In",   createdAt:"2023-10-12T13:50:00", status:"Completed", total:900  },
  { _id:"#1006", customer_name:"Davon Lane",    table:"—",        mode:"Delivery",  createdAt:"2023-10-12T14:10:00", status:"Pending",   total:1350 },
  { _id:"#1007", customer_name:"Priya Sharma",  table:"Table T1", mode:"Dine in",   createdAt:"2023-10-12T14:30:00", status:"Cancelled", total:550  },
  { _id:"#1008", customer_name:"Rahul Verma",   table:"—",        mode:"Take Away", createdAt:"2023-10-12T15:00:00", status:"Completed", total:700  },
];

// Status → colour (just text colour, no bg pill)
const STATUS_COLOR = {
  completed: "#22c55e",
  pending:   "#f97316",
  cancelled: "#ef4444",
  "in-progress": "#3b82f6",
};

function statusColor(s) {
  return STATUS_COLOR[(s||"").toLowerCase()] || "#6b7280";
}

function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })
      + " " + d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", hour12:true });
  } catch { return iso; }
}

const Ic = {
  rupee:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="5" x2="18" y2="5"/><line x1="6" y1="10" x2="18" y2="10"/><path d="M6 10l6 9"/><path d="M12 10a4 4 0 000-5H6"/></svg>,
  orders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  trend:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  check:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  search: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  export: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  filter: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/><line x1="21" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="3" y2="12"/><line x1="21" y1="20" x2="16" y2="20"/><line x1="12" y1="20" x2="3" y2="20"/><line x1="14" y1="2" x2="14" y2="6"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="16" y1="18" x2="16" y2="22"/></svg>,
  chevD:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  close:  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  eye:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
};

function OrderModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
      <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:16, padding:28, width:420, maxWidth:"92vw", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:"#111" }}>Order {order._id}</div>
            <div style={{ fontSize:13, color:"#9ca3af", marginTop:3 }}>{fmtDate(order.createdAt)}</div>
          </div>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:8, width:30, height:30, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#6b7280" }}>{Ic.close}</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {[["Customer",order.customer_name],["Table",order.table||"—"],["Type",order.mode],["Status",<span style={{ color:statusColor(order.status), fontWeight:600 }}>{order.status}</span>]].map(([k,v])=>(
            <div key={k} style={{ background:"#f9fafb", borderRadius:10, padding:"10px 14px" }}>
              <div style={{ fontSize:11, color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:4 }}>{k}</div>
              <div style={{ fontSize:14, fontWeight:500, color:"#111" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ borderTop:"1px solid #f3f4f6", paddingTop:14, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:15, fontWeight:700, color:"#111" }}>Total Amount</span>
          <span style={{ fontSize:15, fontWeight:700, color:"#7c3aed" }}>₹{order.total?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter]     = useState("All Types");
  const [sortField, setSortField]       = useState("createdAt");
  const [sortDir, setSortDir]           = useState("desc");
  const [statusOpen, setStatusOpen]     = useState(false);
  const [filterOpen, setFilterOpen]     = useState(false);
  const [viewOrder, setViewOrder]       = useState(null);
  const [page, setPage]                 = useState(1);
  const PER_PAGE = 10;
  const statusRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/orders`, authHeaders());
      setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
    } catch { setOrders(DUMMY_ORDERS); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const h = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const stats = useMemo(() => ({
    revenue:   orders.reduce((s,o) => s+(o.total||0), 0),
    total:     orders.length,
    pending:   orders.filter(o => o.status?.toLowerCase()==="pending").length,
    average:   orders.length ? Math.round(orders.reduce((s,o)=>s+(o.total||0),0)/orders.length) : 0,
    completed: orders.filter(o => o.status?.toLowerCase()==="completed").length,
  }), [orders]);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        o._id?.toLowerCase().includes(q) ||
        o.customer_name?.toLowerCase().includes(q) ||
        o.table?.toLowerCase().includes(q) ||
        o.mode?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All Status")
      list = list.filter(o => o.status?.toLowerCase() === statusFilter.toLowerCase());
    if (typeFilter !== "All Types") {
      const tq = typeFilter.toLowerCase();
      list = list.filter(o => o.mode?.toLowerCase().includes(tq.split(" ")[0]));
    }
    list.sort((a,b) => {
      let av=a[sortField], bv=b[sortField];
      if (sortField==="createdAt") { av=new Date(av); bv=new Date(bv); }
      if (typeof av==="string") av=av.toLowerCase();
      if (typeof bv==="string") bv=bv.toLowerCase();
      if (av<bv) return sortDir==="asc"?-1:1;
      if (av>bv) return sortDir==="asc"?1:-1;
      return 0;
    });
    return list;
  }, [orders, search, statusFilter, typeFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length/PER_PAGE));
  const paginated  = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const handleSort = (field) => {
    if (sortField===field) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortField(field); setSortDir("asc"); }
    setPage(1);
  };

  const exportCSV = () => {
    const hdr = ["Order ID","Customer","Table","Type","Date","Status","Total (INR)"];
    const rows = filtered.map(o=>[o._id,o.customer_name,o.table||"—",o.mode,fmtDate(o.createdAt),o.status,o.total]);
    const csv = [hdr,...rows].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"),{
      href: URL.createObjectURL(new Blob([csv],{type:"text/csv"})),
      download:`orders_${Date.now()}.csv`
    });
    a.click();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .op { flex:1; overflow-y:auto; background:#fdf4ff; padding:32px 36px; min-height:100vh; font-family:'DM Sans',sans-serif; }
        .op * { box-sizing:border-box; font-family:'DM Sans',sans-serif; }

        /* ── Stat cards ── */
        .op-stats { display:grid; grid-template-columns:repeat(5,1fr); gap:14px; margin-bottom:32px; }
        @media(max-width:1100px){ .op-stats{grid-template-columns:repeat(3,1fr);} }
        @media(max-width:680px) { .op-stats{grid-template-columns:repeat(2,1fr);} .op{padding:16px;} }

        .op-stat { background:#fff; border:1px solid #ede9f6; border-radius:14px; padding:18px 20px; display:flex; align-items:flex-start; justify-content:space-between; }
        .op-stat-icon { width:42px; height:42px; background:#f3e8ff; border-radius:11px; display:flex; align-items:center; justify-content:center; color:#9333ea; flex-shrink:0; }

        /* ── Toolbar ── */
        .op-toolbar { display:flex; align-items:center; gap:10px; margin-bottom:20px; }
        .op-search { flex:1; display:flex; align-items:center; gap:10px; background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:11px 16px; }
        .op-search input { flex:1; border:none; outline:none; font-size:14px; color:#374151; background:none; }
        .op-search input::placeholder { color:#aaa; }

        /* Purple buttons — exactly like Figma */
        .op-btn-purple { display:flex; align-items:center; gap:7px; padding:10px 18px; border-radius:10px; background:#9333ea; color:#fff; border:none; cursor:pointer; font-size:13.5px; font-weight:600; white-space:nowrap; transition:background 0.12s; }
        .op-btn-purple:hover { background:#7c3aed; }

        /* Export button */
        .op-export { display:flex; align-items:center; gap:7px; padding:11px 22px; border-radius:10px; background:#9333ea; color:#fff; border:none; cursor:pointer; font-size:14px; font-weight:600; white-space:nowrap; transition:background 0.12s; }
        .op-export:hover { background:#7c3aed; }

        /* Dropdown */
        .op-dd-wrap { position:relative; }
        .op-dd-menu { position:absolute; top:calc(100% + 6px); right:0; background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:5px; min-width:170px; box-shadow:0 8px 30px rgba(0,0,0,0.10); z-index:200; }
        .op-dd-item { padding:8px 12px; border-radius:7px; cursor:pointer; font-size:13px; color:#374151; font-weight:500; display:flex; align-items:center; gap:8px; }
        .op-dd-item:hover { background:#faf5ff; color:#9333ea; }
        .op-dd-item.sel { background:#f3e8ff; color:#9333ea; font-weight:600; }

        /* Table */
        .op-table-wrap { background:#fff; border-radius:14px; overflow:hidden; border:1px solid #ede9f6; }
        .op-tbl { width:100%; border-collapse:collapse; }
        .op-tbl thead tr { background:#f4f4f5; }
        .op-tbl thead th { padding:14px 20px; text-align:left; font-size:13.5px; font-weight:500; color:#71717a; white-space:nowrap; cursor:pointer; user-select:none; border-bottom:1px solid #f0edf8; }
        .op-tbl thead th:hover { color:#9333ea; }
        .op-tbl tbody tr { border-bottom:1px solid #faf5ff; transition:background 0.1s; }
        .op-tbl tbody tr:hover { background:#fdf9ff; }
        .op-tbl tbody tr:last-child { border-bottom:none; }
        .op-tbl td { padding:18px 20px; font-size:14px; color:#374151; vertical-align:middle; }

        /* Pagination */
        .op-pager { display:flex; align-items:center; justify-content:space-between; padding:14px 20px; border-top:1px solid #f3f4f6; flex-wrap:wrap; gap:8px; }
        .op-pager-info { font-size:13px; color:#9ca3af; }
        .op-pager-btns { display:flex; gap:5px; }
        .op-pg { width:32px; height:32px; border-radius:7px; border:1px solid #e5e7eb; background:#fff; cursor:pointer; font-size:13px; font-weight:500; color:#374151; display:flex; align-items:center; justify-content:center; }
        .op-pg:hover:not(:disabled) { border-color:#9333ea; color:#9333ea; }
        .op-pg.on { background:#9333ea; border-color:#9333ea; color:#fff; font-weight:700; }
        .op-pg:disabled { opacity:0.3; cursor:not-allowed; }

        .op-empty { padding:60px; text-align:center; color:#9ca3af; font-size:14px; }

        @media(max-width:900px){ .op-tbl th:nth-child(4),.op-tbl td:nth-child(4){ display:none; } }
        @media(max-width:680px){ .op-tbl th:nth-child(3),.op-tbl td:nth-child(3){ display:none; } }
      `}</style>

      <div className="op">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:700, color:"#111", margin:0, marginBottom:5 }}>Order History</h1>
            <p style={{ fontSize:14, color:"#9ca3af", margin:0 }}>Track and manage restaurant orders in one place</p>
          </div>
          <button className="op-export" onClick={exportCSV}>{Ic.export} Export</button>
        </div>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <div className="op-stats">
          {[
            { lbl:"Total Revenue",   val:`₹${stats.revenue.toLocaleString()}`, sub:"12.5% Month", icon:Ic.rupee  },
            { lbl:"Total Order",     val:stats.total,                          sub:"8.2% Month",  icon:Ic.orders },
            { lbl:"Pending Order",   val:stats.pending,                        sub:"15.3% Month", icon:Ic.clock  },
            { lbl:"Average Order",   val:`₹${stats.average.toLocaleString()}`, sub:"5.7% Month",  icon:Ic.trend  },
            { lbl:"Completed Order", val:stats.completed,                      sub:"10.2% Month", icon:Ic.check  },
          ].map(s => (
            <div className="op-stat" key={s.lbl}>
              <div>
                <div style={{ fontSize:13, color:"#9ca3af", marginBottom:8, fontWeight:400 }}>{s.lbl}</div>
                <div style={{ fontSize:28, fontWeight:700, color:"#111", lineHeight:1, marginBottom:8 }}>{s.val}</div>
                <div style={{ fontSize:12, color:"#9ca3af" }}>VS last</div>
                <div style={{ fontSize:13, color:"#374151", fontWeight:500, marginTop:1 }}>{s.sub}</div>
              </div>
              <div className="op-stat-icon">{s.icon}</div>
            </div>
          ))}
        </div>

        {/* ── Toolbar ────────────────────────────────────────────────────── */}
        <div className="op-toolbar">
          {/* Search */}
          <div className="op-search">
            {Ic.search}
            <input
              placeholder="Search here by Id, Order, customer ot table..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} style={{ background:"none", border:"none", cursor:"pointer", color:"#aaa", display:"flex", padding:0 }}>{Ic.close}</button>
            )}
          </div>

          {/* All Status — purple */}
          <div className="op-dd-wrap" ref={statusRef}>
            <button className="op-btn-purple" onClick={() => { setStatusOpen(o=>!o); setFilterOpen(false); }}>
              {statusFilter === "All Status" ? "All Status" : statusFilter}
              {Ic.chevD}
            </button>
            {statusOpen && (
              <div className="op-dd-menu">
                {["All Status","Completed","Pending","Cancelled","In Progress"].map(s => (
                  <div key={s} className={`op-dd-item ${statusFilter===s?"sel":""}`}
                    onClick={() => { setStatusFilter(s); setStatusOpen(false); setPage(1); }}>
                    {s !== "All Status" && (
                      <span style={{ width:7, height:7, borderRadius:"50%", background:statusColor(s), display:"inline-block", flexShrink:0 }}/>
                    )}
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filters — purple */}
          <div className="op-dd-wrap" ref={filterRef}>
            <button className="op-btn-purple" onClick={() => { setFilterOpen(o=>!o); setStatusOpen(false); }}>
              {Ic.filter} Filters {Ic.chevD}
            </button>
            {filterOpen && (
              <div className="op-dd-menu" style={{ minWidth:200 }}>
                <div style={{ padding:"6px 12px 4px", fontSize:11, color:"#9ca3af", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>Order Type</div>
                {["All Types","Dine in","Take Away","Delivery"].map(t => (
                  <div key={t} className={`op-dd-item ${typeFilter===t?"sel":""}`}
                    onClick={() => { setTypeFilter(t); setPage(1); }}>{t}</div>
                ))}
                <div style={{ borderTop:"1px solid #f3f4f6", margin:"4px 0" }}/>
                <div style={{ padding:"6px 12px 4px", fontSize:11, color:"#9ca3af", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5 }}>Sort By</div>
                {[["createdAt","Date"],["total","Amount"],["customer_name","Customer"]].map(([f,l]) => (
                  <div key={f} className={`op-dd-item ${sortField===f?"sel":""}`}
                    onClick={() => { handleSort(f); }}>
                    {l} {sortField===f && (sortDir==="asc"?"↑":"↓")}
                  </div>
                ))}
                <div style={{ borderTop:"1px solid #f3f4f6", margin:"4px 0" }}/>
                <div className="op-dd-item" style={{ color:"#ef4444" }}
                  onClick={() => { setTypeFilter("All Types"); setStatusFilter("All Status"); setSearch(""); setSortField("createdAt"); setSortDir("desc"); setFilterOpen(false); setPage(1); }}>
                  Reset Filters
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Table ──────────────────────────────────────────────────────── */}
        <div className="op-table-wrap">
          {loading ? (
            <div className="op-empty">Loading orders…</div>
          ) : filtered.length === 0 ? (
            <div className="op-empty">No orders found.</div>
          ) : (
            <>
              <table className="op-tbl">
                <thead>
                  <tr>
                    {[
                      ["_id",           "Order ID"],
                      ["customer_name", "Customer"],
                      ["mode",          "Type"],
                      ["createdAt",     "Date"],
                      ["status",        "Status"],
                      ["total",         "Total"],
                      [null,            ""],
                    ].map(([field, label]) => (
                      <th key={label} onClick={() => field && handleSort(field)}>
                        {label}
                        {field && (
                          <span style={{ marginLeft:4, color: sortField===field?"#9333ea":"#d1d5db" }}>
                            {sortField===field ? (sortDir==="asc"?"↑":"↓") : "↕"}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((o, i) => (
                    <tr key={o._id + i}>

                      {/* Order ID */}
                      <td>
                        <span style={{ fontWeight:500, color:"#111" }}>{o._id}</span>
                      </td>

                      {/* Customer + table sub-label */}
                      <td>
                        <div style={{ fontWeight:400, color:"#374151", fontSize:14 }}>{o.customer_name}</div>
                        {o.table && o.table !== "—" && (
                          <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{o.table}</div>
                        )}
                      </td>

                      {/* Type — plain text, no pill */}
                      <td style={{ color:"#374151", fontWeight:400 }}>{o.mode}</td>

                      {/* Date */}
                      <td style={{ color:"#374151", fontSize:13 }}>{fmtDate(o.createdAt)}</td>

                      {/* Status — coloured text only, no pill */}
                      <td>
                        <span style={{ color: statusColor(o.status), fontWeight:500, fontSize:14 }}>
                          {o.status}
                        </span>
                      </td>

                      {/* Total */}
                      <td style={{ fontWeight:400, color:"#374151" }}>₹{o.total?.toLocaleString()}</td>

                      {/* View (hidden in Figma but useful) */}
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="op-pager">
                <div className="op-pager-info">
                  Showing {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length} orders
                </div>
                <div className="op-pager-btns">
                  <button className="op-pg" disabled={page===1} onClick={()=>setPage(1)}>«</button>
                  <button className="op-pg" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
                  {Array.from({length:Math.min(totalPages,5)},(_,i)=>{
                    let p = page<=3 ? i+1 : page-2+i;
                    if(p<1||p>totalPages) return null;
                    return <button key={p} className={`op-pg ${page===p?"on":""}`} onClick={()=>setPage(p)}>{p}</button>;
                  })}
                  <button className="op-pg" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
                  <button className="op-pg" disabled={page===totalPages} onClick={()=>setPage(totalPages)}>»</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {viewOrder && <OrderModal order={viewOrder} onClose={() => setViewOrder(null)}/>}
    </>
  );
}