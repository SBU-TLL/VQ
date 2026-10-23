<?php 

foreach (['ndex.html_off','.htaccess','index.php'] as $filename){
print("<br>");
if (file_exists($filename)) {
    echo "The file $filename exists";
} else {
    echo "The file $filename does not exist";
}
}
?>
