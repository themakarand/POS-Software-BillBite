import { useState, useEffect, useMemo, useRef } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

const DUMMY = [
  { _id:"#1001", customer_name:"Floyd Miles",   table:"Table T4", mode:"Dine in",   createdAt:"2023-10-12T10:30:00", status:"Completed", total:850  },
  { _id:"#1002", customer_name:"Maya Sinha",    table:"Table T2", mode:"Dine in",   createdAt:"2023-10-12T11:30:00", status:"Completed", total:1200 },
  { _id:"#1003", customer_name:"Robert Fox",    table:"Table T3", mode:"Take Away", createdAt:"2023-10-12T11:45:00", status:"Pending",   total:850  },
  { _id:"#1004", customer_name:"Abhi Mehta",    table:"Table T6", mode:"Dine in",   createdAt:"2023-10-12T12:45:00", status:"Completed", total:650  },
  { _id:"#1005", customer_name:"Bessie Cooper", table:"Table T5", mode:"Dine In",   createdAt:"2023-10-12T13:50:00", status:"Completed", total:900  },
  { _id:"#1006", customer_name:"Davon Lane",    table:"—",        mode:"Delivery",  createdAt:"2023-10-12T14:10:00", status:"Pending",   total:1350 },
  { _id:"#1007", customer_name:"Priya Sharma",  table:"Table T1", mode:"Dine in",   createdAt:"2023-10-12T14:30:00", status:"Cancelled", total:550  },
  { _id:"#1008", customer_name:"Rahul Verma",   table:"—",        mode:"Take Away", createdAt:"2023-10-12T15:00:00", status:"Completed", total:700  },
];

const SC = { Completed:"#22c55e", Pending:"#f97316", Cancelled:"#ef4444", Running:"#3b82f6" };
const sc = s => SC[s] || "#6b7280";

const fmt = iso => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
      +" "+d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:true});
  } catch { return iso; }
};

