import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const BASE = "http://localhost:5000/api";
const authH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });



function fmtDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
      +" "+d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:true});
  } catch { return iso; }
}

function statusLabel(s) {
  if (s==="completed") return "Completed";
  if (s==="running")   return "Pending";
  return "Cancelled";
}
function statusColor(s) {
  if (s==="completed") return "#16a34a";
  if (s==="running")   return "#f97316";
  return "#ef4444";
}

export default function ReportsPage() {
  const [stats,    setStats]    = useState(null);
  const [history,  setHistory]  = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [statusF,  setStatusF]  = useState("All");
  const [page,     setPage]     = useState(1);
  const PER = 8;

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [r1, r2, r3] = await Promise.all([
        axios.get(`${BASE}/reports`,          authH()),
        axios.get(`${BASE}/reports/history`,  authH()),
        axios.get(`${BASE}/reports/top-items`,authH()),
      ]);
      setStats(r1.data);
      const raw = Array.isArray(r2.data) ? r2.data : [];
      // normalise
      setHistory(raw.map(o => ({
        _id: o._id,
        table: o.table,
        customer: o.table?.name || "Walk-in",
        createdAt: o.createdAt,
        status: o.status,
        payment: o.payment || "Cash",
        total: o.total || 0,
        items: o.items || [],
      })));
      setTopItems(Array.isArray(r3.data) ? r3.data : []);
    } catch {
      setHistory([]);
      setTopItems([]);
      setStats(null);
    } finally { setLoading(false); }
  };

  // Derived stats from history when API stats unavailable
  const computedStats = useMemo(() => {
    const src = history; // Removed DUMMY_HISTORY fallback to show true zero state
    const completed = src.filter(o => o.status === "completed");
    const revenue   = completed.reduce((s,o) => s+(o.total||0), 0);
    const avg       = completed.length ? Math.round(revenue/completed.length) : 0;
    const profit    = Math.round(revenue * 0.35);
    return { totalRevenue: revenue, totalOrders: src.length, avgOrder: avg, netProfit: profit };
  }, [history]);

  const s = stats
    ? { totalRevenue: stats.totalRevenue, totalOrders: stats.totalOrders,
        avgOrder: stats.totalOrders ? Math.round(stats.totalRevenue/stats.totalOrders) : 0,
        netProfit: Math.round(stats.totalRevenue*0.35) }
    : computedStats;

  const maxQty = topItems[0]?.qty || 1;

  const filtered = useMemo(() => {
    let list = history;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        String(o._id).toLowerCase().includes(q) ||
        o.customer?.toLowerCase().includes(q) ||
        o.table?.name?.toLowerCase().includes(q)
      );
    }
    if (statusF !== "All") {
      list = list.filter(o => statusLabel(o.status) === statusF);
    }
    return list;
  }, [history, search, statusF]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
  const paginated  = filtered.slice((page-1)*PER, page*PER);

  const exportCSV = () => {
    const rows = [["Order ID","Customer","Table","Date","Status","Payment","Total"],
      ...filtered.map(o=>[o._id, o.customer, o.table?.name||"—", fmtDate(o.createdAt), statusLabel(o.status), o.payment||"Cash", o.total])];
    const csv = rows.map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"),{
      href: URL.createObjectURL(new Blob([csv],{type:"text/csv"})),
      download:`report_${Date.now()}.csv`
    });
    a.click();
  };

  const STAT_CARDS = [
    { label:"Total Revenue",      val:`₹${(s.totalRevenue||0).toLocaleString()}`, sub:"+12.5% Month", icon:"₹", bg:"#dcfce7", ic:"#16a34a" },
    { label:"Total Order",        val: s.totalOrders||0,                           sub:"+5.2% Month",  icon:"📋", bg:"#dbeafe", ic:"#2563eb" },
    { label:"Average Order Value",val:`₹${(s.avgOrder||0).toLocaleString()}`,      sub:"Based on current orders", icon:"📊", bg:"#ede9fe", ic:"#7c3aed" },
    { label:"Net Profit",         val: s.netProfit||0,                             sub:"Estimated at 35% margin", icon:"📈", bg:"#fee2e2", ic:"#ef4444" },
  ];

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .rp{flex:1;overflow-y:auto;background:#fdf4ff;padding:32px 36px;font-family:'DM Sans',sans-serif;box-sizing:border-box;}
        .rp *{box-sizing:border-box;font-family:'DM Sans',sans-serif;}
        @media(max-width:900px){.rp{padding:16px;} .rp-grid{grid-template-columns:1fr!important;}}
        @media(max-width:680px){.rp-stats{grid-template-columns:1fr 1fr!important;}}
        @media(max-width:420px){.rp-stats{grid-template-columns:1fr!important;}}
        .rp-card{background:#fff;border:1px solid #ede9f6;border-radius:14px;padding:20px 22px;display:flex;align-items:flex-start;justify-content:space-between;}
        .rp-tbl{width:100%;border-collapse:collapse;min-width:600px;}
        .rp-tbl thead tr{background:#f9fafb;}
        .rp-tbl thead th{padding:13px 18px;text-align:left;font-size:13px;font-weight:600;color:#6b7280;border-bottom:1px solid #f0edf8;white-space:nowrap;}
        .rp-tbl tbody tr{border-bottom:1px solid #faf5ff;transition:background .1s;}
        .rp-tbl tbody tr:hover{background:#fdf9ff;}
        .rp-tbl tbody tr:last-child{border-bottom:none;}
        .rp-tbl td{padding:15px 18px;font-size:14px;color:#374151;vertical-align:middle;}
        .rp-search{flex:1;display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:10px 16px;}
        .rp-search input{flex:1;border:none;outline:none;font-size:14px;color:#374151;background:none;}
        .rp-fb{padding:8px 16px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#374151;cursor:pointer;transition:all .15s;}
        .rp-fb:hover{border-color:#9333ea;color:#9333ea;}
        .rp-fb.act{background:#9333ea;color:#fff;border-color:#9333ea;}
        .rp-btn{display:flex;align-items:center;gap:7px;padding:10px 20px;border-radius:10px;background:#9333ea;color:#fff;border:none;cursor:pointer;font-size:14px;font-weight:600;white-space:nowrap;transition:background .12s;}
        .rp-btn:hover{background:#7c3aed;}
        .rp-pg{width:32px;height:32px;border-radius:7px;border:1px solid #e5e7eb;background:#fff;cursor:pointer;font-size:13px;font-weight:500;color:#374151;display:flex;align-items:center;justify-content:center;}
        .rp-pg:hover:not(:disabled){border-color:#9333ea;color:#9333ea;}
        .rp-pg.on{background:#9333ea;border-color:#9333ea;color:#fff;}
        .rp-pg:disabled{opacity:.3;cursor:not-allowed;}
        @media(max-width:700px){/* .rp-tbl th:nth-child(4),.rp-tbl td:nth-child(4){display:none;} */}
        @media(max-width:540px){/* .rp-tbl th:nth-child(5),.rp-tbl td:nth-child(5){display:none;} */}
      `}</style>

      <Sidebar />

      <div className="rp">
        {/* Header */}
        <div className="pl-12 md:pl-0" style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28,flexWrap:"wrap",gap:12 }}>
          <div>
            <h1 style={{ fontSize:26,fontWeight:700,color:"#111",margin:0,marginBottom:4 }}>Reports &amp; Analytics</h1>
            <p style={{ fontSize:14,color:"#9ca3af",margin:0 }}>Overview of your business performance</p>
          </div>
          <button className="rp-btn" onClick={exportCSV}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Export Report
          </button>
        </div>

        {/* Stat Cards */}
        <div className="rp-stats" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:32 }}>
          {STAT_CARDS.map(c => (
            <div className="rp-card" key={c.label}>
              <div>
                <div style={{ fontSize:13,color:"#9ca3af",marginBottom:8 }}>{c.label}</div>
                <div style={{ fontSize:26,fontWeight:700,color:"#111",marginBottom:8 }}>{c.val}</div>
                <div style={{ fontSize:12,color:"#6b7280" }}>VS last</div>
                <div style={{ fontSize:13,color:"#374151",fontWeight:500,marginTop:2 }}>{c.sub}</div>
              </div>
              <div style={{ width:44,height:44,borderRadius:12,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0 }}>{c.icon}</div>
            </div>
          ))}
        </div>

        {/* Two-column layout: transactions + top items */}
        <div className="rp-grid" style={{ display:"grid",gridTemplateColumns:"1fr 300px",gap:20,alignItems:"start" }}>

          {/* Recent Transactions */}
          <div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:18,fontWeight:700,color:"#111" }}>Recent Transactions</div>
              <div style={{ fontSize:13,color:"#9ca3af",marginTop:3 }}>Latest customer orders and payments</div>
            </div>

            {/* Toolbar */}
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16,flexWrap:"wrap" }}>
              <div className="rp-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input placeholder="Search transactions..." value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }} />
                {search && <button onClick={()=>{setSearch("");setPage(1);}} style={{ background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:16,padding:0 }}>✕</button>}
              </div>
              <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
                {["All","Completed","Pending"].map(f=>(
                  <button key={f} className={`rp-fb${statusF===f?" act":""}`} onClick={()=>{setStatusF(f);setPage(1);}}>{f}</button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto" style={{ background:"#fff",borderRadius:14,border:"1px solid #ede9f6" }}>
              {loading ? (
                <div style={{ padding:60,textAlign:"center",color:"#9ca3af" }}>Loading…</div>
              ) : paginated.length === 0 ? (
                <div style={{ padding:60,textAlign:"center",color:"#9ca3af" }}>No transactions found.</div>
              ) : (
                <>
                  <table className="rp-tbl">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((o,i) => (
                        <tr key={String(o._id)+i}>
                          <td><span style={{ fontWeight:500,color:"#111" }}>{o._id}</span></td>
                          <td>
                            <div style={{ fontWeight:400,color:"#374151" }}>{o.customer}</div>
                            {o.table?.name && <div style={{ fontSize:12,color:"#9ca3af",marginTop:2 }}>{o.table.name}</div>}
                          </td>
                          <td style={{ fontSize:13,color:"#374151" }}>{fmtDate(o.createdAt)}</td>
                          <td><span style={{ color:statusColor(o.status),fontWeight:500 }}>{statusLabel(o.status)}</span></td>
                          <td style={{ color:"#374151" }}>{o.payment||"Cash"}</td>
                          <td style={{ fontWeight:500,color:"#374151" }}>₹{(o.total||0).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination */}
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderTop:"1px solid #f3f4f6",flexWrap:"wrap",gap:8 }}>
                    <span style={{ fontSize:13,color:"#9ca3af" }}>
                      Showing {Math.min((page-1)*PER+1,filtered.length)}–{Math.min(page*PER,filtered.length)} of {filtered.length}
                    </span>
                    <div style={{ display:"flex",gap:5 }}>
                      <button className="rp-pg" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
                      {Array.from({length:Math.min(totalPages,5)},(_,i)=>{
                        const p = page<=3 ? i+1 : page-2+i;
                        if(p<1||p>totalPages) return null;
                        return <button key={p} className={`rp-pg${page===p?" on":""}`} onClick={()=>setPage(p)}>{p}</button>;
                      })}
                      <button className="rp-pg" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Top Selling Items */}
          <div style={{ background:"#fff",border:"1px solid #ede9f6",borderRadius:14,padding:20 }}>
            <div style={{ fontSize:16,fontWeight:700,color:"#111",marginBottom:4 }}>Top Selling Items</div>
            <div style={{ fontSize:13,color:"#9ca3af",marginBottom:20 }}>Best performers this period</div>
            {topItems.slice(0,8).map((item,i) => (
              <div key={item.name} style={{ marginBottom:16 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <span style={{ width:22,height:22,borderRadius:6,background:"#f3e8ff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#9333ea",flexShrink:0 }}>{i+1}</span>
                    <span style={{ fontSize:13,fontWeight:500,color:"#111" }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize:12,color:"#9ca3af",fontWeight:500,flexShrink:0,marginLeft:8 }}>{item.qty} sold</span>
                </div>
                <div style={{ height:6,background:"#f3e8ff",borderRadius:4,overflow:"hidden" }}>
                  <div style={{ height:"100%",background:"#9333ea",borderRadius:4,width:`${Math.round((item.qty/maxQty)*100)}%`,transition:"width .4s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
