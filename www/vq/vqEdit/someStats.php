<?php
header('Content-disposition: attachment; filename='.date('m-d-Y-h:i:s-a', time()).'.csv');
header('Content-type: text/csv');
$startingRow=$_GET['startingRow'] ?: 1;
$endingRow=$_GET['endingRow'] ?: PHP_INT_MAX;
$quizDataHeaders=['videoPath'];
$viewerDataHeaders=['watchData', 'netID', 'bestScore', 'lastAccessDate', 'completeDate'];
$statsNetID="wtang";
$allStats=[];
require("./login.php");
require("./getQuizStats.php");
$data=json_decode(login($statsNetID));
$f = fopen('php://output', 'w');
$rowID=1;
foreach($data->dirs as $key=>$stat){
	
			if ($key === array_key_first($data->dirs) && $startingRow==1) {
				fputcsv($f,array_merge($quizDataHeaders,$viewerDataHeaders));
			}
	$quiz=getStats($stat,$statsNetID);
	foreach($quiz->viewerData as $index=>$viewer){

		if($rowID>=$startingRow && $rowID<=$endingRow){

			$line=[];
			foreach($quizDataHeaders as $quizDataHeader){
				$line[]=str_replace("/media/video.mp4","",$quiz->quizData->{$quizDataHeader});
			}
			foreach($viewerDataHeaders as $viewerDataHeader){
				$line[]=json_encode(str_replace("@stonybrook.edu","",$viewer->{$viewerDataHeader}));
			}
			fputcsv($f,$line);
		}

		$rowID++;
	}


}
