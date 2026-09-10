import React, { useState } from 'react';
import { Briefcase, MapPin, CheckCircle2, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';

export default function JobCard({ job, onApply, isApplied }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              {job.employer_name}
            </span>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {job.title}
            </h3>
          </div>
          {job.is_inclusive_workplace && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold flex-shrink-0"
              title="Employer has committed to verified non-discrimination policies & inclusive workplace standards"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inclusive Workplace</span>
            </span>
          )}
        </div>

        {/* Location & Meta info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location} {job.is_remote ? '(Remote Available)' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {job.job_type} • {job.experience_level}
          </span>
          {job.salary_range && (
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {job.salary_range}
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {job.description}
        </p>

        {/* Skills Pills */}
        {job.skills_required && job.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {job.skills_required.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Inclusive Policies tags */}
        {job.inclusive_policies && job.inclusive_policies.length > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 mb-4">
            <strong className="text-slate-700 dark:text-slate-300 block mb-1">Affirmative Policies:</strong>
            <div className="flex flex-wrap gap-1">
              {job.inclusive_policies.map((p, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  ✓ {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          {showDetails ? 'Hide Full Details' : 'View Full Details'}
        </button>

        <button
          onClick={() => onApply(job)}
          disabled={isApplied}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
            isApplied
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 cursor-default'
              : 'bg-brand-600 hover:bg-brand-500 text-white'
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Applied</span>
            </>
          ) : (
            <>
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Expanded Modal/Details Drawer */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs space-y-2.5 animate-fadeIn">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Requirements</h4>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">{job.requirements || 'Standard high school diploma or equivalent.'}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Workplace Benefits</h4>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5">{job.benefits || 'Equal opportunity workplace, insurance, training allowance.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
