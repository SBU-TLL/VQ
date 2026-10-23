<?php

	/*
		Date:	Fall 2017
		Author:	Anthony John Ripa
	*/
	
	require_once ('Scanner.php');

	class Root {
		function get() {
			$sc = new Scanner(__DIR__);
			$root = $sc->find('htdocs');
			$projroot = $root - 1;
			return str_repeat('../', $projroot);
		}
		function getUsers() {
			return self::get() . 'users/';
		}
	}

?>
