<?php
session_start();
require_once __DIR__ . '/../../_db.php';

header('Access-Control-Allow-Methods: GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

$db     = getDb();
$method = $_SERVER['REQUEST_METHOD'];

// GET — return all appointments
if ($method === 'GET') {
    $res  = $db->query("SELECT * FROM appointments ORDER BY created_at DESC");
    $rows = [];
    while ($row = $res->fetch_assoc()) $rows[] = $row;
    $db->close();
    jsonResponse($rows);
}

// DELETE — remove appointment by id
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? getBody()['id'] ?? '';
    if (!$id) { $db->close(); jsonResponse(['error' => 'id requis'], 400); }
    $stmt = $db->prepare("DELETE FROM appointments WHERE id = ?");
    $stmt->bind_param('s', $id);
    $stmt->execute();
    $stmt->close();
    $db->close();
    jsonResponse(['success' => true]);
}

$db->close();
jsonResponse(['error' => 'Method not allowed'], 405);
