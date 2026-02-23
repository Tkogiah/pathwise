'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';

const PUBLIC_PATHS = ['/login', '/register'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) {
      router.replace('/login');
    }
    if (user && isPublic) {
      router.replace('/clients');
    }
  }, [user, loading, isPublic, router]);

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-base text-content-muted">Loading...</p>
      </div>
    );
  }

  if (!user && !isPublic) return null;
  if (user && isPublic) return null;

  return <>{children}</>;
}
