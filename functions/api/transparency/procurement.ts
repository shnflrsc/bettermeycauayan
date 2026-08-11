import type { Env } from '../../types';
import { jsonResponse, searchMeilisearch } from '../../utils/meilisearch-proxy';

const ORGANIZATION = 'CITY OF MEYCAUAYAN, BULACAN';

interface SearchResult<T> {
  hits: T[];
  estimatedTotalHits?: number;
}

interface ProcurementContext {
  request: Request;
  env: Env;
}

export async function onRequestGet({ request, env }: ProcurementContext) {
  const url = new URL(request.url);
  const query = (url.searchParams.get('q') || '').trim().slice(0, 100);
  const limit = Math.min(
    Math.max(Number(url.searchParams.get('limit')) || 10, 1),
    100
  );
  const offset = Math.max(Number(url.searchParams.get('offset')) || 0, 0);
  const filter = `organization_name = "${ORGANIZATION}"`;
  const key = env.MEILISEARCH_PROCUREMENT_API_KEY || env.MEILISEARCH_API_KEY;

  try {
    const [documents, organizations, chart] = await Promise.all([
      searchMeilisearch<SearchResult<Record<string, unknown>>>(
        env,
        'philgeps',
        key,
        {
          q: query,
          filter,
          sort: ['award_date:desc'],
          limit,
          offset,
        }
      ),
      searchMeilisearch<SearchResult<Record<string, unknown>>>(
        env,
        'philgeps_organizations',
        key,
        { q: ORGANIZATION, limit: 5 }
      ),
      searchMeilisearch<SearchResult<Record<string, unknown>>>(
        env,
        'philgeps',
        key,
        {
          q: query,
          filter,
          attributesToRetrieve: ['contract_amount', 'business_category'],
          limit: 5000,
        }
      ),
    ]);

    const statistics = organizations.hits.find(
      hit => hit.organization_name === ORGANIZATION
    );

    return jsonResponse({
      hits: documents.hits,
      estimatedTotalHits: documents.estimatedTotalHits || 0,
      statistics: statistics || null,
      chartHits: chart.hits,
    });
  } catch (error) {
    console.error('Procurement transparency request failed', error);
    return jsonResponse(
      { error: 'Procurement data is temporarily unavailable.' },
      502
    );
  }
}
