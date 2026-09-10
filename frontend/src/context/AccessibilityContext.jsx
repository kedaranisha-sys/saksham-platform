import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('saksham_font_size') || 'normal');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('saksham_contrast') === 'true');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('saksham_theme') === 'dark');

  // Font size effect
  useEffect(() => {
    document.body.classList.remove('text-lg', 'text-xl');
    if (fontSize === 'lg') document.body.classList.add('text-lg');
    if (fontSize === 'xl') document.body.classList.add('text-xl');
    localStorage.setItem('saksham_font_size', fontSize);
  }, [fontSize]);

  // High contrast effect
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    localStorage.setItem('saksham_contrast', String(highContrast));
  }, [highContrast]);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('saksham_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleHighContrast = () => setHighContrast((prev) => !prev);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const cycleFontSize = () => {
    setFontSize((prev) => {
      if (prev === 'normal') return 'lg';
      if (prev === 'lg') return 'xl';
      return 'normal';
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        cycleFontSize,
        highContrast,
        toggleHighContrast,
        isDarkMode,
        toggleDarkMode
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
