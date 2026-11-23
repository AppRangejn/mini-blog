'use client';

import { ROUTES } from '@/constants';
import { postsApi } from '@/lib/api';
import { Post } from '@/types';
import Image from 'next/image';
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
        setError(err instanceof Error ? err.message : 'Story not found');
      } finally {
        setIsLoading(false);
      }
    };

    void loadPost();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm font-medium text-slate-500">
        Loading story...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
          {error || 'Story not found'}
        </div>
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 transition-colors hover:bg-slate-100"
        >
          <span aria-hidden="true">←</span>
          <span>Back to all stories</span>
        </Link>
      </div>
    );
  }

  const createdDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isUpdated = post.updatedAt !== post.createdAt;
  const updatedDate = new Date(post.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={ROUTES.HOME}
        className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
      >
        <span aria-hidden="true">←</span>
        <span>Back to all stories</span>
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-3.5 sm:p-5">
        {post.imageUrl && (
          <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-96">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        <div className="px-2 pb-3 pt-6 sm:px-4">
          <div className="mb-4 flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 font-bold text-violet-700">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              {post.author?.name || 'Editorial'}
            </span>
            <span>Published: {createdDate}</span>
            {isUpdated && <span>• Updated: {updatedDate}</span>}
          </div>

          <h1 className="mb-5 text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mb-6 rounded-2xl border-l-4 border-violet-600 bg-slate-50 px-4 py-3 text-base font-medium text-slate-700">
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
        <div className="py-20 text-center text-sm font-medium text-slate-500">
          Loading story...
        </div>
      }
    >
      <PostDetailsContent />
    </Suspense>
  );
}
