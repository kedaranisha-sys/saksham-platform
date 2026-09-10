import React from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { Sun, Moon, Type, Eye } from 'lucide-react';

export default function AccessibilityBar() {
  const { fontSize, cycleFontSize, highContrast, toggleHighContrast, isDarkMode, toggleDarkMode } = useAccessibility();

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-medium text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            A11y Accessible
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            Screen Reader Optimized • WCAG AA
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Font size adjustment */}
          <button
            onClick={cycleFontSize}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Cycle text size: Normal -> Large -> Extra Large"
            aria-label="Adjust font size"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider">
              {fontSize === 'normal' ? 'Text: Normal' : fontSize === 'lg' ? 'Text: Large' : 'Text: XL'}
            </span>
          </button>

          {/* High Contrast */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
              highContrast ? 'bg-yellow-400 text-black font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Toggle High Contrast Mode"
            aria-label="Toggle high contrast mode"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>High Contrast</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
