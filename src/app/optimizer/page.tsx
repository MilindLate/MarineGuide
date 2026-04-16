
"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Search, Loader2, Sparkles, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { aiRouteOptimization, type AiRouteOptimizationOutput } from '@/ai/flows/route-optimization-flow';
import { WORLD_PORT_NAMES } from '@/lib/maritime-data';

export default function OptimizerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AiRouteOptimizationOutput | null>(null);
  const [formData, setFormData] = useState({
    originPort: 'Shanghai',
    destinationPort: 'Rotterdam',
    vesselType: 'Container Ship'
  });

  const startAnalysis = async () => {
    setAnalyzing(true);
    setResults(null);
    try {
      const output = await aiRouteOptimization({
        originPort: formData.originPort,
        destinationPort: formData.destinationPort,
        vesselType: formData.vesselType
      });
      setResults(output);
      toast({ title: 'Route Analysis Complete', description: `${output.recommendations.length} optimized options generated.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Analysis Failed', description: 'Could not connect to the optimization intelligence engine.' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 h-full overflow-y-auto pb-20">
      <Toaster />
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#202124]">🧭 Tactical Route Optimizer</h1>
        <p className="text-sm text-[#5f6368]">AI-powered dynamic rerouting recommendations based on real-time risk data</p>
      </div>

      <Card className="p-6 border-border sh">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-wider">Origin Port</label>
            <select 
              value={formData.originPort}
              onChange={(e) => setFormData(prev => ({ ...prev, originPort: e.target.value }))}
              className="w-full p-2.5 bg-[#f8f9fa] border rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#4285f4]"
            >
              {WORLD_PORT_NAMES.slice(0, 20).map(port => <option key={port} value={port}>{port}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-wider">Destination Port</label>
            <select 
              value={formData.destinationPort}
              onChange={(e) => setFormData(prev => ({ ...prev, destinationPort: e.target.value }))}
              className="w-full p-2.5 bg-[#f8f9fa] border rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#4285f4]"
            >
              {WORLD_PORT_NAMES.slice(20, 40).map(port => <option key={port} value={port}>{port}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-wider">Vessel Type</label>
            <select 
              value={formData.vesselType}
              onChange={(e) => setFormData(prev => ({ ...prev, vesselType: e.target.value }))}
              className="w-full p-2.5 bg-[#f8f9fa] border rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#4285f4]"
            >
              <option value="Container Ship">Container Ship</option>
              <option value="Crude Oil Tanker">Oil Tanker</option>
              <option value="Bulk Carrier">Bulk Carrier</option>
              <option value="LNG Carrier">LNG Carrier</option>
            </select>
          </div>
          <button 
            onClick={startAnalysis}
            disabled={analyzing}
            className="w-full bg-[#4285f4] text-white rounded-full py-2.5 font-bold text-sm hover:bg-[#1a73e8] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            {analyzing ? 'Analyzing Risks...' : 'Optimize ↗'}
          </button>
        </div>
      </Card>

      {results && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="p-5 border-blue-100 bg-blue-50/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-900">AI Recommendation Intelligence</p>
                <p className="text-sm text-blue-800 leading-relaxed">{results.aiRecommendation}</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.recommendations.map((route, i) => (
              <Card 
                key={route.routeName} 
                className={cn(
                  "p-5 border cursor-pointer hover:-translate-y-1 transition-all sh group bg-white",
                  i === 0 ? "border-[#34a853] border-2 ring-4 ring-[#e6f4ea]" : "border-border hover:border-[#4285f4]"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#202124]">{route.routeName}</h3>
                    {i === 0 && <span className="text-[10px] font-bold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full mt-1 inline-block">✦ PRIMARY OPTION</span>}
                  </div>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border sh",
                    route.riskScore > 80 ? "risk-critical" : (route.riskScore > 60 ? "risk-high" : "risk-low")
                  )}>
                    {route.riskScore}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-wider">Distance</p>
                    <p className="text-sm font-bold text-[#202124]">{route.distanceNm} nm</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-wider">ETA Delta</p>
                    <p className="text-sm font-bold text-[#202124]">{route.etaDeltaDays > 0 ? `+${route.etaDeltaDays}` : route.etaDeltaDays} d</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-wider">Cost Delta</p>
                    <p className="text-sm font-bold text-[#202124]">${route.costDeltaUsd.toLocaleString()}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-wider">Risk Level</p>
                    <p className={cn("text-sm font-bold", route.riskScore > 80 ? "text-[#ea4335]" : "text-[#34a853]")}>{route.riskCategory}</p>
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
