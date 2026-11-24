import { fetchPlayStoreStats } from "../lib/playstore.mjs";

export default async function handler(_req, res) {
  const stats = await fetchPlayStoreStats();
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
  res.status(200).json(stats);
}
