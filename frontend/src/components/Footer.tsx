import { ROUTES } from '@/constants';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs font-medium text-slate-500 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2">
          <span className="font-black tracking-tighter text-slate-950">
            MINI BLOG
          </span>
          <span>•</span>
          <span>© 2026 Editorial Platform</span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            href={ROUTES.HOME}
            className="transition-colors hover:text-slate-950"
          >
            Stories
          </Link>
          <Link
            href={ROUTES.ADMIN}
            className="transition-colors hover:text-slate-950"
          >
            Admin Studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
