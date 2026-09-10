import React, { useEffect } from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';

export default function QuickExitButton() {
  const triggerExit = () => {
    // Overwrite browser history and redirect to a neutral, common search page
    window.location.replace('https://www.google.com');
  };

  // Listen for double Esc press
  useEffect(() => {
    let lastEscTime = 0;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        const currentTime = new Date().getTime();
        if (currentTime - lastEscTime < 600) {
          triggerExit();
        }
        lastEscTime = currentTime;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <button
      onClick={triggerExit}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
      title="Safety Quick Exit: Immediately closes platform and redirects to Google Search (Double-press ESC also exits)"
      aria-label="Safety quick exit button"
    >
      <ShieldAlert className="w-3.5 h-3.5" />
      <span>Quick Exit (Esc×2)</span>
    </button>
  );
}
