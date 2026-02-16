import Link from 'next/link';
import { apiFetch } from '@/lib/api';

interface ClientSummary {
  id: string;
  firstName: string;
  lastName: string;
}

export default async function ClientsPage() {
  const clients = await apiFetch<ClientSummary[]>('/clients');

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-content-primary">Clients</h1>
        <Link
          href="/clients/archived"
          className="text-xs text-content-muted hover:text-content-secondary"
        >
          Archived
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="mt-6 text-sm text-content-muted">No clients found.</p>
      ) : (
        <ul className="mt-4 divide-y divide-edge overflow-hidden rounded-lg border border-edge bg-surface-elevated">
          {clients.map((client) => (
            <li key={client.id}>
              <Link
                href={`/clients/${client.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-surface-card"
              >
                <span className="text-sm font-medium text-content-primary">
                  {client.lastName}, {client.firstName}
                </span>
                <span className="text-content-muted">&rsaquo;</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
