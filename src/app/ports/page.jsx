
'use client';

import { useState, useMemo, useEffect, Suspense } from "react";
import { VesselMap } from '@/components/VesselMap';
import { VESSELS } from '@/lib/maritime-data';
import { useSearchParams } from 'next/navigation';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getRiskColor(score) {
  if (score >= 80) return { bg: '#fce8e6', text: '#c5221f', border: '#f5c6c2', dot: '#ea4335', label: 'Critical' };
  if (score >= 60) return { bg: '#fef7e0', text: '#b06000', border: '#fde8a0', dot: '#fbbc04', label: 'High' };
  if (score >= 40) return { bg: '#e8f0fe', text: '#1a73e8', border: '#c5d9fd', dot: '#4285f4', label: 'Medium' };
  return { bg: '#e6f4ea', text: '#137333', border: '#b7e1c4', dot: '#34a853', label: 'Low' };
}

function getStatusColor(status) {
  if (status === 'Underway Using Engine') return '#34a853';
  if (status === 'At Anchor') return '#fbbc04';
  if (status === 'Moored') return '#4285f4';
  return '#ea4335';
}

function ShipIcon({ color = '#4285f4', size = 20, heading = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ transform: `rotate(${heading}deg)`, display: 'inline-block' }}>
      <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"
        fill={color} stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── MINI MAP ─────────────────────────────────────────────────────────────────

