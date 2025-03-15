<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json'); // Ensure JSON response

if(!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit();
}

$user_id = $_SESSION['user_id'];
// stmt = statement
$stmt = $conn->prepare("SELECT username, headline, profile_picture FROM users_data WHERE user_id = ?");
$stmt->bind_param('i',$user_id);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows > 0) {
    $user_data = $result->fetch_assoc();
    echo json_encode($user_data, JSON_UNESCAPED_UNICODE); // Send data as json
} else {
    echo json_encode(['error' => "No user data found"]);
}

$stmt->close();
$conn->close();

?>