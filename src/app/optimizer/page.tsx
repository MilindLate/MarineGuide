
"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Search, Loader2, Sparkles, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function OptimizerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const startAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setShowOptions(true);
      toast({ title: 'Route Analysis Complete', description: '3 optimized route options generated.' });
    }, 1800);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <Toaster />
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#202124]">🧭 Route Optimizer</h1>
        <p className="text-sm text-[#5f6368]">AI-powered dynamic rerouting recommendations</p>
      </div>

      <Card className="p-6 border-border sh">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-wider">Origin Port</label>
            <select className="w-full p-2.5 bg-[#f8f9fa] border rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#4285f4]">
              <option>Shanghai (CN SHA)</option>
              <option>Singapore (SG SIN)</option>
              <option>Mumbai (IN BOM)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-wider">Destination Port</label>
            <select className="w-full p-2.5 bg-[#f8f9fa] border rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#4285f4]">
              <option>Rotterdam (NL RTM)</option>
              <option>Hamburg (DE HAM)</option>
              <option>New York (US NYC)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-wider">Vessel Type</label>
            <select className="w-full p-2.5 bg-[#f8f9fa] border rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#4285f4]">
              <option>Container Ship</option>
              <option>Oil Tanker</option>
              <option>Bulk Carrier</option>
            </select>
          </div>
          <button 
            onClick={startAnalysis}
            disabled={analyzing}
            className="w-full bg-[#4285f4] text-white rounded-full py-2.5 font-bold text-sm hover:bg-[#1a73e8] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            {analyzing ? 'Analyzing...' : 'Analyze ↗'}
          </button>
        </div>
      </Card>

      {showOptions && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-[#202124]">3 Route Options Found — AI recommends Option 2</p>
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Via Suez Canal', dist: '11,200nm', eta: '+0 days', cost: '+$0', risk: 91, level: 'Critical' },
              { name: 'Via Cape of Good Hope', dist: '14,800nm', eta: '+4.2 days', cost: '+$42k', risk: 28, level: 'Low', rec: true },
              { name: 'Via Cape Horn', dist: '15,600nm', eta: '+5.8 days', cost: '+$58k', risk: 34, level: 'Low' },
            ].map((route, i) => (
              <Card 
                key={route.name} 
                onClick={() => toast({ title: 'Route Selected', description: `${route.name} has been set for fleet deployment.` })}
                className={cn(
                  "p-5 border cursor-pointer hover:-translate-y-1 transition-all sh group",
                  route.rec ? "border-[#34a853] border-2 ring-4 ring-[#e6f4ea]" : "border-border hover:border-[#4285f4]"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#202124]">{route.name}</h3>
                    {route.rec && <span className="text-[10px] font-bold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full mt-1 inline-block">✦ AI RECOMMENDED</span>}
                  </div>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border sh",
                    route.risk > 80 ? "risk-critical" : "risk-low"
                  )}>
                    {route.risk}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-wider">Distance</p>
                    <p className="text-sm font-bold text-[#202124]">{route.dist}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-wider">ETA Delta</p>
                    <p className="text-sm font-bold text-[#202124]">{route.eta}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-wider">Cost Delta</p>
                    <p className="text-sm font-bold text-[#202124]">{route.cost}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-wider">Risk Level</p>
                    <p className={cn("text-sm font-bold", route.risk > 80 ? "text-[#ea4335]" : "text-[#34a853]")}>{route.level}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
