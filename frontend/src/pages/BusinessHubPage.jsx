import React, { useState } from 'react';
import { api } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Building2, Sparkles, Send, CheckCircle2, DollarSign, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const POPULAR_SKILL_IDEAS = [
  { skill: 'Tailoring & Embroidery', idea: 'Bespoke Alterations & Festive Wear Boutique' },
  { skill: 'Beauty & Skincare', idea: 'Home-Based & Doorstep Beauty Salon' },
  { skill: 'Cooking & Baking', idea: 'Healthy Meal-Box / Cloud Kitchen Subscription' },
  { skill: 'Graphic Design & Social Media', idea: 'Digital Content & Brand Identity Studio' },
  { skill: 'Handicrafts & Block Printing', idea: 'Eco-Friendly Artisan Bags & Decor' }
];

export default function BusinessHubPage() {
  const { addToast } = useNotification();
  const [skillInput, setSkillInput] = useState('I know tailoring, embroidery and pattern cutting.');
  const [budgetInput, setBudgetInput] = useState('₹50,000 (Micro-budget)');
  const [locationInput, setLocationInput] = useState('Urban Neighborhood');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGenerate = async (querySkill) => {
    const text = querySkill || skillInput;
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const res = await api.generateBusinessPlan({
        skill_or_idea: text.trim(),
        investment_budget: budgetInput,
        location: locationInput
      });
      setPlan(res.business_plan);
      addToast('Business Plan Generated', 'Your customized startup roadmap is ready.', 'success');
    } catch (err) {
      addToast('Generation Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Saksham Business Hub & Micro-Enterprise Incubator
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Turn your personal skills and vocational craft into sustainable, self-owned enterprises with AI business planning and subsidized government micro-loans.
        </p>
      </div>

      {/* AI Generator Card */}
      <div className="bg-gradient-to-br from-brand-900 via-slate-900 to-accent-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500/20 border border-brand-400/40 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-400 animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">
              AI Micro-Business Plan Generator
            </h2>
            <p className="text-xs text-slate-300">
              Tell Saksham your skill or passion (e.g. "I know tailoring" or "I do bridal makeup"). Our AI will craft an actionable startup model.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Your Vocational Skill / Business Passion
            </label>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="e.g. I know tailoring, baking, beauty salon, or graphic design..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Available Investment Budget
            </label>
            <select
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
            >
              <option value="Under ₹25,000 (Bootstrap)">Under ₹25,000 (Bootstrap)</option>
              <option value="₹25,000 - ₹50,000 (MUDRA Shishu)">₹25,000 - ₹50,000 (MUDRA Shishu)</option>
              <option value="₹50,000 - ₹1,000,000 (NBCFDC Loan)">₹50,000 - ₹1,00,000 (NBCFDC Loan)</option>
              <option value="₹1,00,000+ (Term Loan)">₹1,00,000+ (Term Loan)</option>
            </select>
          </div>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs scrollbar-none pt-1">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">Try examples:</span>
          {POPULAR_SKILL_IDEAS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSkillInput(item.skill);
                handleGenerate(item.skill);
              }}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 whitespace-nowrap transition-colors"
            >
              {item.skill}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleGenerate()}
          disabled={loading || !skillInput.trim()}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'Analyzing Market & Financials...' : 'Generate 30-Day Startup Plan'}</span>
        </button>
      </div>

      {/* Generated Plan Output */}
      {plan && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-xl space-y-6 animate-fadeIn">
          {/* Plan Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                AI Customized Business Model
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {plan.title}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Break-Even: <strong>{plan.financial_estimates?.break_even_months}</strong>
            </span>
          </div>

          {/* Business Concept */}
          <div className="space-y-1">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Business Concept</h4>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {plan.concept}
            </p>
          </div>

          {/* Target Customers & Equipment Required */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Target Customers
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {plan.target_customers?.map((cust, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{cust}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Initial Equipment & Tools Needed
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {plan.equipment_needed?.map((eq, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Financial Projections (Clearly labeled as Demo Estimates) */}
          <div className="p-5 rounded-2xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-brand-900 dark:text-brand-300">
                Financial Projections (Demo / Sample Projections)
              </h4>
              <span className="text-[10px] text-brand-700 dark:text-brand-400 italic">
                *Approximate estimates; verify with local suppliers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Estimated Startup Capital</span>
                <span className="font-black text-sm text-slate-900 dark:text-white mt-1 block font-mono">
                  {plan.financial_estimates?.startup_cost}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Monthly Revenue Potential</span>
                <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 mt-1 block font-mono">
                  {plan.financial_estimates?.monthly_revenue_potential}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Monthly Operating Overheads</span>
                <span className="font-black text-sm text-slate-700 dark:text-slate-300 mt-1 block font-mono">
                  {plan.financial_estimates?.monthly_operating_cost}
                </span>
              </div>
            </div>
          </div>

          {/* Government Micro-Finance & Loans */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Applicable Government Subsidies & Low-Interest Schemes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {plan.government_schemes?.map((sch, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <span>{sch}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 30-Day Launch Roadmap */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              30-Day Step-by-Step Launch Roadmap
            </h4>
            <div className="space-y-2">
              {plan.roadmap_steps?.map((step, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs text-slate-700 dark:text-slate-200">
                  <span className="w-6 h-6 rounded-full bg-brand-600 text-white font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
