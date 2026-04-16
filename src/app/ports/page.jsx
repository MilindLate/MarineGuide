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
  { name: 'Container Ship', icon: '📦', color: '#3b82f6' },
  { name: 'Crude Oil Tanker', icon: '🛢', color: '#f59e0b' },
  { name: 'Bulk Carrier', icon: '⚓', color: '#6366f1' },
  { name: 'LNG Carrier', icon: '💧', color: '#06b6d4' },
  { name: 'Ro-Ro Cargo', icon: '🚗', color: '#10b981' },
  { name: 'General Cargo', icon: '🏗', color: '#8b5cf6' },
];

const STATUSES = ['Underway Using Engine', 'At Anchor', 'Moored', 'Restricted Maneuverability'];

function rp(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
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
  if (score >= 80) return { bg: '#fef2f2', text: '#dc2626', border: '#fca5a5', dot: '#ef4444', label: 'Critical' };
  if (score >= 60) return { bg: '#fff7ed', text: '#ea580c', border: '#fdba74', dot: '#f97316', label: 'High' };
  if (score >= 40) return { bg: '#fefce8', text: '#ca8a04', border: '#fde047', dot: '#eab308', label: 'Medium' };
  return { bg: '#f0fdf4', text: '#16a34a', border: '#86efac', dot: '#22c55e', label: 'Low' };
}

function getStatusColor(status) {
  if (status === 'Underway Using Engine') return '#22c55e';
  if (status === 'At Anchor') return '#f59e0b';
  if (status === 'Moored') return '#3b82f6';
  return '#8b5cf6';
}

// ─── SHIP ICON SVG ────────────────────────────────────────────────────────────

