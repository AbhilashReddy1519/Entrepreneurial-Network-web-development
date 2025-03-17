<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not authenticated"]);
    exit();
}

if (!isset($_GET['id'])) {
    echo json_encode(["error" => "No education ID provided"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$education_id = intval($_GET['id']);

$sql = "SELECT id, institution, degree, field_of_study, grade, start_year, end_year 
        FROM education 
        WHERE id = ? AND user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $education_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(["error" => "Education record not found"]);
}

$stmt->close();
$conn->close();
?>
