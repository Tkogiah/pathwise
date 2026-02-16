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

  useEffect(() => {
    apiFetch<Template[]>('/templates').then(setTemplates).catch(() => {});
  }, []);

  const eligible = templates.filter(
    (t) => !existingTemplateIds.includes(t.id),
  );

  if (eligible.length === 0) return null;

  useEffect(() => {
    if (!selectedTemplateId && eligible.length > 0) {
      setSelectedTemplateId(eligible[0].id);
    }
  }, [eligible, selectedTemplateId]);

  const handleActivate = async (template: Template) => {
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

  if (eligible.length === 1) {
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

  const selectedTemplate = eligible.find((t) => t.id === selectedTemplateId);

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedTemplateId}
        onChange={(event) => setSelectedTemplateId(event.target.value)}
        className="rounded border border-edge bg-surface-elevated px-2 py-1 text-xs text-content-primary"
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
        onClick={() => selectedTemplate && handleActivate(selectedTemplate)}
        className="rounded-md border border-accent bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 disabled:opacity-50"
        data-testid="add-roadmap-submit"
      >
        {activating ? 'Activating...' : 'Add'}
      </button>
    </div>
  );
}
