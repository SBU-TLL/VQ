<?php
//ob_start();
$allStats=[];
require("./login.php");
require("./getQuizStats.php");
//ob_end_clean();
$data=json_decode(login());
#print_r($data->dirs);
foreach($data->dirs as $stat){
array_push($allStats,getStats($stat));
}
//print_r($allStats);

header('Content-disposition: attachment; filename='.date('m-d-Y-h:i:s-a', time()).'.json');
header('Content-type: application/json');
print(json_encode($allStats));
