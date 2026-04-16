"use client";

import React, { useState, useMemo } from 'react';
import { PORTS, getRiskColorClass } from '@/lib/maritime-data';
import { Card } from '@/components/ui/card';
import { Download, Search, Anchor, Filter, Activity, Ship, Clock, Globe2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function PortStatusPage() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("All");

  const regions = useMemo(() => {
    const r = Array.from(new Set(PORTS.map(p => p.region.split(' / ')[0])));
    return ["All", ...r];
  }, []);

  const filteredPorts = useMemo(() => {
    return PORTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.region.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = regionFilter === "All" || p.region.startsWith(regionFilter);
      return matchesSearch && matchesRegion;
    });
  }, [search, regionFilter]);

  const stats = useMemo(() => ({
    severe: filteredPorts.filter(p => p.congestion === 'Severe').length,
    high: filteredPorts.filter(p => p.congestion === 'High').length,
    totalShips: filteredPorts.reduce((acc, p) => acc + p.ships, 0),
    avgWait: (filteredPorts.reduce((acc, p) => acc + parseInt(p.wait), 0) / (filteredPorts.length || 1)).toFixed(1)
  }), [filteredPorts]);

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white sh-sm">
              <Anchor className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-[#202124] tracking-tight uppercase">Port Intelligence Hub</h1>
          </div>
          <p className="text-xs md:text-sm font-medium text-[#5f6368] md:ml-[52px]">
            Global & Regional Maritime Congestion Monitoring · <span className="text-[#1a73e8] font-bold">Real-time Node Sync</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <button className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-white border border-slate-200 rounded-full text-[10px] md:text-xs font-bold text-[#5f6368] hover:bg-slate-50 transition-all sh-sm">
            <Globe2 className="w-4 h-4" /> Global View
          </button>
          <button className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-[#1a73e8] text-white rounded-full text-[10px] md:text-xs font-bold hover:bg-[#1669d6] transition-all sh-sm">
            <Download className="w-4 h-4" /> Export Intelligence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         <Card className="p-5 bg-white sh-sm border-l-4 border-l-[#ea4335] hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[9px] font-black text-[#9aa0a6] uppercase tracking-[0.15em]">Severe Congestion</p>
              <Activity className="w-4 h-4 text-[#ea4335] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#202124]">{stats.severe} <span className="text-xs font-bold text-slate-400">HUBs</span></p>
            <p className="text-[9px] text-[#ea4335] font-black mt-1 uppercase tracking-tighter">Immediate Tactical Risk</p>
         </Card>
         <Card className="p-5 bg-white sh-sm border-l-4 border-l-[#fbbc04] hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[9px] font-black text-[#9aa0a6] uppercase tracking-[0.15em]">High Traffic Alert</p>
              <Activity className="w-4 h-4 text-[#fbbc04] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#202124]">{stats.high} <span className="text-xs font-bold text-slate-400">HUBs</span></p>
            <p className="text-[9px] text-[#b06000] font-black mt-1 uppercase tracking-tighter">Capacity Monitoring Active</p>
         </Card>
         <Card className="p-5 bg-white sh-sm border-l-4 border-l-[#4285f4] hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[9px] font-black text-[#9aa0a6] uppercase tracking-[0.15em]">Monitored Vessels</p>
              <Ship className="w-4 h-4 text-[#4285f4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#202124]">{stats.totalShips.toLocaleString()}</p>
            <p className="text-[9px] text-[#1a73e8] font-black mt-1 uppercase tracking-tighter">Live AIS Sync Feed</p>
         </Card>
         <Card className="p-5 bg-white sh-sm border-l-4 border-l-[#34a853] hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[9px] font-black text-[#9aa0a6] uppercase tracking-[0.15em]">Avg Berthing Time</p>
              <Clock className="w-4 h-4 text-[#34a853] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-2xl md:text-3xl font-black text-[#202124]">{stats.avgWait}h</p>
            <p className="text-[9px] text-[#137333] font-black mt-1 uppercase tracking-tighter">Global Hub Average</p>
         </Card>
      </div>

      <Card className="sh-sm border-border overflow-hidden rounded-2xl bg-white">
        <div className="p-4 md:p-6 border-b bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
           <div className="flex flex-wrap gap-2">
              {regions.map(r => (
                <button 
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
                    regionFilter === r 
                      ? "bg-[#1a73e8] text-white border-[#1a73e8] sh-sm" 
                      : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {r}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-3 flex-1 max-w-xl">
             <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
               <Input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search by Node, Region or Country..." 
                 className="w-full pl-11 h-11 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4285f4]/20 transition-all sh-sm" 
               />
             </div>
             <button className="h-11 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-[#5f6368] sh-sm transition-all">
               <Filter className="w-5 h-5"/>
             </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f9fa] border-b">
              <tr>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">Ranking</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">Strategic Node</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">Region</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">Congestion</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">Vessels</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">Avg Wait</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[9px] uppercase tracking-[0.2em] whitespace-nowrap text-center">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPorts.length > 0 ? filteredPorts.map((port, i) => (
                <tr key={port.name} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                  <td className="px-6 py-5 font-bold text-[#9aa0a6] text-[11px]">#{String(i+1).padStart(2, '0')}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-[#1a73e8] group-hover:text-white transition-all shadow-inner border border-slate-200/50">
                        <Anchor className="w-4 h-4 opacity-70" />
                      </div>
                      <span className="font-black text-[#202124] group-hover:text-[#1a73e8] transition-colors uppercase tracking-tight text-xs">{port.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-tighter opacity-80">{port.region}</span>
                  </td>
                  <td className="px-6 py-5">
                    <Badge className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-widest",
                      port.congestion === 'Severe' ? 'bg-[#ea4335] text-white border-[#ea4335]' : 
                      port.congestion === 'High' ? 'bg-[#fce8e6] text-[#c5221f] border-[#f5c6c2]' :
                      port.congestion === 'Medium' ? 'bg-[#fef7e0] text-[#b06000] border-[#fde8a0]' :
                      'bg-[#e6f4ea] text-[#137333] border-[#b7e1c4]'
                    )}>
                      {port.congestion}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 font-black text-slate-900 text-xs">
                    {port.ships} <span className="text-[9px] text-slate-400 font-bold uppercase">Nodes</span>
                  </td>
                  <td className="px-6 py-5 font-bold text-[#5f6368] text-xs">
                    {port.wait}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <div className={cn(
                        "px-2.5 py-1 rounded-lg border font-black text-[11px] text-center w-12 sh-sm",
                        getRiskColorClass(port.risk)
                      )}>
                        {port.risk}
                      </div>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <Globe2 className="w-12 h-12" />
                      <p className="text-sm font-bold uppercase tracking-widest">No matching tactical nodes found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
