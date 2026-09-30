import React, { useState } from 'react';
import { 
  Flame, 
  Zap, 
  Snowflake, 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  Copy, 
  Check, 
  Send, 
  Share2, 
  Bot, 
  ShieldAlert, 
  Compass, 
  RefreshCw,
  FileText,
  User,
  Calendar,
  Layers,
  Edit3,
  Save,
  Printer
} from 'lucide-react';
import LeadCopilotChat from './LeadCopilotChat';
import DealAcceleratorTab from './DealAcceleratorTab';
import BuyerTrustAuditModal from './BuyerTrustAuditModal';

export default function LeadDetailView({ 
  lead, 
  onUpdateLead, 
  onReanalyzeLead, 
  isReanalyzing,
  onUpdateChatHistory 
}) {
  const [activeTab, setActiveTab] = useState('intelligence'); // 'intelligence' | 'copilot' | 'accelerator'
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [leadStatus, setLeadStatus] = useState(lead?.status || 'New');
  const [salespersonNote, setSalespersonNote] = useState(lead?.notes || '');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  if (!lead) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8 text-center text-slate-500">
        <div>
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Lead Selected</h3>
          <p className="text-xs text-slate-500 mt-1">Select a lead from the list on the left or click "+ Intake Lead"</p>
        </div>
      </div>
    );
  }

  const ai = lead.aiAnalysis || {};
  const score = ai.score || 50;
  const priority = ai.priority || 'WARM';

  const handleCopyResponse = () => {
    if (ai.suggestedResponse) {
      navigator.clipboard.writeText(ai.suggestedResponse);
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleStatusChange = (newStatus) => {
    setLeadStatus(newStatus);
    if (onUpdateLead) {
      onUpdateLead(lead.id, { ...lead, status: newStatus });
    }
  };

  const handleSaveNote = () => {
    setIsSavingNote(true);
    if (onUpdateLead) {
      onUpdateLead(lead.id, { ...lead, notes: salespersonNote });
    }
    setTimeout(() => setIsSavingNote(false), 600);
  };

  const getScoreColor = (sc) => {
    if (sc >= 80) return 'text-red-600 bg-red-50 border-red-200';
    if (sc >= 50) return 'text-amber-600 bg-amber-50 border-amber-300';
    return 'text-slate-600 bg-slate-100 border-slate-300';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#eaeded] overflow-y-auto">
      
      {/* 1. Header Bar: Fast 5-Second Scan */}
      <div className="bg-white border-b border-[#d5dbdb] p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Lead Identity & Core Meta */}
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{lead.name}</h1>
              
              {/* Score Meter Pill */}
              <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-2xs ${getScoreColor(score)}`}>
                {priority === 'HOT' ? <Flame className="w-4 h-4 fill-red-500 text-red-500" /> : priority === 'WARM' ? <Zap className="w-4 h-4 text-amber-600" /> : <Snowflake className="w-4 h-4 text-slate-500" />}
                <span>AI Score: {score}/100 ({priority} PRIORITY)</span>
              </div>

              {/* Urgency Pill */}
              {ai.urgency && (
                <div className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{ai.urgency}</span>
                </div>
              )}

              {/* Pipeline Stage Dropdown */}
              <div className="flex items-center gap-1.5 ml-2">
                <span className="text-xs text-slate-500 font-medium">Stage:</span>
                <select
                  value={leadStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-300 rounded px-2 py-0.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#ec7211]"
                >
                  <option value="New">📥 New Lead</option>
                  <option value="Contacted">📞 Contacted</option>
                  <option value="Tour Scheduled">🏡 Tour Scheduled</option>
                  <option value="Negotiation">🤝 Negotiation / Offer</option>
                  <option value="Under Contract">📄 Under Contract</option>
                  <option value="Closed Won">🎉 Closed Won</option>
                </select>
              </div>
            </div>

            {/* Subtitle location & requirement */}
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-2 flex-wrap font-medium">
              <span className="flex items-center gap-1 text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {lead.location}
              </span>
              <span>•</span>
              <span className="text-slate-800 font-semibold">{lead.propertyRequirement}</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">{lead.budget}</span>
              <span>•</span>
              <span className="text-slate-600">{lead.buyingTimeline}</span>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuditOpen(true)}
              className="btn-secondary text-xs flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50"
              title="View non-technical scoring audit breakdown for client calls"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Explain Score (Audit)</span>
            </button>
            <button
              onClick={() => onReanalyzeLead(lead)}
              disabled={isReanalyzing}
              className="btn-secondary text-xs"
              title="Re-run AI model evaluation"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReanalyzing ? 'animate-spin text-[#ec7211]' : 'text-slate-500'}`} />
              <span>{isReanalyzing ? 'Analyzing...' : 'Re-Qualify'}</span>
            </button>
            <button
              onClick={handleCopyResponse}
              className="btn-primary text-xs"
            >
              {copiedResponse ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
              <span>{copiedResponse ? 'Copied Reply!' : 'Copy Suggested Reply'}</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 mt-6 border-b border-slate-200 -mb-5 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'intelligence' 
                ? 'border-[#ec7211] text-[#ec7211]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Lead Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'copilot' 
                ? 'border-[#ec7211] text-[#ec7211]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Conversational Copilot</span>
            <span className="text-[10px] bg-blue-100 text-[#0972d3] px-1.5 py-0.2 rounded font-mono">
              Live Chat
            </span>
          </button>

          <button
            onClick={() => setActiveTab('accelerator')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'accelerator' 
                ? 'border-[#ec7211] text-[#ec7211]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Deal Accelerator Suite</span>
            <span className="text-[10px] bg-[#ec7211]/10 text-[#ec7211] font-bold px-1.5 py-0.2 rounded">
              Invented Feature
            </span>
          </button>
        </div>

      </div>

      {/* 2. Tab Content Area */}
      <div className="p-6 flex-1">
        
        {/* TAB 1: AI LEAD INTELLIGENCE */}
        {activeTab === 'intelligence' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            
            {/* Top Critical Action Callout (Recommended Next Action) */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg p-4 shadow-md flex items-start gap-3.5">
              <div className="p-2 rounded-md bg-white/20 text-white shrink-0 mt-0.5">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-orange-100">
                    Recommended Next Action
                  </span>
                  <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded font-mono font-semibold">
                    HIGH PRIORITY
                  </span>
                </div>
                <p className="text-sm font-semibold text-white mt-1 leading-snug">
                  {ai.recommendedNextAction || 'Contact lead immediately to confirm showing schedule.'}
                </p>
              </div>
            </div>

            {/* Grid 2-Column: Summary & Intent / Customer Message */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Executive Summary & Customer Intent */}
              <div className="card-enterprise p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ec7211]" />
                    AI Lead Summary & Intent
                  </h3>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    Model Qualified
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Executive Summary
                    </label>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded border border-slate-200">
                      {ai.leadSummary}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Customer Intent & Motivation
                    </label>
                    <div className="bg-blue-50/70 border border-blue-200 p-3 rounded flex items-center gap-2 text-xs font-semibold text-[#033160]">
                      <span className="text-base">🎯</span>
                      <span>{ai.customerIntent}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inbound Customer Message / Raw Inquiry */}
              <div className="card-enterprise p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    Inbound Customer Message / Transcript
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Channel: {lead.channel || 'Direct Inbound'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-52 overflow-y-auto whitespace-pre-wrap italic">
                  "{lead.customerMessage}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Received: {new Date(lead.receivedAt).toLocaleDateString()}</span>
                  <span className="font-semibold text-slate-700">{lead.location}</span>
                </div>
              </div>

            </div>

            {/* Grid 2-Column: Key Requirements vs Objections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Key Requirements */}
              <div className="card-enterprise p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Key Requirements & Specs</h3>
                </div>

                <ul className="space-y-2 text-xs">
                  {ai.keyRequirements?.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded border border-emerald-100">
                      <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 font-medium">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Objections & Concerns */}
              <div className="card-enterprise p-5 space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900">Potential Objections & Hesitations</h3>
                </div>

                <ul className="space-y-2 text-xs">
                  {ai.objections?.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded border border-amber-200/60">
                      <span className="text-amber-600 font-bold mt-0.5">•</span>
                      <span className="text-slate-800 font-medium">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Suggested Response to Customer */}
            <div className="card-enterprise p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#ec7211]/10 text-[#ec7211]">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Suggested Response to Customer</h3>
                    <p className="text-xs text-slate-500">AI crafted personalized draft ready for immediate dispatch</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyResponse}
                    className="btn-secondary text-xs flex items-center gap-1.5"
                  >
                    {copiedResponse ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                    <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => {
                      const mailto = `mailto:?subject=${encodeURIComponent('Following up on your property inquiry')}&body=${encodeURIComponent(ai.suggestedResponse || '')}`;
                      window.location.href = mailto;
                    }}
                    className="btn-primary text-xs flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {ai.suggestedResponse}
              </div>
            </div>

            {/* Private Salesperson Notes Card */}
            <div className="card-enterprise p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-slate-600" />
                  <h3 className="text-sm font-bold text-slate-900">Sales Representative Notes & Follow-up Log</h3>
                </div>
                <button
                  onClick={handleSaveNote}
                  className="btn-secondary text-xs flex items-center gap-1"
                >
                  <Save className="w-3 h-3 text-[#ec7211]" />
                  <span>{isSavingNote ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Add private deal notes, tour feedback, mortgage lender contacts, or negotiation milestones..."
                value={salespersonNote}
                onChange={(e) => setSalespersonNote(e.target.value)}
                className="w-full input-field text-xs leading-relaxed"
              />
            </div>

          </div>
        )}

        {/* TAB 2: CONVERSATIONAL COPILOT */}
        {activeTab === 'copilot' && (
          <div className="h-[75vh] max-w-5xl mx-auto">
            <LeadCopilotChat 
              lead={lead} 
              onUpdateChatHistory={onUpdateChatHistory}
            />
          </div>
        )}

        {/* TAB 3: DEAL ACCELERATOR SUITE */}
        {activeTab === 'accelerator' && (
          <div className="max-w-6xl mx-auto">
            <DealAcceleratorTab lead={lead} />
          </div>
        )}

      </div>

      {/* Buyer Trust & AI Explainability Audit Modal */}
      <BuyerTrustAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        lead={lead}
      />

    </div>
  );
}
