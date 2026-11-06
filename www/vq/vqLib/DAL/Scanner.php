<?php

	/*
		Date:	Fall 2017
		Author:	Anthony John Ripa
	*/

	class Scanner {
		public function Scanner($str) { $this->tokens = explode('/',$str); }
		public function get0() { return $this->tokens[0]; }
		#public function get() { return end($this->tokens); }
		public function gets0() { return $this->tokens; }
		public function gets() { return array_reverse($this->tokens); }
		public function find0($token) { return array_search($token, $this->gets0()); }
		public function find($token)  { return array_search($token, $this->gets()); }
		public function __call($name, $arguments) {
			if ($name==='get') return end($this->tokens);
		}
		public static function __callStatic($name, $arguments) {
			$exp=explode('/',$arguments[0]);
			if ($name==='get') return end($exp);
		}
	}
	
?>
