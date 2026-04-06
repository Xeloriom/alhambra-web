<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$json_file = 'bookings.json';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Security: In a real app, you'd want to protect the GET and DELETE methods.
// For now, let's keep it simple as requested.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($data) {
        $bookings = [];
        if (file_exists($json_file)) {
            $bookings = json_decode(file_get_contents($json_file), true) ?: [];
        }

        // Add ID and timestamp
        $data['id'] = time() . rand(100, 999);
        $data['date'] = date('c'); // ISO 8601 date

        array_unshift($bookings, $data); // Add to the beginning of the list

        if (file_put_contents($json_file, json_encode($bookings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
            echo json_encode(['success' => true, 'booking' => $data]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Could not save data']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($json_file)) {
        echo file_get_contents($json_file);
    } else {
        echo json_encode([]); // Return empty list if no bookings yet
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if ($id && file_exists($json_file)) {
        $bookings = json_decode(file_get_contents($json_file), true) ?: [];
        $bookings = array_values(array_filter($bookings, function($b) use ($id) {
            return $b['id'] != $id;
        }));

        if (file_put_contents($json_file, json_encode($bookings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Could not delete']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'ID missing or file not found']);
    }
}
?>
