<?php
require_once __DIR__ . '/../_db.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST')    { jsonResponse(['error' => 'Method not allowed'], 405); }

$body     = getBody();
$url      = trim($body['url'] ?? '');
$strategy = in_array($body['strategy'] ?? '', ['mobile', 'desktop']) ? $body['strategy'] : 'mobile';

if (!$url)                                     jsonResponse(['error' => 'URL manquante'], 400);
if (!filter_var($url, FILTER_VALIDATE_URL))    jsonResponse(['error' => 'URL invalide — incluez https://'], 400);
if (!preg_match('/^https?:\/\//i', $url))      jsonResponse(['error' => 'URL invalide'], 400);

// ── DB optionnel (cache + rate-limit) ────────────────────────────────────────
$db = null;
try {
    $db = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    if ($db->connect_error) { $db = null; }
    else {
        $db->set_charset('utf8mb4');
        $db->query("CREATE TABLE IF NOT EXISTS seo_audit_cache (
            url_hash    VARCHAR(64)  NOT NULL,
            strategy    VARCHAR(10)  NOT NULL,
            result_json MEDIUMTEXT   NOT NULL,
            created_at  DATETIME     NOT NULL DEFAULT NOW(),
            PRIMARY KEY (url_hash, strategy)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        $db->query("CREATE TABLE IF NOT EXISTS seo_audit_rl (
            ip_hash VARCHAR(64) PRIMARY KEY,
            cnt     INT         NOT NULL DEFAULT 0,
            window_ DATETIME    NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    }
} catch (Exception $e) { $db = null; }

// ── Rate limit ────────────────────────────────────────────────────────────────
$ip     = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
$ipHash = hash('sha256', $ip);

if ($db) {
    $rl = $db->prepare("SELECT cnt, window_ FROM seo_audit_rl WHERE ip_hash = ?");
    $rl->bind_param('s', $ipHash); $rl->execute();
    $rlRow = $rl->get_result()->fetch_assoc(); $rl->close();
    if ($rlRow) {
        $age = time() - strtotime($rlRow['window_']);
        if ($age < 3600 && $rlRow['cnt'] >= 10)
            jsonResponse(['error' => 'Trop de requêtes. Réessayez dans ' . ceil((3600 - $age) / 60) . ' min.'], 429);
    }
}

// ── Cache 1h ──────────────────────────────────────────────────────────────────
$urlHash = hash('sha256', $url . '|' . $strategy);
if ($db) {
    $cache = $db->prepare("SELECT result_json FROM seo_audit_cache WHERE url_hash = ? AND strategy = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)");
    $cache->bind_param('ss', $urlHash, $strategy); $cache->execute();
    $cached = $cache->get_result()->fetch_assoc(); $cache->close();
    if ($cached) { $db->close(); header('X-Audit-Cache: HIT'); echo $cached['result_json']; exit; }
}

// ══════════════════════════════════════════════════════════════════════════════
// FETCH + ANALYSE
// ══════════════════════════════════════════════════════════════════════════════
$ua = $strategy === 'mobile'
    ? 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36'
    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

$t0 = microtime(true);
$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_MAXREDIRS      => 5,
    CURLOPT_TIMEOUT        => 20,
    CURLOPT_USERAGENT      => $ua,
    CURLOPT_HTTPHEADER     => ['Accept-Language: fr-FR,fr;q=0.9,en;q=0.8'],
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HEADER         => true,
]);
$raw      = curl_exec($ch);
$ms       = round((microtime(true) - $t0) * 1000);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$finalUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
$errCurl  = curl_error($ch);
$hdrSize  = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

if ($errCurl || !$raw) jsonResponse(['error' => 'Site inaccessible : ' . ($errCurl ?: 'pas de réponse')], 502);
if ($httpCode >= 400)  jsonResponse(['error' => "Le site répond HTTP $httpCode"], 502);

$html     = substr($raw, $hdrSize);
$htmlSize = strlen($html);

// ── Parse HTML ────────────────────────────────────────────────────────────────
libxml_use_internal_errors(true);
$dom = new DOMDocument('1.0', 'UTF-8');
$dom->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_NOWARNING | LIBXML_NOERROR);
libxml_clear_errors();
$xpath = new DOMXPath($dom);

