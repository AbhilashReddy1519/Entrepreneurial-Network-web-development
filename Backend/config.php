<?php 
$host = 'localhost';
$dbname = 'entrepreneurial_network';
$password = '';
$username = 'root';

$conn = new mysqli($host,$username,$password,$dbname);

//conn = connection
//stmt = statement  in all php files

if($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
} //else {
//     echo "Database connection success";
// }

?>