'use client';

import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { validateForm } from '@/utils/validateForm';
import { loginSchema } from '@/validation/schemas';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError(null);

    const { data, errors } = await validateForm(loginSchema, {
      email,
      password,
    });
    if (errors || !data) {
      setFieldErrors(errors || {});
      return;
    }

    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      router.push(ROUTES.HOME);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Помилка входу');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Вхід в акаунт</h1>
      <p className="mb-6 text-sm text-slate-600">
        Увійдіть, щоб керувати публікаціями або переглядати профіль
      </p>

      {serverError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Вхід...' : 'Увійти'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Ще немає акаунту?{' '}
        <Link
          href={ROUTES.REGISTER}
          className="font-semibold text-indigo-600 hover:underline"
        >
          Зареєструватися
        </Link>
      </p>
    </div>
  );
}
