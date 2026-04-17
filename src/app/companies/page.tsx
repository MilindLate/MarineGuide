
"use client";

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Building2, Search, Ship, MapPin, TrendingUp, ShieldAlert, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const COMPANIES = [
  { id: '1', name: 'Maersk Line', vessels: 730, active: 680, risk: 42, headquarters: 'Copenhagen, DK', marketShare: '14.8%' },
  { id: '2', name: 'MSC', vessels: 800, active: 750, risk: 48, headquarters: 'Geneva, CH', marketShare: '19.7%' },
  { id: '3', name: 'CMA CGM', vessels: 590, active: 540, risk: 55, headquarters: 'Marseille, FR', marketShare: '12.5%' },
  { id: '4', name: 'Hapag-Lloyd', vessels: 250, active: 230, risk: 38, headquarters: 'Hamburg, DE', marketShare: '6.8%' },
  { id: '5', name: 'COSCO Shipping', vessels: 480, active: 450, risk: 62, headquarters: 'Shanghai, CN', marketShare: '10.9%' },
  { id: '6', name: 'Evergreen Marine', vessels: 210, active: 195, risk: 44, headquarters: 'Taipei, TW', marketShare: '6.0%' },
];

export default function CompaniesPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return COMPANIES.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.headquarters.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white sh">
              <Building2 className="w-6 h-6" />
           </div>
           <h1 className="text-2xl font-black text-[#202124] tracking-tight uppercase">Strategic Partner Network</h1>
        </div>
        <p className="text-[11px] text-[#5f6368] font-bold uppercase tracking-[0.2em] opacity-70">Corporate Fleet Intelligence · Performance Monitoring</p>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Carrier, Region, or Market segment..."
          className="w-full pl-11 pr-4 py-3 bg-white border rounded-2xl text-sm sh focus:ring-2 focus:ring-[#4285f4]/20 outline-none transition-all font-medium"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(company => (
          <Card key={company.id} className="p-0 border-border sh hover:-translate-y-1 transition-all group bg-white overflow-hidden rounded-2xl">
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-base font-black text-[#202124] uppercase tracking-tight">{company.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#9aa0a6]" />
                    <span className="text-[10px] font-bold text-[#5f6368] uppercase tracking-widest">{company.headquarters}</span>
                  </div>
                </div>
                <Badge className="bg-[#e8f0fe] text-[#1a73e8] border-[#c5d9fd] text-[9px] font-black h-5">
                  {company.marketShare} MS
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                    <Ship className="w-2.5 h-2.5" /> Fleet Size
                  </div>
                  <p className="text-sm font-black text-slate-900">{company.vessels}</p>
                </div>
                <div className="p-3 bg-[#f8f9fa] rounded-xl border border-slate-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                    <TrendingUp className="w-2.5 h-2.5" /> Active Missions
                  </div>
                  <p className="text-sm font-black text-[#34a853]">{company.active}</p>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldAlert className="w-2.5 h-2.5" /> Fleet Risk Index
                  </span>
                  <span className={cn(
                    "text-[10px] font-black uppercase",
                    company.risk > 60 ? 'text-[#ea4335]' : (company.risk > 40 ? 'text-[#fbbc04]' : 'text-[#34a853]')
                  )}>
                    {company.risk} RI
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-1000",
                      company.risk > 60 ? 'bg-[#ea4335]' : (company.risk > 40 ? 'bg-[#fbbc04]' : 'bg-[#34a853]')
                    )}
                    style={{ width: `${company.risk}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t bg-slate-50/50 flex justify-between items-center">
              <span className="text-[9px] font-black text-[#9aa0a6] uppercase tracking-widest">Mission Critical Provider</span>
              <button className="text-[10px] font-black text-[#1a73e8] hover:underline uppercase tracking-tighter flex items-center gap-1">
                View Fleet <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
