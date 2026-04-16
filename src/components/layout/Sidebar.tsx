
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Globe, 
  Ship, 
  Anchor, 
  Building2,
  Navigation,
  ShieldAlert,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom Lighthouse Icon
const LighthouseIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2L9 22H15L12 2Z" />
    <path d="M11 5H13" />
    <path d="M10 8H14" />
    <path d="M9 11H15" />
    <path d="M11 2h2" />
    <circle cx="12" cy="4" r="1" fill="currentColor" />
    <path d="M7 22h10" />
  </svg>
);

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Map', href: '/map', icon: <Globe className="w-4 h-4" /> },
  { label: 'Vessels', href: '/fleet', icon: <Ship className="w-4 h-4" /> },
  { label: 'Ports', href: '/ports', icon: <Anchor className="w-4 h-4" /> },
  { label: 'Lighthouses', href: '#', icon: <LighthouseIcon className="w-4 h-4" /> },
  { label: 'Companies', href: '#', icon: <Building2 className="w-4 h-4" /> },
];

const SECONDARY_NAV = [
  { label: 'Route Optimizer', href: '/optimizer', icon: <Navigation className="w-4 h-4" /> },
  { label: 'Risk Alerts', href: '/alerts', icon: <ShieldAlert className="w-4 h-4" /> },
  { label: 'Settings', href: '/settings', icon: <Settings className="w-4 h-4" /> },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-white border-r h-full flex flex-col pt-6 overflow-y-auto">
      <div className="px-4 space-y-1">
        <p className="px-4 mb-2 text-[10px] font-black text-[#9aa0a6] uppercase tracking-[0.2em]">Operations</p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all group",
                isActive 
                  ? "bg-[#3c4043] text-white shadow-md" 
                  : "text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]"
              )}
            >
              <div className={cn("transition-colors", isActive ? "text-white" : "text-[#5f6368] group-hover:text-[#202124]")}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="px-4 mt-8 space-y-1">
        <p className="px-4 mb-2 text-[10px] font-black text-[#9aa0a6] uppercase tracking-[0.2em]">Intelligence</p>
        {SECONDARY_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all group",
                isActive 
                  ? "bg-[#1a73e8] text-white shadow-md" 
                  : "text-[#5f6368] hover:bg-[#f1f3f4] hover:text-[#202124]"
              )}
            >
              <div className={cn("transition-colors", isActive ? "text-white" : "text-[#5f6368] group-hover:text-[#202124]")}>
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-auto px-4 pb-6 pt-4 border-t border-dashed bg-slate-50/50">
         <div className="p-4 bg-white rounded-xl border border-dashed text-center sh-sm">
            <p className="text-[10px] font-black text-[#9aa0a6] uppercase tracking-widest mb-2">AIS Status</p>
            <div className="flex items-center justify-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-[#34a853] status-pulse shadow-[0_0_8px_rgba(52,168,83,0.5)]" />
               <span className="text-[10px] font-black text-[#202124] uppercase tracking-tighter">Live Satellite</span>
            </div>
         </div>
      </div>
    </aside>
  );
}
