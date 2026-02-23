'use client';

import { ThemeToggle } from './ThemeToggle';
import { useAuth } from './AuthProvider';

export function HeaderControls() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-content-secondary">{user.name}</span>
      <button
        type="button"
        onClick={logout}
        className="rounded-full bg-surface-card px-3 py-1 text-sm text-content-muted hover:text-content-secondary"
      >
        Log out
      </button>
      <ThemeToggle />
    </div>
  );
}
