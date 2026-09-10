import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Briefcase,
  GraduationCap,
  FileCheck,
  Scale,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

export default function DashboardPage({ onSelectTab, onOpenAi }) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedRecs, setDismissedRecs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [recRes, appRes] = await Promise.all([
          api.getJobRecommendations(),
          api.getMyApplications()
        ]);
        setRecommendations(recRes.recommendations || []);
        setApplications(appRes.applications || []);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const handleDismissRec = (id) => {
    setDismissedRecs((prev) => [...prev, id]);
  };

  const visibleRecs = recommendations.filter((r) => !dismissedRecs.includes(r.id));

  // Calculate profile completion score
  let completionScore = 40;
  if (user?.preferred_name) completionScore += 15;
  if (user?.skills?.length > 0) completionScore += 25;
  if (user?.seeking_goals?.length > 0) completionScore += 10;
  if (user?.location) completionScore += 10;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-accent-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-bold tracking-widest text-brand-400">
              Personalized Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome to Saksham, {user?.preferred_name || 'Member'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Your hub for inclusive employment opportunities, verified government welfare schemes, certified skills, and legal empowerment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenAi}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-teal-500 hover:from-brand-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Ask Saksham AI</span>
            </button>
            <button
              onClick={() => onSelectTab('jobs')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Browse All Jobs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress & Completion Meter */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Profile Completion</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-brand-500 transition-all duration-500"
                  style={{ width: `${completionScore}%` }}
                ></div>
              </div>
              <span className="font-bold text-brand-400">{completionScore}%</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Skills Configured</span>
            <span className="font-black text-lg text-white font-mono">
              {user?.skills?.length || 0} Skills
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Applications Active</span>
            <span className="font-black text-lg text-white font-mono">
              {applications.length} Submissions
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Preferred Location</span>
            <span className="font-semibold text-xs text-white truncate block mt-0.5">
              {user?.location || 'Pan-India / Remote'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Find Jobs', tab: 'jobs', icon: Briefcase, color: 'text-teal-500' },
            { label: 'Find Skills', tab: 'skills', icon: GraduationCap, color: 'text-blue-500' },
            { label: 'Govt Schemes', tab: 'schemes', icon: FileCheck, color: 'text-amber-500' },
            { label: 'Legal Help', tab: 'legal', icon: Scale, color: 'text-purple-500' },
            { label: 'Support Map', tab: 'map', icon: MapPin, color: 'text-emerald-500' },
            { label: 'Ask Saksham AI', tab: 'ai', icon: Sparkles, color: 'text-accent-500', isAi: true }
          ].map((act, i) => {
            const Icon = act.icon;
            return (
              <button
                key={i}
                onClick={() => (act.isAi ? onOpenAi() : onSelectTab(act.tab))}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-500 transition-all text-center flex flex-col items-center justify-center gap-2 group"
              >
                <div className={`p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/60 ${act.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {act.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Personalized Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Personalized AI Opportunities for You
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Matched against your profile skills: <strong className="text-slate-700 dark:text-slate-300">{user?.skills?.join(', ') || 'General Aptitude'}</strong>
            </p>
          </div>
          <button
            onClick={() => onSelectTab('jobs')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>View All ({recommendations.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {visibleRecs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
            No active recommendations at the moment. Add more skills to your profile to expand matching opportunities.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleRecs.map((rec) => (
              <div
                key={rec.id}
                className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {rec.match_score}% Skill Match
                    </span>
                    <button
                      onClick={() => handleDismissRec(rec.id)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      title="Dismiss recommendation"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    {rec.employer_name} • {rec.location}
                  </p>

                  {/* AI Explanation Box */}
                  <div className="p-2.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/40 text-[11px] text-brand-900 dark:text-brand-200 mb-3">
                    <strong>Why recommended: </strong>
                    {rec.explanation}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {rec.salary_range}
                  </span>
                  <button
                    onClick={() => onSelectTab('jobs')}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Tracking & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Applications */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Application Progress Tracker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track status of your submitted job applications
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {applications.length} Total
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              You have not submitted any applications yet. Explore our Inclusive Job Marketplace to apply.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.map((app) => (
                <div key={app.application_id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {app.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {app.employer_name} • Applied on {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      app.application_status === 'Under Review'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        : app.application_status === 'Accepted'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                    }`}
                  >
                    {app.application_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Welfare Quick Link Box */}
        <div className="bg-gradient-to-br from-brand-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/60 rounded-2xl p-6 border border-brand-200/60 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/60 px-2 py-0.5 rounded-full inline-block mb-2">
              Essential Welfare Check
            </span>
            <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
              Have you obtained your National Transgender ID Card?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              The official TG ID card issued under the 2019 Act unlocks all central welfare schemes, ₹5 Lakh Ayushman Bharat coverage, and legal identity verification without mandatory surgery.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('schemes')}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Read National Portal Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
