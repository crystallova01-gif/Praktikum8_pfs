<?php
require_once 'db.php';

$id = isset($_POST['id']) ? intval($_POST['id']) : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID tidak valid"]);
    exit;
}

$stmt = mysqli_prepare($conn, "DELETE FROM mahasiswa WHERE id = ?");
mysqli_stmt_bind_param($stmt, "i", $id);
$ok = mysqli_stmt_execute($stmt);

if ($ok) {
    echo json_encode(["success" => true, "message" => "Data dihapus"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Gagal menghapus"]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
