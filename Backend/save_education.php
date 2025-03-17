<?php
session_start();
require_once '../Backend/config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "error" => "User not authenticated"]);
    exit();
}

// Debugging: Print all received POST data
file_put_contents("debug.txt", print_r($_POST, true)); // This will log data into debug.txt

$institution = $_POST['institution'] ?? '';
$degree = $_POST['degree'] ?? '';
$field_of_study = $_POST['fieldOfStudy'] ?? '';
$grade = $_POST['grade'] ?? '';
$start_year = $_POST['startYear'] ?? '';
$end_year = $_POST['endYear'] ?? '';

// Validate required fields
if (empty($institution) || empty($degree) || empty($field_of_study) || empty($start_year) || empty($end_year)) {
    echo json_encode(["success" => false, "error" => "All fields are required"]);
    exit();
}

// Ensure only the latest education remains
$conn->query("DELETE FROM education WHERE user_id = {$_SESSION['user_id']} AND (start_year IS NULL OR start_year = '')");

// Insert new education record
$sql = "INSERT INTO education (user_id, institution, degree, field_of_study, grade, start_year, end_year) 
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("issssss", $_SESSION['user_id'], $institution, $degree, $field_of_study, $grade, $start_year, $end_year);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to save education"]);
}

$stmt->close();
$conn->close();
?>
