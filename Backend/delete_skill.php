<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated."]);
    exit;
}

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "error" => "Skill ID is required."]);
    exit;
}

$skill_id = intval($_GET['id']);
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("DELETE FROM skills WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $skill_id, $user_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to delete skill."]);
}

$stmt->close();
?>
