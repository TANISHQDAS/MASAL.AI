import React, { useState } from 'react';
import { 
  PhoneCall, 
  ShieldCheck, 
  Sparkles, 
  Target, 
  Building, 
  MessageSquare, 
  Mail, 
  Share2, 
  Copy, 
  Check, 
  Zap, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Award
} from 'lucide-react';
import { MOCK_INVENTORY } from '../data/inventoryListings';

export default function DealAcceleratorTab({ lead }) {
  if (!lead) return null;
  const [copiedKey, setCopiedKey] = useState(null);

  // Compute matched properties
  const matchedListings = MOCK_INVENTORY.map(prop => {
    let matchScore = 70;
    const reqText = `${lead?.propertyRequirement || ''} ${lead?.location || ''} ${lead?.customerMessage || ''}`.toLowerCase();
    
    if (reqText.includes('penthouse') && prop.type.includes('Penthouse')) matchScore += 25;
    if (reqText.includes('family') && prop.type.includes('Single Family')) matchScore += 25;
    if (reqText.includes('invest') || reqText.includes('duplex') && prop.type.includes('Duplex')) matchScore += 25;
    if (reqText.includes('condo') && prop.type.includes('Condo')) matchScore += 20;

    return { ...prop, matchScore: Math.min(99, matchScore) };
  }).sort((a, b) => b.matchScore - a.matchScore);

  const [selectedProperty, setSelectedProperty] = useState(matchedListings[0]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const leadFirstName = (lead?.name || 'Lead').split(' ')[0] || 'Client';

  const battlecard = lead?.aiAnalysis?.battlecard || {
    buyerPersona: 'Active Buyer evaluating options in the current market.',
    openingHook: `Hi ${leadFirstName}, I have 2 listings ready that fit your exact ${lead?.propertyRequirement || 'property specs'} criteria.`,
    commonObjections: [
      {
        objection: 'Need to think about current market conditions.',
        rebuttal: 'We can structure clean contingency protections so you maintain full control of the transaction.'
      }
    ]
  };

  const currentProperty = selectedProperty || matchedListings[0];

  // Dispatch message templates
  const whatsappText = `Hi ${leadFirstName}! 🏡 Found a premier match for your ${lead?.propertyRequirement || 'search'} inquiry:\n\n*${currentProperty.title}* (${currentProperty.price})\n✨ ${currentProperty.highlights.slice(0, 2).join(' • ')}\n\nWould you like me to send over the private walkthrough?`;
  const emailSubject = `Exclusive Match for your ${lead?.propertyRequirement || 'property'} search — ${currentProperty.title}`;
  const emailBody = `Hi ${leadFirstName},\n\nThank you for reaching out regarding your property search in ${lead?.location || 'the area'}.\n\nBased on your criteria and timeline of ${lead?.buyingTimeline || 'stated timeframe'}, I wanted to give you first priority access to:\n\nProperty: ${currentProperty.title}\nPrice: ${currentProperty.price}\nKey Specs: ${currentProperty.bedrooms} Beds, ${currentProperty.bathrooms} Baths, ${currentProperty.areaSqFt} sq ft\n\nWhy this fits your search:\n- ${currentProperty.highlights[0]}\n- ${currentProperty.highlights[1]}\n- ${currentProperty.dealHook}\n\nWould you be open for a private 15-minute tour this week?\n\nBest regards,\nYour Real Estate Advisory Team`;

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      
      {/* Feature Banner */}
      <div className="bg-gradient-to-r from-[#232f3e] to-[#1a2b42] text-white p-4 rounded-lg border border-slate-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ec7211] flex items-center justify-center text-white font-bold shadow-md">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold">Deal Accelerator Suite™</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                SALESPERSON WORKFLOW ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Live phone battlecard, objection rebuttals, dynamic inventory matching, and 1-click dispatch.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Battlecard (Left) & Smart Property Matcher (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Phone Call Battlecard */}
        <div className="card-enterprise p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-blue-50 text-[#0972d3]">
                <PhoneCall className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Live Call Battlecard & Strategy</h4>
            </div>
            <span className="text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Target: {lead.name.split(' ')[0]}
            </span>
          </div>

          {/* Buyer Persona Archetype */}
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <Target className="w-3.5 h-3.5 text-[#ec7211]" /> Buyer Persona & Psychological Archetype
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {battlecard.buyerPersona}
            </p>
          </div>

          {/* 7-Second Call Opening Hook */}
          <div className="bg-amber-50/70 p-3.5 rounded border border-amber-200">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#ec7211]" /> 7-Second Call Opener (Verbatim Script)
              </span>
              <button
                onClick={() => handleCopy(battlecard.openingHook, 'hook')}
                className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 font-normal bg-amber-100/80 px-2 py-0.5 rounded"
              >
                {copiedKey === 'hook' ? <Check className="w-3 h-3 text-green-700" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'hook' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-800 italic font-medium">
              "{battlecard.openingHook}"
            </p>
          </div>

          {/* Anticipated Objections & Winning Rebuttals */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Live Objection Rebuttals
            </div>

            {battlecard.commonObjections?.map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded p-3 text-xs space-y-1.5 shadow-2xs">
                <div className="text-red-700 font-semibold flex items-start gap-1">
                  <span className="font-bold text-red-500">Buyer:</span>
                  <span>"{item.objection}"</span>
                </div>
                <div className="text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1 flex-1">
                    <span className="font-bold text-emerald-600 shrink-0">Say this:</span>
                    <span className="italic text-slate-700 font-medium">"{item.rebuttal}"</span>
                  </div>
                  <button
                    onClick={() => handleCopy(item.rebuttal, `rebuttal-${idx}`)}
                    className="text-slate-400 hover:text-slate-700 shrink-0 p-1"
                    title="Copy rebuttal"
                  >
                    {copiedKey === `rebuttal-${idx}` ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* 2. Smart Inventory Matcher & Tailored Pitch */}
        <div className="card-enterprise p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-50 text-emerald-600">
                <Building className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Inventory Matcher & Dynamic Pitch</h4>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {matchedListings.length} Matched Listings
            </span>
          </div>

          {/* Listing Selector tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {matchedListings.map(prop => (
              <button
                key={prop.id}
                onClick={() => setSelectedProperty(prop)}
                className={`text-[11px] px-2.5 py-1 rounded transition border truncate max-w-[160px] ${
                  currentProperty.id === prop.id 
                    ? 'bg-emerald-700 text-white font-bold border-emerald-700' 
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {prop.title.split(' ')[0]} ({prop.matchScore}%)
              </button>
            ))}
          </div>

          {/* Active Matched Listing Card */}
          <div className="border border-emerald-200 bg-emerald-50/40 rounded-lg p-4 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded">
                  ★ {currentProperty.matchScore}% Match Score
                </span>
                <h5 className="text-sm font-bold text-slate-900 mt-1.5">{currentProperty.title}</h5>
                <p className="text-xs text-slate-600">{currentProperty.location} • {currentProperty.type}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-slate-900">{currentProperty.price}</p>
                <p className="text-[11px] text-slate-500">{currentProperty.bedrooms} Beds • {currentProperty.bathrooms} Baths • {currentProperty.areaSqFt} sqft</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
              {currentProperty.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                  {t}
                </span>
              ))}
            </div>

            {/* Value Hook for the Pitch */}
            <div className="bg-white p-3 rounded border border-emerald-200/70 space-y-1 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#ec7211]" /> Tailored Angle for {lead.name.split(' ')[0]}:
              </div>
              <p className="text-slate-700 italic">
                "{currentProperty.dealHook}"
              </p>
            </div>
          </div>

          {/* 3. Multi-Channel 1-Click Dispatcher */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-blue-600" /> 1-Click Multi-Channel Dispatch
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* WhatsApp Button */}
              <button
                onClick={() => {
                  const encoded = encodeURIComponent(whatsappText);
                  window.open(`https://wa.me/?text=${encoded}`, '_blank');
                }}
                className="bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/40 p-2.5 rounded-lg flex items-center justify-between text-xs font-bold transition shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                  <span>Send WhatsApp</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Email Button */}
              <button
                onClick={() => {
                  const mailto = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
                  window.location.href = mailto;
                }}
                className="bg-[#0972d3]/10 hover:bg-[#0972d3]/20 text-[#0972d3] border border-[#0972d3]/30 p-2.5 rounded-lg flex items-center justify-between text-xs font-bold transition shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0972d3]" />
                  <span>Send Email (mailto:)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Copy full pitch button */}
            <button
              onClick={() => handleCopy(emailBody, 'fullEmail')}
              className="w-full btn-secondary text-xs flex items-center justify-center gap-2 py-2"
            >
              {copiedKey === 'fullEmail' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'fullEmail' ? 'Full Pitch Copied to Clipboard!' : 'Copy Formatted Pitch to Clipboard'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
