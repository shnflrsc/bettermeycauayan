import type { Env } from '../types';

const DEFAULT_HOST = 'https://search2.bettergov.ph';

export async function searchMeilisearch<T>(
  env: Env,
  index: string,
  apiKey: string | undefined,
  body: Record<string, unknown>
): Promise<T> {
  if (!apiKey) {
    throw new Error(`Missing search credential for the ${index} index.`);
  }

  const host = (env.MEILISEARCH_HOST || DEFAULT_HOST).replace(/\/$/, '');
  const response = await fetch(
    `${host}/indexes/${encodeURIComponent(index)}/search`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const upstreamMessage = await response.text();
    console.error(
      `Meilisearch ${index} error (${response.status})`,
      upstreamMessage
    );
    throw new Error(
      `The ${index} data source returned HTTP ${response.status}.`
    );
  }

  return response.json() as Promise<T>;
}

export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Cache-Control': status === 200 ? 'public, max-age=120' : 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
