<?php 
$host = 'localhost';
$dbname = 'entrepreneurial_network';
$password = '';
$username = 'root';

$conn = new mysqli($host,$username,$password,$dbname);

if($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

?>