// ── Helpers ───────────────────────────────────────────────────────────────────
function xval(DOMXPath $x, string $q): string {
    $n = $x->query($q); return $n && $n->length ? trim($n->item(0)->nodeValue) : '';
}
function xattr(DOMXPath $x, string $q, string $a): string {
    $n = $x->query($q); return $n && $n->length ? trim($n->item(0)->getAttribute($a)) : '';
}
function xcount(DOMXPath $x, string $q): int {
    $n = $x->query($q); return $n ? $n->length : 0;
}

// ── Extractions ───────────────────────────────────────────────────────────────
$title       = xval($xpath, '//title');
$desc        = xattr($xpath, '//meta[@name="description"]', 'content');
$robots      = xattr($xpath, '//meta[@name="robots"]', 'content');
$canonical   = xattr($xpath, '//link[@rel="canonical"]', 'href');
$viewport    = xattr($xpath, '//meta[@name="viewport"]', 'content');
$ogTitle     = xattr($xpath, '//meta[@property="og:title"]', 'content');
$ogDesc      = xattr($xpath, '//meta[@property="og:description"]', 'content');
$ogImage     = xattr($xpath, '//meta[@property="og:image"]', 'content');
$twitterCard = xattr($xpath, '//meta[@name="twitter:card"]', 'content');
$lang        = xattr($xpath, '//html', 'lang');

$h1s   = $xpath->query('//h1');
$h1    = $h1s && $h1s->length ? trim($h1s->item(0)->nodeValue) : '';
$h1cnt = $h1s ? $h1s->length : 0;
$h2cnt = xcount($xpath, '//h2');
$h3cnt = xcount($xpath, '//h3');

// Images
$imgs       = $xpath->query('//img');
$imgTotal   = $imgs ? $imgs->length : 0;
$imgNoAlt   = 0;
$imgEmptyAlt= 0;
if ($imgs) foreach ($imgs as $img) {
    if (!$img->hasAttribute('alt')) $imgNoAlt++;
    elseif (trim($img->getAttribute('alt')) === '') $imgEmptyAlt++;
}

// Liens
$links      = $xpath->query('//a[@href]');
$linkCount  = $links ? $links->length : 0;
$internalLinks = 0; $externalLinks = 0; $noTextLinks = 0;
$host = parse_url($url, PHP_URL_HOST);
if ($links) foreach ($links as $link) {
    $href = $link->getAttribute('href');
    $txt  = trim($link->nodeValue);
    if (empty($txt)) $noTextLinks++;
    if (str_starts_with($href, 'http')) {
        $h = parse_url($href, PHP_URL_HOST);
        if ($h === $host) $internalLinks++; else $externalLinks++;
    } else {
        $internalLinks++;
    }
}

// JSON-LD
$jsonLdScripts = $xpath->query('//script[@type="application/ld+json"]');
$jsonLdCount   = $jsonLdScripts ? $jsonLdScripts->length : 0;
$schemaTypes   = [];
if ($jsonLdScripts) foreach ($jsonLdScripts as $s) {
    $data = json_decode($s->nodeValue, true);
    if (isset($data['@type'])) $schemaTypes[] = is_array($data['@type']) ? implode(', ', $data['@type']) : $data['@type'];
    if (isset($data['@graph'])) foreach ($data['@graph'] as $g) {
        if (isset($g['@type'])) $schemaTypes[] = is_array($g['@type']) ? implode(', ', $g['@type']) : $g['@type'];
    }
}

// Contenu texte
$body_tag  = $xpath->query('//body');
$bodyText  = $body_tag && $body_tag->length ? $body_tag->item(0)->textContent : $html;
$wordCount = str_word_count(preg_replace('/\s+/', ' ', strip_tags($bodyText)));

// HTTPS
$isHttps = str_starts_with($finalUrl, 'https://');

// ══════════════════════════════════════════════════════════════════════════════
// CHECKS + SCORE
// ══════════════════════════════════════════════════════════════════════════════
$checks = [];
$pts = 0; $total = 0;

