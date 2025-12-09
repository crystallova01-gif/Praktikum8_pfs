<?php
require_once 'db.php';

$nama = isset($_POST['nama']) ? trim($_POST['nama']) : "";
$nim  = isset($_POST['nim']) ? trim($_POST['nim']) : "";

if ($nama === "" || $nim === "") {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Nama dan NIM wajib diisi"]);
    exit;
}

$stmt = mysqli_prepare($conn, "INSERT INTO mahasiswa (nama, nim) VALUES (?, ?)");
mysqli_stmt_bind_param($stmt, "ss", $nama, $nim);
$ok = mysqli_stmt_execute($stmt);

if ($ok) {
    echo json_encode([
        "success" => true,
        "message" => "Data disimpan",
        "id" => mysqli_insert_id($conn)
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Gagal menyimpan"]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
