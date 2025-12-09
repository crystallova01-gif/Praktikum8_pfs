<?php
header("Content-Type: application/json; charset=UTF-8");

$server   = "localhost";
$user     = "root";
$password = "";
$database = "praktikum_fullstack";

$conn = mysqli_connect($server, $user, $password, $database);

if (!$conn) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Koneksi gagal: " . mysqli_connect_error()
    ]);
    exit;
}

mysqli_set_charset($conn, "utf8");
?>
