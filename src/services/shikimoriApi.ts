// src/services/shikimoriApi.ts
import type { ShikimoriAnime } from '../types/anime';

const SHIKIMORI_BASE_URL = 'https://shikimori.one/api';

interface FetchAnimeParams {
  search?: string;
  status?: string;
  kind?: string;
  order?: string;
  page: number;
  limit?: number;
}

export const fetchAnimeList = async (params: FetchAnimeParams): Promise<ShikimoriAnime[]> => {
  const {
    search = '',
    status = '',
    kind = '',
    order = 'popularity',
    page,
    limit = 20,
  } = params;

  const searchParams = new URLSearchParams();
  if (search) searchParams.set('search', search.trim());
  if (status) searchParams.set('status', status);
  if (kind) searchParams.set('kind', kind);
  searchParams.set('order', order);
  searchParams.set('page', String(page));
  searchParams.set('limit', String(limit));

  const response = await fetch(`${SHIKIMORI_BASE_URL}/animes?${searchParams}`, {
    headers: {
      'User-Agent': 'MyAnimeApp/1.0 (your-email@example.com)',
    },
  });

  if (response.status === 429) {
    throw new Error('Слишком много запросов. Подождите 1–2 минуты.');
  }

  if (!response.ok) {
    const text = await response.text().catch(() => 'Unknown error');
    throw new Error(`Shikimori API error (${response.status}): ${text}`);
  }

  return response.json();
};