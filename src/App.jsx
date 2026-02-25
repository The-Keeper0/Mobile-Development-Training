import { useState, useEffect } from "react";

const MEMBERS = [
  {
    id: "memberA",
    name: "Member A",
    role: "UI/UX & Frontend",
    color: "#2563EB",
    light: "#DBEAFE",
    icon: "🎨",
    tasks: [
      { id: "a1", day: "Day 1", week: 1, label: "Android Studio setup + project structure overview" },
      { id: "a2", day: "Day 2", week: 1, label: "XML layouts: LinearLayout & ConstraintLayout — build a login screen" },
      { id: "a3", day: "Day 3", week: 1, label: "Activity lifecycle — onCreate, onPause, onResume with logs" },
      { id: "a4", day: "Day 4", week: 1, label: "Intents — navigate between 3 screens, pass data via Bundle" },
      { id: "a5", day: "Day 5", week: 1, label: "Fragments — build a bottom-nav app with 3 fragment tabs" },
      { id: "a6", day: "Day 6", week: 2, label: "RecyclerView + Adapter — display a static list of items" },
      { id: "a7", day: "Day 7", week: 2, label: "Connect RecyclerView to SQLite data (via Member C's DAO)" },
      { id: "a8", day: "Day 8", week: 2, label: "Form inputs — EditText, Spinner, DatePicker + validation" },
      { id: "a9", day: "Day 9", week: 2, label: "UI polish — styles, themes, Material Design components" },
      { id: "a10", day: "Day 10", week: 2, label: "Integration Sprint — wire all screens together as a working mini-app" },
    ],
  },
  {
    id: "memberB",
    name: "Member B",
    role: "Backend & API",
    color: "#059669",
    light: "#D1FAE5",
    icon: "⚙️",
    tasks: [
      { id: "b1", day: "Day 1", week: 1, label: "Android Studio setup + Java OOP review — classes, interfaces, inheritance" },
      { id: "b2", day: "Day 2", week: 1, label: "REST API concepts — HTTP methods, status codes, JSON structure" },
      { id: "b3", day: "Day 3", week: 1, label: "Retrofit 2 setup — add dependency, create interface, make first GET call" },
      { id: "b4", day: "Day 4", week: 1, label: "Retrofit POST — send login credentials, receive token response" },
      { id: "b5", day: "Day 5", week: 1, label: "Gson — parse JSON responses into Java model objects (POJOs)" },
      { id: "b6", day: "Day 6", week: 2, label: "Async handling — Callback vs ExecutorService for background tasks" },
      { id: "b7", day: "Day 7", week: 2, label: "SharedPreferences — store and retrieve auth tokens across sessions" },
      { id: "b8", day: "Day 8", week: 2, label: "Error handling — network errors, timeout, 4xx/5xx response codes" },
      { id: "b9", day: "Day 9", week: 2, label: "Build a complete login + fetch-user-data API flow" },
      { id: "b10", day: "Day 10", week: 2, label: "Integration Sprint — connect API responses to Member A's UI screens" },
    ],
  },
  {
    id: "memberC",
    name: "Member C",
    role: "Database & Storage",
    color: "#D97706",
    light: "#FEF3C7",
    icon: "🗄️",
    tasks: [
      { id: "c1", day: "Day 1", week: 1, label: "Android Studio setup + SQLite overview — tables, columns, primary keys" },
      { id: "c2", day: "Day 2", week: 1, label: "SQLiteOpenHelper — create database, define schema, run onCreate" },
      { id: "c3", day: "Day 3", week: 1, label: "Insert and Query — write helper methods for adding and reading rows" },
      { id: "c4", day: "Day 4", week: 1, label: "Update and Delete — complete the CRUD loop, test with Log output" },
      { id: "c5", day: "Day 5", week: 1, label: "Cursor — iterate query results, map to Java model objects" },
      { id: "c6", day: "Day 6", week: 2, label: "Room Library — Entity, DAO, and Database classes setup" },
      { id: "c7", day: "Day 7", week: 2, label: "Room DAO — @Insert, @Query, @Update, @Delete annotations" },
      { id: "c8", day: "Day 8", week: 2, label: "Data sync strategy — when to write to SQLite vs fetch from API" },
      { id: "c9", day: "Day 9", week: 2, label: "Offline support — cache API results locally in Room" },
      { id: "c10", day: "Day 10", week: 2, label: "Integration Sprint — supply data to Member A's UI and Member B's sync logic" },
    ],
  },
];

