import React from 'react';
import { Shield, PhoneCall, Heart, ExternalLink } from 'lucide-react';
import { NATIONAL_HELPLINES } from '../services/constants';

export default function Footer({ onOpenEmergency, onSelectTab }) {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 transition-colors">
      {/* Emergency Helpline Banner */}
      <div className="bg-gradient-to-r from-brand-900/80 via-slate-900 to-accent-950/80 border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">In Crisis or Need Urgent Support?</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Official National Helplines are free, confidential, and available 24 hours a day across India.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="tel:18002001122"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>National TG Helpline: 1800-200-1122</span>
            </a>
            <button
              onClick={onOpenEmergency}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <span>View All 5 Helplines</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white font-extrabold text-lg">
                स
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">SAKSHAM</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Saksham is an AI-powered social-impact technology platform engineered to foster self-reliance, dignity, and opportunity for transgender people by bridging employment, certified skills, verified government welfare schemes, legal awareness, and trusted local networks.
            </p>
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
              <strong className="text-brand-400">Demo Data Disclosure:</strong> All impact statistics, sample metrics, and user testimonials are illustrative demo placeholders. Government schemes and legal guides reflect official Indian Gazette policies and Acts.
            </div>
          </div>

          {/* Opportunities & Growth */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Opportunities</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectTab('jobs')} className="hover:text-brand-400 transition-colors">
                  Inclusive Job Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('skills')} className="hover:text-brand-400 transition-colors">
                  Free Vocational Training
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('mentorship')} className="hover:text-brand-400 transition-colors">
                  Connect with Mentors
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('business')} className="hover:text-brand-400 transition-colors">
                  Saksham Business Hub
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('community')} className="hover:text-brand-400 transition-colors">
                  Moderated Peer Forum
                </button>
              </li>
            </ul>
          </div>

          {/* Welfare & Rights */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Welfare & Rights</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectTab('schemes')} className="hover:text-brand-400 transition-colors">
                  SMILE Scheme Portal
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('schemes')} className="hover:text-brand-400 transition-colors">
                  National TG ID Card
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('schemes')} className="hover:text-brand-400 transition-colors">
                  Ayushman Bharat TG Plus
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('legal')} className="hover:text-brand-400 transition-colors">
                  2019 Protection Act
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('map')} className="hover:text-brand-400 transition-colors">
                  Garima Greh Shelters
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Safety */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Safety & Privacy</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectTab('safety')} className="hover:text-brand-400 transition-colors">
                  Emergency Helplines
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('safety')} className="hover:text-brand-400 transition-colors">
                  Trusted Contact Alerts
                </button>
              </li>
              <li>
                <span className="text-slate-400">Anonymous Browsing (Enabled)</span>
              </li>
              <li>
                <span className="text-slate-400">Opt-in Geolocation Only</span>
              </li>
              <li>
                <span className="text-slate-400">WCAG AA Accessibility</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SAKSHAM Platform. Designed for transgender empowerment, safety, and self-reliance.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400">Zero Mandatory Identity Disclosure</span>
            <span>•</span>
            <span className="text-slate-400">Built with React & Python</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
