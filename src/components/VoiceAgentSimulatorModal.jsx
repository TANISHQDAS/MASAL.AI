import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  VolumeX, 
  Mic, 
  Sparkles, 
  X, 
  Bot, 
  User, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Play,
  RotateCcw
} from 'lucide-react';

const SIMULATED_CALL_SCENARIOS = [
  {
    title: 'Luxury Cash Relocation Inbound Call',
    callerName: 'Harrison Blake',
    callerPhone: '+1 (555) 382-9912',
    conversation: [
      { speaker: 'bot', text: "Hello! Thank you for calling Skyline Realty Advisory. My name is Maya, your AI concierge. How can I help you find your next property today?" },
      { speaker: 'user', text: "Hi Maya, I'm relocating from Chicago next month and looking for a high-floor penthouse or 4-bedroom condo overlooking the waterfront. Budget is around $2.8 million all-cash." },
      { speaker: 'bot', text: "That sounds like a wonderful move, Harrison. We have two off-market luxury penthouses with direct bay views and private elevator access within that range. Are you looking to close quickly?" },
      { speaker: 'user', text: "Yes, I need to close within 20 days. Can someone set up a private walkthrough this Thursday?" },
      { speaker: 'bot', text: "Absolutely. I have marked this as high priority for our senior luxury broker, who will call you back within 15 minutes to lock in the Thursday walkthrough." }
    ],
    leadData: {
      name: 'Harrison Blake',
      location: 'Waterfront / Harbor District',
      propertyRequirement: '4-Bed Luxury Penthouse with Direct Bay Views',
      budget: '$2,800,000 (All-Cash)',
      buyingTimeline: 'Immediate (Within 20 Days)',
      customerMessage: 'Inbound AI Voice Call Transcript: Harrison Blake is relocating from Chicago next month seeking a 4-bed high-floor waterfront penthouse under $2.8M cash. Needs a 20-day close and requested a private walkthrough for Thursday.'
    }
  },
  {
    title: 'First-Time Suburban Homebuyer Inbound Call',
    callerName: 'Jessica Morales',
    callerPhone: '+1 (555) 749-1102',
    conversation: [
      { speaker: 'bot', text: "Welcome to Oakridge Realty! I'm Maya, the AI assistant. Are you looking to buy, sell, or rent?" },
      { speaker: 'user', text: "Hi, we're looking to buy our first home in the West Suburbs. We have pre-approval for $850k and need 3 bedrooms with a fenced yard for our kids." },
      { speaker: 'bot', text: "Congratulations on taking the first step towards homeownership! Oakridge has fantastic school districts. Are you working with an existing agent or looking to tour soon?" },
      { speaker: 'user', text: "No agent yet, but interest rates make us a bit nervous so we'd love some guidance on rate buydown programs." },
      { speaker: 'bot', text: "Understood Jessica! We specialize in lender buydown incentives that can reduce your payments. I will have our family relocation specialist connect with you this afternoon." }
    ],
    leadData: {
      name: 'Jessica Morales',
      location: 'West Suburbs / Oakridge',
      propertyRequirement: '3-4 Bed Single Family Home with Fenced Yard',
      budget: '$850,000 (Pre-approved)',
      buyingTimeline: '45-60 Days',
      customerMessage: 'Inbound AI Voice Call Transcript: Jessica Morales seeking first family home in West Suburbs with fenced yard for kids. Pre-approved for $850k with interest rate anxiety; interested in lender rate buydowns.'
    }
  }
];

