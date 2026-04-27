import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

/* ── Settings sub-nav icons ───────────────────────────────────────────────── */
const SettingsIcons = {
  General:       () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  Account:       () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Notifications: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Billing:       () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Security:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Team:          () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Appearance:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Store:         () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Globe:         () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  Phone:         () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.66-.66a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  Mail:          () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Building:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>,
  ChevDown:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Save:          () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
};

const SETTINGS_NAV = [
  { id: "general",       label: "General",       Icon: SettingsIcons.General       },
  { id: "account",       label: "Account",       Icon: SettingsIcons.Account       },
  { id: "notifications", label: "Notifications", Icon: SettingsIcons.Notifications },
  { id: "billing",       label: "Billing",       Icon: SettingsIcons.Billing       },
  { id: "security",      label: "Security",      Icon: SettingsIcons.Security      },
  { id: "team",          label: "Team",          Icon: SettingsIcons.Team          },
  { id: "appearance",    label: "Appearance",    Icon: SettingsIcons.Appearance    },
];

const CURRENCIES = ["INR (₹)", "USD ($)", "EUR (€)", "GBP (£)", "AED (د.إ)", "SGD (S$)"];
const TIMEZONES  = ["(GMT+05:30) Mumbai", "(GMT+00:00) London", "(GMT-05:00) New York", "(GMT+08:00) Singapore", "(GMT+04:00) Dubai"];
const LANGUAGES  = ["English (United Kingdom)", "English (United States)", "Hindi", "French", "German", "Spanish"];

const INIT = () => {
  try {
    return JSON.parse(localStorage.getItem("billbite_settings") || "null") || {
      storeName: "BillBite-Downtown",
      phone:     "+1 (555) 000-0000",
      email:     "Manager@billbite.com",
      currency:  "INR (₹)",
      timezone:  "(GMT+05:30) Mumbai",
      language:  "English (United Kingdom)",
    };
  } catch { return { storeName:"BillBite-Downtown", phone:"+1 (555) 000-0000", email:"Manager@billbite.com", currency:"INR (₹)", timezone:"(GMT+05:30) Mumbai", language:"English (United Kingdom)" }; }
};

