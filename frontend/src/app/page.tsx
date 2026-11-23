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
        setError(
          err instanceof Error ? err.message : 'Не вдалося завантажити пости',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Завантаження публікацій...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Останні публікації
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Свіжі статті та нотатки нашого міні-блогу
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
          Поки що немає жодного поста.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
