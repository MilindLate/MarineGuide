
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
        "relative rounded-lg overflow-hidden transition-all duration-700 w-full",
        viewMode === 'Globe' ? "map-container-globe" : "bg-[#101318]"
      )} 
      style={{ height }}
    >
      {viewMode === 'Globe' && <div className="globe-atmosphere" />}
      
      <svg className="w-full h-full relative z-10" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <clipPath id="globeClip">
            <circle cx="500" cy="250" r="230" />
          </clipPath>
          
          <linearGradient id="tempGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
          </linearGradient>

          <filter id="oceanBlur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
        </defs>

        <g clipPath={viewMode === 'Globe' ? "url(#globeClip)" : undefined}>
          {/* Base Ocean Layer */}
          <rect width="1000" height="500" fill={oceanLayer === 'Standard' ? '#101318' : oceanLayer === 'Temperature' ? '#0f172a' : '#020617'} />

          {/* Oceanographic Data Layers (Simulated) */}
          {oceanLayer === 'Temperature' && (
            <g filter="url(#oceanBlur)" opacity="0.6">
              <circle cx="500" cy="300" r="200" fill="url(#tempGrad)" />
              <circle cx="800" cy="150" r="150" fill="#ef4444" opacity="0.4" />
              <circle cx="200" cy="100" r="180" fill="#1e3a8a" opacity="0.5" />
            </g>
          )}

          {oceanLayer === 'Currents' && (
            <g opacity="0.4">
              <path d="M100,200 Q300,150 500,200 T900,250" stroke="#60a5fa" strokeWidth="20" fill="none" strokeDasharray="10,10" className="animate-pulse" />
              <path d="M50,300 Q250,350 450,300 T850,350" stroke="#3b82f6" strokeWidth="15" fill="none" strokeDasharray="15,5" />
              <path d="M200,450 Q400,400 600,450 T950,400" stroke="#1d4ed8" strokeWidth="25" fill="none" strokeDasharray="20,10" />
            </g>
          )}

          {/* Scientific Grid */}
          <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.5">
            {Array.from({ length: 36 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * (1000/36)} y1="0" x2={i * (1000/36)} y2="500" />
            ))}
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * (500/18)} x2="1000" y2={i * (500/18)} />
            ))}
          </g>

          {/* Continent Outlines (High Contrast Style) */}
          <g 
            fill={oceanLayer === 'Standard' ? "#1e293b" : "rgba(255,255,255,0.05)"} 
            stroke={oceanLayer === 'Standard' ? "#334155" : "rgba(255,255,255,0.1)"} 
            strokeWidth="1"
            className="transition-all duration-700"
          >
            {/* North America */}
            <path d="M100,50 L250,50 L300,120 L280,200 L180,250 L80,180 Z" />
            {/* South America */}
            <path d="M280,250 L350,280 L320,450 L250,450 L240,320 Z" />
            {/* Eurasia */}
            <path d="M450,50 L850,50 L950,200 L800,300 L600,320 L500,200 Z" />
            {/* Africa */}
            <path d="M480,200 L580,220 L620,380 L520,420 L450,320 Z" />
            {/* Australia */}
            <path d="M820,350 L920,350 L940,420 L840,440 Z" />
          </g>
          
          {/* Shipping Corridors */}
          {showLanes && (
            <g opacity="0.3">
              <path d="M500,150 Q700,180 850,220" stroke="#1a73e8" strokeWidth="1.2" fill="none" strokeDasharray="2,4" />
              <path d="M200,200 Q400,220 600,200" stroke="#1a73e8" strokeWidth="1.2" fill="none" strokeDasharray="2,4" />
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
                  fill="#ea4335" 
                  fillOpacity="0.1" 
                  stroke="#ea4335" 
                  strokeWidth="0.5" 
                  strokeDasharray="2,2"
                />
                <circle cx={cx} cy={cy} r="1.5" fill="#ea4335" />
              </g>
            );
          })}

          {/* Vessel Nodes */}
          {filteredVessels.map((v) => {
            const riskLevel = getRiskLevel(v.riskScore);
            const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#1a73e8');
            const isSelected = selectedVesselId === v.id;
            const x = projectX(v.lng || 0);
            const y = projectY(v.lat || 0);

            if (viewMode === 'Globe') {
              const dist = Math.sqrt(Math.pow(x - 500, 2) + Math.pow(y - 250, 2));
              if (dist > 230) return null;
            }

            return (
              <g key={v.id} className="cursor-pointer" onClick={() => handleVesselClick(v)}>
                {riskLevel === 'Critical' && (
                  <circle cx={x} cy={y} r="8" className="animate-pulse" fill="#ea4335" fillOpacity="0.3" />
                )}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? "5" : "3"} 
                  fill={color} 
                  stroke="#fff" 
                  strokeWidth={isSelected ? "1.5" : "0.5"}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Lat/Lng Tracker (Simulated Corner Readout) */}
      <div className="absolute top-4 right-4 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-[9px] font-mono font-bold text-white/70 z-20 bg-black/40">
        SCAN_POS: 24.512°N, 121.821°E
      </div>
    </div>
  );
}
