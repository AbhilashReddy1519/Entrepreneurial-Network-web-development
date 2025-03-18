<?php
session_start();
require_once '../Backend/config.php'; // Include database connection

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_SESSION["user_id"])) {
        echo json_encode(["success" => false, "error" => "Unauthorized access. Please log in."]);
        exit;
    }

    $user_id = $_SESSION["user_id"];
    $skill_name = trim($_POST["skill_name"] ?? '');

    if (empty($skill_name)) {
        echo json_encode(["success" => false, "error" => "Skill name is required."]);
        exit;
    }

    try {
        // $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

        if ($conn->connect_error) {
            throw new Exception("Database connection failed: " . $conn->connect_error);
        }

        // Check if the skill exists for the user
        $checkStmt = $conn->prepare("SELECT id FROM skills WHERE user_id = ? AND skill_name = ?");
        $checkStmt->bind_param("is", $user_id, $skill_name);
        $checkStmt->execute();
        $checkStmt->store_result();

        if ($checkStmt->num_rows === 0) {
            echo json_encode(["success" => false, "error" => "Skill not found."]);
            exit;
        }

        $checkStmt->close();

        // Delete skill
        $deleteStmt = $conn->prepare("DELETE FROM skills WHERE user_id = ? AND skill_name = ?");
        $deleteStmt->bind_param("is", $user_id, $skill_name);

        if ($deleteStmt->execute()) {
            echo json_encode(["success" => true, "message" => "Skill deleted successfully."]);
        } else {
            throw new Exception("Failed to delete skill.");
        }

        $deleteStmt->close();
        $conn->close();
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
}
?>
