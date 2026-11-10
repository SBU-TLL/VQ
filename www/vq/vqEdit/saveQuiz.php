<?php
require("injectUserPath.php");
$path = $_POST['path'];
$jsonData = $_POST['jsonData'];
$data=json_decode($jsonData);
$data->videoPath =str_replace("/users","",$data->videoPath);
$jsonData= json_encode($data);

print($path . " " . $jsonData);
file_put_contents(injectUserPathN($path,4), $jsonData);
?>
