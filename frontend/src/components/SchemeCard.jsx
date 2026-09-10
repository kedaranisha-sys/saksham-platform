import React, { useState } from 'react';
import { FileCheck, Calendar, ExternalLink, ChevronDown, ChevronUp, ShieldCheck, CheckSquare, Square } from 'lucide-react';

export default function SchemeCard({ scheme }) {
  const [expanded, setExpanded] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState({});

  const toggleDoc = (docIndex) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docIndex]: !prev[docIndex]
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
            {scheme.category}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Last Verified: {scheme.last_verified_date}</span>
          </div>
        </div>

        {/* Title & Official Provider */}
        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
          {scheme.name}
        </h3>
        <p className="text-xs text-brand-700 dark:text-brand-400 font-semibold mb-3">
          {scheme.provider}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-3">
          {scheme.description}
        </p>

        {/* Benefits Highlights Box */}
        <div className="p-3 rounded-xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/60 text-xs text-brand-950 dark:text-brand-100 mb-3 space-y-1">
          <strong className="block font-bold text-brand-900 dark:text-brand-200 text-xs">
            Key Benefits:
          </strong>
          <div className="whitespace-pre-line text-[11px] leading-relaxed opacity-95">
            {scheme.benefits}
          </div>
        </div>

        {/* Eligibility summary */}
        <div className="text-xs text-slate-600 dark:text-slate-300 mb-3">
          <strong className="text-slate-800 dark:text-slate-200">Who is Eligible: </strong>
          <span>{scheme.eligibility}</span>
        </div>
      </div>

      {/* Expandable Application Procedure & Interactive Documents Checklist */}
      <div>
        <div className="pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors border border-slate-200/60 dark:border-slate-800"
          >
            <span>{expanded ? 'Hide Application Checklist' : 'View Checklist & Step-by-Step Procedure'}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-3 animate-fadeIn">
            {/* Required Documents Checklist */}
            <div>
              <span className="font-bold text-slate-900 dark:text-white block mb-1.5">
                Required Documents Checklist (Tap to mark ready):
              </span>
              <div className="space-y-1.5">
                {scheme.required_documents.map((doc, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleDoc(idx)}
                    className="flex items-start gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  >
                    {checkedDocs[idx] ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        checkedDocs[idx]
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {doc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Procedure */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                Step-by-Step Application Procedure:
              </span>
              <div className="whitespace-pre-line text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {scheme.application_procedure}
              </div>
            </div>

            {/* Advisory */}
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-[11px] text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-900">
              <strong>Verify Before Applying:</strong> Administrative forms and portal links are updated per official gazette revisions. Always confirm requirements on the official government portal.
            </div>
          </div>
        )}

        {/* Action button to official portal */}
        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official Government Initiative
          </span>
          <a
            href={scheme.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <span>Apply on Official Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
