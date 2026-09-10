import React, { useState } from 'react';
import { NATIONAL_HELPLINES } from '../services/constants';
import TrustedContactModal from '../components/TrustedContactModal';
import QuickExitButton from '../components/QuickExitButton';
import { Shield, PhoneCall, ShieldAlert, MapPin, Scale, HeartHandshake, ExternalLink, Lock } from 'lucide-react';

export default function SafetyPage({ onSelectTab }) {
  const [showTrustedModal, setShowTrustedModal] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Safety, Crisis Center & Helplines
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Instant access to official 24x7 emergency dispatch, crisis mental health lines, Garima Greh emergency shelters, and privacy protection.
        </p>
      </div>

      {/* Critical Action Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>Immediate Danger Protocol</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Are you in immediate physical danger?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
            Dial 112 for police dispatch or 1800-200-1122 for the National Transgender Helpline. These lines are free, confidential, and operable across all states.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:112"
            className="px-6 py-3 rounded-2xl bg-white text-rose-700 font-extrabold text-sm shadow-lg hover:bg-rose-50 transition-colors flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-rose-600" />
            <span>Dial Police 112</span>
          </a>
          <a
            href="tel:18002001122"
            className="px-6 py-3 rounded-2xl bg-rose-900/60 hover:bg-rose-900 text-white font-extrabold text-sm border border-white/30 transition-colors flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Dial 1800-200-1122</span>
          </a>
        </div>
      </div>

      {/* Official Helplines Directory */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Verified National Crisis & Support Helplines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {NATIONAL_HELPLINES.map((hl, i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-card flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                  {hl.badge}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2 mb-1">
                  {hl.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                  {hl.description}
                </p>
                <div className="text-[11px] text-slate-400">
                  Timing: {hl.timing}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                <a
                  href={`tel:${hl.number.replace(/[^0-9]/g, '')}`}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-rose-600 dark:hover:bg-rose-600 dark:hover:text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {hl.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy, Trusted Contact & Safe Browsing Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trusted Contact Feature */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Trusted Contact Alert Dispatch
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Configure a trusted friend or guardian who can be contacted in one click during emergency distress. You can choose whether to attach your temporary GPS coordinates.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-500">
              ✓ Strictly opt-in • Zero continuous background tracking • Private to this browser
            </div>
          </div>

          <button
            onClick={() => setShowTrustedModal(true)}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow transition-colors"
          >
            Configure Trusted Contact
          </button>
        </div>

        {/* Quick Exit & Private Browsing Guidance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Safe Browsing & Quick Exit (Esc×2)
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If you are browsing Saksham in an unsupportive home, school, or workplace environment, clicking "Quick Exit" (or pressing the <kbd className="font-mono bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-[11px]">ESC</kbd> key twice rapidly) immediately redirects to Google Search and overwrites browser history.
            </p>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-500">
              ✓ One-click panic exit • History overwrite • Discreet tab camouflage
            </div>
          </div>

          <div className="flex items-center gap-3">
            <QuickExitButton />
            <button
              onClick={() => onSelectTab('map')}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold"
            >
              Find Nearest Shelter
            </button>
          </div>
        </div>
      </div>

      {showTrustedModal && (
        <TrustedContactModal
          isOpen={showTrustedModal}
          onClose={() => setShowTrustedModal(false)}
        />
      )}
    </div>
  );
}
