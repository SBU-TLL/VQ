<?php
$vtt="media/video.vtt";   
$output="";
if (file_exists($vtt)){
$output=file_get_contents($vtt);
}
else if (file_exists("media/autosub.en.vtt")) 
{
$output=file_get_contents("media/autosub.en.vtt");
}
print $output;
