<?php
require("injectUserPath.php");
$path = $_REQUEST['path'];
$totals = $_REQUEST['totals'];
file_put_contents(injectUserPathN($path,2) . "/totals.json", $totals);
?>
