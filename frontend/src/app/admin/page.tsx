'use client';

import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { postsApi } from '@/lib/api';
import { Post } from '@/types';
import { validateForm } from '@/utils/validateForm';
import { postSchema } from '@/validation/schemas';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export default function AdminPage() {
  const { user, isAdmin, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && (!user || !isAdmin)) {
      router.replace(ROUTES.LOGIN);
    }
  }, [user, isAdmin, isAuthLoading, router]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchPosts = async () => {
      try {
        const data = await postsApi.getAll();
        setPosts(data);
      } catch (err) {
        setServerError(
          err instanceof Error ? err.message : 'Не вдалося завантажити пости',
        );
      } finally {
        setIsPostsLoading(false);
      }
    };

    void fetchPosts();
  }, [isAdmin]);

  const resetForm = () => {
    setEditingPostId(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setImageUrl('');
    setFieldErrors({});
  };

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setExcerpt(post.excerpt || '');
    setContent(post.content);
    setImageUrl(post.imageUrl || '');
    setFieldErrors({});
    setServerError(null);
    setSuccessMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);
    setSuccessMessage(null);

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

    const payload = {
      title: data.title,
      excerpt: data.excerpt || null,
      content: data.content,
      imageUrl: data.imageUrl || null,
    };

    setIsSubmitting(true);
    try {
      if (editingPostId !== null) {
        const updated = await postsApi.update(editingPostId, payload);
        setPosts((prev) =>
          prev.map((p) => (p.id === editingPostId ? updated : p)),
        );
        setSuccessMessage('Пост успішно оновлено');
      } else {
        const created = await postsApi.create(payload);
        setPosts((prev) => [created, ...prev]);
        setSuccessMessage('Новий пост опубліковано');
      }
      resetForm();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Помилка збереження поста',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Видалити цей пост?')) return;

    setServerError(null);
    setSuccessMessage(null);

    try {
      await postsApi.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (editingPostId === id) {
        resetForm();
      }
      setSuccessMessage('Пост видалено');
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Не вдалося видалити пост',
      );
    }
  };

  if (isAuthLoading || !isAdmin) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Перевірка прав доступу...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {editingPostId !== null
                ? `Редагування поста #${editingPostId}`
                : 'Створити пост'}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Панель керування публікаціями блогу
            </p>
          </div>

          {editingPostId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Скасувати редагування
            </button>
          )}
        </div>

        {serverError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Заголовок *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Наприклад: Як налаштувати Next.js та Express"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Короткий опис (необов&apos;язково)
            </label>
            <input
              id="excerpt"
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Короткий анонс статті для картки на головній"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {fieldErrors.excerpt && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.excerpt}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              URL зображення (необов&apos;язково)
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {fieldErrors.imageUrl && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.imageUrl}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="content"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Текст поста *
            </label>
            <textarea
              id="content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Повний зміст публікації..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {fieldErrors.content && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.content}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting
              ? 'Збереження...'
              : editingPostId !== null
                ? 'Зберегти зміни'
                : 'Опублікувати пост'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          Усі пости ({posts.length})
        </h2>

        {isPostsLoading ? (
          <p className="text-sm text-slate-500">Завантаження списку...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-slate-500">Постів ще немає.</p>
        ) : (
          <div className="divide-y divide-slate-200">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={ROUTES.postDetails(post.id)}
                    className="font-semibold text-slate-900 hover:text-indigo-600"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Автор: {post.author?.name || 'Невідомий'} •{' '}
                    {new Date(post.createdAt).toLocaleDateString('uk-UA')}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEditClick(post)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Редагувати
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
