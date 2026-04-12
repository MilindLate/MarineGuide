"use client";

import React, { useState } from 'react';
import { VesselMap } from '@/components/VesselMap';
import { Search, Map as MapIcon, Layers, Wind, Bell, Navigation, ShieldAlert, Thermometer, Waves, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Vessel, CRITICAL_ZONES, WEATHER_STATIONS } from '@/lib/maritime-data';

export default function LiveMapPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<'2D' | 'Globe'>('2D');
  const [layers, setLayers] = useState({
    weather: true,
    lanes: true,
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
          <h1 className="text-2xl font-bold text-[#202124]">🗺️ Global Intelligence Map</h1>
          <p className="text-sm text-[#5f6368]">Real-time AIS tracking & Geopolitical Risk Zones</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1 rounded-full border sh h-10 items-center">
            <button 
              onClick={() => setViewMode('2D')}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all",
                viewMode === '2D' ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-[#5f6368] hover:bg-[#f8f9fa]"
              )}
            >
              <MapIcon className="w-3.5 h-3.5" /> 2D
            </button>
            <button 
              onClick={() => setViewMode('Globe')}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all",
                viewMode === 'Globe' ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-[#5f6368] hover:bg-[#f8f9fa]"
              )}
            >
              <Globe className="w-3.5 h-3.5" /> Globe
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6] group-focus-within:text-[#4285f4] transition-colors" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vessel, port, or zone..." 
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
            viewMode={viewMode}
            onVesselSelect={setSelectedVessel}
          />
          
          {/* Layer Controls Floating Panel */}
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-30">
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
                  <ShieldAlert className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar Info Panel */}
        <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {/* Vessel/Zone Details */}
          <div className="bg-white rounded-2xl border sh p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider">Focus Intelligence</h3>
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Risk</p>
                    <p className={cn("text-xs font-bold", selectedVessel.riskScore > 80 ? "text-red-600" : "text-blue-600")}>
                      {selectedVessel.riskScore} / 100
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Destination</p>
                    <p className="text-xs font-bold text-slate-700">{selectedVessel.destination}</p>
                    <p className="text-[10px] text-slate-400 mt-1">ETA: {selectedVessel.eta}</p>
                </div>
                <button className="w-full py-2.5 bg-[#4285f4] text-white rounded-xl font-bold text-xs hover:bg-[#1a73e8] transition-all shadow-sm">
                  Full Vessel Report
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3 border-dashed border-2 rounded-xl">
                <MapIcon className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-[11px] font-medium text-slate-400 px-4">Select a vessel or zone for analysis</p>
              </div>
            )}
          </div>

          {/* Critical Zones Summary */}
          <div className="bg-white rounded-2xl border sh p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-3 h-3 text-[#ea4335]" /> Critical Risk Zones
            </h3>
            {CRITICAL_ZONES.map(zone => (
              <div key={zone.id} className="p-3 bg-[#fce8e6]/30 border border-[#f5c6c2]/50 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-[#c5221f]">{zone.name}</span>
                   <span className="text-[9px] font-bold text-[#ea4335] bg-white px-1.5 py-0.5 rounded border border-[#f5c6c2]">{zone.riskLevel}</span>
                </div>
                <p className="text-[10px] text-slate-600">{zone.reason}</p>
              </div>
            ))}
          </div>

          {/* Weather Conditions Dashboard */}
          <div className="bg-white rounded-2xl border sh p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider flex items-center gap-2">
              <Wind className="w-3 h-3 text-[#1a73e8]" /> Live Weather Stations
            </h3>
            <div className="space-y-3">
              {WEATHER_STATIONS.map(station => (
                <div key={station.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5 mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700">{station.location}</span>
                    <Thermometer className="w-3 h-3 text-[#fbbc04]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-2.5 h-2.5 text-slate-400" />
                      <span className="text-[10px] font-medium text-slate-600">{station.wind}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Waves className="w-2.5 h-2.5 text-slate-400" />
                      <span className="text-[10px] font-medium text-slate-600">{station.waves}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
