'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-edge bg-surface-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-content-primary">Sign in</h1>
        <p className="mt-1 text-sm text-content-muted">
          Enter your credentials to continue.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-md border border-status-error-border bg-status-error-bg px-3 py-2 text-sm text-status-error">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-content-secondary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-edge bg-surface-elevated px-3 py-2 text-base text-content-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-content-secondary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-edge bg-surface-elevated px-3 py-2 text-base text-content-primary"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-content-muted">
          No account?{' '}
          <Link href="/register" className="text-accent hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
