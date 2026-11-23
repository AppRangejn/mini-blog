'use client';

import { PAGINATION_CONFIG, POST_SORT, ROUTES } from '@/constants';
import { Post, PostSortOption } from '@/types';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface AdminPostsListProps {
  posts: Post[];
  isLoading: boolean;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => Promise<void>;
  onCreateNew: () => void;
}

const COVER_FILTER = {
  ALL: 'all',
  WITH_COVER: 'with-cover',
  TEXT_ONLY: 'text-only',
} as const;

type CoverFilter = (typeof COVER_FILTER)[keyof typeof COVER_FILTER];

export function AdminPostsList({
  posts,
  isLoading,
  onEdit,
  onDelete,
  onCreateNew,
}: AdminPostsListProps) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [coverFilter, setCoverFilter] = useState<CoverFilter>(COVER_FILTER.ALL);
  const [sortOrder, setSortOrder] = useState<PostSortOption>(POST_SORT.NEWEST);
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return posts
      .filter((post) => {
        if (coverFilter === COVER_FILTER.WITH_COVER && !post.imageUrl) {
          return false;
        }
        if (coverFilter === COVER_FILTER.TEXT_ONLY && post.imageUrl) {
          return false;
        }

        if (!query) return true;
        return (
          post.title.toLowerCase().includes(query) ||
          (post.excerpt?.toLowerCase().includes(query) ?? false) ||
          post.content.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortOrder === POST_SORT.TITLE) {
          return a.title.localeCompare(b.title);
        }
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortOrder === POST_SORT.NEWEST ? timeB - timeA : timeA - timeB;
      });
  }, [posts, searchQuery, coverFilter, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / PAGINATION_CONFIG.ADMIN_LIMIT),
  );
  const safePage = Math.min(page, totalPages);

  const paginatedPosts = useMemo(() => {
    const start = (safePage - 1) * PAGINATION_CONFIG.ADMIN_LIMIT;
    return filteredPosts.slice(start, start + PAGINATION_CONFIG.ADMIN_LIMIT);
  }, [filteredPosts, safePage]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    coverFilter !== COVER_FILTER.ALL ||
    sortOrder !== POST_SORT.NEWEST;

  const handleResetFilters = () => {
    setSearchQuery('');
    setCoverFilter(COVER_FILTER.ALL);
    setSortOrder(POST_SORT.NEWEST);
    setPage(1);
  };

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
            Published Stories ({filteredPosts.length}
            {filteredPosts.length !== posts.length ? ` of ${posts.length}` : ''}
            )
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

      {!isLoading && posts.length > 0 && (
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/90 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by title, excerpt, or content..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-10 pr-9 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none sm:text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Filter by cover"
              value={coverFilter}
              onChange={(e) => {
                setCoverFilter(e.target.value as CoverFilter);
                setPage(1);
              }}
              className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-violet-500 focus:bg-white focus:outline-none"
            >
              <option value={COVER_FILTER.ALL}>All formats</option>
              <option value={COVER_FILTER.WITH_COVER}>With cover</option>
              <option value={COVER_FILTER.TEXT_ONLY}>Text only</option>
            </select>

            <select
              aria-label="Sort stories"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as PostSortOption);
                setPage(1);
              }}
              className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-violet-500 focus:bg-white focus:outline-none"
            >
              <option value={POST_SORT.NEWEST}>Newest first</option>
              <option value={POST_SORT.OLDEST}>Oldest first</option>
              <option value={POST_SORT.TITLE}>Title A–Z</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

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
        ) : filteredPosts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-slate-500">
              No stories match your current search or filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 rounded-full border border-slate-200 bg-slate-100 px-5 py-2 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-200/70"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginatedPosts.map((post) => {
              const isConfirming = confirmDeleteId === post.id;
              const isDeleting = deletingId === post.id;

              return (
                <div
                  key={post.id}
                  className="flex flex-col justify-between gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={ROUTES.postDetails(post.id)}
                        className="truncate text-base font-bold text-slate-950 transition-colors hover:text-violet-600"
                      >
                        {post.title}
                      </Link>
                      {!post.imageUrl && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          Text
                        </span>
                      )}
                    </div>
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

      {!isLoading && totalPages > 1 && (
        <nav
          aria-label="Admin stories pagination"
          className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white px-6 py-4"
        >
          <p className="text-xs font-medium text-slate-500">
            Page <span className="font-bold text-slate-900">{safePage}</span> of{' '}
            <span className="font-bold text-slate-900">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={pageNumber === safePage ? 'page' : undefined}
                  className={`h-9 w-9 rounded-full text-xs font-bold transition ${
                    pageNumber === safePage
                      ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/25'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
