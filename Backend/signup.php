<?php
require_once '../Backend/config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $email = mysqli_real_escape_string($conn, $_POST['email']);
    $password = $_POST['password'];

    if (empty($password)) {
        die("Error: Password field is empty!");
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Hash password

    $query = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$hashed_password')";

    if ($conn->query($query) === TRUE) {
        header("Location: ../src/login.html");
        exit();
    } else {
        echo "Error: " . $conn->error;
    }
}

$conn->close();
?>
