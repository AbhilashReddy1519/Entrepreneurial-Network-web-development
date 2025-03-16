<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$professions = json_decode($_POST['professions'], true);

if (count($professions) > 5) {
    echo json_encode(["success" => false, "error" => "You can select up to 5 professions only."]);
    exit;
}

$conn->query("DELETE FROM open_to_work WHERE user_id = $user_id");

$stmt = $conn->prepare("INSERT INTO open_to_work (user_id, profession) VALUES (?, ?)");
foreach ($professions as $profession) {
    $stmt->bind_param("is", $user_id, $profession);
    $stmt->execute();
}
$stmt->close();

echo json_encode(["success" => true]);
?>
