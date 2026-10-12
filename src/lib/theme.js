import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'theme';
const THEME_COLORS = { light: '#ffffff', dark: '#0d141b' };
const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

const readStored = () => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

const apply = (theme) => {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
};

export const getTheme = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

export const setTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode: the choice still applies for this visit.
  }
  apply(theme);
};

const subscribe = (callback) => {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const onSystemChange = (event) => {
    if (!readStored()) apply(event.matches ? 'dark' : 'light');
  };
  systemQuery.addEventListener('change', onSystemChange);

  return () => {
    observer.disconnect();
    systemQuery.removeEventListener('change', onSystemChange);
  };
};

export const useTheme = () => useSyncExternalStore(subscribe, getTheme);

apply(readStored() ?? (systemQuery.matches ? 'dark' : 'light'));
