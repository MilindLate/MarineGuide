"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { VESSELS, ALL_RISK_ZONES, getRiskLevel, getRiskColorClass, type Vessel } from '@/lib/maritime-data';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Navigation } from 'lucide-react';
import { useMap } from 'react-leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then(m => m.Tooltip), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(m => m.Circle), { ssr: false });

interface VesselMapProps {
  height?: string | number;
  searchQuery?: string;
  showWeather?: boolean;
  showLanes?: boolean;
  showAlerts?: boolean;
  viewMode?: '2D' | 'Globe';
  riskMode?: 'Standard' | 'Geopolitical' | 'Weather';
  selectedVesselId?: string | null;
  onVesselSelect?: (vessel: Vessel | null) => void;
}

function MapController({ selectedVesselId }: { selectedVesselId: string | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedVesselId) {
      const vessel = VESSELS.find(v => v.id === selectedVesselId);
      if (vessel) {
        map.setView([vessel.lat, vessel.lng], 6, { animate: true, duration: 1.5 });
      }
    }
  }, [selectedVesselId, map]);
  return null;
}

export function VesselMap({ 
  height = "100%", 
  searchQuery = "", 
  showWeather = true, 
  showLanes = true, 
  showAlerts = true,
  viewMode = '2D',
  riskMode = 'Standard',
  selectedVesselId: externalSelectedId,
  onVesselSelect,
}: VesselMapProps) {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [L, setL] = useState<any>(null);

  const selectedVesselId = externalSelectedId || internalSelectedId;

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  const filteredVessels = useMemo(() => {
    return VESSELS.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.includes(searchQuery) ||
      v.imo.includes(searchQuery)
    );
  }, [searchQuery]);

  const displayedRiskZones = useMemo(() => {
    if (riskMode === 'Standard') return ALL_RISK_ZONES.filter(z => z.riskLevel === 'Critical');
    return ALL_RISK_ZONES.filter(z => z.category === riskMode);
  }, [riskMode]);

  const handleVesselClick = (v: Vessel) => {
    setInternalSelectedId(v.id);
    if (onVesselSelect) onVesselSelect(v);
  };

  const createVesselIcon = (vessel: Vessel) => {
    if (!L) return null;
    const riskLevel = getRiskLevel(vessel.riskScore);
    const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#1a73e8');
    const isSelected = selectedVesselId === vessel.id;
    const heading = vessel.heading || 0;
    
    const shipPath = "M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z";

    return L.divIcon({
      className: 'custom-vessel-icon',
      html: `
        <div class="relative flex items-center justify-center">
          ${(riskLevel === 'Critical' || (riskMode !== 'Standard' && vessel.riskScore > 70)) ? `<div class="absolute w-8 h-8 bg-red-500/20 rounded-full animate-ping"></div>` : ''}
          ${isSelected ? `<div class="absolute w-10 h-10 border-2 border-blue-400 rounded-full scale-110 animate-pulse"></div>` : ''}
          <svg viewBox="0 0 24 24" style="width: ${isSelected ? '32px' : '24px'}; height: ${isSelected ? '32px' : '24px'}; transform: rotate(${heading}deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);">
            <path d="${shipPath}" fill="${color}" stroke="white" stroke-width="1.5" />
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const projectX = (lng: number) => 500 + (lng * 1.8);
  const projectY = (lat: number) => 250 + (lat * -2.4);

  if (viewMode === 'Globe') {
    return (
      <div className="relative w-full h-full map-container-globe bg-slate-900 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="globe-atmosphere" />
          <svg className="w-full h-full relative z-10" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
            <defs>
              <clipPath id="globeClip"><circle cx="500" cy="250" r="240" /></clipPath>
              <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" /><stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <g clipPath="url(#globeClip)">
              <rect width="1000" height="500" fill="url(#globeGrad)" />
              <g fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8">
                <path d="M120,80 L280,80 L320,150 L280,240 L160,280 L90,180 Z" /><path d="M480,80 L880,80 L960,220 L780,320 L580,340 L450,200 Z" /><path d="M520,220 L620,240 L650,420 L520,450 L480,320 Z" />
              </g>
              {filteredVessels.map((v) => {
                const x = projectX(v.lng);
                const y = projectY(v.lat);
                const dist = Math.sqrt(Math.pow(x - 500, 2) + Math.pow(y - 250, 2));
                if (dist > 240) return null;
                const riskLevel = getRiskLevel(v.riskScore);
                const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#1a73e8');
                return (
                  <g key={v.id} className="cursor-pointer" onClick={() => handleVesselClick(v)}>
                    <circle cx={x} cy={y} r={selectedVesselId === v.id ? 4 : 2} fill={color} />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#f0f2f5]">
      {!L ? (
        <div className="w-full h-full flex items-center justify-center text-[#5f6368] font-bold text-xs uppercase tracking-widest">Initialising Tactical Grid...</div>
      ) : (
        <MapContainer center={[20, 30]} zoom={3} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <MapController selectedVesselId={selectedVesselId} />
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}" attribution='&copy; Esri' />
          {showLanes && <TileLayer url="https://tiles.openseamap.org/seamark/{z}/{y}/{x}.png" attribution='&copy; OpenSeaMap' opacity={0.5} />}
          
          {showAlerts && displayedRiskZones.map(zone => (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={zone.radius * 6000}
              pathOptions={{
                color: zone.category === 'Weather' ? '#4285f4' : '#ea4335',
                fillColor: zone.category === 'Weather' ? '#4285f4' : '#ea4335',
                fillOpacity: 0.1,
                dashArray: '5, 5',
                weight: 1
              }}
            >
              <Popup>
                <div className="p-2 space-y-1 text-center">
                  <div className={cn("text-[9px] font-black uppercase tracking-widest", zone.category === 'Weather' ? 'text-blue-600' : 'text-red-600')}>
                    {zone.category === 'Weather' ? 'Environmental' : 'Geopolitical'}
                  </div>
                  <div className="font-bold text-xs">{zone.name}</div>
                  <p className="text-[10px] text-slate-500 leading-tight">{zone.reason}</p>
                </div>
              </Popup>
            </Circle>
          ))}

          {filteredVessels.map(v => (
            <Marker key={v.id} position={[v.lat, v.lng]} icon={createVesselIcon(v) as any} eventHandlers={{ click: () => handleVesselClick(v) }}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="px-2 py-1 bg-white rounded shadow-sm border border-slate-200">
                  <div className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{v.name}</div>
                  <div className="text-[8px] font-bold text-[#1a73e8] uppercase">{v.type}</div>
                </div>
              </Tooltip>
              <Popup className="vessel-popup-marine" maxWidth={320} minWidth={300} closeButton={false}>
                <div className="flex flex-col bg-white overflow-hidden rounded-xl">
                  <div className="bg-[#f8f9fa] border-b p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{v.emoji}</span>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 leading-none">{v.name}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">{v.type}</p>
                      </div>
                    </div>
                    <div className={cn("px-2 py-0.5 rounded text-[9px] font-black border", getRiskColorClass(v.riskScore))}>{v.riskScore}</div>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <div className="text-slate-400 uppercase tracking-tighter">FLAG <span className="text-slate-900">{v.flag}</span></div>
                      <div className="text-slate-400 uppercase tracking-tighter">IMO <span className="text-slate-900">{v.imo}</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px]">
                      <div className="space-y-0.5"><p className="text-slate-400 font-bold uppercase tracking-tighter">Destination</p><p className="text-slate-900 font-black truncate">{v.destination}</p></div>
                      <div className="space-y-0.5 text-right"><p className="text-slate-400 font-bold uppercase tracking-tighter">Speed</p><p className="text-slate-900 font-black">{v.speed}</p></div>
                    </div>
                  </div>
                  <div className="p-2 flex gap-2 bg-white border-t">
                    <button className="flex-1 py-1.5 rounded bg-[#1a73e8] text-white text-[10px] font-black hover:bg-[#1669d6] transition-colors uppercase tracking-tight">Identify Node</button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
