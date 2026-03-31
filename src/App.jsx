import { useState, useEffect, useCallback, createContext, useContext } from "react";

// ===== THEME CONTEXT =====
const ThemeContext = createContext();

const darkTheme = {
  background: "#0A0F1E",
  surface: "#0F172A",
  surfaceHover: "#1E293B",
  border: "#1E293B",
  textPrimary: "#FFFFFF",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  accent: "#7C3AED",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
  phase1: "#3B82F6",
  phase2: "#8B5CF6",
  phase3: "#10B981",
  phase4: "#F59E0B",
};

const lightTheme = {
  background: "#F9FAFB",
  surface: "#FFFFFF",
  surfaceHover: "#F3F4F6",
  border: "#E5E7EB",
  textPrimary: "#111827",
  textSecondary: "#4B5563",
  textMuted: "#6B7280",
  accent: "#7C3AED",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
  phase1: "#3B82F6",
  phase2: "#8B5CF6",
  phase3: "#10B981",
  phase4: "#F59E0B",
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "light" ? "light" : "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const colors = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// ===== RESOURCES (unchanged) =====
const RESOURCES = {
  // ... (your existing RESOURCES object remains exactly the same)
  // (I've omitted it here for brevity – keep your original RESOURCES)
};

// ===== getResourceKey, PHASES, DAYS_DATA (unchanged) =====
// ... (keep your original functions and data)
function getResourceKey(task) { /* ... */ }
const PHASES = [ /* ... */ ];
const DAYS_DATA = [ /* ... */ ];

// ===== APP =====
export default function App() {
  const [progress, setProgress] = useState({});
  const [notes, setNotes] = useState({});
  const [view, setView] = useState("dashboard");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [aiFeedback, setAiFeedback] = useState({});
  const [loadingAI, setLoadingAI] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const { colors, toggleTheme, theme } = useTheme();

  // Load/save data (same as before, but we also add theme persistence)
  useEffect(() => {
    async function load() {
      try { const p = await window.storage.get("progress_v2"); if (p) setProgress(JSON.parse(p.value)); } catch {}
      try { const n = await window.storage.get("notes_v2"); if (n) setNotes(JSON.parse(n.value)); } catch {}
      try { const s = await window.storage.get("startDate_v2"); if (s) setStartDate(s.value); } catch {}
      try { const f = await window.storage.get("aiFeedback_v2"); if (f) setAiFeedback(JSON.parse(f.value)); } catch {}
    }
    load();
  }, []);

  const saveProgress = useCallback(async (np) => {
    setProgress(np);
    try { await window.storage.set("progress_v2", JSON.stringify(np)); } catch {}
  }, []);
  const saveNotes = useCallback(async (nn) => {
    setNotes(nn);
    try { await window.storage.set("notes_v2", JSON.stringify(nn)); } catch {}
  }, []);

  const toggleTask = useCallback(async (dayNum, block, idx) => {
    const key = `${dayNum}-${block}-${idx}`;
    const np = { ...progress, [key]: !progress[key] };
    await saveProgress(np);
  }, [progress, saveProgress]);

  const getTaskCount = (dayNum) => {
    const d = DAYS_DATA[dayNum - 1]; if (!d) return { done: 0, total: 0 };
    let done = 0, total = 0;
    for (const [block, data] of Object.entries(d.blocks)) {
      total += data.tasks.length;
      data.tasks.forEach((_, i) => { if (progress[`${dayNum}-${block}-${i}`]) done++; });
    }
    return { done, total };
  };
  const getDayPct = (dayNum) => { const { done, total } = getTaskCount(dayNum); return total > 0 ? Math.round(done / total * 100) : 0; };

  const totalTasks = DAYS_DATA.reduce((s, d) => s + Object.values(d.blocks).reduce((ss, b) => ss + b.tasks.length, 0), 0);
  const doneTasks = Object.values(progress).filter(Boolean).length;
  const totalDone = DAYS_DATA.filter(d => getDayPct(d.day) === 100).length;
  const today = startDate ? Math.min(60, Math.max(1, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000) + 1)) : 1;

  const getAIFeedback = async (dayNum) => {
    setLoadingAI(true);
    const d = DAYS_DATA[dayNum - 1];
    const { done, total } = getTaskCount(dayNum);
    const completedTasks = [];
    for (const [block, data] of Object.entries(d.blocks)) {
      data.tasks.forEach((t, i) => { if (progress[`${dayNum}-${block}-${i}`]) completedTasks.push(t); });
    }
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 1000,
          system: `You are a dedicated study coach for AAM (Md. Ashraful Alam Mazid), a new Mechanical Engineering student at CUET Bangladesh. He follows a 60-day pre-campus plan: AI Automation (n8n, Make.com, Claude Code, Python), Mechanical Engineering fundamentals, and English & Prompt Engineering. He wants to earn freelance income on Upwork/Fiverr. Be warm, specific, and motivating. Under 180 words. Use emojis naturally.`,
          messages: [{ role: "user", content: `Day ${dayNum} – "${d.title}"\nCompleted: ${done}/${total} tasks (${Math.round(done/total*100)}%)\nDone: ${completedTasks.slice(0,5).map(t=>`✓ ${t}`).join('\n')||'None yet'}\nNotes: "${notes[dayNum]||'No notes'}"\n\nGive: 1) Progress assessment 2) Specific insight on what was completed 3) Motivation for remaining 4) Tip for Day ${Math.min(60,dayNum+1)}` }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "Keep going! Every task counts. 💪";
      const nf = { ...aiFeedback, [dayNum]: { text, timestamp: new Date().toLocaleString("en-BD") } };
      setAiFeedback(nf);
      try { await window.storage.set("aiFeedback_v2", JSON.stringify(nf)); } catch {}
    } catch {
      const nf = { ...aiFeedback, [dayNum]: { text: `Great work on Day ${dayNum}! You've done ${done}/${total} tasks. Stay consistent — every day counts on your path to CUET and freelancing success! 🚀`, timestamp: new Date().toLocaleString("en-BD") } };
      setAiFeedback(nf);
    }
    setLoadingAI(false);
  };

  const pc = (phaseId) => {
    const phaseColorMap = { 1: colors.phase1, 2: colors.phase2, 3: colors.phase3, 4: colors.phase4 };
    return phaseColorMap[phaseId] || colors.phase1;
  };
  const blockMeta = {
    ai: { icon: "🤖", color: colors.info, bg: theme === "dark" ? "#EFF6FF" : "#DBEAFE", label: "AI Automation" },
    mech: { icon: "⚙️", color: colors.success, bg: theme === "dark" ? "#ECFDF5" : "#D1FAE5", label: "Mechanics" },
    eng: { icon: "🗣️", color: colors.warning, bg: theme === "dark" ? "#FFFBEB" : "#FEF3C7", label: "English & Prompting" }
  };

  // Helper for dynamic backgrounds (phase light backgrounds)
  const getPhaseBg = (phaseId, isLight = false) => {
    const phaseColor = pc(phaseId);
    if (theme === "dark") return `${phaseColor}22`;
    return `${phaseColor}0C`; // very light in light mode
  };

  // ===== RENDERERS (Task Resource, Day, Dashboard) =====
  // Task Resource View
  if (view === "task" && selectedTask) {
    const { task, block, idx, dayNum } = selectedTask;
    const rKey = getResourceKey(task);
    const res = rKey ? RESOURCES[rKey] : null;
    const bm = blockMeta[block] || blockMeta.ai;
    const isDone = !!progress[`${dayNum}-${block}-${idx}`];
    const d = DAYS_DATA[dayNum - 1];

    return (
      <div style={{ minHeight: "100vh", background: colors.background, fontFamily: "'Outfit', sans-serif", color: colors.textPrimary }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Header with theme toggle */}
        <div style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: "14px 18px", position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setView("day")} style={{ background: colors.surfaceHover, border: `1px solid ${colors.border}`, color: colors.textSecondary, padding: "8px 14px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontSize: "15px", display: "flex", alignItems: "center", gap: "6px" }}>← Back</button>
            <div>
              <div style={{ fontSize: "12px", color: colors.textMuted }}>Day {dayNum} · {bm.icon} {bm.label}</div>
              <div style={{ fontSize: "15px", fontWeight: "600", color: colors.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task}</div>
            </div>
          </div>
          <button onClick={toggleTheme} style={{ background: "transparent", border: `1px solid ${colors.border}`, borderRadius: "30px", padding: "8px", cursor: "pointer", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px" }}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "20px 16px 40px" }}>
          {/* Task card */}
          <div style={{ background: `linear-gradient(135deg, ${bm.color}22, ${bm.color}08)`, border: `1px solid ${bm.color}44`, borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
              <div onClick={() => { toggleTask(dayNum, block, idx); }} style={{ width: "28px", height: "28px", borderRadius: "8px", border: `2.5px solid ${isDone ? bm.color : colors.textMuted}`, background: isDone ? bm.color : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", marginTop: "2px" }}>
                {isDone && <span style={{ color: "white", fontSize: "14px", fontWeight: "800" }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "18px", fontWeight: "600", color: colors.textPrimary, lineHeight: "1.5", marginBottom: "8px" }}>{task}</div>
                <div style={{ fontSize: "14px", color: isDone ? bm.color : colors.textMuted }}>{isDone ? "✅ Completed! Great job!" : "Tap the checkbox when you finish this task"}</div>
              </div>
            </div>
          </div>

          {res ? (
            <>
              {res.tips && (
                <div style={{ background: colors.surfaceHover, border: `1px solid ${bm.color}44`, borderRadius: "14px", padding: "18px", marginBottom: "18px" }}>
                  <div style={{ fontSize: "13px", color: bm.color, fontWeight: "700", marginBottom: "8px", letterSpacing: "1px", textTransform: "uppercase" }}>💡 Pro Tip</div>
                  <div style={{ fontSize: "16px", color: colors.textSecondary, lineHeight: "1.7" }}>{res.tips}</div>
                </div>
              )}
              {res.videos?.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#FF6B6B", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ background: "#FF6B6B22", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>▶ VIDEO TUTORIALS</span>
                  </div>
                  {res.videos.map((v, i) => (
                    <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "16px", marginBottom: "10px", textDecoration: "none", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = colors.surfaceHover; e.currentTarget.style.borderColor = "#FF6B6B66"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = colors.surface; e.currentTarget.style.borderColor = colors.border; }}>
                      <div style={{ width: "44px", height: "44px", background: "#FF6B6B22", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "20px" }}>▶</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", color: colors.textPrimary, fontWeight: "500", lineHeight: "1.4" }}>{v.label}</div>
                        <div style={{ fontSize: "12px", color: colors.textMuted, marginTop: "3px" }}>YouTube · Tap to open</div>
                      </div>
                      <span style={{ color: colors.textMuted, fontSize: "18px" }}>↗</span>
                    </a>
                  ))}
                </div>
              )}
              {res.websites?.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#4ADE80", marginBottom: "12px" }}>
                    <span style={{ background: "#4ADE8022", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>🌐 WEBSITES & COURSES</span>
                  </div>
                  {res.websites.map((w, i) => (
                    <a key={i} href={w.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "14px", background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "16px", marginBottom: "10px", textDecoration: "none", transition: "all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = colors.surfaceHover; e.currentTarget.style.borderColor = "#4ADE8066"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = colors.surface; e.currentTarget.style.borderColor = colors.border; }}>
                      <div style={{ width: "44px", height: "44px", background: "#4ADE8022", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "20px" }}>🌐</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", color: colors.textPrimary, fontWeight: "500", lineHeight: "1.4" }}>{w.label}</div>
                        <div style={{ fontSize: "12px", color: colors.textMuted, marginTop: "3px" }}>Website · Free resource</div>
                      </div>
                      <span style={{ color: colors.textMuted, fontSize: "18px" }}>↗</span>
                    </a>
                  ))}
                </div>
              )}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "16px", marginBottom: "18px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "22px" }}>📚</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: colors.textSecondary, marginBottom: "4px" }}>Textbook Tip</div>
                  <div style={{ fontSize: "14px", color: colors.textMuted, lineHeight: "1.6" }}>For Engineering Mechanics, use <span style={{ color: colors.textSecondary, fontWeight: "600" }}>Engineering Mechanics by R.C. Hibbeler</span>. For Calculus, use <span style={{ color: colors.textSecondary, fontWeight: "600" }}>Calculus by James Stewart</span>. Both are available as free PDFs online — search "{res.title} PDF" on Google.</div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "14px", padding: "28px", textAlign: "center", marginBottom: "18px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
              <div style={{ fontSize: "17px", fontWeight: "600", color: colors.textPrimary, marginBottom: "8px" }}>Task Resource</div>
              <div style={{ fontSize: "15px", color: colors.textMuted, lineHeight: "1.7" }}>This is a practice/review task. Complete it using the knowledge and tools you've already learned. If you get stuck, ask Claude directly for help!</div>
              <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: "16px", background: colors.accent, color: "white", padding: "12px 24px", borderRadius: "10px", textDecoration: "none", fontWeight: "600", fontSize: "15px" }}>Ask Claude for Help →</a>
            </div>
          )}
          <button onClick={() => { toggleTask(dayNum, block, idx); setView("day"); }}
            style={{ width: "100%", background: isDone ? colors.surface : bm.color, color: isDone ? colors.textMuted : "white", border: `2px solid ${isDone ? colors.border : bm.color}`, padding: "16px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontSize: "17px", fontWeight: "700", transition: "all 0.2s" }}>
            {isDone ? "✓ Completed — Tap to Unmark" : `Mark as Complete ✓`}
          </button>
        </div>
      </div>
    );
  }

  // Day View
  if (view === "day" && selectedDay) {
    const d = DAYS_DATA[selectedDay - 1];
    const pct = getDayPct(d.day);
    const { done, total } = getTaskCount(d.day);
    const fb = aiFeedback[d.day];
    const phaseColor = pc(d.phase);

    return (
      <div style={{ minHeight: "100vh", background: colors.background, fontFamily: "'Outfit', sans-serif", color: colors.textPrimary }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Sticky header with theme toggle */}
        <div style={{ background: colors.surface, borderBottom: `1px solid ${colors.border}`, padding: "14px 18px", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button onClick={() => setView("dashboard")} style={{ background: colors.surfaceHover, border: `1px solid ${colors.border}`, color: colors.textSecondary, padding: "8px 14px", borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", fontSize: "15px" }}>← Home</button>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                  <span style={{ background: phaseColor, color: "white", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>DAY {d.day}</span>
                  {d.isReview && <span style={{ background: colors.accent, color: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "11px" }}>Review</span>}
                  {d.isGraduation && <span style={{ background: colors.warning, color: "white", padding: "2px 8px", borderRadius: "10px", fontSize: "11px" }}>🎓 Graduation</span>}
                </div>
                <div style={{ fontSize: "17px", fontWeight: "700", color: colors.textPrimary }}>{d.title}</div>
              </div>
            </div>
            <button onClick={toggleTheme} style={{ background: "transparent", border: `1px solid ${colors.border}`, borderRadius: "30px", padding: "8px", cursor: "pointer", fontSize: "20px", width: "40px", height: "40px" }}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
            <div style={{ flex: 1, height: "6px", background: colors.surfaceHover, borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? colors.success : phaseColor, borderRadius: "3px", transition: "width 0.4s ease" }} />
            </div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: pct === 100 ? colors.success : phaseColor }}>{pct}%</div>
          </div>
        </div>

        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "18px 16px 40px" }}>
          {Object.entries(d.blocks).map(([block, data]) => {
            const bm = blockMeta[block] || blockMeta.ai;
            return (
              <div key={block} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "16px", marginBottom: "16px", overflow: "hidden" }}>
                <div style={{ background: `${bm.color}18`, borderBottom: `1px solid ${colors.border}`, padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "22px" }}>{bm.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: colors.textPrimary }}>{data.label}</div>
                    <div style={{ fontSize: "13px", color: colors.textMuted }}>{data.hours} hours today</div>
                  </div>
                  <div style={{ fontSize: "13px", color: bm.color, fontWeight: "600" }}>
                    {data.tasks.filter((_, i) => progress[`${d.day}-${block}-${i}`]).length}/{data.tasks.length}
                  </div>
                </div>
                {data.tasks.map((task, i) => {
                  const isDone = !!progress[`${d.day}-${block}-${i}`];
                  const hasRes = !!getResourceKey(task);
                  return (
                    <div key={i} style={{ borderBottom: i === data.tasks.length - 1 ? "none" : `1px solid ${colors.border}`, background: isDone ? `${bm.color}08` : "transparent" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 18px" }}>
                        <div onClick={() => toggleTask(d.day, block, i)}
                          style={{ width: "24px", height: "24px", borderRadius: "7px", border: `2px solid ${isDone ? bm.color : colors.textMuted}`, background: isDone ? bm.color : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", marginTop: "1px" }}>
                          {isDone && <span style={{ color: "white", fontSize: "13px", fontWeight: "800" }}>✓</span>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "15px", color: isDone ? colors.textMuted : colors.textSecondary, lineHeight: "1.5", textDecoration: isDone ? "line-through" : "none", marginBottom: hasRes ? "8px" : "0" }}>{task}</div>
                          {hasRes && (
                            <button onClick={() => { setSelectedTask({ task, block, idx: i, dayNum: d.day }); setView("task"); }}
                              style={{ background: `${bm.color}18`, border: `1px solid ${bm.color}44`, color: bm.color, padding: "5px 12px", borderRadius: "20px", cursor: "pointer", fontFamily: "inherit", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                              📚 View Resources →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Notes */}
          <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "16px", marginBottom: "16px", overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>📝</span>
              <span style={{ fontSize: "16px", fontWeight: "700", color: colors.textPrimary }}>My Notes</span>
            </div>
            <textarea value={notes[d.day] || ""} onChange={e => { saveNotes({ ...notes, [d.day]: e.target.value }); }}
              placeholder="Write your reflections, wins, struggles, or anything from today..."
              style={{ width: "100%", minHeight: "90px", background: "transparent", border: "none", color: colors.textSecondary, padding: "14px 18px", fontFamily: "inherit", fontSize: "15px", lineHeight: "1.6", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          </div>

          {/* AI Feedback */}
          <div style={{ background: `linear-gradient(135deg, ${colors.accent}22, ${colors.surface})`, border: `1px solid ${colors.accent}66`, borderRadius: "16px", padding: "18px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: fb ? "14px" : "0", gap: "10px", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: colors.textPrimary }}>🤖 AI Coach Feedback</div>
                <div style={{ fontSize: "13px", color: colors.accent, marginTop: "2px" }}>Personalized analysis of your progress</div>
              </div>
              <button onClick={() => getAIFeedback(d.day)} disabled={loadingAI}
                style={{ background: colors.accent, color: "white", border: "none", padding: "10px 18px", borderRadius: "10px", cursor: loadingAI ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: "15px", fontWeight: "600", opacity: loadingAI ? 0.6 : 1 }}>
                {loadingAI ? "Analyzing…" : fb ? "Refresh" : "Get Feedback"}
              </button>
            </div>
            {fb && (
              <div style={{ background: `${colors.accent}22`, borderRadius: "10px", padding: "14px", border: `1px solid ${colors.accent}33` }}>
                <div style={{ fontSize: "15px", color: colors.textSecondary, lineHeight: "1.8", whiteSpace: "pre-wrap" }}>{fb.text}</div>
                <div style={{ fontSize: "12px", color: colors.accent, marginTop: "8px" }}>Updated: {fb.timestamp}</div>
              </div>
            )}
            {!fb && !loadingAI && (
              <div style={{ textAlign: "center", padding: "12px 0 0", color: colors.textMuted, fontSize: "14px" }}>Check off some tasks first, then get your AI feedback! 👆</div>
            )}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", gap: "10px" }}>
            {d.day > 1 && <button onClick={() => setSelectedDay(d.day - 1)} style={{ flex: 1, background: colors.surface, border: `1px solid ${colors.border}`, color: colors.textMuted, padding: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontSize: "15px" }}>← Day {d.day - 1}</button>}
            {d.day < 60 && <button onClick={() => setSelectedDay(d.day + 1)} style={{ flex: 1, background: `${pc(DAYS_DATA[d.day]?.phase || d.phase)}18`, border: `1px solid ${pc(DAYS_DATA[d.day]?.phase || d.phase)}44`, color: pc(DAYS_DATA[d.day]?.phase || d.phase), padding: "14px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontSize: "15px", fontWeight: "700" }}>Day {d.day + 1} →</button>}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div style={{ minHeight: "100vh", background: colors.background, fontFamily: "'Outfit', sans-serif", color: colors.textPrimary }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Hero with theme toggle */}
      <div style={{ background: `linear-gradient(160deg, ${colors.surface} 0%, ${colors.background} 100%)`, padding: "24px 18px 20px", borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: colors.accent, fontWeight: "700", marginBottom: "8px", textTransform: "uppercase" }}>CUET Pre-Campus Roadmap</div>
              <h1 style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: "800", color: colors.textPrimary, lineHeight: "1.2" }}>60-Day Master Tracker</h1>
              <p style={{ color: colors.textMuted, fontSize: "15px", margin: "0" }}>Md. Ashraful Alam Mazid · Mechanical Engineering</p>
            </div>
            <button onClick={toggleTheme} style={{ background: "transparent", border: `1px solid ${colors.border}`, borderRadius: "30px", padding: "8px", cursor: "pointer", fontSize: "20px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px", marginBottom: "18px" }}>
            {[
              { label: "Days Done", val: totalDone, color: colors.success },
              { label: "Tasks Done", val: doneTasks, color: colors.info },
              { label: "Progress", val: `${Math.round(doneTasks / totalTasks * 100)}%`, color: colors.accent },
              { label: "Today", val: `D${today}`, color: colors.warning },
            ].map(s => (
              <div key={s.label} style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "12px", padding: "12px 10px", textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.val}</div>
                <div style={{ fontSize: "11px", color: colors.textMuted, marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div style={{ height: "8px", background: colors.surfaceHover, borderRadius: "4px", overflow: "hidden", marginBottom: "16px" }}>
            <div style={{ height: "100%", width: `${Math.round(doneTasks / totalTasks * 100)}%`, background: `linear-gradient(90deg, ${colors.info}, ${colors.accent}, ${colors.success})`, borderRadius: "4px", transition: "width 0.5s" }} />
          </div>

          {/* Start / Today button */}
          {!startDate ? (
            <button onClick={async () => { const d = new Date().toISOString(); setStartDate(d); try { await window.storage.set("startDate_v2", d); } catch {} }}
              style={{ width: "100%", background: colors.accent, color: "white", border: "none", padding: "15px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontSize: "17px", fontWeight: "700" }}>
              🚀 Start My Journey — Day 1 Begins Now
            </button>
          ) : (
            <button onClick={() => { setSelectedDay(today); setView("day"); }}
              style={{ width: "100%", background: `linear-gradient(135deg, ${colors.accent}, ${colors.info})`, color: "white", border: "none", padding: "15px", borderRadius: "12px", cursor: "pointer", fontFamily: "inherit", fontSize: "17px", fontWeight: "700" }}>
              📅 Open Day {today}: {DAYS_DATA[today - 1]?.title} →
            </button>
          )}
        </div>
      </div>

      {/* Day Grid */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "20px 16px 40px" }}>
        {PHASES.map(phase => {
          const phaseDays = DAYS_DATA.filter(d => d.phase === phase.id);
          const phTotal = phaseDays.reduce((s, d) => s + Object.values(d.blocks).reduce((ss, b) => ss + b.tasks.length, 0), 0);
          const phDone = phaseDays.reduce((s, d) => {
            return s + Object.values(d.blocks).reduce((ss, b, bi) => {
              const bk = Object.keys(d.blocks)[bi];
              return ss + b.tasks.filter((_, i) => progress[`${d.day}-${bk}-${i}`]).length;
            }, 0);
          }, 0);
          const phPct = phTotal > 0 ? Math.round(phDone / phTotal * 100) : 0;
          const phaseColor = pc(phase.id);

          return (
            <div key={phase.id} style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                <div style={{ width: "4px", height: "40px", background: phaseColor, borderRadius: "2px", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "17px", fontWeight: "700", color: colors.textPrimary }}>{phase.weeks}: {phase.label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                    <div style={{ flex: 1, height: "5px", background: colors.surfaceHover, borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${phPct}%`, background: phaseColor, borderRadius: "3px", transition: "width 0.5s" }} />
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: phaseColor, minWidth: "36px", textAlign: "right" }}>{phPct}%</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "8px" }}>
                {phaseDays.map(d => {
                  const pct = getDayPct(d.day);
                  const isToday = d.day === today && !!startDate;
                  return (
                    <div key={d.day} onClick={() => { setSelectedDay(d.day); setView("day"); }}
                      style={{ background: isToday ? `linear-gradient(135deg, ${colors.accent}22, ${colors.accent}44)` : colors.surface, border: `2px solid ${isToday ? colors.accent : pct === 100 ? `${phaseColor}88` : colors.border}`, borderRadius: "12px", padding: "12px 10px", cursor: "pointer", transition: "all 0.2s", position: "relative", textAlign: "center" }}
                      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = phaseColor; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = isToday ? colors.accent : pct === 100 ? `${phaseColor}88` : colors.border; }}>
                      {pct === 100 && <div style={{ position: "absolute", top: "-1px", right: "-1px", width: "18px", height: "18px", background: colors.success, borderRadius: "0 10px 0 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: "10px" }}>✓</span>
                      </div>}
                      <div style={{ fontSize: "13px", fontWeight: "800", color: isToday ? colors.accent : phaseColor, marginBottom: "4px" }}>D{d.day}</div>
                      {isToday && <div style={{ fontSize: "9px", color: colors.accent, fontWeight: "700", marginBottom: "3px", letterSpacing: "1px" }}>TODAY</div>}
                      <div style={{ fontSize: "11px", color: colors.textMuted, lineHeight: "1.3", marginBottom: "8px", minHeight: "28px" }}>{d.title.length > 18 ? d.title.slice(0, 16) + "…" : d.title}</div>
                      <div style={{ height: "3px", background: colors.surfaceHover, borderRadius: "2px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? colors.success : phaseColor, transition: "width 0.4s" }} />
                      </div>
                      <div style={{ fontSize: "11px", color: colors.textMuted, marginTop: "4px" }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: "14px", padding: "16px 18px" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: colors.textMuted, marginBottom: "12px" }}>HOW TO USE</div>
          {[
            { icon: "📅", text: "Tap any day card to open today's lesson" },
            { icon: "📚", text: "Tap 'View Resources' on any task to get videos, websites & tips" },
            { icon: "✅", text: "Tap the checkbox to mark a task complete" },
            { icon: "🤖", text: "Get AI coaching feedback after completing tasks" },
            { icon: "📝", text: "Write notes to remember your daily wins" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${colors.border}` : "none" }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ fontSize: "15px", color: colors.textSecondary }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== WRAPPER WITH THEME PROVIDER =====
const AppWithTheme = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default AppWithTheme;
