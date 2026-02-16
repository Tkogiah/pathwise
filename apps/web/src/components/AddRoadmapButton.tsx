'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, apiPost } from '@/lib/api';

interface Template {
  id: string;
  name: string;
}

export function AddRoadmapButton({
  clientId,
  existingTemplateIds,
}: {
  clientId: string;
  existingTemplateIds: string[];
}) {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    apiFetch<Template[]>('/templates').then(setTemplates).catch(() => {});
  }, []);

  const eligible = templates.filter(
    (t) => !existingTemplateIds.includes(t.id),
  );

  if (eligible.length === 0) return null;

  if (eligible.length > 1) {
    return (
      <button
        type="button"
        disabled
        className="rounded-md border border-edge bg-surface-elevated px-3 py-1 text-xs font-medium text-content-muted"
      >
        + Add Roadmap
      </button>
    );
  }

  const handleActivate = async (template: Template) => {
    if (eligible.length > 1) {
      return;
    }
    if (!confirm(`Activate ${template.name} for this client?`)) return;
    setActivating(true);
    try {
      await apiPost(`/clients/${clientId}/roadmaps`, {
        templateId: template.id,
      });
      router.refresh();
    } catch {
      // TODO: show error toast
    } finally {
      setActivating(false);
    }
  };

  return (
    <button
      type="button"
      disabled={activating}
      onClick={() => void handleActivate(eligible[0])}
      className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 disabled:opacity-50"
      data-testid="add-roadmap-button"
    >
      {activating ? 'Activating...' : '+ Add Roadmap'}
    </button>
  );
}
