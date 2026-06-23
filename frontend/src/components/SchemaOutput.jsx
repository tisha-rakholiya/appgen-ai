import { useState } from "react";

const TABS = [
  { key: "final_schema", label: "Final Schema" },
  { key: "intent", label: "Intent" },
  { key: "architecture", label: "Architecture" },
  { key: "validation", label: "Validation" },
];

export default function SchemaOutput({ result }) {
  const [activeTab, setActiveTab] = useState("final_schema");
  const getData = () => activeTab === "final_schema" ? result.final_schema : result.stages?.[activeTab];
  const handleCopy = () => navigator.clipboard.writeText(JSON.stringify(getData(), null, 2));

  return (
    <div style={{background:"#111827",border:"1px solid #1f2937",borderRadius:"12px",overflow:"hidden"}}>
      <div style={{display:"flex",borderBottom:"1px solid #1f2937"}}>
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{padding:"12px 16px",fontSize:"12px",fontWeight:"500",background:"transparent",border:"none",cursor:"pointer",
              color: activeTab === tab.key ? "#a78bfa" : "#6b7280",
              borderBottom: activeTab === tab.key ? "2px solid #7c3aed" : "2px solid transparent"}}>
            {tab.label}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",padding:"0 16px"}}>
          <button onClick={handleCopy} style={{fontSize:"12px",color:"#6b7280",background:"transparent",border:"none",cursor:"pointer"}}>Copy JSON</button>
        </div>
      </div>
      <div style={{padding:"16px",overflowY:"auto",maxHeight:"400px"}}>
        <pre style={{fontSize:"12px",color:"#34d399",lineHeight:"1.6",margin:"0",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
          {JSON.stringify(getData(), null, 2)}
        </pre>
      </div>
    </div>
  );
}