"use client";

import React, { useState, useMemo } from 'react';
import { VESSELS, CRITICAL_ZONES, getRiskLevel, getRiskColorClass, type Vessel } from '@/lib/maritime-data';
import { cn } from '@/lib/utils';
import { Ship, Wind, Map as MapIcon, Info, ShieldAlert, Globe } from 'lucide-react';

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
  onVesselSelect
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
    setSelectedVesselId(v.id === selectedVesselId ? null : v.id);
    if (onVesselSelect) onVesselSelect(v.id === selectedVesselId ? null : v);
  };

  // Coordinate projection logic
  const projectX = (lng: number) => {
    if (viewMode === 'Globe') {
      // Scale coordinates to fit the circular globe mask
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
        {/* Globe Masking */}
        {viewMode === 'Globe' && (
          <defs>
            <clipPath id="globeClip">
              <circle cx="500" cy="250" r="230" />
            </clipPath>
          </defs>
        )}

        <g clipPath={viewMode === 'Globe' ? "url(#globeClip)" : undefined}>
          {/* Subtle Grid Lines */}
          <g stroke={viewMode === 'Globe' ? "rgba(255,255,255,0.05)" : "rgba(66,133,244,0.08)"} strokeWidth="1">
            {Array.from({ length: 20 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} />
            ))}
          </g>

          {/* Landmasses */}
          <g 
            fill={viewMode === 'Globe' ? "#1e3a24" : "#d1e6bc"} 
            stroke={viewMode === 'Globe' ? "#2d5a35" : "#a9c490"} 
            strokeWidth="0.5"
            className="transition-colors duration-500"
          >
            {/* Americas */}
            <path d="M50,100 L150,100 L200,200 L180,350 L100,450 L50,300 Z" opacity="0.8" />
            {/* Eurasia + Africa */}
            <path d="M400,50 L600,50 L850,100 L950,250 L800,400 L600,450 L450,450 L400,300 L350,150 Z" opacity="0.8" />
            {/* Australia */}
            <circle cx="850" cy="380" r="40" opacity="0.8" />
          </g>
          
          {/* Shipping Lanes */}
          {showLanes && (
            <g opacity={viewMode === 'Globe' ? "0.15" : "0.2"}>
              <path d="M200,150 Q400,100 500,120" stroke={viewMode === 'Globe' ? "#4285f4" : "#1a73e8"} strokeWidth="8" fill="none" />
              <path d="M150,250 Q500,200 850,220" stroke={viewMode === 'Globe' ? "#4285f4" : "#1a73e8"} strokeWidth="12" fill="none" />
              <path d="M500,120 L550,200 L650,350 L850,300" stroke={viewMode === 'Globe' ? "#4285f4" : "#1a73e8"} strokeWidth="6" fill="none" strokeDasharray="10,5">
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="20s" repeatCount="indefinite" />
              </path>
            </g>
          )}

          {/* Weather Layer */}
          {showWeather && (
            <g opacity={viewMode === 'Globe' ? "0.2" : "0.3"}>
              <circle cx="300" cy="180" r="100" fill="url(#weatherGrad1)">
                <animate attributeName="r" values="80;110;80" dur="8s" repeatCount="indefinite" />
              </circle>
              <circle cx="750" cy="120" r="60" fill="url(#weatherGrad2)">
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="6s" repeatCount="indefinite" />
              </circle>
              <defs>
                <radialGradient id="weatherGrad1"><stop offset="0%" stopColor="#4285f4" /><stop offset="100%" stopColor="transparent" /></radialGradient>
                <radialGradient id="weatherGrad2"><stop offset="0%" stopColor="#ea4335" /><stop offset="100%" stopColor="transparent" /></radialGradient>
              </defs>
            </g>
          )}

          {/* Critical Zones */}
          {showAlerts && CRITICAL_ZONES.map(zone => (
            <g key={zone.id}>
              <circle 
                cx={projectX(zone.lng)} 
                cy={projectY(zone.lat)} 
                r={viewMode === 'Globe' ? zone.radius * 0.8 : zone.radius} 
                fill={zone.riskLevel === 'Critical' ? '#ea4335' : '#fbbc04'} 
                fillOpacity="0.15" 
                stroke={zone.riskLevel === 'Critical' ? '#ea4335' : '#fbbc04'} 
                strokeWidth="1"
                strokeDasharray="4,2"
              />
              <text 
                x={projectX(zone.lng)} 
                y={projectY(zone.lat) - (viewMode === 'Globe' ? zone.radius * 0.8 : zone.radius) - 5} 
                fontSize="8" 
                fontWeight="bold" 
                fill={zone.riskLevel === 'Critical' ? (viewMode === 'Globe' ? '#ff6b6b' : '#c5221f') : '#b06000'}
                textAnchor="middle"
                className="pointer-events-none"
              >
                {zone.name.toUpperCase()}
              </text>
            </g>
          ))}

          {/* Vessels */}
          {filteredVessels.map((v) => {
            const riskLevel = getRiskLevel(v.riskScore);
            const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#4285f4');
            const isSelected = selectedVesselId === v.id;
            
            const x = projectX(v.lng || 0);
            const y = projectY(v.lat || 0);

            return (
              <g key={v.id} className="cursor-pointer group" onClick={() => handleVesselClick(v)}>
                {showAlerts && riskLevel === 'Critical' && (
                  <circle cx={x} cy={y} r="18" className="animate-pulse-ring" fill={color} fillOpacity="0.2" />
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
                
                {(v.riskScore > 80 || isSelected) && (
                  <g className={cn("transition-opacity", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                    <rect x={x + 10} y={y - 12} width={v.name.length * 7 + 25} height="24" rx="12" fill={viewMode === 'Globe' ? "rgba(30,32,34,0.9)" : "white"} className="sh shadow-lg" />
                    <text x={x + 18} y={y + 4} fontSize="10" fontWeight="700" fill={viewMode === 'Globe' ? "white" : "#202124"}>{v.name}</text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Selected Vessel Overlay */}
      {selectedVesselId && (
        <div className={cn(
          "absolute top-4 left-1/2 -translate-x-1/2 backdrop-blur shadow-2xl border rounded-2xl p-4 flex items-center gap-4 animate-in fade-in zoom-in duration-200 w-80 z-20",
          viewMode === 'Globe' ? "bg-slate-900/90 border-slate-700 text-white" : "bg-white/95 border-slate-200 text-slate-900"
        )}>
          {(() => {
            const v = VESSELS.find(v => v.id === selectedVesselId);
            if (!v) return null;
            return (
              <>
                <div className="w-12 h-12 rounded-xl bg-slate-800/50 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                  {v.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">{v.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", getRiskColorClass(v.riskScore))}>
                      RISK {v.riskScore}
                    </span>
                    <span className="text-[10px] opacity-70 font-medium truncate">To: {v.destination}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedVesselId(null); if (onVesselSelect) onVesselSelect(null); }}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Info className="w-4 h-4 opacity-50" />
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center sh border transition-all shadow-sm font-bold",
          viewMode === 'Globe' ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
        )}>+</button>
        <button className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center sh border transition-all shadow-sm font-bold",
          viewMode === 'Globe' ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
        )}>−</button>
      </div>

      {/* Legend */}
      <div className={cn(
        "absolute bottom-4 left-4 backdrop-blur-md px-4 py-2 rounded-full flex gap-4 sh border text-[10px] font-bold shadow-sm z-20",
        viewMode === 'Globe' ? "bg-black/40 border-white/10 text-white" : "bg-white/80 border-white/50 text-slate-900"
      )}>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ea4335]" /> Critical Zone</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" /> High Risk</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#4285f4]" /> Vessel</div>
      </div>
    </div>
  );
}
