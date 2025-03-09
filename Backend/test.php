<?php
require_once  '../Backend/config.php';

if ($conn) {
    echo "Database connected successfully!";
} else {
    echo "Database connection failed.";
}

?>