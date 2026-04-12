
"use client";

import React from 'react';
import { VesselMap } from '@/components/VesselMap';

export default function LiveMapPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-2">
        <h1 className="text-2xl font-bold text-[#202124]">🗺️ Live Vessel Map</h1>
        <p className="text-sm text-[#5f6368]">Real-time AIS tracking — 1,847 vessels active worldwide</p>
      </div>
      <div className="flex-1 p-6 pt-2">
        <div className="h-full border border-border rounded-xl overflow-hidden sh2 relative">
          <VesselMap height={700} />
          
          <div className="absolute bottom-6 right-6 flex flex-col gap-3">
             <div className="bg-white p-4 rounded-xl sh border w-64">
                <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider mb-3">Map Layers</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                    <span className="flex items-center gap-2">🌊 Weather Radar</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  </label>
                  <label className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                    <span className="flex items-center gap-2">⚓ Shipping Lanes</span>
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  </label>
                  <label className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                    <span className="flex items-center gap-2">🚨 Alert Zones</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  </label>
                </div>
             </div>
          </div>

          <div className="absolute top-6 left-6 flex flex-col gap-2">
             <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full sh border flex items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]"><MapIcon className="w-4 h-4" /></div>
                <input placeholder="Jump to vessel/port..." className="bg-transparent border-0 outline-none text-xs px-2 w-48 font-medium" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>
  );
}
