<?php
// Get netID
$netID = $_SERVER['cn'];
if ($netID=="") $netID= "japalmeri";
// Make directory for that netID if it does not exist already
if (!file_exists("data/" . $netID)) {
    file_put_contents("data/" . $netID, '{"watchData": [],"attempts": []}');
}
// Get student data
$a = json_decode(file_get_contents("data/" . $netID));
$a -> netID = $_SERVER['cn'];
$a -> firstname = $_SERVER['givenName'];
$a -> nickname = $_SERVER['nickname'];
$a -> lastname = $_SERVER['sn'];
print json_encode($a);
?>