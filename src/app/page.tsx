
"use client";

import React, { useState, useEffect } from 'react';
import { VesselMap } from '@/components/VesselMap';
import { VESSELS, PORTS, ROUTES, getRiskColorClass, getRiskLevel } from '@/lib/maritime-data';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Search, RotateCcw, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const STAT_CARDS = [
  { label: 'ACTIVE VESSELS', value: '1,847', sub: '+12 in last 5 min', color: 'bg-[#4285f4]', icon: '🚢' },
  { label: 'CRITICAL ALERTS', value: '3', sub: '2 need reroute now', color: 'bg-[#ea4335]', icon: '🚨' },
  { label: 'AVG ROUTE RISK', value: '47', sub: '+5 vs yesterday', color: 'bg-[#fbbc04]', icon: '⚠️' },
  { label: 'PORTS MONITORED', value: '50', sub: '8 congested today', color: 'bg-[#34a853]', icon: '⚓' },
];

const ALERTS = [
  { type: 'WEATHER', sev: 5, score: 91, desc: 'Cyclone forming — Arabian Sea corridors severely affected', region: 'Arabian Sea', time: '12m ago' },
  { type: 'PIRACY', sev: 5, score: 88, desc: 'MSC Elena & Alta Maya: Houthi threat — Red Sea alert', region: 'Red Sea', time: '45m ago' },
  { type: 'CONGESTION', sev: 4, score: 82, desc: 'Shanghai port Severe — 18h+ berth delay expected', region: 'Shanghai', time: '1h ago' },
  { type: 'ANOMALY', sev: 4, score: 74, desc: 'Pacific Star: 40% speed deviation, 34° off bearing', region: 'North Pacific', time: '2h ago' },
  { type: 'CONGESTION', sev: 3, score: 65, desc: 'Rotterdam berths 7-9 closed for maintenance', region: 'Rotterdam', time: '4h ago' },
  { type: 'NEWS', sev: 3, score: 61, desc: 'Suez Canal fee increase — route cost model updated', region: 'Suez Canal', time: '5h ago' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('All Types');
  const [briefing, setBriefing] = useState({
    title: 'Daily Maritime Risk Summary — April 3, 2026',
    critical: 'Houthi threat in Red Sea remains high; severe tropical storm brewing in Arabian Sea.',
    port: 'Shanghai terminals experiencing 22h+ delays; Rotterdam capacity reduced due to dredging.',
    recommended: 'Reroute vessels via Cape of Good Hope for high-value cargo; Singapore additional berths opening.'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const regenerateBriefing = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setBriefing({
        title: 'Daily Maritime Risk Summary — Updated 12:45 PM',
        critical: 'Alert: Panama Canal restrictions tightening; weather system near Philippines developing.',
        port: 'LA/Long Beach seeing slight congestion uptick; Hamburg port strikes looming next week.',
        recommended: 'Shift LNG schedules ahead of peak swell in Biscay; utilize Busan as temporary hub.'
      });
      setIsGenerating(false);
      toast({ title: 'AI Briefing Regenerated', description: 'Real-time intelligence model updated.' });
    }, 1500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      toast({ 
        title: '🚨 New alert: MSC Elena', 
        description: 'Risk score updated to 91. Severe corridor risk detected.' 
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-5">
      <Toaster />
      
      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <Card key={card.label} className="relative overflow-hidden p-5 border-border sh hover:-translate-y-0.5 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both' }}>
            <div className={cn("absolute top-0 left-0 w-full h-[3px]", card.color)} />
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#9aa0a6] tracking-wider">{card.label}</p>
                <p className="text-2xl font-bold text-[#202124]">{card.value}</p>
                <p className="text-xs text-[#5f6368]">{card.sub}</p>
              </div>
              <div className={cn("w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-lg", card.color + "/10")}>
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Row 2: Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <Card className="p-0 border-border sh overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">🗺️ Live Vessel Map</h2>
            </div>
            <VesselMap />
            <div className="p-0">
              <div className="bg-[#f8f9fa] p-1 px-4 flex gap-1 border-b">
                {['All Types', 'Container', 'Tanker', 'Bulk', 'Ro-Ro', 'LNG/LPG', 'General'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 text-xs font-medium transition-all",
                      activeTab === tab 
                        ? "bg-white text-[#1a73e8] border-b-2 border-[#1a73e8]" 
                        : "text-[#5f6368] hover:text-[#202124]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 bg-white">
                {VESSELS.filter(v => activeTab === 'All Types' || v.type.includes(activeTab)).map(v => (
                  <div key={v.id} className="p-3 bg-[#f8f9fa] border rounded-lg hover:border-[#4285f4] hover:bg-white hover:-translate-y-0.5 transition-all cursor-pointer group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-sm border">{v.emoji}</div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-bold text-[#202124] truncate">{v.name}</p>
                        <p className="text-[10px] text-[#5f6368]">{v.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", getRiskColorClass(v.riskScore))}>
                        {getRiskLevel(v.riskScore)} {v.riskScore}
                      </div>
                    </div>
                    <div className="w-full h-0.5 bg-gray-200 mt-2 rounded-full overflow-hidden">
                      <div className={cn("h-full", getRiskColorClass(v.riskScore).split(' ')[0].replace('text', 'bg'))} style={{ width: `${v.riskScore}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="sh border-border overflow-hidden">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-sm font-bold">⚓ Port Status — Top 10</h3>
                <a href="/ports" className="text-xs text-[#1a73e8] font-medium hover:underline flex items-center gap-1">View all 50 <ChevronRight className="w-3 h-3"/></a>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-[#f8f9fa] border-b">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-bold text-[#9aa0a6] w-10">#</th>
                      <th className="px-4 py-2.5 text-left font-bold text-[#9aa0a6]">Port</th>
                      <th className="px-4 py-2.5 text-left font-bold text-[#9aa0a6]">Status</th>
                      <th className="px-4 py-2.5 text-left font-bold text-[#9aa0a6]">Ships</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PORTS.slice(0, 6).map((port, i) => (
                      <tr key={port.name} className="border-b hover:bg-[#f8f9fa] transition-all cursor-pointer">
                        <td className="px-4 py-2.5"><span className="w-5 h-5 bg-[#f8f9fa] border rounded flex items-center justify-center text-[10px] text-[#9aa0a6]">{i+1}</span></td>
                        <td className="px-4 py-2.5 font-bold">{port.name}</td>
                        <td className="px-4 py-2.5">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold border",
                            port.congestion === 'Severe' ? 'bg-[#ea4335] text-white border-[#ea4335]' : 
                            port.congestion === 'High' ? 'bg-[#fce8e6] text-[#c5221f] border-[#f5c6c2]' :
                            port.congestion === 'Medium' ? 'bg-[#fef7e0] text-[#b06000] border-[#fde8a0]' :
                            'bg-[#e6f4ea] text-[#137333] border-[#b7e1c4]'
                          )}>
                            {port.congestion}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[#5f6368] font-medium">{port.ships}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="sh border-border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">Route Risk Scores</h3>
                <a href="/optimizer" className="text-xs text-[#1a73e8] font-medium hover:underline flex items-center gap-1">Optimizer <ChevronRight className="w-3 h-3"/></a>
              </div>
              <div className="space-y-3">
                {ROUTES.map(route => (
                  <div key={route.from} className="space-y-1">
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="font-bold text-[#202124]">{route.from} → {route.to}</span>
                      <span className={cn("px-1.5 py-0.5 rounded border font-bold", getRiskColorClass(route.risk))}>{route.risk}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn("h-full", getRiskColorClass(route.risk).split(' ')[0].replace('text', 'bg'))} style={{ width: `${route.risk}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <p className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-wider mb-2">Risk Factor Breakdown</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: '🌊 Weather', v: 78, c: 'bg-[#ea4335]' },
                    { l: '⚓ Congestion', v: 61, c: 'bg-[#fbbc04]' },
                    { l: '📡 Anomaly', v: 44, c: 'bg-[#4285f4]' },
                    { l: '📰 News', v: 22, c: 'bg-[#34a853]' }
                  ].map(f => (
                    <div key={f.l} className="p-2 border rounded-lg bg-[#f8f9fa]">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[10px] text-[#5f6368]">{f.l}</span>
                        <span className="text-xs font-bold">{f.v}</span>
                      </div>
                      <div className="w-full h-0.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={cn("h-full", f.c)} style={{ width: `${f.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <Card className="sh border-border flex flex-col min-h-[400px]">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">🚨 Active Alerts</h3>
                <span className="bg-[#ea4335] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">10</span>
              </div>
              <a href="/alerts" className="text-xs text-[#1a73e8] font-medium hover:underline">View all</a>
            </div>
            <div className="p-2 bg-[#f8f9fa] border-b flex gap-1">
              <button className="flex-1 px-3 py-1 bg-white border rounded-full text-[10px] font-bold text-[#1a73e8] shadow-sm">All</button>
              <button className="flex-1 px-3 py-1 bg-transparent border-0 rounded-full text-[10px] font-bold text-[#5f6368] hover:bg-gray-100">Critical</button>
              <button className="flex-1 px-3 py-1 bg-transparent border-0 rounded-full text-[10px] font-bold text-[#5f6368] hover:bg-gray-100">Severe</button>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[420px] custom-scrollbar">
              {ALERTS.map((alert, i) => (
                <div key={i} className="p-3 border-b hover:bg-[#f8f9fa] transition-all cursor-pointer flex gap-3">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={cn("w-2 h-2 rounded-full mb-1", getRiskColorClass(alert.score).split(' ')[0].replace('text', 'bg'))} />
                    <div className={cn("w-0.5 flex-1 rounded-full", getRiskColorClass(alert.score).split(' ')[0].replace('text', 'bg'))} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className={cn("text-[10px] font-bold uppercase tracking-wide", getRiskColorClass(alert.score).split(' ')[0])}>SEV{alert.sev} / {alert.type}</span>
                      <span className={cn("px-1.5 py-0.5 rounded border text-[10px] font-bold", getRiskColorClass(alert.score))}>{alert.score}</span>
                    </div>
                    <p className="text-[12px] font-medium text-[#202124] leading-tight mb-1">{alert.desc}</p>
                    <p className="text-[10px] text-[#9aa0a6]">{alert.region} · {alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="sh border-border overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-white">
              <div className="px-3 py-1 bg-[#e8f0fe] border border-[#c5d9fd] rounded-full flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#1a73e8]">✦ AI Briefing — Claude</span>
              </div>
              <button onClick={regenerateBriefing} className={cn("text-xs text-[#1a73e8] hover:underline flex items-center gap-1 font-medium", isGenerating && "animate-spin")}>
                <RotateCcw className="w-3 h-3"/> {isGenerating ? '' : '↻ Regenerate'}
              </button>
            </div>
            <div className="p-4 bg-[#f8f9fa] flex-1">
              <div className={cn("bg-white border rounded-xl p-4 text-[13px] leading-[1.7] text-[#202124] sh transition-opacity", isGenerating ? "opacity-50" : "opacity-100")}>
                <p className="font-bold text-xs text-[#9aa0a6] mb-3">{briefing.title}</p>
                <p className="mb-2"><span className="font-bold text-[#ea4335]">🔴 Critical section:</span> {briefing.critical}</p>
                <p className="mb-2"><span className="font-bold text-[#fbbc04]">🟡 Port watch section:</span> {briefing.port}</p>
                <p><span className="font-bold text-[#34a853]">🟢 Recommended section:</span> {briefing.recommended}</p>
              </div>
            </div>
            <div className="p-3 bg-white border-t grid grid-cols-2 gap-2">
              <button className="col-span-2 py-2.5 bg-[#4285f4] text-white rounded-full font-bold text-xs hover:bg-[#1a73e8] transition-all shadow-sm">Ask AI ↗</button>
              <button className="py-2 bg-white border text-[#5f6368] rounded-full font-bold text-xs hover:bg-[#f8f9fa] transition-all">Export PDF</button>
              <button className="py-2 bg-white border text-[#5f6368] rounded-full font-bold text-xs hover:bg-[#f8f9fa] transition-all">Email Report</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
