export interface EvidencePayload {
  source: 'slack';
  permalink: string;
  author: string;
  timestamp: string; // ISO 8601
}

export interface CreateExtractionPayload {
  program_id: string;
  client_ref: string;
  stage?: string;
  task?: string;
  status?: string;
  notes?: string;
  evidence: EvidencePayload[];
  confidence: number;
  requires_review: boolean;
}

function baseUrl(): string {
  return (process.env.PATHWISE_API_URL ?? 'http://localhost:3001').replace(
    /\/$/,
    '',
  );
}

function headers(): Record<string, string> {
  const apiKey = process.env.INTEGRATION_API_KEY;
  if (!apiKey) throw new Error('INTEGRATION_API_KEY is not set');
  return { 'Content-Type': 'application/json', 'x-api-key': apiKey };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    method,
    headers: headers(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pathwise API ${method} ${path} → ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export const pathwiseClient = {
  createExtraction: (payload: CreateExtractionPayload) =>
    request<{ id: string }>('POST', '/integrations/slack/extractions', payload),

  approve: (id: string) =>
    request<{ factId: string }>(
      'PATCH',
      `/integrations/slack/extractions/${id}/approve`,
    ),

  reject: (id: string) =>
    request<{ id: string }>(
      'PATCH',
      `/integrations/slack/extractions/${id}/reject`,
    ),
};
