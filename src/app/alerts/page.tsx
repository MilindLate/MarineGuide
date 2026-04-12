
"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Search, Filter, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRiskColorClass } from '@/lib/maritime-data';

const FULL_ALERTS = [
  { type: 'WEATHER', sev: 5, score: 91, desc: 'Cyclone forming — Arabian Sea corridors severely affected', region: 'Arabian Sea', time: '12m ago' },
  { type: 'PIRACY', sev: 5, score: 88, desc: 'MSC Elena & Alta Maya: Houthi threat — Red Sea alert', region: 'Red Sea', time: '45m ago' },
  { type: 'CONGESTION', sev: 4, score: 82, desc: 'Shanghai port Severe — 18h+ berth delay expected', region: 'Shanghai', time: '1h ago' },
  { type: 'ANOMALY', sev: 4, score: 74, desc: 'Pacific Star: 40% speed deviation, 34° off bearing', region: 'North Pacific', time: '2h ago' },
  { type: 'CONGESTION', sev: 3, score: 65, desc: 'Rotterdam berths 7-9 closed for maintenance', region: 'Rotterdam', time: '4h ago' },
  { type: 'NEWS', sev: 3, score: 61, desc: 'Suez Canal fee increase — route cost model updated', region: 'Suez Canal', time: '5h ago' },
  { type: 'WEATHER', sev: 2, score: 52, desc: 'Strong swell Bay of Biscay — monitor passage timing', region: 'Biscay', time: '8h ago' },
  { type: 'PORT', sev: 1, score: 28, desc: 'Singapore additional berths opened — easing congestion', region: 'Singapore', time: '1d ago' },
];

export default function AlertsPage() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#202124]">🚨 Active Alerts</h1>
        <p className="text-sm text-[#5f6368]">10 active disruptions across monitored routes</p>
      </div>

      <Card className="p-0 border-border sh overflow-hidden">
        <div className="p-4 border-b bg-[#f8f9fa] flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            {['All', 'Critical', 'Weather', 'Congestion', 'Anomaly'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                  filter === f ? "bg-white text-[#1a73e8] border-[#c5d9fd] sh" : "bg-transparent text-[#5f6368] border-transparent hover:bg-gray-100"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input placeholder="Filter alerts..." className="pl-9 pr-4 py-1.5 bg-white border rounded-full text-xs w-48 outline-none focus:ring-1 focus:ring-[#4285f4]" />
          </div>
        </div>
        <div className="divide-y">
          {FULL_ALERTS.map((alert, i) => (
            <div key={i} className="p-4 hover:bg-[#f8f9fa] transition-all group flex items-center justify-between">
              <div className="flex gap-4 flex-1">
                <div className="flex flex-col items-center shrink-0 pt-1">
                  <div className={cn("w-2.5 h-2.5 rounded-full mb-1", getRiskColorClass(alert.score).split(' ')[0].replace('text', 'bg'))} />
                  <div className={cn("w-0.5 flex-1 rounded-full", getRiskColorClass(alert.score).split(' ')[0].replace('text', 'bg'))} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider", getRiskColorClass(alert.score).split(' ')[0])}>SEV{alert.sev} / {alert.type}</span>
                    <span className="text-[10px] text-[#9aa0a6]">{alert.region} · {alert.time}</span>
                  </div>
                  <p className="text-sm font-bold text-[#202124]">{alert.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={cn("px-2 py-1 rounded-lg border text-sm font-bold sh", getRiskColorClass(alert.score))}>{alert.score}</span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-white border sh rounded-full p-2 text-green-600 hover:bg-green-50">
                  <CheckCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
