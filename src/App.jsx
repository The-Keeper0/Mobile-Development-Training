import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const MEMBERS = [
  {
    id: "memberA",
    name: "Member A",
    role: "UI/UX & Frontend",
    color: "#2563EB",
    icon: "🎨",
tasks: [
  { 
    id: "a1", 
    day: "Day 1", 
    week: 1, 
    label: "Create a clean Login screen UI with an email field, password field, and Login button. Make sure spacing and alignment look good." 
  },
  { 
    id: "a2", 
    day: "Day 2", 
    week: 1, 
    label: "Improve the Login screen (Email Field, Password Field, & Log-in Button) design by adding rounded corners, better colors, and proper padding." 
  },
  { 
    id: "a3", 
    day: "Day 3", 
    week: 1, 
    label: "Design a Home screen UI with a welcome text, three summary boxes, and a Logout button." 
  },
  { 
    id: "a4", 
    day: "Day 4", 
    week: 1, 
    label: "Design a List screen with a Search bar at the top and three filter buttons: All, Vegetables, Fruits." 
  },
  { 
    id: "a5", 
    day: "Day 5", 
    week: 1, 
    label: "Create a simple item card layout that shows crop name, category, quantity, and date." 
  },
  { 
    id: "a6", 
    day: "Day 6", 
    week: 2, 
    label: "Improve the Search bar UI by adding a search icon and a clear (X) button." 
  },
  { 
    id: "a7", 
    day: "Day 7", 
    week: 2, 
    label: "Design a simple dropdown UI for sorting with options: Newest, Oldest, Highest Quantity." 
  },
  { 
    id: "a8", 
    day: "Day 8", 
    week: 2, 
    label: "Create an Add Item screen UI with text fields, a dropdown, a date picker, and a Save button." 
  },
  { 
    id: "a9", 
    day: "Day 9", 
    week: 2, 
    label: "Add a simple loading screen and an empty list message that says 'No items found'." 
  },
  { 
    id: "a10", 
    day: "Day 10", 
    week: 2, 
    label: "Make sure all screens use the same colors, button style, and spacing so the app looks consistent." 
  },
],
  },
  {
    id: "memberB",
    name: "Member B",
    role: "Login, Search & Filters",
    color: "#059669",
    icon: "⚙️",
tasks: [
  { 
    id: "b1", 
    day: "Day 1", 
    week: 1, 
    label: "Create a new mobile app project and make the first screen a Login screen with a username field, a password field, and a Login button" 
  },
  { 
    id: "b2", 
    day: "Day 2", 
    week: 1, 
    label: "Make the Login button functional: if username is 'farmer' and password is '1234', navigate to the Home screen — otherwise display a red message saying 'Wrong username or password'" 
  },
  { 
    id: "b3", 
    day: "Day 3", 
    week: 1, 
    label: "Add a Logout button on the Home screen — when tapped, navigate back to the Login screen and clear both username and password fields" 
  },
  { 
    id: "b4", 
    day: "Day 4", 
    week: 1, 
    label: "Create an Add Harvest screen and validate the form before saving: if crop name is empty or quantity is zero, show a red error message under the invalid field and prevent saving" 
  },
  { 
    id: "b5", 
    day: "Day 5", 
    week: 1, 
    label: "On the Harvest List screen, add three filter buttons at the top: All, Vegetables, Fruits — when one is selected, display only items that match that category" 
  },
  { 
    id: "b6", 
    day: "Day 6", 
    week: 2, 
    label: "Add a search bar above the harvest list — as the user types a crop name, update the list instantly to show only matching results" 
  },
  { 
    id: "b7", 
    day: "Day 7", 
    week: 2, 
    label: "Make search and category filtering work together — for example, selecting Fruits and typing 'man' should display only fruit items whose names contain 'man' such as Mango" 
  },
  { 
    id: "b8", 
    day: "Day 8", 
    week: 2, 
    label: "Add a sorting dropdown to the list with options: Newest First, Oldest First, and Highest Quantity — selecting one should reorder the list correctly" 
  },
  { 
    id: "b9", 
    day: "Day 9", 
    week: 2, 
    label: "Add a Summary section above the list that dynamically displays: total vegetables harvested, total fruits harvested, and total number of crops recorded" 
  },
  { 
    id: "b10", 
    day: "Day 10", 
    week: 2, 
    label: "Perform a full system test: log in, add five harvest entries of mixed categories, search for one item, filter by Fruits, sort by Highest Quantity, and verify that the summary totals update correctly" 
  },
],
  },
  {
    id: "memberC",
    name: "Member C",
    role: "Database & Storage",
    color: "#D97706",
    icon: "🗄️",
    tasks: [
      { id: "c1", day: "Day 1", week: 1, label: "Install Android Studio and draw a diagram of the app database — what tables and columns are needed" },
      { id: "c2", day: "Day 2", week: 1, label: "Create the actual database inside the app with a Users table (id, name, email) — confirm it launches" },
      { id: "c3", day: "Day 3", week: 1, label: "Write code to save a new user into the database, then read all users back and print them in the log" },
      { id: "c4", day: "Day 4", week: 1, label: "Write code to edit an existing user name and to delete a user — test both and confirm they work" },
      { id: "c5", day: "Day 5", week: 1, label: "Loop through all saved users and display each person name and email in the log, one line at a time" },
      { id: "c6", day: "Day 6", week: 2, label: "Switch to Room library — rebuild the same Users table using Room cleaner and more modern approach" },
      { id: "c7", day: "Day 7", week: 2, label: "Rewrite the save, read, edit, and delete actions using Room so all four operations work correctly" },
      { id: "c8", day: "Day 8", week: 2, label: "Decide which data gets saved on the phone and which gets fetched fresh from the server each time" },
      { id: "c9", day: "Day 9", week: 2, label: "Make the app load saved local data instantly when offline, then update it automatically when back online" },
      { id: "c10", day: "Day 10", week: 2, label: "Supply saved database data to Member A list screen and confirm Member B sync updates the local copy" },
    ],
  },
];

