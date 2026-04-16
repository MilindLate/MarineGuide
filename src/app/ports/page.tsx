"use client";

import React from 'react';
import { PORTS, TURKISH_PORTS, getRiskColorClass } from '@/lib/maritime-data';
import { Card } from '@/components/ui/card';
import { Download, Search, Anchor, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PortStatusPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#202124]">⚓ Port Status Intelligence</h1>
          <p className="text-sm text-[#5f6368]">Real-time congestion monitoring — Including Turkish Port Network</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-bold text-[#5f6368] hover:bg-gray-50 transition-all sh">
          <Download className="w-4 h-4" /> Export Logistics Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
         <Card className="p-4 bg-white sh border-l-4 border-l-[#ea4335]">
            <p className="text-[10px] font-bold text-[#9aa0a6] uppercase">Severe Congestion</p>
            <p className="text-xl font-bold">2 Ports</p>
         </Card>
         <Card className="p-4 bg-white sh border-l-4 border-l-[#fbbc04]">
            <p className="text-[10px] font-bold text-[#9aa0a6] uppercase">High Traffic</p>
            <p className="text-xl font-bold">8 Ports</p>
         </Card>
         <Card className="p-4 bg-white sh border-l-4 border-l-[#4285f4]">
            <p className="text-[10px] font-bold text-[#9aa0a6] uppercase">Monitored Vessels</p>
            <p className="text-xl font-bold">1,402</p>
         </Card>
         <Card className="p-4 bg-white sh border-l-4 border-l-[#34a853]">
            <p className="text-[10px] font-bold text-[#9aa0a6] uppercase">System Health</p>
            <p className="text-xl font-bold">Optimal</p>
         </Card>
      </div>

      <Card className="sh border-border overflow-hidden">
        <div className="p-4 border-b bg-[#f8f9fa] flex items-center justify-between">
           <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#9aa0a6]">
                 <div className="w-2 h-2 rounded-full bg-[#ea4335]" /> Severe
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#9aa0a6]">
                 <div className="w-2 h-2 rounded-full bg-[#fbbc04]" /> High
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#9aa0a6]">
                 <div className="w-2 h-2 rounded-full bg-[#4285f4]" /> Medium
              </div>
           </div>
           <div className="flex items-center gap-3">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
               <input placeholder="Search ports..." className="pl-9 pr-4 py-1.5 bg-white border rounded-full text-xs w-48 outline-none focus:ring-1 focus:ring-[#4285f4]" />
             </div>
             <button className="p-2 border rounded-full hover:bg-white text-[#5f6368]"><Filter className="w-4 h-4"/></button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f8f9fa] border-b">
              <tr>
                <th className="px-6 py-4 text-left font-bold text-[#9aa0a6] text-[10px] uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-left font-bold text-[#9aa0a6] text-[10px] uppercase tracking-wider">Port Name</th>
                <th className="px-6 py-4 text-left font-bold text-[#9aa0a6] text-[10px] uppercase tracking-wider">Region</th>
                <th className="px-6 py-4 text-left font-bold text-[#9aa0a6] text-[10px] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left font-bold text-[#9aa0a6] text-[10px] uppercase tracking-wider">Active Ships</th>
                <th className="px-6 py-4 text-left font-bold text-[#9aa0a6] text-[10px] uppercase tracking-wider">Avg Wait</th>
                <th className="px-6 py-4 text-left font-bold text-[#9aa0a6] text-[10px] uppercase tracking-wider">Risk Index</th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {PORTS.map((port, i) => (
                <tr key={port.name} className="hover:bg-[#f8f9fa] transition-all cursor-pointer group">
                  <td className="px-6 py-4 font-medium text-[#9aa0a6]">{i+1}</td>
                  <td className="px-6 py-4 font-bold text-[#202124] group-hover:text-[#1a73e8] transition-colors flex items-center gap-2">
                    <Anchor className="w-3.5 h-3.5 opacity-40" /> {port.name}
                  </td>
                  <td className="px-6 py-4 text-[#5f6368]">{port.region}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold border",
                      port.congestion === 'Severe' ? 'bg-[#ea4335] text-white border-[#ea4335]' : 
                      port.congestion === 'High' ? 'bg-[#fce8e6] text-[#c5221f] border-[#f5c6c2]' :
                      port.congestion === 'Medium' ? 'bg-[#fef7e0] text-[#b06000] border-[#fde8a0]' :
                      'bg-[#e6f4ea] text-[#137333] border-[#b7e1c4]'
                    )}>
                      {port.congestion}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">{port.ships}</td>
                  <td className="px-6 py-4 font-medium text-[#5f6368]">{port.wait}</td>
                  <td className="px-6 py-4">
                    <span className={cn("px-2 py-1 rounded-lg border font-bold text-xs sh", getRiskColorClass(port.risk))}>
                      {port.risk}
                    </span>
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