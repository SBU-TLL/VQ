<?php
require("injectUserPath.php");
$netID = $_SERVER['cn'];
$data = $_REQUEST['data'];
$path = "../users/" . $netID . "/folders.json";
file_put_contents(injectUserPath($path), $data);
?>
