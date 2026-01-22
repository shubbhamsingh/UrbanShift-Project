import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Default 'system' rakhenge agar koi purani setting nahi hai
  const [mode, setMode] = useState(localStorage.getItem('site-theme') || 'system');
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let themeToApply = mode;

      if (mode === 'system') {
        // Agar System mode hai, to device ki setting check karo
        themeToApply = mediaQuery.matches ? 'dark' : 'light';
      }

      document.documentElement.setAttribute('data-theme', themeToApply);
      localStorage.setItem('site-theme', mode);
    };

    // Turant apply karein
    applyTheme();

    // Agar user 'System' mode me hai aur laptop ka theme badalta hai, to live change karein
    const handleSystemChange = () => {
      if (mode === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);

  }, [mode]);

  // Cycle: Light -> Dark -> System -> Light...
  const cycleTheme = () => {
    setMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    // 'mode' bhej rahe hain taki button ko pata chale kaunsa icon dikhana hai
    <ThemeContext.Provider value={{ mode, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};