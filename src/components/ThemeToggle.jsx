import React from 'react';
import { useTranslation } from 'react-i18next';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';
import { setTheme, useTheme } from '../lib/theme';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  const label = next === 'dark' ? t('header.temaIntunecata') : t('header.temaLuminoasa');

  const toggle = (event) => {
    if (!document.startViewTransition || prefersReducedMotion()) {
      setTheme(next);
      return;
    }

    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    });
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle-icon" data-active={theme === 'light'}><Sun size={18} /></span>
      <span className="theme-toggle-icon" data-active={theme === 'dark'}><Moon size={18} /></span>
      {showLabel && <span className="theme-toggle-label">{label}</span>}
    </button>
  );
};

export default ThemeToggle;