function chk(array &$out, int &$pts, int &$tot, string $id, bool $pass, string $label, string $msg, string $cat, int $weight = 1): void {
    $out[$id] = ['pass' => $pass, 'label' => $label, 'message' => $msg, 'category' => $cat];
    if ($pass) $pts += $weight;
    $tot += $weight;
}

// ── Technique ─────────────────────────────────────────────────────────────────
chk($checks, $pts, $total, 'https',     $isHttps,           'HTTPS activé',       $isHttps ? 'Connexion sécurisée HTTPS ✓' : 'Le site n\'utilise pas HTTPS — pénalité Google',   'Technique', 3);
chk($checks, $pts, $total, 'speed',     $ms < 3000,         'Temps de réponse',   $ms < 1000 ? "Excellent : {$ms}ms" : ($ms < 3000 ? "Correct : {$ms}ms" : "Lent : {$ms}ms — Google pénalise au-delà de 3s"), 'Technique', 2);
chk($checks, $pts, $total, 'viewport',  !empty($viewport),  'Viewport mobile',    !empty($viewport) ? 'Balise viewport présente ✓' : 'Viewport absent — site non mobile-friendly', 'Technique', 2);
chk($checks, $pts, $total, 'canonical', !empty($canonical), 'URL canonique',      !empty($canonical) ? "Canonical : $canonical" : 'Pas d\'URL canonique — risque de contenu dupliqué', 'Technique', 2);
chk($checks, $pts, $total, 'lang',      !empty($lang),      'Langue déclarée',    !empty($lang) ? "lang=\"$lang\" ✓" : 'Attribut lang absent sur <html>', 'Technique', 1);
chk($checks, $pts, $total, 'robots',    empty($robots) || !str_contains(strtolower($robots), 'noindex'), 'Robots indexable', empty($robots) || str_contains(strtolower($robots), 'index') ? 'Page indexable par Google ✓' : "Attention : robots=\"$robots\"", 'Technique', 3);

// ── Contenu ───────────────────────────────────────────────────────────────────
$titleLen = mb_strlen($title);
chk($checks, $pts, $total, 'title',     $titleLen >= 30 && $titleLen <= 65, 'Balise title',       $title ? "\"$title\" ($titleLen car.)" . ($titleLen < 30 ? ' — trop court' : ($titleLen > 65 ? ' — trop long' : ' ✓')) : 'Title absent — critique !', 'Contenu', 4);

$descLen = mb_strlen($desc);
chk($checks, $pts, $total, 'metadesc',  $descLen >= 100 && $descLen <= 165, 'Meta description',   $desc ? "($descLen car.)" . ($descLen < 100 ? ' — trop courte (min 100)' : ($descLen > 165 ? ' — trop longue (max 165)' : ' ✓')) : 'Meta description absente — critique !', 'Contenu', 4);

chk($checks, $pts, $total, 'h1',        $h1cnt === 1,       'Balise H1',          $h1cnt === 0 ? 'Aucun H1 — critique pour le SEO' : ($h1cnt === 1 ? "\"" . mb_substr($h1, 0, 60) . "\" ✓" : "$h1cnt H1 détectés — il ne doit y en avoir qu'un"), 'Contenu', 4);
chk($checks, $pts, $total, 'h2',        $h2cnt >= 1,        'Balises H2',         $h2cnt > 0 ? "$h2cnt H2 ✓" : 'Aucun H2 — ajoutez des sous-titres structurés', 'Contenu', 2);
chk($checks, $pts, $total, 'wordcount', $wordCount >= 300,  'Contenu texte',      "$wordCount mots" . ($wordCount < 300 ? ' — insuffisant (min 300)' : ($wordCount >= 800 ? ' — excellent ✓' : ' — correct ✓')), 'Contenu', 2);

// ── Images ────────────────────────────────────────────────────────────────────
chk($checks, $pts, $total, 'imgalt',    $imgNoAlt === 0 && $imgEmptyAlt === 0, 'Attributs ALT',
    $imgTotal === 0 ? 'Aucune image détectée' : ($imgNoAlt + $imgEmptyAlt === 0 ? "$imgTotal images, toutes avec alt ✓" : ($imgNoAlt + $imgEmptyAlt) . " image(s) sans alt sur $imgTotal"),
    'Contenu', 2);

