import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  Lightbulb, 
  Copy, 
  Check, 
  HelpCircle,
  MessageSquareQuote,
  ShieldAlert,
  Mic,
  MicOff
} from 'lucide-react';
import { askLeadCopilot, getApiConfig } from '../services/aiService';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../services/voiceService';

export default function LeadCopilotChat({ lead, onUpdateChatHistory }) {
  const [messages, setMessages] = useState(lead.chatHistory || []);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const recognizerRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try { recognizerRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (isListeningVoice) {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      setIsListeningVoice(false);
    } else {
      if (!isSpeechRecognitionSupported()) {
        alert('Voice speech recognition is not supported in this browser. Please use Chrome or Edge.');
        return;
      }
      const recognizer = createSpeechRecognizer({
        onResult: (res) => {
          setInputValue(res.text);
        },
        onError: () => setIsListeningVoice(false),
        onEnd: () => setIsListeningVoice(false)
      });
      if (recognizer) {
        recognizerRef.current = recognizer;
        recognizer.start();
        setIsListeningVoice(true);
      }
    }
  };

  // Sync messages if active lead changes
  useEffect(() => {
    setMessages(lead.chatHistory || [
      {
        id: `init-${lead.id}`,
        sender: 'ai',
        text: `Hello! I have loaded all qualification context for **${lead.name}** (${lead.aiAnalysis?.priority} Priority, Score ${lead.aiAnalysis?.score}/100).\n\nAsk me anything about tailoring your pitch, overcoming their specific objections, or drafting assertive follow-ups!`,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [lead.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const config = getApiConfig();
      const replyText = await askLeadCopilot(lead, text, newHistory, config);

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText || "I'm analyzing the lead's profile. Please try rephrasing your question.",
        timestamp: new Date().toISOString()
      };

      const updated = [...newHistory, aiMessage];
      setMessages(updated);
      if (onUpdateChatHistory) {
        onUpdateChatHistory(lead.id, updated);
      }
    } catch (err) {
      console.error(err);
      const errMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Error generating response. Please check your API configuration or network connection.",
        timestamp: new Date().toISOString()
      };
      setMessages([...newHistory, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const PROMPT_CHIPS = [
    "What should I emphasize on the call?",
    "Make my reply more assertive",
    "How to handle their budget/rate concern?",
    "Draft a concise WhatsApp follow-up",
    "Roleplay as this buyer"
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] border border-[#d5dbdb] rounded-md overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#232f3e] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#ec7211] flex items-center justify-center text-white font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              Lead Grounded Copilot
              <span className="text-[10px] bg-slate-800 text-amber-400 font-mono px-1.5 py-0.2 rounded border border-slate-700">
                Grounded: {lead.name}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Contextual sales advice grounded in {lead.name}'s specific constraints</p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mr-1">
          <Sparkles className="w-3 h-3 text-[#ec7211]" /> Quick Prompts:
        </span>
        {PROMPT_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(chip)}
            disabled={isLoading}
            className="text-[11px] bg-white hover:bg-orange-50 text-slate-700 hover:text-[#ec7211] border border-slate-300 hover:border-[#ec7211] px-2 py-0.5 rounded transition shadow-2xs font-medium"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg, idx) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id || idx}
              className={`flex gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-7 h-7 rounded-full bg-[#232f3e] text-[#ec7211] flex items-center justify-center shrink-0 mt-0.5 border border-slate-700">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-lg p-3 relative group ${
                isAi 
                  ? 'bg-white text-slate-800 border border-slate-300 shadow-xs' 
                  : 'bg-[#0972d3] text-white shadow-xs'
              }`}>
                {/* Message text with Markdown bold and bullet support */}
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text.split('\n').map((line, lIdx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={lIdx} className="font-bold text-slate-900 mt-2 mb-1 text-xs">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('- ') || line.startsWith('* ')) {
                      return (
                        <div key={lIdx} className="flex items-start gap-1.5 my-0.5 ml-1">
                          <span className="text-[#ec7211]">•</span>
                          <span>{renderFormattedText(line.substring(2))}</span>
                        </div>
                      );
                    }
                    if (line.match(/^\d+\.\s/)) {
                      return (
                        <div key={lIdx} className="my-0.5 ml-1">
                          <span>{renderFormattedText(line)}</span>
                        </div>
                      );
                    }
                    return <p key={lIdx} className="my-0.5">{renderFormattedText(line)}</p>;
                  })}
                </div>

                {/* Copy button for AI replies */}
                {isAi && (
                  <button
                    onClick={() => handleCopy(msg.text, idx)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition p-1 bg-white/80 rounded"
                    title="Copy response"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {!isAi && (
                <div className="w-7 h-7 rounded-full bg-[#0972d3] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 justify-start items-center text-slate-500 text-xs">
            <div className="w-7 h-7 rounded-full bg-[#232f3e] text-[#ec7211] flex items-center justify-center shrink-0 border border-slate-700">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-300 rounded-lg px-3 py-2 flex items-center gap-2 shadow-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ec7211]" />
              <span>Analyzing lead profile and tactical context for {lead.name}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }} 
          className="flex items-center gap-2"
        >
          {/* Voice Command Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2 rounded text-xs transition border flex items-center justify-center shrink-0 ${
              isListeningVoice 
                ? 'bg-red-600 text-white border-red-700 animate-pulse' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title={isListeningVoice ? 'Listening... Click to stop' : 'Speak your question (Voice Command)'}
          >
            {isListeningVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#ec7211]" />}
          </button>

          <input
            type="text"
            placeholder={isListeningVoice ? "Listening to your voice..." : `Ask anything about ${lead.name} or click mic to speak...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="flex-1 input-field text-xs"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="btn-primary px-3 py-1.5 text-xs font-semibold"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask Copilot</span>
          </button>
        </form>
      </div>

    </div>
  );
}

function renderFormattedText(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
