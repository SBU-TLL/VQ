<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL & E_WARNING);
$author = $_REQUEST['author'];
$oldEditor = $_REQUEST['oldEditor'];
$newEditor = $_REQUEST['newEditor'];
$scriptPath =preg_split("/\//",realpath(dirname(__FILE__)));
array_pop($scriptPath);
$scriptPath = implode ("/",$scriptPath);
$path="../users";
print($scriptPath);
if ($author == $_SERVER['cn'] && $oldEditor != $newEditor) {
	$sourcePath = $_REQUEST['sourcePath'];
	$oldCode = $_REQUEST['oldCode'];
	$newCode = $_REQUEST['newCode'];
	// First, remove the old copy (if it exists)
	if ($oldCode != "" && $oldEditor != "vqEdit") {
		if (file_exists("$path/$oldEditor")) {
			if (file_exists("$path/$oldEditor/$oldCode")) {
				$shell="rm $path/$oldEditor/$oldCode";
				print $shell;
				`$shell`;
				print("Removed successfully");
			}
			else {
				print("Could not remove");
			}
		}
		else {
			print("Could not remove");
		}
	}
	// Next, make the new copy
	if ($newCode != "" && $newEditor != "vqEdit") {
		if (!file_exists("$path/$newEditor")) {
			mkdir("$path/$newEditor",0777);
			print("$path/$newEditor");
		}
		print("$path/$author/$sourcePath  $path/$newEditor/$newCode");
		if(!symlink("$scriptPath/users/$author/$sourcePath","$scriptPath/users/$newEditor/$newCode")){

			print "failed";
		};
		$createLink="$scriptPath/createLink.sh $author $newEditor $sourcePath $newCode";
		//print $createLink;
		//$a= `$createLink`;
	//	print $a;
	}
}
?>
