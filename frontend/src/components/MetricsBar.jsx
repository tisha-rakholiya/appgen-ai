export default function MetricsBar({ metrics }) {
  if (!metrics) return null;
  return (
    <div style={{display:"flex",gap:"16px",marginBottom:"24px"}}>
      {[
        { label: "Latency", value: `${metrics.latency_seconds}s`, color: "#22d3ee" },
        { label: "Retries", value: metrics.retries, color: metrics.retries > 0 ? "#fbbf24" : "#34d399" },
        { label: "Status", value: metrics.success ? "Success ✓" : "Failed", color: metrics.success ? "#34d399" : "#f87171" },
      ].map((m) => (
        <div key={m.label} style={{background:"#111827",border:"1px solid #1f2937",borderRadius:"8px",padding:"8px 16px",display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{color:"#6b7280",fontSize:"12px"}}>{m.label}:</span>
          <span style={{color:m.color,fontSize:"14px",fontWeight:"bold"}}>{m.value}</span>
        </div>
      ))}
    </div>
  );
}