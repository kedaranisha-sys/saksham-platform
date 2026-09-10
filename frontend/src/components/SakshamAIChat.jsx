import React, { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
import { Sparkles, Send, X, Bot, User, ArrowRight, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

const QUICK_PROMPTS = [
  "I need a job.",
  "I know tailoring. How can I earn money?",
  "What government support can I apply for?",
  "I need legal assistance for workplace discrimination.",
  "Show support organizations near me.",
  "I want to learn computer skills."
];

export default function SakshamAIChat({ isOpen, onClose, initialQuery, onNavigate }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello, I am Saksham AI 👋. I am your virtual navigator for inclusive employment, free skill certifications, official government schemes (like SMILE and National TG ID), legal rights, and verified community support across India.\n\nHow can I support your journey today?",
      suggested_actions: [
        { title: 'Explore Inclusive Jobs', path: '/jobs' },
        { title: 'Government Schemes Finder', path: '/schemes' },
        { title: 'Interactive Support Map', path: '/map' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  const handleSendMessage = async (queryText) => {
    const text = (queryText || input).trim();
    if (!text || loading) return;

    const userMsg = {
      id: Math.random().toString(),
      sender: 'user',
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendChatMessage(text);
      const aiMsg = {
        id: Math.random().toString(),
        sender: 'ai',
        text: res.reply,
        intent: res.intent,
        suggested_actions: res.suggested_actions || [],
        resources: res.resources || [],
        disclaimer: res.disclaimer
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'ai',
          text: "I am having trouble connecting to the knowledge server right now. Please try again or explore our Opportunities, Schemes, and Support Map tabs directly.",
          suggested_actions: [
            { title: 'Browse Jobs', path: '/jobs' },
            { title: 'View Schemes', path: '/schemes' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg h-full sm:h-[94vh] sm:mr-4 sm:rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-accent-600 via-teal-600 to-brand-600 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">Saksham AI Virtual Guide</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-semibold uppercase">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-white/80">Empowerment • Navigation • Verified Resources</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Saksham AI Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety & Compliance Badge */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/60 px-3 py-1.5 text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
          <span>Educational guidance only. Not a lawyer, doctor, or emergency responder.</span>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-slate-700 text-white'
                    : 'bg-brand-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/70 dark:border-slate-700/70'
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>

                {/* Specific Disclaimer if Present */}
                {msg.disclaimer && (
                  <div className="mt-2.5 p-2 rounded-lg bg-amber-100/70 dark:bg-amber-900/30 text-[11px] text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700/60">
                    {msg.disclaimer}
                  </div>
                )}

                {/* Contextual matched resource items */}
                {msg.resources && msg.resources.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-slate-200 dark:border-slate-700 pt-2.5">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block uppercase tracking-wide">
                      Matching Verified Listings:
                    </span>
                    {msg.resources.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (onNavigate && item.path) {
                            const tab = item.path.split('?')[0].replace('/', '');
                            onNavigate(tab);
                            onClose();
                          }
                        }}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-brand-500 cursor-pointer transition-all flex items-center justify-between gap-2 group"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs group-hover:text-brand-600 dark:group-hover:text-brand-400">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.subtitle}
                          </div>
                        </div>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex-shrink-0">
                          {item.badge} →
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Navigation Actions */}
                {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {msg.suggested_actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (onNavigate && act.path) {
                            const tab = act.path.split('?')[0].replace('/', '');
                            onNavigate(tab);
                            onClose();
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 hover:bg-brand-100 text-[11px] font-semibold border border-brand-200 dark:border-brand-800 transition-colors"
                      >
                        <span>{act.title}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
              <Bot className="w-5 h-5 text-brand-500 animate-spin" />
              <span>Saksham AI is analyzing verified resources...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-400 font-semibold whitespace-nowrap text-[10px]">Try asking:</span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-950/60 hover:text-brand-600 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g., 'I need a job', 'Legal help')..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white transition-colors shadow-md flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
