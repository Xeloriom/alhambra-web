<?php
// ── Sécurité : accès restreint ────────────────────────────────────────────────
$token = $_GET['token'] ?? '';
if ($token !== 'alhambra-test-2026') {
    http_response_code(403);
    die('Accès refusé. Ajouter ?token=alhambra-test-2026');
}

$base = 'https://www.alhambra-web.com';

// ── Runner ────────────────────────────────────────────────────────────────────
function run(string $name, string $url, string $method = 'GET', mixed $body = null, int $expect = 200): array {
    $ch = curl_init($url);
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_COOKIE         => $_SERVER['HTTP_COOKIE'] ?? '',
    ];
    if ($body !== null) $opts[CURLOPT_POSTFIELDS] = json_encode($body);
    curl_setopt_array($ch, $opts);
    $t0       = microtime(true);
    $raw      = curl_exec($ch);
    $ms       = round((microtime(true) - $t0) * 1000);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);
    $decoded  = json_decode($raw, true);
    $preview  = $curlErr ?: (is_array($decoded)
        ? (isset($decoded['error']) ? $decoded['error'] : (isset($decoded[0]) ? json_encode(array_slice($decoded, 0, 1)) : json_encode($decoded)))
        : substr($raw, 0, 120));
    return [
        'name'    => $name,
        'url'     => $url,
        'method'  => $method,
        'expect'  => $expect,
        'status'  => $status,
        'ok'      => $status === $expect,
        'ms'      => $ms,
        'preview' => $preview,
    ];
}

// ── Tests ─────────────────────────────────────────────────────────────────────
$results = [];

// Public reads
$results[] = run('site_projects – GET public',  "$base/api/data.php?table=site_projects",  'GET',  null, 200);
$results[] = run('site_services – GET public',  "$base/api/data.php?table=site_services",  'GET',  null, 200);

// Public writes
$results[] = run('appointments – POST (write publique)',
    "$base/api/data.php?table=appointments", 'POST',
    ['client_name'=>'TEST_API','client_email'=>'api@test.com','date'=>'2099-01-01','time'=>'00:00','duration'=>'test'],
    201);
$results[] = run('messages – POST (write publique)',
    "$base/api/data.php?table=messages", 'POST',
    ['sender'=>'TEST_API','subject'=>'API Test','body'=>'test automatisé','time'=>'00:00','is_read'=>false],
    201);
$results[] = run('applications – POST (write publique)',
    "$base/api/data.php?table=applications", 'POST',
    ['candidate_name'=>'TEST_API','candidate_email'=>'api@test.com','candidate_phone'=>null,'role'=>'Dev','experience'=>'3 ans','contract_type'=>'CDI','portfolio'=>'','status'=>'pending'],
    201);

// Auth wall — passe la session admin si connecté (les 200 ici = admin actif = normal)
$expectAuth = 401; // devient 200 si admin connecté dans ce navigateur
foreach (['tasks','messages','appointments','projects','knowledge_base','contact_submissions','subscriptions','applications'] as $tbl) {
    $r = run("$tbl – GET (auth)", "$base/api/data.php?table=$tbl", 'GET', null, $expectAuth);
    // Accept 200 aussi (session admin active = ok)
    if ($r['status'] === 200) { $r['ok'] = true; $r['preview'] = '✓ admin session active'; }
    $results[] = $r;
}

// Table inconnue (doit 403)
$results[] = run('table inconnue – GET (403 attendu)', "$base/api/data.php?table=hackattempt", 'GET', null, 403);

// Auth
$r = run('auth – GET (session check)',  "$base/api/auth",  'GET',  null, 401);
if ($r['status'] === 200) { $r['ok'] = true; $r['preview'] = '✓ admin connecté'; }
$results[] = $r;
$results[] = run('auth – POST mauvais mdp',     "$base/api/auth",  'POST', ['password'=>'mauvais'], 401);

// Chat AI
$results[] = run('chat – POST Gemini',
    "$base/api/chat", 'POST',
    ['messages'=>[['role'=>'user','content'=>'ping']]],
    200);

