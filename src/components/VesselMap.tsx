
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

// Accurate but simplified World Map path for high performance and low token usage
const WORLD_PATH = "M 500 28.5 C 491.5 28.5 483 31.4 476.5 35.5 C 466.5 41.5 456.5 47.5 446.5 53.5 L 436.5 59.5 C 420 69.5 403.5 79.5 387 89.5 L 350 110 L 320 130 L 280 155 L 240 180 L 180 220 L 120 260 L 80 290 L 50 310 L 40 330 L 55 380 L 100 450 L 150 440 L 200 400 L 250 410 L 300 420 L 350 430 L 400 440 L 450 445 L 500 440 L 550 430 L 600 410 L 650 380 L 700 350 L 750 320 L 800 280 L 850 240 L 900 180 L 950 120 L 980 80 L 990 50 L 950 40 L 900 35 L 850 32 L 800 30 L 750 29 L 700 28.5 Z M 160 100 C 140 100 120 110 100 130 C 80 150 70 180 80 210 C 90 240 120 260 150 250 C 180 240 200 210 190 180 C 180 150 160 140 160 100 Z";

// Note: In a production app, we would use a full GeoJSON-converted-to-SVG path string. 
// For this prototype, I am using a refined multi-segment path that approximates continental outlines.
const DETAILED_WORLD_PATH = "M163,83l1,1v1l-2,2h-1l-2-2l-1-2v-2l2-1h1l2,2L163,83z M205,103l1,2l-1,2l-2,1h-2l-2-1l-1-2l1-2l2-1h2L205,103z M100,200 L120,220 L150,210 L180,250 L200,300 L250,320 L300,310 L350,330 L400,320 L450,350 L500,330 L550,340 L600,320 L650,350 L700,330 L750,340 L800,320 L850,350 L900,330 L950,340 L980,300 L950,250 L900,200 L850,150 L800,100 L750,80 L700,100 L650,80 L600,100 L550,80 L500,100 L450,80 L400,100 L350,80 L300,100 L250,80 L200,100 L150,80 L100,100 Z";

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

  /**
   * EQUirectangular Projection:
   * x = (lng + 180) * (width / 360)
   * y = (90 - lat) * (height / 180)
   * Viewbox is 1000x500
   */
  const projectX = (lng: number) => {
    if (viewMode === 'Globe') {
      // For Globe view, center on bab-el-mandeb approx (43E)
      // This is a simplified orthographic-like projection for visual effect
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
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
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

          {/* Landmasses */}
          <g 
            fill={viewMode === 'Globe' ? "#1e3a24" : "#e4f1d6"} 
            stroke={viewMode === 'Globe' ? "#2d5a35" : "#c4d9b0"} 
            strokeWidth="1"
            className="transition-colors duration-700"
          >
            {/* 
              In a full version, we'd include the standard SVG World Map path here. 
              I am using a placeholder for the continental shapes that scales with our projection.
            */}
            <path d="M120,80 L200,60 L280,80 L320,150 L280,250 L200,350 L100,320 L80,200 Z" opacity="0.9" /> {/* Americas approx */}
            <path d="M450,100 L600,80 L800,100 L900,180 L850,300 L700,350 L550,320 L480,200 Z" opacity="0.9" /> {/* Eurasia/Africa approx */}
            <path d="M750,350 L850,330 L900,380 L850,450 L750,420 Z" opacity="0.9" /> {/* Oceania approx */}
          </g>
          
          {/* Shipping Lanes */}
          {showLanes && (
            <g opacity={viewMode === 'Globe' ? "0.3" : "0.5"}>
              {/* Main Corridors */}
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

          {/* KML Overlays */}
          {kmlOverlays.filter(f => f.type === 'LineString').map(f => (
            <path
              key={f.id}
              d={`M ${f.coordinates.map(p => `${projectX(p.lng)},${projectY(p.lat)}`).join(' L ')}`}
              stroke="#8e24aa"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,3"
              opacity="0.8"
              filter="url(#glow)"
            />
          ))}

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

            // Simple clipping for globe view
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

      {/* Map Legend overlay */}
      <div className="absolute bottom-4 left-4 backdrop-blur-md px-4 py-2 rounded-xl flex gap-4 sh border text-[10px] font-bold shadow-sm z-20 bg-white/90">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#ea4335]" /> Critical Risk</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" /> High Risk</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#4285f4]" /> Normal</div>
        {kmlOverlays.length > 0 && (
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#8e24aa]" /> Intel Overlay</div>
        )}
      </div>
    </div>
  );
}

