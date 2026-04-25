
"use client";

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { VESSELS, ALL_RISK_ZONES, PORTS, getRiskLevel, getRiskColorClass, type Vessel, type Port } from '@/lib/maritime-data';
import { cn } from '@/lib/utils';
import { Navigation, X, ShieldAlert, Anchor, Activity, Globe } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface VesselMapProps {
  height?: string | number;
  searchQuery?: string;
  showWeather?: boolean;
  showLanes?: boolean;
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
    {
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "elementType": "labels.icon",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#616161" }]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [{ "color": "#e9e9e9" }]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#9e9e9e" }]
    }
  ]
};

const PortPopupContent = ({ port, onClose }: { port: Port; onClose: () => void }) => {
  const getCongestionColor = (status: string) => {
    switch (status) {
      case 'Severe': return 'text-[#c5221f]';
      case 'High': return 'text-[#b06000]';
      case 'Medium': return 'text-[#1a73e8]';
      case 'Low': return 'text-[#137333]';
      default: return 'text-slate-500';
    }
  };
  
  const getRiskBgClass = (score: number) => {
    const level = getRiskLevel(score);
    switch (level) {
      case 'Critical': return 'bg-[#ea4335]';
      case 'High':     return 'bg-[#fbbc04]';
      case 'Medium':   return 'bg-[#4285f4]';
      case 'Low':      return 'bg-[#34a853]';
      default: return 'bg-slate-400';
    }
  }

  return (
    <div className="w-[280px] bg-white text-[#202124] font-body">
      <div className="p-3 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#e6f4ea] border border-[#b7e1c4] flex items-center justify-center text-lg shrink-0">
            ⚓
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-black uppercase tracking-tight truncate">{port.name}</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{port.region}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
            <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 grid grid-cols-3 gap-2 bg-[#f8f9fa]/70 border-b">
        <div className="space-y-0.5 text-center">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Congestion</p>
          <p className={cn("text-[10px] font-black uppercase", getCongestionColor(port.congestion))}>{port.congestion}</p>
        </div>
        <div className="space-y-0.5 text-center">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Vessels</p>
          <p className="text-sm font-black text-slate-800">{port.ships}</p>
        </div>
        <div className="space-y-0.5 text-center">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Wait</p>
          <p className="text-sm font-black text-slate-800">{port.wait}</p>
        </div>
      </div>
      
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Risk Index</span>
          <div className={cn("px-2 py-0.5 rounded-lg border text-[9px] font-black", getRiskColorClass(port.risk))}>
            {port.risk} RI
          </div>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className={cn("h-full", getRiskBgClass(port.risk))} style={{ width: `${port.risk}%` }} />
        </div>
      </div>

      <div className="p-2 flex gap-2 border-t bg-white">
        <button className="flex-1 py-2 border rounded-lg text-[10px] font-bold bg-[#34a853] text-white hover:bg-green-700">Analyze Hub</button>
      </div>
    </div>
  )
};

const VesselPopupContent = ({ vessel, onClose }: { vessel: Vessel; onClose: () => void }) => {
  const riskLevel = getRiskLevel(vessel.riskScore);
  
  const getTextColor = (score: number) => {
    const level = getRiskLevel(score);
    switch (level) {
        case 'Critical': return 'text-[#c5221f]';
        case 'High': return 'text-[#b06000]';
        case 'Medium': return 'text-[#1a73e8]';
        case 'Low': return 'text-[#137333]';
        default: return 'text-slate-500';
    }
  }

  return (
    <div className="w-[280px] bg-white text-[#202124] font-body">
      <div className="p-3 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center text-lg shrink-0">
            {vessel.emoji}
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-black uppercase tracking-tight truncate">{vessel.name}</h3>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">IMO {vessel.imo}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:bg-slate-100 rounded-full">
            <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2 bg-[#f8f9fa]/70 border-b">
        <div className="space-y-0.5">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
          <p className="text-[10px] font-bold text-slate-800 truncate">{vessel.status}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Speed</p>
          <p className="text-[10px] font-bold text-slate-800">{vessel.speed}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Risk</p>
          <p className={cn("text-[10px] font-bold uppercase", getTextColor(vessel.riskScore))}>{riskLevel} ({vessel.riskScore})</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Course</p>
          <p className="text-[10px] font-bold text-slate-800">{vessel.heading}°</p>
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-800">
                <span className="truncate pr-1">{vessel.origin}</span>
                <Navigation className="w-3 h-3 text-slate-300 shrink-0" />
                <span className="truncate pl-1">{vessel.destination}</span>
            </div>
            <div className="h-1 bg-slate-200 rounded-full relative">
              <div className="w-3/4 h-full bg-[#1a73e8] rounded-full" />
            </div>
        </div>
        <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase tracking-widest">
          <div>ETA: <span className="text-slate-800">{vessel.eta}</span></div>
        </div>
      </div>

      <div className="p-2 flex gap-2 border-t bg-white">
        <button className="flex-1 py-2 border rounded-lg text-[10px] font-bold bg-[#1a73e8] text-white hover:bg-[#1669d6]">Optimize Route</button>
      </div>
    </div>
  )
};

export function VesselMap({ 
  height = "100%", 
  searchQuery = "", 
  showAlerts = true,
  showPorts = false,
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

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
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
      v.id.includes(searchQuery) ||
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
    const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#1a73e8');
    const isSelected = selectedVessel?.id === vessel.id;
    const scale = isSelected ? 1.5 : 1;
    
    return {
      path: "M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z",
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 1.5,
      strokeColor: '#FFFFFF',
      rotation: vessel.heading,
      anchor: new google.maps.Point(12, 12),
      scale: 1.2 * scale
    };
  };

  // Globe Mode Logic
  const projectX = (lng: number) => 500 + (lng * 1.8);
  const projectY = (lat: number) => 250 + (lat * -2.4);

  if (viewMode === 'Globe') {
    return (
      <div className="relative w-full h-full map-container-globe bg-slate-900 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="globe-atmosphere" />
          <svg className="w-full h-full relative z-10" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
            <defs>
              <clipPath id="globeClip"><circle cx="500" cy="250" r="240" /></clipPath>
              <linearGradient id="globeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" /><stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <g clipPath="url(#globeClip)">
              <rect width="1000" height="500" fill="url(#globeGrad)" />
              {filteredVessels.map((v) => {
                const x = projectX(v.lng);
                const y = projectY(v.lat);
                const dist = Math.sqrt(Math.pow(x - 500, 2) + Math.pow(y - 250, 2));
                if (dist > 240) return null;
                const riskLevel = getRiskLevel(v.riskScore);
                const color = riskLevel === 'Critical' ? '#ea4335' : (riskLevel === 'High' ? '#fbbc04' : '#1a73e8');
                return (
                  <circle key={v.id} cx={x} cy={y} r={selectedVessel?.id === v.id ? 4 : 2} fill={color} className="cursor-pointer" onClick={() => handleVesselClick(v)} />
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-[#f0f2f5]">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center ? { lat: center[0], lng: center[1] } : { lat: 20, lng: 30 }}
          zoom={3}
          onLoad={onLoad}
          onUnmount={onUnmount}
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
                scale: 6
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
                strokeWeight: 1,
                fillColor: zone.category === 'Weather' ? '#4285f4' : '#ea4335',
                fillOpacity: 0.1,
              }}
            />
          ))}

          {filteredVessels.map(v => (
            <Marker
              key={v.id}
              position={{ lat: v.lat, lng: v.lng }}
              icon={getVesselMarkerIcon(v)}
              onClick={() => handleVesselClick(v)}
              title={v.name}
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
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-[#5f6368] font-bold text-xs uppercase tracking-widest gap-4">
          <Activity className="w-8 h-8 animate-pulse text-[#1a73e8]" />
          Initialising Tactical Grid...
        </div>
      )}
    </div>
  );
}
