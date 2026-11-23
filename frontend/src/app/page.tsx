'use client';

import { PostCard } from '@/components/PostCard';
import { postsApi } from '@/lib/api';
import { Post } from '@/types';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await postsApi.getAll();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    void loadPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm font-medium text-slate-500">
        Loading publications...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
            EDITORIAL
          </span>
          <h1 className="mt-2.5 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            Latest Publications
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Fresh articles, engineering notes, and stories from our team
          </p>
        </div>

        <div className="w-fit shrink-0 rounded-2xl bg-slate-100 px-5 py-3 text-left sm:text-right">
          <div className="text-2xl font-black text-slate-950">
            {posts.length}
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {posts.length === 1 ? 'Story' : 'Stories'}
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div
          id="publications"
          className="scroll-mt-24 rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center text-sm font-medium text-slate-500"
        >
          No posts published yet. Sign in as admin to create the first story.
        </div>
      ) : (
        <div
          id="publications"
          className="grid scroll-mt-24 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
