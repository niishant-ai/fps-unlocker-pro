<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');

$PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=tp.fps90&hl=en&gl=US';
$CACHE_TTL = 900; // 15 minutes server-side cache
$CACHE_FILE = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'fps_unlocker_playstore_stats_v47.json';

$FALLBACK = [
    'rating' => 4.7,
    'ratingText' => '4.7',
    'reviewCount' => 19117,
    'reviewsK' => 19.1,
    'reviewsShort' => '19.1K',
    'reviewsFormatted' => '19,117',
    'downloadsNum' => 1,
    'downloadsSuffix' => 'M+',
    'downloadsShort' => '1M+',
    'downloadsFull' => '1,000,000+',
    'version' => '4.7',
    'updatedOn' => 'Nov 16, 2026',
    'live' => false,
];

if (is_file($CACHE_FILE) && (time() - (int)filemtime($CACHE_FILE)) < $CACHE_TTL) {
    $cached = @file_get_contents($CACHE_FILE);
    if ($cached !== false && $cached !== '') {
        echo $cached;
        exit;
    }
}

function fetch_play_html(string $url): ?string {
    $ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_USERAGENT => $ua,
            CURLOPT_HTTPHEADER => ['Accept-Language: en-US,en;q=0.9'],
        ]);
        $html = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if (is_string($html) && $code >= 200 && $code < 300) {
            return $html;
        }
    }

    $ctx = stream_context_create([
        'http' => [
            'timeout' => 8,
            'header' => "User-Agent: {$ua}\r\nAccept-Language: en-US,en;q=0.9\r\n",
        ],
    ]);
    $html = @file_get_contents($url, false, $ctx);
    return is_string($html) ? $html : null;
}

function format_short_count(int $count): string {
    if ($count >= 1000000) {
        return rtrim(rtrim(number_format($count / 1000000, 1, '.', ''), '0'), '.') . 'M';
    }
    if ($count >= 1000) {
        return rtrim(rtrim(number_format($count / 1000, 1, '.', ''), '0'), '.') . 'K';
    }
    return (string)$count;
}

$html = fetch_play_html($PLAY_STORE_URL);
if ($html === null) {
    if (is_file($CACHE_FILE)) {
        $stale = @file_get_contents($CACHE_FILE);
        if ($stale !== false && $stale !== '') {
            echo $stale;
            exit;
        }
    }
    echo json_encode($FALLBACK, JSON_UNESCAPED_SLASHES);
    exit;
}

$ld = null;
if (preg_match('/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/is', $html, $m)) {
    $decoded = json_decode($m[1], true);
    if (is_array($decoded)) {
        $ld = $decoded;
    }
}

$reviewCount = $FALLBACK['reviewCount'];
if (isset($ld['aggregateRating']['ratingCount']) && is_numeric($ld['aggregateRating']['ratingCount'])) {
    $reviewCount = (int)round((float)$ld['aggregateRating']['ratingCount']);
}
$reviewsK = round($reviewCount / 1000, 1);

$reviewsShort = format_short_count($reviewCount);
if (preg_match('/>([\d.,]+[KMB]?)\s+reviews<\/div>/i', $html, $m)) {
    $reviewsShort = $m[1];
}
$reviewsFormatted = number_format($reviewCount, 0, '.', ',');

$downloadsShort = $FALLBACK['downloadsShort'];
if (preg_match('/>([\d.,]+[KMB]?\+)<\/div><div[^>]*>Downloads<\/div>/i', $html, $m)) {
    $downloadsShort = trim($m[1]);
}
$downloadsNum = 1;
$downloadsSuffix = 'M+';
if (preg_match('/^(\d+(?:\.\d+)?)([KMB]?\+)$/i', $downloadsShort, $m)) {
    $downloadsNum = (strpos($m[1], '.') !== false) ? (float)$m[1] : (int)$m[1];
    $downloadsSuffix = strtoupper($m[2]);
}

$downloadsFull = $FALLBACK['downloadsFull'];
if (preg_match('/"([\d,]+\+)",\s*\d{5,},\s*\d{5,}/', $html, $m)) {
    $downloadsFull = $m[1];
} elseif (strpos($downloadsSuffix, 'M') === 0) {
    $downloadsFull = number_format((float)$downloadsNum * 1000000, 0, '.', ',') . '+';
} elseif (strpos($downloadsSuffix, 'K') === 0) {
    $downloadsFull = number_format((float)$downloadsNum * 1000, 0, '.', ',') . '+';
}

$version = $FALLBACK['version'];
if (isset($ld['name']) && is_string($ld['name']) && preg_match('/v(\d+\.\d+(?:\.\d+)?)/i', $ld['name'], $m)) {
    $version = $m[1];
}

$updatedOn = $FALLBACK['updatedOn'];
if (preg_match('/Updated on<\/div><div[^>]*>([^<]+)</i', $html, $m)) {
    $updatedOn = trim($m[1]);
}

$stats = [
    'rating' => 4.7,
    'ratingText' => '4.7',
    'reviewCount' => $reviewCount,
    'reviewsK' => $reviewsK,
    'reviewsShort' => $reviewsShort,
    'reviewsFormatted' => $reviewsFormatted,
    'downloadsNum' => $downloadsNum,
    'downloadsSuffix' => $downloadsSuffix,
    'downloadsShort' => $downloadsShort,
    'downloadsFull' => $downloadsFull,
    'version' => $version,
    'updatedOn' => $updatedOn,
    'live' => true,
];

$json = json_encode($stats, JSON_UNESCAPED_SLASHES);
if (is_string($json)) {
    @file_put_contents($CACHE_FILE, $json, LOCK_EX);
    echo $json;
} else {
    echo json_encode($FALLBACK, JSON_UNESCAPED_SLASHES);
}
