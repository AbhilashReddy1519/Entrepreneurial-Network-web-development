<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit();
}

$user_id = $_SESSION['user_id'];

$sql = "SELECT id, institution, degree, field_of_study, grade, start_year, end_year 
        FROM education 
        WHERE user_id = ? 
        ORDER BY end_year DESC"; // Newest first

$stmt = $conn->prepare($sql);
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
