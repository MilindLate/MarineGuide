
"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Bell, 
  Globe, 
  Key, 
  User, 
  ShieldAlert, 
  Smartphone, 
  Slack, 
  FileText,
  Save,
  LogOut,
  ChevronRight,
  Settings as SettingsIcon,
  Layers,
  Cloud
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    slack: true,
    aiReport: true,
    weather: true,
    lanes: false,
    labels: true,
    geofencing: true
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast({ 
      title: 'Tactical Preference Updated', 
      description: `${key.charAt(0).toUpperCase() + key.slice(1)} preference synchronized with server.`,
    });
  };

  const handleSave = () => {
    toast({
      title: 'Configuration Saved',
      description: 'All tactical and notification parameters have been updated.',
    });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Toaster />
      
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-[#1a73e8] flex items-center justify-center text-white sh-sm">
              <SettingsIcon className="w-6 h-6" />
           </div>
           <h1 className="text-2xl font-black text-[#202124] tracking-tight uppercase">System Configuration</h1>
        </div>
        <p className="text-[11px] text-[#5f6368] font-bold uppercase tracking-[0.2em] opacity-70">Maritime Intelligence Grid · Operation Preferences</p>
      </header>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-[#f1f3f4] p-1 rounded-xl mb-6 h-12 flex gap-1 w-fit">
          <TabsTrigger value="general" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:sh-sm">
            <User className="w-3 h-3 mr-2" /> General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:sh-sm">
            <Bell className="w-3 h-3 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="map" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:sh-sm">
            <Globe className="w-3 h-3 mr-2" /> Tactical Feed
          </TabsTrigger>
          <TabsTrigger value="api" className="rounded-lg text-[10px] font-black uppercase tracking-widest px-6 data-[state=active]:sh-sm">
            <Key className="w-3 h-3 mr-2" /> API Access
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-6">
            <TabsContent value="general" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-300">
              <Card className="p-6 border-border sh bg-white space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 border-2 border-white sh-sm">
                    <AvatarFallback className="bg-gradient-to-br from-[#4285f4] to-[#34a853] text-white font-black text-2xl">LM</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                       <h2 className="text-xl font-black text-[#202124]">Lars Maritime</h2>
                       <Badge className="bg-[#1a73e8] text-white text-[9px] h-4 font-black tracking-widest uppercase">PRO FEED</Badge>
                    </div>
                    <p className="text-sm text-[#5f6368] font-medium">Head of Operations · Global Logistics Command</p>
                    <div className="flex gap-2 pt-1">
                       <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-tight">Edit Profile</Button>
                       <Button variant="outline" size="sm" className="h-7 text-[10px] font-bold uppercase tracking-tight text-red-600 hover:text-red-700">Change PIN</Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dashed">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-widest">Organization</Label>
                    <Input defaultValue="MarineGuide Intelligence" className="bg-[#f8f9fa] border-0 font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-widest">Operational Email</Label>
                    <Input defaultValue="operations@marineguide.com" className="bg-[#f8f9fa] border-0 font-bold" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border sh bg-white space-y-4">
                <h3 className="text-xs font-black text-[#9aa0a6] uppercase tracking-[0.15em] flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5" /> Security Preferences
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-xl border border-transparent hover:border-slate-200 transition-all">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-[#202124]">Two-Factor Authentication</p>
                      <p className="text-[11px] text-[#5f6368] font-medium">Verify via satellite terminal SMS</p>
                    </div>
                    <Switch checked={true} onCheckedChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-xl border border-transparent hover:border-slate-200 transition-all">
                    <div className="space-y-0.5">
                      <p className="text-sm font-bold text-[#202124]">Dynamic Geofencing</p>
                      <p className="text-[11px] text-[#5f6368] font-medium">Auto-lock grid when outside designated mission zones</p>
                    </div>
                    <Switch checked={settings.geofencing} onCheckedChange={() => toggle('geofencing')} />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-300">
              <Card className="p-6 border-border sh bg-white space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-black text-[#9aa0a6] uppercase tracking-[0.15em]">Intelligence Delivery</h3>
                  <Badge variant="secondary" className="text-[9px] font-black uppercase">Live Routing Enabled</Badge>
                </div>
                
                <div className="space-y-1">
                  {[
                    { id: 'email', l: 'Tactical Email Briefs', d: 'Get critical mission updates via operational email', icon: <Bell className="w-4 h-4" /> },
                    { id: 'sms', l: 'SMS Crisis Alerts', d: 'Real-time text notifications for SEV-5 hazards', icon: <Smartphone className="w-4 h-4" /> },
                    { id: 'slack', l: 'Slack Operations Sync', d: 'Push mission telemetry to #maritime-ops', icon: <Slack className="w-4 h-4" /> },
                    { id: 'aiReport', l: 'Daily AI Strategic Report', d: 'Automated 06:00 briefing generation', icon: <FileText className="w-4 h-4" /> }
                  ].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 hover:bg-[#f8f9fa] rounded-xl transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white border sh-sm flex items-center justify-center text-[#1a73e8] group-hover:bg-[#1a73e8] group-hover:text-white transition-all">
                          {item.icon}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-[#202124]">{item.l}</p>
                          <p className="text-[11px] text-[#5f6368] font-medium">{item.d}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={settings[item.id as keyof typeof settings]} 
                        onCheckedChange={() => toggle(item.id as keyof typeof settings)} 
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-dashed space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-[11px] font-black text-[#9aa0a6] uppercase tracking-widest">Global Risk Threshold</Label>
                    <span className="text-[10px] font-black text-[#1a73e8] uppercase">Current Level: 80</span>
                  </div>
                  <select className="w-full p-3 bg-[#f8f9fa] border-0 rounded-xl text-sm font-bold outline-none focus:ring-1 focus:ring-[#1a73e8] transition-all">
                    <option>80 — CRITICAL INTELLIGENCE ONLY</option>
                    <option>60 — HIGH RISK & CRISIS ALERTS</option>
                    <option>40 — ALL SECTOR DISRUPTIONS</option>
                    <option>0 — ALL NETWORK TELEMETRY</option>
                  </select>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="map" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-300">
              <Card className="p-6 border-border sh bg-white space-y-6">
                <h3 className="text-xs font-black text-[#9aa0a6] uppercase tracking-[0.15em] flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Tactical Visualization Layers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'weather', l: 'Weather Overlay', d: 'Live satellite radar & wave height', icon: <Cloud className="w-4 h-4" /> },
                    { id: 'lanes', l: 'Shipping Corridors', d: 'Common global transit lanes', icon: <Navigation className="w-4 h-4" /> },
                    { id: 'labels', l: 'Vessel Identifiers', d: 'Real-time names on tactical grid', icon: <Ship className="w-4 h-4" /> },
                    { id: 'geofencing', l: 'Proximity Warnings', d: 'Visual alerts for distance violations', icon: <MapPin className="w-4 h-4" /> }
                  ].map(item => (
                    <div key={item.id} className="p-4 bg-[#f8f9fa] rounded-2xl border border-transparent hover:border-slate-200 transition-all flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                         <div className="w-9 h-9 rounded-lg bg-white border sh-sm flex items-center justify-center text-[#1a73e8]">{item.icon}</div>
                         <Switch 
                           checked={settings[item.id as keyof typeof settings]} 
                           onCheckedChange={() => toggle(item.id as keyof typeof settings)} 
                         />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-black text-[#202124] uppercase tracking-tight">{item.l}</p>
                        <p className="text-[11px] text-[#5f6368] font-medium leading-tight">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="mt-0 space-y-6 animate-in slide-in-from-left-4 duration-300">
              <Card className="p-6 border-border sh bg-white space-y-6">
                <h3 className="text-xs font-black text-[#9aa0a6] uppercase tracking-[0.15em] flex items-center gap-2">
                  <Key className="w-4 h-4" /> Data Access Tokens
                </h3>
                <div className="space-y-5">
                  {[
                    { l: 'Datalastic AIS Feed API', v: '••••••••••••••••••••••••', type: 'Primary AIS-S' },
                    { l: 'Google Gemini 2.5 Intelligence', v: '••••••••••••••••••••••••', type: 'GenAI Engine' },
                    { l: 'Open-Meteo Environmental', v: 'Free tier — No Auth Required', type: 'Weather Data', readOnly: true }
                  ].map(key => (
                    <div key={key.l} className="space-y-1.5 p-4 bg-[#f8f9fa] rounded-xl border border-dashed">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-widest">{key.l}</label>
                        <span className="text-[9px] font-bold text-[#1a73e8] opacity-70 uppercase tracking-tighter">{key.type}</span>
                      </div>
                      <div className="relative">
                        <Input 
                          type="password" 
                          value={key.v} 
                          readOnly 
                          className={cn("bg-white border-0 font-mono text-xs shadow-inner", key.readOnly && "italic text-slate-400")} 
                        />
                        {!key.readOnly && <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-tight h-7">Rotate</Button>}
                      </div>
                    </div>
                  ))}
                  <div className="bg-[#e8f0fe] p-4 rounded-xl border border-[#c5d9fd] flex items-start gap-3">
                     <ShieldAlert className="w-5 h-5 text-[#1a73e8] shrink-0 mt-0.5" />
                     <p className="text-[11px] font-bold text-[#1a73e8] leading-relaxed">
                       Keys are stored in an encrypted vault. Rotation is recommended every 90 days for continuous maritime compliance.
                     </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>

          <aside className="space-y-4">
            <Card className="p-5 border-border sh bg-white flex flex-col items-center text-center gap-4">
               <Avatar className="w-16 h-16 border-2 border-white sh-sm ring-2 ring-[#e8f0fe]">
                  <AvatarFallback className="bg-[#1a73e8] text-white font-black text-xl">LM</AvatarFallback>
               </Avatar>
               <div className="space-y-1">
                  <p className="text-sm font-black text-[#202124] uppercase tracking-tight">Lars Maritime</p>
                  <p className="text-[10px] text-[#9aa0a6] font-bold uppercase tracking-widest">ID: MG-992384-TACT</p>
               </div>
               <div className="w-full h-px bg-slate-100" />
               <div className="w-full space-y-2">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Plan Status</span>
                     <Badge variant="outline" className="text-[9px] font-bold border-[#4285f4] text-[#1a73e8]">Enterprise</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Nodes Monitored</span>
                     <span className="text-[11px] font-black text-slate-900">100 / 500</span>
                  </div>
               </div>
               <Button onClick={handleSave} className="w-full bg-[#1a73e8] text-white text-[10px] font-black uppercase tracking-widest h-10 rounded-xl hover:bg-[#1669d6] sh-sm">
                  <Save className="w-3.5 h-3.5 mr-2" /> Commit Changes
               </Button>
            </Card>

            <Card className="p-4 border-[#f5c6c2] bg-[#fce8e6]/30 flex flex-col gap-3">
               <p className="text-[10px] font-black text-[#c5221f] uppercase tracking-widest text-center">Protocol Actions</p>
               <Button variant="ghost" className="w-full text-[10px] font-black text-[#c5221f] hover:bg-red-100 hover:text-red-700 uppercase tracking-widest transition-all">
                  <LogOut className="w-3.5 h-3.5 mr-2" /> Deauthorize Terminal
               </Button>
            </Card>

            <div className="p-4 text-center">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">MarineGuide Intelligence v2.0.4</p>
               <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Access Only</p>
            </div>
          </aside>
        </div>
      </Tabs>
    </div>
  );
}
