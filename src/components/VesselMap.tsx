
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
  height?: number;
  searchQuery?: string;
  showWeather?: boolean;
  showLanes?: boolean;
  showAlerts?: boolean;
  viewMode?: '2D' | 'Globe';
  oceanLayer?: 'Standard' | 'Temperature' | 'Currents';
  onVesselSelect?: (vessel: Vessel | null) => void;
}

export function VesselMap({ 
  height = 320, 
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
      v.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleVesselClick = (v: Vessel) => {
    const newId = v.id === selectedVesselId ? null : v.id;
    setSelectedVesselId(newId);
    if (onVesselSelect) onVesselSelect(newId ? v : null);
  };

  // Custom icon creator for Leaflet
  const createVesselIcon = (vessel: Vessel) => {
    if (!L) return null;
    const riskLevel = getRiskLevel(vessel.riskScore);
    const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#1a73e8');
    const isSelected = selectedVesselId === vessel.id;
    
    return L.divIcon({
      className: 'custom-vessel-icon',
      html: `
        <div class="relative flex items-center justify-center">
          ${riskLevel === 'Critical' ? '<div class="absolute w-6 h-6 bg-red-500/30 rounded-full animate-pulse"></div>' : ''}
          <div style="
            width: ${isSelected ? '12px' : '8px'}; 
            height: ${isSelected ? '12px' : '8px'}; 
            background: ${color}; 
            border: 1.5px solid white; 
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            transition: all 0.2s;
          "></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  // 2D Real Map Component
  const RealMap2D = () => {
    if (!L) return null;
    return (
      <MapContainer 
        center={[20, 40]} 
        zoom={3} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="z-10"
      >
        {/* Base Layer: ESRI Ocean Basemap for beautiful sea detail */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
        />
        
        {/* OpenSeaMap Overlay: Nautical charts, seamarks, buoys */}
        <TileLayer
          url="https://tiles.openseamap.org/seamark/{z}/{y}/{x}.png"
          attribution='&copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
        />

        {/* Global Reference Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}"
          attribution=""
          opacity={0.6}
        />

        {/* Critical Zones */}
        {showAlerts && CRITICAL_ZONES.map(zone => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={zone.radius * 5000} // radius in meters for Leaflet
            pathOptions={{
              color: '#ea4335',
              fillColor: '#ea4335',
              fillOpacity: 0.1,
              dashArray: '5, 5',
              weight: 1
            }}
          >
            <Popup className="text-xs font-bold">
              <span className="text-red-600 uppercase tracking-wider block mb-1">Warning: {zone.name}</span>
              <span className="text-slate-600 font-medium">{zone.reason}</span>
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
            <Popup className="vessel-popup">
              <div className="text-center p-1">
                <div className="text-2xl mb-1">{v.emoji}</div>
                <div className="font-bold text-sm text-slate-900">{v.name}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">{v.type}</div>
                <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border inline-block", getRiskColorClass(v.riskScore))}>
                  Risk: {v.riskScore}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  // Simple projection for Globe mode (fallback/stylized)
  const projectX = (lng: number) => 500 + (lng * 1.8);
  const projectY = (lat: number) => 250 + (lat * -2.4);

  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden transition-all duration-700 w-full",
        viewMode === 'Globe' ? "map-container-globe" : "bg-slate-100"
      )} 
      style={{ height }}
    >
      {viewMode === '2D' ? (
        <RealMap2D />
      ) : (
        <>
          <div className="globe-atmosphere" />
          <svg className="w-full h-full relative z-10" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
            <defs>
              <clipPath id="globeClip">
                <circle cx="500" cy="250" r="230" />
              </clipPath>
            </defs>

            <g clipPath="url(#globeClip)">
              <rect width="1000" height="500" fill="#020617" />
              
              {/* Simplified Continent Outlines for Globe mode */}
              <g fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
                <path d="M100,50 L250,50 L300,120 L280,200 L180,250 L80,180 Z" />
                <path d="M280,250 L350,280 L320,450 L250,450 L240,320 Z" />
                <path d="M450,50 L850,50 L950,200 L800,300 L600,320 L500,200 Z" />
                <path d="M480,200 L580,220 L620,380 L520,420 L450,320 Z" />
                <path d="M820,350 L920,350 L940,420 L840,440 Z" />
              </g>

              {filteredVessels.map((v) => {
                const riskLevel = getRiskLevel(v.riskScore);
                const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#1a73e8');
                const x = projectX(v.lng || 0);
                const y = projectY(v.lat || 0);
                const dist = Math.sqrt(Math.pow(x - 500, 2) + Math.pow(y - 250, 2));
                if (dist > 230) return null;

                return (
                  <g key={v.id} className="cursor-pointer" onClick={() => handleVesselClick(v)}>
                    {riskLevel === 'Critical' && <circle cx={x} cy={y} r="8" className="animate-pulse" fill="#ea4335" fillOpacity="0.3" />}
                    <circle cx={x} cy={y} r="3" fill={color} stroke="#fff" strokeWidth="0.5" />
                  </g>
                );
              })}
            </g>
          </svg>
        </>
      )}

      {/* Lat/Lng Tracker */}
      <div className="absolute top-4 right-4 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-[9px] font-mono font-bold text-white/70 z-20 bg-black/40">
        SCAN_POS: 24.512°N, 121.821°E
      </div>
    </div>
  );
}
