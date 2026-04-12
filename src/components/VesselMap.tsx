
"use client";

import React from 'react';
import { VESSELS, getRiskLevel } from '@/lib/maritime-data';

export function VesselMap({ height = 320 }: { height?: number }) {
  return (
    <div className="relative bg-[#cce5f5] rounded-lg overflow-hidden sh border border-blue-100" style={{ height }}>
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
        
        {/* Shipping Lanes */}
        <path d="M100,200 C300,180 700,220 900,250" stroke="#4285f4" strokeWidth="12" fill="none" opacity="0.1" />
        <path d="M200,400 C400,380 600,420 800,350" stroke="#4285f4" strokeWidth="12" fill="none" opacity="0.1" />
        
        {/* Animated Routes */}
        <path 
          d="M100,200 C300,180 700,220 900,250" 
          stroke="#4285f4" 
          strokeWidth="1.5" 
          fill="none" 
          strokeDasharray="5,5"
        >
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="10s" repeatCount="indefinite" />
        </path>
        <path 
          d="M200,400 C400,380 600,420 800,350" 
          stroke="#ea4335" 
          strokeWidth="1.5" 
          fill="none" 
          strokeDasharray="5,5"
        >
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="8s" repeatCount="indefinite" />
        </path>

        {/* Vessel Markers */}
        {VESSELS.map((v, i) => {
          const riskLevel = getRiskLevel(v.riskScore);
          const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#4285f4');
          
          // Simplified placement
          const x = (v.lng || 0) * 2 + 500;
          const y = (v.lat || 0) * -2 + 250;

          return (
            <g key={v.id} className="cursor-pointer group">
              <circle cx={x} cy={y} r="10" className="animate-pulse-ring" fill={color} />
              {riskLevel === 'Critical' && <circle cx={x} cy={y} r="15" className="animate-pulse-ring" style={{ animationDelay: '1s' }} fill={color} />}
              <circle cx={x} cy={y} r="4" fill={color} stroke="white" strokeWidth="1" />
              
              {/* Tooltip (Simplified) */}
              {(v.riskScore > 60) && (
                <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <rect x={x + 10} y={y - 15} width="80" height="24" rx="12" fill="white" className="sh" />
                  <text x={x + 18} y={y + 1} fontSize="10" fontWeight="700" fill="#202124">{v.name}</text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center sh font-bold text-[#5f6368] hover:bg-gray-50">+</button>
        <button className="w-8 h-8 bg-white rounded-lg flex items-center justify-center sh font-bold text-[#5f6368] hover:bg-gray-50">−</button>
      </div>

      {/* Map Overlay Toggles */}
      <div className="absolute top-4 left-4 flex gap-2">
        <button className="px-3 py-1.5 bg-white rounded-full text-xs font-medium sh flex items-center gap-1.5 hover:bg-gray-50 border border-blue-500 text-blue-600">
          🌊 Weather
        </button>
        <button className="px-3 py-1.5 bg-white rounded-full text-xs font-medium sh flex items-center gap-1.5 hover:bg-gray-50">
          ⚓ Lanes
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full flex gap-3 sh text-[10px] font-bold">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#ea4335]" /> Critical</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#fbbc04]" /> High</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#4285f4]" /> Med</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#34a853]" /> Low</div>
      </div>
    </div>
  );
}
