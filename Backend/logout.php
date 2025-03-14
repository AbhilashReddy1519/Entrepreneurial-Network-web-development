<?php
session_start();
session_unset();  // Unset all session variables
session_destroy(); // Destroy the session

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Expires: Sat, 01 Jan 2000 00:00:00 GMT");
header("Pragma: no-cache");


header("Location: ../src/index.html"); // Redirect to login page
exit();
?>
