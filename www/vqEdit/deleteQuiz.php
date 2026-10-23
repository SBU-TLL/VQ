<?php
// Get netID and the ID of the quiz to delete

$netID = $_SERVER['cn'];
$quizID = $_REQUEST['quizID'];
$uniqueID = uniqid();
$userPath="../users/$netID";
$srcPath = "$userPath/$quizID";
$folderQuizPath="../$netID/$quizID";
$destPath = "$userPath/.trash";
$folderFile="$userPath/folders.json";
$trashFile="${quizID}_${uniqueID}";

//print  $folderFile; If the current user does not have a .trash directory, make them one
if (!file_exists($destPath)) {
    mkdir($destPath, 0777, true);
}
// Move the directory to the trash
`mv $srcPath $destPath/$trashFile`;

if (file_exists($folderFile)) {

    $foldersInfo= json_decode(file_get_contents($folderFile));
    foreach ($foldersInfo->folders as $folder) {
        foreach($folder->quizzes as $quiz) {

            if($quiz==$folderQuizPath) {
                  print_r($folder->quizzes);
            $folder->quizzes=array_diff($folder->quizzes,array($quiz));
            if($folder->quizzes==null){
              $folder->quizzes=array();
            }

          }
        }
    }
    $outFile=stripslashes(json_encode($foldersInfo));

    file_put_contents($folderFile,$outFile);
}
