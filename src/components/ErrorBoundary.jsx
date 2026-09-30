import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('LeadPulse ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin + '?v=' + Date.now();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#eaeded] flex items-center justify-center p-6 text-slate-800">
          <div className="bg-white border border-slate-300 rounded-lg shadow-xl p-8 max-w-lg w-full text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-[#ec7211] rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h2 className="text-lg font-bold text-slate-900">Application Recovered from Error</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              The application encountered an unexpected runtime state. Click below to refresh and restore healthy pipeline state.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-left font-mono text-[11px] text-red-700 max-h-32 overflow-y-auto">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="bg-[#ec7211] hover:bg-[#eb5f07] text-white px-5 py-2 rounded text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Pipeline & Reload</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
