const STAGES = [
  { key: "intent", label: "Stage 1", title: "Intent Extraction", desc: "Parsing requirements" },
  { key: "architecture", label: "Stage 2", title: "System Architecture", desc: "Designing structure" },
  { key: "schema", label: "Stage 3", title: "Schema Generation", desc: "DB + UI + Auth" },
  { key: "validation", label: "Stage 4", title: "Validation & Repair", desc: "Ensuring consistency" },
];

export default function PipelineView({ loading, result }) {
  return (
    <div style={{marginBottom:"24px"}}>
      <p style={{fontSize:"11px",color:"#6b7280",marginBottom:"12px",letterSpacing:"0.1em",textTransform:"uppercase"}}>Pipeline Stages</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}}>
        {STAGES.map((stage) => {
          const done = result?.stages?.[stage.key];
          return (
            <div key={stage.key} style={{background: done ? "rgba(6,78,59,0.2)" : "#111827", border: done ? "1px solid #065f46" : "1px solid #1f2937", borderRadius:"12px", padding:"12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
                <span style={{fontSize:"11px",color:"#6b7280"}}>{stage.label}</span>
                {done && <span style={{color:"#34d399",fontSize:"12px"}}>✓</span>}
                {!done && loading && <span style={{color:"#a78bfa",fontSize:"12px"}}>⟳</span>}
              </div>
              <p style={{color:"white",fontSize:"12px",fontWeight:"600",margin:"0 0 2px 0"}}>{stage.title}</p>
              <p style={{color:"#6b7280",fontSize:"11px",margin:"0"}}>{stage.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}