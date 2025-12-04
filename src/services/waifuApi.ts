import type { WaifuImage } from '../types/waifu';

const WAIFU_API_URL = 'https://api.waifu.im/search';

interface FetchWaifuParams {
  included_tags?: string[];
  orientation?: 'PORTRAIT' | 'LANDSCAPE' | '';
  is_nsfw?: boolean;
}

export const fetchWaifuImages = async ({
  included_tags = [],
  orientation = '',
  is_nsfw = false,
}: FetchWaifuParams): Promise<WaifuImage[]> => {
  const params = new URLSearchParams();

  included_tags
    .filter(tag => tag.trim() !== '')
    .forEach(tag => {
      params.append('included_tags', tag.trim());
    });

  if (orientation) {
    params.set('orientation', orientation);
  }

  params.set('is_nsfw', String(is_nsfw));

  const response = await fetch(`${WAIFU_API_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`Waifu.im API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.images || [];
};