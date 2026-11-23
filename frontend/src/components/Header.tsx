'use client';

import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function Header() {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-3.5">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-1.5 text-2xl font-black tracking-tighter text-slate-950"
          >
            <span>MINI</span>
            <span className="rounded-md bg-slate-950 px-1.5 py-0.5 text-lg font-black text-white">
              BLOG
            </span>
          </Link>

          <div className="relative hidden sm:block" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100/90 px-4 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200/70"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Platform</span>
              <svg
                className={`h-3.5 w-3.5 text-slate-500 transition-transform ${
                  isMenuOpen ? 'rotate-180' : ''
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

            {isMenuOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-lg shadow-slate-200/60">
                <Link
                  href={`${ROUTES.HOME}#publications`}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col rounded-xl px-3 py-2 transition hover:bg-slate-100"
                >
                  <span className="text-xs font-bold text-slate-900">
                    Editorial Feed
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Browse all published stories
                  </span>
                </Link>

                {isAdmin ? (
                  <Link
                    href={ROUTES.ADMIN}
                    onClick={() => setIsMenuOpen(false)}
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
                    href={user ? ROUTES.HOME : ROUTES.LOGIN}
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-1 flex flex-col rounded-xl px-3 py-2 transition hover:bg-slate-100"
                  >
                    <span className="text-xs font-bold text-slate-900">
                      {user ? 'Reader Account' : 'Author Access'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {user
                        ? `Signed in as ${user.role}`
                        : 'Sign in to manage content'}
                    </span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {!isLoading && isAdmin && (
            <Link
              href={ROUTES.ADMIN}
              className={`relative py-2 transition ${
                pathname === ROUTES.ADMIN
                  ? 'text-slate-950 after:absolute after:inset-x-0 after:bottom-0 after:h-[2.5px] after:rounded-full after:bg-slate-950'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Admin Studio
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          {!isLoading && (
            <>
              {isAdmin && (
                <Link
                  href={ROUTES.ADMIN}
                  className="rounded-full border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-800 md:hidden"
                >
                  Admin
                </Link>
              )}

              {user ? (
                <>
                  <div className="flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-600/25 sm:text-sm">
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
                    <span className="max-w-[130px] truncate">{user.name}</span>
                    {isAdmin && (
                      <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">
                        admin
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={ROUTES.LOGIN}
                    className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-200/70 sm:text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    href={ROUTES.REGISTER}
                    className="rounded-full bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-600/25 transition hover:bg-violet-700 sm:text-sm"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