export default function VoiceAgentSimulatorModal({ isOpen, onClose, onIngestLead }) {
  const [selectedScenario, setSelectedScenario] = useState(SIMULATED_CALL_SCENARIOS[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [metrics, setMetrics] = useState({ latency: 310, audioQuality: '24kHz HD', sentiment: 'Positive' });
  const timerRef = useRef(null);

  const speakText = (text) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('SpeechSynthesis error:', e);
    }
  };

  const startSimulation = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    speakText(selectedScenario.conversation[0].text);
  };

  const stopSimulation = () => {
    setIsPlaying(false);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next < selectedScenario.conversation.length) {
          const item = selectedScenario.conversation[next];
          if (item.speaker === 'bot') {
            speakText(item.text);
          }
          // Fluctuate latency slightly to demonstrate real-time telemetry
          setMetrics(m => ({ ...m, latency: 280 + Math.floor(Math.random() * 60) }));
          return next;
        } else {
          setIsPlaying(false);
          clearInterval(timerRef.current);
          return prev;
        }
      });
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    };
  }, [isPlaying, selectedScenario]);

  if (!isOpen) return null;

  const handleIngestNow = () => {
    stopSimulation();
    onIngestLead(selectedScenario.leadData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#131a22] text-white px-6 py-4 flex items-center justify-between border-b border-[#232f3e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ec7211] flex items-center justify-center text-white shadow-md">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Live AI Voice Agent Call Simulator</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  LIVE DEMO TOOL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive real-time demonstration for non-technical buyers to hear & test the voice system live
              </p>
            </div>
          </div>
          <button 
            onClick={() => { stopSimulation(); onClose(); }}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telemetry Bar (FDE Live Diagnostics) */}
        <div className="bg-[#1f2a37] px-6 py-2 border-b border-slate-800 text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <Activity className="w-3.5 h-3.5" />
              Latency: <strong>{metrics.latency}ms</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              Audio Codec: <strong>{metrics.audioQuality}</strong>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              Voice Engine: <strong>ElevenLabs / WebSpeech</strong>
            </span>
          </div>
          
          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-2 py-1 rounded border border-slate-700"
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#ec7211]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span>{speechEnabled ? 'Browser Speech: ON' : 'Browser Speech: MUTED'}</span>
          </button>
        </div>

        {/* Scenario Picker */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Select Demo Scenario:</span>
            <div className="flex gap-2">
              {SIMULATED_CALL_SCENARIOS.map((sc, i) => (
                <button
                  key={i}
                  onClick={() => {
                    stopSimulation();
                    setSelectedScenario(sc);
                    setCurrentStep(0);
                  }}
                  className={`text-xs px-3 py-1 rounded transition font-medium border ${
                    selectedScenario.title === sc.title 
                      ? 'bg-[#ec7211] text-white border-[#ec7211] font-bold shadow-xs' 
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {sc.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                onClick={startSimulation}
                className="btn-primary text-xs flex items-center gap-1.5 px-3 py-1 font-bold"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Simulate Inbound Call</span>
              </button>
            ) : (
              <button
                onClick={stopSimulation}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded flex items-center gap-1.5 font-bold"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Simulation Call</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Audio & Transcript Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          
          {/* Active Call Status Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlaying ? 'bg-emerald-100 text-emerald-700 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedScenario.callerName}</h4>
                <p className="text-xs text-slate-500">{selectedScenario.callerPhone} • Inbound Line</p>
              </div>
            </div>

            {isPlaying ? (
              <div className="flex items-center gap-3">
                {/* Waveform indicator */}
                <div className="flex items-center gap-1">
                  <span className="w-1 h-5 bg-[#ec7211] animate-bounce"></span>
                  <span className="w-1 h-8 bg-[#ec7211] animate-bounce delay-100"></span>
                  <span className="w-1 h-4 bg-[#ec7211] animate-bounce delay-200"></span>
                  <span className="w-1 h-7 bg-[#ec7211] animate-bounce delay-75"></span>
                  <span className="w-1 h-3 bg-[#ec7211] animate-bounce delay-150"></span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Call In Progress ({currentStep + 1}/{selectedScenario.conversation.length})
                </span>
              </div>
            ) : (
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                Call Ready — Click "Simulate Inbound Call"
              </span>
            )}
          </div>

          {/* Transcript History */}
          <div className="space-y-3">
            {selectedScenario.conversation.map((msg, idx) => {
              const isRevealed = idx <= currentStep;
              const isCurrent = idx === currentStep && isPlaying;
              const isBot = msg.speaker === 'bot';

              if (!isRevealed) return null;

              return (
                <div
                  key={idx}
                  className={`flex gap-3 transition-all duration-300 ${isBot ? 'justify-start' : 'justify-end'} ${isCurrent ? 'scale-[1.01]' : ''}`}
                >
                  {isBot && (
                    <div className="w-8 h-8 rounded-full bg-[#131a22] text-[#ec7211] flex items-center justify-center shrink-0 border border-slate-700 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[80%] rounded-lg p-3 text-xs leading-relaxed shadow-xs ${
                    isBot 
                      ? 'bg-white text-slate-800 border border-slate-300' 
                      : 'bg-[#0972d3] text-white'
                  } ${isCurrent ? 'ring-2 ring-[#ec7211]' : ''}`}>
                    <div className="flex items-center justify-between text-[10px] font-bold mb-1 opacity-70">
                      <span>{isBot ? 'Maya (AI Voice Concierge)' : selectedScenario.callerName}</span>
                      {isCurrent && <span className="text-[#ec7211] uppercase font-bold animate-pulse">● Speaking</span>}
                    </div>
                    <p>{msg.text}</p>
                  </div>

                  {!isBot && (
                    <div className="w-8 h-8 rounded-full bg-[#0972d3] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer: 1-Click Ingest into CRM */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Demonstration Value:</span> Proves to non-technical buyers that voice calls translate immediately into scored CRM leads with zero manual data entry.
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { stopSimulation(); onClose(); }}
              className="btn-secondary text-xs"
            >
              Close
            </button>
            <button
              onClick={handleIngestNow}
              className="btn-primary text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Ingest Call Directly into Pipeline</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
