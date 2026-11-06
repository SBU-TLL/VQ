<?
#	Date:		Winter 2018
#	Authors:	Paul St. Denis
#				Anthony John Ripa

$addr=$_SERVER["HTTP_HOST"];
$uri= $_SERVER["REQUEST_URI"];
if (isset($_SERVER['HTTPS']) && !array_key_exists("cn",$_SERVER) && !array_key_exists("guest",$_GET)){

header("Location: https://$addr/Shibboleth.sso/Login?target=https://$addr$uri");
}




?>
