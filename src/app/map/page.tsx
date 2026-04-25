"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { VesselMap } from '@/components/VesselMap';
import { Search, ShieldAlert, X, Activity, ChevronRight, LayoutGrid, Anchor, Layers, MapPin, Thermometer, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Vessel, ALL_RISK_ZONES, getRiskColorClass } from '@/lib/maritime-data';
import { Toaster } from '@/components/ui/toaster';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation';

function MapContent() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('search') || "";
  
  const [search, setSearch] = useState(urlQuery);
  const [viewMode, setViewMode] = useState<'2D' | 'Globe'>('2D');
  const [riskMode, setRiskMode] = useState<'Standard' | 'Geopolitical' | 'Weather'>('Standard');
  const [layers, setLayers] = useState({ alerts: true, ports: false, sst: false, flow: false });
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);

  useEffect(() => {
    setSearch(urlQuery);
  }, [urlQuery]);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const displayedRiskZones = useMemo(() => {
    if (riskMode === 'Standard') return ALL_RISK_ZONES.filter(z => z.riskLevel === 'Critical');
    return ALL_RISK_ZONES.filter(z => z.category === riskMode);
  }, [riskMode]);

  const handleHazardClick = (zone: any) => {
    setMapCenter([zone.lat, zone.lng]);
  };

  return (
    <div className="h-full flex flex-col bg-slate-100">
      <Toaster />
      
      <div className="px-6 py-3 flex items-center justify-between bg-white border-b border-slate-200 z-40 sh">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white sh-sm shadow-[0_0_15px_rgba(26,115,232,0.1)]">
            <Activity className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase">Tactical Fleet Navigator</h1>
              <Badge className="text-[9px] h-4 font-black bg-[#34a853] text-white border-none uppercase tracking-widest status-pulse">Live AIS-S</Badge>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Marine Intelligence Grid · 2026</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-50 p-1 rounded-xl gap-1 border border-slate-200">
             <button onClick={() => setViewMode('2D')} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest", viewMode === '2D' ? "bg-white text-[#1a73e8] sh-sm" : "text-slate-400 hover:text-slate-600")}>Tactical 2D</button>
             <button onClick={() => setViewMode('Globe')} className={cn("px-4 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase tracking-widest", viewMode === 'Globe' ? "bg-white text-[#1a73e8] sh-sm" : "text-slate-400 hover:text-slate-600")}>Orbital Globe</button>
          </div>

          <Tabs value={riskMode} onValueChange={(v: any) => setRiskMode(v)} className="w-[340px]">
            <TabsList className="grid grid-cols-3 h-10 bg-slate-50 rounded-xl p-1 border border-slate-200">
              <TabsTrigger value="Standard" className="text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900">Tactical</TabsTrigger>
              <TabsTrigger value="Geopolitical" className="text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900">Political</TabsTrigger>
              <TabsTrigger value="Weather" className="text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900">Weather</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 relative bg-slate-50 overflow-hidden">
          <VesselMap 
            height="100%" 
            searchQuery={search}
            showAlerts={layers.alerts}
            showPorts={layers.ports}
            showSST={layers.sst}
            showFlow={layers.flow}
            viewMode={viewMode}
            onVesselSelect={setSelectedVessel}
            riskMode={riskMode}
            center={mapCenter}
          />
          
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-[1000]">
             <div className="bg-white/90 backdrop-blur-xl p-1.5 rounded-2xl sh2 border border-slate-200 flex flex-col gap-1">
                <button 
                  onClick={() => toggleLayer('alerts')} 
                  className={cn("p-2.5 rounded-xl transition-all group relative flex items-center gap-2", layers.alerts ? "bg-[#ea4335]/10 text-[#ea4335]" : "text-slate-400 hover:text-slate-600")} 
                >
                  <ShieldAlert className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-tight pr-2">Disruptions</span>
                </button>
                <button 
                  onClick={() => toggleLayer('ports')} 
                  className={cn("p-2.5 rounded-xl transition-all group relative flex items-center gap-2", layers.ports ? "bg-[#34a853]/10 text-[#34a853]" : "text-slate-400 hover:text-slate-600")} 
                >
                  <Anchor className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-tight pr-2">Port Nodes</span>
                </button>
                <div className="h-px bg-slate-200 mx-2" />
                <button 
                  onClick={() => toggleLayer('sst')} 
                  className={cn("p-2.5 rounded-xl transition-all group relative flex items-center gap-2", layers.sst ? "bg-[#fbbc04]/10 text-[#fbbc04]" : "text-slate-400 hover:text-slate-600")} 
                >
                  <Thermometer className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-tight pr-2">SST Data</span>
                </button>
                <button 
                  onClick={() => toggleLayer('flow')} 
                  className={cn("p-2.5 rounded-xl transition-all group relative flex items-center gap-2", layers.flow ? "bg-[#4285f4]/10 text-[#4285f4]" : "text-slate-400 hover:text-slate-600")} 
                >
                  <Wind className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-tight pr-2">Flow Field</span>
                </button>
             </div>
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  placeholder="IDENTIFY NODE..." 
                  className="pl-10 pr-4 py-3 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl text-[10px] font-black w-56 outline-none sh2 transition-all uppercase tracking-widest focus:ring-2 focus:ring-[#1a73e8]/30 text-slate-900" 
                />
             </div>
          </div>

          <div className="absolute bottom-8 left-6 z-[1000] bg-white/95 backdrop-blur-xl p-5 rounded-[24px] sh2 border border-slate-200 w-64 shadow-[0_0_40px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tactical Legend</span>
              <Layers className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#ea4335] shadow-[0_0_10px_rgba(234,67,53,0.3)]" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Critical (RI 80+)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#fbbc04] shadow-[0_0_10px_rgba(251,188,4,0.3)]" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">High Risk (60-80)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#4285f4] shadow-[0_0_10px_rgba(66,133,244,0.3)]" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Standard Mission</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-[#34a853] shadow-[0_0_10px_rgba(52,168,83,0.3)]" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Port Hub</span>
              </div>
            </div>
          </div>

          <div className="absolute top-6 right-6 bottom-6 w-[360px] z-[1000] flex flex-col gap-4 overflow-y-auto p-1 custom-scrollbar">
            {selectedVessel ? (
              <Card className="shrink-0 p-0 border-slate-200 bg-white/95 backdrop-blur-xl space-y-0 sh2 animate-in slide-in-from-right-8 overflow-hidden rounded-2xl">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl sh-sm shadow-inner">{selectedVessel.emoji}</div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-black text-slate-900 tracking-tight truncate uppercase">{selectedVessel.name}</h3>
                      <p className="text-[10px] text-[#1a73e8] font-black uppercase tracking-widest">IMO {selectedVessel.imo}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedVessel(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest"><Activity className="w-3 h-3" /> Velocity</div>
                      <p className="text-sm font-black text-slate-900">{selectedVessel.speed}</p>
                    </div>
                    <div className={cn("p-3.5 rounded-xl border space-y-1 shadow-sm", getRiskColorClass(selectedVessel.riskScore))}>
                      <div className="flex items-center gap-1.5 text-[8px] font-black opacity-60 uppercase tracking-widest"><ShieldAlert className="w-3 h-3" /> Risk Index</div>
                      <p className="text-sm font-black">{selectedVessel.riskScore}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between"><h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Positional Data</h4><Badge className="text-[7px] h-3.5 px-1.5 font-black bg-[#34a853] text-white uppercase border-none">SAT-LOCK</Badge></div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center shadow-inner"><p className="text-[11px] font-mono font-bold text-[#137333] tracking-wider">{selectedVessel.currentPosition}</p></div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mission Logistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Origin Hub</span><span className="text-xs font-bold text-slate-900 uppercase">{selectedVessel.origin}</span></div>
                      <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Destination</span><span className="text-xs font-black text-[#137333] uppercase">{selectedVessel.destination}</span></div>
                      <div className="flex justify-between items-center"><span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">ETA Windows</span><span className="text-xs font-bold text-slate-900 uppercase">{selectedVessel.eta}</span></div>
                    </div>
                  </div>
                  
                  <button className="w-full py-3.5 bg-[#1a73e8] text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#1669d6] transition-all sh-sm shadow-[0_5px_15px_rgba(26,115,232,0.2)] flex items-center justify-center gap-2">Protocol Analysis <ChevronRight className="w-4 h-4" /></button>
                </div>
              </Card>
            ) : (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-4 sh2">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-200"><LayoutGrid className="w-8 h-8 text-slate-300" /></div>
                <p className="text-[10px] font-black text-slate-400 leading-relaxed uppercase tracking-[0.2em]">Select an AIS Node for deep telemetry extraction.</p>
              </div>
            )}

            <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200 sh2 p-5 space-y-5">
              <h3 className={cn("text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2", layers.alerts ? 'text-[#ea4335]' : 'text-slate-400')}>
                <ShieldAlert className="w-4 h-4" /> Tactical Alert Feed
              </h3>
              <div className="space-y-3">
                {displayedRiskZones.map(zone => (
                  <div 
                    key={zone.id} 
                    onClick={() => handleHazardClick(zone)}
                    className={cn(
                      "p-4 border rounded-xl space-y-2 transition-all cursor-pointer hover:border-slate-300 hover:bg-slate-50", 
                      zone.riskLevel === 'Critical' ? 'bg-[#fce8e6] border-[#f5c6c2]' : 'bg-white border-slate-100'
                    )}
                  >
                    <div className="flex justify-between items-center">
                       <span className={cn("text-[11px] font-black uppercase tracking-tight", zone.riskLevel === 'Critical' ? 'text-[#c5221f]' : 'text-slate-900')}>{zone.name}</span>
                       <Badge className={cn("text-[8px] h-4 font-black text-white border-none", zone.riskLevel === 'Critical' ? 'bg-[#ea4335]' : 'bg-slate-500')}>SEV {zone.riskLevel === 'Critical' ? '5' : '4'}</Badge>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase tracking-tighter line-clamp-2">{zone.reason}</p>
                    <div className="flex items-center gap-2 pt-1">
                       <MapPin className="w-3 h-3 text-slate-300" />
                       <span className="text-[9px] font-mono text-slate-400 tracking-tighter">{zone.lat.toFixed(3)}, {zone.lng.toFixed(3)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveMapPage() {
  return (
    <Suspense fallback={<div className="h-full flex flex-col items-center justify-center bg-slate-50 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 gap-4">
      <Activity className="w-10 h-10 animate-spin" />
      Initialising Intelligence Grid...
    </div>}>
      <MapContent />
    </Suspense>
  );
}
