<?php
$to = "tltmedialab@connect.stonybrook.edu";
$subject = $_REQUEST['subject'];
$message = $_REQUEST['message'];
mail($to, $subject, $message);
?>
