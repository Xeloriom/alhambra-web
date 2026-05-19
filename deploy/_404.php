<?php
http_response_code(404);
$file = __DIR__ . '/404/index.html';
if (file_exists($file)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($file);
} else {
    echo '<!DOCTYPE html><html><body><h1>404 — Page introuvable</h1></body></html>';
}
exit;
