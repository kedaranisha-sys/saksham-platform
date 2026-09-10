import React from 'react';
import { GraduationCap, Clock, Award, ExternalLink, Globe, CheckCircle2 } from 'lucide-react';

export default function CourseCard({ course }) {
  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
            {course.skill_category}
          </span>
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold">
              {course.cost}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1.5">
          {course.title}
        </h3>

        <div className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-brand-500" />
          <span>{course.provider}</span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-3">
          {course.description}
        </p>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
            <Clock className="w-3 h-3 text-slate-400" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
            <Globe className="w-3 h-3 text-slate-400" />
            {course.mode} • {course.level}
          </span>
        </div>

        {/* Eligibility notice */}
        {course.eligibility && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 mb-4">
            <strong className="text-slate-800 dark:text-slate-200">Eligibility: </strong>
            {course.eligibility}
          </div>
        )}
      </div>

      {/* Footer link */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified Provider
        </span>
        <a
          href={course.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-brand-600 dark:hover:bg-brand-400 transition-colors shadow-sm"
        >
          <span>Enroll / Official Info</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
