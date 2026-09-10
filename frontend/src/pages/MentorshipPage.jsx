import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import MentorCard from '../components/MentorCard';
import { UserCheck, Search, Filter, PlusCircle, CheckCircle2, Clock, Sparkles, X } from 'lucide-react';

const INDUSTRIES = [
  'All',
  'Technology / IT',
  'Fashion & Tailoring',
  'Legal Advocacy',
  'Hospitality & Tourism',
  'Beauty & Wellness',
  'Corporate DEI & HR'
];

export default function MentorshipPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [mentors, setMentors] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [search, setSearch] = useState('');
  const [showBecomeMentorModal, setShowBecomeMentorModal] = useState(false);

  // Mentor application form
  const [mentorTitle, setMentorTitle] = useState('');
  const [mentorOrg, setMentorOrg] = useState('');
  const [mentorIndustry, setMentorIndustry] = useState('Technology / IT');
  const [mentorExp, setMentorExp] = useState(5);
  const [mentorSkills, setMentorSkills] = useState('');
  const [mentorBio, setMentorBio] = useState('');
  const [mentorAvail, setMentorAvail] = useState('2 hours/week');

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedIndustry !== 'All') params.industry = selectedIndustry;
      if (search) params.search = search;

      const [mRes, rRes] = await Promise.all([
        api.getMentors(params),
        api.getMyMentorRequests()
      ]);

      setMentors(mRes.mentors || []);
      setMyRequests(rRes.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [selectedIndustry, search]);

  const handleRequestMentorship = async (mentorId, goals, message) => {
    try {
      await api.requestMentorship({
        mentor_id: mentorId,
        mentee_name: user?.preferred_name || 'Mentee',
        mentee_email: user?.email || 'mentee@saksham.org',
        goals,
        message
      });
      addToast('Mentorship Requested', 'Your request has been sent to the mentor.', 'success');
      fetchMentors();
    } catch (err) {
      addToast('Request Failed', err.message, 'error');
    }
  };

  const handleBecomeMentorSubmit = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = mentorSkills.split(',').map((s) => s.trim()).filter(Boolean);
      await api.becomeMentor({
        name: user?.preferred_name || 'Mentor',
        title: mentorTitle,
        organization: mentorOrg,
        industry: mentorIndustry,
        years_experience: mentorExp,
        skills: skillsArray,
        bio: mentorBio,
        availability: mentorAvail
      });
      addToast('Mentor Profile Created', 'You are now listed in the mentorship network.', 'success');
      setShowBecomeMentorModal(false);
      fetchMentors();
    } catch (err) {
      addToast('Failed', err.message, 'error');
    }
  };

  const requestedMentorIds = myRequests.map((r) => r.mentor_id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Community Mentorship Network
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect one-on-one with experienced transgender and allied leaders across technology, tailoring, law, hospitality, and corporate careers.
          </p>
        </div>

        <button
          onClick={() => setShowBecomeMentorModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow transition-colors flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Become a Mentor</span>
        </button>
      </div>

      {/* Active Requests Status Tracker */}
      {myRequests.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-500" />
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
              My Active Mentorship Connections ({myRequests.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{req.mentor_name}</h4>
                  <p className="text-[11px] text-slate-500">{req.mentor_title} • {req.mentor_org}</p>
                  <p className="text-[11px] text-brand-600 dark:text-brand-400 mt-0.5">Goal: {req.goals}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    req.status === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mentor by name, industry, or expertise..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setSelectedIndustry(ind)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedIndustry === ind
                  ? 'bg-brand-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Mentors Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading mentors...</div>
      ) : mentors.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          No mentors found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onRequestMentorship={handleRequestMentorship}
              isRequested={requestedMentorIds.includes(mentor.id)}
            />
          ))}
        </div>
      )}

      {/* Become a Mentor Modal */}
      {showBecomeMentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Join as a Community Mentor
              </h3>
              <button onClick={() => setShowBecomeMentorModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBecomeMentorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  required
                  value={mentorTitle}
                  onChange={(e) => setMentorTitle(e.target.value)}
                  placeholder="e.g. Senior Software Architect / Studio Director"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    required
                    value={mentorOrg}
                    onChange={(e) => setMentorOrg(e.target.value)}
                    placeholder="e.g. FabIndia / Tech Corp"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={mentorExp}
                    onChange={(e) => setMentorExp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Industry
                </label>
                <select
                  value={mentorIndustry}
                  onChange={(e) => setMentorIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {INDUSTRIES.filter((i) => i !== 'All').map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Skills & Expertise (Comma separated)
                </label>
                <input
                  type="text"
                  required
                  value={mentorSkills}
                  onChange={(e) => setMentorSkills(e.target.value)}
                  placeholder="e.g. React, Portfolio Review, Interview Prep"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mentoring Bio
                </label>
                <textarea
                  rows={3}
                  required
                  value={mentorBio}
                  onChange={(e) => setMentorBio(e.target.value)}
                  placeholder="Describe your background and how you can guide community mentees..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Weekly Availability
                </label>
                <input
                  type="text"
                  value={mentorAvail}
                  onChange={(e) => setMentorAvail(e.target.value)}
                  placeholder="e.g. 2 hours/week (Saturdays)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBecomeMentorModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold shadow"
                >
                  Submit Mentor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
