<?php
require("injectUserPath.php");
$qp = injectUserPathN($_REQUEST['quizPath'],4);
#print $qp;
if (file_exists($qp)) {
    print(json_encode(file_get_contents($qp)));	//	oddly doubly json encoded	Tony
}
else {
    print(json_encode("{}"));
}
?>
