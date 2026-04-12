
"use client";

import React, { useState, useMemo } from 'react';
import { VESSELS, getRiskLevel, getRiskColorClass, type Vessel } from '@/lib/maritime-data';
import { cn } from '@/lib/utils';
import { Ship, Wind, Map as MapIcon, Info } from 'lucide-react';

interface VesselMapProps {
  height?: number;
  searchQuery?: string;
  showWeather?: boolean;
  showLanes?: boolean;
  showAlerts?: boolean;
  onVesselSelect?: (vessel: Vessel | null) => void;
}

export function VesselMap({ 
  height = 320, 
  searchQuery = "", 
  showWeather = true, 
  showLanes = true, 
  showAlerts = true,
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

  return (
    <div className="relative bg-[#cce5f5] rounded-lg overflow-hidden sh border border-blue-100 w-full" style={{ height }}>
      <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
        {/* Subtle Grid Lines */}
        <g stroke="rgba(66,133,244,0.08)" strokeWidth="1">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="500" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 100} x2="1000" y2={i * 100} />
          ))}
        </g>

        {/* Landmasses (Stylized) */}
        <path d="M150,100 Q250,50 400,100 T600,80 T850,150 T900,300 T800,450 T500,400 T200,450 Z" fill="#c8ddb3" opacity="0.6" />
        <circle cx="200" cy="150" r="40" fill="#c8ddb3" opacity="0.6" />
        <circle cx="700" cy="300" r="100" fill="#c8ddb3" opacity="0.6" />
        
        {/* Shipping Lanes Layer */}
        {showLanes && (
          <g opacity="0.15">
            <path d="M100,200 C300,180 700,220 900,250" stroke="#4285f4" strokeWidth="12" fill="none" />
            <path d="M200,400 C400,380 600,420 800,350" stroke="#4285f4" strokeWidth="12" fill="none" />
            <path d="M100,200 C300,180 700,220 900,250" stroke="#4285f4" strokeWidth="1.5" fill="none" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" from="100" to="0" dur="15s" repeatCount="indefinite" />
            </path>
          </g>
        )}

        {/* Weather Layer */}
        {showWeather && (
          <g opacity="0.2">
            <circle cx="300" cy="200" r="80" fill="url(#weatherGradient)">
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="5s" repeatCount="indefinite" />
            </circle>
            <defs>
              <radialGradient id="weatherGradient">
                <stop offset="0%" stopColor="#4285f4" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
          </g>
        )}

        {/* Vessel Markers */}
        {filteredVessels.map((v) => {
          const riskLevel = getRiskLevel(v.riskScore);
          const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#4285f4');
          const isSelected = selectedVesselId === v.id;
          
          // Coordinate mapping: lng -180..180 -> 140..860, lat -90..90 -> 430..70
          const x = (v.lng || 0) * 2 + 500;
          const y = (v.lat || 0) * -2 + 250;

          return (
            <g key={v.id} className="cursor-pointer group" onClick={() => handleVesselClick(v)}>
              {/* Alert Rings */}
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
              
              {/* Label for Critical or Selected */}
              {(v.riskScore > 80 || isSelected) && (
                <g className={cn("transition-opacity", isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
                  <rect x={x + 10} y={y - 12} width={v.name.length * 7 + 20} height="24" rx="12" fill="white" className="sh shadow-lg" />
                  <text x={x + 18} y={y + 4} fontSize="10" fontWeight="700" fill="#202124">{v.name}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Selected Vessel Overlay */}
      {selectedVesselId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur shadow-2xl border rounded-2xl p-4 flex items-center gap-4 animate-in fade-in zoom-in duration-200 w-80">
          {(() => {
            const v = VESSELS.find(v => v.id === selectedVesselId);
            if (!v) return null;
            return (
              <>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border flex items-center justify-center text-2xl shadow-inner">
                  {v.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#202124] truncate">{v.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", getRiskColorClass(v.riskScore))}>
                      RISK {v.riskScore}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">To: {v.destination}</span>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedVesselId(null); if (onVesselSelect) onVesselSelect(null); }}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Info className="w-4 h-4 text-slate-400" />
                </button>
              </>
            );
          })()}
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center sh border hover:bg-gray-50 transition-colors shadow-sm font-bold text-[#5f6368]">+</button>
        <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center sh border hover:bg-gray-50 transition-colors shadow-sm font-bold text-[#5f6368]">−</button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full flex gap-4 sh border border-white/50 text-[10px] font-bold shadow-sm">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ea4335]" /> Critical</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" /> High</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#4285f4]" /> Med</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#34a853]" /> Low</div>
      </div>
    </div>
  );
}
