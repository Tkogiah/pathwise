import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { RoadmapVM } from '@/lib/types';
import { RoadmapView } from '@/components/RoadmapView';

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
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; All clients
      </Link>

      <h1 className="mt-3 text-xl font-semibold text-gray-900">
        {client.firstName} {client.lastName}
      </h1>

      {!roadmap ? (
        <p className="mt-6 text-sm text-gray-500">
          No active roadmaps for this client.
        </p>
      ) : (
        <section className="mt-6">
          <RoadmapView roadmap={roadmap} />
        </section>
      )}
    </div>
  );
}
