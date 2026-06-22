'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth, User } from '@/contexts/AuthContext';

interface UserMenuProps {
  user: User;
  onOpenDocuments: () => void;
}

export function UserMenu({ user, onOpenDocuments }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { signout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignout = async () => {
    await signout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-navy/5 transition-colors border border-transparent hover:border-border/70"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-blue rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          {user.email[0].toUpperCase()}
        </div>
        <span className="text-sm text-brand-navy/80 hidden sm:inline max-w-32 truncate">
          {user.email}
        </span>
        <svg
          className={`w-4 h-4 text-brand-gray transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 dropdown-panel rounded-xl shadow-xl shadow-brand-navy/10 py-1 z-50">
          <div className="px-4 py-2.5 border-b border-border/70">
            <p className="text-sm font-medium text-brand-navy truncate">{user.email}</p>
          </div>
          <button
            onClick={() => {
              onOpenDocuments();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-brand-navy/80 hover:bg-brand-blue/5 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            My Documents
          </button>
          <button
            onClick={handleSignout}
            className="w-full text-left px-4 py-2.5 text-sm text-brand-navy/80 hover:bg-brand-purple/5 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
