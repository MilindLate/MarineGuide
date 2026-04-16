"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { VESSELS, getRiskColorClass, getRiskLevel } from '@/lib/maritime-data';
import { Plus, MoreVertical, Search, Ship, Filter, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FleetTrackerPage() {
  const [search, setSearch] = useState("");
  const myFleet = VESSELS.filter(v => v.name.toLowerCase().includes(search.toLowerCase())).slice(0, 12);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#202124]">🚢 Global Fleet Intelligence</h1>
          <p className="text-sm text-[#5f6368]">Monitoring {VESSELS.length} active AIS nodes across all maritime sectors</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-[#f8f9fa] border rounded-full text-xs font-bold text-[#5f6368] hover:bg-white transition-all sh">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4285f4] text-white rounded-full text-xs font-bold hover:bg-[#1a73e8] transition-all sh">
            <Plus className="w-4 h-4" /> Register Vessel
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
        <input 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Vessel Name, IMO, or MMSI..." 
          className="w-full pl-11 pr-4 py-3 bg-white border rounded-2xl text-sm sh focus:ring-2 focus:ring-[#4285f4]/30 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myFleet.map((v) => (
          <Card key={v.id} className="p-0 border-border sh hover:-translate-y-1 transition-all group overflow-hidden bg-white">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#f8f9fa] border flex items-center justify-center text-xl sh shadow-inner">
                    {v.emoji}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-[#202124] truncate">{v.name}</h3>
                    <p className="text-[10px] text-[#1a73e8] font-bold uppercase tracking-widest">{v.flag} · IMO {v.imo}</p>
                  </div>
                </div>
                <div className={cn("px-2.5 py-1 rounded-lg border text-xs font-black sh", getRiskColorClass(v.riskScore))}>
                  {v.riskScore}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 bg-[#f8f9fa] border border-dashed rounded-xl p-3">
                <div className="space-y-1 text-center border-r">
                   <p className="text-[9px] font-bold text-[#9aa0a6] uppercase tracking-tighter">Speed</p>
                   <p className="text-xs font-black text-[#202124]">{v.speed}</p>
                </div>
                <div className="space-y-1 text-center border-r">
                   <p className="text-[9px] font-bold text-[#9aa0a6] uppercase tracking-tighter">Dest</p>
                   <p className="text-xs font-black text-[#202124] truncate px-1">{v.destination.split(' ')[0]}</p>
                </div>
                <div className="space-y-1 text-center">
                   <p className="text-[9px] font-bold text-[#9aa0a6] uppercase tracking-tighter">Draught</p>
                   <p className="text-xs font-black text-[#202124]">{v.draught}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-[#5f6368]">
                    <MapPin className="w-3 h-3 text-[#1a73e8]" />
                    <span className="truncate">{v.currentPosition}</span>
                 </div>
              </div>
            </div>
            
            <div className="px-5 py-3 border-t bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-[#9aa0a6] uppercase tracking-widest">
                 <span className={cn("w-2 h-2 rounded-full", v.riskScore > 60 ? "bg-[#ea4335] status-pulse" : "bg-[#34a853]")} />
                 {v.status}
              </div>
              <button className="text-[#9aa0a6] hover:text-[#202124] transition-colors p-1.5 hover:bg-white rounded-full"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}