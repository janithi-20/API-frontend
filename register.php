<?php
include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing username or password"]);
    exit;
}

$username = trim($data['username']);
$password = $data['password'];

if (strlen($username) < 3) {
    echo json_encode(["status" => "error", "message" => "Username must be at least 3 characters"]);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(["status" => "error", "message" => "Password must be at least 6 characters"]);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_DEFAULT);
$username = mysqli_real_escape_string($conn, $username);

$query = "INSERT INTO users (username, password) VALUES ('$username', '$passwordHash')";

if (mysqli_query($conn, $query)) {
    echo json_encode(["status" => "success"]);
} else {
    $error = mysqli_error($conn);
    if (strpos($error, "Duplicate entry") !== false) {
        echo json_encode(["status" => "error", "message" => "Username already exists"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Registration failed"]);
    }
}
?>