// ── Liens ─────────────────────────────────────────────────────────────────────
chk($checks, $pts, $total, 'links',     $internalLinks >= 3, 'Maillage interne',  "$internalLinks liens internes, $externalLinks externes" . ($internalLinks < 3 ? ' — renforcez le maillage' : ' ✓'), 'Liens', 2);
chk($checks, $pts, $total, 'notext',    $noTextLinks === 0,  'Liens sans texte',  $noTextLinks === 0 ? 'Tous les liens ont un texte ✓' : "$noTextLinks lien(s) sans texte d'ancre", 'Liens', 1);

// ── Données structurées ───────────────────────────────────────────────────────
chk($checks, $pts, $total, 'jsonld',    $jsonLdCount > 0,   'Données structurées', $jsonLdCount > 0 ? "$jsonLdCount script(s) JSON-LD — types : " . implode(', ', array_unique($schemaTypes)) : 'Aucun schema JSON-LD — rich snippets impossibles', 'Technique', 3);

// ── Social / Open Graph ───────────────────────────────────────────────────────
chk($checks, $pts, $total, 'ogtitle',  !empty($ogTitle),   'og:title',           !empty($ogTitle) ? "\"" . mb_substr($ogTitle, 0, 50) . "\" ✓" : 'og:title absent — mauvais partage sur les réseaux', 'Social', 1);
chk($checks, $pts, $total, 'ogdesc',   !empty($ogDesc),    'og:description',     !empty($ogDesc)  ? '✓' : 'og:description absent', 'Social', 1);
chk($checks, $pts, $total, 'ogimage',  !empty($ogImage),   'og:image',           !empty($ogImage) ? '✓' : 'og:image absent — le partage apparaîtra sans image', 'Social', 1);
chk($checks, $pts, $total, 'twitter',  !empty($twitterCard),'Twitter Card',      !empty($twitterCard) ? "\"$twitterCard\" ✓" : 'twitter:card absent', 'Social', 1);

// ── Score global ──────────────────────────────────────────────────────────────
$score = $total > 0 ? (int) round(($pts / $total) * 100) : 0;

// Score par catégorie
$cats = ['Technique' => [0, 0], 'Contenu' => [0, 0], 'Liens' => [0, 0], 'Social' => [0, 0]];
foreach ($checks as $c) {
    $cat = $c['category'];
    $cats[$cat][1]++;
    if ($c['pass']) $cats[$cat][0]++;
}
$categories = [];
foreach ($cats as $name => [$p, $t]) {
    $categories[] = ['label' => $name, 'score' => $t > 0 ? (int) round(($p / $t) * 100) : 0, 'pass' => $p, 'total' => $t];
}

// ── Résultat ──────────────────────────────────────────────────────────────────
$result = json_encode([
    'url'        => $finalUrl,
    'score'      => $score,
    'responseMs' => $ms,
    'htmlSizeKb' => round($htmlSize / 1024, 1),
    'wordCount'  => $wordCount,
    'checks'     => $checks,
    'categories' => $categories,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

// ── Cache + rate limit ────────────────────────────────────────────────────────
if ($db) {
    $ins = $db->prepare("INSERT INTO seo_audit_cache (url_hash, strategy, result_json) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE result_json = VALUES(result_json), created_at = NOW()");
    $ins->bind_param('sss', $urlHash, $strategy, $result); $ins->execute(); $ins->close();

    $upsert = $db->prepare("INSERT INTO seo_audit_rl (ip_hash, cnt, window_) VALUES (?, 1, NOW()) ON DUPLICATE KEY UPDATE cnt = IF(window_ < DATE_SUB(NOW(), INTERVAL 1 HOUR), 1, cnt + 1), window_ = IF(window_ < DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW(), window_)");
    $upsert->bind_param('s', $ipHash); $upsert->execute(); $upsert->close();
    $db->close();
}

header('X-Audit-Cache: MISS');
echo $result;
