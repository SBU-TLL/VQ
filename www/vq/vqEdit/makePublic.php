<?php
$path = $_REQUEST['path'];
$path= preg_replace ('/\.\.\//','../users/',$path);
$isPublic = $_REQUEST['isPublic'];
if ($isPublic == "true") {
   rename("$path/.htaccess", "$path/.htaccess_disabled");
}
else {
   rename("$path/.htaccess_disabled", "$path/.htaccess");
}
?>
