
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutGrid, 
  Map as MapIcon, 
  Bell, 
  Navigation, 
  MapPin, 
  Users, 
  MessageSquare, 
  Settings,
  Ship
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const SECTIONS = [
  {
    label: 'MONITOR',
    items: [
      { label: 'Dashboard', href: '/', icon: <LayoutGrid className="w-4 h-4" /> },
      { label: 'Live Map', href: '/map', icon: <MapIcon className="w-4 h-4" /> },
      { label: 'Alerts', href: '/alerts', icon: <Bell className="w-4 h-4" />, badge: '10' },
    ]
  },
  {
    label: 'OPTIMIZE',
    items: [
      { label: 'Route Optimizer', href: '/optimizer', icon: <Navigation className="w-4 h-4" /> },
      { label: 'Port Status', href: '/ports', icon: <MapPin className="w-4 h-4" /> },
    ]
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { label: 'Fleet Tracker', href: '/fleet', icon: <Ship className="w-4 h-4" /> },
      { label: 'AI Assistant', href: '/assistant', icon: <MessageSquare className="w-4 h-4" /> },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-white border-r h-full flex flex-col pt-4 overflow-y-auto">
      {SECTIONS.map((section, idx) => (
        <div key={section.label} className={cn("px-4 mb-6", idx === 0 ? "mt-2" : "")}>
          <h3 className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-[0.8px] mb-3 px-2">
            {section.label}
          </h3>
          <div className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex items-center justify-between px-3 py-2 rounded-[100px] text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-[#e8f0fe] text-[#1a73e8]" 
                      : "text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {isActive && <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#4285f4] rounded-r-full" />}
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#ea4335] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="mt-auto px-4 pb-6">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-[100px] text-sm font-medium transition-all",
            pathname === '/settings'
              ? "bg-[#e8f0fe] text-[#1a73e8]"
              : "text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124]"
          )}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
