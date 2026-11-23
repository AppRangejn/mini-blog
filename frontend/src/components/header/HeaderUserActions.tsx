'use client';

import { ROUTES } from '@/constants';
import { User } from '@/types';
import Link from 'next/link';

interface HeaderUserActionsProps {
  user: User | null;
  isAdmin: boolean;
  onLogout: () => void;
  onNavigate?: () => void;
  mobile?: boolean;
}

export function HeaderUserActions({
  user,
  isAdmin,
  onLogout,
  onNavigate,
  mobile = false,
}: HeaderUserActionsProps) {
  if (user) {
    return (
      <div
        className={
          mobile
            ? 'flex items-center justify-between gap-2'
            : 'flex items-center gap-2.5'
        }
      >
        <div className="flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-600/25 sm:text-sm">
          {!mobile && (
            <svg
              className="h-4 w-4 shrink-0 text-violet-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          )}
          <span className="max-w-[140px] truncate">{user.name}</span>
          {isAdmin && (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
              admin
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-600"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        mobile ? 'grid grid-cols-2 gap-2' : 'flex items-center gap-2.5'
      }
    >
      <Link
        href={ROUTES.LOGIN}
        onClick={onNavigate}
        className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-center text-xs font-bold text-slate-800 transition hover:bg-slate-200/70 sm:text-sm"
      >
        Sign in
      </Link>
      <Link
        href={ROUTES.REGISTER}
        onClick={onNavigate}
        className="rounded-full bg-violet-600 px-5 py-2 text-center text-xs font-bold text-white shadow-sm shadow-violet-600/25 transition hover:bg-violet-700 sm:text-sm"
      >
        Sign up
      </Link>
    </div>
  );
}
