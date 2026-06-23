import { useState } from "react";
import PipelineView from "./components/PipelineView.jsx";
import SchemaOutput from "./components/SchemaOutput";
import MetricsBar from "./components/MetricsBar";
import EvalDashboard from "./components/EvalDashboard";
const EXAMPLES = [
  "Build a CRM with login, contacts, dashboard, role-based access, and premium plan with payments. Admins can see analytics.",
  "Create an e-commerce store with products, cart, checkout, order tracking and admin panel",
  "Build a project management tool like Jira with tasks, sprints, teams and notifications",
  "Create a blog platform with posts, comments, categories, author dashboard and SEO",
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("https://appgen-ai.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Server error: " + res.status);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:"#030712",color:"white",fontFamily:"monospace"}}>
      <div style={{borderBottom:"1px solid #1f2937",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{width:"32px",height:"32px",background:"#7c3aed",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",fontSize:"13px"}}>AG</div>
          <span style={{fontSize:"18px",fontWeight:"600"}}>AppGen</span>
          <span style={{fontSize:"11px",background:"rgba(124,58,237,0.2)",color:"#a78bfa",padding:"2px 8px",borderRadius:"99px",border:"1px solid #5b21b6"}}>v1.0 · AI Compiler</span>
        </div>
        <span style={{fontSize:"12px",color:"#6b7280"}}>Natural Language → App Schema</span>
      </div>

      <div style={{maxWidth:"900px",margin:"0 auto",padding:"40px 24px"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <h1 style={{fontSize:"32px",fontWeight:"bold",marginBottom:"8px",background:"linear-gradient(to right,#a78bfa,#22d3ee)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            Describe your app. We'll architect it.
          </h1>
          <p style={{color:"#9ca3af",fontSize:"14px"}}>Multi-stage AI pipeline: Intent → Architecture → Schema → Validation</p>
        </div>

        <div style={{background:"#111827",border:"1px solid #1f2937",borderRadius:"12px",padding:"16px",marginBottom:"16px"}}>
          <textarea
            style={{width:"100%",background:"transparent",color:"white",border:"none",outline:"none",resize:"none",fontSize:"14px",lineHeight:"1.6",fontFamily:"monospace"}}
            rows={4}
            placeholder="e.g. Build a CRM with login, contacts, dashboard, role-based access..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"12px",paddingTop:"12px",borderTop:"1px solid #1f2937"}}>
            <span style={{fontSize:"12px",color:"#4b5563"}}>{prompt.length} chars</span>
            <button onClick={handleGenerate} disabled={loading || !prompt.trim()}
              style={{background:loading||!prompt.trim()?"#4b5563":"#7c3aed",color:"white",border:"none",padding:"8px 24px",borderRadius:"8px",fontSize:"13px",fontWeight:"600",cursor:loading||!prompt.trim()?"not-allowed":"pointer"}}>
              {loading ? "⏳ Generating..." : "⚡ Generate Schema"}
            </button>
          </div>
        </div>

        <div style={{marginBottom:"32px"}}>
          <p style={{fontSize:"12px",color:"#4b5563",marginBottom:"8px"}}>Try an example:</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setPrompt(ex)}
                style={{fontSize:"11px",color:"#9ca3af",background:"#111827",border:"1px solid #1f2937",padding:"6px 12px",borderRadius:"8px",cursor:"pointer"}}>
                {ex.slice(0, 50)}...
              </button>
            ))}
          </div>
        </div>

        {(loading || result) && <PipelineView loading={loading} result={result} />}
        {error && <div style={{background:"rgba(127,29,29,0.5)",border:"1px solid #991b1b",borderRadius:"12px",padding:"16px",marginBottom:"24px",color:"#f87171",fontSize:"14px"}}>⚠️ {error}</div>}
        {result && <MetricsBar metrics={result.metrics} />}
        {result && <SchemaOutput result={result} />}
       <EvalDashboard />
      </div>
    </div>
  );
}