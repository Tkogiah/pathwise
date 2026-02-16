'use client';

import { DemoUserSelector } from './DemoUserSelector';
import { ThemeToggle } from './ThemeToggle';
import { DEMO_USERS } from '@/lib/demo-users';
import { useDemoUser } from './DemoUserProvider';

export function HeaderControls() {
  const { currentDemoUserId, setCurrentDemoUserId } = useDemoUser();

  return (
    <div className="flex items-center gap-2">
      <DemoUserSelector
        users={DEMO_USERS}
        currentUserId={currentDemoUserId}
        onSelectUser={setCurrentDemoUserId}
      />
      <ThemeToggle />
    </div>
  );
}
