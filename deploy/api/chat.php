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

$body      = getBody();
$messages  = array_slice($body['messages']     ?? [], -10);
$sysPrompt = $body['systemPrompt'] ?? '';
$knowledge = array_slice($body['knowledgeBase'] ?? [], 0, 5);

if (empty($messages)) {
    echo "data: " . json_encode(['type' => 'error', 'message' => 'Missing messages']) . "\n\n";
    echo "data: [DONE]\n\n";
    flush();
    exit;
}

// ── Build system prompt ────────────────────────────────────────────────────
$systemContent = $sysPrompt ?: "Tu es Nexus, l'assistant IA interne d'Alhambra Web, agence web premium à Lyon. Réponds en français, de manière professionnelle et concise.";

if (!empty($knowledge)) {
    $systemContent .= "\n\nBASE DE CONNAISSANCES:\n";
    foreach ($knowledge as $entry) {
        $systemContent .= "- Problème: " . ($entry['problem'] ?? '') . " → Solution: " . ($entry['solution'] ?? '') . "\n";
    }
}

// ── Build messages in OpenAI format ───────────────────────────────────────
$groqMessages = [['role' => 'system', 'content' => $systemContent]];

foreach ($messages as $msg) {
    $role = ($msg['role'] === 'assistant' || $msg['role'] === 'ai') ? 'assistant' : 'user';
    if (!empty($msg['parts']) && is_array($msg['parts'])) {
        $text = '';
        foreach ($msg['parts'] as $part) {
            if (($part['type'] ?? '') === 'text') $text .= $part['text'] ?? '';
        }
    } else {
        $text = $msg['content'] ?? '';
    }
    if (trim($text) === '') continue;
    $groqMessages[] = ['role' => $role, 'content' => $text];
}

// ── Call Groq ──────────────────────────────────────────────────────────────
$payload = json_encode([
    'model'       => 'llama-3.3-70b-versatile',
    'messages'    => $groqMessages,
    'max_tokens'  => 1024,
    'temperature' => 0.7,
], JSON_UNESCAPED_UNICODE);

$ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . GROQ_API_KEY,
    ],
    CURLOPT_TIMEOUT => 30,
]);

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if (!$response || $httpCode !== 200) {
    $errBody   = json_decode($response, true);
    $errDetail = $errBody['error']['message'] ?? $response;
    $errMsg    = $curlError ?: "HTTP $httpCode: $errDetail";
    echo "data: " . json_encode(['type' => 'error', 'message' => "Erreur IA : $errMsg"]) . "\n\n";
    echo "data: [DONE]\n\n";
    flush();
    exit;
}

$data = json_decode($response, true);
$text = $data['choices'][0]['message']['content'] ?? 'Je ne peux pas répondre pour le moment.';

echo "data: " . json_encode(['type' => 'text-delta', 'delta' => $text], JSON_UNESCAPED_UNICODE) . "\n\n";
echo "data: [DONE]\n\n";
flush();
