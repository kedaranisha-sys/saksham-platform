import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Sparkles, Check, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

const GOALS = [
  'Employment',
  'Education',
  'Skill development',
  'Government schemes',
  'Legal assistance',
  'Healthcare resources',
  'Entrepreneurship',
  'Mentorship',
  'Community support'
];

const COMMON_SKILLS = [
  'Computer skills',
  'Programming',
  'Graphic design',
  'Tailoring',
  'Beauty services',
  'Communication',
  'Customer Support',
  'Marketing',
  'Craft',
  'Cooking',
  'Data Entry',
  'Hospitality'
];

export default function OnboardingPage({ onComplete }) {
  const { user, updateProfile } = useAuth();
  const { addToast } = useNotification();

  const [preferredName, setPreferredName] = useState(user?.preferred_name || 'Aarav Sharma');
  const [isAnonymous, setIsAnonymous] = useState(user?.is_anonymous || false);
  const [selectedGoals, setSelectedGoals] = useState(user?.seeking_goals || ['Employment', 'Skill development']);
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || ['Tailoring', 'Customer Support', 'Computer skills']);
  const [customSkill, setCustomSkill] = useState('');
  const [location, setLocation] = useState(user?.location || 'New Delhi, India');
  const [loading, setLoading] = useState(false);

  const toggleGoal = (goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProfile({
        preferred_name: isAnonymous ? 'Anonymous Member' : preferredName,
        is_anonymous: isAnonymous,
        location: location.trim(),
        skills: selectedSkills,
        seeking_goals: selectedGoals
      });
      addToast('Profile Updated', 'Your personalized dashboard has been configured.', 'success');
      if (onComplete) onComplete();
    } catch (err) {
      addToast('Update Failed', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-xl transition-colors">
        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Setup</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome to Saksham
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Tell us how we can best support your independence. All questions are strictly opt-in and confidential.
          </p>
        </div>

        <div className="space-y-8">
          {/* Step 1: Preferred Name & Anonymous Choice */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">1</span>
              Identity & Privacy Settings
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Preferred Name
              </label>
              <input
                type="text"
                disabled={isAnonymous}
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                placeholder="Your preferred name or alias"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-brand-500 disabled:opacity-50"
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span className="font-semibold">
                Prefer to remain anonymous (Your identity will be masked as a private member handle across the forum and recommendations)
              </span>
            </label>
          </div>

          {/* Step 2: What are you looking for? */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">2</span>
              What are you looking for? (Select all that apply)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {GOALS.map((goal) => {
                const selected = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                      selected
                        ? 'bg-brand-50 dark:bg-brand-950/60 border-brand-500 text-brand-700 dark:text-brand-300 shadow-sm'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span>{goal}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Skills & Vocational Experience */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">3</span>
              Select or Enter Your Skills (Used for AI matching)
            </h3>

            <div className="flex flex-wrap gap-2">
              {COMMON_SKILLS.map((skill) => {
                const selected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selected
                        ? 'bg-accent-50 dark:bg-accent-950/60 border-accent-500 text-accent-700 dark:text-accent-300 font-bold'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {selected ? `✓ ${skill}` : `+ ${skill}`}
                  </button>
                );
              })}
            </div>

            {/* Add Custom Skill input */}
            <form onSubmit={addCustomSkill} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add other skill (e.g., Pattern Drafting, French Bakery)..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-semibold hover:bg-slate-700"
              >
                Add Skill
              </button>
            </form>
          </div>

          {/* Step 4: Optional Location */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs">4</span>
              Preferred Location (Optional)
            </h3>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New Delhi, Bengaluru, Mumbai, or Remote"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              *Location is always opt-in. It is only used to prioritize nearby support centers and local job openings.
            </p>
          </div>

          {/* Complete Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Saving Preferences...' : 'Go to My Personalized Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
