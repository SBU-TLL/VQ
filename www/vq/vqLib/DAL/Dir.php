<?php

	/*
		Date:	Fall 2017
		Author:	Anthony John Ripa
	*/
	
	require_once ('Scanner.php');

	class Dir {
		function root() {
			$sc = new Scanner(__DIR__);
			$root = $sc->find('htdocs');
			$projroot = $root - 1;
			return str_repeat('../', $projroot);
		}
		function db() {
			return self::root() . 'users/';
		}
		
		//	Called by DBAL::setCache
		function cache() {
			return 'cache';
		}
	}

?>
