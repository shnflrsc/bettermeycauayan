import type { Env } from '../../types';
import { jsonResponse, searchMeilisearch } from '../../utils/meilisearch-proxy';

interface SearchResult<T> {
  hits: T[];
  estimatedTotalHits?: number;
}

interface InfrastructureContext {
  request: Request;
  env: Env;
}

export async function onRequestGet({ request, env }: InfrastructureContext) {
  const url = new URL(request.url);
  const userQuery = (url.searchParams.get('q') || '').trim().slice(0, 100);
  const contractId = (url.searchParams.get('contractId') || '')
    .trim()
    .slice(0, 100);
  const key = env.MEILISEARCH_INFRASTRUCTURE_API_KEY || env.MEILISEARCH_API_KEY;

  try {
    const result = await searchMeilisearch<
      SearchResult<Record<string, unknown>>
    >(env, 'bettergov_flood_control', key, {
      q: contractId || ['Meycauayan', userQuery].filter(Boolean).join(' '),
      limit: contractId ? 20 : 500,
    });

    const hits = contractId
      ? result.hits.filter(
          hit =>
            String(hit.ContractID || '').toLowerCase() ===
            contractId.toLowerCase()
        )
      : result.hits;

    return jsonResponse({ ...result, hits });
  } catch (error) {
    console.error('Infrastructure transparency request failed', error);
    return jsonResponse(
      { error: 'Infrastructure data is temporarily unavailable.' },
      502
    );
  }
}
