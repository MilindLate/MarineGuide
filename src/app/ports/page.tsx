"use client";

import React, { useState } from 'react';
import { PORTS, getRiskColorClass } from '@/lib/maritime-data';
import { Card } from '@/components/ui/card';
import { Download, Search, Anchor, Filter, Activity, Ship, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function PortStatusPage() {
  const [search, setSearch] = useState("");

  const filteredPorts = PORTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.region.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    severe: PORTS.filter(p => p.congestion === 'Severe').length,
    high: PORTS.filter(p => p.congestion === 'High').length,
    totalShips: PORTS.reduce((acc, p) => acc + p.ships, 0)
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white sh-sm">
              <Anchor className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-[#202124] tracking-tight">Port Status Intelligence</h1>
          </div>
          <p className="text-sm font-medium text-[#5f6368] ml-[52px]">
            Real-time congestion monitoring across <span className="text-[#1a73e8] font-bold">Turkish & Global Port Networks</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-[#5f6368] hover:bg-slate-50 transition-all sh-sm">
            <Download className="w-4 h-4" /> Export Intelligence Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="p-5 bg-white sh-sm border-l-4 border-l-[#ea4335] hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-widest">Severe Congestion</p>
              <Activity className="w-4 h-4 text-[#ea4335] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-black text-[#202124]">{stats.severe} <span className="text-sm font-bold text-slate-400">HUBs</span></p>
            <p className="text-[10px] text-[#ea4335] font-black mt-1 uppercase">Immediate Action Required</p>
         </Card>
         <Card className="p-5 bg-white sh-sm border-l-4 border-l-[#fbbc04] hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-widest">High Traffic Alert</p>
              <Activity className="w-4 h-4 text-[#fbbc04] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-black text-[#202124]">{stats.high} <span className="text-sm font-bold text-slate-400">HUBs</span></p>
            <p className="text-[10px] text-[#b06000] font-black mt-1 uppercase">Monitor Capacity</p>
         </Card>
         <Card className="p-5 bg-white sh-sm border-l-4 border-l-[#4285f4] hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-widest">Monitored Vessels</p>
              <Ship className="w-4 h-4 text-[#4285f4] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-black text-[#202124]">{stats.totalShips.toLocaleString()}</p>
            <p className="text-[10px] text-[#1a73e8] font-black mt-1 uppercase">Active AIS Sync</p>
         </Card>
         <Card className="p-5 bg-white sh-sm border-l-4 border-l-[#34a853] hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-2">
              <p className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-widest">Avg Berthing Time</p>
              <Clock className="w-4 h-4 text-[#34a853] opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-3xl font-black text-[#202124]">11.4h</p>
            <p className="text-[10px] text-[#137333] font-black mt-1 uppercase">Across All Nodes</p>
         </Card>
      </div>

      <Card className="sh-sm border-border overflow-hidden rounded-2xl bg-white">
        <div className="p-6 border-b bg-slate-50/50 flex flex-wrap items-center justify-between gap-6">
           <div className="flex gap-6">
              <div className="flex items-center gap-2.5">
                 <div className="w-2 h-2 rounded-full bg-[#ea4335] status-pulse" /> 
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Severe</span>
              </div>
              <div className="flex items-center gap-2.5">
                 <div className="w-2 h-2 rounded-full bg-[#fbbc04]" /> 
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">High</span>
              </div>
              <div className="flex items-center gap-2.5">
                 <div className="w-2 h-2 rounded-full bg-[#4285f4]" /> 
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Medium</span>
              </div>
           </div>
           <div className="flex items-center gap-3 flex-1 max-w-md">
             <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
               <input 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 placeholder="Search by Port Name, Region or Country..." 
                 className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4285f4]/20 transition-all sh-sm" 
               />
             </div>
             <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-white text-[#5f6368] sh-sm transition-all">
               <Filter className="w-5 h-5"/>
             </button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f9fa] border-b">
              <tr>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[10px] uppercase tracking-[0.1em]">Ranking</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[10px] uppercase tracking-[0.1em]">Strategic Node</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[10px] uppercase tracking-[0.1em]">Geographic Region</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[10px] uppercase tracking-[0.1em]">Congestion Status</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[10px] uppercase tracking-[0.1em]">Vessel Count</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[10px] uppercase tracking-[0.1em]">Avg Berthing Wait</th>
                <th className="px-6 py-4 text-left font-black text-[#9aa0a6] text-[10px] uppercase tracking-[0.1em]">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPorts.map((port, i) => (
                <tr key={port.name} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                  <td className="px-6 py-5 font-bold text-[#9aa0a6] text-xs">#{String(i+1).padStart(2, '0')}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-[#1a73e8] group-hover:text-white transition-all">
                        <Anchor className="w-4 h-4 opacity-70" />
                      </div>
                      <span className="font-black text-[#202124] group-hover:text-[#1a73e8] transition-colors uppercase tracking-tight text-xs">{port.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-bold text-[#5f6368] uppercase tracking-tighter opacity-80">{port.region}</span>
                  </td>
                  <td className="px-6 py-5">
                    <Badge className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest",
                      port.congestion === 'Severe' ? 'bg-[#ea4335] text-white border-[#ea4335]' : 
                      port.congestion === 'High' ? 'bg-[#fce8e6] text-[#c5221f] border-[#f5c6c2]' :
                      port.congestion === 'Medium' ? 'bg-[#fef7e0] text-[#b06000] border-[#fde8a0]' :
                      'bg-[#e6f4ea] text-[#137333] border-[#b7e1c4]'
                    )}>
                      {port.congestion}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 font-black text-slate-900 text-xs">
                    {port.ships} <span className="text-[10px] text-slate-400">NODES</span>
                  </td>
                  <td className="px-6 py-5 font-bold text-[#5f6368] text-xs">
                    {port.wait}
                  </td>
                  <td className="px-6 py-5">
                    <div className={cn(
                      "px-2.5 py-1 rounded-lg border font-black text-xs text-center w-12 sh-sm",
                      getRiskColorClass(port.risk)
                    )}>
                      {port.risk}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}