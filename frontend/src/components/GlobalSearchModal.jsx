import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, X, Briefcase, GraduationCap, FileCheck, Scale, MapPin, ArrowRight } from 'lucide-react';

export default function GlobalSearchModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.globalSearch(query);
        setResults(res.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectResult(null, 'open_search');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'Job':
        return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'Course':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'Government Scheme':
        return <FileCheck className="w-4 h-4 text-amber-500" />;
      case 'Legal Rights':
        return <Scale className="w-4 h-4 text-purple-500" />;
      default:
        return <MapPin className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs, courses, government schemes, legal aid, shelters..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Searching platform records...</div>
          ) : results.length > 0 ? (
            results.map((res, i) => (
              <div
                key={i}
                onClick={() => {
                  if (onSelectResult) onSelectResult(res);
                  onClose();
                }}
                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {getIcon(res.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                        {res.title}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {res.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{res.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 transform group-hover:translate-x-1 transition-transform" />
              </div>
            ))
          ) : query ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No results found for "<span className="font-semibold">{query}</span>". Try keywords like "tailoring", "SMILE", "shelter", or "legal".
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              Type any keyword to search across Opportunities, Schemes, Courses, and Locations.
            </div>
          )}
        </div>

        <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between px-4">
          <span>ProTip: Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono">ESC</kbd> to close</span>
          <span>Fast Global Navigation</span>
        </div>
      </div>
    </div>
  );
}
