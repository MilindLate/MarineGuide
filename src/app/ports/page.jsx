'use client';

import { useState, useMemo, useEffect } from "react";

// ─── INLINE DATA (from maritime-data.ts) ─────────────────────────────────────

const WORLD_PORT_NAMES = [
  'CARDOVA','VALDEZ','DURRES','VLORE','ALGIERS','ANNABA','ORAN','SKIKDA',
  'LOBITO','LUANDA','BUENOS AIRES','SANTOS','RIO DE JANEIRO','ROTTERDAM',
  'SINGAPORE','SHANGHAI','HONG KONG','HAMBURG','ANTWERP','FELIXSTOWE',
  'PIRAEUS','COLOMBO','MUMBAI','DURBAN','LAGOS','DAKAR','CASABLANCA',
  'ALEXANDRIA','PORT SAID','JEDDAH','DAMMAM','BANDAR ABBAS','SALALAH',
  'DOHA','FUJAIRAH','KARACHI','CHITTAGONG','LAEM CHABANG','HO CHI MINH CITY',
  'HAIPHONG','MANILA','JAKARTA','SURABAYA','TOKYO','YOKOHAMA','KOBE',
  'NAGOYA','OSAKA','INCHEON','KAOHSIUNG','KEELUNG','VANCOUVER','NEW YORK',
  'HOUSTON','SAVANNAH','LONG BEACH','SEATTLE','BALTIMORE','LIVERPOOL',
  'LONDON','SOUTHAMPTON','LE HAVRE','BARCELONA','ALGECIRAS','VALENCIA',
  'GOTHENBURG','SAINT PETERSBURG','VLADIVOSTOK','ODESSA','CONSTANTA',
  'ADEN','DJIBOUTI','BUSAN','NINGBO','QINGDAO','TIANJIN','GUANGZHOU',
  'PORT KELANG','JEBEL ALI','LOS ANGELES','BUENOS AIRES','CALLAO','COLON',
];

const SHIP_NAMES = [
  'MAERSK','MSC','COSCO','CMA CGM','HAPAG-LLOYD','ONE','EVERGREEN',
  'HMM','YANG MING','ZIM','WAN HAI','PIL','GRIMALDI','MATSON',
  'KMTC','ARKAS','X-PRESS','UNIFEEDER','EUKOR','WALLENIUS',
];

const SHIP_SUFFIXES = [
  'EDINBURGH','LE HAVRE','SHANGHAI','ROTTERDAM','SINGAPORE','PIONEER',
  'STAR','TITAN','AURORA','MARINER','VOYAGER','EXPLORER','LEGEND',
  'SOVEREIGN','MAJESTY','PRIDE','SPIRIT','VICTORY','GLORY','QUEST',
];

const FLAGS = [
  { code: 'LR', name: 'Liberia',    emoji: '🇱🇷' },
  { code: 'PA', name: 'Panama',     emoji: '🇵🇦' },
  { code: 'MH', name: 'Marshall Is',emoji: '🇲🇭' },
  { code: 'BS', name: 'Bahamas',    emoji: '🇧🇸' },
  { code: 'MT', name: 'Malta',      emoji: '🇲🇹' },
  { code: 'SG', name: 'Singapore',  emoji: '🇸🇬' },
  { code: 'HK', name: 'Hong Kong',  emoji: '🇭🇰' },
  { code: 'CN', name: 'China',      emoji: '🇨🇳' },
  { code: 'DE', name: 'Germany',    emoji: '🇩🇪' },
  { code: 'DK', name: 'Denmark',    emoji: '🇩🇰' },
  { code: 'TR', name: 'Turkey',     emoji: '🇹🇷' },
];

const TYPES = [
  { name: 'Container Ship', icon: '📦', color: '#4285f4' },
  { name: 'Crude Oil Tanker', icon: '🛢', color: '#ea4335' },
  { name: 'Bulk Carrier', icon: '⚓', color: '#fbbc04' },
  { name: 'LNG Carrier', icon: '💧', color: '#34a853' },
  { name: 'Ro-Ro Cargo', icon: '🚗', color: '#1a73e8' },
  { name: 'General Cargo', icon: '🏗', color: '#5f6368' },
];

const STATUSES = ['Underway Using Engine', 'At Anchor', 'Moored', 'Restricted Maneuverability'];

