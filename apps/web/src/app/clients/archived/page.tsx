import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { UnarchiveButton } from '@/components/UnarchiveButton';

interface ClientSummary {
  id: string;
  firstName: string;
  lastName: string;
}

export default async function ArchivedClientsPage() {
  const clients = await apiFetch<ClientSummary[]>('/clients/archived');

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/clients"
            className="text-base text-content-muted hover:text-content-secondary"
          >
            &larr; Active clients
          </Link>
          <h1 className="text-xl font-semibold text-content-primary">
            Archived Clients
          </h1>
        </div>
      </div>

      {clients.length === 0 ? (
        <p className="mt-6 text-base text-content-muted">
          No archived clients.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-edge overflow-hidden rounded-lg border border-edge bg-surface-elevated">
          {clients.map((client) => (
            <li
              key={client.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-base font-medium text-content-primary">
                {client.lastName}, {client.firstName}
              </span>
              <UnarchiveButton clientId={client.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
