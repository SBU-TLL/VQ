<?php
require('injectUserPath.php');
require('file_get_json.php');
header("Content-Type: application/json");
header("Connection: close");
ob_start();
$netID = $_SERVER['cn'];
$firstname = $_SERVER['nickname'];
$lastname = $_SERVER['sn'];
$email = $_SERVER['mail'];
$cacheFile="../users/$netID/login.json";
$cacheExists=file_exists($cacheFile);
if ($cacheExists) {
$cacheData= file_get_contents($cacheFile);
 endFlush($cacheData);
}
$outData=login($netID,$firstname,$lastname,$email);
if(!$cacheExists){
	 endFlush($outData);
}
file_put_contents($cacheFile,$outData);
function endFlush($printData){
	if (__FILE__ == $_SERVER['DOCUMENT_ROOT'].$_SERVER['PHP_SELF']){
	print $printData;
}	
ob_end_flush();
flush();
$size = ob_get_length();
#header("Content-Length: $size");
}







// add quiz data
function addQuizData($dir, $isOwner) {
	$quizData = new stdClass();
	$jsonPath = $dir . "/json/quiz.json";
	$json = file_get_json($jsonPath);
	if ($json == json_decode("{}")) {
		return json_decode("{}");
	}
	else {
		$quizData->title = $json->title;
		$dataPath = $dir . "/data";
		$dataFiles = glob($dataPath . "/*");
		$quizUserData = array();
		$totalsDir = $dir . "/totals.json";
		if (file_exists($totalsDir)) {
			$totals = json_decode(file_get_contents($totalsDir));
			$quizData -> totals = $totals;
		}
		$quizData -> playerData = $quizUserData;
		$quizData -> relativePath = $dir;
		$quizData -> questionData = $json;
		$quizData -> isOwner = $isOwner;
		$dirSplit = explode("/", $dir);
		$owner = $dirSplit[1]; 	// user Bug
		$quizData -> owner = $owner;
		return $quizData;
	}
}


function login($netID,$firstname="test",$lastname="user",$email="testing@test.com"){
// Get netID

// Make directory for that netID if it does not exist already
if (!file_exists('../users/' . $netID)) {
	mkdir('../users/' . $netID, 0777, true);
}
// Now look in that directory and get all of the subdirectories (each corresponds to one quiz)
$saveDir = getcwd();
chdir ( '../users/' .$netID );
$directories = glob(  '../'.$netID . "/*" , GLOB_ONLYDIR);
$userData = array();
$allQuizData = array();
$ownedDirs = array(); //
foreach($directories as $dir) {

	$dirQuizData = addQuizData($dir, true);
	if ($dirQuizData == json_decode("{}")) {
		// do nothing
	}
	else {
		array_push($allQuizData, $dirQuizData);
		array_push($ownedDirs, $dir);
	}
}

// Look in ALL directories, and add quiz data if the user has permissions for it
$allPermissions = glob('../*/*/json/permissions.json' , GLOB_BRACE | GLOB_MARK );
foreach($allPermissions as $file) {
	if (!(strpos($file, 'vqEdit') !== false) && !(strpos($file, $netID) !== false)) {
		// Check permissions
		if (file_exists($file)) {
			$permissions = file_get_json($file);
			list($dir,$rest)=explode('/json/',$file);
			if (isset($permissions -> canAccessData))	//	This check is intended to fix "Notice:  Undefined property: stdClass::$canAccessData in /home1/tltsecure/apache2/htdocs/vq/vqEdit/login.php on line 81"	-Tony
				if (is_array($permissions -> canAccessData) && in_array($netID, $permissions -> canAccessData)) {
					
					array_push($allQuizData, addQuizData($dir, false));
					array_push($ownedDirs, $dir);
				}
			else{
			//file_put_contents($permissionsPath,"{}");
			}
		}
	}}


chdir ( $saveDir  );
$data = new stdClass();
$data -> netID = $netID;
$data -> firstname = $firstname;
$data -> lastname = $lastname;
$data -> email = $email;
$data -> dirs = $ownedDirs;
$data -> quizData = $allQuizData;
$actual_link_arr = explode("vqEdit", "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
$actual_link = $actual_link_arr[0];
$actual_link_https = str_replace("http://", "https://", $actual_link);
$data -> serverPath = $actual_link_https;
$data -> accessDate = date('D, M d Y H:i:s');
// Get folder data
$folders = array();
$folderPath = '../users/' . $netID . '/folders.json';
$foldersText2="[]";
if (file_exists($folderPath)) {



$folderData = json_decode(file_get_contents($folderPath));

$folders = $folderData -> folders;
$foldersText2=json_encode( $folderData -> folders);



}
$data -> folders =json_decode($foldersText2);
return json_encode($data);
}
?>
