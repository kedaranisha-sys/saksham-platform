import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import CommunityPostCard from '../components/CommunityPostCard';
import { Users, PlusCircle, Search, ShieldCheck, MessageSquare, X } from 'lucide-react';

const CHANNELS = [
  { id: 'all', label: 'All Discussions' },
  { id: 'general', label: 'General' },
  { id: 'career', label: 'Career & Jobs' },
  { id: 'legal', label: 'Legal Experiences' },
  { id: 'wellness', label: 'Health & Wellness' },
  { id: 'success_stories', label: 'Success Stories 🎉' }
];

export default function CommunityPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [search, setSearch] = useState('');

  // Create post modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newChannel, setNewChannel] = useState('general');
  const [isAnonymousPost, setIsAnonymousPost] = useState(user?.is_anonymous || false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedChannel !== 'all') params.channel = selectedChannel;
      if (search) params.search = search;

      const res = await api.getPosts(params);
      setPosts(res.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedChannel, search]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      await api.createPost({
        title: newTitle.trim(),
        content: newContent.trim(),
        channel: newChannel,
        is_anonymous: isAnonymousPost,
        author_name: user?.preferred_name || 'Community Member'
      });
      addToast('Post Published', 'Your post is now live in the community.', 'success');
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
      fetchPosts();
    } catch (err) {
      addToast('Post Error', err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.likePost(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes_count: res.likes_count } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId, content) => {
    await api.addComment(postId, {
      content,
      is_anonymous: user?.is_anonymous || false,
      author_name: user?.preferred_name || 'Community Member'
    });
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p))
    );
    addToast('Comment Posted', 'Your reply has been added.', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Moderated Community Peer Forum
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            A dignified, moderated peer space to share questions, job advice, documentation tips, and encouraging success stories.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md transition-colors flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Post</span>
        </button>
      </div>

      {/* Community Moderation Guidelines Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong>Safe Space Guarantee:</strong> Hate speech, deadnaming, harassment, or sharing private personal data are strictly prohibited and reviewed by administrators.
          </span>
        </div>
      </div>

      {/* Channel Pills & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedChannel === ch.id
                  ? 'bg-brand-600 text-white font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
          />
        </div>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading community discussions...</div>
      ) : posts.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          No discussions found in this channel yet. Be the first to start a conversation!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onAddComment={handleAddComment}
            />
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Share with the Community
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Discussion Channel
                </label>
                <select
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                >
                  <option value="general">General</option>
                  <option value="career">Career & Jobs</option>
                  <option value="legal">Legal Experiences</option>
                  <option value="wellness">Health & Wellness</option>
                  <option value="success_stories">Success Stories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title or Question
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Tips for opening a bank account with TG ID Card?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Content
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write your experience, questions, or guidance..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              {/* Public vs Anonymous Toggle */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isAnonymousPost}
                    onChange={(e) => setIsAnonymousPost(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Post Anonymously (Hide your name and display a masked community handle)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow"
                >
                  {submitting ? 'Publishing...' : 'Publish Discussion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
