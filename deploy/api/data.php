<?php
session_start();
require_once __DIR__ . '/../_db.php';

header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Tables autorisées ──────────────────────────────────────────────────────────
$PUBLIC_TABLES  = ['site_projects', 'site_services'];
$PRIVATE_TABLES = [
    'projects', 'tasks', 'messages', 'appointments',
    'knowledge_base', 'contact_submissions', 'subscriptions',
    'applications'
];
// Ces tables privées acceptent les POST publics (soumissions de formulaires)
$PUBLIC_WRITABLE = ['appointments', 'messages', 'projects', 'applications'];
$ALL_TABLES = array_merge($PUBLIC_TABLES, $PRIVATE_TABLES);

// ── Champs JSON à décoder par table ───────────────────────────────────────────
$JSON_FIELDS = [
    'projects'      => ['links', 'metrics', 'notes'],
    'knowledge_base'=> ['tags'],
    'site_services' => ['features', 'metrics', 'tabs'],
];

// ── Champs boolean (TINYINT) par table ────────────────────────────────────────
$BOOL_FIELDS = [
    'contact_submissions' => ['is_read'],
    'subscriptions'       => ['auto_renew'],
    'site_projects'       => ['is_live'],
    'site_services'       => ['active'],
    'projects'            => ['is_live'],
    'tasks'               => ['active'],
    'knowledge_base'      => ['active'],
];

// ── Validation de la table ────────────────────────────────────────────────────
$table = $_GET['table'] ?? '';
$table = preg_replace('/[^a-z_]/', '', strtolower($table));

if (!in_array($table, $ALL_TABLES, true)) {
    jsonResponse(['error' => 'Table non autorisée'], 403);
}

// ── Vérification auth pour tables privées ─────────────────────────────────────
if (in_array($table, $PRIVATE_TABLES, true)) {
    $isAdmin       = isset($_SESSION['admin']) && $_SESSION['admin'] === true;
    $isPublicWrite = in_array($table, $PUBLIC_WRITABLE, true) && $_SERVER['REQUEST_METHOD'] === 'POST';
    if (!$isAdmin && !$isPublicWrite) {
        jsonResponse(['error' => 'Non autorisé'], 401);
    }
}

