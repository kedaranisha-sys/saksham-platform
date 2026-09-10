import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import JobCard from '../components/JobCard';
import { SKILL_CATEGORIES } from '../services/constants';
import { Briefcase, Search, Filter, PlusCircle, Users, CheckCircle2, Building, ShieldCheck, X } from 'lucide-react';

export default function JobsPage() {
  const { user, isEmployer, isAdmin } = useAuth();
  const { addToast } = useNotification();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState([]);

  // Employer View states
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'post' | 'applicants'
  const [postTitle, setPostTitle] = useState('');
  const [postCompany, setPostCompany] = useState(user?.role === 'employer' ? user?.preferred_name : 'Inclusive Innovations Corp');
  const [postLocation, setPostLocation] = useState('New Delhi, India');
  const [postIsRemote, setPostIsRemote] = useState(false);
  const [postType, setPostType] = useState('Full-time');
  const [postExperience, setPostExperience] = useState('Entry-level');
  const [postSalary, setPostSalary] = useState('₹25,000 - ₹35,000 / month');
  const [postSkills, setPostSkills] = useState('Customer Support, Communication');
  const [postDesc, setPostDesc] = useState('');
  const [postRequirements, setPostRequirements] = useState('');
  const [postBenefits, setPostBenefits] = useState('Equal opportunity workplace, health insurance, gender-neutral restrooms');

  // Application Modal state
  const [selectedJobToApply, setSelectedJobToApply] = useState(null);
  const [applyNotes, setApplyNotes] = useState('');
  const [applyResume, setApplyResume] = useState('');
  const [applying, setApplying] = useState(false);

  // Applicants List for Employers
  const [applicants, setApplicants] = useState([]);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState('job-1');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedSkill !== 'All') params.skill = selectedSkill;
      if (remoteOnly) params.remote = '1';

      const [jobsRes, appsRes] = await Promise.all([
        api.getJobs(params),
        api.getMyApplications()
      ]);

      setJobs(jobsRes.jobs || []);
      const appliedIds = (appsRes.applications || []).map((a) => a.job_id);
      setAppliedJobIds(appliedIds);
    } catch (err) {
      console.error(err);
      addToast('Error', 'Unable to fetch job listings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, selectedSkill, remoteOnly]);

  const handleApplyClick = (job) => {
    setSelectedJobToApply(job);
  };

  const handleConfirmApply = async (e) => {
    e.preventDefault();
    if (!selectedJobToApply) return;
    setApplying(true);

    try {
      await api.applyJob(selectedJobToApply.id, {
        applicant_name: user?.preferred_name || 'Applicant',
        email: user?.email || 'applicant@saksham.org',
        notes: applyNotes,
        resume_url: applyResume
      });
      setAppliedJobIds((prev) => [...prev, selectedJobToApply.id]);
      addToast('Application Submitted', `Applied for ${selectedJobToApply.title} at ${selectedJobToApply.employer_name}.`, 'success');
      setSelectedJobToApply(null);
      setApplyNotes('');
    } catch (err) {
      addToast('Application Error', err.message, 'error');
    } finally {
      setApplying(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const skillsArray = postSkills.split(',').map((s) => s.trim()).filter(Boolean);
      await api.createJob({
        title: postTitle,
        employer_name: postCompany,
        location: postLocation,
        is_remote: postIsRemote,
        job_type: postType,
        experience_level: postExperience,
        salary_range: postSalary,
        skills_required: skillsArray,
        description: postDesc,
        requirements: postRequirements,
        benefits: postBenefits,
        is_inclusive_workplace: true,
        inclusive_policies: ['Equal Opportunity Policy', 'Sensitized Workplace', 'Inclusive Healthcare']
      });

      addToast('Job Posted', 'Your inclusive job opening has been published successfully.', 'success');
      setActiveTab('browse');
      fetchJobs();
    } catch (err) {
      addToast('Post Error', err.message, 'error');
    }
  };

  const loadApplicants = async (jobId) => {
    setSelectedJobApplicants(jobId);
    try {
      const res = await api.getJobApplicants(jobId);
      setApplicants(res.applicants || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Inclusive Job Marketplace
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Connect with verified equal-opportunity employers committed to dignified workplaces, non-discrimination, and fair pay.
          </p>
        </div>

        {/* Tab Switcher (Seeker vs Employer) */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'browse'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'post'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post a Job (Employer)</span>
          </button>
          {(isEmployer || isAdmin) && (
            <button
              onClick={() => {
                setActiveTab('applicants');
                loadApplicants('job-1');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'applicants'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>View Applicants</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search job title, skills, or company..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Skill categories pill filter */}
            <div className="w-full flex-1 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
              {SKILL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedSkill(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSkill === cat
                      ? 'bg-brand-600 text-white font-bold shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Remote Only Toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>Remote Only</span>
            </label>
          </div>

          {/* Job Listings Grid */}
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading opportunities...</div>
          ) : jobs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              No jobs found matching your criteria. Try resetting filters or search terms.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApplyClick}
                  isApplied={appliedJobIds.includes(job.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Employer: Post a Job Tab */}
      {activeTab === 'post' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Post an Inclusive Employment Opportunity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Employers must voluntarily affirm inclusive non-discrimination policies to list roles on Saksham.
            </p>
          </div>

          <form onSubmit={handleCreateJob} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Job Title
              </label>
              <input
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="e.g. Apparel Pattern Master & Tailor"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={postCompany}
                  onChange={(e) => setPostCompany(e.target.value)}
                  placeholder="e.g. FabCraft Handlooms"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={postLocation}
                  onChange={(e) => setPostLocation(e.target.value)}
                  placeholder="e.g. Bengaluru, Karnataka"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Type
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Experience
                </label>
                <select
                  value={postExperience}
                  onChange={(e) => setPostExperience(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                >
                  <option value="Entry-level">Entry-level</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3+ years">3+ years</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Salary / Stipend
                </label>
                <input
                  type="text"
                  value={postSalary}
                  onChange={(e) => setPostSalary(e.target.value)}
                  placeholder="e.g. ₹22,000 - ₹28,000 / month"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Required Skills (Comma separated)
              </label>
              <input
                type="text"
                value={postSkills}
                onChange={(e) => setPostSkills(e.target.value)}
                placeholder="e.g. Tailoring, Embroidery, Garment Construction"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Role Description
              </label>
              <textarea
                rows={3}
                required
                value={postDesc}
                onChange={(e) => setPostDesc(e.target.value)}
                placeholder="Describe day-to-day responsibilities..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
              />
            </div>

            {/* Inclusive declaration */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block font-bold mb-0.5">Inclusive Workplace Pledge:</strong>
                <span>
                  By listing this role, our organization voluntarily pledges to uphold strict non-discrimination, safe restroom access, fair wages, and respectful name and pronoun usage.
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Publish Job Listing
            </button>
          </form>
        </div>
      )}

      {/* Employer: Applicants Manager Tab */}
      {activeTab === 'applicants' && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Applicant Tracking</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">View received applications for your job openings</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applicants.length === 0 ? (
              <p className="p-8 text-center text-xs text-slate-400">No applicants for this role yet.</p>
            ) : (
              applicants.map((a) => (
                <div key={a.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{a.applicant_name}</h4>
                    <p className="text-[11px] text-slate-500">{a.email} • Applied on {new Date(a.applied_at).toLocaleDateString()}</p>
                    {a.notes && <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">"{a.notes}"</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                      {a.status}
                    </span>
                    <button className="px-3 py-1.5 rounded-lg bg-brand-600 text-white font-bold text-xs">
                      Schedule Interview
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {selectedJobToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Apply for {selectedJobToApply.title}
                </h3>
                <p className="text-xs text-slate-500">{selectedJobToApply.employer_name} • {selectedJobToApply.location}</p>
              </div>
              <button onClick={() => setSelectedJobToApply(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmApply} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Applicant Name
                </label>
                <input
                  type="text"
                  required
                  value={user?.preferred_name || ''}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cover Note / Introduction
                </label>
                <textarea
                  rows={3}
                  required
                  value={applyNotes}
                  onChange={(e) => setApplyNotes(e.target.value)}
                  placeholder="Share your relevant experience, enthusiasm, and availability..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resume / Portfolio Link (Optional)
                </label>
                <input
                  type="url"
                  value={applyResume}
                  onChange={(e) => setApplyResume(e.target.value)}
                  placeholder="https://drive.google.com/... or LinkedIn"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobToApply(null)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
