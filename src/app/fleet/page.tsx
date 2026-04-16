"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { PORTS, getRiskColorClass } from '@/lib/maritime-data';
import { Search, Anchor, Filter, Clock, Ship, ShieldAlert, MapPin, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function PortIntelligencePage() {
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPorts = PORTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.region.toLowerCase().includes(search.toLowerCase())
  );

  const getCongestionColor = (status: string) => {
    switch (status) {
      case 'Severe': return 'bg-[#ea4335] text-white';
      case 'High': return 'bg-[#fbbc04] text-black';
      case 'Medium': return 'bg-[#4285f4] text-white';
      case 'Low': return 'bg-[#34a853] text-white';
      default: return 'bg-slate-200';
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <Anchor className="w-6 h-6 text-[#1a73e8]" />
             <h1 className="text-2xl font-bold text-[#202124]">Port Status Intelligence</h1>
          </div>
          <p className="text-sm text-[#5f6368]">Real-time congestion monitoring — Turkish & Indian Port Networks</p>
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="px-3 py-1.5 border-[#c5d9fd] text-[#1a73e8] bg-[#e8f0fe] font-bold">
             {PORTS.length} HUB NODES LIVE
           </Badge>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-xs font-bold text-[#5f6368] hover:bg-slate-50 transition-all sh">
            <Filter className="w-4 h-4" /> Filter Network
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
        <input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Port Name, Region, or IMO Identifier..." 
          className="w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl text-sm sh focus:ring-2 focus:ring-[#4285f4]/20 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPorts.map((port) => (
          <Card key={port.name} className="p-0 border-border sh hover:-translate-y-1 transition-all group overflow-hidden bg-white">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#f8f9fa] border flex items-center justify-center text-xl sh shadow-inner text-[#1a73e8]">
                    <Anchor className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-black text-[#202124] truncate uppercase tracking-tight">{port.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                       <Globe className="w-3 h-3 text-[#9aa0a6]" />
                       <p className="text-[10px] text-[#5f6368] font-bold uppercase tracking-widest">{port.region}</p>
                    </div>
                  </div>
                </div>
                <div className={cn("px-2.5 py-1 rounded-lg border text-[10px] font-black sh", getRiskColorClass(port.risk))}>
                  {port.risk} RI
                </div>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Congestion Index</span>
                    <Badge className={cn("text-[9px] font-black uppercase h-5", getCongestionColor(port.congestion))}>
                       {port.congestion === 'Severe' && <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />}
                       {port.congestion}
                    </Badge>
                 </div>

                 <div className="grid grid-cols-2 gap-2 bg-[#f8f9fa] border border-dashed rounded-xl p-3">
                    <div className="space-y-1">
                       <div className="flex items-center gap-1 text-[9px] font-bold text-[#9aa0a6] uppercase tracking-tighter">
                          <Ship className="w-2.5 h-2.5" /> Vessels
                       </div>
                       <p className="text-sm font-black text-[#202124]">{port.ships}</p>
                    </div>
                    <div className="space-y-1 border-l pl-3">
                       <div className="flex items-center gap-1 text-[9px] font-bold text-[#9aa0a6] uppercase tracking-tighter">
                          <Clock className="w-2.5 h-2.5" /> Wait Time
                       </div>
                       <p className="text-sm font-black text-[#202124]">{port.wait}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-2 text-[10px] font-bold text-[#5f6368] pt-1">
                    <MapPin className="w-3 h-3 text-[#1a73e8]" />
                    <span className="truncate opacity-70 font-mono">{port.lat.toFixed(3)}°, {port.lng.toFixed(3)}°</span>
                 </div>
              </div>
            </div>
            
            <div className="px-5 py-3 border-t bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-[#9aa0a6] uppercase tracking-widest">
                 <span className={cn("w-2 h-2 rounded-full", port.congestion === 'Severe' ? "bg-[#ea4335] status-pulse" : "bg-[#34a853]")} />
                 {port.congestion === 'Severe' ? 'Critical Load' : 'Stable Feed'}
              </div>
              <button className="text-[10px] font-black text-[#1a73e8] hover:underline uppercase tracking-tighter">Node Detail ↗</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
