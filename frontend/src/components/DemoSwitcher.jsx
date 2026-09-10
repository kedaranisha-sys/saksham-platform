import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { DEMO_PRESENTATION_SCENARIOS } from '../services/constants';
import { api } from '../services/api';
import { Sparkles, UserCheck, RotateCcw, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';

export default function DemoSwitcher({ onSelectTab, onOpenAiWithQuery }) {
  const { user, switchRole } = useAuth();
  const { addToast } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const personas = [
    { role: 'user', label: 'Job Seeker (Aarav)', desc: 'Tailoring & Support Skills' },
    { role: 'anonymous', label: 'Anonymous Seeker', desc: 'Privacy-First Persona' },
    { role: 'employer', label: 'Employer (Priya)', desc: 'Post & Manage Inclusive Jobs' },
    { role: 'mentor', label: 'Mentor (Kavya)', desc: 'Senior Tech Guide' },
    { role: 'admin', label: 'Admin (Dr. Maya)', desc: 'Full Content & Safety Controls' }
  ];

  const handleRoleChange = async (role) => {
    const updatedUser = await switchRole(role);
    addToast('Persona Switched', `Active user: ${updatedUser?.preferred_name || role}`, 'success');
  };

  const handleRunDemo = (demo) => {
    onSelectTab(demo.targetTab);
    if (demo.query && onOpenAiWithQuery) {
      onOpenAiWithQuery(demo.query);
    }
    addToast(demo.title, demo.description, 'info');
    setIsOpen(false);
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      await api.resetDemoData();
      addToast('Data Reset', 'Platform restored to authentic verified demo records.', 'success');
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      addToast('Reset Error', err.message, 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-accent-950 via-slate-900 to-brand-950 text-white border-b border-accent-900/60 py-2 px-4 shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent-500/20 text-accent-300 font-semibold border border-accent-500/30">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            Hackathon & Presentation Control
          </span>
          <span className="text-slate-300 font-medium hidden md:inline">
            Active: <strong className="text-brand-400">{user?.preferred_name}</strong> ({user?.role})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Persona Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            {personas.map((p) => (
              <button
                key={p.role}
                onClick={() => handleRoleChange(p.role)}
                className={`px-2.5 py-1 rounded text-xs transition-all ${
                  user?.role === p.role || (p.role === 'anonymous' && user?.is_anonymous)
                    ? 'bg-accent-600 text-white font-bold shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Scenarios Dropdown Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-colors shadow-sm"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>6 Presentation Demos</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={handleResetData}
            disabled={resetting}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
            title="Restore default authentic seed data"
          >
            <RotateCcw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Reset Data</span>
          </button>
        </div>
      </div>

      {/* Expanded Demo Scenarios Drawer */}
      {isOpen && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pb-2 animate-fadeIn">
          {DEMO_PRESENTATION_SCENARIOS.map((demo) => (
            <div
              key={demo.id}
              onClick={() => handleRunDemo(demo)}
              className="p-2.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/70 cursor-pointer transition-all hover:border-brand-400 group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-brand-300 group-hover:text-brand-200 text-xs">
                  {demo.title}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                  Launch →
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {demo.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
