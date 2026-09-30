import React from 'react';
import { 
  Building2, 
  Plus, 
  Sliders, 
  Sparkles, 
  Flame, 
  Database,
  ShieldCheck,
  Zap,
  TrendingUp,
  Layers,
  PhoneCall,
  Settings
} from 'lucide-react';

export default function Navbar({ 
  onNewLead, 
  onOpenSettings, 
  onOpenVoiceSimulator,
  onOpenVoiceConfig,
  leads = [], 
  currentFilter, 
  setCurrentFilter,
  apiConfig
}) {
  const hotCount = leads.filter(l => l.aiAnalysis?.priority === 'HOT').length;
  const warmCount = leads.filter(l => l.aiAnalysis?.priority === 'WARM').length;
  const totalCount = leads.length;

  return (
    <header className="bg-[#131a22] text-white border-b border-[#232f3e] sticky top-0 z-30 select-none shadow-md">
      {/* Top Primary Navigation Bar */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-[#232f3e]/80">
        <div className="flex items-center gap-4">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#ec7211] flex items-center justify-center text-white font-bold shadow-sm">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-white">LeadPulse AI</span>
                <span className="text-[10px] uppercase font-semibold bg-[#232f3e] text-[#ec7211] px-1.5 py-0.5 rounded border border-[#ec7211]/30">
                  Voice & Sales Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-400">AI Voice System Qualification & Real Estate Copilot</p>
            </div>
          </div>

          <div className="hidden md:block h-6 w-px bg-slate-700 mx-1"></div>

          {/* Pipeline Stats */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <div className="bg-[#232f3e] px-2.5 py-1 rounded text-slate-300 flex items-center gap-1.5 border border-slate-700/60">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Pipeline: <strong className="text-white">{totalCount}</strong></span>
            </div>
            <div className="bg-[#232f3e] px-2.5 py-1 rounded text-slate-300 flex items-center gap-1.5 border border-red-900/40">
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
              <span>Hot Leads: <strong className="text-red-400">{hotCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Live Voice Call Simulator (Interactive Demo for Buyers) */}
          <button
            onClick={onOpenVoiceSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition shadow-xs"
            title="Simulate live inbound voice call with speech audio"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Live Voice Demo</span>
          </button>

          {/* Voice System Configurator (Live FDE Client Tuning) */}
          <button
            onClick={onOpenVoiceConfig}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#232f3e] hover:bg-[#2d3b4e] text-xs text-slate-300 border border-slate-700 transition"
            title="Configure AI voice system parameters live during client calls"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Voice Config</span>
          </button>

          {/* Model Status Indicator */}
          <button 
            onClick={onOpenSettings}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#232f3e] hover:bg-[#2d3b4e] text-xs text-slate-300 border border-slate-700 transition"
            title="Configure AI API Key (Gemini / Groq)"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span className="text-[11px]">
              {apiConfig.apiKey ? 'Gemini 1.5 Active' : 'AI Active'}
            </span>
            <Sliders className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {/* Intake New Lead CTA */}
          <button
            onClick={onNewLead}
            className="btn-primary flex items-center gap-1.5 text-xs sm:text-sm font-semibold shadow-sm px-3.5 py-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Intake Lead</span>
          </button>
        </div>
      </div>

      {/* Pipeline Filter Bar */}
      <div className="bg-[#1f2a37] px-4 py-1.5 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-0.5">
          <span className="text-slate-400 font-medium hidden sm:inline">Filter Leads:</span>
          
          <button 
            onClick={() => setCurrentFilter('ALL')}
            className={`px-2.5 py-0.5 rounded transition ${currentFilter === 'ALL' ? 'bg-[#ec7211] text-white font-bold' : 'hover:bg-slate-700 text-slate-300'}`}
          >
            All Pipeline ({totalCount})
          </button>

          <button 
            onClick={() => setCurrentFilter('HOT')}
            className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition ${currentFilter === 'HOT' ? 'bg-red-600 text-white font-bold' : 'hover:bg-slate-700 text-red-300'}`}
          >
            🔥 Hot ({hotCount})
          </button>

          <button 
            onClick={() => setCurrentFilter('WARM')}
            className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition ${currentFilter === 'WARM' ? 'bg-amber-600 text-white font-bold' : 'hover:bg-slate-700 text-amber-300'}`}
          >
            ⚡ Warm ({warmCount})
          </button>

          <button 
            onClick={() => setCurrentFilter('COLD')}
            className={`px-2.5 py-0.5 rounded flex items-center gap-1 transition ${currentFilter === 'COLD' ? 'bg-slate-600 text-white font-bold' : 'hover:bg-slate-700 text-slate-300'}`}
          >
            ❄️ Nurture ({totalCount - hotCount - warmCount})
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> FDE Client-Facing Certified
          </span>
        </div>
      </div>
    </header>
  );
}
