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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    apiFetch<Template[]>('/templates').then(setTemplates).catch(() => {});
  }, []);

  const eligible = templates.filter(
    (t) => !existingTemplateIds.includes(t.id),
  );

  useEffect(() => {
    if (!selectedTemplateId && eligible.length > 0) {
      setSelectedTemplateId(eligible[0].id);
    }
  }, [eligible, selectedTemplateId]);

  if (eligible.length === 0) return null;

  const handleActivate = async (template: Template) => {
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
      setPendingTemplateId(null);
    }
  };

  if (eligible.length === 1) {
    const template = eligible[0];
    if (pendingTemplateId === template.id) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-content-muted">
            Activate {template.name}?
          </span>
          <button
            type="button"
            disabled={activating}
            onClick={() => void handleActivate(template)}
            className="rounded bg-accent px-2 py-1 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {activating ? 'Activating...' : 'Confirm'}
          </button>
          <button
            type="button"
            disabled={activating}
            onClick={() => setPendingTemplateId(null)}
            className="rounded border border-edge px-2 py-1 text-sm font-medium text-content-secondary hover:bg-surface-card disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <button
        type="button"
        disabled={activating}
        onClick={() => setPendingTemplateId(template.id)}
        className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-medium text-accent hover:bg-accent/20 disabled:opacity-50"
        data-testid="add-roadmap-button"
      >
        {activating ? 'Activating...' : '+ Add Roadmap'}
      </button>
    );
  }

  const selectedTemplate = eligible.find((t) => t.id === selectedTemplateId);
  const pendingTemplate = eligible.find((t) => t.id === pendingTemplateId);

  return (
    <div className="flex items-center gap-2">
      {pendingTemplate ? (
        <>
          <span className="text-sm text-content-muted">
            Activate {pendingTemplate.name}?
          </span>
          <button
            type="button"
            disabled={activating}
            onClick={() => void handleActivate(pendingTemplate)}
            className="rounded bg-accent px-2 py-1 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {activating ? 'Activating...' : 'Confirm'}
          </button>
          <button
            type="button"
            disabled={activating}
            onClick={() => setPendingTemplateId(null)}
            className="rounded border border-edge px-2 py-1 text-sm font-medium text-content-secondary hover:bg-surface-card disabled:opacity-50"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <select
            value={selectedTemplateId}
            onChange={(event) => setSelectedTemplateId(event.target.value)}
            className="rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
            data-testid="add-roadmap-select"
          >
            {eligible.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={activating || !selectedTemplate}
            onClick={() =>
              selectedTemplate && setPendingTemplateId(selectedTemplate.id)
            }
            className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-sm font-medium text-accent hover:bg-accent/20 disabled:opacity-50"
            data-testid="add-roadmap-submit"
          >
            {activating ? 'Activating...' : 'Add'}
          </button>
        </>
      )}
    </div>
  );
}
