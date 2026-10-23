<?php
// Get netID
$netID = $_SERVER['cn'];
$firstname = $_SERVER['nickname'];
$lastname = $_SERVER['sn'];
$email = $_SERVER['mail'];

// Make directory for that netID if it does not exist already
if (!file_exists('../users/' . $netID)) {
    mkdir('../users/' . $netID, 0777, true);
}
// Now look in that directory and get all of the subdirectories (each corresponds to one quiz)
$directories = glob('../users/' . $netID . "/*" , GLOB_ONLYDIR);
$userData = array();
$allQuizData = array();
$ownedDirs = array(); //
foreach($directories as $dir) {
    $dataDir = $dir . "/data";
    $data = glob($dataDir . "/*");
    $watchData = null;
    $answerData = null;
    foreach($data as $dataFile) {
        print(file_get_contents($dataFile));
    }
}
?>
