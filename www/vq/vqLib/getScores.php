<?php
	print getScores("ralessi","tjoleary");

	function getScores($vqNetId, $userNetId){

		function rsearch($folder, $pattern) {
			$matches = array();
			$iti = new RecursiveDirectoryIterator($folder);
			foreach(new RecursiveIteratorIterator($iti) as $file) {
				if(strpos($file, $pattern) !== false) {
					$matches[] = $file->getPathname();
				}
			}
			return $matches;
		}
		
		$ivqs = array();
		$files = rsearch("../users/$vqNetId/", $userNetId);
		foreach($files as $file) {
			$quiz = json_decode("{}");
			$quizNum = preg_filter('/.*\/(\d+)\/.*/','\1', $file);
			$quizFile = "../users/$vqNetId/$quizNum/json/quiz.json";
			$quizInfo = json_decode(file_get_contents($quizFile));
			$quiz->title = $quizInfo->title;
			if(key_exists("duration", $quizInfo)) {
				$quiz->duration = $quizInfo->duration;
			}

			$string = file_get_contents($file);
			$json = json_decode($string);
			if(key_exists("completeDate", $json)) {
				$quiz->completeData = $json->completeDate;
				$quiz->watchData = $json->watchData;
			}
			$ivqs[] = $quiz;
		}
		return json_encode($ivqs);
	}

?>
