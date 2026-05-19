<?php
require_once __DIR__ . '/../_db.php';

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo "data: " . json_encode(['type' => 'error', 'message' => 'Method not allowed']) . "\n\n";
    flush();
    exit;
}

$body       = getBody();
$messages   = $body['messages']     ?? [];
$sysPrompt  = $body['systemPrompt'] ?? '';
$knowledge  = $body['knowledgeBase'] ?? [];

if (empty($messages)) {
    echo "data: " . json_encode(['type' => 'error', 'message' => 'Missing messages']) . "\n\n";
    echo "data: [DONE]\n\n";
    flush();
    exit;
}

// ── Append knowledge base to system prompt ─────────────────────────────────
if (!empty($knowledge)) {
    $kb = "\n\nBASE DE CONNAISSANCES:\n";
    foreach ($knowledge as $entry) {
        $kb .= "- Problème: " . ($entry['problem'] ?? '') . " → Solution: " . ($entry['solution'] ?? '') . "\n";
    }
    $sysPrompt .= $kb;
}

// ── Map messages to Gemini format (handle both parts[] and content string) ─
$contents = [];
foreach ($messages as $msg) {
    $role = ($msg['role'] === 'assistant' || $msg['role'] === 'ai') ? 'model' : 'user';
    // Support both parts-based (AI SDK v5/v6) and plain content string
    if (!empty($msg['parts']) && is_array($msg['parts'])) {
        $text = '';
        foreach ($msg['parts'] as $part) {
            if (($part['type'] ?? '') === 'text') {
                $text .= $part['text'] ?? '';
            }
        }
    } else {
        $text = $msg['content'] ?? '';
    }
    if (trim($text) === '') continue;
    $contents[] = ['role' => $role, 'parts' => [['text' => $text]]];
}

if (empty($contents)) {
    echo "data: " . json_encode(['type' => 'error', 'message' => 'No valid messages']) . "\n\n";
    echo "data: [DONE]\n\n";
    flush();
    exit;
}

// ── Call Gemini ────────────────────────────────────────────────────────────
$apiKey  = GEMINI_API_KEY;
$payload = json_encode([
    'contents'          => $contents,
    'systemInstruction' => ['parts' => [['text' => $sysPrompt ?: "Tu es Nexus, l'assistant IA interne d'Alhambra Web, agence web premium à Lyon. Réponds en français, de manière professionnelle et concise."]]],
    'generationConfig'  => ['maxOutputTokens' => 2048, 'temperature' => 0.7],
], JSON_UNESCAPED_UNICODE);

$ch = curl_init("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$apiKey");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_TIMEOUT        => 30,
]);

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if (!$response || $httpCode !== 200) {
    $errMsg = $curlError ?: "HTTP $httpCode";
    echo "data: " . json_encode(['type' => 'error', 'message' => "Erreur Gemini : $errMsg"]) . "\n\n";
    echo "data: [DONE]\n\n";
    flush();
    exit;
}

$data = json_decode($response, true);
$text = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Je ne peux pas répondre pour le moment.';

// ── Emit as SSE text-delta (single chunk — compatible with the SSE parser in admin) ──
echo "data: " . json_encode(['type' => 'text-delta', 'delta' => $text], JSON_UNESCAPED_UNICODE) . "\n\n";
echo "data: [DONE]\n\n";
flush();
