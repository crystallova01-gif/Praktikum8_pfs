<?php
require_once 'db.php';

$id   = isset($_POST['id']) ? intval($_POST['id']) : 0;
$nama = isset($_POST['nama']) ? trim($_POST['nama']) : "";
$nim  = isset($_POST['nim']) ? trim($_POST['nim']) : "";

if ($id <= 0 || $nama === "" || $nim === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Data tidak valid"]);
    exit;
}

$stmt = mysqli_prepare($conn, "UPDATE mahasiswa SET nama = ?, nim = ? WHERE id = ?");
mysqli_stmt_bind_param($stmt, "ssi", $nama, $nim, $id);
$ok = mysqli_stmt_execute($stmt);

if ($ok) {
    echo json_encode(["success" => true, "message" => "Data diperbarui"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Gagal memperbarui"]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
