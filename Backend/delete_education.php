<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated"]);
    exit();
}

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "error" => "No education ID provided"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$education_id = intval($_GET['id']);

// Delete the education record
$sql = "DELETE FROM education WHERE id = ? AND user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $education_id, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to delete education"]);
}

$stmt->close();
$conn->close();
?>
