<?php

if (!array_key_exists('lis_result_sourcedid',$_POST['data'])) { print 'In lti\test\index.php : No ID<br>'; print_r($_POST); die(); }

$ses = array('fname'=>$_POST['data']['lis_person_name_given'], 'lname'=>$_POST['data']['lis_person_name_family'], 'id'=>$_POST['data']['lis_result_sourcedid'], 'url'=>$_POST['data']['lis_outcome_service_url']);

#

include 'php/message.php';
include 'php/OAuthBody.php';
$id = $ses['id'];
$url = $ses['url'];
$grade = rand(0,100)/100;


print sendOAuthBodyPOST("POST", $url, "anythingKey", "anythingSecret", "application/xml", message($id, $grade));

?>
