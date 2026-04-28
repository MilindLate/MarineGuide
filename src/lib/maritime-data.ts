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
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
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
  lat: number;
  lng: number;
}

export interface Route {
  from: string;
  to: string;
  risk: number;
}

// ─── ALL WORLD PORTS ─────────

export const WORLD_PORT_NAMES: string[] = [
  'ALGIERS', 'ADELAIDE', 'BRISBANE', 'SYDNEY', 'MELBOURNE', 'CHITTAGONG', 'ANTWERP', 'SANTOS', 'RIO DE JANEIRO',
  'VANCOUVER', 'MONTREAL', 'SHANGHAI', 'NINGBO', 'SHENZHEN', 'QINGDAO', 'TIANJIN', 'HONG KONG', 'CARTAGENA',
  'COPENHAGEN', 'GUAYAQUIL', 'ALEXANDRIA', 'PORT SAID', 'HELSINKI', 'LE HAVRE', 'MARSEILLES', 'HAMBURG', 'BREMEN',
  'TEMA', 'PIRAEUS', 'REYKJAVIK', 'MUMBAI', 'CHENNAI', 'MUNDRA', 'VISAKHAPATNAM', 'JAKARTA', 'SURABAYA', 'DUBLIN', 'GENOA', 'NAPLES', 'TRIESTE',
  'TOKYO', 'YOKOHAMA', 'KOBE', 'MOMBASA', 'KUWAIT', 'BEIRUT', 'CASABLANCA', 'ROTTERDAM', 'AMSTERDAM', 'AUCKLAND',
  'LAGOS', 'OSLO', 'MUSCAT', 'KARACHI', 'MANILA', 'GDANSK', 'LISBON', 'DOHA', 'CONSTANTA', 'VLADIVOSTOK', 'ST. PETERSBURG',
  'SINGAPORE', 'CAPE TOWN', 'DURBAN', 'BARCELONA', 'VALENCIA', 'BILBAO', 'GOTHENBURG', 'COLOMBO', 'JEDDAH', 'KAOHSIUNG',
  'BANGKOK', 'DAR ES SALAAM', 'MERSIN', 'ISTANBUL', 'IZMIR', 'DUBAI', 'JEBEL ALI', 'LONDON', 'FELIXSTOWE', 'LIVERPOOL',
  'NEW YORK', 'LOS ANGELES', 'LONG BEACH', 'HOUSTON', 'SAVANNAH', 'OAKLAND', 'MONTEVIDEO', 'HO CHI MINH CITY', 'ADEN'
];

// ─── REALISTIC MARITIME CORRIDORS (LAT/LNG BOUNDS) ─────────
const MARITIME_AREAS = [
  { name: 'North Atlantic', lat: [30, 55], lng: [-50, -15] },
  { name: 'South Atlantic', lat: [-35, -5], lng: [-25, 5] },
  { name: 'North Pacific', lat: [25, 50], lng: [140, 210] },
  { name: 'South Pacific', lat: [-40, -10], lng: [160, 230] },
  { name: 'Indian Ocean', lat: [-30, 10], lng: [60, 90] },
  { name: 'Mediterranean', lat: [32, 42], lng: [0, 30] },
  { name: 'English Channel', lat: [48, 51], lng: [-5, 2] },
  { name: 'Malacca Strait', lat: [1, 6], lng: [95, 105] },
  { name: 'Red Sea', lat: [15, 25], lng: [35, 42] },
  { name: 'Gulf of Mexico', lat: [20, 28], lng: [-95, -82] },
  { name: 'Arabian Sea', lat: [10, 22], lng: [55, 72] },
  { name: 'Bay of Bengal', lat: [8, 20], lng: [82, 95] },
];

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

function randomPort(): string {
  return WORLD_PORT_NAMES[Math.floor(Math.random() * WORLD_PORT_NAMES.length)];
}

