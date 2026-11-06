<?php

	/*
		Date:	Fall 2017
		Author:	Anthony John Ripa
	*/

	require_once ('Dir.php');
	require_once ('Scanner.php');
	
	ini_set('memory_limit','1G');

	class DBAL {
		
		/*	Public Functions (All Called by index.php) */

			function Quiz__Author_Quizid($a, $q) { return self::Data__Author_Quizid_Fname($a, $q, 'json/quiz.json'); }
			function Perm__Author_Quizid($a, $q) { return self::Data__Author_Quizid_Fname($a, $q, 'json/permissions.json'); }
			function Filter__Author_Quizid($a, $q) { return self::Data__Author_Quizid_Fname($a, $q, 'json/filters.json'); }
			function VTT__Author_Quizid($a, $q) { return self::Data__Fnames(array("$a/$q/media/video.vtt", "$a/$q/media/autosub.en.vtt")); }
		
			function Perm_Author_Quizid($d, $a, $q) { return self::Data_Author_Quizid_Fname($d, $a, $q, 'json/permissions.json'); }
			function Quiz_Author_Quizid($d, $a, $q) { return self::Data_Author_Quizid_Fname($d, $a, $q, 'json/quiz.json'); }
			
			function Author() { return $_SERVER['cn']; }

			//	Called by DAL::Authors__QuizCount
			//	Called by DAL::Consumers__Author
			//	Called by DAL::Quiz__Author
			function Quizids__Author($author) {
				if ($author === 'me') $author = $_SERVER['cn'];
				//static $quizids; if (isset($quizids[$author])) return $quizids[$author];											//	cache
				$dirs = array_filter(glob(Dir::db() . "$author/*"),'is_dir');
				$quizids[$author] = array_map('Scanner::get', $dirs);
				sort($quizids[$author]);
				return $quizids[$author];
			}

		/*	Protected Functions (All Called by DAL) */

			//	Called by DAL::Video__Quizid
			protected function Video__Author_Quizid($a, $q) { if($a==='me') $a = $_SERVER['cn']; return "../$a/$q/media/video.mp4"; }

			//	Called by DAL::Authors__QuizCount
			protected function Authors() {
				//static $authors; if ($authors) return $authors;																		//	cache
				$dirs = array_filter(glob(Dir::db() . '*'), 'is_dir');
				$authors = array_map('Scanner::get', $dirs);
				sort($authors);
				return $authors;
			}
			
			//	Called by DAL::Consumers__Author
			protected function Consumers__Author_Quizid($author, $quizid) {
				//static $consumers; if (isset($consumers[$author . $quizid])) return $consumers[$author . $quizid];				//	cache
				$dirs = array_filter(glob(Dir::db() . "$author/$quizid/data/*"), 'is_file');
				$consumers[$author . $quizid] = array_map('Scanner::get', $dirs);
				sort($consumers[$author . $quizid]);
				return $consumers[$author . $quizid];
			}
			
			//	Called by DAL::UsageLen__Author_Quizid_Consumer
			protected function Usage__Author_Quizid_Consumer($author, $quizid, $consumer) {
				//static $usage; if (isset($usage[$author . $quizid . $consumer])) return $usage[$author . $quizid . $consumer];	//	cache
				if ($consumer === 'me') $consumer = $_SERVER['cn'];
				$fname = Dir::db() . "{$author}/$quizid/data/$consumer";
				if (!file_exists($fname)) return NULL;
				$usage[$author . $quizid . $consumer] = json_decode(file_get_contents($fname), true);
				return $usage[$author . $quizid . $consumer];
			}
			
			//	Called by DAL::UsageLen__Author
			protected function setCache($key, $value) { 
			#file_put_contents(Dir::cache() . "/$key.txt", $value); 
			}
			
			//	Called by DAL::UsageLen__Author
			protected function getCache($key) {
				$path = Dir::cache() . "/$key.txt";
				if (!file_exists($path)) return False;
				return file_get_contents($path);
			}
		
		/* Private Functions (All Called by DBAL or uncalled) */
		
			//	Called by self::Data__Fnames
			//	Called by self::Data__Author_Quizid_Fname
			private function Data__Fname($filename) {
				$fullname = Dir::db() . $filename;
				if (!file_exists($fullname)) return '';
				return file_get_contents($fullname);
			}
			
			//	Called by self::VTT__Author_Quizid
			private function Data__Fnames($filenames) {
				foreach ($filenames as $filename) {
					$data = self::Data__Fname($filename);
					if ($data) return $data;
				}
				return $data;
			}

			//	Called by self::Quiz__Author_Quizid
			//	Called by self::Perm__Author_Quizid
			//	Called by self::Filter__Author_Quizid
			private function Data__Author_Quizid_Fname($author, $quizid, $fname) { return self::Data__Fname("$author/$quizid/$fname"); }
			
			//	Called by self::Perm_Author_Quizid
			//	Called by self::Quiz_Author_Quizid
			public function Data_Author_Quizid_Fname($data, $author, $quizid, $fname) {
				$fullname = Dir::db() . "{$author}/{$quizid}/{$fname}";
				$success = file_put_contents($fullname, $data);
				return $success ? 'Data saved' : 'Data not saved';
			}
			
			//	Called by Orphan DAL::QuizLen__Author_Quizid
			private function QuizLen__Author_Quizid($author, $quizid) {
				$fname = Dir::db() . "{$author}/{$quizid}/media/video.mp4";
				// https://askubuntu.com/questions/224237/how-to-check-how-long-a-video-mp4-is-using-the-shell
				$duration = exec("/usr/local/bin/ffmpeg -i $fname 2>&1 | grep Duration | cut -d ' ' -f 4 | sed s/,//");
				return $duration;
			}
		
	}

?>
