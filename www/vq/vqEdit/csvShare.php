<?php
require("batchAddPermissions.php");
$key="1) Enter the IVQ link for the video you made. Please ensure that your recording has both audio and video";
$key="url";
$users=["darunibabu","wtang","pstdenis"];
$quizzes=[];
$rows = array_map('str_getcsv', file('ivq3.csv'));
$header = array_shift($rows);
$csv = array();
foreach ($rows as $row) {
  $csv[] = array_combine($header, $row);
}

foreach ($csv as $row){
if(str_contains($row[$key],"apps.tlt")){
list($url,$path) = preg_split("/\/vq\//",$row[$key]);

$path=rtrim($path, "/");
array_push($quizzes,"../$path");
}

} 
//print_r($quizzes);
inject($quizzes,$users);
