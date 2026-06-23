import { useState } from "react";

const TEST_PROMPTS = [
  { id: 1, type: "normal", prompt: "Build a CRM with login, contacts, dashboard, role-based access, and premium plan with payments. Admins can see analytics." },
  { id: 2, type: "normal", prompt: "Create an e-commerce store with products, cart, checkout, order tracking and admin panel" },
  { id: 3, type: "normal", prompt: "Build a project management tool like Jira with tasks, sprints, teams and notifications" },
  { id: 4, type: "normal", prompt: "Create a blog platform with posts, comments, categories, author dashboard and SEO" },
  { id: 5, type: "normal", prompt: "Build a food delivery app with restaurants, menus, orders, delivery tracking and payments" },
  { id: 6, type: "edge", prompt: "app" },
  { id: 7, type: "edge", prompt: "make something cool" },
  { id: 8, type: "edge", prompt: "Build a platform with users" },
  { id: 9, type: "edge", prompt: "social media but better than instagram with ai features" },
  { id: 10, type: "edge", prompt: "Build an app with login and dashboard and payments and notifications and analytics and chat and video and marketplace" },
];

export default function EvalDashboard() {
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(0);

  const runEval = async () => {
    setRunning(true);
    setResults([]);
    setCurrent(0);

    for (let i = 0; i < TEST_PROMPTS.length; i++) {
      const p = TEST_PROMPTS[i];
      setCurrent(i + 1);
      const start = Date.now();
      try {
        const res = await fetch("http://localhost:8000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: p.prompt }),
        });
        const data = await res.json();
        const latency = ((Date.now() - start) / 1000).toFixed(2);
        setResults(prev => [...prev, {
          ...p,
          success: res.ok,
          latency,
          retries: data.metrics?.retries ?? 0,
          has_db: !!data.final_schema?.database_schema,
          has_ui: !!data.final_schema?.ui_schema,
          has_auth: !!data.final_schema?.auth_schema,
        }]);
      } catch (e) {
        setResults(prev => [...prev, { ...p, success: false, latency: "—", retries: 0, has_db: false, has_ui: false, has_auth: false }]);
      }
    }
    setRunning(false);
  };

  const successRate = results.length ? Math.round((results.filter(r => r.success).length / results.length) * 100) : 0;
  const avgLatency = results.length ? (results.reduce((a, r) => a + (parseFloat(r.latency) || 0), 0) / results.length).toFixed(2) : 0;
  const avgRetries = results.length ? (results.reduce((a, r) => a + r.retries, 0) / results.length).toFixed(1) : 0;

  return (
    <div style={{marginTop:"40px",background:"#0a0a0f",border:"1px solid #1f2937",borderRadius:"16px",padding:"24px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"24px"}}>
        <div>
          <h2 style={{color:"white",fontSize:"18px",fontWeight:"700",margin:"0 0 4px 0"}}>📊 Evaluation Framework</h2>
          <p style={{color:"#6b7280",fontSize:"12px",margin:"0"}}>10 prompts: 5 normal + 5 edge cases</p>
        </div>
        <button onClick={runEval} disabled={running}
          style={{background:running?"#374151":"#7c3aed",color:"white",border:"none",padding:"10px 20px",borderRadius:"8px",fontSize:"13px",fontWeight:"600",cursor:running?"not-allowed":"pointer"}}>
          {running ? `Running ${current}/10...` : "▶ Run All Tests"}
        </button>
      </div>

      {results.length > 0 && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"12px",marginBottom:"24px"}}>
          {[
            { label: "Success Rate", value: `${successRate}%`, color: successRate >= 80 ? "#34d399" : "#f87171" },
            { label: "Avg Latency", value: `${avgLatency}s`, color: "#22d3ee" },
            { label: "Avg Retries", value: avgRetries, color: "#fbbf24" },
          ].map(m => (
            <div key={m.label} style={{background:"#111827",borderRadius:"10px",padding:"16px",textAlign:"center"}}>
              <div style={{fontSize:"28px",fontWeight:"800",color:m.color}}>{m.value}</div>
              <div style={{fontSize:"12px",color:"#6b7280",marginTop:"4px"}}>{m.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {TEST_PROMPTS.map((p) => {
          const r = results.find(x => x.id === p.id);
          return (
            <div key={p.id} style={{background:"#111827",borderRadius:"8px",padding:"12px 16px",display:"flex",alignItems:"center",gap:"12px"}}>
              <span style={{fontSize:"10px",padding:"2px 8px",borderRadius:"99px",background: p.type === "edge" ? "rgba(251,191,36,0.15)" : "rgba(124,58,237,0.15)", color: p.type === "edge" ? "#fbbf24" : "#a78bfa",whiteSpace:"nowrap"}}>
                {p.type === "edge" ? "⚡ Edge" : "✅ Normal"}
              </span>
              <span style={{color:"#9ca3af",fontSize:"12px",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.prompt}</span>
              {r ? (
                <div style={{display:"flex",gap:"8px",alignItems:"center",flexShrink:0}}>
                  <span style={{fontSize:"11px",color:"#6b7280"}}>{r.latency}s</span>
                  <span style={{fontSize:"11px",color: r.has_db && r.has_ui && r.has_auth ? "#34d399" : "#f87171"}}>
                    DB:{r.has_db?"✓":"✗"} UI:{r.has_ui?"✓":"✗"} Auth:{r.has_auth?"✓":"✗"}
                  </span>
                  <span style={{fontSize:"13px"}}>{r.success ? "✅" : "❌"}</span>
                </div>
              ) : (
                <span style={{fontSize:"11px",color: running && current === p.id ? "#a78bfa" : "#374151"}}>
                  {running && current === p.id ? "⟳ running..." : "pending"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}