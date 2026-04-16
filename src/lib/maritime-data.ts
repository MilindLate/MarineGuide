export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Vessel {
  id: string;
  imo: string;
  name: string;
  flag: string;
  type: string;
  emoji: string;
  riskScore: number;
  speed: string;
  destination: string;
  reportedDestination: string;
  origin: string;
  atd: string;
  draught: string;
  status: string;
  eta: string;
  lat: number;
  lng: number;
  heading: number;
  currentPosition: string;
}

export interface RiskZone {
  id: string;
  name: string;
  reason: string;
  riskLevel: RiskLevel;
  lat: number;
  lng: number;
  radius: number;
  category: 'Geopolitical' | 'Weather' | 'Operational';
}

export interface WeatherStation {
  id: string;
  location: string;
  temp: string;
  wind: string;
  waves: string;
  visibility: string;
}

export interface Port {
  name: string;
  region: string;
  congestion: 'Low' | 'Medium' | 'High' | 'Severe';
  ships: number;
  wait: string;
  risk: number;
}

export interface Route {
  from: string;
  to: string;
  risk: number;
}

// ─── ALL WORLD PORTS (Comprehensive list for analytic purposes) ─────────────

export const TURKISH_PORTS: Port[] = [
  { name: 'Ambarlı (Marport)', region: 'Marmara / Istanbul', congestion: 'Severe', ships: 145, wait: '18h', risk: 85 },
  { name: 'Haydarpaşa', region: 'Marmara / Istanbul', congestion: 'Medium', ships: 56, wait: '4h', risk: 35 },
  { name: 'İzmit / Derince', region: 'Marmara / Kocaeli', congestion: 'High', ships: 112, wait: '9h', risk: 61 },
  { name: 'Dilovası (Yılport)', region: 'Marmara / Kocaeli', congestion: 'High', ships: 88, wait: '12h', risk: 68 },
  { name: 'Gemlik (Borusan)', region: 'Marmara / Bursa', congestion: 'Medium', ships: 74, wait: '6h', risk: 42 },
  { name: 'Bandırma', region: 'Marmara / Balıkesir', congestion: 'Low', ships: 32, wait: '2h', risk: 15 },
  { name: 'Tekirdağ (Asyaport)', region: 'Marmara / Tekirdağ', congestion: 'High', ships: 92, wait: '10h', risk: 58 },
  { name: 'İzmir (Alsancak)', region: 'Aegean / Izmir', congestion: 'High', ships: 82, wait: '8h', risk: 55 },
  { name: 'Aliağa (Nemport)', region: 'Aegean / Izmir', congestion: 'Severe', ships: 104, wait: '22h', risk: 88 },
  { name: 'Mersin (MIP)', region: 'Mediterranean / Mersin', congestion: 'Severe', ships: 167, wait: '24h', risk: 92 },
  { name: 'İskenderun (Limak)', region: 'Mediterranean / Hatay', congestion: 'High', ships: 74, wait: '11h', risk: 63 },
  { name: 'Antalya', region: 'Mediterranean / Antalya', congestion: 'Low', ships: 35, wait: '3h', risk: 20 },
  { name: 'Samsun', region: 'Black Sea / Samsun', congestion: 'Low', ships: 41, wait: '3h', risk: 18 },
  { name: 'Trabzon', region: 'Black Sea / Trabzon', congestion: 'Low', ships: 28, wait: '2h', risk: 12 },
  { name: 'Zonguldak / Erdemir', region: 'Black Sea / Zonguldak', congestion: 'Medium', ships: 63, wait: '7h', risk: 44 },
  { name: 'Ereğli', region: 'Black Sea / Zonguldak', congestion: 'Medium', ships: 45, wait: '5h', risk: 30 },
];

export const GLOBAL_PORTS: Port[] = [
  { name: 'Shanghai', region: 'East Asia', congestion: 'Severe', ships: 312, wait: '22h', risk: 82 },
  { name: 'Singapore', region: 'Southeast Asia', congestion: 'High', ships: 198, wait: '8h', risk: 67 },
  { name: 'Rotterdam', region: 'Northern Europe', congestion: 'High', ships: 176, wait: '11h', risk: 65 },
  { name: 'Jebel Ali', region: 'Middle East', congestion: 'Medium', ships: 142, wait: '6h', risk: 48 },
  { name: 'Los Angeles', region: 'North America', congestion: 'High', ships: 98, wait: '14h', risk: 72 },
  { name: 'Hong Kong', region: 'East Asia', congestion: 'High', ships: 154, wait: '10h', risk: 60 },
  { name: 'Busan', region: 'East Asia', congestion: 'High', ships: 132, wait: '9h', risk: 58 },
  { name: 'Ningbo', region: 'East Asia', congestion: 'Severe', ships: 224, wait: '18h', risk: 78 },
  { name: 'Hamburg', region: 'Northern Europe', congestion: 'Medium', ships: 108, wait: '6h', risk: 40 },
  { name: 'Antwerp', region: 'Northern Europe', congestion: 'High', ships: 145, wait: '10h', risk: 55 },
  { name: 'Alexandria', region: 'North Africa', congestion: 'High', ships: 118, wait: '12h', risk: 68 },
  { name: 'Santos', region: 'South America', congestion: 'High', ships: 126, wait: '12h', risk: 65 },
  { name: 'New York', region: 'North America', congestion: 'High', ships: 124, wait: '12h', risk: 65 },
  { name: 'Colombo', region: 'South Asia', congestion: 'Medium', ships: 88, wait: '6h', risk: 38 },
];