/* ── Select component ────────────────────────────────────────────────────── */
function Select({ value, onChange, options }) {
  return (
    <div style={{ position:"relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width:"100%", padding:"11px 36px 11px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, color:"#374151", background:"#fff", outline:"none", appearance:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
        onFocus={e => { e.target.style.borderColor = "#9333ea"; }}
        onBlur={e  => { e.target.style.borderColor = "#e5e7eb"; }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none", color:"#9ca3af" }}>
        <SettingsIcons.ChevDown />
      </span>
    </div>
  );
}

/* ── Input component ─────────────────────────────────────────────────────── */
function Input({ value, onChange, placeholder, prefix }) {
  return (
    <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
      {prefix && (
        <span style={{ position:"absolute", left:12, color:"#9ca3af", display:"flex", alignItems:"center" }}>{prefix}</span>
      )}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width:"100%", padding:`11px 14px 11px ${prefix ? "34px" : "14px"}`, border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, color:"#374151", background:"#fff", outline:"none", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box" }}
        onFocus={e => { e.target.style.borderColor = "#9333ea"; }}
        onBlur={e  => { e.target.style.borderColor = "#e5e7eb"; }}
      />
    </div>
  );
}

/* ── Placeholder for unbuilt sections ───────────────────────────────────── */
/* NOTE: Replace <ComingSoon> in renderSection() below to build each section */
function ComingSoon({ label }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:320, color:"#9ca3af", gap:12 }}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <div style={{ fontSize:16, fontWeight:600, color:"#374151" }}>{label}</div>
      <div style={{ fontSize:13 }}>This section will be available soon</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ACCOUNT SETTINGS
   Figma: node-id=1-2021
   Fields: avatar, fullName, email, currentRole (read-only)
   Danger zone: Delete Account
   Storage key: "billbite_account"
   ════════════════════════════════════════════════════════════════════════════ */
const INIT_ACCOUNT = () => {
  try {
    return JSON.parse(localStorage.getItem("billbite_account") || "null") || {
      fullName:    "Floyd Miles",
      email:       "Floyd.miles@example.com",
      role:        "Store Manager",
      avatarColor: "#9333ea",
      avatarText:  "DG",
      avatarUrl:   "",
    };
  } catch {
    return { fullName:"Floyd Miles", email:"Floyd.miles@example.com", role:"Store Manager", avatarColor:"#9333ea", avatarText:"DG", avatarUrl:"" };
  }
};

function AccountSettings() {
  const [form,    setForm]    = useState(INIT_ACCOUNT);
  const [changed, setChanged] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [confirm, setConfirm] = useState(false); // delete confirm modal

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setChanged(true); setSaved(false); };

  /* Avatar file pick — preview only, stores as base64 in localStorage */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800 * 1024) { alert("Max file size is 800 KB"); return; }
    const reader = new FileReader();
    reader.onload = ev => set("avatarUrl", ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => set("avatarUrl", "");

  const handleSave = () => {
    localStorage.setItem("billbite_account", JSON.stringify(form));
    /* Also update the user display name used by Sidebar */
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      const initials = form.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2);
      localStorage.setItem("user", JSON.stringify({ ...u, name: form.fullName, initials }));
    } catch {}
    setSaved(true); setChanged(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => { setForm(INIT_ACCOUNT()); setChanged(false); setSaved(false); };

  /* Delete account — clears localStorage and would call API in production */
  const handleDeleteAccount = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  /* Derive initials from name for avatar fallback */
  const initials = form.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"32px 36px", background:"#fdf4ff" }}>
      {/* ── Header ── */}
      <h1 style={{ fontSize:22, fontWeight:700, color:"#111", margin:"0 0 28px" }}>Account Settings</h1>

      {/* ── Personal Information card ── */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"28px", marginBottom:20 }}>
        {/* Section title */}
        <div style={{ fontSize:17, fontWeight:700, color:"#111", marginBottom:4 }}>Personal Information</div>
        <div style={{ fontSize:13, color:"#9ca3af", marginBottom:24 }}>Manage your profile details and role configuration.</div>

        {/* Avatar row */}
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:28 }}>
          {/* Avatar circle with edit pencil */}
          <div style={{ position:"relative", flexShrink:0 }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background: form.avatarUrl ? "transparent" : "#f3e8ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, fontWeight:700, color:"#9333ea", overflow:"hidden", border:"2px solid #ede9f6" }}>
              {form.avatarUrl
                ? <img src={form.avatarUrl} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : initials
              }
            </div>
            {/* Pencil edit button */}
            <label htmlFor="avatar-input" style={{ position:"absolute", bottom:0, right:0, width:22, height:22, borderRadius:"50%", background:"#9333ea", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", border:"2px solid #fff" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </label>
            <input id="avatar-input" type="file" accept="image/jpeg,image/gif,image/png" style={{ display:"none" }} onChange={handleAvatarChange} />
          </div>
          {/* Avatar info */}
          <div>
            <div style={{ fontSize:14, fontWeight:600, color:"#111", marginBottom:4 }}>Profile Picture</div>
            <div style={{ fontSize:12, color:"#9ca3af", marginBottom:10 }}>Supports JPG, GIF, PNG. Max size of 800k</div>
            <div style={{ display:"flex", gap:10 }}>
              <label htmlFor="avatar-input" style={{ padding:"7px 16px", borderRadius:8, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:13, fontWeight:500, color:"#374151", cursor:"pointer" }}>
                Change Avatar
              </label>
              {form.avatarUrl && (
                <button onClick={handleRemoveAvatar} style={{ padding:"7px 14px", borderRadius:8, border:"none", background:"none", fontSize:13, fontWeight:500, color:"#ef4444", cursor:"pointer" }}>Remove</button>
              )}
            </div>
          </div>
        </div>

        {/* Full Name + Email */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:7 }}>Full Name</label>
            <Input value={form.fullName} onChange={v => set("fullName", v)} placeholder="Floyd Miles" />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:7 }}>Email Address</label>
            <Input value={form.email} onChange={v => set("email", v)} placeholder="Floyd.miles@example.com" />
          </div>
        </div>

        {/* Current Role (read-only) */}
        <div style={{ marginBottom:6 }}>
          <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:7 }}>Current Role</label>
          <div style={{ position:"relative" }}>
            <input
              value={form.role}
              readOnly
              style={{ width:"100%", padding:"11px 90px 11px 14px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, color:"#374151", background:"#f9fafb", outline:"none", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", cursor:"default" }}
            />
            <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:12, fontWeight:600, color:"#16a34a", background:"#dcfce7", padding:"3px 10px", borderRadius:20 }}>Active</span>
          </div>
          <p style={{ fontSize:12, color:"#9ca3af", marginTop:6 }}>Role changes require administrator approval</p>
        </div>

        {/* Cancel / Save buttons */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:12, marginTop:24 }}>
          <button
            onClick={handleCancel}
            style={{ padding:"10px 24px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:14, fontWeight:600, color:"#374151", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
          >Cancel</button>
          <button
            onClick={handleSave}
            style={{ padding:"10px 24px", borderRadius:10, border:"none", background: saved ? "#16a34a" : "#9333ea", fontSize:14, fontWeight:600, color:"#fff", cursor:"pointer", transition:"background .2s", fontFamily:"'DM Sans',sans-serif" }}
          >{saved ? "Saved!" : "Save Change"}</button>
        </div>
      </div>

      {/* ── Danger Zone: Delete Account ── */}
      {/* NOTE: In production connect handleDeleteAccount to DELETE /api/auth/account */}
      <div style={{ background:"#fff5f5", border:"1.5px solid #fecaca", borderRadius:16, padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:"#ef4444", marginBottom:4 }}>Deleted Account</div>
          <div style={{ fontSize:13, color:"#6b7280" }}>Permanently remove your account and all of its data from our servers</div>
        </div>
        <button
          onClick={() => setConfirm(true)}
          style={{ padding:"9px 20px", borderRadius:10, border:"1.5px solid #ef4444", background:"#fff", fontSize:13, fontWeight:600, color:"#ef4444", cursor:"pointer", flexShrink:0, fontFamily:"'DM Sans',sans-serif" }}
        >Delete Account</button>
      </div>

      {/* ── Confirm Delete modal ── */}
      {confirm && (
        <div onClick={() => setConfirm(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:16, padding:28, width:380, maxWidth:"90vw", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize:18, fontWeight:700, color:"#111", marginBottom:8 }}>Delete Account?</div>
            <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>This action is <strong>irreversible</strong>. All your data will be permanently removed.</p>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={() => setConfirm(false)} style={{ padding:"9px 20px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:13, fontWeight:600, color:"#374151", cursor:"pointer" }}>Cancel</button>
              <button onClick={handleDeleteAccount} style={{ padding:"9px 20px", borderRadius:10, border:"none", background:"#ef4444", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer" }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/* ═ END ACCOUNT SETTINGS ════════════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════════════
   NOTIFICATIONS SETTINGS
   Figma: node-id=1-2143
   Channels: Email, Push (browser), SMS
   Categories: New Orders, Order Updates, Low Stock, Payments, Staff, System
   Storage key: "billbite_notifications"
   NOTE: In production wire channel toggles to a POST /api/settings/notifications
════════════════════════════════════════════════════════════════════════════ */
const NOTIF_DEFAULTS = {
  /* Channel master toggles */
  emailEnabled: true,
  pushEnabled:  true,
  smsEnabled:   false,
  /* Per-category: [email, push, sms] */
  newOrder:     { email:true,  push:true,  sms:false },
  orderUpdate:  { email:true,  push:true,  sms:false },
  lowStock:     { email:true,  push:false, sms:false },
  payment:      { email:true,  push:true,  sms:true  },
  staff:        { email:false, push:false, sms:false },
  system:       { email:true,  push:true,  sms:false },
};

const INIT_NOTIF = () => {
  try { return JSON.parse(localStorage.getItem("billbite_notifications") || "null") || NOTIF_DEFAULTS; }
  catch { return NOTIF_DEFAULTS; }
};

/* Reusable toggle switch */
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width:44, height:24, borderRadius:12, border:"none", cursor:"pointer",
        background: checked ? "#9333ea" : "#e5e7eb",
        position:"relative", flexShrink:0, transition:"background .2s",
        padding:0,
      }}
    >
      <span style={{
        position:"absolute", top:3, left: checked ? 23 : 3,
        width:18, height:18, borderRadius:"50%", background:"#fff",
        transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,0.18)",
      }} />
    </button>
  );
}

/* One notification row: label + description + 3 channel toggles */
function NotifRow({ label, desc, vals, onChange, channels }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr repeat(3,72px)", alignItems:"center", gap:8, padding:"14px 0", borderBottom:"1px solid #f3f4f6" }}>
      <div>
        <div style={{ fontSize:14, fontWeight:600, color:"#111" }}>{label}</div>
        {desc && <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{desc}</div>}
      </div>
      {/* email */}
      <div style={{ display:"flex", justifyContent:"center" }}>
        <Toggle checked={vals.email && channels.email} onChange={v => onChange("email", v)} />
      </div>
      {/* push */}
      <div style={{ display:"flex", justifyContent:"center" }}>
        <Toggle checked={vals.push && channels.push} onChange={v => onChange("push", v)} />
      </div>
      {/* sms */}
      <div style={{ display:"flex", justifyContent:"center" }}>
        <Toggle checked={vals.sms && channels.sms} onChange={v => onChange("sms", v)} />
      </div>
    </div>
  );
}

function NotificationsSettings() {
  const [prefs,   setPrefs]   = useState(INIT_NOTIF);
  const [saved,   setSaved]   = useState(false);
  const [changed, setChanged] = useState(false);

  const setChannel = (ch, v) => {
    setPrefs(p => ({ ...p, [`${ch}Enabled`]: v }));
    setChanged(true); setSaved(false);
  };

  const setRow = (key, ch, v) => {
    setPrefs(p => ({ ...p, [key]: { ...p[key], [ch]: v } }));
    setChanged(true); setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("billbite_notifications", JSON.stringify(prefs));
    setSaved(true); setChanged(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDiscard = () => { setPrefs(INIT_NOTIF()); setChanged(false); setSaved(false); };

  const channels = { email: prefs.emailEnabled, push: prefs.pushEnabled, sms: prefs.smsEnabled };

  /* Rows config — add/remove rows here to extend notification categories */
  const ROWS = [
    { key:"newOrder",    label:"New Orders",           desc:"When a new order is placed"                },
    { key:"orderUpdate", label:"Order Status Updates",  desc:"When an order status changes"             },
    { key:"lowStock",    label:"Low Stock Alerts",      desc:"When inventory falls below threshold"      },
    { key:"payment",     label:"Payment Confirmations", desc:"When a payment is received or fails"       },
    { key:"staff",       label:"Staff Updates",         desc:"Staff login, role changes, shifts"         },
    { key:"system",      label:"System Alerts",         desc:"App updates, outages, critical errors"     },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"32px 36px", background:"#fdf4ff" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111", margin:0, marginBottom:6 }}>Notification Settings</h1>
          <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>Manage how and when you receive alerts and updates</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={handleDiscard} disabled={!changed}
            style={{ padding:"10px 22px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:14, fontWeight:600, color:"#374151", cursor: changed?"pointer":"not-allowed", opacity:changed?1:0.5, fontFamily:"'DM Sans',sans-serif" }}>
            Discard
          </button>
          <button onClick={handleSave}
            style={{ padding:"10px 22px", borderRadius:10, border:"none", background:saved?"#16a34a":"#9333ea", fontSize:14, fontWeight:600, color:"#fff", cursor:"pointer", transition:"background .2s", fontFamily:"'DM Sans',sans-serif" }}>
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Channel toggles card */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"24px 28px", marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:700, color:"#111", marginBottom:4 }}>Notification Channels</div>
        <div style={{ fontSize:13, color:"#9ca3af", marginBottom:20 }}>Enable or disable entire delivery channels</div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {[
            { key:"email", label:"Email Notifications",         desc:"Receive alerts via email"                   },
            { key:"push",  label:"Push Notifications",          desc:"Browser / app push alerts"                  },
            { key:"sms",   label:"SMS Notifications",           desc:"Text message alerts (carrier rates may apply)"},
          ].map(ch => (
            <div key={ch.key} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", borderRadius:12, background: prefs[`${ch.key}Enabled`] ? "#faf5ff" : "#f9fafb", border:`1.5px solid ${prefs[`${ch.key}Enabled`] ? "#e9d5ff" : "#f3f4f6"}`, transition:"all .2s" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:"#111" }}>{ch.label}</div>
                <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{ch.desc}</div>
              </div>
              <Toggle checked={prefs[`${ch.key}Enabled`]} onChange={v => setChannel(ch.key, v)} />
            </div>
          ))}
        </div>
      </div>

      {/* Per-category matrix card */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"24px 28px" }}>
        <div style={{ fontSize:16, fontWeight:700, color:"#111", marginBottom:4 }}>Notification Preferences</div>
        <div style={{ fontSize:13, color:"#9ca3af", marginBottom:16 }}>Choose which events trigger alerts per channel</div>

        {/* Column headers */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr repeat(3,72px)", gap:8, paddingBottom:10, borderBottom:"2px solid #f0e9ff" }}>
          <div style={{ fontSize:12, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:.5 }}>Event</div>
          {["Email","Push","SMS"].map(c => (
            <div key={c} style={{ fontSize:12, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:.5, textAlign:"center" }}>{c}</div>
          ))}
        </div>

        {/* Rows */}
        {ROWS.map(r => (
          <NotifRow
            key={r.key}
            label={r.label}
            desc={r.desc}
            vals={prefs[r.key]}
            channels={channels}
            onChange={(ch, v) => setRow(r.key, ch, v)}
          />
        ))}

        <p style={{ fontSize:12, color:"#9ca3af", marginTop:12 }}>
          ⚠ Toggling a channel off above disables it for all categories regardless of row settings.
        </p>
      </div>
    </div>
  );
}
/* ═ END NOTIFICATIONS SETTINGS ═════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════════════
   BILLING SETTINGS
   Figma: node-id=1-2306
   Sections: Current Plan, Payment Method, Billing History
   Storage key: "billbite_billing"
   NOTE: In production replace dummy invoice data with GET /api/billing/invoices
         and connect plan upgrade to POST /api/billing/upgrade
════════════════════════════════════════════════════════════════════════════ */

/* Dummy invoice rows — replace with API data in production */
const DUMMY_INVOICES = [
  { id:"INV-2024-012", date:"Dec 1, 2024",  desc:"Professional Plan — Monthly", amount:"₹2,999", status:"paid"    },
  { id:"INV-2024-011", date:"Nov 1, 2024",  desc:"Professional Plan — Monthly", amount:"₹2,999", status:"paid"    },
  { id:"INV-2024-010", date:"Oct 1, 2024",  desc:"Professional Plan — Monthly", amount:"₹2,999", status:"paid"    },
  { id:"INV-2024-009", date:"Sep 1, 2024",  desc:"Professional Plan — Monthly", amount:"₹2,999", status:"paid"    },
  { id:"INV-2024-008", date:"Aug 1, 2024",  desc:"Starter Plan — Monthly",      amount:"₹999",  status:"paid"    },
];

const INIT_BILLING = () => {
  try {
    return JSON.parse(localStorage.getItem("billbite_billing") || "null") || {
      plan:       "Professional",
      cycle:      "Monthly",
      price:      "₹2,999",
      nextDate:   "Jan 1, 2025",
      cardBrand:  "Visa",
      cardLast4:  "4242",
      cardExpiry: "08 / 26",
      cardName:   "Floyd Miles",
    };
  } catch { return {}; }
};

function BillingSettings() {
  const [billing] = useState(INIT_BILLING);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [upgradeMsg,    setUpgradeMsg]    = useState(false);

  /* Download invoice as a simple text receipt (replace with PDF in production) */
  const downloadInvoice = (inv) => {
    const content = `BILLBITE INVOICE\n\nID: ${inv.id}\nDate: ${inv.date}\nDescription: ${inv.desc}\nAmount: ${inv.amount}\nStatus: ${inv.status.toUpperCase()}`;
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([content], { type: "text/plain" })),
      download: `${inv.id}.txt`,
    });
    a.click();
  };

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"32px 36px", background:"#fdf4ff" }}>
      {/* Header */}
      <h1 style={{ fontSize:22, fontWeight:700, color:"#111", margin:"0 0 28px" }}>Billing Settings</h1>

      {/* ── Current Plan card */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"24px 28px", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span style={{ fontSize:16, fontWeight:700, color:"#111" }}>Current Plan</span>
        </div>
        <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 20px" }}>Your active subscription and renewal details</p>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:"#f3e8ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>⭐</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:18, fontWeight:700, color:"#111" }}>{billing.plan} Plan</span>
                <span style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:20, background:"#dcfce7", color:"#16a34a" }}>Active</span>
              </div>
              <div style={{ fontSize:13, color:"#9ca3af", marginTop:4 }}>{billing.cycle} · Next renewal: {billing.nextDate}</div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:26, fontWeight:700, color:"#111" }}>{billing.price}<span style={{ fontSize:14, color:"#9ca3af", fontWeight:400 }}>/mo</span></div>
            <div style={{ display:"flex", gap:8, marginTop:10, justifyContent:"flex-end" }}>
              <button
                onClick={() => { setUpgradeMsg(true); setTimeout(() => setUpgradeMsg(false), 2500); }}
                style={{ padding:"8px 18px", borderRadius:9, border:"none", background:"#9333ea", color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
              >{upgradeMsg ? "Coming soon!" : "Upgrade Plan"}</button>
              <button
                onClick={() => setCancelConfirm(true)}
                style={{ padding:"8px 18px", borderRadius:9, border:"1.5px solid #e5e7eb", background:"#fff", color:"#ef4444", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
              >Cancel Plan</button>
            </div>
          </div>
        </div>

        {/* Plan features */}
        <div style={{ marginTop:20, display:"flex", gap:20, flexWrap:"wrap" }}>
          {["Unlimited Orders","5 Staff Accounts","KDS Integration","Priority Support","CSV Export"].map(f => (
            <div key={f} style={{ display:"flex", alignItems:"center", gap:6, fontSize:13, color:"#374151" }}>
              <span style={{ color:"#9333ea", fontSize:16 }}>✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      {/* ── Payment Method card */}
      {/* NOTE: Wire Update Card button to Stripe/Razorpay payment-method update flow */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"24px 28px", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:"#111", marginBottom:4 }}>Payment Method</div>
            <div style={{ fontSize:13, color:"#9ca3af" }}>Card used for your subscription billing</div>
          </div>
          <button style={{ padding:"8px 16px", borderRadius:9, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:13, fontWeight:500, color:"#374151", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
            Update Card
          </button>
        </div>

        {/* ── Realistic card widget matching Figma screenshot ── */}
        <div style={{
          width: "100%", maxWidth: 340,
          aspectRatio: "1.586 / 1",           /* standard card ratio */
          borderRadius: 20,
          background: "linear-gradient(135deg, #ff4d00 0%, #ff6a1a 55%, #ff8c3a 100%)",
          padding: "22px 24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 16px 48px rgba(255,77,0,0.35)",
          userSelect: "none",
        }}>
          {/* Decorative circles */}
          <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <div style={{ position:"absolute", bottom:-60, left:-30, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />

          {/* Top row — SIM + NFC */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
            {/* SIM chip icon */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect x="2" y="2" width="32" height="32" rx="6" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8"/>
              <rect x="8" y="8" width="20" height="20" rx="3" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
              <line x1="8" y1="15" x2="28" y2="15" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
              <line x1="8" y1="21" x2="28" y2="21" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
              <line x1="15" y1="8" x2="15" y2="28" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
              <line x1="21" y1="8" x2="21" y2="28" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2"/>
            </svg>
            {/* NFC / contactless icon */}
            <div style={{ width:32, height:32, borderRadius:8, border:"1.5px solid rgba(255,255,255,0.5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
          </div>

          {/* Card number */}
          <div style={{ fontSize:18, fontWeight:600, letterSpacing:4, color:"rgba(255,255,255,0.95)", position:"relative" }}>
            ••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;{billing.cardLast4}
          </div>

          {/* Bottom row — Expires + Brand + Default */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", position:"relative" }}>
            <div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)", textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>Expires</div>
              <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{billing.cardExpiry}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:15, fontWeight:700, color:"#fff", letterSpacing:0.5, marginBottom:5 }}>{billing.cardBrand}</div>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 10px", borderRadius:20, background:"rgba(255,255,255,0.22)", color:"#fff", border:"1px solid rgba(255,255,255,0.35)" }}>
                Default
              </span>
            </div>
          </div>
        </div>
        {/* Cardholder name below card */}
        <div style={{ marginTop:12, fontSize:13, color:"#6b7280" }}>
          {billing.cardName} &nbsp;·&nbsp; {billing.cardBrand} ending in {billing.cardLast4}
        </div>
      </div>

      {/* ── Billing History table */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, overflow:"hidden" }}>
        <div style={{ padding:"20px 28px", borderBottom:"1px solid #f3f4f6" }}>
          <div style={{ fontSize:16, fontWeight:700, color:"#111", marginBottom:2 }}>Billing History</div>
          <div style={{ fontSize:13, color:"#9ca3af" }}>Download past invoices</div>
        </div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f9fafb" }}>
              {["Invoice","Date","Description","Amount","Status",""].map(h => (
                <th key={h} style={{ padding:"12px 20px", textAlign:"left", fontSize:12, fontWeight:600, color:"#6b7280", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DUMMY_INVOICES.map((inv, i) => (
              <tr key={inv.id} style={{ borderTop:"1px solid #f9fafb" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fdf9ff"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding:"14px 20px", fontSize:13, fontWeight:600, color:"#374151" }}>{inv.id}</td>
                <td style={{ padding:"14px 20px", fontSize:13, color:"#6b7280" }}>{inv.date}</td>
                <td style={{ padding:"14px 20px", fontSize:13, color:"#374151" }}>{inv.desc}</td>
                <td style={{ padding:"14px 20px", fontSize:13, fontWeight:600, color:"#111" }}>{inv.amount}</td>
                <td style={{ padding:"14px 20px" }}>
                  <span style={{ fontSize:12, fontWeight:600, padding:"3px 10px", borderRadius:20,
                    background: inv.status==="paid" ? "#dcfce7" : "#fef3c7",
                    color:      inv.status==="paid" ? "#16a34a" : "#92400e" }}>
                    {inv.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </td>
                <td style={{ padding:"14px 20px" }}>
                  <button onClick={() => downloadInvoice(inv)}
                    style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", fontSize:12, fontWeight:500, color:"#374151", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Cancel confirm modal */}
      {cancelConfirm && (
        <div onClick={() => setCancelConfirm(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}>
          <div onClick={e => e.stopPropagation()} style={{ background:"#fff", borderRadius:16, padding:28, width:380, maxWidth:"90vw", boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize:18, fontWeight:700, color:"#111", marginBottom:8 }}>Cancel Subscription?</div>
            <p style={{ fontSize:14, color:"#6b7280", marginBottom:24 }}>Your plan will remain active until <strong>{billing.nextDate}</strong>. After that, your account will revert to the free tier.</p>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={() => setCancelConfirm(false)} style={{ padding:"9px 20px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:13, fontWeight:600, color:"#374151", cursor:"pointer" }}>Keep Plan</button>
              <button onClick={() => setCancelConfirm(false)} style={{ padding:"9px 20px", borderRadius:10, border:"none", background:"#ef4444", fontSize:13, fontWeight:600, color:"#fff", cursor:"pointer" }}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
/* ═ END BILLING SETTINGS ════════════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════════════
   SECURITY SETTINGS
   Figma: node-id=1-394
   Sections: Change Password, Two-Factor Authentication
   Storage key: passwords are NEVER stored — only hashed server-side
   NOTE: In production:
     - Change Password  → POST /api/auth/change-password  { currentPassword, newPassword }
     - Enable 2FA       → POST /api/auth/2fa/enable  (returns QR code / TOTP secret)
     - Disable 2FA      → POST /api/auth/2fa/disable
════════════════════════════════════════════════════════════════════════════ */

/* PwdField MUST be defined at top-level (outside SecuritySettings) so React
   doesn't create a new component type on every render, which would cause the
   input to lose focus after each keystroke.                                  */
function PwdField({ label, fieldKey, value, show, onChange, onToggleShow, placeholder }) {
  return (
    <div>
      {label && <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:7 }}>{label}</label>}
      <div style={{ position:"relative" }}>
        <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", display:"flex" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width:"100%", padding:"11px 40px 11px 34px", border:"1.5px solid #e5e7eb", borderRadius:10, fontSize:14, color:"#374151", outline:"none", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", background:"#fff" }}
          onFocus={e => { e.target.style.borderColor = "#9333ea"; }}
          onBlur={e  => { e.target.style.borderColor = "#e5e7eb"; }}
        />
        <button
          type="button"
          onClick={onToggleShow}
          style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9ca3af", display:"flex" }}
        >
          {show
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          }
        </button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [pwd,    setPwd]    = useState({ current:"", next:"", confirm:"" });
  const [pwdErr, setPwdErr] = useState("");
  const [pwdOk,  setPwdOk]  = useState(false);
  const [show,   setShow]   = useState({ current:false, next:false, confirm:false });

  const [twoFA,    setTwoFA]    = useState(() => {
    try { return JSON.parse(localStorage.getItem("billbite_2fa") || "false"); } catch { return false; }
  });
  const [twoFAMsg, setTwoFAMsg] = useState("");

  const setP       = (k, v) => { setPwd(p => ({ ...p, [k]:v })); setPwdErr(""); setPwdOk(false); };
  const toggleShow = (k)    => setShow(s => ({ ...s, [k]:!s[k] }));

  const handleUpdatePassword = () => {
    if (!pwd.current)             return setPwdErr("Please enter your current password.");
    if (pwd.next.length < 8)      return setPwdErr("New password must be at least 8 characters.");
    if (pwd.next !== pwd.confirm) return setPwdErr("Passwords do not match.");
    /* NOTE: Replace with POST /api/auth/change-password { currentPassword, newPassword } */
    setPwdOk(true);
    setPwd({ current:"", next:"", confirm:"" });
    setTimeout(() => setPwdOk(false), 2500);
  };

  const handleToggle2FA = () => {
    const next = !twoFA;
    setTwoFA(next);
    localStorage.setItem("billbite_2fa", JSON.stringify(next));
    setTwoFAMsg(next ? "2FA enabled! Connect to authenticator app in production." : "2FA disabled.");
    setTimeout(() => setTwoFAMsg(""), 3000);
  };

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"32px 36px", background:"#fdf4ff" }}>
      {/* Header */}
      <h1 style={{ fontSize:22, fontWeight:700, color:"#111", margin:"0 0 6px" }}>Security Settings</h1>
      <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 28px" }}>Manage your security preferences and configurations</p>

      {/* ── Change Password card */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"24px 28px", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span style={{ fontSize:16, fontWeight:700, color:"#111" }}>Change Password</span>
        </div>
        <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 22px" }}>Ensure your account is using a long, random password to stay secure</p>

        {/* Current password */}
        <div style={{ marginBottom:16 }}>
          <PwdField
            label="Current Password"
            fieldKey="current"
            value={pwd.current}
            show={show.current}
            onChange={v => setP("current", v)}
            onToggleShow={() => toggleShow("current")}
            placeholder="Enter current password"
          />
        </div>

        {/* New + Confirm */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:8 }}>
          <PwdField
            label="New Password"
            fieldKey="next"
            value={pwd.next}
            show={show.next}
            onChange={v => setP("next", v)}
            onToggleShow={() => toggleShow("next")}
            placeholder="Min 8 Characters"
          />
          <PwdField
            label="Confirm New Password"
            fieldKey="confirm"
            value={pwd.confirm}
            show={show.confirm}
            onChange={v => setP("confirm", v)}
            onToggleShow={() => toggleShow("confirm")}
            placeholder="Match New Password"
          />
        </div>

        {/* Error / success messages */}
        {pwdErr && <p style={{ fontSize:13, color:"#ef4444", margin:"0 0 12px" }}>⚠ {pwdErr}</p>}
        {pwdOk  && <p style={{ fontSize:13, color:"#16a34a", margin:"0 0 12px" }}>✓ Password updated successfully!</p>}

        {/* Action buttons */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:12, marginTop:16 }}>
          <button
            onClick={() => { setPwd({ current:"", next:"", confirm:"" }); setPwdErr(""); setPwdOk(false); }}
            style={{ padding:"10px 24px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:14, fontWeight:600, color:"#374151", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
          >Cancel</button>
          <button
            onClick={handleUpdatePassword}
            style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 24px", borderRadius:10, border:"none", background:"#9333ea", fontSize:14, fontWeight:600, color:"#fff", cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Update Password
          </button>
        </div>
      </div>

      {/* ── Two-Factor Authentication card */}
      {/* NOTE: In production, Enable 2FA should show a QR code (TOTP) for the user to scan */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"24px 28px" }}>
        <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div style={{ flex:1, minWidth:220 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span style={{ fontSize:16, fontWeight:700, color:"#111" }}>Two-Factor Authentication</span>
            </div>
            <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 16px", maxWidth:460, lineHeight:1.6 }}>
              Add an extra layer of security to your account by requiring more than just a password to log in. We’ll ask for a code from your mobile device.
            </p>
            {/* Status indicator */}
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:13 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background: twoFA ? "#16a34a" : "#ef4444", display:"inline-block" }} />
              <span style={{ fontWeight:500, color:"#374151" }}>Current Status:&nbsp;</span>
              <span style={{ fontWeight:700, color: twoFA ? "#16a34a" : "#ef4444" }}>{twoFA ? "Enabled" : "Disabled"}</span>
            </div>
            {twoFAMsg && <p style={{ fontSize:12, color:"#9333ea", marginTop:8 }}>{twoFAMsg}</p>}
          </div>

          {/* Enable / Disable 2FA button */}
          <button
            onClick={handleToggle2FA}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"11px 22px", borderRadius:10, border:"none", background: twoFA ? "#f3f4f6" : "#f3e8ff", color: twoFA ? "#374151" : "#9333ea", fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", flexShrink:0 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            {twoFA ? "Disable 2FA" : "Enable 2FA"}
          </button>
        </div>
      </div>
    </div>
  );
}
/* ═ END SECURITY SETTINGS ═════════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════════════
   TEAM SETTINGS
   Figma: node-id=1-529, 1-3028
   Features: Team Stats, Search/Filter, Member Table, Add Member Modal
   Storage key: "billbite_team"
════════════════════════════════════════════════════════════════════════════ */

const INITIAL_TEAM = [
  { id: 1, name: "Esther Howerd", email: "esther@billbite.com", role: "Staff Manager", status: "Active", lastActive: "2 Mins Ago" },
  { id: 2, name: "Lara Mehta", email: "lara@billbite.com", role: "Kitchen Staff", status: "On Leave", lastActive: "4 Hours Ago" },
  { id: 3, name: "julianna Moore", email: "julianna@billbite.com", role: "Cashier", status: "Active", lastActive: "2 Days Ago" },
  { id: 4, name: "Brooklyn simmons", email: "brooklyn@billbite.com", role: "Wait Staff", status: "Active", lastActive: "1 Hour Ago" },
  { id: 5, name: "Guy Hawkins", email: "guy.h@billbite.com", role: "Kitchen Staff", status: "Active", lastActive: "3 Days Ago" },
  { id: 6, name: "Robert Fox", email: "robert.f@billbite.com", role: "Cashier", status: "On Leave", lastActive: "5 Hours Ago" },
];

function TeamSettings() {
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem("billbite_team");
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "Cashier", status: "Active", desc: "" });

  useEffect(() => {
    localStorage.setItem("billbite_team", JSON.stringify(team));
  }, [team]);

  const filteredTeam = team.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: team.length,
    active: team.filter(m => m.status === "Active").length,
    onLeave: team.filter(m => m.status === "On Leave").length
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    const member = {
      ...newMember,
      id: Date.now(),
      lastActive: "Just now"
    };
    setTeam([member, ...team]);
    setNewMember({ name: "", email: "", role: "Cashier", status: "Active", desc: "" });
    setShowAddModal(false);
  };

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"32px 36px", background:"#fdf4ff", position: "relative" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111", margin:0, marginBottom:6 }}>Team Settings</h1>
          <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>Manage your team members, permissions and roles</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 24px", borderRadius:12, border:"none", background:"#f3e8ff", color:"#9333ea", fontSize:14.5, fontWeight:600, cursor:"pointer", transition:"all .2s", boxShadow: "0 2px 4px rgba(147, 51, 234, 0.1)" }}
        >
          <span style={{ fontSize:20, fontWeight:400 }}>+</span> Add Members
        </button>
      </div>

      {/* Search & Actions */}
      <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:300, position:"relative" }}>
          <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Search by name, email or role"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"12px 16px 12px 48px", borderRadius:12, border:"1px solid #ede9f6", background:"#fff", fontSize:14, outline:"none", transition:"border-color .2s" }}
            onFocus={e => e.target.style.borderColor = "#9333ea"}
            onBlur={e => e.target.style.borderColor = "#ede9f6"}
          />
        </div>
        <button style={{ padding:"10px 16px", borderRadius:10, border:"1px solid #ede9f6", background:"#fff", color:"#374151", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
          Filters
        </button>
        <button style={{ padding:"10px 16px", borderRadius:10, border:"1px solid #ede9f6", background:"#fff", color:"#374151", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:20, marginBottom:32 }}>
        {[
          { label: "Total Members", val: stats.total, icon: "👥", color: "#9333ea", bg: "#f3e8ff" },
          { label: "Active Now", val: stats.active, icon: "✅", color: "#16a34a", bg: "#dcfce7" },
          { label: "On Leave", val: stats.onLeave, icon: "🏖️", color: "#ca8a04", bg: "#fef9c3" }
        ].map(s => (
          <div key={s.label} style={{ background:"#fff", padding:"20px 24px", borderRadius:16, border:"1px solid #ede9f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
              <span style={{ fontSize:18, padding:"8px", borderRadius:10, background:s.bg }}>{s.icon}</span>
              <span style={{ fontSize:14, fontWeight:600, color:"#6b7280" }}>{s.label}</span>
            </div>
            <div style={{ fontSize:24, fontWeight:700, color:"#111" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Member Table */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, overflow:"hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", textAlign:"left" }}>
          <thead>
            <tr style={{ background:"#f9fafb", borderBottom:"1px solid #f3f4f6" }}>
              {["Member", "Role", "Status", "Last Active"].map(h => (
                <th key={h} style={{ padding:"16px 24px", fontSize:13, fontWeight:600, color:"#6b7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTeam.map((m, idx) => (
              <tr key={m.id} style={{ borderBottom: idx === filteredTeam.length - 1 ? "none" : "1px solid #f9fafb", transition:"background .2s" }}>
                <td style={{ padding:"16px 24px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:"50%", background:"#f3e8ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#9333ea", fontWeight:700, fontSize:13 }}>
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#111" }}>{m.name}</div>
                      <div style={{ fontSize:12, color:"#9ca3af" }}>{m.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding:"16px 24px", fontSize:14, color:"#374151" }}>{m.role}</td>
                <td style={{ padding:"16px 24px" }}>
                  <span style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: m.status === "Active" ? "#dcfce7" : "#fef9c3",
                    color: m.status === "Active" ? "#16a34a" : "#ca8a04"
                  }}>
                    {m.status}
                  </span>
                </td>
                <td style={{ padding:"16px 24px", fontSize:14, color:"#6b7280" }}>{m.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding:"20px 24px", borderTop:"1px solid #f3f4f6", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:13, color:"#6b7280" }}>Showing 1 to {filteredTeam.length} of {team.length} results</span>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ padding:"8px 16px", borderRadius:8, border:"1px solid #ede9f6", background:"#fff", fontSize:13, color:"#374151", cursor:"pointer" }}>Previous</button>
            <button style={{ padding:"8px 16px", borderRadius:8, border:"1px solid #ede9f6", background:"#fff", fontSize:13, color:"#374151", cursor:"pointer" }}>Next</button>
          </div>
        </div>
      </div>

      {/* ── Add Member Modal ── */}
      {showAddModal && (
        <div style={{ position:"fixed", top:0, left:0, width:"100vw", height:"100vh", background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
          <div style={{ background:"#fff", width:"100%", maxWidth:480, borderRadius:20, padding:32, boxShadow:"0 20px 50px rgba(0,0,0,0.15)", position:"relative" }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position:"absolute", right:24, top:24, background:"none", border:"none", cursor:"pointer", color:"#9ca3af" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:"#f3e8ff", display:"flex", alignItems:"center", justifyContent:"center", color:"#9333ea" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              </div>
              <div>
                <h3 style={{ margin:0, fontSize:18, fontWeight:700, color:"#111" }}>Add Team Members</h3>
                <p style={{ margin:0, fontSize:13, color:"#9ca3af" }}>Invite a new user to access the dashboard</p>
              </div>
            </div>

            <form onSubmit={handleAddMember}>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>Full Name</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newMember.name}
                    onChange={e => setNewMember({...newMember, name: e.target.value})}
                    style={{ width:"100%", padding:"12px 12px 12px 38px", borderRadius:10, border:"1px solid #ede9f6", background:"#f9fafb", fontSize:14, outline:"none" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>Email Address</label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={newMember.email}
                    onChange={e => setNewMember({...newMember, email: e.target.value})}
                    style={{ width:"100%", padding:"12px 12px 12px 38px", borderRadius:10, border:"1px solid #ede9f6", background:"#f9fafb", fontSize:14, outline:"none" }}
                  />
                </div>
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>Role</label>
                  <select
                    value={newMember.role}
                    onChange={e => setNewMember({...newMember, role: e.target.value})}
                    style={{ width:"100%", padding:"12px", borderRadius:10, border:"1px solid #ede9f6", background:"#f9fafb", fontSize:14, outline:"none", appearance:"none" }}
                  >
                    <option>Cashier</option>
                    <option>Kitchen Staff</option>
                    <option>Wait Staff</option>
                    <option>Staff Manager</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>Status</label>
                  <select
                    value={newMember.status}
                    onChange={e => setNewMember({...newMember, status: e.target.value})}
                    style={{ width:"100%", padding:"12px", borderRadius:10, border:"1px solid #ede9f6", background:"#f9fafb", fontSize:14, outline:"none", appearance:"none" }}
                  >
                    <option>Active</option>
                    <option>On Leave</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom:28 }}>
                <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:8 }}>Short Description <span style={{fontWeight:400, color:"#9ca3af"}}>(Optional)</span></label>
                <textarea
                  placeholder="Tell us a bit about this member..."
                  value={newMember.desc}
                  onChange={e => setNewMember({...newMember, desc: e.target.value})}
                  style={{ width:"100%", padding:"12px", borderRadius:10, border:"1px solid #ede9f6", background:"#f9fafb", fontSize:14, outline:"none", minHeight:80, resize:"none" }}
                />
              </div>

              <div style={{ display:"flex", gap:12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ flex:1, padding:"12px", borderRadius:12, border:"1px solid #ede9f6", background:"#fff", fontSize:14, fontWeight:600, color:"#374151", cursor:"pointer" }}
                >Cancel</button>
                <button
                  type="submit"
                  style={{ flex:1, padding:"12px", borderRadius:12, border:"none", background:"#9333ea", fontSize:14, fontWeight:600, color:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
                >
                  <span style={{ fontSize:18 }}>+</span> Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
/* ═ END TEAM SETTINGS ═════════════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════════════
   APPEARANCE SETTINGS
   Figma: node-id=1-2473
   Sections: Theme, Interface Density, Accent Color
   Storage key: "billbite_appearance"
   NOTE: In production:
     - Theme → apply a data-theme attribute on <html> to swap CSS variables
     - Accent Color → update --color-accent CSS variable globally
     - Density → toggle a global CSS class (e.g. .density-compact)
════════════════════════════════════════════════════════════════════════════ */

const ACCENT_COLORS = [
  { id: "green",  hex: "#16a34a" },
  { id: "blue",   hex: "#2563eb" },
  { id: "purple", hex: "#9333ea" },
  { id: "orange", hex: "#f59e0b" },
  { id: "red",    hex: "#ef4444" },
];

const INIT_APPEARANCE = () => {
  try {
    return JSON.parse(localStorage.getItem("billbite_appearance")) || { theme: "light", density: "standard", accent: "purple" };
  } catch { return { theme: "light", density: "standard", accent: "purple" }; }
};

function AppearanceSettings() {
  const [form,    setForm]    = useState(INIT_APPEARANCE);
  const [saved,   setSaved]   = useState(false);
  const [changed, setChanged] = useState(false);

  /* ─────────────────────────────────────────────────────────────────
     applyToDOM — injects a live <style> tag so changes take effect
     INSTANTLY, even on components that use hardcoded inline styles.
     Dark Mode uses CSS filter (only technique that beats inline styles).
     ───────────────────────────────────────────────────────────────── */
  const applyToDOM = (prefs) => {
    const root = document.documentElement;
    const theme = prefs.theme || "light";
    const resolvedTheme =
      theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        : theme;

    root.setAttribute("data-theme",   resolvedTheme);
    root.setAttribute("data-density", prefs.density || "standard");
    root.setAttribute("data-accent",  prefs.accent  || "purple");

    /* ── Inject / update live override stylesheet ── */
    let el = document.getElementById("bb-live-appearance");
    if (!el) {
      el = document.createElement("style");
      el.id = "bb-live-appearance";
      document.head.appendChild(el);
    }

    const ACCENTS = {
      green:  { main:"#16a34a", light:"#dcfce7" },
      blue:   { main:"#2563eb", light:"#dbeafe" },
      purple: { main:"#9333ea", light:"#f3e8ff" },
      orange: { main:"#f59e0b", light:"#fef3c7" },
      red:    { main:"#ef4444", light:"#fee2e2" },
    };
    const ac = ACCENTS[prefs.accent] || ACCENTS.purple;
    const dark    = resolvedTheme === "dark";
    const compact = prefs.density === "compact";

    el.textContent = `
      /* ── Theme-based Inversion (High Fidelity) ── */
      [data-theme="dark"] #root {
        filter: invert(1) hue-rotate(180deg);
        transition: filter 0.25s ease;
      }

      /* Re-invert images, videos, and specific elements so they stay natural */
      [data-theme="dark"] #root img,
      [data-theme="dark"] #root video,
      [data-theme="dark"] #root canvas,
      [data-theme="dark"] #root [data-no-invert] {
        filter: invert(1) hue-rotate(180deg);
      }

      /* ── Accent Color (Whole App) ── */
      
      /* Solid backgrounds */
      [style*="background:#9333ea"], [style*="background: #9333ea"],
      [style*="background-color:#9333ea"], [style*="background-color: #9333ea"] {
        background-color: ${ac.main} !important;
        background:       ${ac.main} !important;
      }

      /* Light backgrounds (nav, hover) */
      [style*="background:#f3e8ff"], [style*="background: #f3e8ff"],
      [style*="background-color:#f3e8ff"], [style*="background-color: #f3e8ff"],
      [style*="background:#FAF5FF"] {
        background-color: ${ac.light} !important;
        background:       ${ac.light} !important;
      }

      /* Text and SVG */
      [style*="color:#9333ea"], [style*="color: #9333ea"] { color: ${ac.main} !important; }
      [stroke="#9333ea"]        { stroke: ${ac.main} !important; }
      [fill="#9333ea"]          { fill:   ${ac.main} !important; }
      aside nav button[style*="color: #9333ea"] { color: ${ac.main} !important; }

      /* Settings sidebar active item */
      .sp-nav-btn.active {
        background: ${ac.light} !important;
        color:      ${ac.main}  !important;
      }

      /* ── Compact Density ── */
      ${compact ? `
      .sp-nav-btn      { padding: 7px 10px  !important; font-size: 13px !important; }
      .sp-settings-nav { padding: 18px 10px !important; }
      aside nav button { padding: 8px 12px !important; gap: 10px !important; }
      aside            { padding: 16px 12px !important; width: 200px !important; min-width: 200px !important; }
      ` : ""}
    `;

  };

  const set = (k, v) => {
    const next = { ...form, [k]: v };
    setForm(next);
    setChanged(true);
    setSaved(false);
    applyToDOM(next);  /* ← live preview on every click */
  };

  const handleSave = () => {
    localStorage.setItem("billbite_appearance", JSON.stringify(form));
    /* NOTE: In production, dispatch to a global ThemeContext here */
    setSaved(true); setChanged(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    const prev = INIT_APPEARANCE();
    setForm(prev);
    setChanged(false);
    setSaved(false);
    applyToDOM(prev);  /* ← revert DOM to saved state */
  };

  /* —— Theme preview cards —— */
  const ThemeCard = ({ id, label, active, onClick }) => {
    const isDark = id === "dark";
    const isSys  = id === "system";
    return (
      <div
        onClick={onClick}
        style={{
          cursor: "pointer",
          borderRadius: 14,
          border: `2px solid ${active ? "#9333ea" : "#e5e7eb"}`,
          overflow: "hidden",
          transition: "border-color .2s, box-shadow .2s",
          boxShadow: active ? "0 0 0 3px rgba(147,51,234,0.15)" : "none",
          flex: "1 1 140px",
          minWidth: 120,
          maxWidth: 200,
          background: isDark ? "#1e1e2e" : isSys ? "linear-gradient(135deg,#fff 50%,#1e1e2e 50%)" : "#fff",
        }}
      >
        {/* Preview body */}
        <div style={{ height: 80, padding: "12px", display:"flex", flexDirection:"column", gap: 8, background: isDark ? "#1e1e2e" : isSys ? "linear-gradient(135deg,#f9fafb 50%,#1e1e2e 50%)" : "#f9fafb" }}>
          <div style={{ height: 8, width: "60%", borderRadius: 4, background: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)" }} />
          <div style={{ height: 6, width: "40%", borderRadius: 4, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }} />
          <div style={{ height: 6, width: "80%", borderRadius: 4, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
        </div>
        {/* Footer label */}
        <div style={{ padding: "10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", background: isDark ? "#151521" : isSys ? "#f0f0f0" : "#fff" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: isDark ? "#fff" : "#374151" }}>{label}</span>
          {isSys && (
            <span style={{ width:10, height:10, borderRadius:"50%", background: active ? "#9333ea" : "#d1d5db", display:"inline-block" }} />
          )}
        </div>
      </div>
    );
  };

  /* —— Density row —— */
  const DensityRow = ({ id, label, desc, active, onClick }) => (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 20px",
        borderRadius: 12,
        cursor: "pointer",
        background: active ? "#f3e8ff" : "transparent",
        transition: "background .2s",
      }}
    >
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        {/* Custom radio */}
        <div style={{ width:18, height:18, borderRadius:"50%", border:`2px solid ${active ? "#9333ea" : "#d1d5db"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"border-color .2s" }}>
          {active && <div style={{ width:8, height:8, borderRadius:"50%", background:"#9333ea" }} />}
        </div>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color:"#111" }}>{label}</div>
          <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{desc}</div>
        </div>
      </div>
      {/* Density bar preview */}
      <div style={{ display:"flex", flexDirection:"column", gap: id==="compact" ? 3 : 6, opacity:0.7 }}>
        {["70%","50%","60%"].map((w,i) => (
          <div key={i} style={{ height: id==="compact" ? 4 : 6, width:w, borderRadius:3, background: active ? "#9333ea" : "#d1d5db" }} />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"32px 36px", background:"#fdf4ff" }}>
      {/* Header */}
      <h1 style={{ fontSize:22, fontWeight:700, color:"#111", margin:"0 0 4px" }}>Settings</h1>
      <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 32px" }}>Manage your workplace preferences and system configurations</p>

      {/* ── Theme card */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"24px 28px", marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:700, color:"#111", marginBottom:4 }}>Theme</div>
        <div style={{ fontSize:13, color:"#9ca3af", marginBottom:22 }}>Select your preferred interface theme</div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          {[
            { id:"light",  label:"Light Mode" },
            { id:"dark",   label:"Dark Mode" },
            { id:"system", label:"System" },
          ].map(t => (
            <ThemeCard
              key={t.id}
              id={t.id}
              label={t.label}
              active={form.theme === t.id}
              onClick={() => set("theme", t.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Interface Density + Accent Color card */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"24px 28px", marginBottom:28 }}>
        {/* Interface Density */}
        <div style={{ fontSize:16, fontWeight:700, color:"#111", marginBottom:4 }}>Interface Density</div>
        <div style={{ fontSize:13, color:"#9ca3af", marginBottom:16 }}>Choose how compact you want the content to be displayed</div>
        <div style={{ borderRadius:12, overflow:"hidden", border:"1.5px solid #f0e9ff", marginBottom:24 }}>
          <DensityRow
            id="standard"
            label="Standard"
            desc="Default setting for better readability and touch targets"
            active={form.density === "standard"}
            onClick={() => set("density", "standard")}
          />
          <div style={{ height:1, background:"#f3f4f6", margin:"0 20px" }} />
          <DensityRow
            id="compact"
            label="Compact"
            desc="Reduce spacing to show more content on the screen"
            active={form.density === "compact"}
            onClick={() => set("density", "compact")}
          />
        </div>

        {/* Accent Color */}
        {/* NOTE: Replace ACCENT_COLORS with your brand palette when wiring to a ThemeContext */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:14, fontWeight:600, color:"#111", marginBottom:4 }}>Accent Color</div>
            <div style={{ fontSize:12, color:"#9ca3af" }}>Customize the primary brand color for your dashboard</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            {ACCENT_COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => set("accent", c.id)}
                title={c.id}
                style={{
                  width:28, height:28, borderRadius:"50%",
                  background: c.hex,
                  border: form.accent === c.id ? `3px solid ${c.hex}` : "3px solid transparent",
                  outline: form.accent === c.id ? `2px solid ${c.hex}` : "2px solid transparent",
                  outlineOffset:2,
                  cursor:"pointer",
                  transition:"transform .15s, outline .15s",
                  transform: form.accent === c.id ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Save / Cancel */}
      <div style={{ display:"flex", justifyContent:"flex-end", gap:12 }}>
        <button
          onClick={handleCancel}
          style={{ padding:"11px 28px", borderRadius:12, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:14, fontWeight:600, color:"#374151", cursor:"pointer" }}
        >Cancel</button>
        <button
          onClick={handleSave}
          style={{ padding:"11px 32px", borderRadius:12, border:"none", background: saved ? "#16a34a" : "#9333ea", fontSize:14, fontWeight:600, color:"#fff", cursor:"pointer", transition:"background .2s" }}
        >{saved ? "Saved! ✓" : "Save Change"}</button>
      </div>
    </div>
  );
}
/* ═ END APPEARANCE SETTINGS ══════════════════════════════════════════════════════════════════════ */

/* ── General Settings panel ──────────────────────────────────────────────── */
function GeneralSettings() {
  const [form, setForm]       = useState(INIT);
  const [saved, setSaved]     = useState(false);
  const [changed, setChanged] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setChanged(true); setSaved(false); };

  const handleSave = () => {
    localStorage.setItem("billbite_settings", JSON.stringify(form));
    setSaved(true);
    setChanged(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleDiscard = () => {
    setForm(INIT());
    setChanged(false);
    setSaved(false);
  };

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"32px 36px", background:"#fdf4ff" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:"#111", margin:0, marginBottom:6 }}>General Settings</h1>
          <p style={{ fontSize:13, color:"#9ca3af", margin:0 }}>Manage your store's core configuration &amp; localization preference</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button
            onClick={handleDiscard}
            disabled={!changed}
            style={{ padding:"10px 22px", borderRadius:10, border:"1.5px solid #e5e7eb", background:"#fff", fontSize:14, fontWeight:600, color:"#374151", cursor: changed ? "pointer" : "not-allowed", opacity: changed ? 1 : 0.5, fontFamily:"'DM Sans',sans-serif" }}
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            style={{ display:"flex", alignItems:"center", gap:7, padding:"10px 22px", borderRadius:10, border:"none", background: saved ? "#16a34a" : "#9333ea", fontSize:14, fontWeight:600, color:"#fff", cursor:"pointer", transition:"background .2s", fontFamily:"'DM Sans',sans-serif" }}
          >
            <SettingsIcons.Save />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Store Identity card */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"24px 28px", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <span style={{ color:"#9333ea" }}><SettingsIcons.Store /></span>
          <span style={{ fontSize:16, fontWeight:700, color:"#111" }}>Store Identity</span>
        </div>
        <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 22px" }}>How your store appears on receipts and reports</p>

        <div style={{ marginBottom:18 }}>
          <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:7 }}>Store Name</label>
          <Input value={form.storeName} onChange={v => set("storeName", v)} placeholder="BillBite-Downtown" prefix={<SettingsIcons.Building />} />
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:7 }}>Contact Phone</label>
            <Input value={form.phone} onChange={v => set("phone", v)} placeholder="+1 (555) 000-0000" prefix={<SettingsIcons.Phone />} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:7 }}>Contact Email</label>
            <Input value={form.email} onChange={v => set("email", v)} placeholder="Manager@billbite.com" prefix={<SettingsIcons.Mail />} />
          </div>
        </div>
      </div>

      {/* Regional Settings card */}
      <div style={{ background:"#fff", border:"1px solid #ede9f6", borderRadius:16, padding:"24px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <span style={{ color:"#9333ea" }}><SettingsIcons.Globe /></span>
          <span style={{ fontSize:16, fontWeight:700, color:"#111" }}>Regional Settings</span>
        </div>
        <p style={{ fontSize:13, color:"#9ca3af", margin:"0 0 22px" }}>Set your currency, time zone and language</p>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:7 }}>Currency</label>
            <Select value={form.currency} onChange={v => set("currency", v)} options={CURRENCIES} />
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:7 }}>Time Zone</label>
            <Select value={form.timezone} onChange={v => set("timezone", v)} options={TIMEZONES} />
          </div>
        </div>

        <div>
          <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:7 }}>System Language</label>
          <Select value={form.language} onChange={v => set("language", v)} options={LANGUAGES} />
          <p style={{ fontSize:12, color:"#9ca3af", marginTop:8 }}>This will update the interface language for all administrative users</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main Settings Page ──────────────────────────────────────────────────── */
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");

  const renderSection = () => {
    if (activeSection === "general")       return <GeneralSettings />;
    /* ── Add new sections here as they are built ── */
    if (activeSection === "account")       return <AccountSettings />;
    if (activeSection === "notifications") return <NotificationsSettings />;
    if (activeSection === "billing")       return <BillingSettings />;
    if (activeSection === "security")      return <SecuritySettings />;
    if (activeSection === "team")          return <TeamSettings />;
    if (activeSection === "appearance")    return <AppearanceSettings />;
    /* future sections can be added here */
    const found = SETTINGS_NAV.find(n => n.id === activeSection);
    return <ComingSoon label={found?.label + " Settings"} />;
  };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .sp * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
        .sp-nav-btn { display:flex; align-items:center; gap:12px; padding:11px 16px; border-radius:12px; border:none; cursor:pointer; width:100%; text-align:left; background:transparent; font-size:14.5px; font-weight:500; color:#374151; transition:background .15s,color .15s; font-family:'DM Sans',sans-serif; }
        .sp-nav-btn:hover:not(.active) { background:#faf5ff; }
        .sp-nav-btn.active { background:#f3e8ff; color:#9333ea; font-weight:600; }
        @media(max-width:800px){ .sp-settings-nav{ min-width:0!important; width:56px!important; } .sp-nav-label{ display:none; } .sp-settings-nav h2,.sp-settings-nav p{display:none;} }
        @media(max-width:600px){ .sp-content-grid{ grid-template-columns:1fr!important; } }
      `}</style>

      <Sidebar />

      {/* Settings sub-nav */}
      <div className="sp sp-settings-nav" style={{ width:220, minWidth:220, borderRight:"1px solid #f0e9ff", background:"#fff", display:"flex", flexDirection:"column", padding:"28px 14px", overflowY:"auto", flexShrink:0 }}>
        <div style={{ marginBottom:28, paddingLeft:6 }}>
          <h2 style={{ fontSize:18, fontWeight:700, color:"#111", margin:0, marginBottom:4 }}>Settings</h2>
          <p style={{ fontSize:12.5, color:"#9ca3af", margin:0 }}>Manage your preference</p>
        </div>
        <nav style={{ display:"flex", flexDirection:"column", gap:3 }}>
          {SETTINGS_NAV.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sp-nav-btn${activeSection === id ? " active" : ""}`}
              onClick={() => setActiveSection(id)}
            >
              <span style={{ color: activeSection === id ? "#9333ea" : "#6b7280", display:"flex", flexShrink:0 }}>
                <Icon />
              </span>
              <span className="sp-nav-label">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content area */}
      <div className="sp" style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {renderSection()}
      </div>
    </div>
  );
}
