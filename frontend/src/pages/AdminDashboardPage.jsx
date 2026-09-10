import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { ShieldAlert, Users, Briefcase, GraduationCap, FileCheck, MapPin, CheckCircle2, Trash2, RotateCcw } from 'lucide-react';

export default function AdminDashboardPage() {
  const { addToast } = useNotification();
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, reportsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminReports()
      ]);
      setStats(statsRes.stats);
      setReports(reportsRes.reports || []);
    } catch (err) {
      console.error(err);
      addToast('Error', 'Unable to fetch admin statistics.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleResolveReport = async (reportId, action) => {
    try {
      const res = await api.resolveReport(reportId, action);
      addToast('Moderation Action Taken', res.message, 'success');
      fetchAdminData();
    } catch (err) {
      addToast('Action Failed', err.message, 'error');
    }
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      await api.resetDemoData();
      addToast('Reset Complete', 'Database restored to verified seed data.', 'success');
      fetchAdminData();
    } catch (err) {
      addToast('Error', err.message, 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Platform Administration & Content Moderation
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            System health indicators, catalog governance, and safety moderation queue.
          </p>
        </div>

        <button
          onClick={handleResetData}
          disabled={resetting}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shadow transition-colors"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          <span>Reset to Verified Seed Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-slate-400 text-[11px] block">Total Users</span>
            <span className="font-black text-2xl text-slate-900 dark:text-white font-mono mt-1 block">
              {stats.total_users}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-slate-400 text-[11px] block">Active Jobs</span>
            <span className="font-black text-2xl text-teal-600 dark:text-teal-400 font-mono mt-1 block">
              {stats.active_jobs}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-slate-400 text-[11px] block">Applications</span>
            <span className="font-black text-2xl text-blue-600 dark:text-blue-400 font-mono mt-1 block">
              {stats.total_applications}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-slate-400 text-[11px] block">Govt Schemes</span>
            <span className="font-black text-2xl text-amber-600 dark:text-amber-400 font-mono mt-1 block">
              {stats.total_schemes}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-slate-400 text-[11px] block">Map Centers</span>
            <span className="font-black text-2xl text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
              {stats.map_locations}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-slate-400 text-[11px] block">Pending Reports</span>
            <span className="font-black text-2xl text-rose-600 dark:text-rose-400 font-mono mt-1 block">
              {stats.pending_reports}
            </span>
          </div>
        </div>
      )}

      {/* Community Moderation Queue */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Community Moderation Queue
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Flagged posts requiring review to prevent hate speech, deadnaming, or harassment.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {reports.length} Flagged
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            ✓ No reported posts pending review. Community is adhering to community guidelines.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {reports.map((r) => (
              <div key={r.report_id} className="py-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      Reason: {r.reason}
                    </span>
                    <span className="text-slate-400">• Reported on {new Date(r.reported_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                    {r.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-0.5">{r.post_title}</h4>
                  <p className="text-slate-600 dark:text-slate-300">{r.post_content}</p>
                </div>

                {r.status === 'pending' && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleResolveReport(r.report_id, 'dismiss')}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold"
                    >
                      Dismiss (Keep Post)
                    </button>
                    <button
                      onClick={() => handleResolveReport(r.report_id, 'remove_post')}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                    >
                      Remove Post from Community
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
