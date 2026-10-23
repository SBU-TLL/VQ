<?php
session_start();
// Get netID
clearstatcache();
$netID = $_SESSION['mail'] ?? $_SERVER['mail'];
if ($netID=="") $netID= "japalmeri";
// Make directory for that netID if it does not exist already
$dataPath="./data/" . $netID;
if(file_exists($dataPath))
{
$rawData=file_get_contents($dataPath);
}
else{
$rawData='{"watchData":[],"attempts":[]}';
}
//if (!file_exists($dataPath)) {
//    file_put_contents($dataPath, '{"watchData": [],"attempts": []}');
//}
// Get student data
$a = json_decode($rawData);
$a -> netID =  $_SESSION['mail'] ?? $_SERVER['mail'];
$a -> firstname = $_SESSION['givenName'] ?? $_SERVER['givenName'];
$a -> nickname = $_SESSION['nickname'] ?? $_SERVER['nickname'];
$a -> lastname = $_SESSION['sn'] ?? $_SERVER['sn'];
print json_encode($a);
?>
