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

export interface CriticalZone {
  id: string;
  name: string;
  reason: string;
  riskLevel: RiskLevel;
  lat: number;
  lng: number;
  radius: number;
}

export interface WeatherStation {
  id: string;
  location: string;
  temp: string;
  wind: string;
  waves: string;
  visibility: string;
}

const SHIP_NAMES = [
  "MAERSK", "MSC", "COSCO", "CMA CGM", "HAPAG-LLOYD", "ONE", "EVERGREEN", "HMM", "YANG MING", "ZIM",
  "WAN HAI", "PIL", "GRIMALDI", "MATSON", "KMTC", "ARKAS", "X-PRESS", "UNIFEEDER", "EUKOR", "WALLENIUS"
];

const SHIP_SUFFIXES = [
  "EDINBURGH", "LE HAVRE", "SHANGHAI", "ROTTERDAM", "SINGAPORE", "PIONEER", "STAR", "TITAN", "AURORA", "MARINER",
  "VOYAGER", "EXPLORER", "LEGEND", "SOVEREIGN", "MAJESTY", "PRIDE", "SPIRIT", "VICTORY", "GLORY", "QUEST"
];

const FLAGS = ["🇱🇷 LR", "🇵🇦 PA", "🇲🇭 MH", "🇧🇸 BS", "🇲🇹 MT", "🇸🇬 SG", "🇭🇰 HK", "🇨🇳 CN", "🇩🇪 DE", "🇩🇰 DK"];
const TYPES = ["Container Ship", "Crude Oil Tanker", "Bulk Carrier", "LNG Carrier", "Ro-Ro Cargo", "General Cargo"];
const EMOJIS: Record<string, string> = {
  "Container Ship": "📦",
  "Crude Oil Tanker": "🛢",
  "Bulk Carrier": "⚓",
  "LNG Carrier": "💧",
  "Ro-Ro Cargo": "🚗",
  "General Cargo": "🏗"
};

function generateVessels(count: number): Vessel[] {
  const vessels: Vessel[] = [];
  for (let i = 1; i <= count; i++) {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    const name = `${SHIP_NAMES[Math.floor(Math.random() * SHIP_NAMES.length)]} ${SHIP_SUFFIXES[Math.floor(Math.random() * SHIP_SUFFIXES.length)]}`;
    const risk = Math.floor(Math.random() * 100);
    
    // Distribute vessels across global shipping lanes
    const lat = (Math.random() * 120) - 50; // -50 to 70
    const lng = (Math.random() * 300) - 150; // -150 to 150

    vessels.push({
      id: i.toString(),
      imo: (9000000 + i).toString(),
      name,
      flag: FLAGS[Math.floor(Math.random() * FLAGS.length)],
      type,
      emoji: EMOJIS[type],
      riskScore: risk,
      speed: (10 + Math.random() * 15).toFixed(1) + " kn",
      destination: "Global Port " + (i % 20),
      reportedDestination: "Global Port " + (i % 20),
      origin: "Origin Port " + (i % 15),
      atd: "2026-04-01 10:00",
      draught: (8 + Math.random() * 10).toFixed(1) + "m",
      status: "Underway",
      eta: "Apr " + (5 + (i % 10)),
      lat,
      lng,
      heading: Math.floor(Math.random() * 360),
      currentPosition: `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`
    });
  }
  return vessels;
}

export const VESSELS: Vessel[] = generateVessels(100);

export const CRITICAL_ZONES: CriticalZone[] = [
  { id: 'z1', name: 'Bab el-Mandeb', reason: 'High Geopolitical Instability', riskLevel: 'Critical', lat: 12.6, lng: 43.3, radius: 25 },
  { id: 'z2', name: 'Strait of Hormuz', reason: 'Strategic Chokepoint Risk', riskLevel: 'High', lat: 26.5, lng: 56.2, radius: 20 },
  { id: 'z3', name: 'Taiwan Strait', reason: 'Military Exercise Zone', riskLevel: 'Medium', lat: 24.5, lng: 119.5, radius: 30 },
];

export const WEATHER_STATIONS: WeatherStation[] = [
  { id: 'w1', location: 'North Atlantic', temp: '14°C', wind: '22 kn NW', waves: '2.4m', visibility: '8nm' },
  { id: 'w2', location: 'Red Sea Central', temp: '28°C', wind: '8 kn S', waves: '0.8m', visibility: '12nm' },
  { id: 'w3', location: 'South China Sea', temp: '26°C', wind: '15 kn NE', waves: '1.5m', visibility: '10nm' },
];

export interface Port {
  name: string;
  region: string;
  congestion: string;
  ships: number;
  wait: string;
  risk: number;
}

export const PORTS: Port[] = [
  { name: 'Shanghai', region: 'Asia-Pacific', congestion: 'Severe', ships: 312, wait: '22h', risk: 82 },
  { name: 'Singapore', region: 'Asia-Pacific', congestion: 'High', ships: 198, wait: '8h', risk: 67 },
  { name: 'Rotterdam', region: 'Europe', congestion: 'High', ships: 176, wait: '11h', risk: 65 },
  { name: 'Los Angeles', region: 'Americas', congestion: 'Medium', ships: 134, wait: '4h', risk: 44 },
  { name: 'Dubai', region: 'Middle East', congestion: 'Medium', ships: 88, wait: '3h', risk: 42 },
];

export interface Route {
  from: string;
  to: string;
  risk: number;
  legName: string;
}

export const ROUTES: Route[] = [
  { from: 'Shanghai', to: 'Rotterdam', risk: 77, legName: 'Via Suez Canal' },
  { from: 'Mumbai', to: 'Hamburg', risk: 91, legName: 'Red Sea Corridor' },
  { from: 'Singapore', to: 'LA', risk: 44, legName: 'Trans-Pacific' },
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
