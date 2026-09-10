import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import LegalCard from '../components/LegalCard';
import { LEGAL_CATEGORIES } from '../services/constants';
import { Scale, Search, ShieldAlert, PhoneCall } from 'lucide-react';

export default function LegalRightsPage() {
  const [legalGuides, setLegalGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchLegal = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await api.getLegalResources(params);
      setLegalGuides(res.legal_resources || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLegal();
  }, [search, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Legal Rights & Action Center
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Practical, simple-language guidance for asserting your rights under the Transgender Persons Act 2019 and landmark NALSA judgment.
        </p>
      </div>

      {/* Prominent Legal Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-purple-900 dark:text-purple-200">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block">Important Legal Notice:</strong>
            <span>
              This information is for general educational purposes and does not constitute formal legal counsel. For court representation or formal complaints, connect with the National Legal Services Authority (NALSA) or an empaneled advocate.
            </span>
          </div>
        </div>
        <a
          href="tel:15100"
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 flex-shrink-0 transition-colors shadow"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>NALSA Helpline: 15100</span>
        </a>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by issue (e.g., workplace discrimination, housing eviction, name change)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Categories scrollable pill list */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
          {LEGAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Legal Guides Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading legal rights guides...</div>
      ) : legalGuides.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          No legal guides found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {legalGuides.map((guide) => (
            <LegalCard key={guide.id} legal={guide} />
          ))}
        </div>
      )}
    </div>
  );
}
