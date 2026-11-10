<?php

	#	Date:		Fall 2017
	#	Authors:	Paul St. Denis
	#				Anthony John Ripa

	
function sort3(&$a, &$b, &$c) {
	for ($i = 0; $i < count($a); $i++)
		for ($j = $i; $j < count($a); $j++)
			if ($a[$i] > $a[$j]) {
				list($a[$i],$a[$j]) = array($a[$j],$a[$i]);
				list($b[$i],$b[$j]) = array($b[$j],$b[$i]);
				list($c[$i],$c[$j]) = array($c[$j],$c[$i]);
			}	
}	
	
$blackList = array("vqEdit","vqList");
chdir("../users/");
$allVQ = array();
foreach(glob("*") as $userDir)	# Loop over users
{
	if(!in_array($userDir,$blackList) && is_dir($userDir))
	{
		chdir($userDir);
		#$vqList= array();
		$number = array();
		$title = array();
		$duration = array();
		foreach(glob("*") as $vqDir)	#	Loop over this user's videos
		{
			if(is_numeric($vqDir))
			{
				$permissionsFile="$vqDir/json/permissions.json";
				$infoFile="$vqDir/json/quiz.json";
				if(file_exists($permissionsFile))
				{
        
					$permissions=json_decode(file_get_contents($permissionsFile));
					if(!key_exists("isPrivate",$permissions) || $permissions->isPrivate!="false")
					{
						if (file_exists($infoFile)) {
							$info = json_decode(file_get_contents($infoFile));
							array_push($number,(int)$vqDir);
							array_push($title,isset($info->title)?$info->title:'');
							array_push($duration,isset($info->duration)?$info->duration:'');
						};
						#if(key_exists("duration",$info)){
						#	//$quiz["duration"]=$info->duration;
						#	array_push($duration,$info->duration);
						#}
						//$quiz["title"]=$info->title;
						//$quiz["number"]=(int)$vqDir;
						//array_push($vqList,$quiz);	
					}
				}
				else { file_put_contents($permissionsFile,"{}");}	
			}
		}
		//array_push($vqList,$number);
		//array_push($vqList,$title);
		//array_push($vqList,$duration);
		sort3($number, $title, $duration);
		if(count($number)>2)
		{
			$vqList = array ();
			$vqList['number']=$number;
			$vqList['title']=$title;
			$vqList['duration']=$duration;
			#sort($vqList);
			$allVQ[$userDir]=$vqList;
		}


		chdir("../");
	}
}
print(json_encode($allVQ));
?>
