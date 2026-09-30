import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LeadListView from './components/LeadListView';
import LeadDetailView from './components/LeadDetailView';
import LeadIntakeModal from './components/LeadIntakeModal';
import ApiSettingsModal from './components/ApiSettingsModal';
import VoiceAgentSimulatorModal from './components/VoiceAgentSimulatorModal';
import VoiceAgentConfigDrawer from './components/VoiceAgentConfigDrawer';
import { INITIAL_LEADS } from './data/mockLeads';
import { analyzeLead, getApiConfig } from './services/aiService';

export default function App() {
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('leadpulse_leads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading leads from localStorage:', e);
    }
    return INITIAL_LEADS;
  });

  const [selectedLeadId, setSelectedLeadId] = useState(() => {
    return INITIAL_LEADS[0]?.id || 'lead-001';
  });

  const [currentFilter, setCurrentFilter] = useState('ALL');
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVoiceSimOpen, setIsVoiceSimOpen] = useState(false);
  const [isVoiceConfigOpen, setIsVoiceConfigOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [apiConfig, setApiConfig] = useState(getApiConfig());

  // Persist leads safely to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('leadpulse_leads', JSON.stringify(leads));
    } catch (e) {
      console.warn('localStorage save warning:', e);
    }
  }, [leads]);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0] || INITIAL_LEADS[0];

  const handleConfigSaved = () => {
    setApiConfig(getApiConfig());
  };

  const handleCreateLead = async (formData) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeLead(formData, apiConfig);

      const budgetNum = parseInt(formData.budget.replace(/[^0-9]/g, ''), 10) || 500000;

      const newLead = {
        id: `lead-${Date.now()}`,
        name: formData.name,
        location: formData.location,
        propertyRequirement: formData.propertyRequirement,
        budget: formData.budget,
        budgetNumeric: budgetNum,
        buyingTimeline: formData.buyingTimeline,
        customerMessage: formData.customerMessage,
        receivedAt: new Date().toISOString(),
        channel: 'Inbound Web Form',
        status: 'New',
        notes: '',
        aiAnalysis: analysis,
        chatHistory: [
          {
            id: `msg-${Date.now()}`,
            sender: 'ai',
            text: `Analysis complete for **${formData.name}** (${analysis.priority} Priority, Score ${analysis.score}/100).\n\nRecommended next step: *${analysis.recommendedNextAction}*`,
            timestamp: new Date().toISOString()
          }
        ]
      };

      setLeads([newLead, ...leads]);
      setSelectedLeadId(newLead.id);
      setIsIntakeOpen(false);
    } catch (err) {
      console.error('Error creating lead:', err);
      alert('Error during AI analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateLead = (leadId, updatedFields) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updatedFields } : l));
  };

  const handleReanalyzeLead = async (lead) => {
    setIsReanalyzing(true);
    try {
      const newAnalysis = await analyzeLead(lead, apiConfig);
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, aiAnalysis: newAnalysis } : l));
    } catch (err) {
      console.error('Re-analysis error:', err);
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleDeleteLead = (id) => {
    const updated = leads.filter(l => l.id !== id);
    setLeads(updated);
    if (selectedLeadId === id) {
      setSelectedLeadId(updated[0]?.id || null);
    }
  };

  const handleUpdateChatHistory = (leadId, newChatHistory) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, chatHistory: newChatHistory } : l));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#eaeded]">
      
      {/* Top Navigation Bar */}
      <Navbar
        onNewLead={() => setIsIntakeOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenVoiceSimulator={() => setIsVoiceSimOpen(true)}
        onOpenVoiceConfig={() => setIsVoiceConfigOpen(true)}
        leads={leads}
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
        apiConfig={apiConfig}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Prioritized Leads List */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 h-full flex flex-col border-r border-[#d5dbdb] shadow-xs">
          <LeadListView
            leads={leads}
            selectedLeadId={selectedLeadId}
            onSelectLead={setSelectedLeadId}
            onDeleteLead={handleDeleteLead}
            activeFilter={currentFilter}
            onFilterChange={setCurrentFilter}
          />
        </div>

        {/* Right Column: Fast 5-Second Scan, AI Intelligence, Copilot & Deal Accelerator */}
        <div className="hidden md:flex flex-1 flex-col h-full overflow-hidden">
          <LeadDetailView
            lead={selectedLead}
            onUpdateLead={handleUpdateLead}
            onReanalyzeLead={handleReanalyzeLead}
            isReanalyzing={isReanalyzing}
            onUpdateChatHistory={handleUpdateChatHistory}
          />
        </div>

      </div>

      {/* Modals */}
      <LeadIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onSubmit={handleCreateLead}
        isAnalyzing={isAnalyzing}
      />

      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSaved={handleConfigSaved}
      />

      <VoiceAgentSimulatorModal
        isOpen={isVoiceSimOpen}
        onClose={() => setIsVoiceSimOpen(false)}
        onIngestLead={handleCreateLead}
      />

      <VoiceAgentConfigDrawer
        isOpen={isVoiceConfigOpen}
        onClose={() => setIsVoiceConfigOpen(false)}
        onSaveConfig={(cfg) => console.log('Updated Voice Agent Config:', cfg)}
      />

    </div>
  );
}