function Modal({ order, onClose }) {
  if (!order) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:16,padding:28,width:420,maxWidth:"92vw",boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:"#111"}}>Order {order._id}</div>
            <div style={{fontSize:13,color:"#9ca3af",marginTop:3}}>{fmt(order.createdAt)}</div>
          </div>
          <button onClick={onClose} style={{background:"#f3f4f6",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#6b7280"}}>✕</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[["Customer",order.customer_name],["Table",order.table||"—"],["Type",order.mode],["Status",<span style={{color:sc(order.status),fontWeight:600}}>{order.status}</span>]].map(([k,v])=>(
            <div key={k} style={{background:"#f9fafb",borderRadius:10,padding:"10px 14px"}}>
              <div style={{fontSize:11,color:"#9ca3af",fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{k}</div>
              <div style={{fontSize:14,fontWeight:500,color:"#111"}}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{borderTop:"1px solid #f3f4f6",paddingTop:14,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:15,fontWeight:700,color:"#111"}}>Total Amount</span>
          <span style={{fontSize:15,fontWeight:700,color:"#7c3aed"}}>₹{order.total?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("All Status");
  const [type, setType]         = useState("All Types");
  const [sortF, setSortF]       = useState("createdAt");
  const [sortD, setSortD]       = useState("desc");
  const [statusOpen, setSOp]    = useState(false);
  const [filterOpen, setFOp]    = useState(false);
  const [view, setView]         = useState(null);
  const [page, setPage]         = useState(1);
  const [stats, setStats]       = useState({totalRevenue:0,totalOrders:0,pendingOrders:0,averageOrder:0,completedOrders:0});
  const PER = 10;
  const sRef = useRef(); const fRef = useRef();

  useEffect(()=>{ load(); },[]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await API.get("/orders");
      const data = r.data;
      if (data.orders) { setOrders(data.orders); setStats(data.stats||stats); }
      else if (Array.isArray(data)) setOrders(data);
      else setOrders(DUMMY);
    } catch { setOrders(DUMMY); }
    finally { setLoading(false); }
  };

  useEffect(()=>{
    const h = e => {
      if (sRef.current && !sRef.current.contains(e.target)) setSOp(false);
      if (fRef.current && !fRef.current.contains(e.target)) setFOp(false);
    };
    document.addEventListener("mousedown",h);
    return ()=>document.removeEventListener("mousedown",h);
  },[]);

  const computed = useMemo(()=>({
    revenue: orders.reduce((s,o)=>s+(o.total||0),0),
    total: orders.length,
    pending: orders.filter(o=>(o.status||"").toLowerCase()==="pending").length,
    avg: orders.length ? Math.round(orders.reduce((s,o)=>s+(o.total||0),0)/orders.length) : 0,
    completed: orders.filter(o=>(o.status||"").toLowerCase()==="completed").length,
  }),[orders]);

  const filtered = useMemo(()=>{
    let list = [...orders];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o =>
        String(o._id).toLowerCase().includes(q) ||
        (o.customer_name||"").toLowerCase().includes(q) ||
        (o.table||"").toLowerCase().includes(q) ||
        (o.mode||"").toLowerCase().includes(q)
      );
    }
    if (status !== "All Status") list = list.filter(o=>(o.status||"").toLowerCase()===status.toLowerCase());
    if (type !== "All Types") list = list.filter(o=>(o.mode||"").toLowerCase().includes(type.split(" ")[0].toLowerCase()));
    list.sort((a,b)=>{
      let av=a[sortF], bv=b[sortF];
      if (sortF==="createdAt"){av=new Date(av);bv=new Date(bv);}
      if (typeof av==="string") av=av.toLowerCase();
      if (typeof bv==="string") bv=bv.toLowerCase();
      if (av<bv) return sortD==="asc"?-1:1;
      if (av>bv) return sortD==="asc"?1:-1;
      return 0;
    });
    return list;
  },[orders,search,status,type,sortF,sortD]);

  const pages = Math.max(1,Math.ceil(filtered.length/PER));
  const rows  = filtered.slice((page-1)*PER, page*PER);

  const sort = f => { if(sortF===f) setSortD(d=>d==="asc"?"desc":"asc"); else{setSortF(f);setSortD("asc");} setPage(1); };

  const exportCSV = () => {
    const hdr = ["Order ID","Customer","Table","Type","Date","Status","Total (INR)"];
    const body = filtered.map(o=>[o._id,o.customer_name,o.table||"—",o.mode,fmt(o.createdAt),o.status,o.total]);
    const csv = [hdr,...body].map(r=>r.map(v=>`"${v}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"),{
      href: URL.createObjectURL(new Blob([csv],{type:"text/csv"})),
      download:`orders_${Date.now()}.csv`
    });
    a.click(); URL.revokeObjectURL(a.href);
  };

  const S = { // shorthand inline styles
    page: {flex:1,overflowY:"auto",background:"#fdf4ff",padding:"28px 32px",fontFamily:"'DM Sans',sans-serif"},
    card: {background:"#fff",border:"1px solid #ede9f6",borderRadius:14,padding:"18px 20px",display:"flex",alignItems:"flex-start",justifyContent:"space-between"},
    icon: {width:42,height:42,background:"#f3e8ff",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",color:"#9333ea",flexShrink:0},
    btn:  {display:"flex",alignItems:"center",gap:7,padding:"10px 18px",borderRadius:10,background:"#9333ea",color:"#fff",border:"none",cursor:"pointer",fontSize:13.5,fontWeight:600,whiteSpace:"nowrap"},
    tbl:  {width:"100%",borderCollapse:"collapse"},
    th:   {padding:"13px 18px",textAlign:"left",fontSize:13,fontWeight:500,color:"#71717a",cursor:"pointer",userSelect:"none",borderBottom:"1px solid #f0edf8",background:"#f9f9fb"},
    td:   {padding:"16px 18px",fontSize:14,color:"#374151",verticalAlign:"middle"},
    ddm:  {position:"absolute",top:"calc(100% + 6px)",right:0,background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:5,minWidth:170,boxShadow:"0 8px 30px rgba(0,0,0,0.10)",zIndex:200},
    ddi:  {padding:"8px 12px",borderRadius:7,cursor:"pointer",fontSize:13,color:"#374151",fontWeight:500,display:"flex",alignItems:"center",gap:8},
  };

  const statCards = [
    {lbl:"Total Revenue",  val:`₹${(computed.revenue||stats.totalRevenue||0).toLocaleString()}`,  sub:"12.5% Month", icon:"₹"},
    {lbl:"Total Order",    val:computed.total||stats.totalOrders||0,    sub:"8.2% Month",  icon:"📋"},
    {lbl:"Pending Order",  val:computed.pending||stats.pendingOrders||0,  sub:"15.3% Month", icon:"⏱"},
    {lbl:"Average Order",  val:`₹${(computed.avg||stats.averageOrder||0).toLocaleString()}`,  sub:"5.7% Month",  icon:"📈"},
    {lbl:"Completed Order",val:computed.completed||stats.completedOrders||0,sub:"10.2% Month",icon:"✓"},
  ];

  return (
    <div style={{display:"flex",height:"100vh",overflow:"hidden",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <Sidebar />
      <div style={S.page}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:26,flexWrap:"wrap",gap:12}}>
          <div>
            <h1 style={{fontSize:24,fontWeight:700,color:"#111",margin:0,marginBottom:4}}>Order History</h1>
            <p style={{fontSize:13,color:"#9ca3af",margin:0}}>Track and manage restaurant orders in one place</p>
          </div>
          <button style={S.btn} onClick={exportCSV}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Export
          </button>
        </div>

        {/* Stat Cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,marginBottom:28}}>
          {statCards.map(s=>(
            <div key={s.lbl} style={S.card}>
              <div>
                <div style={{fontSize:12,color:"#9ca3af",marginBottom:6}}>{s.lbl}</div>
                <div style={{fontSize:26,fontWeight:700,color:"#111",lineHeight:1,marginBottom:6}}>{s.val}</div>
                <div style={{fontSize:11,color:"#9ca3af"}}>VS last</div>
                <div style={{fontSize:12,color:"#374151",fontWeight:500,marginTop:1}}>{s.sub}</div>
              </div>
              <div style={S.icon}>{s.icon}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,flexWrap:"wrap"}}>
          {/* Search */}
          <div style={{flex:1,minWidth:220,display:"flex",alignItems:"center",gap:10,background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,padding:"10px 14px"}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input style={{flex:1,border:"none",outline:"none",fontSize:13.5,color:"#374151",background:"none"}}
              placeholder="Search here by Id, Order, customer or table..."
              value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
            />
            {search && <button onClick={()=>{setSearch("");setPage(1);}} style={{background:"none",border:"none",cursor:"pointer",color:"#aaa",fontSize:14}}>✕</button>}
          </div>

          {/* Status Filter */}
          <div style={{position:"relative"}} ref={sRef}>
            <button style={S.btn} onClick={()=>{setSOp(o=>!o);setFOp(false);}}>
              {status}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {statusOpen && (
              <div style={S.ddm}>
                {["All Status","Completed","Pending","Cancelled"].map(s=>(
                  <div key={s} style={{...S.ddi,background:status===s?"#f3e8ff":"transparent",color:status===s?"#9333ea":"#374151",fontWeight:status===s?600:500}}
                    onClick={()=>{setStatus(s);setSOp(false);setPage(1);}}>
                    {s!=="All Status" && <span style={{width:7,height:7,borderRadius:"50%",background:sc(s),display:"inline-block",flexShrink:0}}/>}
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filters */}
          <div style={{position:"relative"}} ref={fRef}>
            <button style={S.btn} onClick={()=>{setFOp(o=>!o);setSOp(false);}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/><line x1="21" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="3" y2="12"/><line x1="21" y1="20" x2="16" y2="20"/><line x1="12" y1="20" x2="3" y2="20"/><line x1="14" y1="2" x2="14" y2="6"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="16" y1="18" x2="16" y2="22"/></svg>
              Filters
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {filterOpen && (
              <div style={{...S.ddm,minWidth:200}}>
                <div style={{padding:"6px 12px 4px",fontSize:11,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>Order Type</div>
                {["All Types","Dine in","Take Away","Delivery"].map(t=>(
                  <div key={t} style={{...S.ddi,background:type===t?"#f3e8ff":"transparent",color:type===t?"#9333ea":"#374151"}}
                    onClick={()=>{setType(t);setPage(1);}}>{t}</div>
                ))}
                <div style={{borderTop:"1px solid #f3f4f6",margin:"4px 0"}}/>
                <div style={{padding:"6px 12px 4px",fontSize:11,color:"#9ca3af",fontWeight:700,textTransform:"uppercase",letterSpacing:0.5}}>Sort By</div>
                {[["createdAt","Date"],["total","Amount"],["customer_name","Customer"]].map(([f,l])=>(
                  <div key={f} style={{...S.ddi,background:sortF===f?"#f3e8ff":"transparent",color:sortF===f?"#9333ea":"#374151"}}
                    onClick={()=>{sort(f);}}>
                    {l} {sortF===f&&(sortD==="asc"?"↑":"↓")}
                  </div>
                ))}
                <div style={{borderTop:"1px solid #f3f4f6",margin:"4px 0"}}/>
                <div style={{...S.ddi,color:"#ef4444"}}
                  onClick={()=>{setType("All Types");setStatus("All Status");setSearch("");setSortF("createdAt");setSortD("desc");setFOp(false);setPage(1);}}>
                  Reset Filters
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{background:"#fff",borderRadius:14,overflow:"hidden",border:"1px solid #ede9f6"}}>
          {loading ? (
            <div style={{padding:60,textAlign:"center",color:"#9ca3af",fontSize:14}}>Loading orders…</div>
          ) : filtered.length===0 ? (
            <div style={{padding:60,textAlign:"center",color:"#9ca3af",fontSize:14}}>No orders found.</div>
          ) : (
            <>
              <table style={S.tbl}>
                <thead>
                  <tr>
                    {[["_id","Order ID"],["customer_name","Customer"],["mode","Type"],["createdAt","Date"],["status","Status"],["total","Total"]].map(([f,l])=>(
                      <th key={l} style={S.th} onClick={()=>sort(f)}>
                        {l} <span style={{color:sortF===f?"#9333ea":"#d1d5db",marginLeft:3}}>{sortF===f?(sortD==="asc"?"↑":"↓"):"↕"}</span>
                      </th>
                    ))}
                    <th style={S.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((o,i)=>(
                    <tr key={String(o._id)+i} style={{borderBottom:"1px solid #faf5ff",transition:"background 0.1s"}}
                      onMouseEnter={e=>e.currentTarget.style.background="#fdf9ff"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={S.td}><span style={{fontWeight:500,color:"#111"}}>{o._id}</span></td>
                      <td style={S.td}>
                        <div style={{fontWeight:400,color:"#374151"}}>{o.customer_name}</div>
                        {o.table&&o.table!=="—"&&<div style={{fontSize:12,color:"#9ca3af",marginTop:2}}>{o.table}</div>}
                      </td>
                      <td style={S.td}>{o.mode}</td>
                      <td style={{...S.td,fontSize:13}}>{fmt(o.createdAt)}</td>
                      <td style={S.td}><span style={{color:sc(o.status),fontWeight:500}}>{o.status}</span></td>
                      <td style={S.td}>₹{(o.total||0).toLocaleString()}</td>
                      <td style={S.td}>
                        <button onClick={()=>setView(o)} style={{background:"#f3e8ff",border:"none",borderRadius:7,padding:"5px 12px",cursor:"pointer",color:"#9333ea",fontSize:12,fontWeight:600}}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderTop:"1px solid #f3f4f6",flexWrap:"wrap",gap:8}}>
                <span style={{fontSize:13,color:"#9ca3af"}}>
                  Showing {Math.min((page-1)*PER+1,filtered.length)}–{Math.min(page*PER,filtered.length)} of {filtered.length} orders
                </span>
                <div style={{display:"flex",gap:5}}>
                  {[["«",()=>setPage(1)],["‹",()=>setPage(p=>p-1)]].map(([l,fn])=>(
                    <button key={l} onClick={fn} disabled={page===1} style={{width:32,height:32,borderRadius:7,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:13,opacity:page===1?0.3:1}}>{l}</button>
                  ))}
                  {Array.from({length:Math.min(pages,5)},(_,i)=>{
                    const p=page<=3?i+1:page-2+i;
                    if(p<1||p>pages) return null;
                    return <button key={p} onClick={()=>setPage(p)} style={{width:32,height:32,borderRadius:7,border:"1px solid",borderColor:page===p?"#9333ea":"#e5e7eb",background:page===p?"#9333ea":"#fff",color:page===p?"#fff":"#374151",cursor:"pointer",fontSize:13,fontWeight:page===p?700:500}}>{p}</button>;
                  })}
                  {[["›",()=>setPage(p=>p+1)],["»",()=>setPage(pages)]].map(([l,fn])=>(
                    <button key={l} onClick={fn} disabled={page===pages} style={{width:32,height:32,borderRadius:7,border:"1px solid #e5e7eb",background:"#fff",cursor:"pointer",fontSize:13,opacity:page===pages?0.3:1}}>{l}</button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {view && <Modal order={view} onClose={()=>setView(null)}/>}
    </div>
  );
}