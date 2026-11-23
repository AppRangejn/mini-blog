'use client';

import { ROUTES } from '@/constants';
import { User } from '@/types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface PlatformDropdownProps {
  user: User | null;
  isAdmin: boolean;
  isAuthReady: boolean;
}

export function PlatformDropdown({
  user,
  isAdmin,
  isAuthReady,
}: PlatformDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <div className="relative hidden sm:block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/90 px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200/70"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span>Platform</span>
        <svg
          className={`h-3.5 w-3.5 text-slate-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-lg shadow-slate-200/60">
          <Link
            href={`${ROUTES.HOME}#publications`}
            onClick={close}
            className="flex flex-col rounded-xl px-3 py-2 transition hover:bg-slate-100"
          >
            <span className="text-xs font-bold text-slate-900">
              Editorial Feed
            </span>
            <span className="text-[11px] text-slate-500">
              Browse all published stories
            </span>
          </Link>

          {isAuthReady && isAdmin ? (
            <Link
              href={ROUTES.ADMIN}
              onClick={close}
              className="mt-1 flex flex-col rounded-xl px-3 py-2 transition hover:bg-violet-50"
            >
              <span className="text-xs font-bold text-violet-700">
                Admin Studio
              </span>
              <span className="text-[11px] text-slate-500">
                Create, edit & manage posts
              </span>
            </Link>
          ) : (
            <Link
              href={isAuthReady && user ? ROUTES.HOME : ROUTES.LOGIN}
              onClick={close}
              className="mt-1 flex flex-col rounded-xl px-3 py-2 transition hover:bg-slate-100"
            >
              <span className="text-xs font-bold text-slate-900">
                {isAuthReady && user ? 'Reader Account' : 'Author Access'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isAuthReady && user
                  ? `Signed in as ${user.role}`
                  : 'Sign in to manage content'}
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