function MiniMap({ lat, lng, heading, typeColor }) {
  const px = ((lng + 180) / 360 * 100).toFixed(1);
  const py = ((90 - lat) / 180 * 100).toFixed(1);

  return (
    <div style={{
      width: '100%', height: 160,
      background: '#f8f9fa',
      borderRadius: 12, position: 'relative', overflow: 'hidden',
      border: '1px solid #dadce0'
    }}>
      {[20,40,60,80].map(v => (
        <div key={v} style={{ position:'absolute', left:`${v}%`, top:0, bottom:0, borderLeft:'1px solid rgba(0,0,0,0.05)' }} />
      ))}
      {[25,50,75].map(v => (
        <div key={v} style={{ position:'absolute', top:`${v}%`, left:0, right:0, borderTop:'1px solid rgba(0,0,0,0.05)' }} />
      ))}
      <div style={{ position:'absolute', top:'50%', left:0, right:0, borderTop:'1px solid rgba(0,0,0,0.1)' }} />

      <div style={{
        position: 'absolute', left: `${px}%`, top: `${py}%`,
        transform: 'translate(-50%,-50%)',
      }}>
        <div style={{
          position: 'absolute', inset: -8,
          borderRadius: '50%',
          border: `2px solid ${typeColor}`,
          opacity: 0.4,
          animation: 'pulse-ring 2s ease-out infinite'
        }} />
        <ShipIcon color={typeColor} size={18} heading={heading} />
      </div>

      <div style={{
        position: 'absolute', bottom: 8, left: 10, right: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontSize: 9, color: '#5f6368', fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
          {Math.abs(lat).toFixed(2)}°{lat >= 0 ? 'N' : 'S'} {Math.abs(lng).toFixed(2)}°{lng >= 0 ? 'E' : 'W'}
        </span>
        <span style={{ fontSize: 9, color: typeColor, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>
          HDG {heading}°
        </span>
      </div>
    </div>
  );
}

// ─── VESSEL CARD ─────────────────────────────────────────────────────────────

function VesselCard({ vessel, onClick, selected }) {
  const risk = getRiskColor(vessel.riskScore);
  const statusColor = getStatusColor(vessel.status);
  const typeColor = vessel.riskScore >= 80 ? '#ea4335' : (vessel.riskScore >= 60 ? '#fbbc04' : '#1a73e8');

  return (
    <div onClick={() => onClick(vessel)}
      style={{
        background: selected ? '#e8f0fe' : '#ffffff',
        border: selected ? `2px solid #4285f4` : '1px solid #dadce0',
        borderRadius: 16, padding: '16px',
        cursor: 'pointer', transition: 'all 0.2s ease',
        position: 'relative', overflow: 'hidden',
        boxShadow: selected ? '0 4px 12px rgba(66, 133, 244, 0.15)' : '0 1px 3px rgba(60,64,67,.10)',
        fontFamily: "'DM Sans', sans-serif"
      }}
      className="vessel-card-anim"
    >
      <div style={{ position:'absolute', top:0, left:0, right:0, height:4,
        background: typeColor, borderRadius:'16px 16px 0 0' }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:38, height:38, borderRadius:10,
            background: `${typeColor}15`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:20
          }}>
            {vessel.emoji}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:900, color:'#202124', letterSpacing:'-0.01em' }}>
              {vessel.name}
            </div>
            <div style={{ fontSize:10, color:'#5f6368', fontWeight: 700 }}>
              {vessel.flag} · {vessel.imo}
            </div>
          </div>
        </div>
        <div style={{
          padding:'3px 10px', borderRadius:20,
          background: risk.bg, color: risk.text,
          fontSize:9, fontWeight:800, letterSpacing:'0.05em',
          border: `1px solid ${risk.border}`
        }}>
          {risk.label.toUpperCase()} {vessel.riskScore}
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12 }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:statusColor }} />
        <span style={{ fontSize:9, color:'#5f6368', fontWeight:800, letterSpacing:'0.05em' }}>
          {vessel.status.toUpperCase()}
        </span>
        <span style={{ marginLeft:'auto', fontSize:10, color:statusColor, fontWeight:900 }}>{vessel.speed}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {[
          { label:'DESTINATION', value: vessel.destination, icon:'🏁' },
          { label:'ETA', value: vessel.eta, icon:'⏱' },
          { label:'POSITION', value: vessel.currentPosition, icon:'📍' },
          { label:'TYPE', value: vessel.type, icon:'🚢' },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{
            background:'#f8f9fa',
            borderRadius:10, padding:'8px',
            border:'1px solid #f1f3f4'
          }}>
            <div style={{ fontSize:8, color:'#9aa0a6', fontWeight:800, letterSpacing:'0.05em', marginBottom:4 }}>
              {label}
            </div>
            <div style={{ fontSize:10, color:'#202124', fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:11 }}>{icon}</span>
              <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DETAIL PANEL ─────────────────────────────────────────────────────────────

function DetailPanel({ vessel, onClose }) {
  const risk = getRiskColor(vessel.riskScore);
  const typeColor = vessel.riskScore >= 80 ? '#ea4335' : (vessel.riskScore >= 60 ? '#fbbc04' : '#1a73e8');

  const rows = [
    ['IMO Number', vessel.imo],
    ['Vessel Type', vessel.type],
    ['Flag State', vessel.flag],
    ['Current Status', vessel.status],
    ['Speed', vessel.speed],
    ['Heading', `${vessel.heading}°`],
    ['Destination Port', vessel.destination],
    ['Reported ETA', vessel.eta],
    ['ATD', vessel.atd],
    ['Draught', vessel.draught],
  ];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #dadce0',
      borderRadius: 20, padding: 24,
      boxShadow: '0 8px 32px rgba(60,64,67,0.12)',
      height: '100%', overflowY: 'auto',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:48, height:48, borderRadius:14,
            background: `${typeColor}10`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:26
          }}>
            {vessel.emoji}
          </div>
          <div>
            <h2 style={{ color:'#202124', fontWeight:900, fontSize:18, margin:0 }}>{vessel.name}</h2>
            <div style={{ fontSize:10, color:'#5f6368', fontWeight:700, marginTop:2, letterSpacing:'0.05em' }}>
              {vessel.type.toUpperCase()} · IMO {vessel.imo}
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background:'#f8f9fa', border:'1px solid #dadce0',
          borderRadius:10, padding:'8px 12px', cursor:'pointer', color:'#5f6368', fontSize:14
        }}>✕</button>
      </div>

      <div style={{
        display:'flex', alignItems:'center', gap:10, marginBottom:20,
        padding:'12px 16px', borderRadius:14,
        background: risk.bg, border: `1px solid ${risk.border}`
      }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:risk.dot }} />
        <span style={{ color:'#202124', fontSize:11, fontWeight:900 }}>RISK INDEX</span>
        <div style={{
          marginLeft:'auto', padding:'2px 12px', borderRadius:20,
          background: '#ffffff', color: risk.text, fontSize:11, fontWeight:900,
          border: `1px solid ${risk.border}`
        }}>
          {risk.label.toUpperCase()} · {vessel.riskScore}
        </div>
      </div>

      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:9, color:'#9aa0a6', fontWeight:800, letterSpacing:'0.1em', marginBottom:10 }}>TACTICAL POSITION</div>
        <MiniMap lat={vessel.lat} lng={vessel.lng} heading={vessel.heading} typeColor={typeColor} />
      </div>

      <div style={{ fontSize:9, color:'#9aa0a6', fontWeight:800, letterSpacing:'0.1em', marginBottom:12 }}>VESSEL TELEMETRY</div>
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            padding:'8px 0', borderBottom:'1px solid #f1f3f4'
          }}>
            <span style={{ fontSize:10, color:'#5f6368', fontWeight:700 }}>{label}</span>
            <span style={{ fontSize:11, color:'#202124', fontWeight:800, textAlign:'right' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN CONTENT ─────────────────────────────────────────────────────────────

function VesselTrackingContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const [typeFilter, setTypeFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortBy, setSortBy] = useState('risk');
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('grid');
  const [page, setPage] = useState(0);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    let v = VESSELS;
    if (search) v = v.filter(x =>
      x.name.toLowerCase().includes(search.toLowerCase()) ||
      x.imo.toLowerCase().includes(search.toLowerCase()) ||
      x.destination.toLowerCase().includes(search.toLowerCase())
    );
    if (typeFilter !== 'All') v = v.filter(x => x.type === typeFilter);
    if (riskFilter !== 'All') {
      v = v.filter(x => getRiskColor(x.riskScore).label === riskFilter);
    }
    if (sortBy === 'risk') v = [...v].sort((a, b) => b.riskScore - a.riskScore);
    if (sortBy === 'name') v = [...v].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'speed') v = [...v].sort((a, b) => parseFloat(b.speed) - parseFloat(a.speed));
    return v;
  }, [search, typeFilter, riskFilter, sortBy]);

  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const stats = useMemo(() => ({
    total: VESSELS.length,
    underway: VESSELS.filter(v => v.status === 'Underway Using Engine').length,
    critical: VESSELS.filter(v => v.riskScore >= 80).length,
    anchored: VESSELS.filter(v => v.status === 'At Anchor').length,
  }), []);

  useEffect(() => { setPage(0); }, [search, typeFilter, riskFilter]);

  const handleVesselSelect = (vessel) => {
    setSelected(vessel);
  };

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa', color:'#202124', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes slide-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .vessel-card-anim { animation: slide-in 0.3s ease forwards; }
        input::placeholder { color: #9aa0a6; }
        input:focus { outline: none; border-color: #4285f4 !important; }
        select:focus { outline: none; }
      `}</style>

      <div style={{ maxWidth:1440, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
          <div className="space-y-1">
            <h1 style={{ fontSize:28, fontWeight:900, color:'#202124', letterSpacing:'-0.02em' }}>
              Vessel Tracking Intelligence
            </h1>
            <p style={{ fontSize:12, color:'#5f6368', fontWeight:700, letterSpacing:'0.05em' }}>
              REAL-TIME AIS SATELLITE NETWORK · <span style={{ color:'#34a853' }}>● OPERATIONAL</span>
            </p>
          </div>

          <div style={{ display:'flex', gap:12 }}>
            {[
              { label:'MONITORED', val:stats.total, color:'#4285f4', icon:'🛳' },
              { label:'UNDERWAY', val:stats.underway, color:'#34a853', icon:'⚡' },
              { label:'CRITICAL', val:stats.critical, color:'#ea4335', icon:'⚠' },
              { label:'ANCHORED', val:stats.anchored, color:'#fbbc04', icon:'⚓' },
            ].map(s => (
              <div key={s.label} style={{ background:'#ffffff', border:'1px solid #dadce0', borderRadius:16, padding:'12px 20px', textAlign:'center', minWidth:120, boxShadow: '0 1px 3px rgba(60,64,67,.10)' }}>
                <div style={{ fontSize:18, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:8, color:'#9aa0a6', fontWeight:800, letterSpacing:'0.1em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          height: 400, 
          width: '100%', 
          background: '#ffffff', 
          borderRadius: 20, 
          overflow: 'hidden', 
          border: '1px solid #dadce0', 
          boxShadow: '0 1px 3px rgba(60,64,67,.10)', 
          marginBottom: 32,
          position: 'relative'
        }}>
          <VesselMap 
            selectedVesselId={selected?.id} 
            onVesselSelect={handleVesselSelect}
          />
        </div>

        <div style={{ background:'#ffffff', border:'1px solid #dadce0', borderRadius:20, padding:'20px', marginBottom:24, display:'flex', flexWrap:'wrap', gap:12, alignItems:'center', boxShadow: '0 1px 3px rgba(60,64,67,.10)' }}>
          <div style={{ position:'relative', flex:'1', minWidth:260 }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Vessel, IMO, Destination..."
              style={{ width:'100%', padding:'10px 14px 10px 40px', background:'#f8f9fa', border:'1px solid #dadce0', borderRadius:12, fontSize:13, fontWeight:600 }}
            />
          </div>

          {[
            { label:'TYPE', value:typeFilter, set:setTypeFilter, opts:['All', 'Container Ship', 'Crude Oil Tanker', 'Bulk Carrier', 'LNG Carrier', 'Ro-Ro Cargo', 'General Cargo'] },
            { label:'RISK', value:riskFilter, set:setRiskFilter, opts:['All','Critical','High','Medium','Low'] },
            { label:'SORT', value:sortBy, set:setSortBy, opts:['risk','name','speed'], labels:['Risk Score','Name','Speed'] },
          ].map(f => (
            <div key={f.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:9, color:'#9aa0a6', fontWeight:800 }}>{f.label}</span>
              <select value={f.value} onChange={e => f.set(e.target.value)} style={{ background:'#ffffff', border:'1px solid #dadce0', borderRadius:10, fontSize:12, padding:'8px 12px', fontWeight:700, cursor:'pointer' }}>
                {f.opts.map((o, i) => <option key={o} value={o}>{f.labels ? f.labels[i] : o}</option>)}
              </select>
            </div>
          ))}

          <div style={{ display:'flex', gap:6, marginLeft:'auto' }}>
            {[{id:'grid',icon:'⊞'},{id:'table',icon:'≡'}].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:'8px 16px', borderRadius:10, fontSize:16, cursor:'pointer',
                background: tab === t.id ? '#4285f4' : '#ffffff',
                border: tab === t.id ? '1px solid #4285f4' : '1px solid #dadce0',
                color: tab === t.id ? '#ffffff' : '#5f6368',
                transition:'0.2s'
              }}>{t.icon}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', gap:24, alignItems:'flex-start' }}>
          <div style={{ flex:1, minWidth:0 }}>
            {tab === 'grid' ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:20 }}>
                {paged.map(v => <VesselCard key={v.id} vessel={v} onClick={handleVesselSelect} selected={selected?.id === v.id} />)}
              </div>
            ) : (
              <div style={{ background:'#ffffff', border:'1px solid #dadce0', borderRadius:20, overflow:'hidden', boxShadow: '0 1px 3px rgba(60,64,67,.10)' }}>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
                    <thead>
                      <tr style={{ background:'#f8f9fa' }}>
                        {['NAME','IMO','FLAG','TYPE','STATUS','SPEED','DESTINATION','RISK'].map(h => (
                          <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:9, color:'#9aa0a6', fontWeight:800, letterSpacing:'0.05em', borderBottom:'1px solid #dadce0' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map(v => (
                        <tr key={v.id} onClick={() => handleVesselSelect(v)} style={{ cursor:'pointer', borderBottom:'1px solid #f1f3f4', background: selected?.id === v.id ? '#e8f0fe' : 'transparent' }}>
                          <td style={{ padding:'14px 16px', fontWeight:900, color:'#202124' }}>{v.emoji} {v.name}</td>
                          <td style={{ padding:'14px 16px', color:'#5f6368', fontFamily:"'DM Mono', monospace" }}>{v.imo}</td>
                          <td style={{ padding:'14px 16px' }}>{v.flag}</td>
                          <td style={{ padding:'14px 16px', color:'#5f6368' }}>{v.type}</td>
                          <td style={{ padding:'14px 16px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                              <div style={{ width:7, height:7, borderRadius:'50%', background:getStatusColor(v.status) }} />
                              <span style={{ fontSize:10, fontWeight:700 }}>{v.status}</span>
                            </div>
                          </td>
                          <td style={{ padding:'14px 16px', fontWeight:700 }}>{v.speed}</td>
                          <td style={{ padding:'14px 16px', fontWeight:700 }}>{v.destination}</td>
                          <td style={{ padding:'14px 16px' }}>
                            <span style={{ padding:'3px 10px', borderRadius:20, background:getRiskColor(v.riskScore).bg, color:getRiskColor(v.riskScore).text, fontSize:9, fontWeight:900, border:`1px solid ${getRiskColor(v.riskScore).border}` }}>
                              {v.riskScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, marginTop:32 }}>
                <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0} style={{ padding:'8px 16px', borderRadius:10, background:'#ffffff', border:'1px solid #dadce0', fontSize:12, fontWeight:800, cursor:'pointer' }}>PREV</button>
                <span style={{ fontSize:13, fontWeight:900, color:'#5f6368' }}>Page {page + 1} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page === totalPages-1} style={{ padding:'8px 16px', borderRadius:10, background:'#ffffff', border:'1px solid #dadce0', fontSize:12, fontWeight:800, cursor:'pointer' }}>NEXT</button>
              </div>
            )}
          </div>

          {selected && (
            <div style={{ width:380, flexShrink:0, position:'sticky', top:24 }}>
              <DetailPanel vessel={selected} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VesselTrackingPage() {
  return (
    <Suspense fallback={<div>Loading Fleet...</div>}>
      <VesselTrackingContent />
    </Suspense>
  );
}
