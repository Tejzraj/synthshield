import { useState } from "react";

const PERSONAS = [
  { id:"student", label:"Student", desc:"Late-night usage · Social & academic apps" },
  { id:"professional", label:"Professional", desc:"Heavy scheduling · Email & productivity" },
  { id:"traveler", label:"Traveler", desc:"Maps & bookings · Multi-timezone patterns" }
];

const LAYERS = [
  { id:"l1", num:"01", name:"Knowledge Acquisition", sub:"DP analysis & behavioral modeling" },
  { id:"l2", num:"02", name:"Persona Generation", sub:"Synthesizing user profile via AI" },
  { id:"l3", num:"03", name:"Data Tank Population", sub:"Generating synthetic artifacts" }
];

const TABS = [
  { id:"emails", label:"Emails" },
  { id:"calendar", label:"Calendar" },
  { id:"applogs", label:"App logs" }
];

export default function App() {
  const [phase, setPhase] = useState("config");
  const [personaType, setPersonaType] = useState("student");
  const [epsilon, setEpsilon] = useState(0.8);
  const [layerStatus, setLayerStatus] = useState({ l1:"idle", l2:"idle", l3:"idle" });
  const [persona, setPersona] = useState(null);
  const [artifacts, setArtifacts] = useState(null);
  const [activeTab, setActiveTab] = useState("emails");
  const [error, setError] = useState(null);

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const callClaude = async (system, user) => {
    const r = await fetch("http://localhost:3001/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, user })
    });
    if (!r.ok) throw new Error(`API error ${r.status}`);
    const d = await r.json();
    const t = d.content[0].text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(t);
  };

  const runPipeline = async () => {
    setPhase("running"); setError(null);
    setLayerStatus({ l1:"running", l2:"idle", l3:"idle" });
    await sleep(1800);
    try {
      setLayerStatus({ l1:"done", l2:"running", l3:"idle" });
      const p = await callClaude(
        "You generate synthetic user personas. Respond ONLY with valid JSON, no markdown.",
        "Create a synthetic " + personaType + " persona with epsilon=" + epsilon.toFixed(1) + ". Return ONLY this JSON: {\"name\":\"Full Name\",\"age\":25,\"occupation\":\"Role\",\"location\":\"City, Country\",\"deviceUsage\":\"One sentence\",\"topApps\":[\"App1\",\"App2\",\"App3\",\"App4\"],\"peakHours\":\"10pm-1am\",\"privacyScore\":0.97,\"behaviorTags\":[\"tag1\",\"tag2\",\"tag3\"]}"
      );
      setPersona(p);
      setLayerStatus({ l1:"done", l2:"done", l3:"running" });
      const a = await callClaude(
        "You generate synthetic device artifacts. Respond ONLY with valid JSON, no markdown.",
        "Generate artifacts for " + p.name + ", " + p.occupation + " (" + personaType + "). Return ONLY this JSON: {\"emails\":[{\"from\":\"a@b.com\",\"subject\":\"Subj\",\"preview\":\"Body preview\",\"time\":\"Mon 9am\",\"label\":\"work\"},{\"from\":\"c@d.com\",\"subject\":\"Subj2\",\"preview\":\"Preview2\",\"time\":\"Sun 3pm\",\"label\":\"personal\"},{\"from\":\"e@f.com\",\"subject\":\"Subj3\",\"preview\":\"Preview3\",\"time\":\"Sat 8am\",\"label\":\"promo\"}],\"calendarEvents\":[{\"title\":\"Event\",\"time\":\"Tue 2pm\",\"duration\":\"1h\",\"type\":\"meeting\"},{\"title\":\"Event2\",\"time\":\"Wed 11am\",\"duration\":\"30m\",\"type\":\"personal\"},{\"title\":\"Event3\",\"time\":\"Thu 9am\",\"duration\":\"15m\",\"type\":\"reminder\"}],\"appLogs\":[{\"app\":\"App\",\"action\":\"action\",\"timestamp\":\"9:05 AM\",\"duration\":\"8m\"},{\"app\":\"App2\",\"action\":\"action2\",\"timestamp\":\"10:30 AM\",\"duration\":\"3m\"},{\"app\":\"App3\",\"action\":\"action3\",\"timestamp\":\"2:15 PM\",\"duration\":\"22m\"},{\"app\":\"App4\",\"action\":\"action4\",\"timestamp\":\"11:45 PM\",\"duration\":\"5m\"}]}"
      );
      setArtifacts(a);
      setLayerStatus({ l1:"done", l2:"done", l3:"done" });
      await sleep(500);
      setPhase("results");
    } catch(e) {
      setError("Error: " + e.message);
      setPhase("config");
      setLayerStatus({ l1:"idle", l2:"idle", l3:"idle" });
    }
  };

  const reset = () => {
    setPhase("config"); setPersona(null); setArtifacts(null);
    setLayerStatus({ l1:"idle", l2:"idle", l3:"idle" }); setError(null);
  };

  if (phase === "config") return (
    <div style={{maxWidth:600,margin:"40px auto",padding:"0 20px",fontFamily:"system-ui"}}>
      <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px"}}>SynthShield</h1>
      <p style={{margin:"0 0 24px",fontSize:13,color:"#666"}}>Privacy-preserving synthetic data pipeline</p>
      <p style={{fontSize:12,fontWeight:600,color:"#888",margin:"0 0 8px",textTransform:"uppercase"}}>Persona type</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:24}}>
        {PERSONAS.map(p => (
          <div key={p.id} onClick={() => setPersonaType(p.id)} style={{padding:12,borderRadius:8,cursor:"pointer",border:personaType===p.id?"2px solid #378add":"1px solid #ddd",background:personaType===p.id?"#e6f1fb":"#fff"}}>
            <p style={{margin:"0 0 2px",fontSize:13,fontWeight:600,color:personaType===p.id?"#185fa5":"#111"}}>{p.label}</p>
            <p style={{margin:0,fontSize:11,color:personaType===p.id?"#378add":"#888"}}>{p.desc}</p>
          </div>
        ))}
      </div>
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <p style={{margin:0,fontSize:12,fontWeight:600,color:"#888",textTransform:"uppercase"}}>Privacy budget (ε)</p>
          <span style={{fontFamily:"monospace",fontSize:14,fontWeight:600}}>{epsilon.toFixed(1)}</span>
        </div>
        <input type="range" min="0.1" max="2.0" step="0.1" value={epsilon} onChange={e=>setEpsilon(parseFloat(e.target.value))} style={{width:"100%"}} />
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          <span style={{fontSize:11,color:"#aaa"}}>stronger privacy</span>
          <span style={{fontSize:11,color:"#aaa"}}>higher utility</span>
        </div>
      </div>
      {error && <p style={{fontSize:13,color:"red",marginBottom:16,padding:10,borderRadius:6,border:"1px solid #fcc",background:"#fff5f5"}}>{error}</p>}
      <button onClick={runPipeline} style={{width:"100%",padding:12,fontSize:14,fontWeight:600,background:"#185fa5",color:"#fff",border:"none",borderRadius:8,cursor:"pointer"}}>
        Run SynthShield Pipeline →
      </button>
    </div>
  );

  if (phase === "running") return (
    <div style={{maxWidth:600,margin:"40px auto",padding:"0 20px",fontFamily:"system-ui"}}>
      <h2 style={{fontSize:20,fontWeight:700,margin:"0 0 4px"}}>Pipeline running...</h2>
      <p style={{margin:"0 0 24px",fontSize:13,color:"#666"}}>Generating {personaType} persona · ε = {epsilon.toFixed(1)}</p>
      {LAYERS.map(layer => {
        const s = layerStatus[layer.id];
        return (
          <div key={layer.id} style={{padding:16,marginBottom:8,borderRadius:8,border:s==="running"?"2px solid #378add":"1px solid #eee",background:s==="running"?"#e6f1fb":"#fff"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <p style={{margin:0,fontSize:13,fontWeight:600}}>{layer.num} — {layer.name}</p>
                <p style={{margin:0,fontSize:11,color:"#888"}}>{layer.sub}</p>
              </div>
              {s==="idle" && <span style={{fontSize:11,color:"#aaa"}}>waiting</span>}
              {s==="running" && <span style={{fontSize:11,color:"#185fa5",fontWeight:600}}>processing...</span>}
              {s==="done" && <span style={{fontSize:11,color:"green",fontWeight:600}}>✓ done</span>}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (phase === "results" && persona && artifacts) return (
    <div style={{maxWidth:600,margin:"40px auto",padding:"0 20px",fontFamily:"system-ui"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div>
          <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:700}}>Persona ready</h2>
          <p style={{margin:0,fontSize:13,color:"#666"}}>ε={epsilon.toFixed(1)} · Data Tank populated</p>
        </div>
        <button onClick={reset} style={{padding:"6px 12px",borderRadius:6,border:"1px solid #ddd",background:"#fff",cursor:"pointer"}}>New run</button>
      </div>
      <div style={{padding:16,marginBottom:24,borderRadius:12,border:"1px solid #eee"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:"#e6f1fb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#185fa5"}}>
            {persona.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
          </div>
          <div style={{flex:1}}>
            <p style={{margin:0,fontWeight:700,fontSize:15}}>{persona.name}</p>
            <p style={{margin:0,fontSize:12,color:"#888"}}>{persona.occupation} · {persona.location}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <p style={{margin:0,fontSize:10,color:"#aaa"}}>PRIVACY</p>
            <p style={{margin:0,fontSize:18,fontWeight:700,color:"green",fontFamily:"monospace"}}>{Math.round((persona.privacyScore||0)*100)}%</p>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
          {[{l:"Age",v:persona.age},{l:"Peak hours",v:persona.peakHours},{l:"Budget",v:epsilon.toFixed(1)}].map(s=>(
            <div key={s.l} style={{background:"#f8f8f8",borderRadius:6,padding:10}}>
              <p style={{margin:"0 0 2px",fontSize:11,color:"#aaa"}}>{s.l}</p>
              <p style={{margin:0,fontSize:13,fontWeight:600,fontFamily:"monospace"}}>{s.v}</p>
            </div>
          ))}
        </div>
        <p style={{margin:"0 0 10px",fontSize:12,color:"#666"}}>{persona.deviceUsage}</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
          {persona.behaviorTags?.map(t=>(
            <span key={t} style={{padding:"3px 9px",borderRadius:20,fontSize:11,background:"#f1f1f1",color:"#555"}}>{t}</span>
          ))}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {persona.topApps?.map(app=>(
            <span key={app} style={{padding:"3px 8px",borderRadius:4,fontSize:11,fontFamily:"monospace",background:"#e6f1fb",color:"#185fa5"}}>{app}</span>
          ))}
        </div>
      </div>
      <div style={{display:"flex",gap:0,marginBottom:14,borderBottom:"2px solid #eee"}}>
        {TABS.map(tab => {
          const counts = {emails:artifacts.emails?.length,calendar:artifacts.calendarEvents?.length,applogs:artifacts.appLogs?.length};
          const active = activeTab===tab.id;
          return (
            <div key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{padding:"8px 16px",fontSize:13,fontWeight:active?600:400,cursor:"pointer",color:active?"#185fa5":"#888",borderBottom:active?"2px solid #185fa5":"2px solid transparent",marginBottom:-2}}>
              {tab.label} ({counts[tab.id]})
            </div>
          );
        })}
      </div>
      {activeTab==="emails" && (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {artifacts.emails?.map((e,i)=>(
            <div key={i} style={{padding:"12px 14px",borderRadius:8,border:"1px solid #eee"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:600,color:"#555"}}>{e.from}</span>
                <span style={{fontSize:11,color:"#aaa"}}>{e.time}</span>
              </div>
              <p style={{margin:"0 0 3px",fontSize:13,fontWeight:600}}>{e.subject}</p>
              <p style={{margin:0,fontSize:12,color:"#888"}}>{e.preview}</p>
            </div>
          ))}
        </div>
      )}
      {activeTab==="calendar" && (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {artifacts.calendarEvents?.map((ev,i)=>(
            <div key={i} style={{padding:"12px 14px",borderRadius:8,border:"1px solid #eee",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:6,background:"#e6f1fb",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"#185fa5"}}>
                {ev.type==="meeting"?"MTG":ev.type==="personal"?"PERS":"REM"}
              </div>
              <div>
                <p style={{margin:0,fontSize:13,fontWeight:600}}>{ev.title}</p>
                <p style={{margin:0,fontSize:11,color:"#888"}}>{ev.time} · {ev.duration}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab==="applogs" && (
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {artifacts.appLogs?.map((log,i)=>(
            <div key={i} style={{padding:"10px 14px",borderRadius:8,border:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <span style={{fontFamily:"monospace",fontSize:12,fontWeight:600,color:"#185fa5"}}>{log.app}</span>
                <p style={{margin:"2px 0 0",fontSize:12,color:"#888"}}>{log.action}</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{margin:0,fontSize:12,fontFamily:"monospace"}}>{log.timestamp}</p>
                <p style={{margin:0,fontSize:11,color:"#aaa"}}>{log.duration}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return null;
}