"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { VESSELS, ALL_RISK_ZONES, PORTS, getRiskLevel, getRiskColorClass, type Vessel, type Port } from '@/lib/maritime-data';
import { cn } from '@/lib/utils';
import { Navigation, X, ShieldAlert, Anchor, Activity, Globe, Thermometer, Wind } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface VesselMapProps {
  height?: string | number;
  searchQuery?: string;
  showSST?: boolean;
  showFlow?: boolean;
  showAlerts?: boolean;
  showPorts?: boolean;
  viewMode?: '2D' | 'Globe';
  riskMode?: 'Standard' | 'Geopolitical' | 'Weather';
  selectedVesselId?: string | null;
  onVesselSelect?: (vessel: Vessel | null) => void;
  center?: [number, number];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  styles: [
    { "elementType": "geometry", "stylers": [{ "color": "#121826" }] },
    { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#71717a" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#121826" }] },
    { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "color": "#27272a" }] },
    { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#3f3f46" }] },
    { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#09090b" }] },
    { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "stylers": [{ "visibility": "off" }] },
    { "featureType": "transit", "stylers": [{ "visibility": "off" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#020617" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#3f3f46" }] }
  ]
};

const PortPopupContent = ({ port, onClose }: { port: Port; onClose: () => void }) => {
  const getCongestionColor = (status: string) => {
    switch (status) {
      case 'Severe': return 'text-[#ea4335]';
      case 'High': return 'text-[#fbbc04]';
      case 'Medium': return 'text-[#4285f4]';
      case 'Low': return 'text-[#34a853]';
      default: return 'text-slate-500';
    }
  };
  
  return (
    <div className="w-[280px] bg-[#121826] text-white font-body rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#34a853]/10 border border-[#34a853]/30 flex items-center justify-center text-xl shrink-0">
            ⚓
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-tight">{port.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{port.region}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-full text-slate-400"><X className="w-4 h-4" /></button>
      </div>

      <div className="p-4 grid grid-cols-3 gap-2 bg-black/20">
        <div className="text-center">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Load</p>
          <p className={cn("text-[10px] font-black uppercase", getCongestionColor(port.congestion))}>{port.congestion}</p>
        </div>
        <div className="text-center border-x border-white/5">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Berths</p>
          <p className="text-xs font-black">{port.ships}</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Wait</p>
          <p className="text-xs font-black">{port.wait}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Risk Factor</span>
          <span className={cn("text-[10px] font-black uppercase", getRiskColorClass(port.risk))}>{port.risk} RI</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className={cn("h-full transition-all duration-1000", port.risk > 60 ? 'bg-[#ea4335]' : 'bg-[#34a853]')} style={{ width: `${port.risk}%` }} />
        </div>
      </div>

      <div className="p-3 bg-white/5">
        <button className="w-full py-2 bg-[#34a853] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-colors shadow-lg">Enter Hub Protocol</button>
      </div>
    </div>
  )
};

const VesselPopupContent = ({ vessel, onClose }: { vessel: Vessel; onClose: () => void }) => {
  const riskLevel = getRiskLevel(vessel.riskScore);
  const typeColor = vessel.riskScore >= 80 ? '#ea4335' : (vessel.riskScore >= 60 ? '#fbbc04' : '#1a73e8');

  return (
    <div className="w-[300px] bg-[#0c0f17] text-white font-body rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0 sh-sm">
            {vessel.emoji}
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-black uppercase tracking-tight truncate">{vessel.name}</h3>
            <p className="text-[10px] font-bold text-[#4285f4] uppercase tracking-widest">IMO {vessel.imo}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-full text-slate-500 transition-colors">
            <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 bg-black/30 border-b border-white/5">
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Operational</p>
          <div className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full", vessel.status === 'At Anchor' ? 'bg-[#fbbc04]' : 'bg-[#34a853]')} />
            <p className="text-[10px] font-black uppercase truncate">{vessel.status}</p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Telemetry</p>
          <p className="text-xs font-black text-white">{vessel.speed} / {vessel.heading}°</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>{vessel.origin}</span>
                <span className="text-[#34a853]">{vessel.destination}</span>
            </div>
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1a73e8] to-[#34a853] rounded-full" style={{ width: '70%' }} />
                <Navigation className="absolute top-1/2 left-[70%] -translate-y-1/2 -translate-x-1/2 w-4 h-4 text-white p-0.5 bg-[#1a73e8] rounded-full sh" style={{ transform: `translate(-50%, -50%) rotate(${vessel.heading}deg)` }} />
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold text-slate-500">
              <span>DEPARTED</span>
              <span>ETA {vessel.eta}</span>
            </div>
        </div>
        
        <div className={cn("p-3 rounded-xl border flex items-center justify-between", getRiskColorClass(vessel.riskScore))}>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Tactical Risk Index</span>
          </div>
          <span className="text-xs font-black">{vessel.riskScore}</span>
        </div>
      </div>

      <div className="p-3 bg-white/5">
        <button className="w-full py-2.5 bg-[#1a73e8] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1669d6] transition-all sh-sm">Analyze Mission Path</button>
      </div>
    </div>
  )
};

export function VesselMap({ 
  height = "100%", 
  searchQuery = "", 
  showAlerts = true,
  showPorts = false,
  showSST = false,
  showFlow = false,
  viewMode = '2D',
  riskMode = 'Standard',
  selectedVesselId: externalSelectedId,
  onVesselSelect,
  center,
}: VesselMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [internalSelectedVessel, setInternalSelectedVessel] = useState<Vessel | null>(null);
  const [selectedPort, setSelectedPort] = useState<Port | null>(null);

  const selectedVessel = useMemo(() => {
    if (externalSelectedId) return VESSELS.find(v => v.id === externalSelectedId) || null;
    return internalSelectedVessel;
  }, [externalSelectedId, internalSelectedVessel]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  useEffect(() => {
    if (map && center) {
      map.panTo({ lat: center[0], lng: center[1] });
      map.setZoom(6);
    } else if (map && selectedVessel) {
      map.panTo({ lat: selectedVessel.lat, lng: selectedVessel.lng });
      map.setZoom(8);
    }
  }, [map, center, selectedVessel]);

  const filteredVessels = useMemo(() => {
    return VESSELS.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.imo.includes(searchQuery)
    );
  }, [searchQuery]);

  const displayedRiskZones = useMemo(() => {
    if (riskMode === 'Standard') return ALL_RISK_ZONES.filter(z => z.riskLevel === 'Critical');
    return ALL_RISK_ZONES.filter(z => z.category === riskMode);
  }, [riskMode]);

  const handleVesselClick = (v: Vessel) => {
    setInternalSelectedVessel(v);
    setSelectedPort(null);
    if (onVesselSelect) onVesselSelect(v);
  };

  const handlePortClick = (p: Port) => {
    setSelectedPort(p);
    setInternalSelectedVessel(null);
  };

  const getVesselMarkerIcon = (vessel: Vessel) => {
    const riskLevel = getRiskLevel(vessel.riskScore);
    const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#4285f4');
    const isSelected = selectedVessel?.id === vessel.id;
    const scale = isSelected ? 1.6 : 1.2;
    
    return {
      path: "M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z",
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 1.5,
      strokeColor: '#FFFFFF',
      rotation: vessel.heading,
      anchor: new google.maps.Point(12, 12),
      scale: scale
    };
  };

  if (viewMode === 'Globe') {
    return (
      <div className="relative w-full h-full map-container-globe overflow-hidden">
        <div className="tactical-scan" />
        <div className="w-full h-full flex items-center justify-center">
          <div className="globe-atmosphere" />
          <svg className="w-full h-full relative z-10" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
            <defs>
              <clipPath id="globeClip"><circle cx="500" cy="250" r="235" /></clipPath>
              <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" /><stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <g clipPath="url(#globeClip)">
              <rect width="1000" height="500" fill="url(#globeGrad)" />
              {/* Landmass Simplification */}
              <circle cx="500" cy="250" r="235" fill="#1e293b" opacity="0.3" />
              {filteredVessels.map((v) => {
                const x = 500 + (v.lng * 1.3);
                const y = 250 + (v.lat * -2.2);
                const dist = Math.sqrt(Math.pow(x - 500, 2) + Math.pow(y - 250, 2));
                if (dist > 230) return null;
                const riskLevel = getRiskLevel(v.riskScore);
                const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#4285f4');
                return (
                  <circle 
                    key={v.id} 
                    cx={x} 
                    cy={y} 
                    r={selectedVessel?.id === v.id ? 5 : 2.5} 
                    fill={color} 
                    className="cursor-pointer transition-all duration-300" 
                    onClick={() => handleVesselClick(v)} 
                  />
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#020617]">
      {isLoaded ? (
        <>
          <div className="tactical-scan" />
          {showSST && <div className="sst-overlay" />}
          {showFlow && <div className="flow-overlay" />}
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center ? { lat: center[0], lng: center[1] } : { lat: 20, lng: 30 }}
            zoom={3}
            onLoad={onLoad}
            options={mapOptions}
          >
            {showPorts && PORTS.map(port => (
              <Marker
                key={`port-${port.name}`}
                position={{ lat: port.lat, lng: port.lng }}
                onClick={() => handlePortClick(port)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: '#34a853',
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: '#FFFFFF',
                  scale: 7
                }}
              />
            ))}

            {showAlerts && displayedRiskZones.map(zone => (
              <Circle
                key={zone.id}
                center={{ lat: zone.lat, lng: zone.lng }}
                radius={zone.radius * 6000}
                options={{
                  strokeColor: zone.category === 'Weather' ? '#4285f4' : '#ea4335',
                  strokeOpacity: 0.8,
                  strokeWeight: 1.5,
                  fillColor: zone.category === 'Weather' ? '#4285f4' : '#ea4335',
                  fillOpacity: 0.15,
                }}
              />
            ))}

            {filteredVessels.map(v => (
              <Marker
                key={v.id}
                position={{ lat: v.lat, lng: v.lng }}
                icon={getVesselMarkerIcon(v)}
                onClick={() => handleVesselClick(v)}
              />
            ))}

            {selectedVessel && (
              <InfoWindow
                position={{ lat: selectedVessel.lat, lng: selectedVessel.lng }}
                onCloseClick={() => setInternalSelectedVessel(null)}
                options={{ pixelOffset: new google.maps.Size(0, -20) }}
              >
                <VesselPopupContent 
                  vessel={selectedVessel} 
                  onClose={() => setInternalSelectedVessel(null)} 
                />
              </InfoWindow>
            )}

            {selectedPort && (
              <InfoWindow
                position={{ lat: selectedPort.lat, lng: selectedPort.lng }}
                onCloseClick={() => setSelectedPort(null)}
                options={{ pixelOffset: new google.maps.Size(0, -10) }}
              >
                <PortPopupContent 
                  port={selectedPort} 
                  onClose={() => setSelectedPort(null)} 
                />
              </InfoWindow>
            )}
          </GoogleMap>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 font-black text-xs uppercase tracking-[0.2em] gap-5">
          <Activity className="w-10 h-10 animate-pulse text-[#4285f4]" />
          Synchronising Satellite Grid...
        </div>
      )}
    </div>
  );
}