export const PORTS: Port[] = [...TURKISH_PORTS, ...GLOBAL_PORTS];

// ─── SHIP GENERATION (100 Vessels) ───────────────────────────────────────────

const SHIP_NAMES = [
  'MAERSK', 'MSC', 'COSCO', 'CMA CGM', 'HAPAG-LLOYD', 'ONE', 'EVERGREEN',
  'HMM', 'YANG MING', 'ZIM', 'WAN HAI', 'PIL', 'GRIMALDI', 'MATSON',
  'KMTC', 'ARKAS', 'X-PRESS', 'UNIFEEDER', 'EUKOR', 'WALLENIUS',
];

const SHIP_SUFFIXES = [
  'EDINBURGH', 'LE HAVRE', 'SHANGHAI', 'ROTTERDAM', 'SINGAPORE', 'PIONEER',
  'STAR', 'TITAN', 'AURORA', 'MARINER', 'VOYAGER', 'EXPLORER', 'LEGEND',
  'SOVEREIGN', 'MAJESTY', 'PRIDE', 'SPIRIT', 'VICTORY', 'GLORY', 'QUEST',
];

const FLAGS = ['🇱🇷 LR', '🇵🇦 PA', '🇲🇭 MH', '🇧🇸 BS', '🇲🇹 MT', '🇸🇬 SG', '🇭🇰 HK', '🇨🇳 CN', '🇩🇪 DE', '🇩🇰 DK', '🇹🇷 TR'];
const TYPES = ['Container Ship', 'Crude Oil Tanker', 'Bulk Carrier', 'LNG Carrier', 'Ro-Ro Cargo', 'General Cargo'];
const EMOJIS: Record<string, string> = {
  'Container Ship': '📦',
  'Crude Oil Tanker': '🛢',
  'Bulk Carrier': '⚓',
  'LNG Carrier': '💧',
  'Ro-Ro Cargo': '🚗',
  'General Cargo': '🏗',
};

function generateVessels(count: number): Vessel[] {
  const vessels: Vessel[] = [];
  for (let i = 1; i <= count; i++) {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    const name = `${SHIP_NAMES[Math.floor(Math.random() * SHIP_NAMES.length)]} ${SHIP_SUFFIXES[Math.floor(Math.random() * SHIP_SUFFIXES.length)]}`;
    const risk = Math.floor(Math.random() * 100);
    const lat = (Math.random() * 120) - 50;
    const lng = (Math.random() * 300) - 150;
    const origin = PORTS[Math.floor(Math.random() * PORTS.length)].name;
    const destination = PORTS[Math.floor(Math.random() * PORTS.length)].name;

    vessels.push({
      id: i.toString(),
      imo: (9000000 + i).toString(),
      name,
      flag: FLAGS[Math.floor(Math.random() * FLAGS.length)],
      type,
      emoji: EMOJIS[type],
      riskScore: risk,
      speed: (10 + Math.random() * 15).toFixed(1) + ' kn',
      destination,
      reportedDestination: destination,
      origin,
      atd: '2026-04-01 10:00',
      draught: (8 + Math.random() * 10).toFixed(1) + 'm',
      status: Math.random() > 0.8 ? 'At Anchor' : 'Underway Using Engine',
      eta: 'Apr ' + (5 + (i % 10)) + ', 14:00',
      lat,
      lng,
      heading: Math.floor(Math.random() * 360),
      currentPosition: `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`,
    });
  }
  return vessels;
}

export const VESSELS: Vessel[] = generateVessels(100);

export const ROUTES: Route[] = [
  { from: 'Shanghai', to: 'Rotterdam', risk: 82 },
  { from: 'Singapore', to: 'Jebel Ali', risk: 45 },
  { from: 'Ambarlı', to: 'Mersin', risk: 28 },
  { from: 'Shanghai', to: 'Long Beach', risk: 74 },
  { from: 'Mumbai', to: 'Jeddah', risk: 58 },
];

export const ALL_RISK_ZONES: RiskZone[] = [
  { id: 'z1', name: 'Bab el-Mandeb', reason: 'Geopolitical Instability', riskLevel: 'Critical', lat: 12.6, lng: 43.3, radius: 25, category: 'Geopolitical' },
  { id: 'z2', name: 'Strait of Hormuz', reason: 'Chokepoint Risk', riskLevel: 'High', lat: 26.5, lng: 56.2, radius: 20, category: 'Geopolitical' },
  { id: 'wz1', name: 'Arabian Sea Cyclone', reason: 'Tropical Storm', riskLevel: 'Critical', lat: 15.0, lng: 65.0, radius: 45, category: 'Weather' },
];

export const WEATHER_STATIONS: WeatherStation[] = [
  { id: 'w1', location: 'North Atlantic', temp: '14°C', wind: '22 kn NW', waves: '2.4m', visibility: '8nm' },
  { id: 'w2', location: 'Red Sea Central', temp: '28°C', wind: '8 kn S', waves: '0.8m', visibility: '12nm' },
];

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

export function getRiskColorClass(score: number) {
  const level = getRiskLevel(score);
  switch (level) {
    case 'Critical': return 'risk-critical';
    case 'High': return 'risk-high';
    case 'Medium': return 'risk-medium';
    case 'Low': return 'risk-low';
  }
}
