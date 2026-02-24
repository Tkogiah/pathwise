'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

type Theme = 'light' | 'dark';

function getInitialTheme(storageKey: string): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(storageKey);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function ThemeToggle() {
  const { user } = useAuth();
  const storageKey = user ? `pathwise-theme:${user.id}` : 'theme';
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme(storageKey));
    setMounted(true);
  }, [storageKey]);

  useEffect(() => {
    if (!mounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('theme-dark');
    } else {
      document.documentElement.classList.remove('theme-dark');
    }
  }, [mounted, theme]);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem(storageKey, next);
  };

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
      className="rounded-full bg-surface-card px-3 py-1 text-sm text-content-muted hover:text-content-secondary"
    >
      {theme === 'dark' ? '\u2600\uFE0F Light' : '\uD83C\uDF19 Dark'}
    </button>
  );
}
