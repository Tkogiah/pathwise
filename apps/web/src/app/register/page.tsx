'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-edge bg-surface-card p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-content-primary">
          Create account
        </h1>
        <p className="mt-1 text-sm text-content-muted">
          Sign up to start using Pathwise.
        </p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-md border border-status-error-border bg-status-error-bg px-3 py-2 text-sm text-status-error">
              {error}
            </p>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-content-secondary"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded border border-edge bg-surface-elevated px-3 py-2 text-base text-content-primary"
              placeholder="Your name"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-edge bg-surface-elevated px-3 py-2 text-base text-content-primary"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-content-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
