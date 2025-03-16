<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

// Ensure user is authenticated
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated."]);
    exit;
}

$user_id = $_SESSION['user_id'];

// ✅ Check if form fields exist, otherwise set them to empty strings
$username = isset($_POST['editUsername']) ? $_POST['editUsername'] : "";
$college = isset($_POST['editCollege']) ? $_POST['editCollege'] : "";
$headline = isset($_POST['editHeadline']) ? $_POST['editHeadline'] : "";
$city = isset($_POST['editCity']) ? $_POST['editCity'] : "";
$location = isset($_POST['editLocation']) ? $_POST['editLocation'] : "";

// Log received POST data (for debugging)
error_log("Received POST Data: " . json_encode($_POST));

// Use prepared statements to prevent SQL injection
$stmt = $conn->prepare("UPDATE users_data SET username = ?, college = ?, headline = ?, city = ?, location = ? WHERE user_id = ?");
$stmt->bind_param("sssssi", $username, $college, $headline, $city, $location, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    error_log("Database Update Error: " . $conn->error); // Log error
    echo json_encode(["success" => false, "error" => "Database update failed."]);
}

$stmt->close();
$conn->close();
?>
