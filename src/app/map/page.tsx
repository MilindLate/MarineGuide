"use client";

import React, { useState } from 'react';
import { VesselMap } from '@/components/VesselMap';
import { Search, Map as MapIcon, Wind, ShieldAlert, Globe, Ship, Navigation, Gauge, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Vessel, CRITICAL_ZONES, WEATHER_STATIONS, getRiskColorClass } from '@/lib/maritime-data';
import { Toaster } from '@/components/ui/toaster';
import { Card } from '@/components/ui/card';

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
      <Toaster />
      
      <div className="p-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#202124]">🗺️ Global Intelligence Map</h1>
            <p className="text-sm text-[#5f6368]">Real-time AIS tracking & Geopolitical Risk Zones</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white p-1 rounded-full border sh h-10 items-center">
            <button onClick={() => setViewMode('2D')} className={cn("px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all", viewMode === '2D' ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-[#5f6368] hover:bg-[#f8f9fa]")}>
              <MapIcon className="w-3.5 h-3.5" /> 2D
            </button>
            <button onClick={() => setViewMode('Globe')} className={cn("px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all", viewMode === 'Globe' ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-[#5f6368] hover:bg-[#f8f9fa]")}>
              <Globe className="w-3.5 h-3.5" /> Globe
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vessel or zone..." 
              className="pl-10 pr-4 py-2.5 bg-white border rounded-full text-sm w-64 outline-none focus:ring-2 focus:ring-[#4285f4]/20 focus:border-[#4285f4] transition-all sh" 
            />
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 pt-2 flex gap-6 overflow-hidden">
        <div className="flex-1 border border-border rounded-2xl overflow-hidden sh2 relative bg-white">
          <VesselMap 
            height={800} 
            searchQuery={search}
            showWeather={layers.weather}
            showLanes={layers.lanes}
            showAlerts={layers.alerts}
            viewMode={viewMode}
            onVesselSelect={setSelectedVessel}
          />
          
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-30">
             <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl sh border flex flex-col gap-1">
                <button onClick={() => toggleLayer('weather')} className={cn("p-2.5 rounded-xl transition-all", layers.weather ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50")} title="Weather Radar"><Wind className="w-5 h-5" /></button>
                <button onClick={() => toggleLayer('lanes')} className={cn("p-2.5 rounded-xl transition-all", layers.lanes ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50")} title="Shipping Lanes"><MapIcon className="w-5 h-5" /></button>
                <button onClick={() => toggleLayer('alerts')} className={cn("p-2.5 rounded-xl transition-all", layers.alerts ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50")} title="Alert Zones"><ShieldAlert className="w-5 h-5" /></button>
             </div>
          </div>
        </div>

        <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {selectedVessel ? (
            <Card className="p-5 border-blue-200 bg-white space-y-4 sh animate-in slide-in-from-right-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#f8f9fa] border flex items-center justify-center text-xl sh">{selectedVessel.emoji}</div>
                  <div>
                    <h3 className="text-sm font-bold text-[#202124]">{selectedVessel.name}</h3>
                    <p className="text-[10px] text-[#5f6368] font-bold uppercase tracking-wider">{selectedVessel.type}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVessel(null)} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X className="w-4 h-4 text-slate-400" /></button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase"><Gauge className="w-3 h-3" /> Speed</div>
                  <p className="text-xs font-bold text-slate-900">{selectedVessel.speed}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase"><Navigation className="w-3 h-3" /> Destination</div>
                  <p className="text-xs font-bold text-slate-900 truncate">{selectedVessel.destination}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase"><Clock className="w-3 h-3" /> ETA</div>
                  <p className="text-xs font-bold text-slate-900">{selectedVessel.eta}</p>
                </div>
                <div className={cn("p-2.5 rounded-xl border space-y-1", getRiskColorClass(selectedVessel.riskScore))}>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold opacity-60 uppercase"><ShieldAlert className="w-3 h-3" /> Risk Score</div>
                  <p className="text-xs font-bold">{selectedVessel.riskScore}</p>
                </div>
              </div>
              <button className="w-full py-2 bg-[#4285f4] text-white rounded-full font-bold text-xs hover:bg-[#1a73e8] transition-all sh">Open Intelligence Report ↗</button>
            </Card>
          ) : (
            <div className="bg-white rounded-2xl border sh p-5 text-center space-y-2 opacity-60">
              <Ship className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-400">Select a vessel on the map to view real-time intelligence</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border sh p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider">Live Weather</h3>
            <div className="space-y-3">
              {WEATHER_STATIONS.map(station => (
                <div key={station.id} className="p-3 bg-slate-50 border rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-900">{station.location}</span>
                    <span className="text-[11px] font-bold text-[#1a73e8]">{station.temp}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-500 uppercase">
                    <div className="flex items-center gap-1"><Wind className="w-3 h-3" /> {station.wind}</div>
                    <div className="flex items-center gap-1">🌊 {station.waves}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border sh p-5 space-y-3">
            <h3 className="text-xs font-bold text-[#ea4335] uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> Risk Zones
            </h3>
            {CRITICAL_ZONES.map(zone => (
              <div key={zone.id} className="p-3 bg-[#fce8e6]/30 border border-[#f5c6c2]/50 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-bold text-[#c5221f]">{zone.name}</span>
                   <span className="text-[9px] font-bold text-[#ea4335] bg-white px-1.5 py-0.5 rounded border border-[#f5c6c2]">CRITICAL</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed">{zone.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
