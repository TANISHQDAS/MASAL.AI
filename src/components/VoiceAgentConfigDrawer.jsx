import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Volume2, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  Cpu, 
  Activity, 
  Save, 
  RotateCcw,
  Sparkles,
  Zap,
  PhoneCall,
  Lock
} from 'lucide-react';

export default function VoiceAgentConfigDrawer({ isOpen, onClose, onSaveConfig }) {
  const [config, setConfig] = useState({
    agentName: 'Maya',
    tone: 'Warm, Professional & Consultative',
    voiceSpeed: '1.0x (Natural)',
    minEscalationBudget: '$1,500,000',
    transferCondition: 'All-cash liquidity or immediate 14-day timeline',
    handlingRateAnxiety: 'Offer 1% lender rate buydown incentive immediately',
    guardrailsEnabled: true,
    telephonyProvider: 'Twilio SIP / WebRTC Audio Streaming',
    turnTakingLatency: '290ms'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    if (onSaveConfig) onSaveConfig(config);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#131a22] text-white px-6 py-4 flex items-center justify-between border-b border-[#232f3e]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#ec7211] flex items-center justify-center text-white">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Voice System Configurator & Diagnostics</h3>
              <p className="text-xs text-slate-400">Configure parameters live with agency buyers during client demo calls</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live System Diagnostics Bar */}
        <div className="bg-[#1f2a37] px-6 py-2 border-b border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <Activity className="w-3.5 h-3.5" />
              SIP Trunk: Connected
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-mono">
              Avg TTFT: <strong>{config.turnTakingLatency}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-mono">
              Packet Loss: 0.0%
            </span>
          </div>
          <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-amber-300 border border-slate-700">
            FDE Live Mode
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* Agent Persona & Tone */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Volume2 className="w-3.5 h-3.5 text-[#ec7211]" />
              Voice Persona & Conversational Style
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Agent Name</label>
                <input
                  type="text"
                  value={config.agentName}
                  onChange={e => setConfig({ ...config, agentName: e.target.value })}
                  className="w-full input-field"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Voice Tone & Cadence</label>
                <select
                  value={config.tone}
                  onChange={e => setConfig({ ...config, tone: e.target.value })}
                  className="w-full input-field"
                >
                  <option value="Warm, Professional & Consultative">Warm, Professional & Consultative</option>
                  <option value="Concise, Direct & Fast">Concise, Direct & Fast (High Volume)</option>
                  <option value="Luxury Private Client Advisory">Luxury Private Client Advisory</option>
                  <option value="Supportive & Educational">Supportive & Educational (First-Time Buyers)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Business Qualification Thresholds */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Zap className="w-3.5 h-3.5 text-[#ec7211]" />
              Automated Broker Escalation & Transfer Rules
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Immediate Broker Transfer Budget</label>
                <input
                  type="text"
                  value={config.minEscalationBudget}
                  onChange={e => setConfig({ ...config, minEscalationBudget: e.target.value })}
                  className="w-full input-field"
                  placeholder="e.g. $1,500,000"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Transfer Trigger Criteria</label>
                <input
                  type="text"
                  value={config.transferCondition}
                  onChange={e => setConfig({ ...config, transferCondition: e.target.value })}
                  className="w-full input-field"
                  placeholder="e.g. All-Cash or 14-day close"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Custom Objection Handling Prompt Override</label>
              <textarea
                rows={2}
                value={config.handlingRateAnxiety}
                onChange={e => setConfig({ ...config, handlingRateAnxiety: e.target.value })}
                className="w-full input-field"
                placeholder="How the voice agent responds to interest rate objections..."
              />
            </div>
          </div>

          {/* Reliability & Guardrails */}
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900">Anti-Hallucination Real Estate Guardrails</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                ACTIVE
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Guarantees the AI voice agent strictly quotes verified MLS listings and never makes unauthorized pricing or legal commitments over the phone.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Settings Saved Live!' : 'Apply Configuration to Voice Agent'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
