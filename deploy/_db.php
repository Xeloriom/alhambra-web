<?php
// ── Connexion MySQL ────────────────────────────────────────────────────────────
define('DB_HOST', 'db5007123776.hosting-data.io');
define('DB_PORT', 3306);
define('DB_USER', 'dbu2435482');
define('DB_PASS', 'BILLALE123');
define('DB_NAME', 'dbs5872834');

// ── Clés API & secrets ────────────────────────────────────────────────────────
define('GEMINI_API_KEY',  'AIzaSyBznHcoowPq7ODxweYhf1p-LZtnx72KDcQok');
define('ADMIN_PASSWORD',  'Alhambra2026!');
define('JWT_SECRET',      'c6f1c190a4068e87e6bd9bf6bc72d65913385ab570e684f9621e4e2ae24324b9');
define('CONTACT_EMAIL',   'contact@alhambra-web.com');

// ── Helpers ───────────────────────────────────────────────────────────────────
function getDb(): mysqli {
    $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
    if ($db->connect_error) {
        jsonResponse(['error' => 'Connexion DB échouée'], 500);
    }
    $db->set_charset('utf8mb4');
    return $db;
}

function jsonResponse(array $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function getBody(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}
