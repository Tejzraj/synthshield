cat > src/App.jsx << 'APPEOF'
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
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const callClaude = async (system, user) => {
    const key = apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!key) throw new Error("No API key. Click 'Set API Key' button.");
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: user }]
      })
    });
    if (!r.ok) {
      const err = await r.json();
      throw new Error(err.error?.message || `API error ${r.status}`);
    }
    const d = await r.json();
    const t = d.content[0].text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(t);
  };

  const runPipeline = async () => {
    const key = apiKey || import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!key) { setError("Please set your API key first — click 'Set API Key' above."); return; }
    setPhase("running"); setError(null);
    setLayerStatus({ l1:"running", l2:"idle", l3:"idle" });
    await sleep(1800);
    try {
      setLayerStatus({ l1:"done", l2:"running", l3:"idle" });
      const p = await callClaude(
        "You generate synthetic user personas. Respond ONLY with valid JSON, no markdown, no explanation.",
        `Create a synthetic ${personaType} persona with epsilon=${epsilon.toFixed(1)}. Return ONLY this exact JSON shape:
{"name":"Full Name","age":25,"occupation":"Role","location":"City, Country","deviceUsage":"One sentence about phone habits","topApps":["App1","App2","App3","App4"],"peakHours":"10pm-1am","privacyScore":0.97,"behaviorTags":["tag1","tag2","tag3"]}`
      );
      setPersona(p);
      setLayerStatus({ l1:"done", l2:"done", l3:"running" });
      const a = await callClaude(
        "You generate synthetic smartphone artifacts. Respond ONLY with valid JSON, no markdown, no explanation.",
        `Generate realistic smartphone artifacts for ${p.name}, a ${p.occupation} (${personaType} persona). Return ONLY this exact JSON shape:
{"emails":[{"from":"sender@example.com","subject":"Subject line","preview":"Email preview text max 80 chars","time":"Mon 9:14 AM","label":"work"},{"from":"friend@gmail.com","subject":"Subject2","preview":"Preview2","time":"Sun 3:22 PM","label":"personal"},{"from":"deals@shop.com","subject":"Subject3","preview":"Preview3","time":"Sat 8:01 AM","label":"promo"}],"calendarEvents":[{"title":"Event Title","time":"Tue 2:00 PM","duration":"1h","type":"meeting"},{"title":"Event2","time":"Wed 11:30 AM","duration":"30m","type":"personal"},{"title":"Event3","time":"Thu 9:00 AM","duration":"15m","type":"reminder"}],"appLogs":[{"app":"AppName","action":"brief action description","timestamp":"9:05 AM","duration":"8m"},{"app":"App2","action":"action2","timestamp":"10:30 AM","duration":"3m"},{"app":"App3","action":"action3","timestamp":"2:15 PM","duration":"22m"},{"app":"App4","action":"action4","timestamp":"11:45 PM","duration":"5m"}]}`
      );
      setArtifacts(a);
      setLayerStatus({ l1:"done", l2:"done", l3:"done" });
      await sleep(400);
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

  const S = {
    wrap: { maxWidth:620, margin:"0 auto", padding:"40px 20px", fontFamily:"system-ui, sans-serif" },
    header: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:28 },
    title: { margin:"0 0 4px", fontSize:22, fontWeight:700 },
    subtitle: { margin:0, fontSize:13, color:"#666" },
    keyBtn: { fontSize:11, padding:"5px 10px", borderRadius:6, border:"1px solid #ddd", background:"#f8f8f8", cursor:"pointer", color:"#555" },
    keyBox: { marginBottom:20, padding:12, borderRadius:8, background:"#f0f7ff", border:"1px solid #bdd7f5" },
    keyInput: { width:"100%", padding:"8px 10px", fontSize:13, borderRadius:6, border:"1px solid #bdd7f5", boxSizing:"border-box", marginTop:6 },
    label: { fontSize:12, fontWeight:600, color:"#888", margin:"0 0 8px", textTransform:"uppercase", letterSpacing:"0.05em" },
    grid3: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:24 },
    personaCard: (active) => ({ padding:14, borderRadius:8, cursor:"pointer", textAlign:"center", border: active?"2px solid #378add":"1px solid #ddd", background: active?"#e6f1fb":"#fff", transition:"all 0.15s" }),
    personaLabel: (active) => ({ margin:"0 0 4px", fontSize:13, fontWeight:600, color: active?"#185fa5":"#111" }),
    personaDesc: (active) => ({ margin:0, fontSize:11, color: active?"#378add":"#888", lineHeight:1.5 }),
    sliderRow: { display:"flex", justifyContent:"space-between", marginBottom:8 },
    epsilonVal: { fontFamily:"monospace", fontSize:14, fontWeight:700 },
    slider: { width:"100%", accentColor:"#185fa5" },
    sliderLabels: { display:"flex", justifyContent:"space-between", marginTop:4 },
    sliderHint: { fontSize:11, color:"#aaa" },
    error: { fontSize:13, color:"#c0392b", marginBottom:16, padding:"10px 14px", borderRadius:6, border:"1px solid #f5c6cb", background:"#fff5f5" },
    btn: { width:"100%", padding:13, fontSize:14, fontWeight:700, background:"#185fa5", color:"#fff", border:"none", borderRadius:8, cursor:"pointer", letterSpacing:"0.02em" },
    layerCard: (s) => ({ padding:"14px 16px", marginBottom:8, borderRadius:8, border: s==="running"?"2px solid #378add":"1px solid #eee", background: s==="running"?"#e6f1fb":"#fff", transition:"all 0.3s" }),
    layerRow: { display:"flex", justifyContent:"space-between", alignItems:"center" },
    layerNum: { fontFamily:"monospace", fontSize:11, color:"#aaa", marginRight:10 },
    layerName: { margin:0, fontSize:13, fontWeight:700 },
    layerSub: { margin:0, fontSize:11, color:"#888" },
    statusIdle: { fontSize:11, color:"#aaa" },
    statusRun: { fontSize:11, color:"#185fa5", fontWeight:700 },
    statusDone: { fontSize:11, color:"#27ae60", fontWeight:700 },
    card: { padding:16, marginBottom:24, borderRadius:12, border:"1px solid #eee", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" },
    avatarRow: { display:"flex", alignItems:"center", gap:12, marginBottom:14 },
    avatar: { width:46, height:46, borderRadius:"50%", background:"#e6f1fb", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, fontWeight:700, color:"#185fa5", flexShrink:0 },
    stats3: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:12 },
    statBox: { background:"#f8f8f8", borderRadius:6, padding:10 },
    statLabel: { margin:"0 0 2px", fontSize:11, color:"#aaa" },
    statVal: { margin:0, fontSize:13, fontWeight:700, fontFamily:"monospace" },
    tagRow: { display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 },
    tag: { padding:"3px 9px", borderRadius:20, fontSize:11, background:"#f1f1f1", color:"#555" },
    appTag: { padding:"3px 8px", borderRadius:4, fontSize:11, fontFamily:"monospace", background:"#e6f1fb", color:"#185fa5" },
    tabRow: { display:"flex", borderBottom:"2px solid #eee", marginBottom:14 },
    tab: (active) => ({ padding:"8px 16px", fontSize:13, fontWeight: active?700:400, cursor:"pointer", color: active?"#185fa5":"#888", borderBottom: active?"2px solid #185fa5":"2px solid transparent", marginBottom:-2, userSelect:"none" }),
    emailCard: { padding:"12px 14px", borderRadius:8, border:"1px solid #eee", marginBottom:8 },
    emailTop: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 },
    calCard: { padding:"12px 14px", borderRadius:8, border:"1px solid #eee", marginBottom:8, display:"flex", alignItems:"center", gap:12 },
    calIcon: (type) => ({ width:38, height:38, borderRadius:6, background: type==="meeting"?"#e6f1fb":type==="personal"?"#eaf3de":"#faeeda", display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color: type==="meeting"?"#185fa5":type==="personal"?"#3b6d11":"#854f0b", flexShrink:0 }),
    logCard: { padding:"10px 14px", borderRadius:8, border:"1px solid #eee", marginBottom:6, display:"flex", justifyContent:"space-between", alignItems:"center" },
    badge: (label) => {
      const map = { work:["#e6f1fb","#185fa5"], personal:["#eaf3de","#3b6d11"], promo:["#faeeda","#854f0b"] };
      const [bg, col] = map[label] || ["#f1f1f1","#555"];
      return { fontSize:10, padding:"2px 7px", borderRadius:10, background:bg, color:col, fontWeight:600 };
    }
  };

  if (phase === "config") return (
    <div style={S.wrap}>
      <div style={S.header}>
        <div>
          <h1 style={S.title}>SynthShield</h1>
          <p style={S.subtitle}>Privacy-preserving synthetic data pipeline</p>
        </div>
        <button style={S.keyBtn} onClick={() => setShowKeyInput(!showKeyInput)}>
          {showKeyInput ? "Hide" : "🔑 Set API Key"}
        </button>
      </div>

      {showKeyInput && (
        <div style={S.keyBox}>
          <p style={{margin:0, fontSize:12, color:"#185fa5", fontWeight:600}}>Enter your Anthropic API Key</p>
          <p style={{margin:"4px 0 0", fontSize:11, color:"#666"}}>Get one free at console.anthropic.com — never stored, only used in this session.</p>
          <input
            type="password"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            style={S.keyInput}
          />
        </div>
      )}

      <p style={S.label}>Persona type</p>
      <div style={S.grid3}>
        {PERSONAS.map(p => (
          <div key={p.id} onClick={() => setPersonaType(p.id)} style={S.personaCard(personaType===p.id)}>
            <p style={S.personaLabel(personaType===p.id)}>{p.label}</p>
            <p style={S.personaDesc(personaType===p.id)}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div style={{marginBottom:28}}>
        <div style={S.sliderRow}>
          <p style={S.label}>Privacy budget (ε)</p>
          <span style={S.epsilonVal}>{epsilon.toFixed(1)}</span>
        </div>
        <input type="range" min="0.1" max="2.0" step="0.1" value={epsilon}
          onChange={e => setEpsilon(parseFloat(e.target.value))} style={S.slider} />
        <div style={S.sliderLabels}>
          <span style={S.sliderHint}>← stronger privacy</span>
          <span style={S.sliderHint}>higher utility →</span>
        </div>
      </div>

      {error && <div style={S.error}>{error}</div>}

      <button onClick={runPipeline} style={S.btn}>
        Run SynthShield Pipeline →
      </button>
    </div>
  );

  if (phase === "running") return (
    <div style={S.wrap}>
      <h2 style={{fontSize:20, fontWeight:700, margin:"0 0 4px"}}>Pipeline running...</h2>
      <p style={{margin:"0 0 24px", fontSize:13, color:"#666"}}>Generating {personaType} persona · ε = {epsilon.toFixed(1)}</p>
      {LAYERS.map(layer => {
        const s = layerStatus[layer.id];
        return (
          <div key={layer.id} style={S.layerCard(s)}>
            <div style={S.layerRow}>
              <div style={{display:"flex", alignItems:"center"}}>
                <span style={S.layerNum}>{layer.num}</span>
                <div>
                  <p style={S.layerName}>{layer.name}</p>
                  <p style={S.layerSub}>{layer.sub}</p>
                </div>
              </div>
              {s==="idle" && <span style={S.statusIdle}>waiting</span>}
              {s==="running" && <span style={S.statusRun}>processing...</span>}
              {s==="done" && <span style={S.statusDone}>✓ done</span>}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (phase === "results" && persona && artifacts) return (
    <div style={S.wrap}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20}}>
        <div>
          <h2 style={{margin:"0 0 4px", fontSize:20, fontWeight:700}}>Persona ready ✓</h2>
          <p style={{margin:0, fontSize:13, color:"#666"}}>ε = {epsilon.toFixed(1)} · Data Tank populated</p>
        </div>
        <button onClick={reset} style={{padding:"6px 14px", borderRadius:6, border:"1px solid #ddd", background:"#fff", cursor:"pointer", fontSize:13}}>New run</button>
      </div>

      <div style={S.card}>
        <div style={S.avatarRow}>
          <div style={S.avatar}>
            {persona.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
          </div>
          <div style={{flex:1}}>
            <p style={{margin:0, fontWeight:700, fontSize:16}}>{persona.name}</p>
            <p style={{margin:0, fontSize:12, color:"#888"}}>{persona.occupation} · {persona.location}</p>
          </div>
          <div style={{textAlign:"right"}}>
            <p style={{margin:0, fontSize:10, color:"#aaa", textTransform:"uppercase"}}>Privacy</p>
            <p style={{margin:0, fontSize:20, fontWeight:700, color:"#27ae60", fontFamily:"monospace"}}>{Math.round((persona.privacyScore||0)*100)}%</p>
          </div>
        </div>

        <div style={S.stats3}>
          {[{l:"Age", v:persona.age}, {l:"Peak hours", v:persona.peakHours}, {l:"ε budget", v:epsilon.toFixed(1)}].map(s => (
            <div key={s.l} style={S.statBox}>
              <p style={S.statLabel}>{s.l}</p>
              <p style={S.statVal}>{s.v}</p>
            </div>
          ))}
        </div>

        <p style={{margin:"0 0 10px", fontSize:12, color:"#666", lineHeight:1.5}}>{persona.deviceUsage}</p>

        <div style={S.tagRow}>
          {persona.behaviorTags?.map(t => <span key={t} style={S.tag}>{t}</span>)}
        </div>

        <div style={S.tagRow}>
          {persona.topApps?.map(app => <span key={app} style={S.appTag}>{app}</span>)}
        </div>
      </div>

      <p style={{...S.label, marginBottom:10}}>Data Tank artifacts</p>
      <div style={S.tabRow}>
        {TABS.map(tab => {
          const counts = {emails:artifacts.emails?.length, calendar:artifacts.calendarEvents?.length, applogs:artifacts.appLogs?.length};
          return (
            <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={S.tab(activeTab===tab.id)}>
              {tab.label} ({counts[tab.id]})
            </div>
          );
        })}
      </div>

      {activeTab==="emails" && (
        <div>
          {artifacts.emails?.map((e,i) => (
            <div key={i} style={S.emailCard}>
              <div style={S.emailTop}>
                <span style={{fontSize:12, fontWeight:600, color:"#555"}}>{e.from}</span>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <span style={S.badge(e.label)}>{e.label}</span>
                  <span style={{fontSize:11, color:"#aaa"}}>{e.time}</span>
                </div>
              </div>
              <p style={{margin:"0 0 3px", fontSize:13, fontWeight:700}}>{e.subject}</p>
              <p style={{margin:0, fontSize:12, color:"#888"}}>{e.preview}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab==="calendar" && (
        <div>
          {artifacts.calendarEvents?.map((ev,i) => (
            <div key={i} style={S.calCard}>
              <div style={S.calIcon(ev.type)}>
                {ev.type==="meeting"?"MTG":ev.type==="personal"?"PERS":"REM"}
              </div>
              <div style={{flex:1}}>
                <p style={{margin:0, fontSize:13, fontWeight:700}}>{ev.title}</p>
                <p style={{margin:0, fontSize:11, color:"#888"}}>{ev.time} · {ev.duration}</p>
              </div>
              <span style={S.badge(ev.type==="meeting"?"work":ev.type)}>{ev.type}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab==="applogs" && (
        <div>
          {artifacts.appLogs?.map((log,i) => (
            <div key={i} style={S.logCard}>
              <div>
                <span style={{fontFamily:"monospace", fontSize:12, fontWeight:700, color:"#185fa5"}}>{log.app}</span>
                <p style={{margin:"2px 0 0", fontSize:12, color:"#888"}}>{log.action}</p>
              </div>
              <div style={{textAlign:"right"}}>
                <p style={{margin:0, fontSize:12, fontFamily:"monospace"}}>{log.timestamp}</p>
                <p style={{margin:0, fontSize:11, color:"#aaa"}}>{log.duration}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return null;
}
APPEOF