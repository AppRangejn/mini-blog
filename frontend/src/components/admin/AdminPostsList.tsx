'use client';

import { ROUTES } from '@/constants';
import { Post } from '@/types';
import Link from 'next/link';
import { useState } from 'react';

interface AdminPostsListProps {
  posts: Post[];
  isLoading: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => Promise<void>;
  onCreateNew: () => void;
}

export function AdminPostsList({
  posts,
  isLoading,
  onEdit,
  onDelete,
  onCreateNew,
}: AdminPostsListProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleConfirmDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-700">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
              />
            </svg>
          </span>
          <h1 className="text-xl font-black text-slate-950">
            Published Stories ({posts.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="rounded-full bg-violet-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-violet-600/20 transition-colors hover:bg-violet-700 sm:text-sm"
        >
          + New Story
        </button>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6">
        {isLoading ? (
          <p className="py-10 text-center text-sm font-medium text-slate-500">
            Loading stories...
          </p>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-slate-500">
              No stories published yet.
            </p>
            <button
              type="button"
              onClick={onCreateNew}
              className="mt-4 rounded-full bg-slate-950 px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-violet-600"
            >
              Create first story
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {posts.map((post) => {
              const isConfirming = confirmDeleteId === post.id;
              const isDeleting = deletingId === post.id;

              return (
                <div
                  key={post.id}
                  className="flex flex-col justify-between gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={ROUTES.postDetails(post.id)}
                      className="block truncate text-base font-bold text-slate-950 transition-colors hover:text-violet-600"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      By {post.author?.name || 'Editorial'} •{' '}
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {isConfirming ? (
                      <>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => void handleConfirmDelete(post.id)}
                          className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-60"
                        >
                          {isDeleting ? 'Deleting...' : 'Confirm'}
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(post)}
                          className="rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-200/80"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(post.id)}
                          className="rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
