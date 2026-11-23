'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href={ROUTES.HOME} className="text-xl font-bold tracking-tight text-slate-900">
          Mini<span className="text-indigo-600">Blog</span>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            href={ROUTES.HOME}
            className={`transition hover:text-indigo-600 ${
              pathname === ROUTES.HOME ? 'text-indigo-600' : 'text-slate-600'
            }`}
          >
            Головна
          </Link>

          {!isLoading && (
            <>
              {isAdmin && (
                <Link
                  href={ROUTES.ADMIN}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    pathname === ROUTES.ADMIN
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  Адмін-панель
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                  <span className="hidden text-slate-700 sm:inline">
                    {user.name}
                    {isAdmin && (
                      <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
                        admin
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-700 transition hover:bg-slate-100"
                  >
                    Вийти
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href={ROUTES.LOGIN}
                    className="rounded-lg px-3 py-1.5 text-slate-700 transition hover:bg-slate-100"
                  >
                    Увійти
                  </Link>
                  <Link
                    href={ROUTES.REGISTER}
                    className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-white transition hover:bg-indigo-700"
                  >
                    Реєстрація
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
