
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  Loader2, 
  Sparkles, 
  Navigation, 
  Ship, 
  ShieldAlert, 
  MapPin, 
  ChevronRight,
  TrendingDown,
  Clock,
  DollarSign,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { aiRouteOptimization, type AiRouteOptimizationOutput } from '@/ai/flows/route-optimization-flow';
import { VESSELS, type Vessel, getRiskColorClass } from '@/lib/maritime-data';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

// Mock Waypoints for maritime corridors to ensure "Water Routes"
// For the demo, we use Suez vs Cape routes for specific vessel destinations
const CORRIDOR_WAYPOINTS: Record<string, [number, number][]> = {
  "High Risk Path": [
    [31.2, 121.5], // Shanghai
    [1.3, 103.8],  // Singapore
    [12.0, 50.0],  // Gulf of Aden
    [15.0, 40.0],  // Red Sea
    [30.0, 32.5],  // Suez
    [35.0, 15.0],  // Med
    [45.0, -5.0],  // Biscay
    [51.9, 4.5]    // Rotterdam
  ],
  "Optimized Path": [
    [31.2, 121.5], // Shanghai
    [1.3, 103.8],  // Singapore
    [-10.0, 60.0], // Indian Ocean
    [-34.0, 18.0], // Cape of Good Hope
    [0.0, -10.0],  // Mid Atlantic
    [45.0, -10.0], // North Atlantic
    [51.9, 4.5]    // Rotterdam
  ]
};

