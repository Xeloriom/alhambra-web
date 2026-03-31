<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$json_file = '../locales/fr.json';

// Handle OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Authentication (Simple)
$auth_pass = 'AlhambraAdmin2024!';
$headers = getallheaders();
$provided_pass = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($provided_pass !== $auth_pass) {
        http_response_code(403);
        echo json_encode(['error' => 'Accès refusé']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if ($data) {
        if (file_put_contents($json_file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erreur écriture fichier']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Données invalides']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($json_file)) {
        echo file_get_contents($json_file);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Fichier introuvable']);
    }
}
?>
