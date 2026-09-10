import React, { useState } from 'react';
import { UserCheck, Clock, Briefcase, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function MentorCard({ mentor, onRequestMentorship, isRequested }) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [goals, setGoals] = useState('');
  const [message, setMessage] = useState('');

  const handleSendRequest = (e) => {
    e.preventDefault();
    onRequestMentorship(mentor.id, goals, message);
    setShowRequestModal(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Info */}
        <div className="flex items-start gap-3.5 mb-3">
          <img
            src={mentor.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={mentor.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-200 dark:border-brand-800 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {mentor.name}
              </h3>
            </div>
            <p className="text-xs font-semibold text-brand-700 dark:text-brand-400">
              {mentor.title}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {mentor.organization} • {mentor.years_experience} yrs exp
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-3">
          {mentor.bio}
        </p>

        {/* Skills Pills */}
        {mentor.skills && mentor.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {mentor.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Availability */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-4">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Availability: <strong>{mentor.availability}</strong></span>
        </div>
      </div>

      {/* Action button */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={() => setShowRequestModal(true)}
          disabled={isRequested}
          className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
            isRequested
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 cursor-default'
              : 'bg-brand-600 hover:bg-brand-500 text-white'
          }`}
        >
          {isRequested ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Mentorship Requested</span>
            </>
          ) : (
            <>
              <UserCheck className="w-4 h-4" />
              <span>Request Mentorship</span>
            </>
          )}
        </button>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Request Mentorship from {mentor.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Share your current goals and what specific guidance you are seeking.
            </p>

            <form onSubmit={handleSendRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Primary Goal
                </label>
                <input
                  type="text"
                  required
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. Career transition into tech, starting a tailoring boutique"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Introduction Note
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the mentor a little about yourself and your background..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow transition-colors"
                >
                  Send Mentorship Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
