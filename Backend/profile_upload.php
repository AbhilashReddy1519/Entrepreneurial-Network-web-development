<?php
session_start();
require_once '../Backend/config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated."]);
    exit;
}

$user_id = $_SESSION['user_id'];
$uploadDir = "../../uploads/";
$fileName = time() . "_" . basename($_FILES['profile']['name']);
$uploadFile = $uploadDir . $fileName;

// Ensure uploads directory exists
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Validate file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
$imageSize = getimagesize($_FILES['profile']['tmp_name']);
if (!$imageSize || !in_array($_FILES['profile']['type'], $allowedTypes)) {
    echo json_encode(["success" => false, "error" => "Invalid file type."]);
    exit;
}

// Move file
if (move_uploaded_file($_FILES['profile']['tmp_name'], $uploadFile)) {
    $fileUrl = "/uploads/" . $fileName; // Correct file path

    // Store in DB using a prepared statement
    $stmt = $conn->prepare("UPDATE users_data SET profile_picture = ? WHERE user_id = ?");
    $stmt->bind_param("si", $fileUrl, $user_id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "filepath" => $fileUrl]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to update database."]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "error" => "File upload failed."]);
}
?>
