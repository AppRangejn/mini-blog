'use client';

import { Post, PostPayload } from '@/types';
import { validateForm } from '@/utils/validateForm';
import { postSchema } from '@/validation/schemas';
import { FormEvent, useState } from 'react';

interface PostEditorFormProps {
  editingPost: Post | null;
  onSave: (payload: PostPayload, postId: number | null) => Promise<void>;
  onCancel: () => void;
}

export function PostEditorForm({
  editingPost,
  onSave,
  onCancel,
}: PostEditorFormProps) {
  const [title, setTitle] = useState(editingPost?.title || '');
  const [excerpt, setExcerpt] = useState(editingPost?.excerpt || '');
  const [content, setContent] = useState(editingPost?.content || '');
  const [imageUrl, setImageUrl] = useState(editingPost?.imageUrl || '');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitError(null);

    const { data, errors } = await validateForm(postSchema, {
      title,
      excerpt,
      content,
      imageUrl,
    });

    if (errors || !data) {
      setFieldErrors(errors || {});
      return;
    }

    const payload: PostPayload = {
      title: data.title,
      excerpt: data.excerpt || null,
      content: data.content,
      imageUrl: data.imageUrl || null,
    };

    setIsSubmitting(true);
    try {
      await onSave(payload, editingPost?.id ?? null);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to save story',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
              />
            </svg>
          </span>
          <h1 className="text-xl font-black text-slate-950">
            {editingPost ? `Edit Story #${editingPost.id}` : 'New Story'}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-violet-600 px-5 py-2 text-xs font-bold text-white shadow-sm shadow-violet-600/20 transition-colors hover:bg-violet-700 disabled:opacity-60 sm:text-sm"
          >
            {isSubmitting ? 'Saving...' : editingPost ? 'Update' : 'Publish'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>

      {submitError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {submitError}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-xs font-semibold text-slate-600"
            >
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="How to architect Next.js & Express"
              className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-violet-500 focus:bg-white"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {fieldErrors.title}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="mb-1.5 block text-xs font-semibold text-slate-600"
            >
              Cover Image URL (optional)
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-violet-500 focus:bg-white"
            />
            {fieldErrors.imageUrl && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {fieldErrors.imageUrl}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="excerpt"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Short Excerpt (optional)
          </label>
          <input
            id="excerpt"
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief summary shown on the homepage feed card"
            className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-violet-500 focus:bg-white"
          />
          {fieldErrors.excerpt && (
            <p className="mt-1 text-xs font-medium text-rose-600">
              {fieldErrors.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6">
        <label
          htmlFor="content"
          className="mb-1.5 block text-xs font-semibold text-slate-600"
        >
          Story Content *
        </label>
        <textarea
          id="content"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your full article here..."
          className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-3 text-sm leading-relaxed text-slate-900 outline-none transition-colors focus:border-violet-500 focus:bg-white"
        />
        {fieldErrors.content && (
          <p className="mt-1 text-xs font-medium text-rose-600">
            {fieldErrors.content}
          </p>
        )}
      </div>
    </form>
  );
}
