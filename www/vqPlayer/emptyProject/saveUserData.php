<?php
//ini_set('display_errors', 1);
//ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
session_start();
//ignore_user_abort(true);
function watchTime($accumulator, $item)
{
if($item!=0)
{return $accumulator+1;}
else
{ return $accumulator;}
};

$netID = $_SESSION['mail'] ?? $_SERVER['mail'] ?? "error_".time();
if(array_key_exists("reset", $_GET)){
$path = array_reverse(preg_split("/\//",getcwd()));
$dirName= $path[1];
$permissions = json_decode(file_get_contents("json/permissions.json"));
$canReset= in_array($netID,$permissions->canAccessData) || $netID==$dirName || $netID==$permissions->editor;
if($canReset)
{
$userFile="data/${_GET['user']}";
if(file_exists($userFile))
{
unlink($userFile);
print("reset score for user ${_GET['user']}");
}
else(print "user ${_GET['user']} not found!");
}
else{
print("You don't have permission to reset user ${_GET['user']}");
}
exit();
}
if(!file_exists(".htaccess")){
$netID="public";
}

#print_r($netID);
print_r($netID);
if(!key_exists("data",$_POST) && key_exists("userData",$_POST)  )
{
$data = $_POST['userData'];
$json=json_decode($data);
$clientWatched = array_reduce($json->watchData,"watchTime");
if(file_exists("data/" . $netID)){
$serverJson= json_decode(file_get_contents("data/" . $netID));
$serverWatched =  array_reduce($serverJson->watchData,"watchTime");
}
else {
$serverWatched=0;
}
if($clientWatched >= $serverWatched){
file_put_contents("data/" . $netID, $data) or die("Unable to write file!");
}
else {
print ("error $clientWatched $serverWatched");
}
}
/*else{
$startTime=formatTime($_POST['data']['startTime']);


$text=ltrim($_POST['data']['text']);
if($startTime!=""){
$file="media/video.vtt";
$reg="($startTime.*$[\r\n]*)(.*)";
$vtt = file_get_contents($file);
$newVtt=preg_replace("/$reg/m","$1${text}", $vtt);
file_put_contents($file,$newVtt);
//print($reg); 
file_put_contents("history.txt","$netID $text\n",FILE_APPEND);
}
}
*/
function formatTime($t) {

  return sprintf('%02d:%02d:%02d\.%03d', ($t/3600),($t/60%60), $t%60,($t-floor($t))*1000);
}


?>
