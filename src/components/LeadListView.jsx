import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Flame, 
  Zap, 
  Snowflake, 
  MapPin, 
  DollarSign, 
  Clock, 
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Trash2,
  Calendar,
  Download
} from 'lucide-react';

export default function LeadListView({ 
  leads, 
  selectedLeadId, 
  onSelectLead, 
  onDeleteLead,
  activeFilter,
  onFilterChange 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('score'); // 'score' | 'date' | 'budget'

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    if (activeFilter !== 'ALL') {
      if (lead.aiAnalysis?.priority !== activeFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = lead.name?.toLowerCase().includes(q);
      const matchLoc = lead.location?.toLowerCase().includes(q);
      const matchReq = lead.propertyRequirement?.toLowerCase().includes(q);
      const matchIntent = lead.aiAnalysis?.customerIntent?.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchReq && !matchIntent) return false;
    }
    return true;
  });

  // Sort leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortBy === 'score') {
      return (b.aiAnalysis?.score || 0) - (a.aiAnalysis?.score || 0);
    }
    if (sortBy === 'date') {
      return new Date(b.receivedAt || 0) - new Date(a.receivedAt || 0);
    }
    if (sortBy === 'budget') {
      return (b.budgetNumeric || 0) - (a.budgetNumeric || 0);
    }
    return 0;
  });

  const getPriorityBadge = (priority, score) => {
    if (priority === 'HOT' || score >= 80) {
      return (
        <span className="badge-hot">
          <Flame className="w-3 h-3 fill-red-500 text-red-500" />
          HOT ({score})
        </span>
      );
    }
    if (priority === 'WARM' || score >= 50) {
      return (
        <span className="badge-warm">
          <Zap className="w-3 h-3 text-amber-600" />
          WARM ({score})
        </span>
      );
    }
    return (
      <span className="badge-cold">
        <Snowflake className="w-3 h-3 text-slate-500" />
        NURTURE ({score})
      </span>
    );
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Priority', 'Score', 'Location', 'Budget', 'Timeline', 'Requirements', 'Customer Intent'];
    const rows = leads.map(l => [
      `"${l.name}"`,
      `"${l.aiAnalysis?.priority || 'WARM'}"`,
      l.aiAnalysis?.score || 50,
      `"${l.location}"`,
      `"${l.budget}"`,
      `"${l.buyingTimeline}"`,
      `"${(l.propertyRequirement || '').replace(/"/g, '""')}"`,
      `"${(l.aiAnalysis?.customerIntent || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `real_estate_leads_pipeline_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-[#d5dbdb]">
      
      {/* Search & Sort Controls */}
      <div className="p-3 bg-slate-50 border-b border-[#d5dbdb] space-y-2">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search leads by name, location, intent..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#879596] rounded focus:outline-none focus:ring-1 focus:ring-[#0972d3] focus:border-[#0972d3]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700">Sort:</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSortBy('score')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${sortBy === 'score' ? 'bg-[#232f3e] text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
            >
              AI Score
            </button>
            <button
              onClick={() => setSortBy('date')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${sortBy === 'date' ? 'bg-[#232f3e] text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy('budget')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${sortBy === 'budget' ? 'bg-[#232f3e] text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
            >
              Budget
            </button>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
        {sortedLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p className="text-sm font-semibold">No leads match your filter</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or intake a new lead</p>
          </div>
        ) : (
          sortedLeads.map(lead => {
            const isSelected = lead.id === selectedLeadId;
            const score = lead.aiAnalysis?.score || 50;
            const priority = lead.aiAnalysis?.priority || 'WARM';

            return (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className={`p-3.5 cursor-pointer transition-all border-l-4 relative group ${
                  isSelected 
                    ? 'bg-amber-50/70 border-l-[#ec7211] shadow-xs' 
                    : 'hover:bg-slate-50 border-l-transparent'
                }`}
              >
                {/* Top Row: Name + Score Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-[#ec7211]' : 'text-slate-900'}`}>
                      {lead.name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{lead.location}</span>
                    </p>
                  </div>
                  <div>
                    {getPriorityBadge(priority, score)}
                  </div>
                </div>

                {/* Intent Tag & Property Specs */}
                <div className="mt-2">
                  <p className="text-xs text-slate-700 line-clamp-1 font-medium">
                    {lead.propertyRequirement}
                  </p>
                  {lead.aiAnalysis?.customerIntent && (
                    <span className="inline-block mt-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono border border-slate-200">
                      🎯 {lead.aiAnalysis.customerIntent}
                    </span>
                  )}
                </div>

                {/* Bottom Row: Budget & Timeline */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <DollarSign className="w-3 h-3" />
                    {lead.budget}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {lead.buyingTimeline}
                  </span>
                </div>

                {/* Delete button on hover */}
                {onDeleteLead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Remove lead "${lead.name}"?`)) {
                        onDeleteLead(lead.id);
                      }
                    }}
                    className="absolute right-2 bottom-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                    title="Delete lead"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Summary & Export Bar */}
      <div className="p-2.5 bg-slate-100 border-t border-[#d5dbdb] text-[11px] text-slate-600 flex items-center justify-between font-medium">
        <span>{sortedLeads.length} of {leads.length} Leads</span>
        <button
          onClick={handleExportCSV}
          className="text-slate-600 hover:text-[#0972d3] flex items-center gap-1 transition"
          title="Export pipeline to CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

    </div>
  );
}
