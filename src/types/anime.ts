// src/types/anime.ts
export interface ShikimoriAnime {
  id: number;
  name: string;
  russian: string;
  japanese?: string[];
  score: number;
  status: 'released' | 'ongoing' | 'anons';
  kind: 'tv' | 'movie' | 'ova' | 'ona' | null;
  episodes: number | null;
  aired_on: string | null;
  url: string;
  image: {
    original: string;
    preview: string;
  } | null;
}