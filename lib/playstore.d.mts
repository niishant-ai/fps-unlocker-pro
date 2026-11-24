export interface PlayStoreStats {
  rating: number;
  ratingText: string;
  reviewCount: number;
  reviewsK: number;
  reviewsShort: string;
  reviewsFormatted: string;
  downloadsNum: number;
  downloadsSuffix: string;
  downloadsShort: string;
  downloadsFull: string;
  version: string;
  updatedOn: string;
  live: boolean;
}

export const FALLBACK_PLAY_STATS: PlayStoreStats;
export function fetchPlayStoreStats(force?: boolean): Promise<PlayStoreStats>;
