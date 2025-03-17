<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated"]);
    exit();
}

if (!isset($_POST['id'])) {
    echo json_encode(["success" => false, "error" => "No education ID provided"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$education_id = intval($_POST['id']);
$institution = $_POST['editInstitution'] ?? '';
$degree = $_POST['editDegree'] ?? '';
$field_of_study = $_POST['editFieldOfStudy'] ?? '';
$grade = $_POST['editGrade'] ?? '';
$start_year = $_POST['editStartYear'] ?? '';
$end_year = $_POST['editEndYear'] ?? '';

// Validate required fields
if (empty($institution) || empty($degree) || empty($field_of_study) || empty($start_year) || empty($end_year)) {
    echo json_encode(["success" => false, "error" => "All fields are required"]);
    exit();
}

// Update education record
$sql = "UPDATE education 
        SET institution = ?, degree = ?, field_of_study = ?, grade = ?, start_year = ?, end_year = ? 
        WHERE id = ? AND user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssii", $institution, $degree, $field_of_study, $grade, $start_year, $end_year, $education_id, $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to update education"]);
}

$stmt->close();
$conn->close();
?>
