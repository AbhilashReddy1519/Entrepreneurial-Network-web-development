<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$skills = json_decode($_POST['skills'], true);

if (count($skills) > 20) {
    echo json_encode(["success" => false, "error" => "You can select up to 20 skills only."]);
    exit;
}

// Clear previous skills
// $conn->query("DELETE FROM skills WHERE user_id = $user_id");

$stmt = $conn->prepare("INSERT INTO skills (user_id, skill_name) VALUES (?, ?)");
foreach ($skills as $skill) {
    $stmt->bind_param("is", $user_id, $skill);
    $stmt->execute();
}
$stmt->close();

echo json_encode(["success" => true]);
?>
