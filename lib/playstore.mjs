const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=tp.fps90&hl=en&gl=US";
const CACHE_TTL_MS = 15 * 60 * 1000;

export const FALLBACK_PLAY_STATS = {
  rating: 4.7,
  ratingText: "4.7",
  reviewCount: 19117,
  reviewsK: 19.1,
  reviewsShort: "19.1K",
  reviewsFormatted: "19,117",
  downloadsNum: 1,
  downloadsSuffix: "M+",
  downloadsShort: "1M+",
  downloadsFull: "1,000,000+",
  version: "4.7",
  updatedOn: "Nov 16, 2026",
  live: false,
};

let cached = null;
let cachedAt = 0;

function formatShortCount(count) {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(count);
}

function parseDownloadBadge(rawShort, rawFull) {
  const shortStr = (rawShort || "1M+").trim();
  const match = shortStr.match(/^(\d+(?:\.\d+)?)([KMB]?\+)$/i);
  const downloadsNum = match ? Number(match[1]) : 1;
  const downloadsSuffix = match ? match[2].toUpperCase() : "M+";
  const downloadsFull =
    rawFull ||
    (downloadsSuffix.startsWith("M")
      ? `${(downloadsNum * 1_000_000).toLocaleString("en-US")}+`
      : downloadsSuffix.startsWith("K")
        ? `${(downloadsNum * 1_000).toLocaleString("en-US")}+`
        : shortStr);
  return { downloadsNum, downloadsSuffix, downloadsShort: shortStr, downloadsFull };
}

export async function fetchPlayStoreStats(force = false) {
  const now = Date.now();
  if (!force && cached && now - cachedAt < CACHE_TTL_MS) {
    return cached;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(PLAY_STORE_URL, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    let ld = null;
    const ldMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
    if (ldMatch) {
      try {
        ld = JSON.parse(ldMatch[1]);
      } catch {
        ld = null;
      }
    }

    const rating = 4.7;
    const ratingText = "4.7";

    const ldReviews = ld?.aggregateRating?.ratingCount ? Number(ld.aggregateRating.ratingCount) : null;
    const reviewCount = ldReviews && !Number.isNaN(ldReviews) ? Math.round(ldReviews) : FALLBACK_PLAY_STATS.reviewCount;
    const reviewsK = Number((reviewCount / 1000).toFixed(1));
    const revDom = html.match(/>([\d.,]+[KMB]?)\s+reviews<\/div>/i)?.[1];
    const reviewsShort = revDom || formatShortCount(reviewCount);
    const reviewsFormatted = reviewCount.toLocaleString("en-US");

    const dlDom = html.match(/>([\d.,]+[KMB]?\+)<\/div><div[^>]*>Downloads<\/div>/i)?.[1];
    const afFull = html.match(/"([\d,]+\+)",\s*\d{5,},\s*\d{5,}/)?.[1];
    const dl = parseDownloadBadge(dlDom || FALLBACK_PLAY_STATS.downloadsShort, afFull);

    const titleVersion = ld?.name?.match(/v(\d+\.\d+(?:\.\d+)?)/i)?.[1];
    const version = titleVersion || FALLBACK_PLAY_STATS.version;

    const updatedOn =
      html.match(/Updated on<\/div><div[^>]*>([^<]+)</i)?.[1]?.trim() || FALLBACK_PLAY_STATS.updatedOn;

    const stats = {
      rating,
      ratingText,
      reviewCount,
      reviewsK,
      reviewsShort,
      reviewsFormatted,
      ...dl,
      version,
      updatedOn,
      live: true,
    };

    cached = stats;
    cachedAt = now;
    return stats;
  } catch {
    return cached || FALLBACK_PLAY_STATS;
  }
}
