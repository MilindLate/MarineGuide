
"use client";

import React, { useState } from 'react';
import { VesselMap } from '@/components/VesselMap';
import { Search, Map as MapIcon, Layers, Wind, Bell, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Vessel } from '@/lib/maritime-data';

export default function LiveMapPage() {
  const [search, setSearch] = useState("");
  const [layers, setLayers] = useState({
    weather: true,
    lanes: false,
    alerts: true
  });
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa]">
      {/* Header with Search */}
      <div className="p-6 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#202124]">🗺️ Live Vessel Map</h1>
          <p className="text-sm text-[#5f6368]">Real-time AIS tracking — 1,847 vessels active worldwide</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6] group-focus-within:text-[#4285f4] transition-colors" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vessel or port..." 
              className="pl-10 pr-4 py-2.5 bg-white border rounded-full text-sm w-72 outline-none focus:ring-2 focus:ring-[#4285f4]/20 focus:border-[#4285f4] transition-all sh" 
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 pt-2 flex gap-6 overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 border border-border rounded-2xl overflow-hidden sh2 relative bg-white">
          <VesselMap 
            height={1000} 
            searchQuery={search}
            showWeather={layers.weather}
            showLanes={layers.lanes}
            showAlerts={layers.alerts}
            onVesselSelect={setSelectedVessel}
          />
          
          {/* Layer Controls Floating Panel */}
          <div className="absolute top-6 left-6 flex flex-col gap-3">
             <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl sh border flex flex-col gap-1">
                <button 
                  onClick={() => toggleLayer('weather')}
                  className={cn(
                    "p-2.5 rounded-xl flex items-center justify-center transition-all",
                    layers.weather ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50"
                  )}
                  title="Weather Radar"
                >
                  <Wind className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => toggleLayer('lanes')}
                  className={cn(
                    "p-2.5 rounded-xl flex items-center justify-center transition-all",
                    layers.lanes ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50"
                  )}
                  title="Shipping Lanes"
                >
                  <Navigation className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => toggleLayer('alerts')}
                  className={cn(
                    "p-2.5 rounded-xl flex items-center justify-center transition-all",
                    layers.alerts ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50"
                  )}
                  title="Alert Zones"
                >
                  <Bell className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="w-80 shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border sh p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider">Vessel Details</h3>
            {selectedVessel ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-3xl">{selectedVessel.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedVessel.name}</p>
                    <p className="text-[11px] font-medium text-slate-500">{selectedVessel.type}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Status</p>
                    <p className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Speed</p>
                    <p className="text-xs font-bold text-slate-900">{selectedVessel.speed}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Destination</p>
                    <p className="text-xs font-bold text-slate-900">{selectedVessel.destination}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">ETA</p>
                    <p className="text-xs font-bold text-slate-900">{selectedVessel.eta}</p>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-[#4285f4] text-white rounded-xl font-bold text-xs hover:bg-[#1a73e8] transition-all shadow-sm">
                  Full Vessel Report
                </button>
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <MapIcon className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-slate-400 px-4">Select a vessel on the map to view real-time intelligence</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border sh p-5 space-y-3 flex-1 overflow-y-auto">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider">Nearby Ports</h3>
            {['Shanghai', 'Singapore', 'Busan'].map(port => (
              <div key={port} className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#4285f4] transition-colors">⚓</div>
                  <span className="text-xs font-bold text-slate-700">{port}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">2.4nm</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
