'use client';

import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { HeaderUserActions } from './HeaderUserActions';
import { MobileMenu } from './MobileMenu';
import { PlatformDropdown } from './PlatformDropdown';

const emptySubscribe = () => () => {};

export function Header() {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isAuthReady = isMounted && !isLoading;

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
    router.push(ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <div className="flex items-center gap-3.5">
          <Link
            href={ROUTES.HOME}
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-1.5 text-2xl font-black tracking-tighter text-slate-950"
          >
            <span>MINI</span>
            <span className="rounded-md bg-slate-950 px-1.5 py-0.5 text-lg font-black text-white">
              BLOG
            </span>
          </Link>

          <PlatformDropdown
            user={user}
            isAdmin={isAdmin}
            isAuthReady={isAuthReady}
          />
        </div>

        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          {isAuthReady && isAdmin && (
            <Link
              href={ROUTES.ADMIN}
              className={`relative py-2 transition ${
                pathname === ROUTES.ADMIN
                  ? 'text-slate-950 after:absolute after:inset-x-0 after:-bottom-0 after:h-[2.5px] after:rounded-full after:bg-slate-950'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Admin Studio
            </Link>
          )}
        </nav>

        <div className="hidden md:block">
          {isAuthReady && (
            <HeaderUserActions
              user={user}
              isAdmin={isAdmin}
              onLogout={handleLogout}
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-expanded={isMobileOpen}
          aria-label="Toggle menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-800 transition hover:bg-slate-200/70 md:hidden"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={
                isMobileOpen
                  ? 'M6 18 18 6M6 6l12 12'
                  : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
              }
            />
          </svg>
        </button>
      </div>

      {isMobileOpen && (
        <MobileMenu
          pathname={pathname}
          user={user}
          isAdmin={isAdmin}
          isAuthReady={isAuthReady}
          onClose={() => setIsMobileOpen(false)}
          onLogout={handleLogout}
        />
      )}
    </header>
  );
}
