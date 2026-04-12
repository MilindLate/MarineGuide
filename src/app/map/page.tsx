"use client";

import React, { useState } from 'react';
import { VesselMap } from '@/components/VesselMap';
import { Search, Map as MapIcon, Wind, ShieldAlert, X, Activity, Droplets, Thermometer, Info, ChevronRight, LayoutGrid, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Vessel, CRITICAL_ZONES, WEATHER_STATIONS, getRiskColorClass } from '@/lib/maritime-data';
import { Toaster } from '@/components/ui/toaster';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

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
    <div className="h-full flex flex-col bg-[#f8f9fa]">
      <Toaster />
      
      {/* HUD Header */}
      <div className="px-6 py-3 flex items-center justify-between bg-white border-b z-40 sh">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white sh-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#202124] tracking-tight">Ocean Intelligence Navigator</h1>
              <Badge variant="outline" className="text-[9px] h-4 font-bold border-[#4285f4] text-[#1a73e8] uppercase">Live Telemetry</Badge>
            </div>
            <p className="text-[10px] font-bold text-[#5f6368] uppercase tracking-widest opacity-70">Scientific Baseline: April 2026 · AIS-S + Oceanographic Feed</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#f1f3f4] p-1 rounded-xl gap-1">
             <button 
                onClick={() => setViewMode('2D')} 
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2",
                  viewMode === '2D' ? "bg-white text-[#1a73e8] sh-sm" : "text-[#5f6368] hover:bg-white/50"
                )}
              >
                TACTICAL 2D
              </button>
              <button 
                onClick={() => setViewMode('Globe')} 
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2",
                  viewMode === 'Globe' ? "bg-white text-[#1a73e8] sh-sm" : "text-[#5f6368] hover:bg-white/50"
                )}
              >
                ORBITAL GLOBE
              </button>
          </div>

          <Tabs value={activeLayer} onValueChange={(v: any) => setActiveLayer(v)} className="w-[280px]">
            <TabsList className="grid grid-cols-3 h-10 bg-[#f1f3f4] rounded-xl p-1">
              <TabsTrigger value="Standard" className="text-[9px] font-bold uppercase">Standard</TabsTrigger>
              <TabsTrigger value="Temperature" className="text-[9px] font-bold uppercase">Thermal</TabsTrigger>
              <TabsTrigger value="Currents" className="text-[9px] font-bold uppercase">Flow</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Map Container */}
        <div className="flex-1 relative bg-[#f0f2f5] overflow-hidden">
          <VesselMap 
            height="100%" 
            searchQuery={search}
            showWeather={layers.weather}
            showLanes={layers.lanes}
            showAlerts={layers.alerts}
            viewMode={viewMode}
            onVesselSelect={setSelectedVessel}
            oceanLayer={activeLayer}
          />
          
          {/* Scientific Legend HUD */}
          <div className="absolute bottom-6 left-6 z-30">
            <Card className="p-4 bg-white/90 backdrop-blur-xl border border-white/50 sh-sm w-56 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold text-[#9aa0a6] uppercase tracking-widest">
                  {activeLayer === 'Standard' ? 'Tactical Status' : activeLayer === 'Temperature' ? 'Thermal Gradient (°C)' : 'Flow Velocity (kn)'}
                </p>
                <Layers className="w-3 h-3 text-[#9aa0a6]" />
              </div>
              
              <div className="space-y-2">
                {activeLayer === 'Standard' ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2.5 text-[10px] font-bold text-[#202124]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ea4335] status-pulse" /> 
                      CRITICAL RISK (&gt;80)
                    </div>
                    <div className="flex items-center gap-2.5 text-[10px] font-bold text-[#202124]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#fbbc04]" /> 
                      HIGH RISK (60-80)
                    </div>
                    <div className="flex items-center gap-2.5 text-[10px] font-bold text-[#202124]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4285f4]" /> 
                      OPERATIONAL FEED
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className={cn(
                      "h-1.5 w-full rounded-full",
                      activeLayer === 'Temperature' 
                        ? "bg-gradient-to-r from-blue-600 via-green-400 via-yellow-400 to-red-600" 
                        : "bg-gradient-to-r from-slate-100 via-blue-400 to-blue-900"
                    )} />
                    <div className="flex justify-between text-[8px] font-bold text-[#9aa0a6] tracking-tighter">
                      <span>{activeLayer === 'Temperature' ? '12.0°C' : '0.15 kn'}</span>
                      <span>{activeLayer === 'Temperature' ? '34.5°C' : '5.20 kn'}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Controls HUD */}
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-30">
             <div className="bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl sh-sm border border-white/50 flex flex-col gap-1">
                <button 
                  onClick={() => toggleLayer('weather')} 
                  className={cn(
                    "p-2.5 rounded-xl transition-all group relative", 
                    layers.weather ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50"
                  )}
                  title="Atmospheric Conditions"
                >
                  <Wind className="w-5 h-5" />
                  {layers.weather && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#1a73e8] rounded-full" />}
                </button>
                <button 
                  onClick={() => toggleLayer('lanes')} 
                  className={cn(
                    "p-2.5 rounded-xl transition-all group relative", 
                    layers.lanes ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50"
                  )}
                  title="Trade Corridor Network"
                >
                  <MapIcon className="w-5 h-5" />
                  {layers.lanes && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#1a73e8] rounded-full" />}
                </button>
                <button 
                  onClick={() => toggleLayer('alerts')} 
                  className={cn(
                    "p-2.5 rounded-xl transition-all group relative", 
                    layers.alerts ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50"
                  )}
                  title="Geopolitical Conflict Zones"
                >
                  <ShieldAlert className="w-5 h-5" />
                  {layers.alerts && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#1a73e8] rounded-full" />}
                </button>
             </div>
             
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9aa0a6] group-focus-within:text-[#1a73e8] transition-colors" />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ID SEARCH..." 
                  className="pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl text-[10px] font-bold w-44 outline-none focus:ring-2 focus:ring-[#1a73e8]/30 sh-sm transition-all" 
                />
             </div>
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="w-[340px] shrink-0 border-l bg-white flex flex-col gap-4 overflow-y-auto p-5 custom-scrollbar z-20">
          {selectedVessel ? (
            <Card className="p-0 border-[#c5d9fd] bg-white space-y-0 sh-sm animate-in slide-in-from-right-4 overflow-hidden rounded-2xl">
              <div className="p-4 border-b bg-[#f8f9fa] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-white border flex items-center justify-center text-xl sh-sm shadow-inner">{selectedVessel.emoji}</div>
                  <div>
                    <h3 className="text-[13px] font-bold text-[#202124] tracking-tight">{selectedVessel.name}</h3>
                    <p className="text-[9px] text-[#1a73e8] font-bold uppercase tracking-widest">{selectedVessel.type} · MMSI {selectedVessel.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVessel(null)} className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400"><X className="w-4 h-4" /></button>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest"><Activity className="w-2.5 h-2.5" /> Speed</div>
                    <p className="text-xs font-bold text-slate-900">{selectedVessel.speed}</p>
                  </div>
                  <div className={cn("p-3 rounded-xl border space-y-1", getRiskColorClass(selectedVessel.riskScore))}>
                    <div className="flex items-center gap-1.5 text-[8px] font-bold opacity-60 uppercase tracking-widest"><ShieldAlert className="w-2.5 h-2.5" /> Risk Index</div>
                    <p className="text-xs font-bold">{selectedVessel.riskScore}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[9px] font-bold text-[#9aa0a6] uppercase tracking-widest">Scientific Telemetry</h4>
                    <Badge variant="secondary" className="text-[7px] h-3 px-1 font-bold">Real-time</Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between p-2.5 bg-[#f8f9fa] rounded-xl border">
                       <div className="flex items-center gap-2">
                         <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                         <span className="text-[10px] font-bold text-slate-600">Ambient SST</span>
                       </div>
                       <span className="text-[10px] font-bold text-slate-900">24.8°C</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-[#f8f9fa] rounded-xl border">
                       <div className="flex items-center gap-2">
                         <Droplets className="w-3.5 h-3.5 text-blue-500" />
                         <span className="text-[10px] font-bold text-slate-600">Local Depth</span>
                       </div>
                       <span className="text-[10px] font-bold text-slate-900">2,410m</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t">
                  <h4 className="text-[9px] font-bold text-[#9aa0a6] uppercase tracking-widest">Mission Logistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Destination</span>
                      <span className="text-[11px] font-bold text-slate-900">{selectedVessel.destination}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">ETA Projection</span>
                      <span className="text-[11px] font-bold text-slate-900">{selectedVessel.eta}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-[#1a73e8] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#1669d6] transition-all sh-sm flex items-center justify-center gap-2">
                  Generate Mission Report <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed p-10 text-center space-y-4 opacity-70">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-200">
                <LayoutGrid className="w-7 h-7 text-slate-300" />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-900 uppercase">Telemetry Standby</p>
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed">Select an active AIS node on the tactical map to extract multi-layer intelligence.</p>
              </div>
            </div>
          )}

          {/* Meteorological Stations HUD */}
          <div className="bg-white rounded-2xl border sh-sm p-5 space-y-4">
             <div className="flex items-center justify-between">
               <h3 className="text-[10px] font-bold text-[#202124] uppercase tracking-widest flex items-center gap-2">
                 <Wind className="w-3.5 h-3.5 text-[#1a73e8]" /> Met Stations
               </h3>
               <span className="text-[8px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">SYNCED</span>
             </div>
            <div className="space-y-2.5">
              {WEATHER_STATIONS.map(station => (
                <div key={station.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 transition-all cursor-pointer group active:scale-[0.98]">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-slate-900 group-hover:text-[#1a73e8] transition-colors">{station.location}</span>
                    <span className="text-[10px] font-bold text-[#1a73e8] bg-white px-2 py-0.5 rounded-lg border">{station.temp}</span>
                  </div>
                  <div className="flex gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                    <div className="flex items-center gap-1"><Wind className="w-3 h-3 text-[#1a73e8] opacity-60" /> {station.wind}</div>
                    <div className="flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400 opacity-60" /> {station.waves}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conflict Zones HUD */}
          <div className="bg-white rounded-2xl border sh-sm p-5 space-y-4">
            <h3 className="text-[10px] font-bold text-[#ea4335] uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" /> Warning Zones
            </h3>
            <div className="space-y-2">
              {CRITICAL_ZONES.map(zone => (
                <div key={zone.id} className="p-3.5 bg-[#fce8e6]/30 border border-[#f5c6c2]/30 rounded-xl space-y-1.5 group cursor-default">
                  <div className="flex justify-between items-center">
                     <span className="text-[11px] font-bold text-[#c5221f]">{zone.name}</span>
                     <Badge className="bg-[#ea4335] text-white text-[8px] h-4 font-bold">LVL 5</Badge>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium leading-relaxed opacity-80">{zone.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
