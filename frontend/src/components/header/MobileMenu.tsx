'use client';

import { ROUTES } from '@/constants';
import { User } from '@/types';
import Link from 'next/link';
import { HeaderUserActions } from './HeaderUserActions';

interface MobileMenuProps {
  pathname: string;
  user: User | null;
  isAdmin: boolean;
  isAuthReady: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function MobileMenu({
  pathname,
  user,
  isAdmin,
  isAuthReady,
  onClose,
  onLogout,
}: MobileMenuProps) {
  return (
    <div className="border-t border-slate-200/80 bg-white px-4 py-4 shadow-lg md:hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-2">
        <Link
          href={ROUTES.HOME}
          onClick={onClose}
          className={`rounded-2xl px-4 py-2.5 text-sm font-bold ${
            pathname === ROUTES.HOME
              ? 'bg-slate-100 text-slate-950'
              : 'text-slate-600'
          }`}
        >
          Editorial Feed
        </Link>

        {isAuthReady && isAdmin && (
          <Link
            href={ROUTES.ADMIN}
            onClick={onClose}
            className={`rounded-2xl px-4 py-2.5 text-sm font-bold ${
              pathname === ROUTES.ADMIN
                ? 'bg-violet-50 text-violet-700'
                : 'text-slate-600'
            }`}
          >
            Admin Studio
          </Link>
        )}

        {isAuthReady && (
          <div className="mt-2 border-t border-slate-100 pt-3">
            <HeaderUserActions
              user={user}
              isAdmin={isAdmin}
              onLogout={onLogout}
              onNavigate={onClose}
              mobile
            />
          </div>
        )}
      </div>
    </div>
  );
}
