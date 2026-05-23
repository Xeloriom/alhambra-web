<?php
require_once __DIR__ . '/../_db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { jsonResponse(['error' => 'Method not allowed'], 405); }

$body     = getBody();
$url      = trim($body['url']      ?? '');
$strategy = $body['strategy'] ?? 'mobile';
$strategy = in_array($strategy, ['mobile', 'desktop']) ? $strategy : 'mobile';

if (!$url) jsonResponse(['error' => 'URL manquante'], 400);
if (!filter_var($url, FILTER_VALIDATE_URL)) jsonResponse(['error' => 'URL invalide'], 400);

$db = getDb();

// ── Créer les tables si elles n'existent pas ───────────────────────────────
$db->query("CREATE TABLE IF NOT EXISTS seo_audit_cache (
    url_hash   VARCHAR(64) NOT NULL,
    strategy   VARCHAR(10) NOT NULL,
    result_json MEDIUMTEXT  NOT NULL,
    created_at DATETIME    NOT NULL DEFAULT NOW(),
    PRIMARY KEY (url_hash, strategy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$db->query("CREATE TABLE IF NOT EXISTS seo_audit_rl (
    ip_hash VARCHAR(64) PRIMARY KEY,
    cnt     INT      NOT NULL DEFAULT 0,
    window_ DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// ── Rate limit : 5 audits / IP / heure ───────────────────────────────────
$ip     = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
$ipHash = hash('sha256', $ip);

$rl = $db->prepare("SELECT cnt, window_ FROM seo_audit_rl WHERE ip_hash = ?");
$rl->bind_param('s', $ipHash);
$rl->execute();
$rlRow = $rl->get_result()->fetch_assoc();
$rl->close();

if ($rlRow) {
    $windowAge = time() - strtotime($rlRow['window_']);
    if ($windowAge < 3600 && $rlRow['cnt'] >= 5) {
        $wait = ceil((3600 - $windowAge) / 60);
        jsonResponse(['error' => "Trop de requêtes. Réessayez dans {$wait} min."], 429);
    }
}

// ── Cache 1h par URL + strategy ───────────────────────────────────────────
$urlHash = hash('sha256', $url . '|' . $strategy);
$cache   = $db->prepare("SELECT result_json FROM seo_audit_cache WHERE url_hash = ? AND strategy = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
$cache->bind_param('ss', $urlHash, $strategy);
$cache->execute();
$cached = $cache->get_result()->fetch_assoc();
$cache->close();

if ($cached) {
    $db->close();
    header('X-Audit-Cache: HIT');
    echo $cached['result_json'];
    exit;
}

// ── Appel PageSpeed Insights ──────────────────────────────────────────────
$cats   = 'category=performance&category=seo&category=accessibility&category=best-practices';
$apiUrl = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" . urlencode($url) . "&strategy=$strategy&$cats";
if (defined('GOOGLE_PSI_KEY') && GOOGLE_PSI_KEY) {
    $apiUrl .= '&key=' . GOOGLE_PSI_KEY;
}

$ch = curl_init($apiUrl);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 60]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200 || !$response) {
    $err = json_decode($response, true);
    $msg = $err['error']['message'] ?? "HTTP $httpCode";
    $db->close();
    jsonResponse(['error' => $msg], 502);
}

// ── Mettre en cache ───────────────────────────────────────────────────────
$ins = $db->prepare("INSERT INTO seo_audit_cache (url_hash, strategy, result_json) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE result_json = VALUES(result_json), created_at = NOW()");
$ins->bind_param('sss', $urlHash, $strategy, $response);
$ins->execute();
$ins->close();

// ── Incrémenter rate limit ────────────────────────────────────────────────
$upsert = $db->prepare("INSERT INTO seo_audit_rl (ip_hash, cnt, window_) VALUES (?, 1, NOW()) ON DUPLICATE KEY UPDATE cnt = IF(window_ < DATE_SUB(NOW(), INTERVAL 1 HOUR), 1, cnt + 1), window_ = IF(window_ < DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW(), window_)");
$upsert->bind_param('s', $ipHash);
$upsert->execute();
$upsert->close();

$db->close();
header('X-Audit-Cache: MISS');
echo $response;