function ShipIcon({ color = '#3b82f6', size = 20, heading = 0 }) {
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
      background: 'linear-gradient(135deg, #0c1628 0%, #0d2444 50%, #0c1628 100%)',
      borderRadius: 12, position: 'relative', overflow: 'hidden',
      border: '1px solid rgba(59,130,246,0.3)'
    }}>
      {/* Grid lines */}
      {[20,40,60,80].map(v => (
        <div key={v} style={{ position:'absolute', left:`${v}%`, top:0, bottom:0, borderLeft:'1px solid rgba(59,130,246,0.08)' }} />
      ))}
      {[25,50,75].map(v => (
        <div key={v} style={{ position:'absolute', top:`${v}%`, left:0, right:0, borderTop:'1px solid rgba(59,130,246,0.08)' }} />
      ))}
      {/* Equator */}
      <div style={{ position:'absolute', top:'50%', left:0, right:0, borderTop:'1px solid rgba(59,130,246,0.2)' }} />

      {/* Risk zone dots */}
      {RISK_ZONES.map((z, i) => {
        const zx = ((z.lng + 180) / 360 * 100);
        const zy = ((90 - z.lat) / 180 * 100);
        const c = z.level === 'Critical' ? '#ef4444' : z.level === 'High' ? '#f97316' : '#eab308';
        return (
          <div key={i} style={{
            position: 'absolute', left: `${zx}%`, top: `${zy}%`,
            width: 6, height: 6, borderRadius: '50%',
            background: c, opacity: 0.5,
            transform: 'translate(-50%,-50%)',
          }} />
        );
      })}

      {/* Vessel position */}
      <div style={{
        position: 'absolute', left: `${px}%`, top: `${py}%`,
        transform: 'translate(-50%,-50%)',
      }}>
        {/* Pulse ring */}
        <div style={{
          position: 'absolute', inset: -8,
          borderRadius: '50%',
          border: `2px solid ${type.color}`,
          opacity: 0.4,
          animation: 'pulse-ring 2s ease-out infinite'
        }} />
        <ShipIcon color={type.color} size={18} heading={heading} />
      </div>

      {/* Coords overlay */}
      <div style={{
        position: 'absolute', bottom: 8, left: 10, right: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.8)', fontFamily: 'monospace' }}>
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
        background: selected
          ? 'linear-gradient(135deg, #1e3a5f 0%, #1a2e4a 100%)'
          : 'linear-gradient(135deg, #111827 0%, #1a2035 100%)',
        border: selected ? `1px solid ${vessel.type.color}` : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16, padding: '16px',
        cursor: 'pointer', transition: 'all 0.2s ease',
        position: 'relative', overflow: 'hidden',
        boxShadow: selected ? `0 0 20px ${vessel.type.color}33` : '0 2px 8px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
    >
      {/* Type stripe */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:3,
        background: vessel.type.color, borderRadius:'16px 16px 0 0', opacity:0.8 }} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{
            width:36, height:36, borderRadius:10,
            background: `${vessel.type.color}22`,
            border: `1px solid ${vessel.type.color}44`,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:18
          }}>
            {vessel.type.icon}
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:'#f1f5f9', letterSpacing:'0.05em', fontFamily:'monospace' }}>
              {vessel.name}
            </div>
            <div style={{ fontSize:10, color:'rgba(148,163,184,0.7)', marginTop:1 }}>
              {vessel.flag.emoji} {vessel.flag.name} · {vessel.imo}
            </div>
          </div>
        </div>
        <div style={{
          padding:'3px 10px', borderRadius:20,
          background: risk.bg, color: risk.text,
          fontSize:9, fontWeight:800, letterSpacing:'0.1em',
          border: `1px solid ${risk.border}`
        }}>
          {risk.label} {vessel.riskScore}
        </div>
      </div>

      {/* Status bar */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
        <div style={{ width:7, height:7, borderRadius:'50%', background:statusColor, boxShadow:`0 0 6px ${statusColor}` }} />
        <span style={{ fontSize:9, color:'rgba(148,163,184,0.8)', fontWeight:600, letterSpacing:'0.05em' }}>
          {vessel.status.toUpperCase()}
        </span>
        <span style={{ marginLeft:'auto', fontSize:9, color:statusColor, fontWeight:700 }}>{vessel.speed}</span>
      </div>

      {/* Data row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
        {[
          { label:'DESTINATION', value: vessel.destination, icon:'🏁' },
          { label:'ETA', value: vessel.eta, icon:'⏱' },
          { label:'POSITION', value: vessel.currentPosition, icon:'📍' },
          { label:'TYPE', value: vessel.type.name, icon:'🚢' },
        ].map(({ label, value, icon }) => (
          <div key={label} style={{
            background:'rgba(255,255,255,0.03)',
            borderRadius:8, padding:'6px 8px',
            border:'1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ fontSize:8, color:'rgba(100,116,139,0.9)', fontWeight:700, letterSpacing:'0.1em', marginBottom:2 }}>
              {label}
            </div>
            <div style={{ fontSize:10, color:'#cbd5e1', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ fontSize:11 }}>{icon}</span>
              <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Map icon bottom */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <ShipIcon color={vessel.type.color} size={14} heading={vessel.heading} />
          <span style={{ fontSize:9, color:'rgba(100,116,139,0.8)', fontFamily:'monospace' }}>
            {vessel.lat}° / {vessel.lng}°
          </span>
        </div>
        <div style={{
          fontSize:9, color:'rgba(100,116,139,0.6)',
          display:'flex', alignItems:'center', gap:3
        }}>
          MMSI <span style={{ color:'rgba(148,163,184,0.8)', fontFamily:'monospace', marginLeft:3 }}>{vessel.mmsi}</span>
        </div>
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
    ['Flag State', `${vessel.flag.emoji} ${vessel.flag.name} (${vessel.flag.code})`],
    ['Current Status', vessel.status],
    ['Speed', vessel.speed],
    ['Course', vessel.course],
    ['Heading', `${vessel.heading}°`],
    ['Latitude', `${vessel.lat}°`],
    ['Longitude', `${vessel.lng}°`],
    ['Current Position', vessel.currentPosition],
    ['Destination Port', vessel.destination],
    ['Reported Destination', vessel.reportedDestination],
    ['Origin Port', vessel.origin],
    ['Reported ETA', vessel.eta],
    ['ATD', vessel.atd],
    ['Draught', vessel.draught],
    ['Length', vessel.length],
    ['Beam', vessel.beam],
    ['Gross Tonnage', vessel.grossTonnage],
  ];

  return (
    <div style={{
      background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)',
      border: `1px solid ${vessel.type.color}44`,
      borderRadius: 20, padding: 24,
      boxShadow: `0 0 40px ${vessel.type.color}22, 0 8px 32px rgba(0,0,0,0.5)`,
      height: '100%', overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <div style={{
              width:44, height:44, borderRadius:12,
              background: `${vessel.type.color}22`,
              border: `2px solid ${vessel.type.color}66`,
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:22
            }}>
              {vessel.type.icon}
            </div>
            <div>
              <h2 style={{ color:'#f1f5f9', fontWeight:900, fontSize:16,
                fontFamily:'monospace', letterSpacing:'0.06em', margin:0 }}>
                {vessel.name}
              </h2>
              <div style={{ fontSize:10, color:'rgba(148,163,184,0.7)', marginTop:2 }}>
                {vessel.type.name}
              </div>
            </div>
          </div>
        </div>
        <button onClick={onClose} style={{
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:8, padding:'6px 10px', cursor:'pointer', color:'#94a3b8', fontSize:14
        }}>✕</button>
      </div>

      {/* Risk badge */}
      <div style={{
        display:'flex', alignItems:'center', gap:10, marginBottom:20,
        padding:'10px 14px', borderRadius:12,
        background: `${risk.bg}22`,
        border: `1px solid ${risk.border}44`
      }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:risk.dot,
          boxShadow:`0 0 8px ${risk.dot}` }} />
        <span style={{ color:'#cbd5e1', fontSize:11, fontWeight:700 }}>Risk Score</span>
        <div style={{
          marginLeft:'auto', padding:'2px 12px', borderRadius:20,
          background: risk.bg, color: risk.text, fontSize:11, fontWeight:800,
          border: `1px solid ${risk.border}`
        }}>
          {risk.label} · {vessel.riskScore}/100
        </div>
      </div>

      {/* Status */}
      <div style={{
        display:'flex', alignItems:'center', gap:8, marginBottom:20,
        padding:'8px 14px', borderRadius:10,
        background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:statusColor,
          boxShadow:`0 0 8px ${statusColor}` }} />
        <span style={{ color:'#94a3b8', fontSize:10, fontWeight:600 }}>NAVIGATION STATUS</span>
        <span style={{ marginLeft:'auto', color:'#e2e8f0', fontSize:11, fontWeight:700 }}>{vessel.status}</span>
      </div>

      {/* Mini Map */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:9, color:'rgba(100,116,139,0.8)', fontWeight:700,
          letterSpacing:'0.12em', marginBottom:8 }}>GLOBAL POSITION</div>
        <MiniMap lat={vessel.lat} lng={vessel.lng} heading={vessel.heading}
          vesselName={vessel.name} type={vessel.type} />
      </div>

      {/* Map icon indicator */}
      <div style={{
        display:'flex', alignItems:'center', gap:8, marginBottom:16,
        padding:'8px 14px', borderRadius:10,
        background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)'
      }}>
        <ShipIcon color={vessel.type.color} size={20} heading={vessel.heading} />
        <div>
          <div style={{ fontSize:9, color:'rgba(100,116,139,0.8)', fontWeight:700, letterSpacing:'0.1em' }}>MAP ICON · HEADING</div>
          <div style={{ fontSize:11, color:'#e2e8f0', fontWeight:600, fontFamily:'monospace' }}>
            {vessel.heading}° TRUE NORTH
          </div>
        </div>
        <div style={{ marginLeft:'auto' }}>
          <div style={{ fontSize:9, color:'rgba(100,116,139,0.8)', fontWeight:700, letterSpacing:'0.1em' }}>DRAUGHT</div>
          <div style={{ fontSize:11, color:'#e2e8f0', fontWeight:600, fontFamily:'monospace' }}>{vessel.draught}</div>
        </div>
      </div>

      {/* All data rows */}
      <div style={{ fontSize:9, color:'rgba(100,116,139,0.8)', fontWeight:700,
        letterSpacing:'0.12em', marginBottom:10 }}>FULL VESSEL DATA</div>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{
            display:'flex', justifyContent:'space-between', alignItems:'flex-start',
            padding:'7px 12px', borderRadius:8,
            background:'rgba(255,255,255,0.025)',
            borderBottom:'1px solid rgba(255,255,255,0.04)'
          }}>
            <span style={{ fontSize:9, color:'rgba(100,116,139,0.85)', fontWeight:700,
              letterSpacing:'0.08em', flexShrink:0, marginRight:12 }}>{label}</span>
            <span style={{ fontSize:10, color:'#cbd5e1', fontWeight:600,
              textAlign:'right', fontFamily: label.includes('IMO') || label.includes('MMSI') || label.includes('Lat') || label.includes('Long') || label.includes('Course') || label.includes('Speed') || label.includes('Position') ? 'monospace' : 'inherit' }}>
              {value}
            </span>
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
      width:'100%', height:320,
      background:'linear-gradient(135deg, #060d1a 0%, #0a1628 50%, #060d1a 100%)',
      borderRadius:16, position:'relative', overflow:'hidden',
      border:'1px solid rgba(59,130,246,0.2)'
    }}>
      {/* Grid */}
      {[10,20,30,40,50,60,70,80,90].map(v => (
        <div key={v} style={{ position:'absolute', left:`${v}%`, top:0, bottom:0,
          borderLeft:'1px solid rgba(59,130,246,0.05)' }} />
      ))}
      {[25,50,75].map(v => (
        <div key={v} style={{ position:'absolute', top:`${v}%`, left:0, right:0,
          borderTop:`1px solid rgba(59,130,246,${v===50?0.15:0.05})` }} />
      ))}

      {/* Risk zones */}
      {RISK_ZONES.map((z, i) => {
        const px = ((z.lng + 180) / 360 * 100);
        const py = ((90 - z.lat) / 180 * 100);
        const c = z.level === 'Critical' ? '#ef4444' : z.level === 'High' ? '#f97316' : '#eab308';
        return (
          <div key={i} title={z.name} style={{
            position:'absolute', left:`${px}%`, top:`${py}%`,
            width:28, height:28, borderRadius:'50%',
            background:`${c}15`, border:`1px solid ${c}40`,
            transform:'translate(-50%,-50%)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:10, color:c, cursor:'default'
          }}>⚠</div>
        );
      })}

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
                position:'absolute', inset:-10, borderRadius:'50%',
                border:`2px solid ${v.type.color}`,
                animation:'pulse-ring 1.5s ease-out infinite'
              }} />
            )}
            <ShipIcon color={isSelected ? v.type.color : `${v.type.color}99`}
              size={isSelected ? 16 : 12} heading={v.heading} />
          </div>
        );
      })}

      {/* Legend */}
      <div style={{
        position:'absolute', bottom:10, left:12,
        display:'flex', gap:12, alignItems:'center'
      }}>
        {TYPES.map(t => (
          <div key={t.name} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <ShipIcon color={t.color} size={10} />
            <span style={{ fontSize:8, color:'rgba(148,163,184,0.6)', fontWeight:600 }}>{t.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      <div style={{ position:'absolute', top:10, right:12, fontSize:9,
        color:'rgba(59,130,246,0.6)', fontWeight:700, letterSpacing:'0.12em' }}>
        LIVE AIS · {vessels.length} VESSELS
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
      x.destination.toLowerCase().includes(search.toLowerCase()) ||
      x.flag.name.toLowerCase().includes(search.toLowerCase())
    );
    if (typeFilter !== 'All') v = v.filter(x => x.type.name === typeFilter);
    if (flagFilter !== 'All') v = v.filter(x => x.flag.code === flagFilter);
    if (riskFilter !== 'All') {
      v = v.filter(x => {
        const r = getRiskColor(x.riskScore).label;
        return r === riskFilter;
      });
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
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg, #020817 0%, #0a1020 40%, #030c18 100%)',
      fontFamily:"'Space Mono', 'Courier New', monospace",
      color:'#e2e8f0',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@400;600;700;900&display=swap');
        @keyframes pulse-ring {
          0% { transform: translate(-50%,-50%) scale(0.8); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(1.8); opacity: 0; }
        }
        @keyframes slide-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        * { box-sizing:border-box; scrollbar-width:thin; scrollbar-color:rgba(59,130,246,0.3) transparent; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background:rgba(59,130,246,0.3); border-radius:3px; }
        .vessel-card-anim { animation: slide-in 0.3s ease forwards; }
        input::placeholder { color: rgba(100,116,139,0.6); }
        input:focus { outline: none; border-color: rgba(59,130,246,0.5) !important; }
        select:focus { outline: none; }
        button:focus { outline: none; }
      `}</style>

      <div style={{ maxWidth:1600, margin:'0 auto', padding:'24px 20px' }}>

        {/* ── HEADER ── */}
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'flex-start',
          marginBottom:28, flexWrap:'wrap', gap:16
        }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
              <div style={{
                width:44, height:44, borderRadius:12,
                background:'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 0 20px rgba(59,130,246,0.4)'
              }}>
                <span style={{ fontSize:22 }}>🛳</span>
              </div>
              <div>
                <h1 style={{
                  margin:0, fontSize:24, fontWeight:900,
                  fontFamily:"'Outfit', sans-serif",
                  background:'linear-gradient(90deg, #60a5fa, #38bdf8, #60a5fa)',
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                  letterSpacing:'0.02em'
                }}>VESSEL TRACKING INTELLIGENCE</h1>
                <p style={{ margin:0, fontSize:10, color:'rgba(100,116,139,0.8)',
                  fontWeight:700, letterSpacing:'0.15em' }}>
                  GLOBAL AIS MONITORING · REAL-TIME FEED ·{' '}
                  <span style={{ color:'#22c55e', animation:'blink 2s infinite' }}>● LIVE</span>
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {[
              { label:'TOTAL VESSELS', val:stats.total, color:'#3b82f6', icon:'🛳' },
              { label:'UNDERWAY', val:stats.underway, color:'#22c55e', icon:'⚡' },
              { label:'CRITICAL RISK', val:stats.critical, color:'#ef4444', icon:'⚠' },
              { label:'AT ANCHOR', val:stats.anchored, color:'#f59e0b', icon:'⚓' },
            ].map(s => (
              <div key={s.label} style={{
                background:'rgba(255,255,255,0.03)',
                border:`1px solid ${s.color}30`,
                borderRadius:12, padding:'10px 16px', minWidth:110, textAlign:'center'
              }}>
                <div style={{ fontSize:18, marginBottom:2 }}>{s.icon}</div>
                <div style={{ fontSize:22, fontWeight:900, color:s.color, fontFamily:"'Outfit', sans-serif" }}>{s.val}</div>
                <div style={{ fontSize:8, color:'rgba(100,116,139,0.7)', fontWeight:700, letterSpacing:'0.1em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── WORLD MAP ── */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:9, color:'rgba(100,116,139,0.7)', fontWeight:700,
            letterSpacing:'0.15em', marginBottom:10 }}>GLOBAL AIS PLOT · {ALL_VESSELS.length} VESSELS</div>
          <WorldMap vessels={ALL_VESSELS} onSelect={setSelected} selected={selected} />
        </div>

        {/* ── FILTERS ── */}
        <div style={{
          background:'rgba(255,255,255,0.025)',
          border:'1px solid rgba(255,255,255,0.06)',
          borderRadius:16, padding:'16px 20px',
          marginBottom:20, display:'flex', flexWrap:'wrap', gap:10, alignItems:'center'
        }}>
          {/* Search */}
          <div style={{ position:'relative', flex:'1', minWidth:200 }}>
            <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:14 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search vessel, IMO, destination, flag..."
              style={{
                width:'100%', padding:'9px 12px 9px 36px',
                background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:10, color:'#e2e8f0', fontSize:12,
                fontFamily:'inherit'
              }}
            />
          </div>

          {/* Selects */}
          {[
            { label:'TYPE', value:typeFilter, set:setTypeFilter,
              opts:['All', ...TYPES.map(t => t.name)] },
            { label:'FLAG', value:flagFilter, set:setFlagFilter,
              opts:['All', ...FLAGS.map(f => f.code)] },
            { label:'RISK', value:riskFilter, set:setRiskFilter,
              opts:['All','Critical','High','Medium','Low'] },
            { label:'STATUS', value:statusFilter, set:setStatusFilter,
              opts:['All', ...STATUSES] },
            { label:'SORT', value:sortBy, set:setSortBy,
              opts:[{v:'risk',l:'Risk Score'},{v:'name',l:'Name'},{v:'speed',l:'Speed'}].map(x=>x.v),
              labels:[{v:'risk',l:'Risk Score'},{v:'name',l:'Name'},{v:'speed',l:'Speed'}].map(x=>x.l) },
          ].map(f => (
            <div key={f.label} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ fontSize:8, color:'rgba(100,116,139,0.7)', fontWeight:700, letterSpacing:'0.1em' }}>{f.label}</span>
              <select value={f.value} onChange={e => f.set(e.target.value)} style={{
                background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:8, color:'#cbd5e1', fontSize:11, padding:'6px 10px',
                fontFamily:'inherit', cursor:'pointer'
              }}>
                {f.opts.map((o, i) => (
                  <option key={o} value={o} style={{ background:'#1e293b' }}>
                    {f.labels ? f.labels[i] : o}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* View toggle */}
          <div style={{ display:'flex', gap:4, marginLeft:'auto' }}>
            {[{id:'grid',icon:'⊞'},{id:'table',icon:'≡'}].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding:'7px 14px', borderRadius:8, fontSize:14, cursor:'pointer',
                background: tab === t.id ? 'rgba(59,130,246,0.2)' : 'transparent',
                border: tab === t.id ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                color: tab === t.id ? '#60a5fa' : '#64748b',
                transition:'all 0.15s'
              }}>{t.icon}</button>
            ))}
          </div>
        </div>

        {/* ── COUNT ── */}
        <div style={{ fontSize:9, color:'rgba(100,116,139,0.6)', fontWeight:700,
          letterSpacing:'0.12em', marginBottom:14 }}>
          SHOWING {paged.length} OF {filtered.length} VESSELS
          {search && <span style={{ color:'rgba(96,165,250,0.8)', marginLeft:8 }}>· FILTERED: "{search}"</span>}
        </div>

        {/* ── LAYOUT ── */}
        <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>

          {/* Cards / Table */}
          <div style={{ flex:1, minWidth:0 }}>
            {tab === 'grid' ? (
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',
                gap:14
              }}>
                {paged.map((v, i) => (
                  <div key={v.id} className="vessel-card-anim"
                    style={{ animationDelay:`${i * 0.03}s` }}>
                    <VesselCard vessel={v} onClick={setSelected} selected={selected?.id === v.id} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                background:'rgba(255,255,255,0.02)',
                border:'1px solid rgba(255,255,255,0.06)',
                borderRadius:16, overflow:'hidden'
              }}>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:11 }}>
                    <thead>
                      <tr style={{ background:'rgba(255,255,255,0.04)' }}>
                        {['#','MAP','VESSEL NAME','IMO','FLAG','TYPE','STATUS','SPEED',
                          'DESTINATION','REP. DEST','ETA','POSITION','LAT','LNG','RISK'].map(h => (
                          <th key={h} style={{
                            padding:'10px 12px', textAlign:'left', fontSize:8,
                            color:'rgba(100,116,139,0.8)', fontWeight:700,
                            letterSpacing:'0.1em', borderBottom:'1px solid rgba(255,255,255,0.06)',
                            whiteSpace:'nowrap'
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paged.map((v, i) => {
                        const risk = getRiskColor(v.riskScore);
                        const sc = getStatusColor(v.status);
                        return (
                          <tr key={v.id} onClick={() => setSelected(v)} style={{
                            cursor:'pointer',
                            background: selected?.id === v.id ? 'rgba(59,130,246,0.08)' : 'transparent',
                            borderBottom:'1px solid rgba(255,255,255,0.04)',
                            transition:'background 0.15s'
                          }}
                          onMouseEnter={e => { if (selected?.id !== v.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                          onMouseLeave={e => { if (selected?.id !== v.id) e.currentTarget.style.background = 'transparent'; }}
                          >
                            <td style={{ padding:'9px 12px', color:'rgba(100,116,139,0.5)', fontSize:9 }}>
                              {page*PER_PAGE+i+1}
                            </td>
                            <td style={{ padding:'9px 12px' }}>
                              <ShipIcon color={v.type.color} size={16} heading={v.heading} />
                            </td>
                            <td style={{ padding:'9px 12px', fontWeight:700, color:'#e2e8f0',
                              fontFamily:'monospace', fontSize:11, whiteSpace:'nowrap' }}>
                              {v.type.icon} {v.name}
                            </td>
                            <td style={{ padding:'9px 12px', color:'rgba(148,163,184,0.7)',
                              fontFamily:'monospace', fontSize:10 }}>{v.imo}</td>
                            <td style={{ padding:'9px 12px', fontSize:12 }}>
                              {v.flag.emoji} <span style={{ fontSize:9, color:'rgba(148,163,184,0.6)' }}>{v.flag.code}</span>
                            </td>
                            <td style={{ padding:'9px 12px', color:'rgba(148,163,184,0.8)', fontSize:10, whiteSpace:'nowrap' }}>
                              {v.type.name}
                            </td>
                            <td style={{ padding:'9px 12px' }}>
                              <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                                <div style={{ width:6, height:6, borderRadius:'50%', background:sc,
                                  boxShadow:`0 0 5px ${sc}`, flexShrink:0 }} />
                                <span style={{ fontSize:9, color:'rgba(148,163,184,0.7)', whiteSpace:'nowrap' }}>
                                  {v.status === 'Underway Using Engine' ? 'Underway' : v.status}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding:'9px 12px', color:'#94a3b8',
                              fontFamily:'monospace', fontSize:10 }}>{v.speed}</td>
                            <td style={{ padding:'9px 12px', color:'#cbd5e1', fontSize:10,
                              fontWeight:600, whiteSpace:'nowrap' }}>🏁 {v.destination}</td>
                            <td style={{ padding:'9px 12px', color:'rgba(148,163,184,0.6)',
                              fontSize:10, whiteSpace:'nowrap' }}>{v.reportedDestination}</td>
                            <td style={{ padding:'9px 12px', color:'rgba(148,163,184,0.7)',
                              fontSize:10, whiteSpace:'nowrap' }}>⏱ {v.eta}</td>
                            <td style={{ padding:'9px 12px', color:'rgba(148,163,184,0.6)',
                              fontFamily:'monospace', fontSize:9, whiteSpace:'nowrap' }}>{v.currentPosition}</td>
                            <td style={{ padding:'9px 12px', color:'rgba(148,163,184,0.6)',
                              fontFamily:'monospace', fontSize:9 }}>{v.lat}</td>
                            <td style={{ padding:'9px 12px', color:'rgba(148,163,184,0.6)',
                              fontFamily:'monospace', fontSize:9 }}>{v.lng}</td>
                            <td style={{ padding:'9px 12px' }}>
                              <span style={{
                                padding:'2px 8px', borderRadius:20,
                                background:risk.bg, color:risk.text,
                                fontSize:9, fontWeight:800,
                                border:`1px solid ${risk.border}`
                              }}>{risk.label} {v.riskScore}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center',
                gap:8, marginTop:20 }}>
                <button onClick={() => setPage(p => Math.max(0, p-1))} disabled={page === 0}
                  style={{
                    padding:'7px 16px', borderRadius:8, cursor:'pointer',
                    background:'rgba(255,255,255,0.04)',
                    border:'1px solid rgba(255,255,255,0.08)',
                    color: page === 0 ? 'rgba(100,116,139,0.3)' : '#94a3b8',
                    fontSize:11, fontFamily:'inherit'
                  }}>← PREV</button>
                {Array.from({ length: Math.min(totalPages, 8) }, (_, i) => {
                  const p = i;
                  return (
                    <button key={p} onClick={() => setPage(p)} style={{
                      width:34, height:34, borderRadius:8, cursor:'pointer',
                      background: page === p ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                      border: page === p ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.06)',
                      color: page === p ? '#60a5fa' : '#64748b',
                      fontSize:11, fontFamily:'inherit', fontWeight: page === p ? 700 : 400
                    }}>{p+1}</button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))} disabled={page === totalPages-1}
                  style={{
                    padding:'7px 16px', borderRadius:8, cursor:'pointer',
                    background:'rgba(255,255,255,0.04)',
                    border:'1px solid rgba(255,255,255,0.08)',
                    color: page === totalPages-1 ? 'rgba(100,116,139,0.3)' : '#94a3b8',
                    fontSize:11, fontFamily:'inherit'
                  }}>NEXT →</button>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{ width:360, flexShrink:0, position:'sticky', top:20,
              maxHeight:'calc(100vh - 40px)', overflowY:'auto' }}>
              <DetailPanel vessel={selected} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop:32, textAlign:'center', paddingBottom:20 }}>
          <p style={{ fontSize:9, color:'rgba(100,116,139,0.4)', fontWeight:700, letterSpacing:'0.15em' }}>
            VESSEL TRACKING INTELLIGENCE · AIS DATA · {ALL_VESSELS.length} VESSELS MONITORED
          </p>
        </div>
      </div>
    </div>
  );
}
