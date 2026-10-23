<?php
	if (!function_exists("injectUserPathN")){
		function injectUserPathN($url, $n) {
			if(strstr($url, "users")) return $url;
			$url = rtrim($url, "/");
			$url = array_reverse(explode("/", $url));
			array_splice($url, $n, 0, "users");
			return implode("/", array_reverse($url));
		}
	}
	if (!function_exists("injectUserPath")){
	
	function injectUserPath($url) {	return injectUserPathN($url, 2); }
	}
?>
