import { ROUTES } from '@/constants';
import { Post } from '@/types';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const previewText =
    post.excerpt?.trim() ||
    (post.content.length > 140
      ? `${post.content.slice(0, 140)}...`
      : post.content);

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 text-sm font-medium text-slate-400">
          Без зображення
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
          <span>{post.author?.name || 'Автор'}</span>
          <span>•</span>
          <time dateTime={post.createdAt}>{formattedDate}</time>
        </div>

        <h2 className="mb-2 line-clamp-2 text-lg font-bold text-slate-900">
          <Link
            href={ROUTES.postDetails(post.id)}
            className="hover:text-indigo-600"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
          {previewText}
        </p>

        <Link
          href={ROUTES.postDetails(post.id)}
          className="inline-flex items-center text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
        >
          Читати далі →
        </Link>
      </div>
    </article>
  );
}
