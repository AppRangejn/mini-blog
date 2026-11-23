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
      setServerError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-9">
      <div className="mb-6">
        <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
          WELCOME BACK
        </span>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
          Sign in
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Access your account to manage stories or view your profile
        </p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-sm font-medium text-rose-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-violet-500 focus:bg-white"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs font-medium text-rose-600">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-semibold text-slate-600"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition-colors focus:border-violet-500 focus:bg-white"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs font-medium text-rose-600">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-violet-600 py-2.5 text-sm font-bold text-white shadow-sm shadow-violet-600/20 transition-colors hover:bg-violet-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{' '}
        <Link
          href={ROUTES.REGISTER}
          className="font-bold text-violet-600 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