function rn(min, max) { return (Math.random() * (max - min) + min); }

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function generateVessels(count) {
  const vessels = [];
  const rand = seededRand(42);
  const pickR = (arr) => arr[Math.floor(rand() * arr.length)];
  const pickPort = () => WORLD_PORT_NAMES[Math.floor(rand() * WORLD_PORT_NAMES.length)];

  for (let i = 1; i <= count; i++) {
    const type = pickR(TYPES);
    const flag = pickR(FLAGS);
    const namePrefix = pickR(SHIP_NAMES);
    const nameSuffix = pickR(SHIP_SUFFIXES);
    const name = `${namePrefix} ${nameSuffix}`;
    const riskScore = Math.floor(rand() * 100);
    const lat = rn(-50, 70);
    const lng = rn(-150, 150);
    const dest = pickPort();
    const origin = pickPort();
    const speed = (10 + rand() * 15).toFixed(1);
    const day = 5 + (i % 10);
    const months = ['Jan','Feb','Mar','Apr','May','Jun'];
    const month = pickR(months);
    const heading = Math.floor(rand() * 360);

    vessels.push({
      id: i,
      imo: `IMO${9000000 + i}`,
      mmsi: `${Math.floor(rand() * 900000000) + 100000000}`,
      name,
      flag,
      type,
      riskScore,
      speed: `${speed} kn`,
      destination: dest,
      reportedDestination: dest,
      origin,
      atd: `2026-04-01 ${String(Math.floor(rand()*24)).padStart(2,'0')}:00`,
      draught: `${(8 + rand() * 10).toFixed(1)}m`,
      status: pickR(STATUSES),
      eta: `${month} ${day}, ${String(Math.floor(rand()*24)).padStart(2,'0')}:00 UTC`,
      lat: parseFloat(lat.toFixed(4)),
      lng: parseFloat(lng.toFixed(4)),
      heading,
      currentPosition: `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`,
      length: `${180 + Math.floor(rand() * 220)}m`,
      beam: `${28 + Math.floor(rand() * 22)}m`,
      grossTonnage: `${(30000 + Math.floor(rand() * 170000)).toLocaleString()}`,
      course: `${Math.floor(rand() * 360)}°`,
    });
  }
  return vessels;
}

const ALL_VESSELS = generateVessels(100);

const RISK_ZONES = [
  { name: 'Bab el-Mandeb', level: 'Critical', lat: 12.6, lng: 43.3, category: 'Geopolitical' },
  { name: 'Strait of Hormuz', level: 'High', lat: 26.5, lng: 56.2, category: 'Geopolitical' },
  { name: 'Taiwan Strait', level: 'Medium', lat: 24.5, lng: 119.5, category: 'Geopolitical' },
  { name: 'Black Sea War Zone', level: 'Critical', lat: 46.0, lng: 32.0, category: 'Geopolitical' },
  { name: 'Gulf of Aden', level: 'Critical', lat: 13.0, lng: 48.0, category: 'Piracy' },
  { name: 'Arabian Sea Cyclone', level: 'Critical', lat: 15.0, lng: 65.0, category: 'Weather' },
  { name: 'North Atlantic Gale', level: 'High', lat: 45.0, lng: -30.0, category: 'Weather' },
];

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
  return '#9333ea';
}

function ShipIcon({ color = '#4285f4', size = 20, heading = 0 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ transform: `rotate(${heading}deg)`, display: 'inline-block' }}>
      <path d="M12 2L8 8H4L6 16L12 20L18 16L20 8H16L12 2Z"
        fill={color} stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2" fill="white" opacity="0.8" />
    </svg>
  );
}

// ─── MINI MAP ─────────────────────────────────────────────────────────────────

