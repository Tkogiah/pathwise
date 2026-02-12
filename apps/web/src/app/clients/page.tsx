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
      <h1 className="text-xl font-semibold text-gray-900">Clients</h1>

      {clients.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">No clients found.</p>
      ) : (
        <ul className="mt-4 divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
          {clients.map((client) => (
            <li key={client.id}>
              <Link
                href={`/clients/${client.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-900">
                  {client.lastName}, {client.firstName}
                </span>
                <span className="text-gray-400">&rsaquo;</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