function generateVessels(count: number): Vessel[] {
  const vessels: Vessel[] = [];
  for (let i = 1; i <= count; i++) {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    const name = `${SHIP_NAMES[Math.floor(Math.random() * SHIP_NAMES.length)]} ${SHIP_SUFFIXES[Math.floor(Math.random() * SHIP_SUFFIXES.length)]}`;
    const risk = Math.floor(Math.random() * 100);
    
    const area = MARITIME_AREAS[Math.floor(Math.random() * MARITIME_AREAS.length)];
    const lat = area.lat[0] + (Math.random() * (area.lat[1] - area.lat[0]));
    let lng = area.lng[0] + (Math.random() * (area.lng[1] - area.lng[0]));
    
    if (lng > 180) lng -= 360;

    const destName = randomPort();
    const originName = randomPort();

    // Simplified sea coordinate generator based on port name strings
    const originLat = 20 + (Math.random() * 20);
    const originLng = -40 + (Math.random() * 80);
    const destLat = -10 + (Math.random() * 40);
    const destLng = 100 + (Math.random() * 20);

    vessels.push({
      id: i.toString(),
      imo: (9000000 + i).toString(),
      name,
      flag: FLAGS[Math.floor(Math.random() * FLAGS.length)],
      type,
      emoji: EMOJIS[type],
      riskScore: risk,
      speed: (10 + Math.random() * 15).toFixed(1) + ' kn',
      destination: destName,
      reportedDestination: destName,
      origin: originName,
      atd: '2026-04-01 10:00',
      draught: (8 + Math.random() * 10).toFixed(1) + 'm',
      status: Math.random() > 0.8 ? 'At Anchor' : 'Underway Using Engine',
      eta: 'Apr ' + (5 + (i % 10)) + ', 14:00',
      lat,
      lng,
      heading: Math.floor(Math.random() * 360),
      currentPosition: `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`,
      originLat,
      originLng,
      destLat,
      destLng
    });
  }
  return vessels;
}

export const VESSELS: Vessel[] = generateVessels(100);

export const TURKISH_PORTS: Port[] = [
  { name: 'Ambarlı (Marport)', region: 'Marmara', congestion: 'Severe', ships: 145, wait: '18h', risk: 85, lat: 40.97, lng: 28.71 },
  { name: 'Mersin (MIP)', region: 'Mediterranean', congestion: 'Severe', ships: 167, wait: '24h', risk: 92, lat: 36.80, lng: 34.63 },
  { name: 'Aliağa', region: 'Aegean', congestion: 'High', ships: 104, wait: '22h', risk: 88, lat: 38.83, lng: 26.93 },
  { name: 'Asyaport', region: 'Marmara', congestion: 'High', ships: 92, wait: '10h', risk: 58, lat: 40.92, lng: 27.46 },
];

export const INDIAN_PORTS: Port[] = [
  { name: 'Mumbai (JNPT)', region: 'India', congestion: 'High', ships: 88, wait: '12h', risk: 45, lat: 18.95, lng: 72.95 },
  { name: 'Chennai', region: 'India', congestion: 'Medium', ships: 54, wait: '6h', risk: 38, lat: 13.08, lng: 80.29 },
  { name: 'Mundra', region: 'India', congestion: 'High', ships: 112, wait: '14h', risk: 52, lat: 22.75, lng: 69.70 },
  { name: 'Visakhapatnam', region: 'India', congestion: 'Low', ships: 32, wait: '4h', risk: 30, lat: 17.68, lng: 83.21 },
];

export const PORTS: Port[] = [
  ...TURKISH_PORTS,
  ...INDIAN_PORTS,
  { name: 'Shanghai', region: 'China', congestion: 'Severe', ships: 312, wait: '22h', risk: 82, lat: 31.23, lng: 121.47 },
  { name: 'Singapore', region: 'Singapore', congestion: 'High', ships: 198, wait: '8h', risk: 67, lat: 1.35, lng: 103.82 },
  { name: 'Rotterdam', region: 'Netherlands', congestion: 'High', ships: 176, wait: '11h', risk: 65, lat: 51.92, lng: 4.47 },
  { name: 'Jebel Ali', region: 'UAE', congestion: 'Medium', ships: 142, wait: '6h', risk: 48, lat: 25.01, lng: 55.06 },
  { name: 'Los Angeles', region: 'USA', congestion: 'High', ships: 98, wait: '14h', risk: 72, lat: 33.74, lng: -118.26 },
];

export const ROUTES: Route[] = [
  { from: 'Shanghai', to: 'Rotterdam', risk: 82 },
  { from: 'Singapore', to: 'Jebel Ali', risk: 45 },
  { from: 'Mumbai', to: 'Jebel Ali', risk: 32 },
];

export const ALL_RISK_ZONES: RiskZone[] = [
  { id: 'z1', name: 'Bab el-Mandeb', reason: 'High Geopolitical Instability', riskLevel: 'Critical', lat: 12.6, lng: 43.3, radius: 25, category: 'Geopolitical' },
  { id: 'z2', name: 'Strait of Hormuz', reason: 'Strategic Chokepoint Risk', riskLevel: 'High', lat: 26.5, lng: 56.2, radius: 20, category: 'Geopolitical' },
  { id: 'wz1', name: 'Arabian Sea Cyclone', reason: 'Tropical System Category 3', riskLevel: 'Critical', lat: 15.0, lng: 65.0, radius: 45, category: 'Weather' },
];

export const WEATHER_STATIONS: WeatherStation[] = [
  { id: 'w1', location: 'North Atlantic', temp: '14°C', wind: '22 kn NW', waves: '2.4m', visibility: '8nm' },
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
