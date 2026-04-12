
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Ship, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isAlert?: boolean;
}

export default function AIAssistantPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "👋 Hello! I'm MarineGuide's AI assistant powered by Claude. How can I help you with maritime intelligence today?" },
    { role: 'assistant', content: "🚨 Active alert: MSC Elena risk score 91. Red Sea corridor identified as high risk due to recent regional instability.", isAlert: true },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      let response = "I have analyzed your request based on current AIS and port data. How else can I assist?";
      const lower = userMsg.toLowerCase();
      
      if (lower.includes('red sea')) response = "The Red Sea corridor is currently under SEV 5 alert. Houthi-related threats are affecting MSC Elena and Alta Maya specifically. Rerouting via Cape of Good Hope is recommended for vessels with risk scores above 80.";
      else if (lower.includes('shanghai')) response = "Shanghai port is experiencing severe congestion with berth delays averaging 22 hours. 312 vessels are currently waiting. Average risk score for SHA operations is 82.";
      else if (lower.includes('suez')) response = "Suez Canal transits are proceeding at a reduced pace. Canal fees have recently increased, and we have updated our route cost models accordingly.";
      else if (lower.includes('msc elena')) response = "MSC Elena is currently at risk score 91. It is positioned near the Bab el-Mandeb strait. Speed is 14.2 kn. We recommend immediate tactical advisory.";

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsThinking(false);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa]">
      <header className="shrink-0 bg-white border-b px-6 py-3 flex items-center justify-between sh">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#202124]">✦ AI Maritime Assistant</h1>
            <p className="text-[10px] text-[#9aa0a6] font-medium">Powered by Claude 3.5 Sonnet</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-[#34a853] bg-[#e6f4ea] px-2 py-0.5 rounded-full border border-[#b7e1c4]">Online</span>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
            <Avatar className="w-8 h-8 shrink-0 sh">
              <AvatarFallback className={cn("text-[10px] font-bold", msg.role === 'user' ? "bg-[#4285f4] text-white" : "bg-white text-[#1a73e8] border")}>
                {msg.role === 'user' ? 'LM' : 'AI'}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "max-w-[70%] p-4 text-[13px] leading-[1.6] sh border",
              msg.role === 'user' 
                ? "bg-[#4285f4] text-white rounded-[16px_16px_4px_16px] border-[#1a73e8]" 
                : "bg-white text-[#202124] rounded-[16px_16px_16px_4px]",
              msg.isAlert && "bg-[#fce8e6] border-[#f5c6c2] text-[#c5221f]"
            )}>
              {msg.content}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 shrink-0 sh"><AvatarFallback className="bg-white text-[#1a73e8] border font-bold text-[10px]">AI</AvatarFallback></Avatar>
            <div className="bg-white p-3 rounded-2xl sh border flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#1a73e8]" />
              <span className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-wider">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 p-4 bg-white border-t sh">
        <div className="max-w-4xl mx-auto relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Red Sea risk, Shanghai congestion, or route optimization..."
            className="w-full pl-6 pr-16 py-3.5 bg-[#f8f9fa] border-0 rounded-full text-sm outline-none focus:ring-1 focus:ring-[#4285f4] transition-all"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#4285f4] text-white rounded-full flex items-center justify-center hover:bg-[#1a73e8] transition-all sh"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