const INTEGRATION_MILESTONES = [
  { day: "Day 5", label: "Team Check-in", desc: "Share schemas, API models & screen wireframes", members: ["A", "B", "C"] },
  { day: "Day 7", label: "A + C Pairing", desc: "Connect RecyclerView with Room/SQLite data", members: ["A", "C"] },
  { day: "Day 9", label: "A + B Pairing", desc: "Wire API call results into the UI", members: ["A", "B"] },
  { day: "Day 10", label: "Integration Sprint", desc: "Build the mini-app together", members: ["A", "B", "C"] },
];

const STORAGE_KEY = "training-tracker-progress";

function ProgressRing({ pct, color, size = 52 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease" }}
      />
    </svg>
  );
}

export default function App() {
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(false);

  function toggle(taskId) {
    const next = { ...checked, [taskId]: !checked[taskId] };
    setChecked(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  function getMemberProgress(member) {
    const done = member.tasks.filter(t => checked[t.id]).length;
    return { done, total: member.tasks.length, pct: Math.round((done / member.tasks.length) * 100) };
  }

  function getWeekTasks(member, week) {
    return member.tasks.filter(t => t.week === week);
  }

  const allDone = MEMBERS.reduce((a, m) => a + m.tasks.filter(t => checked[t.id]).length, 0);
  const allTotal = MEMBERS.reduce((a, m) => a + m.tasks.length, 0);
  const overallPct = Math.round((allDone / allTotal) * 100);
  const activeMember = MEMBERS.find(m => m.id === activeTab);

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", fontFamily: "'DM Sans', sans-serif", color: "#F1F5F9" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)", borderBottom: "1px solid #1E293B", padding: "24px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#64748B", fontWeight: 600, textTransform: "uppercase", marginBottom: 6 }}>Mobile Dev Training</div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#F8FAFC", lineHeight: 1.2 }}>Team Progress Tracker</h1>
              <div style={{ marginTop: 6, color: "#64748B", fontSize: 13 }}>Android · Java · SQLite · MySQL REST API · 10 Days</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {saved && (
                <div style={{ fontSize: 12, color: "#34D399", display: "flex", alignItems: "center", gap: 6 }}>
                  ✓ Saved
                </div>
              )}
              <div style={{ textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <ProgressRing pct={overallPct} color="#38BDF8" size={64} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#38BDF8" }}>{overallPct}%</div>
                </div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{allDone}/{allTotal} done</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginTop: 24, overflowX: "auto" }}>
            {[{ id: "overview", label: "Overview", icon: "📊" }, ...MEMBERS.map(m => ({ id: m.id, label: m.name, icon: m.icon }))].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap", transition: "all 0.2s",
                  background: activeTab === tab.id ? "#38BDF8" : "#1E293B",
                  color: activeTab === tab.id ? "#0F172A" : "#94A3B8",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 32px" }}>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
              {MEMBERS.map(m => {
                const { done, total, pct } = getMemberProgress(m);
                return (
                  <div
                    key={m.id}
                    onClick={() => setActiveTab(m.id)}
                    style={{ background: "#1E293B", borderRadius: 14, padding: "20px 22px", cursor: "pointer", border: "1px solid #334155", transition: "all 0.2s", position: "relative", overflow: "hidden" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: m.color, borderRadius: "14px 14px 0 0" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 18 }}>{m.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#F1F5F9", marginTop: 4 }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: "#64748B" }}>{m.role}</div>
                      </div>
                      <div style={{ position: "relative" }}>
                        <ProgressRing pct={pct} color={m.color} size={56} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: m.color }}>{pct}%</div>
                      </div>
                    </div>
                    <div style={{ background: "#0F172A", borderRadius: 99, height: 5, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: m.color, borderRadius: 99, transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "#64748B" }}>
                      <span>{done} completed</span>
                      <span>{total - done} remaining</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Integration milestones */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94A3B8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Team Integration Milestones</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
                {INTEGRATION_MILESTONES.map((ms, i) => {
                  const dayNum = parseInt(ms.day.replace("Day ", ""));
                  const relevant = MEMBERS.filter(m => ms.members.includes(m.name.replace("Member ", "")));
                  const allRelevantDone = relevant.every(m => {
                    const dayTask = m.tasks.find(t => parseInt(t.day.replace("Day ", "")) === dayNum);
                    return dayTask && checked[dayTask.id];
                  });
                  return (
                    <div key={i} style={{ background: "#1E293B", borderRadius: 12, padding: "14px 16px", border: `1px solid ${allRelevantDone ? "#10B981" : "#334155"}`, transition: "border-color 0.3s" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#38BDF8", fontFamily: "'DM Mono', monospace" }}>{ms.day}</span>
                        {allRelevantDone && <span style={{ fontSize: 14 }}>✅</span>}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#F1F5F9", marginBottom: 4 }}>{ms.label}</div>
                      <div style={{ fontSize: 11, color: "#64748B", marginBottom: 10 }}>{ms.desc}</div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {relevant.map(m => (
                          <span key={m.id} style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: m.color + "22", color: m.color, border: `1px solid ${m.color}44` }}>
                            {m.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* MEMBER TAB */}
        {activeMember && (
          <div>
            <div style={{ background: "#1E293B", borderRadius: 14, padding: "20px 24px", marginBottom: 24, border: `1px solid ${activeMember.color}44`, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ fontSize: 36 }}>{activeMember.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#F8FAFC" }}>{activeMember.name}</div>
                <div style={{ fontSize: 13, color: activeMember.color, fontWeight: 600 }}>{activeMember.role}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative" }}>
                  <ProgressRing pct={getMemberProgress(activeMember).pct} color={activeMember.color} size={64} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: activeMember.color }}>
                    {getMemberProgress(activeMember).pct}%
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>
                    {getMemberProgress(activeMember).done}
                    <span style={{ fontSize: 14, color: "#64748B" }}>/{getMemberProgress(activeMember).total}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>tasks done</div>
                </div>
              </div>
            </div>

            {[1, 2].map(week => (
              <div key={week} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ height: 1, flex: 1, background: "#1E293B" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", letterSpacing: 2, textTransform: "uppercase" }}>Week {week}</span>
                  <div style={{ height: 1, flex: 1, background: "#1E293B" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {getWeekTasks(activeMember, week).map(task => {
                    const done = !!checked[task.id];
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggle(task.id)}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 18px",
                          background: done ? activeMember.color + "15" : "#1E293B",
                          borderRadius: 10, cursor: "pointer",
                          border: `1px solid ${done ? activeMember.color + "44" : "#334155"}`,
                          transition: "all 0.2s", userSelect: "none",
                        }}
                        onMouseEnter={e => !done && (e.currentTarget.style.borderColor = activeMember.color + "66")}
                        onMouseLeave={e => !done && (e.currentTarget.style.borderColor = "#334155")}
                      >
                        <div style={{
                          width: 22, height: 22, borderRadius: 6,
                          border: `2px solid ${done ? activeMember.color : "#475569"}`,
                          background: done ? activeMember.color : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, marginTop: 1, transition: "all 0.2s",
                        }}>
                          {done && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: 3 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: activeMember.color, fontFamily: "'DM Mono', monospace" }}>{task.day}</span>
                          </div>
                          <div style={{ fontSize: 14, color: done ? "#64748B" : "#CBD5E1", textDecoration: done ? "line-through" : "none", lineHeight: 1.5, transition: "all 0.2s" }}>
                            {task.label}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {getMemberProgress(activeMember).pct === 100 && (
              <div style={{ background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: 12, padding: "18px 22px", textAlign: "center", marginTop: 8 }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>{activeMember.name} completed all tasks!</div>
                <div style={{ fontSize: 13, color: "#D1FAE5", marginTop: 4 }}>Amazing work — ready for the integration sprint!</div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #0F172A; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 99px; }
      `}</style>
    </div>
  );
}
