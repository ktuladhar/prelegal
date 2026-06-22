'use client';

import { useTheme } from '@/contexts/ThemeContext';

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.5 14.5A8.5 8.5 0 019.5 3.5 8.5 8.5 0 1018 18a6.5 6.5 0 002.5-3.5z"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="theme-toggle" role="group" aria-label="Color theme">
      <span
        className="theme-toggle-indicator"
        data-active={isDark ? 'dark' : 'light'}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={!isDark}
        aria-label="Light mode"
        title="Light mode"
        className={`theme-toggle-option ${!isDark ? 'is-active' : ''}`}
      >
        <SunIcon className="theme-toggle-icon" />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={isDark}
        aria-label="Dark mode"
        title="Dark mode"
        className={`theme-toggle-option ${isDark ? 'is-active' : ''}`}
      >
        <MoonIcon className="theme-toggle-icon" />
      </button>
    </div>
  );
}
