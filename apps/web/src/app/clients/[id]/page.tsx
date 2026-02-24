import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { RoadmapVM } from '@/lib/types';
import { ClientRoadmapShell } from '@/components/ClientRoadmapShell';
import { EmptyState } from '@/components/EmptyState';
import { ArchiveButton } from '@/components/ArchiveButton';
import { AddRoadmapButton } from '@/components/AddRoadmapButton';

interface RoadmapSummary {
  roadmapId: string;
  templateId: string;
  templateName: string;
  startDate: string;
  isActive: boolean;
}

interface ClientDetail {
  id: string;
  firstName: string;
  lastName: string;
  isArchived: boolean;
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
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/clients"
          className="text-base text-content-muted hover:text-content-secondary"
        >
          &larr;
        </Link>
        <h1 className="text-xl font-semibold text-content-primary">
          {client.firstName} {client.lastName}
        </h1>
        {client.isArchived && (
          <span className="rounded-full border border-status-inactive-border bg-status-inactive-bg px-2 py-0.5 text-[11px] font-medium text-status-inactive">
            Archived
          </span>
        )}
        <ArchiveButton clientId={client.id} isArchived={client.isArchived} />
        {!client.isArchived && (
          <AddRoadmapButton
            clientId={client.id}
            existingTemplateIds={client.roadmaps.map((r) => r.templateId)}
          />
        )}
      </div>

      {!roadmap ? (
        <section className="mt-6">
          <EmptyState message="No roadmaps yet. Add one to get started." />
        </section>
      ) : (
        <section className="mt-4">
          <ClientRoadmapShell
            clientId={client.id}
            roadmaps={client.roadmaps}
            initialRoadmap={roadmap}
            isArchived={client.isArchived}
          />
        </section>
      )}
    </div>
  );
}
