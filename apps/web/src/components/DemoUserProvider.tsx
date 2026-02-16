'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { DEMO_USERS } from '@/lib/demo-users';

const DemoUserContext = createContext<{
  currentDemoUserId: string | null;
  setCurrentDemoUserId: (id: string) => void;
} | null>(null);

const LOCAL_STORAGE_KEY = 'pathwise-demo-user-id';

export function DemoUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentDemoUserId, setCurrentDemoUserId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const savedUserId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedUserId) {
      setCurrentDemoUserId(savedUserId);
    } else {
      setCurrentDemoUserId(DEMO_USERS[0]?.id || null);
    }
  }, []);

  useEffect(() => {
    if (currentDemoUserId) {
      localStorage.setItem(LOCAL_STORAGE_KEY, currentDemoUserId);
    }
  }, [currentDemoUserId]);

  if (!currentDemoUserId) {
    return null;
  }

  return (
    <DemoUserContext.Provider
      value={{ currentDemoUserId, setCurrentDemoUserId }}
    >
      {children}
    </DemoUserContext.Provider>
  );
}

export function useDemoUser() {
  const context = useContext(DemoUserContext);
  if (!context) {
    throw new Error('useDemoUser must be used within DemoUserProvider');
  }
  return context;
}