function MiniMap({ lat, lng, heading, vesselName, type }) {
  const px = ((lng + 180) / 360 * 100).toFixed(1);
  const py = ((90 - lat) / 180 * 100).toFixed(1);

  return (
    <div style={{
      width: '100%', height: 160,
      background: '#f1f3f4',
      borderRadius: 12, position: 'relative', overflow: 'hidden',
      border: '1px solid #dadce0'
    }}>
      {/* Grid lines */}
      {[20,40,60,80].map(v => (
        <div key={v} style={{ position:'absolute', left:`${v}%`, top:0, bottom:0, borderLeft:'1px solid rgba(0,0,0,0.05)' }} />
      ))}
      {[25,50,75].map(v => (
        <div key={v} style={{ position:'absolute', top:`${v}%`, left:0, right:0, borderTop:'1px solid rgba(0,0,0,0.05)' }} />
      ))}
      {/* Equator */}
      <div style={{ position:'absolute', top:'50%', left:0, right:0, borderTop:'1px solid rgba(0,0,0,0.1)' }} />

      {/* Vessel position */}
      <div style={{
        position: 'absolute', left: `${px}%`, top: `${py}%`,
        transform: 'translate(-50%,-50%)',
      }}>
        <div style={{
          position: 'absolute', inset: -8,
          borderRadius: '50%',
          border: `2px solid ${type.color}`,
          opacity: 0.4,
          animation: 'pulse-ring 2s ease-out infinite'
        }} />
        <ShipIcon color={type.color} size={18} heading={heading} />
      </div>

      <div style={{
        position: 'absolute', bottom: 8, left: 10, right: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontSize: 9, color: '#5f6368', fontWeight: 700, fontFamily: 'monospace' }}>
          {Math.abs(lat).toFixed(2)}°{lat >= 0 ? 'N' : 'S'} {Math.abs(lng).toFixed(2)}°{lng >= 0 ? 'E' : 'W'}
        </span>
        <span style={{ fontSize: 9, color: type.color, fontWeight: 700, fontFamily: 'monospace' }}>
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

  return (
    <div onClick={() => onClick(vessel)}
      style={{
        background: selected ? '#e8f0fe' : '#ffffff',
        border: selected ? `2px solid #4285f4` : '1px solid #dadce0',
        borderRadius: 16, padding: '16px',
        cursor: 'pointer', transition: 'all 0.2s ease',
        position: 'relative', overflow: 'hidden',
        boxShadow: selected ? '0 4px 12px rgba(66, 133, 244, 0.15)' : '0 1px 3px rgba(60,64,67,.10)',
      }}
      className="vessel-card-anim"
    >
      <div style={{ position:'absolute', top:0, left:0, right:0, height:4,
        background: vessel.type.color, borderRadius:'16px 16px 0 0' }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:38, height:38, borderRadius:10,
            background: `${vessel.type.color}15`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:20
          }}>
            {vessel.type.icon}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:900, color:'#202124', letterSpacing:'-0.01em' }}>
              {vessel.name}
            </div>
            <div style={{ fontSize:10, color:'#5f6368', fontWeight: 700 }}>
              {vessel.flag.emoji} {vessel.flag.name} · {vessel.imo}
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
          { label:'TYPE', value: vessel.type.name, icon:'🚢' },
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
  const statusColor = getStatusColor(vessel.status);

  const rows = [
    ['IMO Number', vessel.imo],
    ['MMSI', vessel.mmsi],
    ['Vessel Type', vessel.type.name],
    ['Flag State', `${vessel.flag.emoji} ${vessel.flag.name}`],
    ['Current Status', vessel.status],
    ['Speed', vessel.speed],
    ['Course', vessel.course],
    ['Heading', `${vessel.heading}°`],
    ['Destination Port', vessel.destination],
    ['Reported ETA', vessel.eta],
    ['ATD', vessel.atd],
    ['Draught', vessel.draught],
    ['Length', vessel.length],
    ['Beam', vessel.beam],
    ['Gross Tonnage', vessel.grossTonnage],
  ];

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #dadce0',
      borderRadius: 20, padding: 24,
      boxShadow: '0 8px 32px rgba(60,64,67,0.12)',
      height: '100%', overflowY: 'auto',
    }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:48, height:48, borderRadius:14,
            background: `${vessel.type.color}10`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:26
          }}>
            {vessel.type.icon}
          </div>
          <div>
            <h2 style={{ color:'#202124', fontWeight:900, fontSize:18, margin:0 }}>{vessel.name}</h2>
            <div style={{ fontSize:10, color:'#5f6368', fontWeight:700, marginTop:2, letterSpacing:'0.05em' }}>
              {vessel.type.name.toUpperCase()} · IMO {vessel.imo}
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
        <MiniMap lat={vessel.lat} lng={vessel.lng} heading={vessel.heading} vesselName={vessel.name} type={vessel.type} />
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

// ─── WORLD MAP OVERVIEW ────────────────────────────────────────────────────────

