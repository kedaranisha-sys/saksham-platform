import React, { useState } from 'react';
import { Scale, Phone, AlertCircle, ChevronDown, ChevronUp, ExternalLink, Shield } from 'lucide-react';

export default function LegalCard({ legal }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Category Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
            {legal.category}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {legal.official_acts.split(';')[0]}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2">
          {legal.title}
        </h3>

        {/* The Problem ("What Happened?") */}
        <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-xs mb-3">
          <strong className="text-rose-900 dark:text-rose-300 font-bold block mb-0.5">
            The Problem ("What Happened?"):
          </strong>
          <p className="text-rose-800 dark:text-rose-200 text-xs leading-relaxed">
            {legal.problem_summary}
          </p>
        </div>

        {/* Constitutional & Statutory Rights */}
        <div className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
          <strong className="text-slate-800 dark:text-slate-200 block mb-1">Your Legal Rights:</strong>
          {legal.rights_overview}
        </div>
      </div>

      <div>
        {/* Practical Action Steps toggle */}
        <div className="pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors border border-slate-200/60 dark:border-slate-800"
          >
            <span>{expanded ? 'Hide Practical Steps' : 'View Action Steps & Legal Aid Contacts'}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-3 animate-fadeIn">
            {/* Steps */}
            <div>
              <strong className="text-slate-900 dark:text-white block mb-1.5">
                Practical Steps ("What You Can Do"):
              </strong>
              <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {legal.practical_steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Where to get help */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">
                Where to Get Free Help:
              </strong>
              <div className="space-y-1.5">
                {legal.legal_aid_contacts.map((contact, idx) => (
                  <div key={idx} className="flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-slate-800 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{contact.name}</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">{contact.contact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Acts Reference */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
              <strong>Statutory References: </strong> {legal.official_acts}
            </div>
          </div>
        )}

        {/* Disclaimer Note */}
        <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-slate-400" />
            General educational purpose; not legal counsel.
          </span>
          <a
            href="tel:15100"
            className="font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            <span>NALSA: 15100</span>
          </a>
        </div>
      </div>
    </div>
  );
}
