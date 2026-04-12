
"use client";

import React, { useState } from 'react';
import { VesselMap } from '@/components/VesselMap';
import { Search, Map as MapIcon, Wind, ShieldAlert, Globe, Ship, Navigation, Gauge, Clock, X, Info, Activity, Droplets, Thermometer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Vessel, CRITICAL_ZONES, WEATHER_STATIONS, getRiskColorClass } from '@/lib/maritime-data';
import { Toaster } from '@/components/ui/toaster';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LiveMapPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<'2D' | 'Globe'>('2D');
  const [activeLayer, setActiveLayer] = useState<'Standard' | 'Temperature' | 'Currents'>('Standard');
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
    <div className="h-full flex flex-col bg-[#f0f2f5]">
      <Toaster />
      
      <div className="px-6 py-4 flex items-center justify-between bg-white border-b sh-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#1a73e8] flex items-center justify-center text-white sh">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#202124] tracking-tight">Ocean Intelligence Navigator</h1>
            <p className="text-[11px] font-bold text-[#5f6368] uppercase tracking-wider">Scientific Baseline: April 2026 · Real-time AIS + Oceanographic Feed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Tabs value={activeLayer} onValueChange={(v: any) => setActiveLayer(v)} className="w-[300px]">
            <TabsList className="grid grid-cols-3 h-9 bg-[#f1f3f4]">
              <TabsTrigger value="Standard" className="text-[10px] font-bold">Base</TabsTrigger>
              <TabsTrigger value="Temperature" className="text-[10px] font-bold">SST</TabsTrigger>
              <TabsTrigger value="Currents" className="text-[10px] font-bold">Currents</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex bg-[#f1f3f4] p-1 rounded-lg h-9 items-center">
            <button onClick={() => setViewMode('2D')} className={cn("px-4 h-7 rounded-md text-[10px] font-bold flex items-center gap-2 transition-all", viewMode === '2D' ? "bg-white text-[#1a73e8] sh-sm" : "text-[#5f6368]")}>
              2D
            </button>
            <button onClick={() => setViewMode('Globe')} className={cn("px-4 h-7 rounded-md text-[10px] font-bold flex items-center gap-2 transition-all", viewMode === 'Globe' ? "bg-white text-[#1a73e8] sh-sm" : "text-[#5f6368]")}>
              Globe
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 flex gap-4 overflow-hidden">
        <div className="flex-1 border border-border rounded-xl overflow-hidden sh relative bg-white">
          <VesselMap 
            height={800} 
            searchQuery={search}
            showWeather={layers.weather}
            showLanes={layers.lanes}
            showAlerts={layers.alerts}
            viewMode={viewMode}
            onVesselSelect={setSelectedVessel}
            oceanLayer={activeLayer}
          />
          
          {/* Legend */}
          <div className="absolute bottom-6 right-6 z-30">
            <Card className="p-3 bg-white/90 backdrop-blur-md border border-border sh-sm w-48 space-y-2">
              <p className="text-[9px] font-bold text-[#9aa0a6] uppercase tracking-wider">
                {activeLayer === 'Standard' ? 'Vessel Risk Status' : activeLayer === 'Temperature' ? 'Sea Surface Temp (°C)' : 'Current Velocity (kn)'}
              </p>
              <div className="space-y-1.5">
                {activeLayer === 'Standard' ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700"><div className="w-2.5 h-2.5 rounded-full bg-[#ea4335]" /> Critical Risk (>80)</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700"><div className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" /> High Risk (60-80)</div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-700"><div className="w-2.5 h-2.5 rounded-full bg-[#4285f4]" /> Operational</div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="h-2 w-full rounded-full bg-gradient-to-r from-blue-600 via-green-400 to-red-500" />
                    <div className="flex justify-between text-[8px] font-bold text-[#9aa0a6]">
                      <span>{activeLayer === 'Temperature' ? '12°C' : '0.2kn'}</span>
                      <span>{activeLayer === 'Temperature' ? '32°C' : '4.5kn'}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="absolute top-6 left-6 flex flex-col gap-3 z-30">
             <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl sh border flex flex-col gap-1">
                <button onClick={() => toggleLayer('weather')} className={cn("p-2 rounded-lg transition-all", layers.weather ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50")} title="Atmospheric Layers"><Wind className="w-5 h-5" /></button>
                <button onClick={() => toggleLayer('lanes')} className={cn("p-2 rounded-lg transition-all", layers.lanes ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50")} title="Route Network"><MapIcon className="w-5 h-5" /></button>
                <button onClick={() => toggleLayer('alerts')} className={cn("p-2 rounded-lg transition-all", layers.alerts ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50")} title="Geopolitical Alert Zones"><ShieldAlert className="w-5 h-5" /></button>
             </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9aa0a6]" />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ID Search..." 
                  className="pl-9 pr-4 py-2 bg-white border rounded-xl text-[11px] font-bold w-40 outline-none focus:ring-2 focus:ring-[#4285f4]/20 sh-sm" 
                />
             </div>
          </div>
        </div>

        <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {selectedVessel ? (
            <Card className="p-0 border-blue-200 bg-white space-y-0 sh animate-in slide-in-from-right-4 overflow-hidden">
              <div className="p-4 border-b bg-[#f8f9fa] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-xl sh-sm">{selectedVessel.emoji}</div>
                  <div>
                    <h3 className="text-sm font-bold text-[#202124]">{selectedVessel.name}</h3>
                    <p className="text-[9px] text-[#1a73e8] font-bold uppercase tracking-widest">{selectedVessel.type} · {selectedVessel.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVessel(null)} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><X className="w-4 h-4 text-slate-400" /></button>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-tighter"><Gauge className="w-2.5 h-2.5" /> SOG</div>
                    <p className="text-xs font-bold text-slate-900">{selectedVessel.speed}</p>
                  </div>
                  <div className={cn("p-2.5 rounded-lg border space-y-0.5", getRiskColorClass(selectedVessel.riskScore))}>
                    <div className="flex items-center gap-1.5 text-[8px] font-bold opacity-60 uppercase tracking-tighter"><ShieldAlert className="w-2.5 h-2.5" /> Risk Index</div>
                    <p className="text-xs font-bold">{selectedVessel.riskScore}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-[9px] font-bold text-[#9aa0a6] uppercase tracking-widest">Oceanographic Profile</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between p-2 bg-[#f8f9fa] rounded-lg border">
                       <div className="flex items-center gap-2">
                         <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                         <span className="text-[10px] font-bold text-slate-600">SST</span>
                       </div>
                       <span className="text-[10px] font-bold text-slate-900">24.8°C</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#f8f9fa] rounded-lg border">
                       <div className="flex items-center gap-2">
                         <Droplets className="w-3.5 h-3.5 text-blue-500" />
                         <span className="text-[10px] font-bold text-slate-600">Bathymetry</span>
                       </div>
                       <span className="text-[10px] font-bold text-slate-900">2,410m</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <h4 className="text-[9px] font-bold text-[#9aa0a6] uppercase tracking-widest">Tactical Logistics</h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Destination</span>
                      <span className="font-bold text-slate-900">{selectedVessel.destination}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">ETA Projection</span>
                      <span className="font-bold text-slate-900">{selectedVessel.eta}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-[#1a73e8] text-white rounded-lg font-bold text-[11px] hover:bg-[#1669d6] transition-all sh-sm flex items-center justify-center gap-2">
                  Full Ocean Navigator Report <Activity className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ) : (
            <div className="bg-white rounded-xl border sh p-8 text-center space-y-3 opacity-80">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-dashed">
                <Ship className="w-6 h-6 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-900">Telemetry Standby</p>
                <p className="text-[10px] font-medium text-slate-400">Select an active AIS node on the interactive baseline to extract deep oceanographic data.</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border sh p-5 space-y-4">
             <div className="flex items-center justify-between">
               <h3 className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-wider">Meteorological Stations</h3>
               <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">ACTIVE</span>
             </div>
            <div className="space-y-2.5">
              {WEATHER_STATIONS.map(station => (
                <div key={station.id} className="p-3 bg-slate-50 border rounded-lg hover:border-blue-200 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-slate-900 group-hover:text-[#1a73e8]">{station.location}</span>
                    <span className="text-[10px] font-bold text-[#1a73e8]">{station.temp}</span>
                  </div>
                  <div className="flex gap-4 text-[9px] font-bold text-slate-500 uppercase">
                    <div className="flex items-center gap-1"><Wind className="w-3 h-3 text-[#1a73e8]" /> {station.wind}</div>
                    <div className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400" /> {station.waves}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border sh p-5 space-y-3">
            <h3 className="text-[10px] font-bold text-[#ea4335] uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> Maritime Warning Zones
            </h3>
            <div className="space-y-2">
              {CRITICAL_ZONES.map(zone => (
                <div key={zone.id} className="p-3 bg-[#fce8e6]/30 border border-[#f5c6c2]/40 rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                     <span className="text-[11px] font-bold text-[#c5221f]">{zone.name}</span>
                     <span className="text-[8px] font-bold text-[#ea4335] bg-white px-1.5 py-0.5 rounded border border-[#f5c6c2]">LVL 5</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium leading-relaxed">{zone.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