const INTEGRATION_MILESTONES = [
  { day: "Day 5",  label: "Team Check-in",    desc: "Member A shows screens, Member B shows login + category filter, Member C shows working database", members: ["A","B","C"] },
  { day: "Day 7",  label: "A + C Connect",    desc: "Member A list screen now shows real harvests loaded from Member C database",                      members: ["A","C"] },
  { day: "Day 9",  label: "A + B Connect",    desc: "Search bar, category filter, sort, and summary totals all work inside Member A screens",          members: ["A","B"] },
  { day: "Day 10", label: "Full App Sprint",  desc: "Log in, add harvests, search, filter by category, sort the list, check totals — all working",     members: ["A","B","C"] },
];

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function ProgressRing({ pct, color, size = 52 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1E293B" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease" }} />
    </svg>
  );
}

function SyncDot({ syncing }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12,
      color: syncing ? "#38BDF8" : "#34D399" }}>
      <div style={{ width:7, height:7, borderRadius:"50%",
        background: syncing ? "#38BDF8" : "#34D399",
        animation: syncing ? "pulse 1s infinite" : "none" }} />
      {syncing ? "Syncing..." : "Synced ✓"}
    </div>
  );
}

// ─────────────────────────────────────────────
// SELECTOR SCREEN
// ─────────────────────────────────────────────
function MemberSelector({ onSelect }) {
  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:32, fontFamily:"'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap" rel="stylesheet" />

      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ fontSize:13, letterSpacing:3, color:"#475569", fontWeight:600, textTransform:"uppercase", marginBottom:12 }}>
          Mobile Dev Training
        </div>
        <h1 style={{ margin:0, fontSize:32, fontWeight:700, color:"#F8FAFC" }}>Who are you?</h1>
        <p style={{ color:"#64748B", marginTop:10, fontSize:15 }}>
          Pick your name to view and update your tasks
        </p>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14, width:"100%", maxWidth:380 }}>
        {MEMBERS.map(m => (
          <button key={m.id} onClick={() => onSelect(m.id)}
            style={{ display:"flex", alignItems:"center", gap:18, padding:"20px 24px",
              borderRadius:14, border:"1px solid #1E293B", background:"#1E293B",
              cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans', sans-serif",
              textAlign:"left", width:"100%" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.background = m.color+"15"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E293B"; e.currentTarget.style.background = "#1E293B"; e.currentTarget.style.transform="translateY(0)"; }}>
            <div style={{ fontSize:32 }}>{m.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:17, color:"#F1F5F9" }}>{m.name}</div>
              <div style={{ fontSize:13, color:m.color, fontWeight:500, marginTop:2 }}>{m.role}</div>
            </div>
            <div style={{ fontSize:20, color:"#334155" }}>→</div>
          </button>
        ))}

        <button onClick={() => onSelect("overview")}
          style={{ display:"flex", alignItems:"center", gap:18, padding:"16px 24px",
            borderRadius:14, border:"1px dashed #334155", background:"transparent",
            cursor:"pointer", transition:"all 0.2s", fontFamily:"'DM Sans', sans-serif",
            textAlign:"left", width:"100%", marginTop:4 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor="#94A3B8"; e.currentTarget.style.transform="translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="#334155"; e.currentTarget.style.transform="translateY(0)"; }}>
          <div style={{ fontSize:28 }}>📊</div>
          <div>
            <div style={{ fontWeight:600, fontSize:15, color:"#94A3B8" }}>View All Progress</div>
            <div style={{ fontSize:12, color:"#475569", marginTop:2 }}>Team lead overview — read-only</div>
          </div>
        </button>
      </div>

      <div style={{ marginTop:40, fontSize:12, color:"#334155", display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ color:"#10B981" }}>●</span> Real-time sync via Firebase
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab]     = useState("overview");
  const [allChecked, setAllChecked]   = useState({});
  const [syncing, setSyncing]         = useState(false);

  // Real-time listener for all 3 members
  useEffect(() => {
    const unsubs = MEMBERS.map(m =>
      onSnapshot(doc(db, "progress", m.id), snap => {
        setAllChecked(prev => ({ ...prev, [m.id]: snap.exists() ? snap.data() : {} }));
      })
    );
    return () => unsubs.forEach(u => u());
  }, []);

  function handleSelectUser(id) {
    setCurrentUser(id);
    setActiveTab(id === "overview" ? "overview" : id);
  }

  async function toggle(memberId, taskId) {
    const prev = allChecked[memberId] || {};
    setSyncing(true);
    await setDoc(doc(db, "progress", memberId), { ...prev, [taskId]: !prev[taskId] });
    setTimeout(() => setSyncing(false), 800);
  }

  function getProgress(member) {
    const data = allChecked[member.id] || {};
    const done = member.tasks.filter(t => data[t.id]).length;
    return { done, total: member.tasks.length, pct: Math.round((done / member.tasks.length) * 100) };
  }

  const allDone  = MEMBERS.reduce((a,m) => a + getProgress(m).done, 0);
  const allTotal = MEMBERS.reduce((a,m) => a + m.tasks.length, 0);
  const overallPct = Math.round((allDone / allTotal) * 100);
  const activeMember = MEMBERS.find(m => m.id === activeTab);

  if (!currentUser) return <MemberSelector onSelect={handleSelectUser} />;

  return (
    <div style={{ minHeight:"100vh", background:"#0F172A", fontFamily:"'DM Sans', sans-serif", color:"#F1F5F9" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg,#1E293B 0%,#0F172A 100%)", borderBottom:"1px solid #1E293B", padding:"20px 32px" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <button onClick={() => setCurrentUser(null)}
                style={{ background:"#1E293B", border:"1px solid #334155", borderRadius:8, color:"#94A3B8",
                  padding:"6px 12px", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans', sans-serif" }}>
                ← Switch
              </button>
              <div>
                <div style={{ fontSize:11, letterSpacing:3, color:"#64748B", fontWeight:600, textTransform:"uppercase", marginBottom:3 }}>Mobile Dev Training</div>
                <h1 style={{ margin:0, fontSize:22, fontWeight:700, color:"#F8FAFC" }}>Team Progress Tracker</h1>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              <SyncDot syncing={syncing} />
              <div style={{ textAlign:"center" }}>
                <div style={{ position:"relative", display:"inline-block" }}>
                  <ProgressRing pct={overallPct} color="#38BDF8" size={56} />
                  <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:"#38BDF8" }}>{overallPct}%</div>
                </div>
                <div style={{ fontSize:10, color:"#64748B", marginTop:1 }}>{allDone}/{allTotal}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:4, marginTop:20, overflowX:"auto", paddingBottom:2 }}>
            {[{ id:"overview", label:"Overview", icon:"📊" }, ...MEMBERS.map(m => ({ id:m.id, label:m.name, icon:m.icon, color:m.color }))].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{ padding:"7px 16px", borderRadius:8, border:"none", cursor:"pointer",
                  fontSize:13, fontWeight:600, fontFamily:"'DM Sans', sans-serif", whiteSpace:"nowrap", transition:"all 0.2s",
                  background: activeTab===tab.id ? (tab.color||"#38BDF8") : "#1E293B",
                  color: activeTab===tab.id ? "#fff" : "#94A3B8" }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"24px 32px" }}>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            {currentUser === "overview" && (
              <div style={{ background:"#1E293B", border:"1px solid #334155", borderRadius:10, padding:"10px 16px",
                marginBottom:20, fontSize:13, color:"#94A3B8", display:"flex", gap:8, alignItems:"center" }}>
                📊 <span>Viewing as <strong style={{ color:"#F1F5F9" }}>Team Lead</strong> — read-only overview</span>
              </div>
            )}

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:16, marginBottom:32 }}>
              {MEMBERS.map(m => {
                const { done, total, pct } = getProgress(m);
                return (
                  <div key={m.id} onClick={() => setActiveTab(m.id)}
                    style={{ background:"#1E293B", borderRadius:14, padding:"20px 22px", cursor:"pointer",
                      border:"1px solid #334155", transition:"all 0.2s", position:"relative", overflow:"hidden" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor=m.color; e.currentTarget.style.transform="translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="#334155"; e.currentTarget.style.transform="translateY(0)"; }}>
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:m.color, borderRadius:"14px 14px 0 0" }} />
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                      <div>
                        <div style={{ fontSize:20 }}>{m.icon}</div>
                        <div style={{ fontWeight:700, fontSize:15, color:"#F1F5F9", marginTop:4 }}>{m.name}</div>
                        <div style={{ fontSize:12, color:"#64748B" }}>{m.role}</div>
                      </div>
                      <div style={{ position:"relative" }}>
                        <ProgressRing pct={pct} color={m.color} size={56} />
                        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:m.color }}>{pct}%</div>
                      </div>
                    </div>
                    <div style={{ background:"#0F172A", borderRadius:99, height:5, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:m.color, borderRadius:99, transition:"width 0.5s ease" }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:8, fontSize:11, color:"#64748B" }}>
                      <span>{done} completed</span><span>{total-done} remaining</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Milestones */}
            <div style={{ fontSize:13, fontWeight:700, color:"#94A3B8", letterSpacing:2, textTransform:"uppercase", marginBottom:14 }}>Team Integration Milestones</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))", gap:12 }}>
              {INTEGRATION_MILESTONES.map((ms,i) => {
                const dayNum = parseInt(ms.day.replace("Day ",""));
                const relevant = MEMBERS.filter(m => ms.members.includes(m.name.replace("Member ","")));
                const allDone = relevant.every(m => {
                  const t = m.tasks.find(t => parseInt(t.day.replace("Day ","")) === dayNum);
                  return t && allChecked[m.id]?.[t.id];
                });
                return (
                  <div key={i} style={{ background:"#1E293B", borderRadius:12, padding:"14px 16px",
                    border:`1px solid ${allDone ? "#10B981" : "#334155"}`, transition:"border-color 0.3s" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:"#38BDF8", fontFamily:"'DM Mono',monospace" }}>{ms.day}</span>
                      {allDone && <span>✅</span>}
                    </div>
                    <div style={{ fontWeight:600, fontSize:13, color:"#F1F5F9", marginBottom:4 }}>{ms.label}</div>
                    <div style={{ fontSize:11, color:"#64748B", marginBottom:10 }}>{ms.desc}</div>
                    <div style={{ display:"flex", gap:4 }}>
                      {relevant.map(m => (
                        <span key={m.id} style={{ fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:99,
                          background:m.color+"22", color:m.color, border:`1px solid ${m.color}44` }}>{m.name}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MEMBER TAB ── */}
        {activeMember && (() => {
          const data  = allChecked[activeMember.id] || {};
          const { done, total, pct } = getProgress(activeMember);
          const isOwn = currentUser === activeMember.id;

          return (
            <div>
              <div style={{ background:"#1E293B", borderRadius:14, padding:"20px 24px", marginBottom:20,
                border:`1px solid ${activeMember.color}44`, display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
                <div style={{ fontSize:36 }}>{activeMember.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:20, color:"#F8FAFC" }}>{activeMember.name}</div>
                  <div style={{ fontSize:13, color:activeMember.color, fontWeight:600 }}>{activeMember.role}</div>
                  {!isOwn && (
                    <div style={{ fontSize:11, color:"#64748B", marginTop:4 }}>
                      👁 {currentUser==="overview" ? "Team lead view — read-only" : "Viewing only — switch to your tab to check tasks"}
                    </div>
                  )}
                  {isOwn && <div style={{ fontSize:11, color:"#34D399", marginTop:4 }}>✓ This is your checklist — tap tasks to mark complete</div>}
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ position:"relative" }}>
                    <ProgressRing pct={pct} color={activeMember.color} size={64} />
                    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:activeMember.color }}>{pct}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize:22, fontWeight:700, color:"#F8FAFC" }}>{done}<span style={{ fontSize:14, color:"#64748B" }}>/{total}</span></div>
                    <div style={{ fontSize:11, color:"#64748B" }}>tasks done</div>
                  </div>
                </div>
              </div>

              {[1,2].map(week => (
                <div key={week} style={{ marginBottom:28 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                    <div style={{ height:1, flex:1, background:"#1E293B" }} />
                    <span style={{ fontSize:11, fontWeight:700, color:"#64748B", letterSpacing:2, textTransform:"uppercase" }}>Week {week}</span>
                    <div style={{ height:1, flex:1, background:"#1E293B" }} />
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {activeMember.tasks.filter(t => t.week===week).map(task => {
                      const done = !!data[task.id];
                      return (
                        <div key={task.id} onClick={() => isOwn && toggle(activeMember.id, task.id)}
                          style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 18px",
                            background: done ? activeMember.color+"15" : "#1E293B", borderRadius:10,
                            cursor: isOwn ? "pointer" : "default",
                            border:`1px solid ${done ? activeMember.color+"44" : "#334155"}`,
                            transition:"all 0.2s", userSelect:"none", opacity: !isOwn && !done ? 0.7 : 1 }}
                          onMouseEnter={e => isOwn && !done && (e.currentTarget.style.borderColor = activeMember.color+"66")}
                          onMouseLeave={e => isOwn && !done && (e.currentTarget.style.borderColor = "#334155")}>
                          <div style={{ width:22, height:22, borderRadius:6, flexShrink:0, marginTop:1,
                            border:`2px solid ${done ? activeMember.color : "#475569"}`,
                            background: done ? activeMember.color : "transparent",
                            display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
                            {done && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ marginBottom:3 }}>
                              <span style={{ fontSize:11, fontWeight:700, color:activeMember.color, fontFamily:"'DM Mono',monospace" }}>{task.day}</span>
                            </div>
                            <div style={{ fontSize:14, lineHeight:1.5, transition:"all 0.2s",
                              color: done ? "#64748B" : "#CBD5E1", textDecoration: done ? "line-through" : "none" }}>
                              {task.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {pct===100 && (
                <div style={{ background:"linear-gradient(135deg,#10B981,#059669)", borderRadius:12, padding:"18px 22px", textAlign:"center" }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>🎉</div>
                  <div style={{ fontWeight:700, fontSize:16, color:"#fff" }}>{activeMember.name} completed all tasks!</div>
                  <div style={{ fontSize:13, color:"#D1FAE5", marginTop:4 }}>Amazing work — ready for the integration sprint!</div>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:#0F172A; }
        ::-webkit-scrollbar-thumb { background:#334155; border-radius:99px; }
      `}</style>
    </div>
  );
}