$db     = getDb();
$method = $_SERVER['REQUEST_METHOD'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function decodeRow(array $row, string $table, array $jsonFields, array $boolFields): array {
    foreach (($jsonFields[$table] ?? []) as $field) {
        if (isset($row[$field]) && is_string($row[$field])) {
            $decoded = json_decode($row[$field], true);
            $row[$field] = ($decoded !== null) ? $decoded : $row[$field];
        }
    }
    foreach (($boolFields[$table] ?? []) as $field) {
        if (array_key_exists($field, $row)) {
            $row[$field] = (bool)$row[$field];
        }
    }
    return $row;
}

function encodeJsonFields(array $body, string $table, array $jsonFields): array {
    foreach (($jsonFields[$table] ?? []) as $field) {
        if (isset($body[$field]) && is_array($body[$field])) {
            $body[$field] = json_encode($body[$field], JSON_UNESCAPED_UNICODE);
        }
    }
    return $body;
}

// ── GET ───────────────────────────────────────────────────────────────────────
if ($method === 'GET') {
    // Tables with user-defined ordering use sort_order ASC
    $hasSortOrder = $db->query("SHOW COLUMNS FROM `$table` LIKE 'sort_order'");
    if ($hasSortOrder && $hasSortOrder->num_rows > 0) {
        $orderCol = 'sort_order';
        $orderDir = 'ASC';
    } else {
        $hasCreatedAt = $db->query("SHOW COLUMNS FROM `$table` LIKE 'created_at'");
        $orderCol = ($hasCreatedAt && $hasCreatedAt->num_rows > 0) ? 'created_at' : 'id';
        $orderDir = 'DESC';
    }

    $res  = $db->query("SELECT * FROM `$table` ORDER BY `$orderCol` $orderDir");
    if (!$res) {
        jsonResponse(['error' => $db->error], 500);
    }

    $rows = [];
    while ($row = $res->fetch_assoc()) {
        $rows[] = decodeRow($row, $table, $JSON_FIELDS, $BOOL_FIELDS);
    }
    $db->close();
    jsonResponse($rows);
}

// ── POST ──────────────────────────────────────────────────────────────────────
if ($method === 'POST') {
    $body = getBody();
    unset($body['created_at']);
    $body = encodeJsonFields($body, $table, $JSON_FIELDS);

    $id = bin2hex(random_bytes(16));
    $body['id'] = $id;

    $cols   = array_keys($body);
    $cols[] = 'created_at';

    $placeholders = array_fill(0, count($cols) - 1, '?');
    $placeholders[] = 'NOW()';

    $sql  = 'INSERT INTO `' . $table . '` (`' . implode('`, `', $cols) . '`) VALUES (' . implode(', ', $placeholders) . ')';
    $stmt = $db->prepare($sql);
    if (!$stmt) {
        jsonResponse(['error' => $db->error], 500);
    }

    $values = array_values($body);
    $types  = str_repeat('s', count($values));
    $stmt->bind_param($types, ...$values);
    if (!$stmt->execute()) {
        jsonResponse(['error' => $stmt->error], 500);
    }
    $stmt->close();

    $sel  = $db->prepare("SELECT * FROM `$table` WHERE id = ? LIMIT 1");
    $sel->bind_param('s', $id);
    $sel->execute();
    $res  = $sel->get_result();
    $row  = $res ? $res->fetch_assoc() : $body;
    $sel->close();
    $db->close();
    jsonResponse($row ? decodeRow($row, $table, $JSON_FIELDS, $BOOL_FIELDS) : $body, 201);
}

// ── PATCH ─────────────────────────────────────────────────────────────────────
if ($method === 'PATCH') {
    $body = getBody();
    $id   = $body['id'] ?? '';
    if (!$id) {
        jsonResponse(['error' => 'id requis'], 400);
    }
    unset($body['id'], $body['created_at']);
    $body = encodeJsonFields($body, $table, $JSON_FIELDS);

    if (empty($body)) {
        jsonResponse(['error' => 'Aucun champ à mettre à jour'], 400);
    }

    $sets   = [];
    $values = [];
    foreach ($body as $col => $val) {
        $sets[]   = '`' . preg_replace('/[^a-zA-Z0-9_]/', '', $col) . '` = ?';
        $values[] = $val;
    }
    $values[] = $id;
    $types    = str_repeat('s', count($values));

    $sql  = 'UPDATE `' . $table . '` SET ' . implode(', ', $sets) . ' WHERE id = ?';
    $stmt = $db->prepare($sql);
    if (!$stmt) {
        jsonResponse(['error' => $db->error], 500);
    }
    $stmt->bind_param($types, ...$values);
    if (!$stmt->execute()) {
        jsonResponse(['error' => $stmt->error], 500);
    }
    $stmt->close();

    $sel = $db->prepare("SELECT * FROM `$table` WHERE id = ? LIMIT 1");
    $sel->bind_param('s', $id);
    $sel->execute();
    $res = $sel->get_result();
    $row = $res ? $res->fetch_assoc() : null;
    $sel->close();
    $db->close();
    jsonResponse($row ? decodeRow($row, $table, $JSON_FIELDS, $BOOL_FIELDS) : ['id' => $id]);
}

// ── DELETE ────────────────────────────────────────────────────────────────────
if ($method === 'DELETE') {
    $body = getBody();
    $id   = $body['id'] ?? $_GET['id'] ?? '';
    if (!$id) {
        jsonResponse(['error' => 'id requis'], 400);
    }

    $stmt = $db->prepare("DELETE FROM `$table` WHERE id = ?");
    if (!$stmt) {
        jsonResponse(['error' => $db->error], 500);
    }
    $stmt->bind_param('s', $id);
    if (!$stmt->execute()) {
        jsonResponse(['error' => $stmt->error], 500);
    }
    $stmt->close();
    $db->close();
    jsonResponse(['success' => true]);
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
exit;
