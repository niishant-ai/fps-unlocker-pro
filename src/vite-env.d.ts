/// <reference types="vite/client" />

declare module "virtual:playstore-stats" {
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

  export const INITIAL_PLAY_STATS: PlayStoreStats;
}
