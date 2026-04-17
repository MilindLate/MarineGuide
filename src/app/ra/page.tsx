
"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FileSearch, Sparkles, TrendingUp, ShieldAlert, Globe, Download, Calendar, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const REPORTS = [
  {
    id: '1',
    title: 'Red Sea Corridor: Strategic Impact Analysis Q2',
    category: 'Geopolitical',
    date: '2026-03-28',
    impact: 'Critical',
    summary: 'Detailed assessment of maritime traffic deviation around the Cape of Good Hope and its impact on fuel logistics and global ETA volatility.'
  },
  {
    id: '2',
    title: 'North Atlantic Environmental Drift Patterns',
    category: 'Weather',
    date: '2026-03-25',
    impact: 'Medium',
    summary: 'Analysis of abnormal current speed deviance in the North Atlantic and its effects on slow-steaming container optimization.'
  },
  {
    id: '3',
    title: 'Panama Canal: Drought Recovery Projections',
    category: 'Operational',
    date: '2026-03-20',
    impact: 'High',
    summary: 'Predictive modeling of draft restrictions and transit slot availability for Neo-Panamax vessels through 2026.'
  },
  {
    id: '4',
    title: 'Emerging Piracy Hotspots: Gulf of Guinea',
    category: 'Geopolitical',
    date: '2026-03-15',
    impact: 'High',
    summary: 'A tactical briefing on increased small-craft activity and Recommended Best Management Practices (BMP5) for the region.'
  },
];

export default function RAPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white sh">
              <FileSearch className="w-6 h-6" />
           </div>
           <h1 className="text-2xl font-black text-[#202124] tracking-tight uppercase">Research & Analysis Hub</h1>
        </div>
        <p className="text-[11px] text-[#5f6368] font-bold uppercase tracking-[0.2em] opacity-70">Strategic Intelligence Reports · Trend Analysis</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 border-[#c5d9fd] bg-gradient-to-br from-[#e8f0fe] to-white sh2 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1a73e8]" />
              <Badge className="bg-[#1a73e8] text-white text-[9px] font-black">AI FEATURED INSIGHT</Badge>
            </div>
            <h2 className="text-xl font-black text-[#1a73e8] uppercase tracking-tight leading-tight">
              The 2026 Green Corridor Initiative: <br/>Decarbonization Impact on Route ROI
            </h2>
            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
              Our latest AI-driven model suggests that vessels transitioning to Methanol-ready engines will see a 12% reduction in route risk scores by Q4 due to preferential berth access in Singapore and Rotterdam.
            </p>
            <button className="flex items-center gap-2 bg-[#1a73e8] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1669d6] transition-all sh-sm">
              Access Full Analysis <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none">
            <Globe className="w-full h-full scale-150 translate-x-10 translate-y-10" />
          </div>
        </Card>

        <Card className="p-6 border-border bg-white sh flex flex-col justify-center gap-4">
           <div className="space-y-1">
              <p className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-[0.2em]">Intel Confidence</p>
              <p className="text-3xl font-black text-[#202124]">98.4%</p>
           </div>
           <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-[#34a853] w-[98.4%]" />
              </div>
              <TrendingUp className="w-4 h-4 text-[#34a853]" />
           </div>
           <p className="text-[10px] text-[#5f6368] font-bold uppercase leading-tight">
             Calculated based on 4.2M daily AIS-S telemetry nodes and HOS data.
           </p>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList className="bg-[#f1f3f4] p-1 rounded-xl h-10">
            <TabsTrigger value="all" className="rounded-lg text-[9px] font-black uppercase tracking-widest px-4">All Briefings</TabsTrigger>
            <TabsTrigger value="geopolitical" className="rounded-lg text-[9px] font-black uppercase tracking-widest px-4">Geopolitical</TabsTrigger>
            <TabsTrigger value="operational" className="rounded-lg text-[9px] font-black uppercase tracking-widest px-4">Operational</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <button className="p-2 border rounded-xl hover:bg-slate-50 text-slate-400 transition-all"><Calendar className="w-4 h-4"/></button>
            <button className="p-2 border rounded-xl hover:bg-slate-50 text-slate-400 transition-all"><Download className="w-4 h-4"/></button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {REPORTS.map(report => (
            <Card key={report.id} className="p-5 border-border sh hover:border-[#4285f4] transition-all group bg-white overflow-hidden rounded-2xl">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                      report.impact === 'Critical' ? 'risk-critical' : (report.impact === 'High' ? 'risk-high' : 'risk-medium')
                    )}>
                      {report.impact} Impact
                    </span>
                    <span className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Globe className="w-3 h-3" /> {report.category}
                    </span>
                    <span className="text-[10px] text-[#bdc1c6] font-medium tracking-tighter">
                      Published {report.date}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#202124] uppercase tracking-tight group-hover:text-[#1a73e8] transition-colors">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {report.summary}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-5 py-2.5 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Download PDF
                  </button>
                  <button className="w-10 h-10 bg-[#f8f9fa] rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-[#1a73e8] group-hover:text-white transition-all sh-sm">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        {/* Simplified TabsContent for demonstration */}
        <TabsContent value="geopolitical">
           <div className="py-20 text-center text-slate-400 uppercase text-[10px] font-black tracking-widest border-2 border-dashed rounded-2xl">
             Filtering Tactical Geopolitical Briefings...
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
