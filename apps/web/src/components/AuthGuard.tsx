'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

const PUBLIC_PATHS = ['/login', '/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const isAuthed = Boolean(token);

  useEffect(() => {
    if (loading) return;
    if (!isAuthed && !isPublic) {
      router.replace('/login');
    }
    if (isAuthed && isPublic) {
      router.replace('/clients');
    }
  }, [isAuthed, loading, isPublic, router]);

  if (loading && !isAuthed) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-base text-content-muted">Loading...</p>
      </div>
    );
  }

  if (!isAuthed && !isPublic) return null;
  if (isAuthed && isPublic) return null;

  return <>{children}</>;
}
