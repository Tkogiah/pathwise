import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { RoadmapVM } from '@/lib/types';
import { ClientRoadmapShell } from '@/components/ClientRoadmapShell';
import { EmptyState } from '@/components/EmptyState';

interface RoadmapSummary {
  roadmapId: string;
  templateName: string;
  startDate: string;
  isActive: boolean;
}

interface ClientDetail {
  id: string;
  firstName: string;
  lastName: string;
  roadmaps: RoadmapSummary[];
}

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const { id } = await Promise.resolve(params);
  const client = await apiFetch<ClientDetail>(`/clients/${id}`);

  // Fetch the first roadmap's full data for the roadmap bar
  const firstRoadmap = client.roadmaps[0];
  const roadmap = firstRoadmap
    ? await apiFetch<RoadmapVM>(`/roadmaps/${firstRoadmap.roadmapId}`)
    : null;

  return (
    <div>
      <Link
        href="/clients"
        className="text-sm text-content-muted hover:text-content-secondary"
      >
        &larr; All clients
      </Link>

      <h1 className="mt-3 text-xl font-semibold text-content-primary">
        {client.firstName} {client.lastName}
      </h1>

      {!roadmap ? (
        <section className="mt-6">
          <EmptyState message="This client has no roadmaps assigned to them." />
        </section>
      ) : (
        <section className="mt-6">
          <ClientRoadmapShell
            roadmaps={client.roadmaps}
            initialRoadmap={roadmap}
          />
        </section>
      )}
    </div>
  );
}