function WorldMap({ vessels, onSelect, selected }) {
  return (
    <div style={{
      width:'100%', height:340,
      background:'#e8f0fe',
      borderRadius:20, position:'relative', overflow:'hidden',
      border:'1px solid #dadce0'
    }}>
      {/* Grid */}
      {[10,20,30,40,50,60,70,80,90].map(v => (
        <div key={v} style={{ position:'absolute', left:`${v}%`, top:0, bottom:0, borderLeft:'1px solid rgba(0,0,0,0.03)' }} />
      ))}
      {[25,50,75].map(v => (
        <div key={v} style={{ position:'absolute', top:`${v}%`, left:0, right:0, borderTop:'1px solid rgba(0,0,0,0.03)' }} />
      ))}

      {/* Vessels */}
      {vessels.map(v => {
        const px = ((v.lng + 180) / 360 * 100);
        const py = ((90 - v.lat) / 180 * 100);
        const isSelected = selected?.id === v.id;
        return (
          <div key={v.id} onClick={() => onSelect(v)} title={v.name} style={{
            position:'absolute', left:`${px}%`, top:`${py}%`,
            transform:'translate(-50%,-50%)',
            cursor:'pointer', zIndex: isSelected ? 10 : 1,
          }}>
            {isSelected && (
              <div style={{
                position:'absolute', inset:-12, borderRadius:'50%',
                border:`2px solid #4285f4`,
                animation:'pulse-ring 1.5s ease-out infinite'
              }} />
            )}
            <ShipIcon color={isSelected ? '#4285f4' : `${v.type.color}cc`}
              size={isSelected ? 20 : 14} heading={v.heading} />
          </div>
        );
      })}

      <div style={{ position:'absolute', top:16, right:16, fontSize:10,
        color:'#1a73e8', fontWeight:900, background:'rgba(255,255,255,0.8)', padding:'4px 12px', borderRadius:20 }}>
        LIVE AIS · {vessels.length} VESSELS MONITORED
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function VesselTrackingPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [flagFilter, setFlagFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('risk');
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState('grid');
  const [page, setPage] = useState(0);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    let v = ALL_VESSELS;
    if (search) v = v.filter(x =>
      x.name.toLowerCase().includes(search.toLowerCase()) ||
      x.imo.toLowerCase().includes(search.toLowerCase()) ||
      x.destination.toLowerCase().includes(search.toLowerCase())
    );
    if (typeFilter !== 'All') v = v.filter(x => x.type.name === typeFilter);
    if (flagFilter !== 'All') v = v.filter(x => x.flag.code === flagFilter);
    if (riskFilter !== 'All') {
      v = v.filter(x => getRiskColor(x.riskScore).label === riskFilter);
    }
    if (statusFilter !== 'All') v = v.filter(x => x.status === statusFilter);
    if (sortBy === 'risk') v = [...v].sort((a, b) => b.riskScore - a.riskScore);
    if (sortBy === 'name') v = [...v].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'speed') v = [...v].sort((a, b) => parseFloat(b.speed) - parseFloat(a.speed));
    return v;
  }, [search, typeFilter, flagFilter, riskFilter, statusFilter, sortBy]);

  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const stats = useMemo(() => ({
    total: ALL_VESSELS.length,
    underway: ALL_VESSELS.filter(v => v.status === 'Underway Using Engine').length,
    critical: ALL_VESSELS.filter(v => v.riskScore >= 80).length,
    anchored: ALL_VESSELS.filter(v => v.status === 'At Anchor').length,
  }), []);

  useEffect(() => { setPage(0); }, [search, typeFilter, flagFilter, riskFilter, statusFilter]);

  return (
    <div style={{ minHeight:'100vh', background:'#f8f9fa', color:'#202124' }}>
      <style>{`
        @keyframes pulse-ring {
          0% { transform: translate(-50%,-50%) scale(0.8); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0; }
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
            ].map(s => (
              <div key={s.label} style={{ background:'#ffffff', border:'1px solid #dadce0', borderRadius:16, padding:'12px 20px', textAlign:'center', minWidth:120 }} className="sh">
                <div style={{ fontSize:18, marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.val}</div>
                <div style={{ fontSize:8, color:'#9aa0a6', fontWeight:800, letterSpacing:'0.1em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:28 }}>
          <WorldMap vessels={ALL_VESSELS} onSelect={setSelected} selected={selected} />
        </div>

        <div style={{ background:'#ffffff', border:'1px solid #dadce0', borderRadius:20, padding:'20px', marginBottom:24, display:'flex', flexWrap:'wrap', gap:12, alignItems:'center' }} className="sh">
          <div style={{ position:'relative', flex:'1', minWidth:260 }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Vessel, IMO, Destination..."
              style={{ width:'100%', padding:'10px 14px 10px 40px', background:'#f8f9fa', border:'1px solid #dadce0', borderRadius:12, fontSize:13, fontWeight:600 }}
            />
          </div>

          {[
            { label:'TYPE', value:typeFilter, set:setTypeFilter, opts:['All', ...TYPES.map(t => t.name)] },
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
                {paged.map(v => <VesselCard key={v.id} vessel={v} onClick={setSelected} selected={selected?.id === v.id} />)}
              </div>
            ) : (
              <div style={{ background:'#ffffff', border:'1px solid #dadce0', borderRadius:20, overflow:'hidden' }} className="sh">
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
                        <tr key={v.id} onClick={() => setSelected(v)} style={{ cursor:'pointer', borderBottom:'1px solid #f1f3f4', background: selected?.id === v.id ? '#e8f0fe' : 'transparent' }}>
                          <td style={{ padding:'14px 16px', fontWeight:900, color:'#202124' }}>{v.type.icon} {v.name}</td>
                          <td style={{ padding:'14px 16px', color:'#5f6368', fontFamily:'monospace' }}>{v.imo}</td>
                          <td style={{ padding:'14px 16px' }}>{v.flag.emoji}</td>
                          <td style={{ padding:'14px 16px', color:'#5f6368' }}>{v.type.name}</td>
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
