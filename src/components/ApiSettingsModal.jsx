import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Sliders, 
  Sparkles,
  Zap
} from 'lucide-react';
import { saveApiConfig, getApiConfig } from '../services/aiService';

export default function ApiSettingsModal({ isOpen, onClose, onConfigSaved }) {
  const current = getApiConfig();
  const [provider, setProvider] = useState(current.provider || 'gemini');
  const [apiKey, setApiKey] = useState(current.apiKey || '');
  const [modelName, setModelName] = useState(current.modelName || 'gemini-1.5-flash');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveApiConfig({
      provider,
      apiKey: apiKey.trim(),
      modelName
    });
    setSaveSuccess(true);
    if (onConfigSaved) onConfigSaved();
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleUseZeroSetup = () => {
    setApiKey('');
    saveApiConfig({
      provider: 'gemini',
      apiKey: '',
      modelName: 'gemini-1.5-flash'
    });
    setSaveSuccess(true);
    if (onConfigSaved) onConfigSaved();
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#232f3e] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#ec7211] flex items-center justify-center text-white">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Model & API Key Configuration</h3>
              <p className="text-xs text-slate-300">Choose your AI provider or use active zero-setup mode</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          
          {/* Zero setup callout */}
          <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold">Zero-Setup Mode Ready:</strong> The app runs complete AI lead intelligence without requiring mandatory API keys. To connect your live cloud LLM, enter a free Gemini or Groq key below.
            </div>
          </div>

          {/* Provider Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              AI Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setProvider('gemini');
                  setModelName('gemini-1.5-flash');
                }}
                className={`p-2.5 rounded border text-left flex items-center gap-2 transition ${
                  provider === 'gemini' 
                    ? 'border-[#ec7211] bg-orange-50/60 text-slate-900 font-bold' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#ec7211]" />
                <div>
                  <p className="text-xs">Google Gemini</p>
                  <p className="text-[10px] text-slate-500">gemini-1.5-flash</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProvider('groq');
                  setModelName('llama-3.3-70b-versatile');
                }}
                className={`p-2.5 rounded border text-left flex items-center gap-2 transition ${
                  provider === 'groq' 
                    ? 'border-[#ec7211] bg-orange-50/60 text-slate-900 font-bold' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Zap className="w-4 h-4 text-[#ec7211]" />
                <div>
                  <p className="text-xs">Groq Cloud</p>
                  <p className="text-[10px] text-slate-500">llama-3.3-70b</p>
                </div>
              </button>
            </div>
          </div>

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-slate-500" /> 
                {provider === 'gemini' ? 'Gemini API Key' : 'Groq API Key'}
              </label>
              <a
                href={provider === 'gemini' ? 'https://aistudio.google.com/app/apikey' : 'https://console.groq.com/keys'}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#0972d3] hover:underline flex items-center gap-0.5"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder={provider === 'gemini' ? 'AIzaSy...' : 'gsk_...'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full input-field font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Keys are stored securely in your browser's localStorage.
            </p>
          </div>

          {/* Model Name */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Model Name</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full input-field font-mono text-xs"
              placeholder="e.g. gemini-1.5-flash or llama-3.3-70b-versatile"
            />
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleUseZeroSetup}
              className="text-slate-600 hover:text-slate-900 underline text-xs"
            >
              Reset to Zero-Setup
            </button>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs font-bold"
              >
                {saveSuccess ? 'Saved!' : 'Save Configuration'}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
