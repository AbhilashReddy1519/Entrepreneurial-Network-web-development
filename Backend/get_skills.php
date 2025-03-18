<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated."]);
    exit;
}

$user_id = $_SESSION['user_id'];

$result = $conn->query("SELECT skill_name FROM skills WHERE user_id = $user_id");

$skills = [];
while ($row = $result->fetch_assoc()) {
    $skills[] = $row['skill_name'];
}

echo json_encode(["success" => true, "skills" => $skills]);
?>
