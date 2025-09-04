<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$db_host = 'localhost';
$db_name = 'u200136222_petzybites';
$db_user = 'u200136222_PetzyBites';
$db_pass = '10102020Aa@';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM pet_submissions ORDER BY submission_date DESC");
    $submissions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($submissions);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$pdo = null;
?>