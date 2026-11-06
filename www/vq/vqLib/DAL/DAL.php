<?php

	/*
		Date:	Fall 2017
		Author:	Anthony John Ripa
	*/

	require_once ('DBAL.php');
	
	class DAL extends DBAL {
	
		/*	Public Functions (All Called by index.php) */

			public function Video__Quizindex($qindex) {
				return self::Video__Quizid(DAL::Quizid__Quizindex($qindex));
			}

			//	Called by DAL::Video__Quizindex
			public function Quizid__Quizindex($qindex) {
				$ret = self::Quizids();
				return 0<=$qindex && $qindex<count($ret) ? $ret[$qindex] : ''; 
			}
			
			public function Quizs() {
				$ret = array();
				foreach(DAL::Authors__QuizCount(3) as $author) {
					$ret[$author]= self::Quizs__Author($author);
				}
				return $ret;
			}
			
			public function getUsageLen__Author($author) {
				if ($author === 'me') $author = $_SERVER['cn'];
				$cache = DBAL::getCache("consumption/$author");
				if (True || $cache) return $cache;
				$ret = DAL::UsageLen__Author($author);
				return $ret;
			}
		
			public function Quiz__Author_Quizid($author, $quizid) {
				$quiz = json_decode(DBAL::Quiz__Author_Quizid($author, $quizid));
				$quiz->quizid = $quizid;
				$quiz->title = isset($quiz->title) ? $quiz->title : 'NoName';
				$quiz->duration = isset($quiz->duration) ? $quiz->duration : 0;
				return $quiz;
				#$duration = isset($quiz->duration) ? $quiz->duration : 0;
				#$title = isset($quiz->title) ? $quiz->title : 'NoName';
				#return json_decode('{"quizid":"' . $quizid . '" , "title":"' . $title . '" , "duration":"' . $duration . '"}');
			}
		
			//	Called by DAL::Quizs
			public function Authors__QuizCount($n) {
				$ret = array();
				$allAuthors = DBAL::Authors();
				for ( $i = 0 ; $i < count($allAuthors) ; $i++ ) {
					if (count(DBAL::Quizids__Author($allAuthors[$i])) >= $n)
						$ret []= $allAuthors[$i];
				}
				return $ret;
			}

			//	Called by DAL::getUsageLen__Author	
			public function UsageLen__Author($author) {
				if ($author === 'me') $author = $_SERVER['cn'];
				#session_save_path('temp'); session_start();
				#if (isset($_SESSION[$author])) return $_SESSION[$author];
				#$ret = array('id'=>array(),'data'=>array());
				$idsdata = self::UsageLenJSON__Author($author);
				$ids = $idsdata['id'];
				$data = $idsdata['data'];#return json_encode($idsdata);
				$ret = '';
				for($i=0; $i<count($ids); $i++) {
					$ret = $ret . $ids[$i] . ',' . array_sum($data[$i]['data']) . "\n";
				}
				#$_SESSION[$author] = $ret;
				$ret = trim($ret);
				DBAL::setCache("consumption/$author",$ret);
				return $ret;
			}
		
			//	Called by DAL::UsageLen__Author	
			public function UsageLen__Author_Consumer($author, $consumer) {
				#$ret = 0;
				#$ret = array();
				#$ret = new ArrayObject();
				$ret = array('id'=>array(),'data'=>array());
				foreach(DBAL::Quizids__Author($author) as $quizid) {
					$usagelen = self::UsageLen__Author_Quizid_Consumer($author, $quizid, $consumer);
					#$ret+= $usagelen;
					$ret['id'][] = $quizid ;
					$ret['data'][] = $usagelen ;
					#if ($usagelen>0) $ret[$quizid] = $usagelen ;
				}
				return $ret;
			}
		
		/*	Protected Functions (All Called by DAL) */

			//	Called by DAL::Quizid__Quizindex
			protected function Quizids() {
				return DBAL::Quizids__Author('me');
			}

			//	Called by DAL::Video__Quizindex
			protected function Video__Quizid($quizid) {
				return DBAL::Video__Author_Quizid('me', $quizid);
			}

			//	Called by DAL::Quizs
			protected function Quizs__Author($author) {
				$ret = array();
				foreach(DBAL::Quizids__Author($author) as $quizid) {
					$ret []= DAL::Quiz__Author_Quizid($author, $quizid);
				}
				return $ret;
			}
			
			//	Called by DAL::UsageLen__Author_Consumer	
			protected function UsageLen__Author_Quizid_Consumer($author, $quizid, $consumer) {
				$usage = DBAL::Usage__Author_Quizid_Consumer($author, $quizid, $consumer);
				if ($usage === NULL) return 0;
				$watchData = $usage['watchData'];
				if (count($watchData) === 0) return 0;
				return array_sum($watchData);
				#$percent = array_sum($watchData) / count($watchData);
				#$duration = DAL::getQuizLen__Author_Quizid($author, $quizid);
				#return round($percent * $duration);
			}

			//	Called by DAL::UsageLenJSON__Author	
			protected function Consumers__Author($author) {
				$ret = array();
				foreach(DBAL::Quizids__Author($author) as $quizid)
					$ret = array_merge($ret, DBAL::Consumers__Author_Quizid($author, $quizid));
				sort($ret);
				return array_values(array_unique($ret));
			}
			
			//	Called by DAL::UsageLen__Author	
			protected function UsageLenJSON__Author($author) {
				if ($author === 'me') $author = $_SERVER['cn'];
				//session_save_path('temp'); session_start();
				//if (isset($_SESSION[$author])) return $_SESSION[$author];
				$ret = array('id'=>array(),'data'=>array());
				foreach(self::Consumers__Author($author) as $consumer) {
					array_push($ret['id'] , $consumer );
					array_push($ret['data'] , DAL::UsageLen__Author_Consumer($author, $consumer) );
					#$ret[$consumer]= DAL::UsageLen__Author_Consumer($author, $consumer);
				}
				#$_SESSION[$author] = $ret;
				return $ret;
			}
		
		/* Private Functions (All Orphans or Called by Orphans) */
		
			//	Orphan. Previously called by DAL::UsageLen__Author_Quizid_Consumer
			private function getQuizLen__Author_Quizid($author, $quizid) {
				$cache = DBAL::getCache("duration/$author$quizid");
				if ($cache) return $cache;
				$ret = self::QuizLen__Author_Quizid($author,$quizid);
				return $ret;
			}

			//	Called by Orphan DAL::getQuizLen__Author_Quizid
			private function QuizLen__Author_Quizid($author, $quizid) {
				$duration = DBAL::QuizLen__Author_Quizid($author, $quizid);
				$ret = strtotime("1970-01-01 $duration UTC");
				DBAL::setCache("duration/$author$quizid",$ret);
				return $ret;
			}
			
	}

?>
