<?php
session_start();
require_once __DIR__ . '/../../_db.php';

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$body     = getBody();
$to       = $body['to']       ?? '';
$toName   = $body['toName']   ?? $to;
$subject  = $body['subject']  ?? '';
$message  = $body['message']  ?? '';
$fromName = $body['fromName'] ?? 'Équipe Alhambra Web';

if (!$to || !$subject || !$message) {
    jsonResponse(['error' => 'Champs requis : to, subject, message'], 400);
}

if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Adresse email invalide'], 400);
}

$firstName  = explode(' ', $toName)[0];
$paragraphs = explode("\n", $message);
$bodyHtml   = '';
foreach ($paragraphs as $line) {
    $text      = htmlspecialchars($line ?: ' ', ENT_QUOTES, 'UTF-8');
    $bodyHtml .= '<p style="margin:0 0 14px 0;color:rgba(0,0,0,0.75);font-size:15px;line-height:1.8;">' . $text . '</p>';
}

$year = date('Y');
$firstNameSafe = htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8');
$fromNameSafe  = htmlspecialchars($fromName,  ENT_QUOTES, 'UTF-8');

$html  = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"></head>';
$html .= '<body style="margin:0;padding:0;background:#EFEFEF;font-family:\'Helvetica Neue\',Arial,sans-serif;">';
$html .= '<table width="100%" cellpadding="0" cellspacing="0" style="background:#EFEFEF;padding:48px 16px;">';
$html .= '<tr><td align="center">';
$html .= '<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#fff;border-radius:20px;overflow:hidden;">';

// Header
$html .= '<tr><td style="background:#0A0A0A;padding:40px 48px 36px;">';
$html .= '<img src="https://www.alhambra-web.com/logo.png" height="30" alt="Alhambra Web" style="display:block;height:30px;filter:brightness(0) invert(1);">';
$html .= '<div style="height:28px;"></div>';
$html .= '<p style="margin:0;color:rgba(255,255,255,.35);font-size:9px;font-weight:800;letter-spacing:.35em;text-transform:uppercase;">Studio Cr&eacute;atif &amp; Digital &middot; Lyon</p>';
$html .= '</td></tr>';

// Body
$html .= '<tr><td style="padding:48px 48px 36px;">';
$html .= '<p style="margin:0 0 28px;font-size:22px;font-weight:900;color:#0A0A0A;letter-spacing:-.03em;">Bonjour ' . $firstNameSafe . '&nbsp;&#x1F44B;</p>';
$html .= $bodyHtml;
$html .= '<table cellpadding="0" cellspacing="0" style="margin:36px 0;">';
$html .= '<tr><td style="background:#0A0A0A;border-radius:99px;">';
$html .= '<a href="https://www.alhambra-web.com" target="_blank" style="display:inline-block;color:#fff;font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:99px;">Voir notre portfolio &rarr;</a>';
$html .= '</td></tr></table>';
$html .= '<div style="height:1px;background:rgba(0,0,0,.07);margin:36px 0;"></div>';
$html .= '<table cellpadding="0" cellspacing="0"><tr>';
$html .= '<td style="width:40px;height:40px;background:#0A0A0A;border-radius:10px;text-align:center;vertical-align:middle;">';
$html .= '<span style="color:white;font-size:18px;font-weight:900;font-style:italic;">A</span></td>';
$html .= '<td style="padding-left:14px;">';
$html .= '<p style="margin:0;font-size:13px;font-weight:800;color:#0A0A0A;">' . $fromNameSafe . '</p>';
$html .= '<p style="margin:2px 0 0;font-size:11px;color:rgba(0,0,0,.4);">Alhambra Web &middot; <a href="https://www.alhambra-web.com" style="color:rgba(0,0,0,.4);text-decoration:none;">alhambra-web.com</a></p>';
$html .= '</td></tr></table>';
$html .= '</td></tr>';

// Footer
$html .= '<tr><td style="background:#F5F5F5;padding:22px 48px;border-top:1px solid rgba(0,0,0,.06);">';
$html .= '<p style="margin:0;font-size:10px;color:rgba(0,0,0,.25);text-align:center;">&copy; ' . $year . ' Alhambra Web &middot; Lyon, France</p>';
$html .= '</td></tr>';
$html .= '</table></td></tr></table></body></html>';

$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
$headers .= 'From: Alhambra Web <contact@alhambra-web.com>' . "\r\n";
$headers .= 'Reply-To: contact@alhambra-web.com';

$sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $html, $headers);

if (!$sent) {
    jsonResponse(['error' => "Erreur d'envoi email — vérifiez la config mail IONOS"], 502);
}

jsonResponse(['success' => true]);
