
"use client";

import React, { useState, useMemo } from 'react';
import { VESSELS, CRITICAL_ZONES, getRiskLevel, getRiskColorClass, type Vessel } from '@/lib/maritime-data';
import { cn } from '@/lib/utils';
import type { KMLFeature } from '@/app/map/page';

interface VesselMapProps {
  height?: number;
  searchQuery?: string;
  showWeather?: boolean;
  showLanes?: boolean;
  showAlerts?: boolean;
  viewMode?: '2D' | 'Globe';
  onVesselSelect?: (vessel: Vessel | null) => void;
  kmlOverlays?: KMLFeature[];
}

export function VesselMap({ 
  height = 320, 
  searchQuery = "", 
  showWeather = true, 
  showLanes = true, 
  showAlerts = true,
  viewMode = '2D',
  onVesselSelect,
  kmlOverlays = []
}: VesselMapProps) {
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);

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

  const projectX = (lng: number) => {
    if (viewMode === 'Globe') {
      return 500 + (lng * 1.5);
    }
    return (lng * 2.5) + 500;
  };

  const projectY = (lat: number) => {
    if (viewMode === 'Globe') {
      return 250 + (lat * -2);
    }
    return (lat * -3) + 250;
  };

  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden sh border transition-colors duration-500 w-full",
        viewMode === 'Globe' ? "map-container-globe border-slate-800" : "bg-[#cce5f5] border-blue-100"
      )} 
      style={{ height }}
    >
      {viewMode === 'Globe' && <div className="globe-atmosphere" />}
      
      <svg className="w-full h-full relative z-10" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <clipPath id="globeClip">
            <circle cx="500" cy="250" r="230" />
          </clipPath>
          <radialGradient id="weatherGrad1"><stop offset="0%" stopColor="#4285f4" /><stop offset="100%" stopColor="transparent" /></radialGradient>
        </defs>

        <g clipPath={viewMode === 'Globe' ? "url(#globeClip)" : undefined}>
          <g stroke={viewMode === 'Globe' ? "rgba(255,255,255,0.05)" : "rgba(66,133,244,0.08)"} strokeWidth="1">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
            ))}
          </g>

          <g 
            fill={viewMode === 'Globe' ? "#1e3a24" : "#d1e6bc"} 
            stroke={viewMode === 'Globe' ? "#2d5a35" : "#a9c490"} 
            strokeWidth="0.5"
            className="transition-colors duration-500"
          >
            <path d="M50,100 L150,100 L200,200 L180,350 L100,450 L50,300 Z" opacity="0.8" />
            <path d="M400,50 L600,50 L850,100 L950,250 L800,400 L600,450 L450,450 L400,300 L350,150 Z" opacity="0.8" />
            <circle cx="850" cy="380" r="40" opacity="0.8" />
          </g>
          
          {showLanes && (
            <g opacity={viewMode === 'Globe' ? "0.15" : "0.2"}>
              <path d="M200,150 Q400,100 500,120" stroke={viewMode === 'Globe' ? "#4285f4" : "#1a73e8"} strokeWidth="4" fill="none" className="animate-pulse" />
              <path d="M150,250 Q500,200 850,220" stroke={viewMode === 'Globe' ? "#4285f4" : "#1a73e8"} strokeWidth="6" fill="none" className="animate-pulse" />
            </g>
          )}

          {showWeather && (
            <g opacity={viewMode === 'Globe' ? "0.2" : "0.3"}>
              <circle cx="300" cy="180" r="100" fill="url(#weatherGrad1)">
                <animate attributeName="r" values="80;110;80" dur="8s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {kmlOverlays.filter(f => f.type === 'LineString').map(f => (
            <path
              key={f.id}
              d={`M ${f.coordinates.map(p => `${projectX(p.lng)},${projectY(p.lat)}`).join(' L ')}`}
              stroke="#8e24aa"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,3"
              opacity="0.8"
            />
          ))}

          {showAlerts && CRITICAL_ZONES.map(zone => (
            <circle 
              key={zone.id}
              cx={projectX(zone.lng)} 
              cy={projectY(zone.lat)} 
              r={viewMode === 'Globe' ? zone.radius * 0.8 : zone.radius} 
              fill={zone.riskLevel === 'Critical' ? '#ea4335' : '#fbbc04'} 
              fillOpacity="0.15" 
              stroke={zone.riskLevel === 'Critical' ? '#ea4335' : '#fbbc04'} 
              strokeWidth="1"
              strokeDasharray="4,2"
              className="animate-pulse"
            />
          ))}

          {filteredVessels.map((v) => {
            const riskLevel = getRiskLevel(v.riskScore);
            const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#4285f4');
            const isSelected = selectedVesselId === v.id;
            const x = projectX(v.lng || 0);
            const y = projectY(v.lat || 0);

            return (
              <g key={v.id} className="cursor-pointer group" onClick={() => handleVesselClick(v)}>
                {riskLevel === 'Critical' && (
                  <circle cx={x} cy={y} r="15" className="animate-pulse" fill={color} fillOpacity="0.2" />
                )}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "8" : "5"} 
                  fill={color} 
                  stroke="white" 
                  strokeWidth={isSelected ? "2" : "1"}
                  className="transition-all duration-300"
                />
                {isSelected && (
                  <text x={x + 10} y={y + 4} fontSize="10" fontWeight="bold" fill={color} className="drop-shadow-sm select-none">
                    {v.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute bottom-4 left-4 backdrop-blur-md px-4 py-2 rounded-full flex gap-4 sh border text-[10px] font-bold shadow-sm z-20 bg-white/80">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ea4335]" /> Critical</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#4285f4]" /> Normal</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#8e24aa]" /> Overlay</div>
      </div>
    </div>
  );
}
