import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  User, 
  MapPin, 
  Home, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  Zap, 
  Loader2,
  FileText,
  Wand2
} from 'lucide-react';
import { SAMPLE_PERSONAS } from '../data/mockLeads';
import { extractLeadFromRawTranscript, getApiConfig } from '../services/aiService';

export default function LeadIntakeModal({ isOpen, onClose, onSubmit, isAnalyzing }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    propertyRequirement: '',
    budget: '',
    buyingTimeline: '',
    customerMessage: ''
  });

  const [rawPastedText, setRawPastedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleApplyPersona = (persona) => {
    setFormData({
      name: persona.data.name,
      location: persona.data.location,
      propertyRequirement: persona.data.propertyRequirement,
      budget: persona.data.budget,
      buyingTimeline: persona.data.buyingTimeline,
      customerMessage: persona.data.customerMessage
    });
    setErrors({});
  };

  const handleAutoExtract = async () => {
    if (!rawPastedText.trim()) return;
    setIsExtracting(true);
    try {
      const extracted = await extractLeadFromRawTranscript(rawPastedText, getApiConfig());
      setFormData({
        name: extracted.name || formData.name || 'Inbound Lead',
        location: extracted.location || formData.location || '',
        propertyRequirement: extracted.propertyRequirement || formData.propertyRequirement || '',
        budget: extracted.budget || formData.budget || '',
        buyingTimeline: extracted.buyingTimeline || formData.buyingTimeline || '',
        customerMessage: extracted.customerMessage || rawPastedText
      });
      setErrors({});
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Buyer name is required';
    if (!formData.location.trim()) newErrors.location = 'Target location is required';
    if (!formData.propertyRequirement.trim()) newErrors.propertyRequirement = 'Property requirements are required';
    if (!formData.budget.trim()) newErrors.budget = 'Budget range is required';
    if (!formData.buyingTimeline.trim()) newErrors.buyingTimeline = 'Buying timeline is required';
    if (!formData.customerMessage.trim()) newErrors.customerMessage = 'Inquiry message or chat transcript is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#232f3e] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#ec7211] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Inbound Lead Intake & AI Qualification</h2>
              <p className="text-xs text-slate-300">Enter lead details, paste an email/call transcript, or use AI auto-extract</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isAnalyzing}
            className="text-slate-400 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Auto-Extract Fast Ingestion Box */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Wand2 className="w-3.5 h-3.5 text-[#ec7211]" />
              AI Fast-Ingest from Raw Email / Transcript
            </span>
            <div className="flex items-center gap-1.5">
              {SAMPLE_PERSONAS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPersona(p)}
                  className="text-[11px] bg-white hover:bg-orange-50 text-slate-700 hover:text-[#ec7211] border border-slate-300 px-2 py-0.5 rounded transition font-medium"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste raw email inquiry, voice call transcript, or WhatsApp text..."
              value={rawPastedText}
              onChange={(e) => setRawPastedText(e.target.value)}
              className="flex-1 input-field text-xs"
            />
            <button
              type="button"
              onClick={handleAutoExtract}
              disabled={isExtracting || !rawPastedText.trim()}
              className="btn-primary text-xs shrink-0 flex items-center gap-1.5"
            >
              {isExtracting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isExtracting ? 'Extracting...' : 'Auto-Fill Fields'}</span>
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Buyer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" /> Buyer / Lead Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Marcus Vance or Sarah Jenkins"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className={`w-full input-field ${errors.name ? 'border-red-500' : ''}`}
                disabled={isAnalyzing}
              />
              {errors.name && <p className="text-[11px] text-red-500 mt-0.5">{errors.name}</p>}
            </div>

            {/* Target Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" /> Target Location / Neighborhood <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Downtown Waterfront, West Suburbs, Metro Area"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className={`w-full input-field ${errors.location ? 'border-red-500' : ''}`}
                disabled={isAnalyzing}
              />
              {errors.location && <p className="text-[11px] text-red-500 mt-0.5">{errors.location}</p>}
            </div>

            {/* Property Requirement */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Home className="w-3.5 h-3.5 text-slate-500" /> Property Requirement & Specs <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 4 Bed Single Family Home with yard or 3 Bed Luxury Penthouse with water views"
                value={formData.propertyRequirement}
                onChange={e => setFormData({ ...formData, propertyRequirement: e.target.value })}
                className={`w-full input-field ${errors.propertyRequirement ? 'border-red-500' : ''}`}
                disabled={isAnalyzing}
              />
              {errors.propertyRequirement && <p className="text-[11px] text-red-500 mt-0.5">{errors.propertyRequirement}</p>}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" /> Budget / Financing Status <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. $2.5M - $3M (Cash) or $850k - $950k (Pre-approved)"
                value={formData.budget}
                onChange={e => setFormData({ ...formData, budget: e.target.value })}
                className={`w-full input-field ${errors.budget ? 'border-red-500' : ''}`}
                disabled={isAnalyzing}
              />
              {errors.budget && <p className="text-[11px] text-red-500 mt-0.5">{errors.budget}</p>}
            </div>

            {/* Buying Timeline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Target Buying Timeline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Immediate (14-30 days), 60-90 days, or Q4 2026"
                value={formData.buyingTimeline}
                onChange={e => setFormData({ ...formData, buyingTimeline: e.target.value })}
                className={`w-full input-field ${errors.buyingTimeline ? 'border-red-500' : ''}`}
                disabled={isAnalyzing}
              />
              {errors.buyingTimeline && <p className="text-[11px] text-red-500 mt-0.5">{errors.buyingTimeline}</p>}
            </div>

            {/* Free-text Customer Message / Transcript */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> 
                  Customer Inquiry Message / Chat Transcript <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">Unfiltered customer voice or email copy</span>
              </label>
              <textarea
                rows={4}
                placeholder="Paste the customer's raw inquiry message or call transcript here..."
                value={formData.customerMessage}
                onChange={e => setFormData({ ...formData, customerMessage: e.target.value })}
                className={`w-full input-field leading-relaxed ${errors.customerMessage ? 'border-red-500' : ''}`}
                disabled={isAnalyzing}
              />
              {errors.customerMessage && <p className="text-[11px] text-red-500 mt-0.5">{errors.customerMessage}</p>}
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isAnalyzing}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="btn-primary px-6 py-2 text-sm font-bold shadow-md flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Running AI Qualification...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Qualify Lead & Save to Pipeline</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
