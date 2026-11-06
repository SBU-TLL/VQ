<?php
$netID = $_SERVER['cn'];
$data = $_POST['userData'];
print_r($data);
print(file_put_contents("data/" . $netID, $data));
?>
