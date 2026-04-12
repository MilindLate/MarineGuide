"use client";

import React, { useState, useMemo } from 'react';
import { VESSELS, CRITICAL_ZONES, getRiskLevel, getRiskColorClass, type Vessel } from '@/lib/maritime-data';
import { cn } from '@/lib/utils';

interface VesselMapProps {
  height?: number;
  searchQuery?: string;
  showWeather?: boolean;
  showLanes?: boolean;
  showAlerts?: boolean;
  viewMode?: '2D' | 'Globe';
  onVesselSelect?: (vessel: Vessel | null) => void;
}

export function VesselMap({ 
  height = 320, 
  searchQuery = "", 
  showWeather = true, 
  showLanes = true, 
  showAlerts = true,
  viewMode = '2D',
  onVesselSelect,
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

  /**
   * EQUirectangular Projection:
   * x = (lng + 180) * (width / 360)
   * y = (90 - lat) * (height / 180)
   * Viewbox is 1000x500
   */
  const projectX = (lng: number) => {
    if (viewMode === 'Globe') {
      const relativeLng = lng - 43;
      return 500 + (relativeLng * 1.8);
    }
    return (lng + 180) * (1000 / 360);
  };

  const projectY = (lat: number) => {
    if (viewMode === 'Globe') {
      return 250 + (lat * -2.4);
    }
    return (90 - lat) * (500 / 180);
  };

  return (
    <div 
      className={cn(
        "relative rounded-lg overflow-hidden sh border transition-all duration-700 w-full",
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
          <radialGradient id="weatherGrad1">
            <stop offset="0%" stopColor="#4285f4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g clipPath={viewMode === 'Globe' ? "url(#globeClip)" : undefined}>
          {/* Grid Lines */}
          <g stroke={viewMode === 'Globe' ? "rgba(255,255,255,0.05)" : "rgba(66,133,244,0.08)"} strokeWidth="0.5">
            {Array.from({ length: 36 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * (1000/36)} y1="0" x2={i * (1000/36)} y2="500" />
            ))}
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * (500/18)} x2="1000" y2={i * (500/18)} />
            ))}
          </g>

          {/* Continent Outlines (Equirectangular Simplified) */}
          <g 
            fill={viewMode === 'Globe' ? "#1e3a24" : "#e4f1d6"} 
            stroke={viewMode === 'Globe' ? "#2d5a35" : "#c4d9b0"} 
            strokeWidth="1"
            className="transition-colors duration-700"
          >
            {/* Standard continental shapes approximated for performance */}
            <path d="M120,80 L200,60 L280,80 L320,150 L280,250 L200,350 L100,320 L80,200 Z" opacity="0.9" />
            <path d="M450,100 L600,80 L800,100 L900,180 L850,300 L700,350 L550,320 L480,200 Z" opacity="0.9" />
            <path d="M750,350 L850,330 L900,380 L850,450 L750,420 Z" opacity="0.9" />
          </g>
          
          {/* Shipping Lanes */}
          {showLanes && (
            <g opacity={viewMode === 'Globe' ? "0.3" : "0.5"}>
              <path d="M500,150 Q700,180 850,220" stroke={viewMode === 'Globe' ? "#4285f4" : "#1a73e8"} strokeWidth="1.5" fill="none" strokeDasharray="4,4" className="animate-pulse" />
              <path d="M200,200 Q400,220 600,200" stroke={viewMode === 'Globe' ? "#4285f4" : "#1a73e8"} strokeWidth="1.5" fill="none" strokeDasharray="4,4" className="animate-pulse" />
            </g>
          )}

          {/* Weather Layers */}
          {showWeather && (
            <g opacity={viewMode === 'Globe' ? "0.2" : "0.4"}>
              <circle cx="650" cy="200" r="80" fill="url(#weatherGrad1)">
                <animate attributeName="r" values="70;100;70" dur="10s" repeatCount="indefinite" />
              </circle>
              <circle cx="300" cy="150" r="100" fill="url(#weatherGrad1)">
                <animate attributeName="r" values="90;120;90" dur="12s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Critical Risk Zones */}
          {showAlerts && CRITICAL_ZONES.map(zone => {
            const cx = projectX(zone.lng);
            const cy = projectY(zone.lat);
            return (
              <g key={zone.id}>
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={viewMode === 'Globe' ? zone.radius * 0.8 : zone.radius} 
                  fill={zone.riskLevel === 'Critical' ? '#ea4335' : '#fbbc04'} 
                  fillOpacity="0.1" 
                  stroke={zone.riskLevel === 'Critical' ? '#ea4335' : '#fbbc04'} 
                  strokeWidth="1"
                  strokeDasharray="4,2"
                  className="animate-pulse"
                />
                <circle cx={cx} cy={cy} r="2" fill={zone.riskLevel === 'Critical' ? '#ea4335' : '#fbbc04'} />
              </g>
            );
          })}

          {/* Vessel Markers */}
          {filteredVessels.map((v) => {
            const riskLevel = getRiskLevel(v.riskScore);
            const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#4285f4');
            const isSelected = selectedVesselId === v.id;
            const x = projectX(v.lng || 0);
            const y = projectY(v.lat || 0);

            if (viewMode === 'Globe') {
              const dist = Math.sqrt(Math.pow(x - 500, 2) + Math.pow(y - 250, 2));
              if (dist > 230) return null;
            }

            return (
              <g key={v.id} className="cursor-pointer group" onClick={() => handleVesselClick(v)}>
                {riskLevel === 'Critical' && (
                  <circle cx={x} cy={y} r="12" className="animate-pulse" fill={color} fillOpacity="0.2" />
                )}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "7" : "4.5"} 
                  fill={color} 
                  stroke="white" 
                  strokeWidth={isSelected ? "2" : "1"}
                  className="transition-all duration-300"
                />
                {isSelected && (
                  <g>
                    <rect x={x + 10} y={y - 20} width={80} height={24} rx="4" fill="white" className="sh" stroke={color} strokeWidth="1" />
                    <text x={x + 15} y={y - 4} fontSize="10" fontWeight="bold" fill="#202124" className="select-none">
                      {v.name}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute bottom-4 left-4 backdrop-blur-md px-4 py-2 rounded-xl flex gap-4 sh border text-[10px] font-bold shadow-sm z-20 bg-white/90">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ea4335]" /> Critical Risk</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" /> High Risk</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#4285f4]" /> Normal</div>
      </div>
    </div>
  );
}
