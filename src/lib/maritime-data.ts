
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Vessel {
  id: string;
  name: string;
  type: string;
  emoji: string;
  riskScore: number;
  speed: string;
  destination: string;
  eta: string;
  lat?: number;
  lng?: number;
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

export const VESSELS: Vessel[] = [
  { id: '1', name: 'MSC Elena', type: 'Container', emoji: '📦', riskScore: 91, speed: '14.2 kn', destination: 'Rotterdam', eta: 'Apr 6', lat: 20, lng: 38 },
  { id: '2', name: 'Alta Maya', type: 'Tanker', emoji: '🛢', riskScore: 81, speed: '12.1 kn', destination: 'Hamburg', eta: 'Apr 8', lat: 18, lng: 40 },
  { id: '3', name: 'Orion Bulk', type: 'Bulk Carrier', emoji: '⚓', riskScore: 67, speed: '10.5 kn', destination: 'Shanghai', eta: 'Apr 10', lat: 31, lng: 122 },
  { id: '4', name: 'Pacific Star', type: 'Bulk Carrier', emoji: '⚓', riskScore: 63, speed: '11.8 kn', destination: 'Shanghai', eta: 'Apr 5', lat: 34, lng: -120 },
  { id: '5', name: 'Q-Flex Aurora', type: 'LNG Carrier', emoji: '💧', riskScore: 44, speed: '18.4 kn', destination: 'Singapore', eta: 'Apr 4', lat: 1.3, lng: 103 },
  { id: '6', name: 'Maersk Oslo', type: 'Container', emoji: '📦', riskScore: 38, speed: '21.2 kn', destination: 'Antwerp', eta: 'Apr 7', lat: 51, lng: 4 },
  { id: '7', name: 'OOCL Pioneer', type: 'Container', emoji: '📦', riskScore: 42, speed: '19.6 kn', destination: 'Busan', eta: 'Apr 5', lat: 35, lng: 129 },
  { id: '8', name: 'Evergreen Jade', type: 'Container', emoji: '📦', riskScore: 28, speed: '20.5 kn', destination: 'LA', eta: 'Apr 12', lat: 33, lng: -118 },
  { id: '9', name: 'CMA Titan', type: 'Container', emoji: '📦', riskScore: 65, speed: '15.8 kn', destination: 'Le Havre', eta: 'Apr 9', lat: 49, lng: 0 },
  { id: '10', name: 'HMM Korea', type: 'Container', emoji: '📦', riskScore: 71, speed: '16.4 kn', destination: 'Tokyo', eta: 'Apr 11', lat: 35, lng: 139 },
];

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
  { name: 'Hamburg', region: 'Europe', congestion: 'Low', ships: 62, wait: '1h', risk: 22 },
  { name: 'Mumbai', region: 'South Asia', congestion: 'Medium', ships: 71, wait: '5h', risk: 48 },
  { name: 'Busan', region: 'Asia-Pacific', congestion: 'Low', ships: 45, wait: '<1h', risk: 18 },
  { name: 'Antwerp', region: 'Europe', congestion: 'Low', ships: 38, wait: '<1h', risk: 20 },
  { name: 'New York', region: 'Americas', congestion: 'Low', ships: 29, wait: '<1h', risk: 15 },
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
  { from: 'Dubai', to: 'New York', risk: 62, legName: 'Via Cape Horn' },
  { from: 'Busan', to: 'Seattle', risk: 31, legName: 'North Pacific' },
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