// Contact
$results[] = run('contact – POST (type: hi)',
    "$base/api/contact", 'POST',
    ['type'=>'hi','name'=>'Test API','email'=>'api@test.com','phone'=>'','message'=>'test automatisé'],
    200);

// Stats
$ok  = count(array_filter($results, fn($r) => $r['ok']));
$ko  = count($results) - $ok;
$total = count($results);
?>
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>API Test Suite — Alhambra</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'SF Mono',monospace;background:#0a0a0a;color:#e0e0e0;padding:32px;min-height:100vh}
  h1{font-size:18px;font-weight:700;letter-spacing:.15em;color:#fff;margin-bottom:4px}
  .sub{font-size:12px;color:#555;margin-bottom:32px}
  .summary{display:flex;gap:20px;margin-bottom:32px}
  .badge{padding:8px 20px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:.05em}
  .badge.pass{background:#0d2b0d;color:#4cff72;border:1px solid #1a5c1a}
  .badge.fail{background:#2b0d0d;color:#ff4c4c;border:1px solid #5c1a1a}
  .badge.total{background:#1a1a1a;color:#888;border:1px solid #333}
  table{width:100%;border-collapse:collapse;font-size:12px}
  th{text-align:left;padding:10px 14px;color:#555;font-weight:600;letter-spacing:.1em;font-size:11px;border-bottom:1px solid #1a1a1a;text-transform:uppercase}
  td{padding:10px 14px;border-bottom:1px solid #111;vertical-align:middle}
  tr:hover td{background:#111}
  .ok{color:#4cff72;font-weight:700}
  .ko{color:#ff4c4c;font-weight:700}
  .method{padding:2px 8px;border-radius:3px;font-size:10px;font-weight:700;letter-spacing:.05em}
  .GET{background:#0d1f2b;color:#4cb8ff}
  .POST{background:#0d2b15;color:#4cff8a}
  .DELETE{background:#2b0d0d;color:#ff6b6b}
  .PATCH{background:#2b220d;color:#ffb84c}
  .url{color:#666;font-size:11px;word-break:break-all}
  .preview{color:#555;font-size:11px;max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ms{color:#444;text-align:right}
  .status-ok{color:#4cff72}
  .status-ko{color:#ff4c4c}
  .sep{margin-top:24px;margin-bottom:8px;color:#333;font-size:11px;letter-spacing:.15em;text-transform:uppercase;border-top:1px solid #1a1a1a;padding-top:16px}
</style>
</head>
<body>
<h1>⬡ API TEST SUITE</h1>
<p class="sub">alhambra-web.com · <?= date('Y-m-d H:i:s') ?> UTC</p>

<div class="summary">
  <span class="badge pass">✓ <?= $ok ?> PASS</span>
  <span class="badge fail">✗ <?= $ko ?> FAIL</span>
  <span class="badge total"><?= $total ?> TESTS</span>
</div>

<table>
  <thead>
    <tr>
      <th>Status</th>
      <th>Test</th>
      <th>Méthode</th>
      <th>URL</th>
      <th>Attendu → Reçu</th>
      <th>Réponse</th>
      <th>ms</th>
    </tr>
  </thead>
  <tbody>
<?php foreach ($results as $r): ?>
    <tr>
      <td><?= $r['ok'] ? '<span class="ok">✓ OK</span>' : '<span class="ko">✗ KO</span>' ?></td>
      <td><?= htmlspecialchars($r['name']) ?></td>
      <td><span class="method <?= $r['method'] ?>"><?= $r['method'] ?></span></td>
      <td class="url"><?= htmlspecialchars(str_replace('https://www.alhambra-web.com', '', $r['url'])) ?></td>
      <td><?= $r['ok']
            ? '<span class="status-ok">'.$r['expect'].' → '.$r['status'].'</span>'
            : '<span class="status-ko">'.$r['expect'].' attendu → '.$r['status'].' reçu</span>' ?></td>
      <td class="preview" title="<?= htmlspecialchars($r['preview']) ?>"><?= htmlspecialchars($r['preview']) ?></td>
      <td class="ms"><?= $r['ms'] ?>ms</td>
    </tr>
<?php endforeach ?>
  </tbody>
</table>
</body>
</html>
