<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated."]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Fetch user professions
$stmt = $conn->prepare("SELECT profession FROM open_to_work WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$professions = [];
while ($row = $result->fetch_assoc()) {
    $professions[] = $row['profession'];
}

$stmt->close();
$conn->close();

echo json_encode(["success" => true, "professions" => $professions]);
?>
