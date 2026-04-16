
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { VesselMap } from '@/components/VesselMap';
import { VESSELS, PORTS, ROUTES, getRiskColorClass, getRiskLevel } from '@/lib/maritime-data';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Search, RotateCcw, ChevronRight, BarChart3, TrendingUp, AlertTriangle, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('All Types');
  const [selectedVesselId, setSelectedVesselId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [briefing, setBriefing] = useState({
    title: 'Daily Maritime Risk Summary — April 3, 2026',
    critical: 'Houthi threat in Red Sea remains high; severe tropical storm brewing in Arabian Sea.',
    port: 'Shanghai terminals experiencing 22h+ delays; Rotterdam capacity reduced due to dredging.',
    recommended: 'Reroute vessels via Cape of Good Hope for high-value cargo; Singapore additional berths opening.'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    const criticalCount = VESSELS.filter(v => v.riskScore >= 80).length;
    const avgRisk = Math.round(VESSELS.reduce((acc, v) => acc + v.riskScore, 0) / VESSELS.length);
    const congestedPorts = PORTS.filter(p => p.congestion === 'Severe' || p.congestion === 'High').length;
    
    return {
      criticalCount,
      avgRisk,
      congestedPorts
    };
  }, []);

  const STAT_CARDS = [
    { label: 'MONITORED NODES', value: mounted ? VESSELS.length.toString() : '--', sub: '+3 in last hour', color: 'bg-[#4285f4]', icon: '🚢' },
    { label: 'CRITICAL ALERTS', value: mounted ? stats.criticalCount.toString() : '--', sub: 'Action required', color: 'bg-[#ea4335]', icon: '🚨' },
    { label: 'AVG ROUTE RISK', value: mounted ? stats.avgRisk.toString() : '--', sub: '+5 vs yesterday', color: 'bg-[#fbbc04]', icon: '⚠️' },
    { label: 'PORTS MONITORED', value: mounted ? PORTS.length.toString() : '--', sub: mounted ? `${stats.congestedPorts} congested today` : '--', color: 'bg-[#34a853]', icon: '⚓' },
  ];

  const TREND_DATA = [
    { time: '00:00', risk: 42, traffic: 1200 },
    { time: '04:00', risk: 45, traffic: 1150 },
    { time: '08:00', risk: 48, traffic: 1400 },
    { time: '12:00', risk: 52, traffic: 1560 },
    { time: '16:00', risk: 50, traffic: 1480 },
    { time: '20:00', risk: 47, traffic: 1300 },
    { time: '23:59', risk: 47, traffic: 1250 },
  ];

  const RISK_DRIVERS = useMemo(() => [
    { name: 'Weather', value: VESSELS.filter(v => v.riskScore > 60 && v.riskScore < 80).length, color: '#4285f4' },
    { name: 'Geopolitical', value: VESSELS.filter(v => v.riskScore >= 80).length, color: '#ea4335' },
    { name: 'Congestion', value: stats.congestedPorts * 4, color: '#fbbc04' },
    { name: 'News/Ops', value: 8, color: '#34a853' },
  ], [stats.congestedPorts, mounted]);

  const RISK_DISTRIBUTION = useMemo(() => [
    { name: 'Critical', value: VESSELS.filter(v => v.riskScore >= 80).length, color: '#ea4335' },
    { name: 'High', value: VESSELS.filter(v => v.riskScore >= 60 && v.riskScore < 80).length, color: '#fbbc04' },
    { name: 'Medium', value: VESSELS.filter(v => v.riskScore >= 40 && v.riskScore < 60).length, color: '#4285f4' },
    { name: 'Low', value: VESSELS.filter(v => v.riskScore < 40).length, color: '#34a853' },
  ], [mounted]);

  const ALERTS = [
    { type: 'WEATHER', sev: 5, score: 91, desc: 'Cyclone forming — Arabian Sea corridors severely affected', region: 'Arabian Sea', time: '12m ago' },
    { type: 'PIRACY', sev: 5, score: 88, desc: 'MSC Elena & Alta Maya: Houthi threat — Red Sea alert', region: 'Red Sea', time: '45m ago' },
    { type: 'CONGESTION', sev: 4, score: 82, desc: 'Shanghai port Severe — 18h+ berth delay expected', region: 'Shanghai', time: '1h ago' },
    { type: 'ANOMALY', sev: 4, score: 74, desc: 'Pacific Star: 40% speed deviation, 34° off bearing', region: 'North Pacific', time: '2h ago' },
    { type: 'CONGESTION', sev: 3, score: 65, desc: 'Rotterdam berths 7-9 closed for maintenance', region: 'Rotterdam', time: '4h ago' },
    { type: 'NEWS', sev: 3, score: 61, desc: 'Suez Canal fee increase — route cost model updated', region: 'Suez Canal', time: '5h ago' },
  ];

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
    if (!mounted) return;
    const timer = setTimeout(() => {
      toast({ 
        title: '🚨 New alert: MSC Elena', 
        description: 'Risk score updated to 91. Severe corridor risk detected.' 
      });
    }, 4000);
    return () => clearTimeout(timer);
  }, [mounted]);

  const handleVesselCardClick = (id: string) => {
    setSelectedVesselId(id);
    toast({
      title: "Tactical Focus",
      description: `Map localized on ${VESSELS.find(v => v.id === id)?.name}`
    });
  };

  return (
    <div className="flex flex-col gap-4 p-5 pb-10">
      <Toaster />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <Card key={card.label} className="relative overflow-hidden p-5 border-border sh hover:-translate-y-0.5 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'both' }}>
            <div className={cn("absolute top-0 left-0 w-full h-[3px]", card.color)} />
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-[#9aa0a6] tracking-wider uppercase">{card.label}</p>
                <p className="text-2xl font-black text-[#202124]">{card.value}</p>
                <p className="text-xs text-[#5f6368] font-medium">{card.sub}</p>
              </div>
              <div className={cn("w-[38px] h-[38px] rounded-xl flex items-center justify-center text-xl shadow-inner border bg-white")}>
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-0 border-border sh overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1a73e8]" />
              <h3 className="text-sm font-black uppercase tracking-tight">Risk Intelligence Hub</h3>
            </div>
            <div className="flex gap-2">
              <span className="text-[9px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase">Live Intelligence</span>
            </div>
          </div>
          
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 bg-[#f8f9fa]/50">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Drivers</h4>
              </div>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mounted ? RISK_DRIVERS : []} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700}} width={65} />
                    <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                      {RISK_DRIVERS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-3.5 h-3.5 text-slate-400" />
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fleet Distribution</h4>
              </div>
              <div className="h-[140px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mounted ? RISK_DISTRIBUTION : []}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={55}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {RISK_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-black text-slate-900 leading-none">{mounted ? VESSELS.length : '--'}</span>
                  <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Nodes</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Traffic vs Risk</h4>
              </div>
              <div className="h-[140px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TREND_DATA}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea4335" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#ea4335" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" hide />
                    <YAxis hide />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="risk" stroke="#ea4335" fill="url(#colorRisk)" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="traffic" stroke="#1a73e8" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="bg-white border-t p-3 flex justify-around">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ea4335]" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Geopolitical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4285f4]" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Weather</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] border border-dashed border-[#1a73e8]" />
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Traffic Baseline</span>
            </div>
          </div>
        </Card>

        <Card className="sh border-border overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-white">
              <div className="px-3 py-1 bg-[#e8f0fe] border border-[#c5d9fd] rounded-full flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[#1a73e8] uppercase tracking-wider">✦ AI Briefing</span>
              </div>
              <button onClick={regenerateBriefing} className={cn("text-[10px] text-[#1a73e8] hover:underline flex items-center gap-1 font-bold uppercase", isGenerating && "animate-spin")}>
                {isGenerating ? <RotateCcw className="w-3 h-3"/> : '↻ Refresh'}
              </button>
            </div>
            <div className="p-4 bg-[#f8f9fa] flex-1 overflow-y-auto">
              <div className={cn("bg-white border rounded-xl p-4 text-[12px] leading-[1.6] text-[#202124] sh transition-opacity", isGenerating ? "opacity-50" : "opacity-100")}>
                <p className="font-black text-[10px] text-[#9aa0a6] uppercase tracking-widest mb-3 border-b pb-2">{briefing.title}</p>
                <div className="space-y-3">
                  <p><span className="font-black text-[#ea4335] uppercase text-[10px]">🔴 Critical:</span> {briefing.critical}</p>
                  <p><span className="font-black text-[#fbbc04] uppercase text-[10px]">🟡 Port Watch:</span> {briefing.port}</p>
                  <p><span className="font-black text-[#34a853] uppercase text-[10px]">🟢 Strategy:</span> {briefing.recommended}</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white border-t flex flex-col gap-2">
              <Link href="/assistant" className="w-full py-2.5 bg-[#4285f4] text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#1a73e8] transition-all shadow-sm flex items-center justify-center">Ask Intelligence AI ↗</Link>
            </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">
        <div className="flex flex-col gap-4">
          <Card className="p-0 border-border sh overflow-hidden rounded-2xl">
            <div className="p-4 border-b bg-white flex items-center justify-between">
              <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-tight">🗺️ Live Fleet Awareness</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 status-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AIS Sat Feed</span>
              </div>
            </div>
            <div className="h-[400px]">
              <VesselMap selectedVesselId={selectedVesselId} onVesselSelect={(v) => setSelectedVesselId(v?.id || null)} />
            </div>
            <div className="p-0">
              <div className="bg-[#f8f9fa] p-1 px-4 flex gap-1 border-b">
                {['All Types', 'Container', 'Tanker', 'Bulk', 'LNG'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all",
                      activeTab === tab 
                        ? "text-[#1a73e8] border-b-2 border-[#1a73e8]" 
                        : "text-[#5f6368] hover:text-[#202124]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-white">
                {mounted && VESSELS.filter(v => activeTab === 'All Types' || v.type.includes(activeTab)).slice(0, 8).map(v => (
                  <div 
                    key={v.id} 
                    onClick={() => handleVesselCardClick(v.id)}
                    className={cn(
                      "p-3 border rounded-xl hover:border-[#4285f4] hover:bg-white hover:-translate-y-0.5 transition-all cursor-pointer group shadow-sm",
                      selectedVesselId === v.id ? "border-[#1a73e8] bg-blue-50/50" : "bg-[#f8f9fa]"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-lg border sh-sm">{v.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-[#202124] truncate uppercase tracking-tight">{v.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">IMO {v.imo}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase tracking-widest", getRiskColorClass(v.riskScore))}>
                        {getRiskLevel(v.riskScore)} {v.riskScore}
                      </span>
                      <span className="text-[9px] font-bold text-[#1a73e8]">{v.speed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="sh border-border flex flex-col h-[380px]">
            <div className="p-4 border-b flex items-center justify-between bg-white">
              <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ea4335]" /> System Alerts
              </h3>
              <Link href="/alerts" className="text-[10px] font-bold text-[#1a73e8] uppercase hover:underline">View All</Link>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {ALERTS.map((alert, i) => (
                <div key={i} className="p-4 border-b hover:bg-[#f8f9fa] transition-all cursor-pointer flex gap-3">
                  <div className={cn("w-1 h-full min-h-[40px] rounded-full", getRiskColorClass(alert.score).split(' ')[0].replace('text', 'bg'))} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className={cn("text-[9px] font-black uppercase tracking-widest", getRiskColorClass(alert.score).split(' ')[0])}>SEV{alert.sev} / {alert.type}</span>
                      <span className="text-[9px] text-slate-400 font-bold">{alert.time}</span>
                    </div>
                    <p className="text-[12px] font-bold text-[#202124] leading-tight mb-1">{alert.desc}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{alert.region}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="sh border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-tight">Node Congestion</h3>
              <Link href="/ports" className="text-[10px] font-bold text-[#1a73e8] uppercase hover:underline">Full Report</Link>
            </div>
            <div className="space-y-3">
              {mounted && PORTS.slice(0, 5).map((port, i) => (
                <div key={port.name} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-300">0{i+1}</span>
                    <p className="text-[11px] font-bold text-slate-700 group-hover:text-[#1a73e8] transition-colors uppercase tracking-tight">{port.name}</p>
                  </div>
                  <div className={cn(
                    "px-2 py-0.5 rounded-lg text-[8px] font-black border uppercase tracking-widest",
                    port.congestion === 'Severe' ? 'bg-[#ea4335] text-white' : 'bg-[#e8f0fe] text-[#1a73e8]'
                  )}>
                    {port.ships} SHIPS
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="sh border-border p-5 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-tight">Active Corridors</h3>
              <div className="space-y-3">
                {mounted && ROUTES.slice(0, 3).map(route => (
                  <div key={route.from} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-500">{route.from} ➔ {route.to}</span>
                      <span className={cn(getRiskColorClass(route.risk).split(' ')[0])}>{route.risk}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={cn("h-full transition-all", getRiskColorClass(route.risk).split(' ')[0].replace('text', 'bg'))} style={{ width: `${route.risk}%` }} />
                    </div>
                  </div>
                ))}
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
