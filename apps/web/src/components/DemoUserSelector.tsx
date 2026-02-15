'use client';

import { DemoUser } from '@/lib/types';

export function DemoUserSelector({
  users,
  currentUserId,
  onSelectUser,
}: {
  users: DemoUser[];
  currentUserId: string | null;
  onSelectUser: (userId: string) => void;
}) {
  return (
    <div className="flex items-center space-x-2 rounded-lg border border-edge bg-surface-elevated p-2 shadow-sm">
      <span className="text-sm font-medium text-content-secondary">
        Demo User:
      </span>
      <div className="flex items-center space-x-1">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`
              rounded-md px-3 py-1 text-sm font-semibold
              ${
                currentUserId === user.id
                  ? 'bg-accent text-white'
                  : 'bg-surface-card text-content-secondary hover:bg-surface-primary'
              }
            `}
          >
            {user.name}
          </button>
        ))}
      </div>
    </div>
  );
}
