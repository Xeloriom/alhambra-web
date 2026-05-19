<?php
require_once __DIR__ . '/../_db.php';

// No-cache headers
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
header('Content-Type: image/gif');

$id = isset($_GET['id']) ? trim($_GET['id']) : '';

if ($id && preg_match('/^[0-9a-f\-]{36}$/i', $id)) {
    try {
        $db = getDb();
        // Create table if missing (first request after deploy)
        $db->query("CREATE TABLE IF NOT EXISTS sent_emails (
            id VARCHAR(36) NOT NULL PRIMARY KEY,
            to_email TEXT,
            to_name TEXT,
            from_name TEXT,
            subject TEXT,
            message TEXT,
            is_opened TINYINT(1) DEFAULT 0,
            opened_at DATETIME,
            sent_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");
        $stmt = $db->prepare("UPDATE sent_emails SET is_opened=1, opened_at=NOW() WHERE id=? AND is_opened=0");
        if ($stmt) {
            $stmt->bind_param('s', $id);
            $stmt->execute();
            $stmt->close();
        }
        $db->close();
    } catch (Exception $e) {
        // Non-critical — still return pixel
    }
}

// 1×1 transparent GIF (43 bytes)
echo base64_decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
