"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    slack: true,
    aiReport: true,
    weather: true,
    lanes: false,
    labels: true
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast({ title: 'Setting Updated', description: 'Preferences saved successfully.' });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <Toaster />
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#202124]">⚙️ Settings</h1>
        <p className="text-sm text-[#5f6368]">Configure alerts, notifications, and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="p-6 border-border sh space-y-4">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider">Alert Preferences</h3>
            <div className="space-y-4">
              {[
                { id: 'email', l: 'Email Alerts', d: 'Get critical alerts via email' },
                { id: 'sms', l: 'SMS Alerts', d: 'Real-time text notifications' },
                { id: 'slack', l: 'Slack Notifications', d: 'Push to #maritime-ops channel' },
                { id: 'aiReport', l: 'Daily AI Report', d: 'Automated briefing generation' }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-[#202124]">{item.l}</p>
                    <p className="text-[11px] text-[#5f6368]">{item.d}</p>
                  </div>
                  <Switch 
                    checked={settings[item.id as keyof typeof settings]} 
                    onCheckedChange={() => toggle(item.id as keyof typeof settings)} 
                  />
                </div>
              ))}
              <div className="pt-2 border-t space-y-1.5">
                <label className="text-[11px] font-bold text-[#9aa0a6] uppercase">Alert Threshold</label>
                <select className="w-full p-2 bg-[#f8f9fa] border rounded-lg text-sm outline-none">
                  <option>80 — Critical Only</option>
                  <option>60 — High & Above</option>
                  <option>40 — All Warnings</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border sh space-y-4">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider">Map Preferences</h3>
            <div className="space-y-4">
              {[
                { id: 'weather', l: 'Weather Overlay', d: 'Show live satellite radar' },
                { id: 'lanes', l: 'Shipping Lanes', d: 'Display common global lanes' },
                { id: 'labels', l: 'Vessel Labels', d: 'Show names on high-risk ships' }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-[#202124]">{item.l}</p>
                    <p className="text-[11px] text-[#5f6368]">{item.d}</p>
                  </div>
                  <Switch 
                    checked={settings[item.id as keyof typeof settings]} 
                    onCheckedChange={() => toggle(item.id as keyof typeof settings)} 
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-border sh space-y-6">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider">API Keys</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#9aa0a6] uppercase">Datalastic AIS API Key</label>
                <Input type="password" value="••••••••••••••••" readOnly className="bg-[#f8f9fa]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#9aa0a6] uppercase">Anthropic Claude API Key</label>
                <Input type="password" value="••••••••••••••••" readOnly className="bg-[#f8f9fa]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#9aa0a6] uppercase">Open-Meteo</label>
                <Input value="Free tier — No Auth Required" readOnly className="bg-[#f8f9fa] italic text-[#9aa0a6]" />
              </div>
              <button className="w-full bg-[#4285f4] text-white py-2.5 rounded-full font-bold text-xs hover:bg-[#1a73e8] transition-all sh mt-2">
                Save Keys
              </button>
            </div>
          </Card>

          <Card className="p-6 border-border sh space-y-4">
            <h3 className="text-xs font-bold text-[#9aa0a6] uppercase tracking-wider">Account</h3>
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 border shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-[#4285f4] to-[#34a853] text-white font-bold">LM</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-bold text-[#202124]">Lars Maritime</p>
                <p className="text-xs text-[#5f6368]">operations@marineguide.com</p>
              </div>
              <Badge className="bg-[#4285f4] text-white rounded-full px-3 py-1 text-[10px] uppercase font-bold tracking-wider">PRO</Badge>
            </div>
            <button className="w-full py-2 bg-[#f8f9fa] border rounded-full text-[11px] font-bold text-[#ea4335] hover:bg-[#fce8e6] transition-all mt-2">
              Sign Out
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}