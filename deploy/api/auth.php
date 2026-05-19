<?php
session_start();
require_once __DIR__ . '/../_db.php';

header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// GET — check session
if ($method === 'GET') {
    $ok = isset($_SESSION['admin']) && $_SESSION['admin'] === true;
    jsonResponse(['ok' => $ok]);
}

// POST — login
if ($method === 'POST') {
    $body     = getBody();
    $password = $body['password'] ?? '';

    if (!$password) {
        jsonResponse(['ok' => false, 'error' => 'Mot de passe requis'], 400);
    }

    if (!hash_equals(ADMIN_PASSWORD, $password)) {
        jsonResponse(['ok' => false, 'error' => 'Mot de passe incorrect'], 401);
    }

    $_SESSION['admin'] = true;
    jsonResponse(['ok' => true]);
}

// DELETE — logout
if ($method === 'DELETE') {
    $_SESSION = [];
    session_destroy();
    jsonResponse(['ok' => true]);
}

jsonResponse(['error' => 'Method not allowed'], 405);
