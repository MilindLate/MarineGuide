
"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function Topbar() {
  return (
    <header className="h-[60px] bg-white border-b px-6 flex items-center justify-between sticky top-0 z-30 sh">
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-[#4285f4]" />
          <div className="w-3 h-3 rounded-full bg-[#ea4335]" />
          <div className="w-3 h-3 rounded-full bg-[#fbbc04]" />
          <div className="w-3 h-3 rounded-full bg-[#34a853]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-[#202124]">Marine<span className="logo-gradient">Guide</span></span>
          <span className="text-[10px] font-medium text-[#9aa0a6] bg-[#f8f9fa] px-2 py-0.5 rounded-full border">Maritime Intelligence v2.0</span>
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
          <input
            type="text"
            placeholder="Search vessels, ports, routes..."
            className="w-full h-9 pl-10 pr-4 bg-[#f8f9fa] border-0 rounded-[20px] text-sm focus:ring-1 focus:ring-[#4285f4] outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fce8e6] text-[#c5221f] border border-[#f5c6c2]">
            3 Critical
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fef7e0] text-[#b06000] border border-[#fde8a0]">
            7 High
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e6f4ea] text-[#137333] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#34a853] status-pulse" />
            Live
          </div>
        </div>
        <Avatar className="w-[34px] h-[34px] ring-2 ring-white cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarFallback className="bg-gradient-to-br from-[#4285f4] to-[#34a853] text-white text-xs font-bold">LM</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
