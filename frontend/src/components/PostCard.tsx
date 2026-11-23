import { ROUTES, UI_LIMITS } from '@/constants';
import { Post } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const previewText =
    post.excerpt?.trim() ||
    (post.content.length > UI_LIMITS.POST_PREVIEW_LENGTH
      ? `${post.content.slice(0, UI_LIMITS.POST_PREVIEW_LENGTH)}...`
      : post.content);

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-3.5 transition-colors hover:border-slate-300">
      <Link
        href={ROUTES.postDetails(post.id)}
        className="relative block h-52 w-full overflow-hidden rounded-2xl bg-slate-100"
      >
        {post.imageUrl ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
            MINI BLOG
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-slate-800 shadow-sm">
          {formattedDate}
        </span>
      </Link>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-violet-600">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
          <span>{post.author?.name || 'Editorial'}</span>
        </div>

        <h2 className="mb-2 line-clamp-2 text-lg font-extrabold leading-snug text-slate-950">
          <Link
            href={ROUTES.postDetails(post.id)}
            className="transition-colors hover:text-violet-600"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
          {previewText}
        </p>

        <Link
          href={ROUTES.postDetails(post.id)}
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-violet-600 hover:text-white"
        >
          <span>Read article</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
