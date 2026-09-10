import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, ShieldAlert, User, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';

export default function CommunityPostCard({ post, onLike, onAddComment }) {
  const { addToast } = useNotification();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reported, setReported] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || commenting) return;
    setCommenting(true);
    try {
      await onAddComment(post.id, commentText);
      setCommentText('');
      setShowComments(true);
    } catch (err) {
      addToast('Error', 'Failed to submit comment.', 'error');
    } finally {
      setCommenting(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.reportPost(post.id, { reason: reportReason });
      setReported(true);
      setShowReportModal(false);
      addToast('Report Received', 'Thank you. Administrators will review this post.', 'success');
    } catch (err) {
      addToast('Report Failed', err.message, 'error');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-card transition-all">
      {/* Author & Channel */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              post.is_anonymous
                ? 'bg-slate-700 text-slate-300'
                : 'bg-brand-100 text-brand-700 dark:bg-brand-900/60 dark:text-brand-300'
            }`}
          >
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                {post.author_name}
              </span>
              {post.is_anonymous && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-mono">
                  Anonymous Post
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 uppercase tracking-wide">
          #{post.channel}
        </span>
      </div>

      {/* Post Title & Content */}
      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
        {post.title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-4">
        {post.content}
      </p>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onLike(post.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors font-medium"
          >
            <ThumbsUp className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{post.likes_count || 0} Upvotes</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors font-medium"
          >
            <MessageSquare className="w-3.5 h-3.5 text-accent-500" />
            <span>{post.comments_count || 0} Comments</span>
          </button>
        </div>

        {reported ? (
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Reported for review
          </span>
        ) : (
          <button
            onClick={() => setShowReportModal(true)}
            className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
            title="Report inappropriate content to moderators"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Report</span>
          </button>
        )}
      </div>

      {/* Expanded Comments Section */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fadeIn">
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add an encouraging or informative reply..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || commenting}
              className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-5 space-y-3 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Report Community Content
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Help us maintain a dignified and safe space. Please specify the issue.
            </p>
            <form onSubmit={handleReportSubmit} className="space-y-3">
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              >
                <option value="">Select a reason...</option>
                <option value="Hate speech or harassment">Hate speech or harassment</option>
                <option value="Personal data or deadname disclosure">Personal data or deadname disclosure</option>
                <option value="Spam or fraudulent opportunity">Spam or fraudulent opportunity</option>
                <option value="Violent threats or endangerment">Violent threats or endangerment</option>
              </select>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!reportReason}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow transition-colors"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
