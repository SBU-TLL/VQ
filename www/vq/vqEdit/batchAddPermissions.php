<?php
require('injectUserPath.php');

if (__FILE__ == $_SERVER['DOCUMENT_ROOT'].$_SERVER['PHP_SELF']){
$quizzes = json_decode($_REQUEST['quizzes']);
$users = json_decode($_REQUEST['users']);
inject($quizzes,$users);
}

function inject($quizzes,$users){
foreach($quizzes as $quiz) {

  $quizPermissions=new stdClass();
    $quizPermissionsPath = injectUserPathN($quiz . "/json/permissions.json",4);
     print ("$quizPermissionsPath\n");
//    unlink($quizPermissionsPath);
    if (file_exists($quizPermissionsPath)) {

        $quizPermissions = json_decode(file_get_contents($quizPermissionsPath));
     }
    
    
    if (!property_exists($quizPermissions,"canAccessData"))
{
 $quizPermissions = json_decode('{"canAccessData":[]}');
} 
    foreach ($users as $user) {
        array_push($quizPermissions -> canAccessData, $user);
    }
$quizPermissions -> canAccessData = array_unique($quizPermissions -> canAccessData);  
//  $quizPermissions -> canAccessData=array_unique($quizPermissions -> canAccessData); 
    //print($quizPermissionsPath);
    file_put_contents($quizPermissionsPath, json_encode($quizPermissions));
}
}
?>
