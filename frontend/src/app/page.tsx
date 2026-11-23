'use client';

import { PostCard } from '@/components/PostCard';
import { PAGINATION_CONFIG, POST_SORT, POST_SORT_OPTIONS } from '@/constants';
import { postsApi } from '@/lib/api';
import { PaginationMeta, Post, PostSortOption } from '@/types';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<PostSortOption>(POST_SORT.NEWEST);
  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: PAGINATION_CONFIG.FEED_LIMIT,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await postsApi.getPaginated(
          page,
          PAGINATION_CONFIG.FEED_LIMIT,
          sort,
          activeSearch,
        );
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    void loadPosts();
  }, [page, sort, activeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
    setPage(1);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
            EDITORIAL
          </span>
          <h1 className="mt-2.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Latest Publications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Fresh articles, personal notes, and everyday stories
          </p>
        </div>

        <div className="w-fit shrink-0 rounded-2xl bg-slate-100 px-5 py-3 text-left sm:text-right">
          <div className="text-2xl font-black text-slate-950">
            {pagination.total}
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {pagination.total === 1 ? 'Story' : 'Stories'}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl border border-slate-200/90 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search stories..."
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none sm:text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-violet-600 px-5 py-2 text-xs font-bold text-white transition hover:bg-violet-700"
          >
            Search
          </button>
          {activeSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/70"
            >
              Reset
            </button>
          )}
        </form>

        <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 p-1">
          {POST_SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setSort(option.value);
                setPage(1);
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                sort === option.value
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm font-medium text-slate-500">
          Loading publications...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center text-sm font-medium text-slate-500">
          No stories found.
        </div>
      ) : (
        <>
          <div
            id="publications"
            className="grid scroll-mt-24 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <nav className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white px-6 py-4">
              <p className="text-xs font-medium text-slate-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                  className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 disabled:opacity-40"
                >
                  ← Previous
                </button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPage(num)}
                    className={`h-9 w-9 rounded-full text-xs font-bold ${
                      num === page
                        ? 'bg-violet-600 text-white'
                        : 'border border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= pagination.totalPages}
                  className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-800 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </nav>
          )}
        </>
      )}
    </section>
  );
}
