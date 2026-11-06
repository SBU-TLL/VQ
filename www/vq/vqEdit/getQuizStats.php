<?php
if (isset($_SESSION) && array_key_exists('cn',$_SESSION)){
$netID=$_SESSION['cn'];
}
else{
    $netID=$_SERVER['cn'];   
}
require("injectUserPath.php");
require("file_get_json.php");
$quizPath = injectUserPathN($_REQUEST['quizPath'],4);


// Get path of quiz that is requested
if (__FILE__ == $_SERVER['DOCUMENT_ROOT'].$_SERVER['PHP_SELF']){
print (json_encode(getStats($quizPath,$netID)));
}
function getStats($quizPath,$netID)
{
if(!$quizPath){
$quizPath=$_REQUEST['quizPath'];
}
$dir = injectUserPath($quizPath);
$permissions=file_get_json("$dir/json/permissions.json");
$canAccess=False;
$permissionsExist=isset($permissions->canAccessData);
if($permissionsExist){
$canAccess=in_array($netID,$permissions->canAccessData) ;
}
$owner= str_contains($dir,$netID);
//print($netID);
//print($dir);
//print($permissionsExist);
//print($canAccess);
//exit();
if(!$owner && (!$permissionsExist || !$canAccess)){
exit();
}


///print_r($permissions);
//exit();

$dataPath = $dir . "/data";
$dataFiles = glob($dataPath . "/*");
$quizUserData = array();
// For each file, add it to the array
foreach($dataFiles as $file) {
    $fileData = file_get_json($file);    
    $pathSplit = explode("/", $file);
    $name = end($pathSplit);
    $fileData->netID = $name;
    array_push($quizUserData, $fileData);
}

$questionPath = $dir . "/json/quiz.json";
$questionData = file_get_contents($questionPath);

$data = new stdClass();
$data -> viewerData = $quizUserData;
$data -> quizData = json_decode($questionData);
    
//$jsonStr = json_encode($data);
return $data;
}
?>