export default function OptimizerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AiRouteOptimizationOutput | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
    });
  }, []);

  const criticalVessels = useMemo(() => {
    // Show vessels with high risk index first
    return VESSELS.filter(v => v.riskScore > 75).slice(0, 6);
  }, []);

  const handleSelectVessel = (vessel: Vessel) => {
    setSelectedVessel(vessel);
    setResults(null);
    toast({
      title: "Mission Locked",
      description: `Targeting ${vessel.name} for tactical rerouting analysis.`
    });
  };

  const startAnalysis = async () => {
    if (!selectedVessel) return;
    setAnalyzing(true);
    setResults(null);
    try {
      const output = await aiRouteOptimization({
        originPort: selectedVessel.origin,
        destinationPort: selectedVessel.destination,
        vesselType: selectedVessel.type
      });
      setResults(output);
      toast({ title: 'Reroute Analysis Complete', description: 'Optimized tactical paths and route options generated.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Tactical Feed Failed', description: 'Could not connect to the route intelligence engine.' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full overflow-y-auto pb-20 bg-[#f8f9fa]">
      <Toaster />
      
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white sh">
              <Navigation className="w-6 h-6" />
           </div>
           <h1 className="text-2xl font-black text-[#202124] tracking-tight uppercase">Tactical Reroute Commander</h1>
        </div>
        <p className="text-[11px] text-[#5f6368] font-bold uppercase tracking-[0.2em] opacity-70">AI-Powered Mission Optimization · Live AIS-S Feed</p>
      </header>

      {/* STEP 1: CRITICAL LIST */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-[0.15em] flex items-center gap-2">
          <ShieldAlert className="w-3 h-3 text-[#ea4335]" /> Critical Reroute Opportunities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criticalVessels.map(v => (
            <Card 
              key={v.id} 
              onClick={() => handleSelectVessel(v)}
              className={cn(
                "p-4 border transition-all cursor-pointer hover:sh group",
                selectedVessel?.id === v.id ? "border-[#1a73e8] bg-blue-50/50 ring-2 ring-blue-100" : "bg-white border-slate-200"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-white border sh-sm flex items-center justify-center text-xl">{v.emoji}</div>
                   <div>
                      <p className="text-[11px] font-black text-[#202124] uppercase truncate tracking-tight">{v.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">IMO {v.imo}</p>
                   </div>
                </div>
                <div className={cn("px-2 py-0.5 rounded-lg text-[9px] font-black border sh-sm", getRiskColorClass(v.riskScore))}>
                  {v.riskScore} RI
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                <div className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" /> {v.origin} → {v.destination}</div>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* STEP 2: SELECTION & ACTION */}
      {selectedVessel && (
        <Card className="p-6 border-[#c5d9fd] bg-white sh2 overflow-hidden relative animate-in fade-in slide-in-from-top-4">
          <div className="absolute top-0 left-0 w-1 bg-[#1a73e8] h-full" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#9aa0a6] uppercase tracking-widest">Target Node</label>
                <div className="flex items-center gap-2">
                   <Ship className="w-4 h-4 text-[#1a73e8]" />
                   <span className="text-sm font-black uppercase text-[#202124]">{selectedVessel.name}</span>
                </div>
              </div>
              <div className="w-px h-10 bg-slate-100 hidden md:block" />
              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#9aa0a6] uppercase tracking-widest">Active Corridor</label>
                <p className="text-xs font-bold text-slate-700">{selectedVessel.origin} → {selectedVessel.destination}</p>
              </div>
            </div>
            <button 
              onClick={startAnalysis}
              disabled={analyzing}
              className="px-8 py-3 bg-[#1a73e8] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1669d6] transition-all sh-sm flex items-center gap-2 disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {analyzing ? 'ANALYZING MARITIME DATA...' : 'IDENTIFY OPTIMAL PATH ↗'}
            </button>
          </div>
        </Card>
      )}

      {/* STEP 3: TACTICAL MAP & RESULTS */}
      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <Card className="p-0 border-slate-200 bg-white sh overflow-hidden">
             <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-700">
                  <Navigation className="w-4 h-4 text-[#1a73e8]" /> Tactical Visualization (Sea Routes)
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-[#ea4335] rounded-full" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Current Risk Path</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-[#34a853] rounded-full" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Optimized Safe Path</span>
                  </div>
                </div>
             </div>
             <div className="h-[500px] w-full relative">
                {!L ? (
                   <div className="h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">Locking Satellite Grid...</div>
                ) : (
                  <MapContainer center={[20, 30]} zoom={3} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}" attribution='&copy; Esri' />
                    {/* High Risk Path (RED BOLD) */}
                    <Polyline 
                      positions={CORRIDOR_WAYPOINTS["High Risk Path"]} 
                      pathOptions={{ color: '#ea4335', weight: 6, opacity: 0.8 }} 
                    />
                    {/* Optimized Path (GREEN BOLD) */}
                    <Polyline 
                      positions={CORRIDOR_WAYPOINTS["Optimized Path"]} 
                      pathOptions={{ color: '#34a853', weight: 6, opacity: 1, dashArray: '12, 12' }} 
                    />
                    {/* Vessel Current Marker */}
                    {selectedVessel && (
                      <Marker 
                        position={[selectedVessel.lat, selectedVessel.lng]}
                        icon={L.divIcon({
                          className: 'custom-vessel-icon',
                          html: `<div class="w-10 h-10 rounded-full bg-white border-2 border-[#1a73e8] flex items-center justify-center text-xl sh-sm scale-125 shadow-xl animate-pulse">${selectedVessel.emoji}</div>`,
                          iconSize: [40, 40],
                          iconAnchor: [20, 20]
                        })}
                      >
                        <Popup>
                          <div className="p-2 text-center">
                            <p className="text-[10px] font-black uppercase tracking-tight">{selectedVessel.name}</p>
                            <p className="text-[9px] font-bold text-[#1a73e8]">Mission In-Progress</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                )}
             </div>
          </Card>

          {/* AI Strategy Insight */}
          <Card className="p-6 border-blue-100 bg-[#e8f0fe]/40 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1a73e8]" />
                <h4 className="text-sm font-black uppercase text-[#1a73e8] tracking-tight">AI Strategy Insight</h4>
              </div>
              <p className="text-[14px] leading-relaxed text-slate-700 font-medium">
                {results.aiRecommendation}
              </p>
          </Card>

          {/* Path Logistics Cards (Old Version Re-integrated) */}
          <section className="space-y-4 pt-4 pb-12">
            <h4 className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-[0.2em] flex items-center gap-2">
              <LayoutGrid className="w-3.5 h-3.5" /> Detailed Path Logistics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.recommendations.map((route, i) => (
                <Card 
                  key={route.routeName} 
                  className={cn(
                    "p-6 border transition-all sh bg-white relative overflow-hidden group hover:-translate-y-1 duration-300",
                    i === 0 ? "border-[#34a853] border-2 ring-4 ring-green-50" : "border-slate-200"
                  )}
                >
                  {i === 0 && (
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#34a853] text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                      Tactical Recommendation
                    </div>
                  )}
                  
                  <h5 className="text-sm font-black text-[#202124] uppercase tracking-tight mb-5 flex items-center gap-2">
                    <Navigation className={cn("w-4 h-4", i === 0 ? "text-[#34a853]" : "text-slate-400")} />
                    {route.routeName}
                  </h5>
                  
                  <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Navigation className="w-2.5 h-2.5" /> Distance
                      </p>
                      <p className="text-[14px] font-black text-[#202124]">{route.distanceNm.toLocaleString()} NM</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock className="w-2.5 h-2.5" /> ETA Delta
                      </p>
                      <p className="text-[14px] font-black text-[#202124]">
                        {route.etaDeltaDays > 0 ? `+${route.etaDeltaDays}` : route.etaDeltaDays} Days
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <DollarSign className="w-2.5 h-2.5" /> Est. Cost Delta
                      </p>
                      <p className="text-[14px] font-black text-[#202124]">
                        ${route.costDeltaUsd.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldAlert className="w-2.5 h-2.5" /> Risk Level
                      </p>
                      <p className={cn(
                        "text-[14px] font-black uppercase tracking-tight", 
                        route.riskScore > 60 ? "text-[#ea4335]" : "text-[#34a853]"
                      )}>
                        {route.riskCategory} ({route.riskScore})
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Deploy Optimized Route</button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
