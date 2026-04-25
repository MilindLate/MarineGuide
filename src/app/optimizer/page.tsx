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
  LayoutGrid,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { aiRouteOptimization, type AiRouteOptimizationOutput } from '@/ai/flows/route-optimization-flow';
import { VESSELS, type Vessel, getRiskColorClass } from '@/lib/maritime-data';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  styles: [
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e0f2fe" }] },
    { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f8fafc" }] },
    { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#cbd5e1" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
    { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
  ]
};

const CORRIDOR_WAYPOINTS: Record<string, google.maps.LatLngLiteral[]> = {
  "High Risk Path": [
    { lat: 31.2, lng: 121.5 },
    { lat: 1.3, lng: 103.8 },
    { lat: 12.0, lng: 50.0 },
    { lat: 15.0, lng: 40.0 },
    { lat: 30.0, lng: 32.5 },
    { lat: 35.0, lng: 15.0 },
    { lat: 45.0, lng: -5.0 },
    { lat: 51.9, lng: 4.5 }
  ],
  "Optimized Path": [
    { lat: 31.2, lng: 121.5 },
    { lat: 1.3, lng: 103.8 },
    { lat: -10.0, lng: 60.0 },
    { lat: -34.0, lng: 18.0 },
    { lat: 0.0, lng: -10.0 },
    { lat: 45.0, lng: -10.0 },
    { lat: 51.9, lng: 4.5 }
  ]
};

export default function OptimizerPage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AiRouteOptimizationOutput | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);

  const criticalVessels = useMemo(() => {
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
      toast({ title: 'Reroute Analysis Complete', description: 'Optimized tactical paths generated.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Tactical Feed Failed', description: 'Could not connect to engine.' });
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
        <p className="text-[11px] text-[#5f6368] font-bold uppercase tracking-[0.2em] opacity-70">Google Maps Intelligence · AI optimization</p>
      </header>

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
                <label className="text-[9px] font-black text-[#9aa0a6] uppercase tracking-widest">Corridor</label>
                <p className="text-xs font-bold text-slate-700">{selectedVessel.origin} → {selectedVessel.destination}</p>
              </div>
            </div>
            <button 
              onClick={startAnalysis}
              disabled={analyzing}
              className="px-8 py-3 bg-[#1a73e8] text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#1669d6] transition-all sh-sm flex items-center gap-2 disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {analyzing ? 'ANALYZING...' : 'IDENTIFY OPTIMAL PATH ↗'}
            </button>
          </div>
        </Card>
      )}

      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <Card className="p-0 border-slate-200 bg-white sh overflow-hidden">
             <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-700">
                  <Navigation className="w-4 h-4 text-[#1a73e8]" /> Tactical Sea Visualization
                </h3>
             </div>
             <div className="h-[500px] w-full relative bg-slate-100">
                {!isLoaded ? (
                   <div className="h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-400">Locking Satellite Grid...</div>
                ) : (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: 20, lng: 30 }}
                    zoom={3}
                    options={mapOptions}
                  >
                    <Polyline
                      path={CORRIDOR_WAYPOINTS["High Risk Path"]}
                      options={{ strokeColor: '#ea4335', strokeOpacity: 0.8, strokeWeight: 6 }}
                    />
                    <Polyline
                      path={CORRIDOR_WAYPOINTS["Optimized Path"]}
                      options={{ strokeColor: '#34a853', strokeOpacity: 1, strokeWeight: 6, strokeDasharray: '12, 12' as any }}
                    />
                    {selectedVessel && (
                      <Marker
                        position={{ lat: selectedVessel.lat, lng: selectedVessel.lng }}
                        label={{
                          text: selectedVessel.emoji,
                          fontSize: '24px'
                        }}
                      />
                    )}
                  </GoogleMap>
                )}
             </div>
          </Card>

          <Card className="p-6 border-blue-100 bg-[#e8f0fe]/40 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1a73e8]" />
                <h4 className="text-sm font-black uppercase text-[#1a73e8] tracking-tight">AI Strategy Insight</h4>
              </div>
              <p className="text-[14px] leading-relaxed text-slate-700 font-medium">
                {results.aiRecommendation}
              </p>
          </Card>
        </div>
      )}
    </div>
  );
}
