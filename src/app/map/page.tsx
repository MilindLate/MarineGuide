
"use client";

import React, { useState, useRef } from 'react';
import { VesselMap } from '@/components/VesselMap';
import { Search, Map as MapIcon, Layers, Wind, ShieldAlert, Globe, Upload, FileJson, X, FileArchive } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Vessel, CRITICAL_ZONES, WEATHER_STATIONS } from '@/lib/maritime-data';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import JSZip from 'jszip';

export interface KMLFeature {
  id: string;
  type: 'Point' | 'LineString';
  name: string;
  coordinates: { lat: number; lng: number }[];
}

export default function LiveMapPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<'2D' | 'Globe'>('2D');
  const [layers, setLayers] = useState({
    weather: true,
    lanes: true,
    alerts: true
  });
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [kmlFeatures, setKmlFeatures] = useState<KMLFeature[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const parseKMLString = (text: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const placemarks = xmlDoc.getElementsByTagName("Placemark");
    const features: KMLFeature[] = [];

    for (let i = 0; i < placemarks.length; i++) {
      const pm = placemarks[i];
      const name = pm.getElementsByTagName("name")[0]?.textContent || `Feature ${i + 1}`;
      
      // Points
      const point = pm.getElementsByTagName("Point")[0];
      if (point) {
        const coordsStr = point.getElementsByTagName("coordinates")[0]?.textContent?.trim();
        if (coordsStr) {
          const [lng, lat] = coordsStr.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            features.push({ id: `kml-${Date.now()}-${i}`, type: 'Point', name, coordinates: [{ lat, lng }] });
          }
        }
      }

      // LineStrings
      const line = pm.getElementsByTagName("LineString")[0];
      if (line) {
        const coordsStr = line.getElementsByTagName("coordinates")[0]?.textContent?.trim();
        if (coordsStr) {
          const pts = coordsStr.split(/\s+/).map(pair => {
            const [lng, lat] = pair.split(",").map(Number);
            return { lat, lng };
          }).filter(p => !isNaN(p.lat) && !isNaN(p.lng));
          if (pts.length > 0) {
            features.push({ id: `kml-${Date.now()}-${i}`, type: 'LineString', name, coordinates: pts });
          }
        }
      }
    }
    return features;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const fileName = file.name.toLowerCase();

    try {
      if (fileName.endsWith('.kmz')) {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        const kmlFile = Object.keys(contents.files).find(name => name.toLowerCase().endsWith('.kml'));
        
        if (!kmlFile) {
          throw new Error("No KML file found inside KMZ archive.");
        }

        const kmlText = await contents.files[kmlFile].async("string");
        const features = parseKMLString(kmlText);
        
        if (features.length > 0) {
          setKmlFeatures(prev => [...prev, ...features]);
          toast({ title: 'KMZ Imported', description: `Loaded ${features.length} features from archive.` });
        } else {
          toast({ title: 'Empty KMZ', description: 'No valid maritime features found in archive.', variant: 'destructive' });
        }
      } else if (fileName.endsWith('.kml')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const features = parseKMLString(text);
          if (features.length > 0) {
            setKmlFeatures(prev => [...prev, ...features]);
            toast({ title: 'KML Imported', description: `Successfully loaded ${features.length} features.` });
          } else {
            toast({ title: 'Invalid KML', description: 'No valid Points or LineStrings found.', variant: 'destructive' });
          }
        };
        reader.readAsText(file);
      } else {
        toast({ title: 'Unsupported Format', description: 'Please upload .kml or .kmz files.', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Processing Failed', description: err instanceof Error ? err.message : 'Could not process file.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const clearKML = () => {
    setKmlFeatures([]);
    toast({ title: 'Overlays Cleared', description: 'All custom layers removed.' });
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
          <div className="h-8 w-px bg-slate-200 mx-2" />
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".kml,.kmz" 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all sh disabled:opacity-50"
            >
              {isProcessing ? <FileArchive className="w-3.5 h-3.5 animate-pulse" /> : <Upload className="w-3.5 h-3.5 text-[#4285f4]" />}
              {isProcessing ? 'Processing...' : 'Upload KML/KMZ'}
            </button>
            {kmlFeatures.length > 0 && (
              <button 
                onClick={clearKML}
                className="flex items-center gap-2 px-4 py-2 bg-[#fce8e6] border border-[#f5c6c2] rounded-full text-xs font-bold text-[#c5221f] hover:bg-[#fadad7] transition-all"
              >
                <X className="w-3.5 h-3.5" /> Clear ({kmlFeatures.length})
              </button>
            )}
          </div>
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
            height={1000} 
            searchQuery={search}
            showWeather={layers.weather}
            showLanes={layers.lanes}
            showAlerts={layers.alerts}
            viewMode={viewMode}
            onVesselSelect={setSelectedVessel}
            kmlOverlays={kmlFeatures}
          />
          
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-30">
             <div className="bg-white/90 backdrop-blur-md p-2 rounded-2xl sh border flex flex-col gap-1">
                <button 
                  onClick={() => toggleLayer('weather')}
                  className={cn("p-2.5 rounded-xl transition-all", layers.weather ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50")}
                  title="Weather Radar"
                >
                  <Wind className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => toggleLayer('lanes')}
                  className={cn("p-2.5 rounded-xl transition-all", layers.lanes ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50")}
                  title="Shipping Lanes"
                >
                  <MapIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => toggleLayer('alerts')}
                  className={cn("p-2.5 rounded-xl transition-all", layers.alerts ? "bg-[#e8f0fe] text-[#1a73e8]" : "text-slate-400 hover:bg-slate-50")}
                  title="Alert Zones"
                >
                  <ShieldAlert className="w-5 h-5" />
                </button>
             </div>
          </div>
        </div>

        <div className="w-80 shrink-0 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {kmlFeatures.length > 0 && (
            <div className="bg-[#e8f0fe] rounded-2xl border border-[#c5d9fd] p-5 space-y-3">
              <h3 className="text-xs font-bold text-[#1a73e8] uppercase tracking-wider flex items-center gap-2">
                <FileJson className="w-4 h-4" /> Custom Overlays
              </h3>
              <div className="max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {kmlFeatures.slice(0, 10).map(f => (
                  <div key={f.id} className="text-[10px] font-medium text-slate-700 bg-white/50 px-2 py-1.5 rounded-lg flex justify-between">
                    <span className="truncate pr-2">{f.name}</span>
                    <span className="opacity-50 shrink-0">{f.type}</span>
                  </div>
                ))}
                {kmlFeatures.length > 10 && <p className="text-[9px] text-[#1a73e8] text-center font-bold">+{kmlFeatures.length - 10} more features...</p>}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border sh p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider">Live Weather Stations</h3>
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
              <ShieldAlert className="w-3 h-3" /> Geopolitical Risks
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
