import React from 'react';
import { NATIONAL_HELPLINES } from '../services/constants';
import { ShieldAlert, PhoneCall, X, ExternalLink, MapPin } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose, onNavigateToMap }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-rose-200 dark:border-rose-900/60 overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/20">
              <ShieldAlert className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base">Emergency Helplines & Crisis Support</h3>
              <p className="text-xs text-rose-100">Confidential, verified 24x7 crisis hotlines across India</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-100 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
          <strong>Immediate Danger?</strong> If you are experiencing physical violence or threat, dial <strong>112</strong> immediately. The helplines below are free government and authorized crisis centers.
        </div>

        {/* Helpline cards */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {NATIONAL_HELPLINES.map((hl, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{hl.name}</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                    {hl.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{hl.description}</p>
                <div className="text-[11px] text-slate-400 mt-1">Available: {hl.timing}</div>
              </div>

              <a
                href={`tel:${hl.number.replace(/[^0-9]/g, '')}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors flex-shrink-0"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Call {hl.number}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              if (onNavigateToMap) onNavigateToMap();
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <MapPin className="w-4 h-4" />
            <span>Find Nearby Emergency Shelters (Garima Greh) on Support Map</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
