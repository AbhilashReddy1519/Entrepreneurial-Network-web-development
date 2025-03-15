<?php
session_start();
require_once '../Backend/config.php'; // Database connection

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    // Check if the user already exists
    $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $check_stmt->store_result();

    if ($check_stmt->num_rows > 0) {
        echo "<script>
                alert('User already exists! Redirecting to login page.');
                window.location.href = '../src/mainsite/login.html';
              </script>";
        exit();
    }
    $check_stmt->close();

    // Insert into `users` table
    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    if (!$stmt) {
        die("Error preparing users query: " . $conn->error);
    }
    $stmt->bind_param("sss", $name, $email, $password);

    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        $_SESSION['user_id'] = $user_id;

        // Insert into `users_data`
        $stmt = $conn->prepare("INSERT INTO users_data (user_id, username, college, headline, location, city, profile_picture, back_cover_picture, about, created_at) 
                                VALUES (?, ?, '', '', '', '', '', '', '', NOW())");
        if (!$stmt) {
            die("Error preparing users_data query: " . $conn->error);
        }
        $stmt->bind_param("is", $user_id, $name);
        $stmt->execute();

        // Insert into `open_to_work`
        $stmt = $conn->prepare("INSERT INTO open_to_work (user_id, profession) VALUES (?, 'Not Set')");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // Insert into `skills`
        $stmt = $conn->prepare("INSERT INTO skills (user_id, skill_name) VALUES (?, 'Not Set')");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // Insert into `education`
        $stmt = $conn->prepare("INSERT INTO education (user_id, institution, degree, field_of_study, start_year, end_year) 
                                VALUES (?, '', '', '', NULL, NULL)");
        if (!$stmt) {
            die("Error preparing education query: " . $conn->error);
        }
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // Insert into `posts`
        $stmt = $conn->prepare("INSERT INTO posts (user_id, content, image, created_at) VALUES (?, 'Welcome to Entrepreneurial Network!', '', NOW())");
        if (!$stmt) {
            die("Error preparing posts query: " . $conn->error);
        }
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        // Redirect after successful signup
        header("Location: ../src/mainsite/main.html");
        exit();
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close statements & connection
    $stmt->close();
    $conn->close();
}
?>
