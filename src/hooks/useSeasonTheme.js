import { useState, useEffect } from 'react';

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

export const useSeasonTheme = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('looma_season') || 'auto'
  );

  useEffect(() => {
    localStorage.setItem('looma_season', theme);

    const activeSeason = theme === 'auto' ? getCurrentSeason() : theme;
    document.documentElement.dataset.season = activeSeason;
  }, [theme]);

  return { theme, setTheme };
};