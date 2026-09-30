import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  User, 
  MapPin, 
  Home, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  Loader2,
  FileText,
  UploadCloud,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  FileUp,
  FileSpreadsheet
} from 'lucide-react';
import { extractLeadFromRawTranscript, getApiConfig } from '../services/aiService';
import { parseDocumentFile } from '../services/documentParser';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../services/voiceService';

export default function LeadIntakeModal({ isOpen, onClose, onSubmit, isAnalyzing }) {
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'voice' | 'manual'
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    propertyRequirement: '',
    budget: '',
    buyingTimeline: '',
    customerMessage: ''
  });

  // Document Upload State
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isProcessingDoc, setIsProcessingDoc] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const recognizerRef = useRef(null);
  const hasVoiceSupport = isSpeechRecognitionSupported();

  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  if (!isOpen) return null;

  // Handle File Upload
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadedFileName(file.name);
    setIsProcessingDoc(true);

    try {
      const extractedText = await parseDocumentFile(file);
      const structured = await extractLeadFromRawTranscript(extractedText, getApiConfig());
      
      setFormData({
        name: structured.name || 'Client Lead',
        location: structured.location || '',
        propertyRequirement: structured.propertyRequirement || '',
        budget: structured.budget || '',
        buyingTimeline: structured.buyingTimeline || '',
        customerMessage: extractedText.slice(0, 800)
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      alert('Error parsing document: ' + err.message);
    } finally {
      setIsProcessingDoc(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle Voice Dictation
  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsRecording(false);
    } else {
      if (!hasVoiceSupport) {
        alert('Voice speech recognition is not supported in this browser. Please use Chrome or Edge.');
        return;
      }

      setVoiceTranscript('');
      const recognizer = createSpeechRecognizer({
        onResult: async (res) => {
          setVoiceTranscript(res.text);
          setFormData(prev => ({
            ...prev,
            customerMessage: res.text
          }));
        },
        onError: (err) => {
          console.error(err);
          setIsRecording(false);
        },
        onEnd: () => {
          setIsRecording(false);
        }
      });

      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
        setIsRecording(true);
      }
    }
  };

  const handleAutoExtractVoice = async () => {
    if (!voiceTranscript.trim()) return;
    setIsProcessingDoc(true);
    try {
      const structured = await extractLeadFromRawTranscript(voiceTranscript, getApiConfig());
      setFormData(prev => ({
        ...prev,
        name: structured.name || prev.name || 'Voice Lead',
        location: structured.location || prev.location || '',
        propertyRequirement: structured.propertyRequirement || prev.propertyRequirement || '',
        budget: structured.budget || prev.budget || '',
        buyingTimeline: structured.buyingTimeline || prev.buyingTimeline || '',
        customerMessage: voiceTranscript
      }));
      setErrors({});
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingDoc(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Buyer / Client name is required';
    if (!formData.location.trim()) newErrors.location = 'Target location is required';
    if (!formData.propertyRequirement.trim()) newErrors.propertyRequirement = 'Property requirements are required';
    if (!formData.budget.trim()) newErrors.budget = 'Budget range is required';
    if (!formData.buyingTimeline.trim()) newErrors.buyingTimeline = 'Buying timeline is required';
    if (!formData.customerMessage.trim()) newErrors.customerMessage = 'Inquiry details, transcript, or document content is required';

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
        <div className="bg-[#131a22] text-white px-6 py-4 flex items-center justify-between border-b border-[#232f3e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#ec7211] flex items-center justify-center text-white">
              <FileUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Intake & Qualify New Lead</h2>
              <p className="text-xs text-slate-400">Upload documents, record voice notes, or enter customer requirements</p>
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

        {/* Real-World Input Mode Tabs */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
              activeMode === 'upload' 
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-300' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#ec7211]" />
            <span>Upload Document (PDF / TXT / CSV)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('voice')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
              activeMode === 'voice' 
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-300' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-[#ec7211]" />
            <span>Live Voice Dictation / Mic</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
              activeMode === 'manual' 
                ? 'bg-white text-slate-900 shadow-2xs border border-slate-300' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Direct Form Entry</span>
          </button>
        </div>

        {/* Mode 1: Document Upload Dropzone */}
        {activeMode === 'upload' && (
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
              accept=".pdf,.txt,.csv,.md,.json,.docx"
              className="hidden"
            />
            
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
                dragActive ? 'border-[#ec7211] bg-orange-50/50' : 'border-slate-300 hover:border-slate-400 bg-white'
              }`}
            >
              {isProcessingDoc ? (
                <div className="flex flex-col items-center justify-center py-2 text-slate-600 text-xs">
                  <Loader2 className="w-8 h-8 animate-spin text-[#ec7211] mb-2" />
                  <p className="font-bold text-slate-900">AI Reading Document: {uploadedFileName}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Extracting buyer name, budget, requirements, and timeline...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-1">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-2">
                    <UploadCloud className="w-5 h-5 text-[#ec7211]" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {uploadedFileName ? `Loaded: ${uploadedFileName} (Click to change)` : 'Drop client document here or click to browse'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports pre-approval letters, buyer questionnaires, PDF inquiries, and client intake sheets (.pdf, .txt, .csv)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode 2: Real Microphone Voice Dictation */}
        {activeMode === 'voice' && (
          <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-[#ec7211]" />
                  Live Voice Dictation & Notes
                </h4>
                <p className="text-[11px] text-slate-500">
                  Speak into your microphone to record phone notes or buyer intake
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition shadow-xs ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                      : 'btn-primary'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Listening (Click to Stop)' : 'Start Speaking'}</span>
                </button>

                {voiceTranscript && (
                  <button
                    type="button"
                    onClick={handleAutoExtractVoice}
                    disabled={isProcessingDoc}
                    className="btn-secondary text-xs flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3 text-[#ec7211]" />
                    <span>Auto-Fill from Voice</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live voice speech box */}
            <div className="p-3 bg-white rounded border border-slate-200 min-h-[60px] text-xs text-slate-800 italic">
              {voiceTranscript || (isRecording ? "Listening to your voice..." : "Click 'Start Speaking' and describe the lead...")}
            </div>
          </div>
        )}

        {/* Structured Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Buyer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" /> Buyer / Client Name <span className="text-red-500">*</span>
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
                placeholder="e.g. Downtown Waterfront, West Suburbs"
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
                placeholder="e.g. 4 Bed Single Family Home with yard or Luxury Penthouse with bay views"
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
                placeholder="e.g. $2.5M (All-Cash) or $850k (Pre-approved)"
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
                <Clock className="w-3.5 h-3.5 text-slate-500" /> Target Timeline <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Immediate (14-30 days), 60-90 days, or Q4"
                value={formData.buyingTimeline}
                onChange={e => setFormData({ ...formData, buyingTimeline: e.target.value })}
                className={`w-full input-field ${errors.buyingTimeline ? 'border-red-500' : ''}`}
                disabled={isAnalyzing}
              />
              {errors.buyingTimeline && <p className="text-[11px] text-red-500 mt-0.5">{errors.buyingTimeline}</p>}
            </div>

            {/* Message / Content */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> 
                  Inquiry Message / Extracted Document Content <span className="text-red-500">*</span>
                </span>
                <span className="text-[11px] font-normal text-slate-500">Auto-populated from upload or voice</span>
              </label>
              <textarea
                rows={4}
                placeholder="Enter client message, document text, or call notes..."
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
