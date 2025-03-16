<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json'); // Ensure JSON response

// ✅ Ensure user is authenticated
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$about = isset($_POST['editAbout']) ? trim($_POST['editAbout']) : "";

// ✅ Validate input
if ($about === "") {
    echo json_encode(["success" => false, "error" => "About section cannot be empty."]);
    exit;
}
if (strlen($about) > 2000) {
    echo json_encode(["success" => false, "error" => "Maximum 2000 characters allowed."]);
    exit;
}

// ✅ Use prepared statements to prevent SQL injection
$stmt = $conn->prepare("UPDATE users_data SET about = ? WHERE user_id = ?");
$stmt->bind_param("si", $about, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    error_log("Database Update Error: " . $conn->error);
    echo json_encode(["success" => false, "error" => "Database update failed."]);
}

$stmt->close();
$conn->close();
?>
