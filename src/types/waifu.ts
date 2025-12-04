export interface WaifuTag {
  name: string;
}

export interface WaifuImage {
  id: string;
  url: string;
  tags: WaifuTag[];
  source: string;
}