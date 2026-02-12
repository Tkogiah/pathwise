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
    <div className="flex items-center space-x-2 rounded-lg border border-gray-200 bg-white p-2 shadow-sm">
      <span className="text-sm font-medium text-gray-600">Demo User:</span>
      <div className="flex items-center space-x-1">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`
              rounded-md px-3 py-1 text-sm font-semibold
              ${
                currentUserId === user.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
