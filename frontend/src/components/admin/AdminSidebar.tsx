'use client';

import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export type AdminTab = 'posts' | 'editor';

interface AdminSidebarProps {
  activeTab: AdminTab;
  postsCount: number;
  isEditing: boolean;
  onSelectTab: (tab: AdminTab) => void;
  onStartCreate: () => void;
}

export function AdminSidebar({
  activeTab,
  postsCount,
  isEditing,
  onSelectTab,
  onStartCreate,
}: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  return (
    <aside className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 lg:min-h-[540px]">
      <div>
        <div className="border-b border-slate-100 pb-5 text-center">
          <p className="text-lg font-black text-slate-950">Welcome,</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-slate-600">
            {user?.name || 'Admin'}
          </p>
          <div className="mx-auto mt-3 h-0.5 w-16 rounded-full bg-violet-600" />
        </div>

        <nav className="mt-6 space-y-1.5">
          <button
            type="button"
            onClick={() => onSelectTab('posts')}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
              activeTab === 'posts'
                ? 'bg-violet-50 text-violet-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            <span className="flex items-center gap-3">
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <span>All Stories</span>
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
              {postsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={onStartCreate}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
              activeTab === 'editor'
                ? 'bg-violet-50 text-violet-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            <svg
              className="h-4 w-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
              />
            </svg>
            <span>{isEditing ? 'Edit Story' : 'Create Story'}</span>
          </button>
        </nav>
      </div>

      <div className="mt-8 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <svg
            className="h-4 w-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
            />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
