<?php

	/*
		Date:	Fall 2017
		Author:	Anthony John Ripa
	*/
	
	
	
	#require_once ('Authors.php');
	#require_once ('Consumers.php');
	#require_once ('Duration.php');
	require_once ('DAL.php');

	#if (isset($_GET['temp'])) { echo '<pre>'; echo DAL::UsageLen__Author('me'); exit(); }
	
	$author  = isset($_GET['author'])  ? $_GET['author']  : NULL;
	$quizid = isset($_GET['quizid']) ? $_GET['quizid'] : NULL;
	$quizindex = isset($_GET['quizindex']) ? $_GET['quizindex'] : NULL;
	$consumer = isset($_GET['consumer']) ? $_GET['consumer'] : NULL;
	$json = isset($_GET['json']);
	$duration = isset($_GET['duration']);
	$new = isset($_GET['new']);
	$vtt = isset($_GET['vtt']);
	$quizids = isset($_GET['quizids']);
	$quizs = isset($_GET['quizs']);
	$quiz = isset($_REQUEST['quiz']) ? $_REQUEST['quiz'] : NULL;
	$permission = isset($_GET['permission']) ? $_GET['permission'] : NULL;
	$filter = isset($_GET['filter']);
	$video = isset($_GET['video']);

	if ($author) {
		#$durationObj = new Duration($author);
		if ($quizid) {
			if ($vtt) { header('Content-type: text/vtt'); exit(DBAL::VTT__Author_Quizid($author, $quizid)); }	//	Called by jpinst.js
			#else if ($quizid && $consumer) $response = $durationObj->getByQuiznumAndConsumer($quizid, $consumer);
			elseif ($consumer) $response = DAL::UsageLen__Author_Quizid_Consumer($author, $quizid, $consumer);
			#else if ($quizid && $duration) $response = $durationObj->getByQuiznum($quizid);
			else if ($duration) $response = DAL::QuizLen__Author_Quizid($author, $quizid);
			#else if ($quizid && $duration) $response = DAL::QuizLen__Author_Quizid($author, $quizid);
			else if ($permission) exit(DBAL::Perm_Author_Quizid($permission, $author, $quizid));		//	Called by quiz_io.js
			else if (isset($_GET['permission'])) exit(DAL::Perm__Author_Quizid($author, $quizid));		//	Called by quiz_io.js
			else if ($filter) exit(DAL::Filter__Author_Quizid($author, $quizid));						//	Called by quiz_io.js
			else if ($quiz) exit(DAL::Quiz_Author_Quizid($quiz, $author, $quizid));						//	Called by quiz_io.js
			else if (isset($_GET['consumer'])) $response = DAL::Consumers__Author_Quizid($author, $quizid);
			#else if ($quizid && isset($_GET['consumer'])) $response = Consumers::get($author, $quizid);
			else $response = DAL::Quiz__Author_Quizid($author, $quizid);	//	Called by quiz_io.js
		}
		#else if ($consumer) $response = $durationObj->getByConsumer($consumer);			//	Called by progress.js
		else if ($consumer) $response = DAL::UsageLen__Author_Consumer($author, $consumer);	//	Called by progress.js
		else if ($json) $response = DAL::UsageLenJSON__Author($author);
		else if ($duration) exit(DAL::UsageLen__Author($author));
		else if (isset($_GET['consumer'])) $response = DAL::Consumers__Author($author);
		#else $response = Quiznums::get($author);
		else if ($quizs) $response = (DAL::Quizs__Author($author));
		else if ($quizids) $response = (DAL::Quizids__Author($author));	//	Called by vqEdit/js/script.js
		else if ($new) exit(DAL::UsageLen__Author($author));			//	Called by progress2.js
		else exit(DAL::getUsageLen__Author($author));					//	Called by progress2.js
		#else $response = DAL::Quizids__Author($author);
	}
	#else if (isset($_GET['author'])) $response = Authors::withAtLeastNQuizs(3);
	else if (isset($_GET['authors'])) $response = DAL::Authors__QuizCount(3);						//	Called by progress.js
	else if (isset($_GET['author'])) exit(DAL::Author());
	else if ($quizindex!='' && isset($_GET['quizid'])) exit(DAL::Quizid__Quizindex($quizindex));
	else if ($quizindex!='' && isset($_GET['video'])) exit(DAL::Video__Quizindex($quizindex));		//	Called by quiz_io.js
	else $response = DAL::Quizs();																	//	Called by vqLib/js/script.js
	#else $response = DAL::Authors();
	
	echo json_encode($response);
	
?>
