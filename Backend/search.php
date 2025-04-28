<?php
session_start();
require_once './config.php';

if (isset($_GET['query'])) {
    $searchQuery = $_GET['query'];
    
    // Prepare search query with wildcards
    $searchTerm = "%$searchQuery%";
    
    try {
        $stmt = $pdo->prepare("
            SELECT id, username, profile_picture, headline 
            FROM users 
            WHERE username LIKE :search 
            OR headline LIKE :search 
            LIMIT 10
        ");
        
        $stmt->execute(['search' => $searchTerm]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format results for response
        $formattedResults = array_map(function($user) {
            return [
                'id' => $user['id'],
                'username' => $user['username'],
                'profile_picture' => $user['profile_picture'] ?? '../../images/profile.png',
                'headline' => $user['headline'] ?? 'FounderForge Member'
            ];
        }, $results);
        
        header('Content-Type: application/json');
        echo json_encode(['status' => 'success', 'users' => $formattedResults]);
        
    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Search failed']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'No search query provided']);
}
?>