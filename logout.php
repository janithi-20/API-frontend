<?php
include "auth.php"; 

mysqli_query($conn, "UPDATE users SET token=NULL WHERE id=".$user['id']);

echo json_encode([
    "status" => "success",
    "message" => "Logged out successfully"
]);
?>