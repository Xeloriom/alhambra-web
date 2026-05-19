<?php
session_start();
require_once __DIR__ . '/../_db.php';

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { jsonResponse(['error' => 'Method not allowed'], 405); }

$body = getBody();
$type = $body['type'] ?? '';

if (!$type) { jsonResponse(['error' => 'Missing type'], 400); }

// ── Build email subject & body ────────────────────────────────────────────────
$typeLabels = [
    'project' => '🚀 Nouveau Projet',
    'call'    => '📞 Réservation Call',
    'career'  => '✨ Candidature',
    'hi'      => '👋 Message Général',
];

$contact   = $body['contact'] ?? [];
$answers   = $body['answers'] ?? [];
$name      = $contact['name']  ?? $body['name']  ?? 'Anonyme';
$email     = $contact['email'] ?? $body['email'] ?? '';
$phone     = $contact['phone'] ?? $body['phone'] ?? '';
$label     = $typeLabels[$type] ?? 'Contact';
$subject   = "[Alhambra] {$label} — {$name}";

$lines = [];
if ($type === 'project') {
    $services = is_array($answers['services'] ?? null) ? implode(', ', $answers['services']) : ($answers['services'] ?? '—');
    $lines = [
        "<b>Services :</b> {$services}",
        "<b>Objectif :</b> " . ($answers['goal'] ?? '—'),
        "<b>Audience :</b> " . ($answers['audience'] ?? '—'),
        "<b>Délai :</b> "    . ($answers['timeline'] ?? '—'),
        "<b>Budget :</b> "   . ($answers['budget'] ?? '—'),
        "<b>Détails :</b> "  . ($answers['extra'] ?? '—'),
        "<br/><b>Contact :</b> {$name} — {$email} — " . ($phone ?: 'N/A'),
    ];
} elseif ($type === 'call') {
    $lines = [
        "<b>Date :</b> "   . ($body['date'] ?? '—'),
        "<b>Heure :</b> "  . ($body['time'] ?? '—'),
        "<b>Durée :</b> "  . ($body['duration'] ?? '—'),
        "<br/><b>Contact :</b> {$name} — {$email} — " . ($phone ?: 'N/A'),
    ];
} elseif ($type === 'career') {
    $lines = [
        "<b>Poste visé :</b> "   . ($answers['role'] ?? '—'),
        "<b>Expérience :</b> "   . ($answers['xp']   ?? '—'),
        "<b>Contrat :</b> "      . ($answers['type'] ?? '—'),
        "<b>Portfolio :</b> "    . ($answers['cv']   ?? '—'),
        "<br/><b>Contact :</b> {$name} — {$email} — " . ($phone ?: 'N/A'),
    ];
} else {
    $message = $contact['message'] ?? $body['message'] ?? '—';
    $lines = [
        "<b>Nom :</b> {$name}",
        "<b>Email :</b> {$email}",
        "<b>Téléphone :</b> " . ($phone ?: 'N/A'),
        "<b>Message :</b> {$message}",
    ];
}

$bodyHtml = implode('<br/>', $lines);
$html = <<<HTML
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <h2 style="border-bottom:2px solid #1A1E23;padding-bottom:12px;">{$label}</h2>
  <div style="line-height:2;font-size:15px;">{$bodyHtml}</div>
  <p style="margin-top:32px;font-size:12px;color:#999;">Alhambra Web</p>
</div>
HTML;

// ── Save to DB ────────────────────────────────────────────────────────────────
$db = getDb();
$id = bin2hex(random_bytes(16));
$stmt = $db->prepare("INSERT INTO contact_submissions (id, type, payload, subject, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())");
if ($stmt) {
    $payload = json_encode($body, JSON_UNESCAPED_UNICODE);
    $stmt->bind_param('ssss', $id, $type, $payload, $subject);
    $stmt->execute();
    $stmt->close();
}
$db->close();

// ── Send email ────────────────────────────────────────────────────────────────
$to      = CONTACT_EMAIL;
$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Alhambra Web <contact@alhambra-web.com>',
    $email ? "Reply-To: {$name} <{$email}>" : '',
]);
@mail($to, $subject, $html, trim($headers));

jsonResponse(['success' => true, 'message' => 'Contact enregistré.']);
