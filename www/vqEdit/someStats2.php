<?php
header('Content-disposition: attachment; filename='.date('m-d-Y-h:i:s-a', time()).'.csv');
header('Content-type: text/csv');
$quizDataHeaders=['videoPath', 'questions'];
$viewerDataHeaders=['watchData' , 'netID' ];
$statsNetID="wtang";
//print("["); //hack to avoid high memory usage
//ob_start();
$allStats=[];
require("./login.php");
require("./getQuizStats.php");
//ob_end_clean();
$data=json_decode(login($statsNetID));
#print_r($data->dirs);
$f = fopen('php://output', 'w');
foreach($data->dirs as $key=>$stat){
$quiz=getStats($stat,$statsNetID);
$delim=",";
if ($key === array_key_last($data->dirs)) {
$delim="";
}

if ($key === array_key_first($data->dirs)) {
fputcsv($f,array_merge($quizDataHeaders,$viewerDataHeaders));
}
foreach($quiz->viewerData as $viewer){
$line=[];
foreach($quizDataHeaders as $quizDataHeader){
$line[]=json_encode($quiz->quizData->{$quizDataHeader});
}
foreach($viewerDataHeaders as $viewerDataHeader){
$line[]=json_encode($viewer->{$viewerDataHeader});
}
      fputcsv($f,$line);

}
}
