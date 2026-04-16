
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { VESSELS, CRITICAL_ZONES, getRiskLevel, getRiskColorClass, type Vessel } from '@/lib/maritime-data';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(m => m.Circle), { ssr: false });

interface VesselMapProps {
  height?: string | number;
  searchQuery?: string;
  showWeather?: boolean;
  showLanes?: boolean;
  showAlerts?: boolean;
  viewMode?: '2D' | 'Globe';
  oceanLayer?: 'Standard' | 'Temperature' | 'Currents';
  onVesselSelect?: (vessel: Vessel | null) => void;
}

export function VesselMap({ 
  height = "100%", 
  searchQuery = "", 
  showWeather = true, 
  showLanes = true, 
  showAlerts = true,
  viewMode = '2D',
  oceanLayer = 'Standard',
  onVesselSelect,
}: VesselMapProps) {
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Only load Leaflet on client
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  const filteredVessels = useMemo(() => {
    return VESSELS.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.includes(searchQuery)
    );
  }, [searchQuery]);

  const handleVesselClick = (v: Vessel) => {
    const newId = v.id === selectedVesselId ? null : v.id;
    setSelectedVesselId(newId);
    if (onVesselSelect) onVesselSelect(newId ? v : null);
  };

  // Custom icon creator for Leaflet - MarineTraffic Style
  const createVesselIcon = (vessel: Vessel) => {
    if (!L) return null;
    const riskLevel = getRiskLevel(vessel.riskScore);
    const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#1a73e8');
    const isSelected = selectedVesselId === vessel.id;
    const heading = vessel.heading || 0;
    
    // Ship icon SVG path (pointed hull shape)
    const shipPath = "M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z";

    return L.divIcon({
      className: 'custom-vessel-icon',
      html: `
        <div class="relative flex items-center justify-center">
          ${riskLevel === 'Critical' ? `<div class="absolute w-8 h-8 bg-red-500/30 rounded-full animate-ping"></div>` : ''}
          ${isSelected ? `<div class="absolute w-10 h-10 border-2 border-blue-400 rounded-full scale-110"></div>` : ''}
          <svg 
            viewBox="0 0 24 24" 
            style="
              width: ${isSelected ? '28px' : '22px'}; 
              height: ${isSelected ? '28px' : '22px'}; 
              transform: rotate(${heading}deg);
              filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            "
          >
            <path 
              d="${shipPath}" 
              fill="${color}" 
              stroke="white" 
              stroke-width="1.5"
            />
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // 2D Real Map Component
  const RealMap2D = () => {
    if (!L) return null;
    return (
      <MapContainer 
        center={[20, 30]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false}
        className="z-10"
      >
        {/* Base Layer: ESRI Ocean Basemap */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri'
        />
        
        {/* OpenSeaMap Overlay */}
        {showLanes && (
          <TileLayer
            url="https://tiles.openseamap.org/seamark/{z}/{y}/{x}.png"
            attribution='&copy; OpenSeaMap'
            opacity={0.8}
          />
        )}

        {/* Global Reference Overlay */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          opacity={0.4}
        />

        {/* Temperature Layer Simulation */}
        {oceanLayer === 'Temperature' && (
          <TileLayer
            url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=83c180927894344d21e8d910243685e8"
            opacity={0.4}
          />
        )}

        {/* Critical Zones */}
        {showAlerts && CRITICAL_ZONES.map(zone => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.radius * 6000}
            pathOptions={{
              color: '#ea4335',
              fillColor: '#ea4335',
              fillOpacity: 0.15,
              dashArray: '8, 8',
              weight: 1.5
            }}
          >
            <Popup className="vessel-popup">
              <div className="text-center p-2 space-y-1">
                <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Warning Zone</div>
                <div className="font-bold text-sm text-slate-900">{zone.name}</div>
                <p className="text-[10px] text-slate-500 font-medium">{zone.reason}</p>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Vessel Markers */}
        {filteredVessels.map(v => (
          <Marker 
            key={v.id} 
            position={[v.lat || 0, v.lng || 0]} 
            icon={createVesselIcon(v) as any}
            eventHandlers={{
              click: () => handleVesselClick(v)
            }}
          >
            <Popup className="vessel-popup" closeButton={false}>
              <div className="text-center p-1.5 min-w-[120px]">
                <div className="text-2xl mb-1">{v.emoji}</div>
                <div className="font-bold text-sm text-[#202124]">{v.name}</div>
                <div className="text-[9px] text-[#1a73e8] font-bold uppercase tracking-wider mb-2">{v.type}</div>
                <div className={cn("px-2.5 py-1 rounded-full text-[9px] font-bold border inline-block sh-sm", getRiskColorClass(v.riskScore))}>
                  RISK: {v.riskScore}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  // Simple projection for Globe mode
  const projectX = (lng: number) => 500 + (lng * 1.8);
  const projectY = (lat: number) => 250 + (lat * -2.4);

  return (
    <div 
      className={cn(
        "relative transition-all duration-700 w-full h-full",
        viewMode === 'Globe' ? "map-container-globe" : "bg-slate-100"
      )} 
    >
      {viewMode === '2D' ? (
        <RealMap2D />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="globe-atmosphere" />
          <svg className="w-full h-full relative z-10" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
            <defs>
              <clipPath id="globeClip">
                <circle cx="500" cy="250" r="240" />
              </clipPath>
              <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            <g clipPath="url(#globeClip)">
              <rect width="1000" height="500" fill="url(#globeGrad)" />
              
              <g fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8">
                <path d="M120,80 L280,80 L320,150 L280,240 L160,280 L90,180 Z" />
                <path d="M480,80 L880,80 L960,220 L780,320 L580,340 L450,200 Z" />
                <path d="M520,220 L620,240 L650,420 L520,450 L480,320 Z" />
                <path d="M840,360 L940,360 L950,440 L850,460 Z" />
              </g>

              {filteredVessels.map((v) => {
                const riskLevel = getRiskLevel(v.riskScore);
                const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#1a73e8');
                const x = projectX(v.lng || 0);
                const y = projectY(v.lat || 0);
                const heading = v.heading || 0;
                const dist = Math.sqrt(Math.pow(x - 500, 2) + Math.pow(y - 250, 2));
                
                if (dist > 240) return null;
                
                const isSelected = selectedVesselId === v.id;

                return (
                  <g 
                    key={v.id} 
                    className="cursor-pointer group transition-all" 
                    onClick={() => handleVesselClick(v)}
                    style={{ transformOrigin: `${x}px ${y}px`, transform: `rotate(${heading}deg)` }}
                  >
                    {riskLevel === 'Critical' && (
                      <circle cx={x} cy={y} r={isSelected ? "14" : "10"} className="animate-pulse" fill="#ea4335" fillOpacity="0.2" />
                    )}
                    <path 
                      d={`M${x},${y-6} L${x-4},${y+6} L${x+4},${y+6} Z`}
                      fill={color} 
                      stroke="white" 
                      strokeWidth={isSelected ? "1.5" : "1"} 
                      className="transition-all"
                    />
                    {isSelected && (
                      <text x={x + 10} y={y + 4} fill="white" fontSize="9" fontWeight="bold" className="pointer-events-none drop-shadow-md" style={{ transform: `rotate(${-heading}deg)`, transformOrigin: `${x}px ${y}px` }}>
                        {v.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      )}

      <div className="absolute top-4 right-4 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[9px] font-mono font-bold text-white/60 z-20 bg-black/30 flex flex-col items-end gap-0.5">
        <span className="flex items-center gap-2">AIS_SAT_FEED: <span className="text-green-400">ACTIVE</span></span>
        <span className="opacity-50 tracking-tighter">LAT: 24.5122°N | LNG: 121.8214°E</span>
      </div>
    </div>
  );
}
