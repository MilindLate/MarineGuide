
"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { VESSELS, getRiskColorClass, getRiskLevel } from '@/lib/maritime-data';
import { Plus, MoreVertical, Gauge, MapPin, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FleetTrackerPage() {
  const myFleet = VESSELS.slice(0, 6);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#202124]">🚢 Fleet Tracker</h1>
          <p className="text-sm text-[#5f6368]">Monitor your registered vessels — {myFleet.length} vessels in your fleet</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#4285f4] text-white rounded-full text-xs font-bold hover:bg-[#1a73e8] transition-all sh">
          <Plus className="w-4 h-4" /> Add Vessel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myFleet.map((v) => (
          <Card key={v.id} className="p-0 border-border sh hover:-translate-y-1 transition-all group overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#f8f9fa] border flex items-center justify-center text-xl sh">
                    {v.emoji}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#202124]">{v.name}</h3>
                    <p className="text-[11px] text-[#5f6368] font-medium">{v.type}</p>
                  </div>
                </div>
                <div className={cn("px-2.5 py-1 rounded-lg border text-xs font-bold sh", getRiskColorClass(v.riskScore))}>
                  {v.riskScore}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-1 bg-[#f8f9fa] rounded-xl p-3">
                <div className="space-y-1 text-center border-r">
                   <p className="text-[9px] font-bold text-[#9aa0a6] uppercase">Speed</p>
                   <p className="text-xs font-bold text-[#202124]">{v.speed}</p>
                </div>
                <div className="space-y-1 text-center border-r">
                   <p className="text-[9px] font-bold text-[#9aa0a6] uppercase">Dest</p>
                   <p className="text-xs font-bold text-[#202124] truncate px-1">{v.destination}</p>
                </div>
                <div className="space-y-1 text-center">
                   <p className="text-[9px] font-bold text-[#9aa0a6] uppercase">ETA</p>
                   <p className="text-xs font-bold text-[#202124]">{v.eta}</p>
                </div>
              </div>
            </div>
            
            <div className="px-5 py-3 border-t bg-white flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#9aa0a6]">
                 <span className={cn("w-2 h-2 rounded-full", v.riskScore > 60 ? "bg-[#ea4335] status-pulse" : "bg-[#34a853]")} />
                 AIS ACTIVE
              </div>
              <button className="text-[#9aa0a6] hover:text-[#202124] transition-colors"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
