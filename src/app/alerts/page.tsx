
"use client";

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Search, Filter, CheckCircle, AlertTriangle, Cloud, Anchor, ShieldAlert, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRiskColorClass } from '@/lib/maritime-data';

const FULL_ALERTS = [
  { id: '1', type: 'WEATHER', sev: 5, score: 91, desc: 'Cyclone forming — Arabian Sea corridors severely affected', region: 'Arabian Sea', time: '12m ago', category: 'Weather' },
  { id: '2', type: 'PIRACY', sev: 5, score: 88, desc: 'MSC Elena & Alta Maya: Houthi threat — Red Sea alert', region: 'Red Sea', time: '45m ago', category: 'Critical' },
  { id: '3', type: 'CONGESTION', sev: 4, score: 82, desc: 'Shanghai port Severe — 18h+ berth delay expected', region: 'Shanghai', time: '1h ago', category: 'Congestion' },
  { id: '4', type: 'ANOMALY', sev: 4, score: 74, desc: 'Pacific Star: 40% speed deviation, 34° off bearing', region: 'North Pacific', time: '2h ago', category: 'Anomaly' },
  { id: '5', type: 'CONGESTION', sev: 3, score: 65, desc: 'Rotterdam berths 7-9 closed for maintenance', region: 'Rotterdam', time: '4h ago', category: 'Congestion' },
  { id: '6', type: 'NEWS', sev: 3, score: 61, desc: 'Suez Canal fee increase — route cost model updated', region: 'Suez Canal', time: '5h ago', category: 'Critical' },
  { id: '7', type: 'WEATHER', sev: 2, score: 52, desc: 'Strong swell Bay of Biscay — monitor passage timing', region: 'Biscay', time: '8h ago', category: 'Weather' },
  { id: '8', type: 'PORT', sev: 1, score: 28, desc: 'Singapore additional berths opened — easing congestion', region: 'Singapore', time: '1d ago', category: 'Congestion' },
];

export default function AlertsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const filteredAlerts = useMemo(() => {
    return FULL_ALERTS.filter(alert => {
      const matchesFilter = filter === 'All' || alert.category === filter || (filter === 'Critical' && alert.sev >= 4);
      const matchesSearch = alert.desc.toLowerCase().includes(search.toLowerCase()) || 
                           alert.region.toLowerCase().includes(search.toLowerCase()) ||
                           alert.type.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const toggleResolved = (id: string) => {
    setResolvedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'WEATHER': return <Cloud className="w-4 h-4" />;
      case 'PIRACY': return <ShieldAlert className="w-4 h-4" />;
      case 'CONGESTION': return <Anchor className="w-4 h-4" />;
      case 'ANOMALY': return <Activity className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#202124]">🚨 Active Alerts</h1>
        <p className="text-sm text-[#5f6368] font-medium">
          {filteredAlerts.length} disruptions identified in current tactical sector
        </p>
      </div>

      <Card className="p-0 border-border sh overflow-hidden bg-white">
        <div className="p-4 border-b bg-[#f8f9fa]/50 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {['All', 'Critical', 'Weather', 'Congestion', 'Anomaly'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap",
                  filter === f 
                    ? "bg-[#1a73e8] text-white border-[#1a73e8] shadow-sm" 
                    : "bg-white text-[#5f6368] border-[#dadce0] hover:bg-gray-100"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 md:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by description, region..." 
              className="pl-9 pr-4 py-1.5 bg-white border border-[#dadce0] rounded-full text-xs w-full md:w-64 outline-none focus:ring-2 focus:ring-[#4285f4]/20 transition-all font-medium" 
            />
          </div>
        </div>
        
        <div className="divide-y divide-[#f1f3f4]">
          {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={cn(
                "p-4 hover:bg-[#f8f9fa] transition-all group flex items-center justify-between",
                resolvedIds.has(alert.id) && "opacity-50 grayscale-[0.5]"
              )}
            >
              <div className="flex gap-4 flex-1 min-w-0">
                <div className="flex flex-col items-center shrink-0 pt-1">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm transition-colors",
                    getRiskColorClass(alert.score).split(' ')[0].replace('text', 'bg-white text'),
                    getRiskColorClass(alert.score).split(' ')[2]
                  )}>
                    {getAlertIcon(alert.type)}
                  </div>
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={cn("text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", getRiskColorClass(alert.score))}>
                      SEV{alert.sev} / {alert.type}
                    </span>
                    <span className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-widest">{alert.region}</span>
                    <span className="text-[10px] text-[#bdc1c6] font-medium tracking-tighter">· {alert.time}</span>
                  </div>
                  <p className={cn(
                    "text-sm font-bold text-[#202124] truncate md:whitespace-normal",
                    resolvedIds.has(alert.id) && "line-through"
                  )}>
                    {alert.desc}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 ml-4">
                <div className={cn(
                  "hidden sm:flex px-2.5 py-1 rounded-lg border text-xs font-black sh shadow-inner transition-colors",
                  getRiskColorClass(alert.score)
                )}>
                  {alert.score} RI
                </div>
                <button 
                  onClick={() => toggleResolved(alert.id)}
                  className={cn(
                    "transition-all border sh rounded-full p-2 hover:scale-110 active:scale-95",
                    resolvedIds.has(alert.id) 
                      ? "bg-green-100 text-green-600 border-green-200" 
                      : "bg-white text-slate-300 hover:text-green-600 hover:border-green-100"
                  )}
                  title={resolvedIds.has(alert.id) ? "Mark as active" : "Resolve alert"}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center space-y-4 bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-200">
                <ShieldAlert className="w-8 h-8 text-slate-200" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#202124] uppercase tracking-widest">No matching alerts found</p>
                <p className="text-[11px] text-[#9aa0a6] font-medium">Try adjusting your filters or search terms.</p>
              </div>
              <button 
                onClick={() => { setFilter('All'); setSearch(''); }} 
                className="text-xs font-bold text-[#1a73e8] hover:underline uppercase tracking-tighter"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-border sh bg-white space-y-2">
          <p className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-[0.2em]">Risk Density</p>
          <div className="flex items-end gap-1 h-12">
            {[40, 70, 45, 90, 65, 30, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-100 rounded-t-sm relative group">
                <div 
                  className={cn("absolute bottom-0 left-0 w-full rounded-t-sm transition-all duration-1000", h > 80 ? 'bg-[#ea4335]' : 'bg-[#4285f4]')} 
                  style={{ height: `${h}%` }} 
                />
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Last 24h Intelligence Feed</p>
        </Card>
        <Card className="p-4 border-border sh bg-white space-y-2">
          <p className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-[0.2em]">Resolution Rate</p>
          <div className="flex items-center gap-4 pt-2">
             <p className="text-2xl font-black text-[#202124]">{Math.round((resolvedIds.size / FULL_ALERTS.length) * 100)}%</p>
             <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#34a853] transition-all duration-1000" 
                  style={{ width: `${(resolvedIds.size / FULL_ALERTS.length) * 100}%` }} 
                />
             </div>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Target: 100% Operational Stability</p>
        </Card>
        <Card className="p-4 border-border sh bg-[#e8f0fe] border-[#c5d9fd] flex flex-col justify-center items-center text-center">
           <ShieldAlert className="w-5 h-5 text-[#1a73e8] mb-1" />
           <p className="text-[11px] font-black text-[#1a73e8] uppercase tracking-widest">Protocol Intelligence</p>
           <p className="text-[10px] font-bold text-[#1a73e8]/70 uppercase leading-tight mt-1">AI-Powered Risk Mitigation Enabled</p>
        </Card>
      </div>
    </div>
  );
}
