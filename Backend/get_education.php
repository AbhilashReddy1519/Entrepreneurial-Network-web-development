<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit();
}

$user_id = $_SESSION['user_id'];

// SQL Query
$sql = "SELECT id, institution, degree, field_of_study, grade, start_year, end_year 
        FROM education 
        WHERE user_id = ? 
        ORDER BY end_year DESC";

// Debug: Check if SQL query is valid
if (!$stmt = $conn->prepare($sql)) {
    die(json_encode(["error" => "SQL prepare failed: " . $conn->error]));
}

// Bind parameter
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$education = [];
while ($row = $result->fetch_assoc()) {
    $education[] = $row;
}

echo json_encode($education);
$stmt->close();
$conn->close();
?>
