'use client';

import { ROUTES } from '@/constants';
import { postsApi } from '@/lib/api';
import { Post } from '@/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function PostDetailsContent() {
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    const loadPost = async () => {
      try {
        const data = await postsApi.getById(params.id);
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Пост не знайдено');
      } finally {
        setIsLoading(false);
      }
    };

    void loadPost();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Завантаження поста...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || 'Пост не знайдено'}
        </div>
        <Link
          href={ROUTES.HOME}
          className="inline-block text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Повернутися до списку постів
        </Link>
      </div>
    );
  }

  const createdDate = new Date(post.createdAt).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isUpdated = post.updatedAt !== post.createdAt;
  const updatedDate = new Date(post.updatedAt).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={ROUTES.HOME}
        className="mb-6 inline-flex items-center text-sm font-medium text-slate-600 transition hover:text-indigo-600"
      >
        ← Назад до всіх постів
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="max-h-96 w-full object-cover"
          />
        )}

        <div className="p-6 sm:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              Автор: {post.author?.name || 'Невідомий'}
            </span>
            <span>Опубліковано: {createdDate}</span>
            {isUpdated && <span>• Оновлено: {updatedDate}</span>}
          </div>

          <h1 className="mb-4 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mb-6 border-l-4 border-indigo-500 pl-4 text-base italic text-slate-600">
              {post.excerpt}
            </p>
          )}

          <div className="whitespace-pre-line text-base leading-relaxed text-slate-800">
            {post.content}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function PostDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-slate-500">
          Завантаження поста...
        </div>
      }
    >
      <PostDetailsContent />
    </Suspense>
  );
}
