<?php
if (!function_exists("file_get_json")){
function file_get_json($jsonPath) {
	if (file_exists($jsonPath)) {
		$json = file_get_contents($jsonPath);
	}
	else {
		$json = "{}";
	}
	return json_decode($json);
}
}